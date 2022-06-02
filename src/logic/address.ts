export function isAddress(value?: string | null) {
  return !!value && /^0x[a-fA-F0-9]{40}$/.test(value)
}

export const isAddressZero = (addr: string) => {
  return /^0x(0)+$/.test(addr)
}
const ERC1155_LOCAL = '0x610178da211fef7d417bc0e6fed39f05609ad788'
const ERC1155_MATIC = '0x31f325A9D4E7e8E8A2E8b3f4a2eD20Fc4E907133'
const ERC1155_ADDREDSS = [ERC1155_LOCAL,ERC1155_MATIC]
export const isERC1155 = (addr: string) => {
  return ERC1155_ADDREDSS.indexOf(addr) > 0
}

