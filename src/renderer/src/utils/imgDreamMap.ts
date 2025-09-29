// imgDreamMap.ts
export const dreamImgMap = import.meta.glob('@renderer/assets/data/images/dream/*.png', { eager: true });

const dreamImgUrls: Record<string, string> = {};

// 预处理，把文件名映射到实际 URL
for (const path in dreamImgMap) {
  // 例如 path = '/src/assets/data/images/dream/001Bulbasaur_Dream.png'
  const parts = path.split('/');
  const fileName = parts[parts.length - 1]; // '001Bulbasaur_Dream.png'
  // @ts-ignore
  dreamImgUrls[fileName] = dreamImgMap[path].default;
}

/**
 * 同步获取宝可梦图片 URL
 * @param name 文件名，例如 '001Bulbasaur_Dream.png'
 */
const getDreamImgMap = (name: string): string | undefined => {
  console.log(dreamImgMap);
  return dreamImgUrls[name];
};

export default getDreamImgMap;
