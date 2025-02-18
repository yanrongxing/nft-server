import {
  EmoteCategory,
  Network,
  NFTCategory,
  NFTSortBy,
  Rarity,
  WearableCategory,
  WearableGender,
} from '@yanrongxing/schemas'
import { IHttpServerComponent } from '@well-known-components/interfaces'
import { AppComponents, Context } from '../../types'
import { Params } from '../../logic/http/params'
import { HttpError, asJSON } from '../../logic/http/response'

export function createNFTsHandler(
  components: Pick<AppComponents, 'logs' | 'nfts'>
): IHttpServerComponent.IRequestHandler<Context<'/nfts'>> {
  const { nfts } = components
  return async (context) => {
    const params = new Params(context.url.searchParams)

    const first = params.getNumber('first')
    const skip = params.getNumber('skip')
    const sortBy = params.getValue<NFTSortBy>('sortBy', NFTSortBy)
    const category = params.getValue<NFTCategory>('category', NFTCategory)
    const owner = params.getAddress('owner')
    const isOnSale = params.getBoolean('isOnSale')
    const search = params.getString('search')
    const isLand = params.getBoolean('isLand')
    const isWearableHead = params.getBoolean('isWearableHead')
    const isWearableAccessory = params.getBoolean('isWearableAccessory')
    const isWearableSmart = params.getBoolean('isWearableSmart')
    const wearableCategory = params.getValue<WearableCategory>(
      'wearableCategory',
      WearableCategory
    )
    const wearableGenders = params.getList<WearableGender>(
      'wearableGender',
      WearableGender
    )
    const emoteCategory = params.getValue<EmoteCategory>(
      'emoteCategory',
      EmoteCategory
    )
    const emoteGenders = params.getList<WearableGender>(
      'emoteGender',
      WearableGender
    )
    const contractAddresses = params.getAddressList('contractAddress')
    const tokenId = params.getString('tokenId')
    const itemRarities = params.getList<Rarity>('itemRarity', Rarity)
    const itemId = params.getString('itemId')
    const network = params.getValue<Network>('network', Network)
    
    return asJSON(() =>
      nfts.fetchAndCount({
        first,
        skip,
        sortBy,
        category,
        owner,
        isOnSale,
        search,
        isLand,
        isWearableHead,
        isWearableAccessory,
        isWearableSmart,
        wearableCategory,
        wearableGenders,
        emoteCategory,
        emoteGenders,
        contractAddresses,
        tokenId,
        itemRarities,
        itemId,
        network,
      })
    )
  }
}

export function createNFTHandler(
  components: Pick<AppComponents, 'logs' | 'nfts'>
): IHttpServerComponent.IRequestHandler<
  Context<'/contracts/:contractAddress/tokens/:tokenId/:owner'>
> {
  const { nfts } = components
  return async (context) => {
    const { contractAddress, tokenId } = context.params

    return asJSON(async () => {
      const results = await nfts.fetch({
        contractAddresses: [contractAddress],
        tokenId,
      })

      if (results.length === 0) {
        throw new HttpError('Not Found', 404)
      }

      return results[0]
    })
  }
}
