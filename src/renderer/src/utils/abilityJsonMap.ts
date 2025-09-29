import {AbilityDetail} from '@renderer/interface/ability'

const abilityJsonMap = import.meta.glob('@renderer/assets/data/ability/*.json');


const getAbilityJsonMap = async (name: string): Promise<AbilityDetail | undefined> => {
  console.log('getMap:',abilityJsonMap);
  console.log('name:', name);

  const key = `/src/assets/data/ability/${name}.json`;
//   "/src/assets/data/ability/034-叶绿素.json"

  // console.log('key:', key);
  const loader = abilityJsonMap[key];
  if (!loader) return undefined;

  const pokedata = await loader(); // module.default 就是 JSON 数据
  console.log('abilityData:', pokedata);
  return pokedata as AbilityDetail;
};

export default getAbilityJsonMap;