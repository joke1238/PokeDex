<template>
  <el-drawer
    v-model="visible"
    @close="onDrawerClose"
    size="90%"
  >
    <!-- 抽屉头部 -->
    <template #header>
      <div class="drawer-header">
        <el-image
        :src="props.PokeData?.index ? getOfficialImgMap(parseInt(props.PokeData.index)) : ''"
        class="poke-img"
/>
        <span class="poke-name">{{ props.PokeData?.name }}</span>
      </div>
    </template>

    <!-- 基础资料 -->
    <el-descriptions
      title="宝可梦资料"
      :column="2"
      border
      class="info-card"
    >
      <el-descriptions-item label="编号">
        {{ props.PokeData?.forms[0].index }}
      </el-descriptions-item>

      <el-descriptions-item label="属性">
        <el-tag
          v-for="t in props.PokeData?.forms[0].types"
          :key="t"
          class="tag-type"
          type="success"
          size="small"
          :style="{ backgroundColor: typeColors[t], color: '#fff' }"
        >{{ t }}</el-tag>
      </el-descriptions-item>

      <el-descriptions-item label="特性">
        <span v-for="a in props.PokeData?.forms[0].ability" :key="a.name">
          <AbilityDialog  :ability1="a" />  
        </span>
      </el-descriptions-item>

      <el-descriptions-item label="种类">
        {{ props.PokeData?.forms[0].genus }}
      </el-descriptions-item>

      <el-descriptions-item label="身高">
        {{ props.PokeData?.forms[0].height }}
      </el-descriptions-item>

      <el-descriptions-item label="体重">
        {{ props.PokeData?.forms[0].weight }}
      </el-descriptions-item>

      <el-descriptions-item label="性别比">
        <template v-if="props.PokeData?.forms?.[0]?.gender_rate">
          <el-tag>♂</el-tag>
          {{ props.PokeData.forms[0].gender_rate.male }} /
          <el-tag style="color: #f448cc;">♀</el-tag>
          {{ props.PokeData.forms[0].gender_rate.female }}
        </template>
        <template v-else>
          无性别
        </template>
      </el-descriptions-item>


      <el-descriptions-item label="体型">
        {{ props.PokeData?.forms[0].shape }}
      </el-descriptions-item>

      <el-descriptions-item label="颜色">
        {{ props.PokeData?.forms[0].color }}
      </el-descriptions-item>

      <el-descriptions-item label="捕获率">
        {{ props.PokeData?.forms[0].catch_rate.number }}
        ({{ props.PokeData?.forms[0].catch_rate.rate }})
      </el-descriptions-item>

      <el-descriptions-item label="蛋群">
        {{ props.PokeData?.forms[0].egg_groups.join(', ') }}
      </el-descriptions-item>

      <el-descriptions-item label="经验">
        {{ props.PokeData?.forms[0].experience.number }}
        ({{ props.PokeData?.forms[0].experience.speed }})
      </el-descriptions-item>
    </el-descriptions>
    <div >
    <!-- 性格/等级选择 -->
      <div class="nature-select-container">
        <el-select v-model="nature" placeholder="选择性格" style="width: 200px;">
          <el-option
            v-for="n in natures"
            :key="n.value"
            :label="n.label"
            :value="n.value"
          />
        </el-select>

        <el-input-number
          v-model="level"
          :min="1"
          :max="100"
          size="small"
          class="level-input"
        />

        <el-button
          type="warning"
          size="small"
          @click="openBulkEvDialog"
        >批量修改努力</el-button>
      </div>

      <!-- 六围表格 -->
      <table class="stat-table">
        <thead>
          <tr>
            <th></th>
            <th>种族值</th>
            <th>个体值</th>
            <th>努力值</th>
            <th>最终能力</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stat in stats" :key="stat.key">
            <td class="td-card" :style="{ backgroundColor: stat.color }">{{ stat.name }}</td>
            <td>{{ stat.base }}</td>
            <td>
              <el-input-number
                v-model="stat.iv"
                :min="0"
                :max="31"
                size="small"
                class="iv-input"
                @change="recalculate"
              />
            </td>
            <td>
              <el-input-number
                v-model="stat.ev"
                :min="0"
                :max="252"
                :step="4"
                size="small"
                class="ev-input"
              />
            </td>
            <td>
              <span class="stat-value">{{ stat.key === 'hp' ? finalHp : finalOther(stat) }}</span>
              <el-tag
                v-if="stat.key !== 'hp'"
                size="small"
                type="info"
                style="margin-left:4px"
              >x{{ getNatureModifier(stat.key) }}</el-tag>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 批量修改努力对话框 -->
      <el-dialog v-model="showBulkEv" title="批量修改努力" width="300px">
        <el-input-number
          v-model="bulkEvValue"
          :min="0"
          :max="252"
          :step="4"
          style="width: 150px; margin-bottom: 10px;"
        />
        <br />
        <el-button type="primary" @click="applyBulkEv">确定</el-button>
      </el-dialog>
    </div>
    
    <div>
      <el-tabs v-model="tabName" >
        <el-tab-pane label="进化链" name="evolution">
          <PokeDrawerEvo :PokeData="props.PokeData" />
        </el-tab-pane>
        <el-tab-pane label="招式学习" name="moves">
          <Moves :PokeData="props.PokeData" />
        </el-tab-pane>
      </el-tabs >
    </div>




  </el-drawer>
