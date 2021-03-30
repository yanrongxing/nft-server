import { INFTSourceComponent, NFTOptions, NFTSourceOptions } from './types'
import { getVariables } from './utils'

export function createNFTSourceComponent<T>(
  options: NFTSourceOptions<T>
): INFTSourceComponent {
  const { subgraph, getQuery, getOrderBy, fromFragment } = options
  return {
    fetch: async (options: NFTOptions) => {
      const query = getQuery(options)
      const variables = getVariables(options, getOrderBy)
      const { nfts: fragments } = await subgraph.query<{
        nfts: T[]
      }>(query, variables)
      const nfts = fragments.map(fromFragment)
      return nfts
    },
  }
}