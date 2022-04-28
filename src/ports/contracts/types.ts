import { Contract, ContractFilters } from '@yanrongxing/schemas'

export interface IContractsComponent {
  fetch(filters: ContractFilters): Promise<Contract[]>
}
