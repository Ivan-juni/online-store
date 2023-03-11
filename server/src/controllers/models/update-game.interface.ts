export interface IUpdateGame {
  price?: number | string
  gameInfo?: {
    title: string
    description: string
  }
  image?: string
  isAvailable?: boolean | string
}
