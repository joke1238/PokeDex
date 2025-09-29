// imgDreamMap.ts
export const pixelImgMap = import.meta.glob('@renderer/assets/data/images/pixel/*.png', { eager: true });

const pixelImgUrls: Record<string, string> = {};

// 预处理，把文件名映射到实际 URL
for (const path in pixelImgMap) {

  const parts = path.split('/');
  const fileName = parts[parts.length - 1]; 
  // @ts-ignore
  pixelImgUrls[fileName] = pixelImgMap[path].default;
}

/**
 * 同步获取宝可梦图片 URL
 * @param name 文件名，例如 '001Bulbasaur_Pixel.png'
 */
const getPixelImgMap = (name: number): string | undefined => {
    
//   console.log('pixelImgUrls keys:', Object.keys(pixelImgUrls));
  return pixelImgUrls[name + '.png'];
};

export default getPixelImgMap;
