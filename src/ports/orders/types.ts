import { ListingStatus, Order, OrderFilters } from '@yanrongxing/schemas'

export interface IOrdersComponent {
  fetch(filters: OrderFilters): Promise<Order[]>
  count(filters: OrderFilters): Promise<number>
}

export type OrderFragment = {
  id: string
  marketplaceAddress: string
  nftAddress: string
  owner: string
  buyer: string | null
  price: string
  quantity: string
  status: ListingStatus
  expiresAt: string
  createdAt: string
  updatedAt: string
  nft: {
    tokenId: string
  }
}
