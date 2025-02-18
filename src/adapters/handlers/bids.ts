import { BidSortBy, ListingStatus, Network } from '@yanrongxing/schemas'
import { IHttpServerComponent } from '@well-known-components/interfaces'
import { Params } from '../../logic/http/params'
import { asJSON } from '../../logic/http/response'
import { AppComponents, Context } from '../../types'

export function createBidsHandler(
  components: Pick<AppComponents, 'logs' | 'bids'>
): IHttpServerComponent.IRequestHandler<Context<'/bids'>> {
  const { bids } = components

  return async (context) => {
    const params = new Params(context.url.searchParams)

    const first = params.getNumber('first')
    const skip = params.getNumber('skip')
    const sortBy = params.getValue<BidSortBy>('sortBy', BidSortBy)
    const bidder = params.getAddress('bidder')
    const seller = params.getAddress('seller')
    const bidAddress = params.getAddress('bidAddress')
    const contractAddress = params.getAddress('contractAddress')
    const tokenId = params.getString('tokenId')
    const status = params.getValue<ListingStatus>('status', ListingStatus)
    const network = params.getValue<Network>('network', Network)

    return asJSON(() =>
      bids.fetchAndCount({
        first,
        skip,
        sortBy,
        bidder,
        seller,
        bidAddress,
        contractAddress,
        tokenId,
        status,
        network,
      })
    )
  }
}