</template>

<script lang="ts" setup>
import type { Pokemon } from '@renderer/interface/pokedata'
import { PropType, reactive, ref, computed, watch, nextTick } from 'vue'
import PokeDrawerEvo from './PokeDrawer-evo.vue'
import Moves from '@renderer/components/Moves.vue'
import getOfficialImgMap from '@renderer/utils/imgOfficialMap'
import AbilityDialog from '@renderer/components/AbilityDialog.vue'


const typeColors: Record<string, string> = {
  "一般": "#A8A77A",
  "格斗": "#C22E28",
  "飞行": "#A98FF3",
  "毒": "#A33EA1",
  "地面": "#E2BF65",
  "岩石": "#B6A136",
  "虫": "#A6B91A",
  "幽灵": "#735797",
  "钢": "#B7B7CE",
  "火": "#EE8130",
  "水": "#6390F0",
  "草": "#7AC74C",
  "电": "#F7D02C",
  "超能力": "#F95587",
  "冰": "#96D9D6",
  "龙": "#6F35FC",
  "恶": "#705746",
  "妖精": "#D685AD"
};
// import { parse } from 'path'
//  ---------------- tabs ----------------
const tabName = ref('evolution')

const props = defineProps({
  drawerVisible: { type: Boolean, required: true },
  PokeData: { type: Object as PropType<Pokemon> },
  imgUrl: { type: String, default: '' }
})

// ---------------- 性格 ----------------
const nature = ref('bashful')
const natures = [
  { value:'lonely', label:'孤独[攻击↑,特攻↓]', atk:1.1, spa:0.9 },
  { value:'adamant', label:'固执[攻击↑,特攻↓]', atk:1.1, spa:0.9 },
  { value:'naughty', label:'淘气[攻击↑,特防↓]', atk:1.1, spd:0.9 },
  { value:'brave', label:'勇敢[攻击↑,速度↓]', atk:1.1, spe:0.9 },
  { value:'bold', label:'大胆[防御↑,攻击↓]', def:1.1, atk:0.9 },
  { value:'impish', label:'顽皮[防御↑,特攻↓]', def:1.1, spa:0.9 },
  { value:'lax', label:'懒散[防御↑,特防↓]', def:1.1, spd:0.9 },
  { value:'relaxed', label:'悠闲[防御↑,速度↓]', def:1.1, spe:0.9 },
  { value:'modest', label:'内敛[特攻↑,攻击↓]', spa:1.1, atk:0.9 },
  { value:'mild', label:'温和[特攻↑,防御↓]', spa:1.1, def:0.9 },
  { value:'rash', label:'马虎[特攻↑,特防↓]', spa:1.1, spd:0.9 },
  { value:'quiet', label:'沉着[特攻↑,速度↓]', spa:1.1, spe:0.9 },
  { value:'calm', label:'冷静[特防↑,攻击↓]', spd:1.1, atk:0.9 },
  { value:'gentle', label:'认真[特防↑,防御↓]', spd:1.1, def:0.9 },
  { value:'careful', label:'慎重[特防↑,特攻↓]', spd:1.1, spa:0.9 },
  { value:'sassy', label:'自大[特防↑,速度↓]', spd:1.1, spe:0.9 },
  { value:'timid', label:'胆小[速度↑,攻击↓]', spe:1.1, atk:0.9 },
  { value:'hasty', label:'急躁[速度↑,防御↓]', spe:1.1, def:0.9 },
  { value:'jolly', label:'爽朗[速度↑,特攻↓]', spe:1.1, spa:0.9 },
  { value:'naive', label:'天真[速度↑,特防↓]', spe:1.1, spd:0.9 },
  { value:'hardy', label:'倔强[无变化]', atk:1, def:1, spa:1, spd:1, spe:1 },
  { value:'docile', label:'温顺[无变化]', atk:1, def:1, spa:1, spd:1, spe:1 },
  { value:'serious', label:'严肃[无变化]', atk:1, def:1, spa:1, spd:1, spe:1 },
  { value:'bashful', label:'害羞[无变化]', atk:1, def:1, spa:1, spd:1, spe:1 },
  { value:'quirky', label:'古怪[无变化]', atk:1, def:1, spa:1, spd:1, spe:1 },
]

