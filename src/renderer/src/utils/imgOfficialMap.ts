// utils/imgOfficialMap.ts

// 使用 eager 模式直接把图片路径映射出来
const officialImgMap = import.meta.glob(
  '@renderer/assets/data/images/official/*.png',
  { eager: true }
) as Record<string, { default: string }>;

const getOfficialImgMap = (name: string | number |undefined): string | undefined => {
  // console.log("name:", name);
  // console.log("imgMap keys:", Object.keys(officialImgMap));

  const key = `/src/assets/data/images/official/${name}.png`;
  const module = officialImgMap[key];
  return module?.default; // 返回 string 路径
};
// 
export default getOfficialImgMap;
// 0019.1-小拉达-阿罗拉的样子
// /src/assets/data/images/official/0019.1-阿罗拉小拉达.png