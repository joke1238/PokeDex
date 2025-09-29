// 单个宝可梦
interface AbilityPokemon {
  index: string;              // 宝可梦编号
  name: string;               // 宝可梦名称
  types: string[];            // 属性列表
  first: string;              // 第一特性
  second: string;             // 第二特性（可能为空）
  hidden: string;             // 隐藏特性
}

// 特性详情
interface AbilityDetail {
  index: string;              // 特性编号
  generation: string;         // 初登场世代
  name: string;               // 中文名
  name_jp: string;            // 日文名
  name_en: string;            // 英文名
  text: string;               // 简短描述
  common_count: number;       // 普通特性数量
  hidden_count: number;       // 隐藏特性数量
  effect: string;             // 详细效果说明
  info: string[];             // 特性信息说明
  pokemon: AbilityPokemon[];  // 相关宝可梦列表
}

interface AbilityListItem {
    index: string;
    generation: string;
    name: string;
    name_jp: string;
    name_en: string;
    text: string;
    common_count: number;
    hidden_count: number;
}
export type { AbilityDetail, AbilityListItem, AbilityPokemon };