// ---------------- 六围 ----------------
const level = ref(50)
const stats = reactive([
  { key:'hp', name:'生命', base:0, iv:31, ev:0, color:'rgb(5,177,91)' },
  { key:'attack', name:'攻击', base:0, iv:31, ev:0, color:'rgb(195,61,61)' },
  { key:'defense', name:'防御', base:0, iv:31, ev:0, color:'rgb(245,122,0)' },
  { key:'sp_attack', name:'特攻', base:0, iv:31, ev:0, color:'hotpink' },
  { key:'sp_defense', name:'特防', base:0, iv:31, ev:0, color:'rgb(211,185,41)' },
  { key:'speed', name:'速度', base:0, iv:31, ev:0, color:'rgb(53,173,213)' }
])

// ---------------- 计算 ----------------
const finalHp = computed(() => 
  Math.floor((2*stats[0].base + stats[0].iv + Math.floor(stats[0].ev/4)) * level.value/100) + level.value + 10
)

const getNatureModifier = (key:string) => {
  const n = natures.find(n => n.value===nature.value)
  if(!n) return 1
  switch(key){
    case 'attack': return n.atk ?? 1
    case 'defense': return n.def ?? 1
    case 'sp_attack': return n.spa ?? 1
    case 'sp_defense': return n.spd ?? 1
    case 'speed': return n.spe ?? 1
    default: return 1
  }
}

const finalOther = (stat:any) => {
  const baseVal = Math.floor((2*stat.base + stat.iv + Math.floor(stat.ev/4)) * level.value/100 +5)
  return Math.floor(baseVal * getNatureModifier(stat.key))
}

// ---------------- EV 处理 ----------------
const showBulkEv = ref(false)
const bulkEvValue = ref(252)


const openBulkEvDialog = ()=>showBulkEv.value=true
const applyBulkEv = ()=>{
  stats.forEach(s=>s.ev=bulkEvValue.value)
  showBulkEv.value=false
}



const recalculate = ()=>nextTick(()=>{})

// ---------------- 数据更新 ----------------
const updatastat = ()=>{
  if(!props.PokeData?.stats || !props.PokeData.stats[0]) return
  const statData = props.PokeData.stats[0].data
  for(const key in statData){
    const s = stats.find(item=>item.key===key)
    if(s){
      s.base = Number(statData[key])
      s.iv = 31
      s.ev = 252
    }
  }
}

watch(()=>props.PokeData, ()=>{
  updatastat()
  recalculate()
}, { immediate:true, deep:true })

// ---------------- 抽屉控制 ----------------
const emit = defineEmits(['update:drawerVisible'])
const visible = computed({
  get:()=>props.drawerVisible,
  set:(val)=>emit('update:drawerVisible',val)
})
const onDrawerClose = ()=>emit('update:drawerVisible', false)



</script>

<style scoped>
.drawer-header {
  border-radius: 8px;
  display:flex;
  align-items:center;
  gap:16px;
  height:80px;
  padding:0 16px;
  font-weight:bold;
  font-size:22px;
  background:linear-gradient(90deg,#f0f0f0,#fafafa);
  box-shadow:0 2px 6px rgba(0,0,0,0.1);
}
.poke-img{
  height:72px;width:72px;
  border-radius:12px;border:2px solid #ccc;
  object-fit:cover;
}
.info-card{
  margin:16px;
  padding:16px;
  border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.05);
  background:#fff;
}
.el-descriptions-item{
  margin-bottom:8px;
}
.tag-type{
  margin-right:4px;
}
.nature-select-container{
  display:flex;
  align-items:center;
  gap:16px;
  margin:16px;
}
.level-input{
  width:120px;
}
.stat-table{
  color: #000;
  width:100%;
  border-collapse:collapse;
  margin:16px 0;
  font-size:14px;
}
.stat-table th,.stat-table td{
  border:1px solid #e0e0e0;
  padding:8px;
  text-align:center;
}
.stat-table tbody tr:nth-child(even){background:#fafafa;}
.stat-table tbody tr:hover{background:#f5faff;}
.td-card{
  color:#fff;font-weight:bold;width:70px;border-radius:4px;padding:4px 0;
}
.stat-value{
  font-weight:bold;color:#333;
}
/* .evolution-chains{
  display: flex;
  flex-direction: column;
  color: #000;
  padding:16px;
  border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.05);
  background:#fff;
}

.evolution-chain{
  display: flex;
  align-items: top;
  margin-bottom: 16px;
}
.evolution-stage{
  display: flex;
  align-items: center;
  margin-right: 16px;
}
.evolution-stage-img {
  display: flex;
  flex-direction: column;
  align-items: center;
} */
</style>
