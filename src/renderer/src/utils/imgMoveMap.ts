// imgMoveMap.ts
 const moveImgMap = import.meta.glob('@renderer/assets/pic/move/*.png', { eager: true });

const moveImgUrls: Record<string, string> = {};

// 预处理，把文件名映射到实际 URL
for (const path in moveImgMap) {
  // 例如 path = '/src/assets/data/images/dream/001Bulbasaur_Dream.png'
  const parts = path.split('/');
  const fileName = parts[parts.length - 1]; // '001Bulbasaur_Dream.png'
  // @ts-ignore
  moveImgUrls[fileName] = moveImgMap[path].default;
}


const getMoveImgMap = (name: string): string | undefined => {
  if (!name) return moveImgUrls[''];
  return moveImgUrls[name+'.png'];
};

export default getMoveImgMap;
