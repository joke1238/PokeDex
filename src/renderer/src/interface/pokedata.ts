// 宝可梦主接口
export interface Pokemon {
  name: string;            // 中文名
  index: string;           // 全国图鉴编号
  name_en: string;         // 英文名
  name_jp: string;         // 日文名
  profile: string;         // 简介

  forms: PokemonForm[];    // 形态（普通形态/mega/gmax等）
  stats: Stats;            // 种族值
  flavor_texts: FlavorTextGroup[]; // 图鉴描述
  evolution_chains: EvolutionChain[] ; // 进化链
  names: MultiLangNames;   // 多语言名字
  moves: Moves;            // 学习技能
}

// 宝可梦形态
export interface PokemonForm {
  name: string;
  index: string;
  is_mega: boolean;  
  is_gmax: boolean;  
  image: string;      // 是否为Gmax形态
  types: string[];         // 属性
  genus: string;           // 分类
  ability: ability[];       // 特性
  experience: experience;      // 经验曲线
  height: number;          // 身高（米）
  weight: number;          // 体重（kg）
  gender_rate: GenderRate; // 性别比例
  shape: string;           // 外形
  color: string;           // 颜色
  catch_rate: CatchRate;   // 捕获率
  egg_groups: string[];    // 蛋群
}
export interface experience {
 number: string; // 经验值
 speed: string;  // 经验曲线
}


export interface ability {
  name: string;            // 特性名
  is_hidden: boolean;         // 是否为隐藏特性
}

// 性别比例
export interface GenderRate {
  male: number;    // 0-1
  female: number;  // 0-1
}

// 捕获率
export interface CatchRate {
  number: number;  // 基础捕获率
  rate: string;    // 转换为百分比文本
}

// 种族值
export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
}

// 图鉴描述
export interface FlavorTextGroup {
  version_group: string;   // 世代
  versions: string[];      // 对应游戏版本
  text: string;            // 描述文本
}

// 进化阶段
export interface EvolutionStage {
  name: string;
  stage: string;       // 改成 string
  image: string;
  text?: string | null; // 改成可选
  back_text?: string | null;
  from?: string | null;
  form_name?: string | null;
}

export type EvolutionChain = EvolutionStage[];
// 多语言名字
export interface MultiLangNames {
  cn: string;
  tw: string;
  en: string;
  fr: string;
  de: string;
  it: string;
  es: string;
  jp: string;
  kr: string;
}

// 技能
export interface Moves {
  learned: MoveLearned[];   // 升级习得
  machine: MoveMachine[];   // 学习器
}

export interface MoveLearned {
  form: string;    // 形态
  data: Move;
}

export interface MoveMachine extends Move {
  method: string;  // 学习方式
  data: Move;
}

// 单个技能
export interface Move {
  name: string;        // 招式名
  power: number | null;// 威力，null表示无威力
  accuracy: number | null; // 命中率
  pp: number;          // 使用次数
  type: string;        // 属性
  category: string;    // 物理/特殊/变化
  description: string; // 描述
}
