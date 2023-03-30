export interface AddGameBody {
  name: string
  price: number
  categoryName: string
  gameInfo: string
  isAvailable: boolean | 'true' | 'false'
}
