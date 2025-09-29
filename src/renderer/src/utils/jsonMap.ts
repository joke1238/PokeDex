import type { Pokemon } from '@renderer/interface/pokedata';
const jsonMap = import.meta.glob('@renderer/assets/data/pokemon/*.json');

const getJsonMap = async (name: string): Promise<Pokemon | undefined> => {
  // console.log('getMap:',jsonMap);
  const key = `/src/assets/data/pokemon/${name}.json`;
  // console.log('key:', key);
  const loader = jsonMap[key];
  if (!loader) return undefined;

  const pokedata = await loader(); // module.default 就是 JSON 数据
  return pokedata as Pokemon;
};

export default getJsonMap;