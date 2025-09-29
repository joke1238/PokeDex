import { InterfaceItems } from '@renderer/interface/items'
import apiItems from '@renderer/assets/data/apiItems.json'
import berries from '@renderer/assets/data/item/item-berry.json'
import cosmetics from '@renderer/assets/data/item/item-cosmetic.json'
import items from '@renderer/assets/data/item/item.json'
import itemsData from '@renderer/assets/data/item/item_lookup.json'

// --------- 类型定义 ---------
export interface ApiItem {
  apiID: number | string
  id: number | string
}

export interface CosmeticItem {
  item_id: number
  [key: string]: any
}

export interface BerryItem {
  item_id: number
  [key: string]: any
}

export interface Item {
  id: number | string
  [key: string]: any
}

export interface ItemDataEntry {
  name: Record<string, string>
  description: Record<string, string>
}


// --------- 默认服装 ---------
export const DEFAULT_CLOTHES: Record<string, number> = {
  "1": 0,
  "2": 0,
  "3": 1183,
  "4": 1441,
  "5": 1322,
  "6": 0,
  "7": 1323,
  "8": 0,
  "9": 1327,
  "10": 1316,
  "11": 0,
  "12": 0
}

// --------- 工具函数 ---------
export const getCosmeticSetupImage = (cosmeticsOverride: Record<string, number>) => {
  const selectedClothes = { ...DEFAULT_CLOTHES, ...cosmeticsOverride }

  const scenes: {
    name: string
    url: string
    hasFollower: boolean
  }[] = []

  for (const key in InterfaceItems.sceneCosmeticParam) {
    if (Object.prototype.hasOwnProperty.call(InterfaceItems.sceneCosmeticParam, key)) {
      const scene = InterfaceItems.sceneCosmeticParam[key]
      scenes.push({
        name: scene,
        url: `https://apis.fiereu.de/pokemmoclothes/v1/${key}/2/1/${selectedClothes[6]}/${selectedClothes[12]}/${selectedClothes[4]}/${selectedClothes[5]}/${selectedClothes[8]}/${selectedClothes[3]}/${selectedClothes[2]}/${selectedClothes[10]}/${selectedClothes[9]}/${selectedClothes[7]}.png`,
        hasFollower: scene === 'Back' || scene === 'Front' || scene === 'Side'
      })
    }
  }
  return scenes
}

export const getItemInfo = (id: number | string): Item | undefined => {
  return items.find(item => parseInt(item.id as string) === parseInt(id as string))
}

export const getPokemmoID = (apiId: number | string): number | false => {
  const item = (apiItems as ApiItem[]).find(item => parseInt(item.apiID as string) === parseInt(apiId as string))
  if (!item) return false
  return Number(item.id)
}

export const getCosmeticInfo = (id: number): CosmeticItem | false => {
  const item = (cosmetics as CosmeticItem[]).find(({ item_id }) => parseInt(item_id.toString()) === id)
  return item || false
}

export const getBerryInfo = (id: number): BerryItem | false => {
  const item = (berries as BerryItem[]).find(({ item_id }) => parseInt(item_id.toString()) === id)
  return item || false
}

export const getApiID = (id: number | string): number | false => {
  const item = (apiItems as ApiItem[]).find(item => parseInt(item.id as string) === parseInt(id as string))
  if (!item) return false
  return Number(item.apiID)
}

// --------- 新 API ---------
const dummyText: Record<string, string> = {
  "en": "Item Error - Fix In Progress",
  "cn": "Item Error - Fix In Progress",
  "de": "Item Error - Fix In Progress",
  "fr": "Item Error - Fix In Progress",
  "it": "Item Error - Fix In Progress",
  "es": "Item Error - Fix In Progress",
  "ja": "Item Error - Fix In Progress",
  "tw": "Item Error - Fix In Progress"
}

export const getItemName = (id: number | string): Record<string, string> => {
  const item = (itemsData as Record<string, ItemDataEntry>)[id.toString()]
  if (!item) return dummyText
  return item.name
}

export const getItemDescription = (id: number | string): Record<string, string> => {
  const item = (itemsData as Record<string, ItemDataEntry>)[id.toString()]
  if (!item) return dummyText

  const cleanedDescription: Record<string, string> = {}
  for (const [lang, text] of Object.entries(item.description)) {
    cleanedDescription[lang] = text.replace(/\\n/g, ' ')
  }
  return cleanedDescription
}
