// imgDreamMap.ts
export const itemImgMap = import.meta.glob('@renderer/assets/data/images/item/*.png', { eager: true });

const itemImgUrls: Record<string, string> = {};

// 预处理，把文件名映射到实际 URL
for (const path in itemImgMap) {
  // 例如 path = '/src/assets/data/images/item/001Bulbasaur_Item.png'
  const parts = path.split('/');
  const fileName = parts[parts.length - 1]; // '001Bulbasaur_Item.png'
  // @ts-ignore
  itemImgUrls[fileName] = itemImgMap[path].default;
}

/**
 * 同步获取道具图片 URL
 * @param name 文件名，例如 '001Bulbasaur_Item.png'
 */
const getItemImgMap = (name: string): string | undefined => {
  console.log(itemImgMap);
  return itemImgUrls[name+'.png'];
};

export default getItemImgMap;
