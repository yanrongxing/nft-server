import { NFTFilters, NFTSortBy } from '@yanrongxing/schemas'
import { ISubgraphComponent } from '../subgraph/types'
import { INFTsComponent, NFTResult } from './types'
import { getFetchOneQuery, getFetchQuery, getQueryVariables } from './utils'

export function createNFTComponent<T extends { id: string }>(options: {
  subgraph: ISubgraphComponent
  shouldFetch?: (options: NFTFilters) => boolean
  fragmentName: string
  getFragment: () => string
  fromFragment(fragment: T): NFTResult
  getSortByProp(sortBy?: NFTSortBy): keyof T
  getExtraVariables?: (options: NFTFilters) => string[]
  getExtraWhere?: (options: NFTFilters) => string[]
}): INFTsComponent {
  const {
    subgraph,
    shouldFetch,
    fragmentName,
    getFragment,
    getSortByProp,
    getExtraWhere,
    getExtraVariables,
    fromFragment,
  } = options

  function getFragmentFetcher(filters: NFTFilters) {
    return async (isCount?: boolean) => {
      const query = getFetchQuery(
        filters,
        fragmentName,
        getFragment,
        getExtraVariables,
        getExtraWhere,
        isCount
      )
      const variables = getQueryVariables(filters, getSortByProp)
      const { nfts: fragments } = await subgraph.query<{
        nfts: T[]
      }>(query, variables)
      
      return fragments
    }
  }

  async function fetch(options: NFTFilters) {
    if (shouldFetch && !shouldFetch(options)) {
      return []
    }


    if ((options.contractAddresses![0] !== '0x610178da211fef7d417bc0e6fed39f05609ad788' ) && options.tokenId && options.contractAddresses ) {
      const nft = await fetchOne(options.contractAddresses[0], options.tokenId)
      return nft ? [nft] : []
    }

    if ((options.contractAddresses![0] === '0x610178da211fef7d417bc0e6fed39f05609ad788' ) && options.tokenId && options.contractAddresses && options.owner ) {
      const nft = await fetchOne(options.contractAddresses[0], options.tokenId,options.owner)
      return nft ? [nft] : []
    }

    const fetchFragments = getFragmentFetcher(options)
    const fragments = await fetchFragments()
    const nfts = fragments.map(fromFragment)
    return nfts
  }

  async function count(options: NFTFilters) {
    if (shouldFetch && !shouldFetch(options)) {
      return 0
    }
    const fetchFragments = getFragmentFetcher(options)
    const fragments = await fetchFragments(true)
    return fragments.length
  }

  async function fetchOne(contractAddress: string, tokenId: string, owner?: string) {
    const query = getFetchOneQuery(fragmentName, getFragment,owner)
    const variables = {
      contractAddress,
      tokenId,
      owner
    }
    const { nfts: fragments } = await subgraph.query<{
      nfts: T[]
    }>(query, variables)
    if (fragments.length === 0) {
      return null
    } else {
      return fromFragment(fragments[0])
    }
  }

  return {
    fetch,
    count,
  }
}
