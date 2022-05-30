export function isAddress(value?: string | null) {
  return !!value && /^0x[a-fA-F0-9]{40}$/.test(value)
}

export const isAddressZero = (addr: string) => {
  return /^0x(0)+$/.test(addr)
}

// export const isERC1155 = (addr: string) => {
//   return '0x68b1d87f95878fe05b998f19b66f4baba5de1aed' === addr
// }
