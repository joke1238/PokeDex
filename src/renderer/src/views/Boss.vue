<template>
  <div class="pokemmo-clock">

    <!-- 游戏时间卡片 -->
    <el-card class="clock-card" shadow="hover">
      <h3>⏰ 游戏时间</h3>
      <p class="game-time">{{ gamePeriod }} {{ gametime }}</p>
      <p class="game-weekday">📅 {{ gameWeekday }}</p>
      <div class="tide-info">
        <span class="tide-label">城都 🌊 愤怒之湖：</span>
        <span :class="lakeOfRageTide.includes('涨') ? 'tide-high' : 'tide-low'">{{ lakeOfRageTide }}</span>
      </div>
      <div class="tide-info">
        <span class="tide-label">丰缘 🏝️ 浅滩洞穴：</span>
        <span :class="shoalCaveTide.includes('涨') ? 'tide-high' : 'tide-low'">{{ shoalCaveTide }}</span>
      </div>
    </el-card>

    <!-- 头目报点卡片 -->
    <el-card class="boss-card" shadow="hover">
      <div class="section-header">
        <span>🐦 头目报点</span>
        <el-button class="custom-btn" @click="handleRefresh" :loading="loading">刷新</el-button>
      </div>

      <div class="boss-time">{{ bossdata.time?.cn || bossdata.time || '加载中...' }}</div>

      <div class="boss-list" v-if="bossdata.boss && bossdata.boss.length">
        <div v-for="item in bossdata.boss" :key="item.id" class="boss-item">
          <p><strong>玩家:</strong> {{ item.userIgn }} | <strong>地点:</strong> {{ item.location }} ({{ item.region }})</p>
          <p>
            <strong>怪物:</strong>
            <img :src="getPixelImgMap(item.monsterId/100)" class="mini-pic" />
            {{ getnamefromid(item.monsterId) }}
          </p>
          <p><strong>时间:</strong> {{ item.startHour }}:{{ item.startMinute }} ~ {{ item.endHour }}:{{ item.endMinute }}</p>
          <p><strong>技能:</strong> {{ item.move1 }}, {{ item.move2 }}, {{ item.move3 }}, {{ item.move4 }}</p>
          <p><strong>描述:</strong> {{ item.description }}</p>
        </div>
      </div>
      <div v-else class="boss-empty">暂无头目数据</div>
    </el-card>

    <!-- 神兽轮换卡片 -->
    <el-card class="legend-card" shadow="hover">
      <div class="section-header">
        <span>🤡 神兽轮换</span>
        <el-button class="custom-btn" @click="openRotationDialog">轮换</el-button>
      </div>
      <div class="legend-grid">
        <div class="legend-card-item" v-for="(legend, index) in currentLegends" :key="index">
          <img :src="legend.pic" class="legend-pic" />
          <p class="legend-name">{{ legend.name.cn }}</p>
          <div class="legend-moves">
            <img v-for="(move, idx) in legend.moves" :key="idx" :src="move.pic" class="move-icon" :title="move.name" />
          </div>
        </div>
      </div>
    </el-card>

    <!-- Dialog 弹窗 -->
    <div v-if="showDialog" class="dialog-overlay" @click="closeDialog">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <h3>📅 神兽轮换表</h3>
          <el-button class="custom-btn" @click="closeDialog">×</el-button>
        </div>
        <div class="dialog-body">
          <div class="rotation-grid">
            <div v-for="item in rotationData" :key="item.month" class="rotation-card">
              <p class="rotation-month" :class="{ current: item.current }">{{ item.label }}</p>
              <div class="rotation-legends">
                <div v-for="(legend, idx) in item.legends" :key="idx" class="legend-card-item">
                  <img :src="legend.pic" class="legend-pic" />
                  <p class="legend-name">{{ legend.name.cn }}</p>
                  <div class="legend-moves" v-for="(move, mIdx) in legend.moves" :key="mIdx">
                    
                    <img  :src="move.pic"/> <span :style="  {'border-radius': '5px', 'background-color': typeColors[move.type] }">{{ move.name }}</span>
                    <!-- <span>{{ move.name }}</span> -->

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button class="custom-btn" @click="closeDialog">关闭</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import pokeList from '@renderer/assets/data/pokemon_full_list.json';
import getPixelImgMap from '@renderer/utils/imgPixelMap';

const getnamefromid = (id) => {
  const pokemon = pokeList.find(item => parseInt(item.index) === id/100);
  return pokemon?.name || '未知';
};

const gametime = ref('00:00:00');
const gameWeekday = ref('星期一');
const gamePeriod = ref('🌙夜晚');
const lakeOfRageTide = ref('☔涨潮');
const shoalCaveTide = ref('🌞退潮');
const bossdata = reactive({ time: { cn: '加载中...' }, boss: [] });
const loading = ref(false);
const showDialog = ref(false);

// 星期映射
const weekdays = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
const periods = { dawn: { cn: '⛅清晨' }, day: { cn: '🌞白天' }, night: { cn: '🌙夜晚' } };

// 神兽数据
const allLegends = [
  // 🔹 9月 关都：急冻鸟
  {
    pic: new URL('@renderer/assets/pic/poke/急冻鸟.png', import.meta.url).href,
    name: { cn: '急冻鸟' },
    id: 'articuno',
    moves: [
      { name: '暴风雪', en: 'Blizzard', type: '冰', category: 'Special', power: 110, accuracy: 70 ,pic: new URL('@renderer/assets/pic/move/Ice.png', import.meta.url).href},
      { name: '空气之刃', en: 'Air Slash', type: '飞行', category: 'Special', power: 75, accuracy: 95,pic: new URL('@renderer/assets/pic/move/Flying.png', import.meta.url).href },
      { name: '羽栖', en: 'Roost', type: '飞行', category: 'Status', power: null, accuracy: null ,pic: new URL('@renderer/assets/pic/move/Flying.png', import.meta.url).href},
      { name: '冰雹', en: 'Hail', type: '冰', category: 'Status', power: null, accuracy: null ,pic: new URL('@renderer/assets/pic/move/Ice.png', import.meta.url).href}
    ]
  },
  // 🔹 8月 关都：火焰鸟
  {
    pic: new URL('@renderer/assets/pic/poke/火焰鸟.png', import.meta.url).href,
    name: { cn: '火焰鸟' },
    id: 'moltres',
    moves: [
      { name: '大字爆炎', en: 'Fire Blast', type: '火', category: 'Special', power: 110, accuracy: 85,pic: new URL('@renderer/assets/pic/move/Fire.png', import.meta.url).href },
      { name: '空气之刃', en: 'Air Slash', type: '飞行', category: 'Special', power: 75, accuracy: 95 ,pic: new URL('@renderer/assets/pic/move/Flying.png', import.meta.url).href},
      { name: '日光束', en: 'Solar Beam', type: '草', category: 'Special', power: 120, accuracy: 100 ,pic: new URL('@renderer/assets/pic/move/Grass.png', import.meta.url).href},
      { name: '大晴天', en: 'Sunny Day', type: '火', category: 'Status', power: null, accuracy: null ,pic: new URL('@renderer/assets/pic/move/Fire.png', import.meta.url).href}
    ]
  },
  // 🔹 10月 关都：闪电鸟
  {
    pic: new URL('@renderer/assets/pic/poke/闪电鸟.png', import.meta.url).href,
    name: { cn: '闪电鸟' },
    id: 'zapdos',
    moves: [
      { name: '打雷', en: 'Thunder', type: '电', category: 'Special', power: 110, accuracy: 70 ,pic: new URL('@renderer/assets/pic/move/Electric.png', import.meta.url).href},
      { name: '暴风', en: 'Hurricane', type: '飞行', category: 'Special', power: 110, accuracy: 70 ,pic: new URL('@renderer/assets/pic/move/Flying.png', import.meta.url).href},
      { name: '飞翔', en: 'Fly', type: '飞行', category: 'Physical', power: 90, accuracy: 95 ,pic: new URL('@renderer/assets/pic/move/Flying.png', import.meta.url).href},
      { name: '求雨', en: 'Rain Dance', type: '水', category: 'Status', power: null, accuracy: null ,pic: new URL('@renderer/assets/pic/move/Water.png', import.meta.url).href}
    ]
  },
  // 🔹 9月 城都：雷公
  {
    pic: new URL('@renderer/assets/pic/poke/雷公.png', import.meta.url).href,
    name: { cn: '雷公' },
    id: 'raikou',
    moves: [
      { name: '十万伏特', en: 'Thunderbolt', type: '电', category: 'Special', power: 90, accuracy: 100 ,pic: new URL('@renderer/assets/pic/move/Electric.png', import.meta.url).href},
      { name: '波导弹', en: 'Aura Sphere', type: '格斗', category: 'Special', power: 80, accuracy: null ,pic: new URL('@renderer/assets/pic/move/Fighting.png', import.meta.url).href},
      { name: '反射壁', en: 'Reflect', type: '超能力', category: 'Status', power: null, accuracy: null ,pic: new URL('@renderer/assets/pic/move/Psychic.png', import.meta.url).href},
      { name: '光墙', en: 'Light Screen', type: '超能力', category: 'Status', power: null, accuracy: null ,pic: new URL('@renderer/assets/pic/move/Psychic.png', import.meta.url).href}
    ]
  },
  // 🔹 8月 城都：水君
  {
    pic: new URL('@renderer/assets/pic/poke/水君.png', import.meta.url).href,
    name: { cn: '水君' },
    id: 'suicune',
    moves: [
      { name: '盐水', en: 'Salt Cure', type: '水', category: 'Physical', power: 40, accuracy: 100 ,pic: new URL('@renderer/assets/pic/move/Water.png', import.meta.url).href},
      { name: '冰冻之风', en: 'Icy Wind', type: '冰', category: 'Special', power: 55, accuracy: 95 ,pic: new URL('@renderer/assets/pic/move/Ice.png', import.meta.url).href},
      { name: '冥想', en: 'Calm Mind', type: '超能力', category: 'Status', power: null, accuracy: null ,pic: new URL('@renderer/assets/pic/move/Psychic.png', import.meta.url).href},
      { name: '求雨', en: 'Rain Dance', type: '水', category: 'Status', power: null, accuracy: null ,pic: new URL('@renderer/assets/pic/move/Water.png', import.meta.url).href}
    ]
  },
  // 🔹 10月 城都：炎帝
  {
    pic: new URL('@renderer/assets/pic/poke/炎帝.png', import.meta.url).href,
    name: { cn: '炎帝' },
    id: 'entei',
    moves: [
      { name: '神圣之火', en: 'Sacred Fire', type: '火', category: 'Physical', power: 100, accuracy: 95 ,pic: new URL('@renderer/assets/pic/move/Fire.png', import.meta.url).href},
      { name: '重踏', en: 'Stomp', type: '一般', category: 'Physical', power: 65, accuracy: 100 ,pic: new URL('@renderer/assets/pic/move/Normal.png', import.meta.url).href},
      { name: '神速', en: 'Extremespeed', type: '一般', category: 'Physical', power: 80, accuracy: 100 ,pic: new URL('@renderer/assets/pic/move/Normal.png', import.meta.url).href},
      { name: '咬碎', en: 'Crunch', type: '恶', category: 'Physical', power: 80, accuracy: 100 ,pic: new URL('@renderer/assets/pic/move/Dark.png', import.meta.url).href}
    ]
  }
];

const typeColors = reactive({
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
});

// 当前神兽（本月）
const currentLegends = computed(() => {
  const month = new Date().getMonth();
  const i = month % 3;
  switch(i){
    case 0: return [allLegends[2], allLegends[5]];
    case 1: return [allLegends[1], allLegends[4]];
    case 2: return [allLegends[0], allLegends[3]];
  }
});

// 轮换数据
const rotationData = ref([]);

function getLegendsForMonth(month){
  const i = month % 3;
  switch(i){
    case 0: return [allLegends[2], allLegends[5]];
    case 1: return [allLegends[1], allLegends[4]];
    case 2: return [allLegends[0], allLegends[3]];
  }
}

const openRotationDialog = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  rotationData.value = [
    { month: (currentMonth-1+12)%12, label: `${(currentMonth-1+12)%12+1}月`, legends:getLegendsForMonth((currentMonth-1+12)%12), current:false },
    { month: currentMonth, label: `${currentMonth+1}月`, legends:getLegendsForMonth(currentMonth), current:true },
    { month: (currentMonth+1)%12, label: `${(currentMonth+1)%12+1}月`, legends:getLegendsForMonth((currentMonth+1)%12), current:false }
  ];
  showDialog.value = true;
};

const closeDialog = () => showDialog.value = false;

const handleRefresh = async () => {
  try {
    loading.value = true;
    const res = await window.api.getbossinfo();
    bossdata.time = res?.msg || { cn:'暂无数据' };
    bossdata.boss = res?.data || [];
  } catch(e){
    bossdata.time = { cn:'加载失败' };
    bossdata.boss = [];
  } finally{
    loading.value = false;
  }
};

function calculateGameTime() {
  const now = new Date();
  const h = now.getUTCHours(), m = now.getUTCMinutes(), s = now.getUTCSeconds();
  const dayOfWeek = now.getUTCDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const realTotalSeconds = h*3600+m*60+s;
  const gameTotalSeconds = realTotalSeconds*4;
  const gameHour = Math.floor(gameTotalSeconds/3600)%24;
  const gameMinute = Math.floor((gameTotalSeconds%3600)/60);
  const gameSecond = Math.floor(gameTotalSeconds%60);

  let period = (gameHour>=4 && gameHour<11)?periods.dawn: (gameHour>=11 && gameHour<21)?periods.day:periods.night;
  const gameDayIndex = Math.floor((daysSinceMonday*24+h)/6)%7;
  const lakeTide = gameDayIndex===2?'🌞退潮':'☔涨潮';
  const phase = (gameHour+9)%12;
  const shoalTide = phase>=6?'☔涨潮':'🌞退潮';

  return {
    timeStr:`${String(gameHour).padStart(2,'0')}:${String(gameMinute).padStart(2,'0')}:${String(gameSecond).padStart(2,'0')}`,
    weekday: weekdays[gameDayIndex],
    period: period.cn,
    lakeTide,
    shoalTide
  };
}

onMounted(()=>{
  handleRefresh();
  const update = () => {
    const result = calculateGameTime();
    gametime.value = result.timeStr;
    gameWeekday.value = result.weekday;
    gamePeriod.value = result.period;
    lakeOfRageTide.value = result.lakeTide;
    shoalCaveTide.value = result.shoalTide;
  };
  update();
  setInterval(update,1000);
  setInterval(handleRefresh,4*60*1000);
});
</script>

<style scoped>
.pokemmo-clock {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(350px,1fr));
  gap: 16px;
  padding: 16px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #cfd8c7;
  border-radius: 12px;
  color: #f5e4e4;
  min-height: 100%;
}

.el-card { border-radius: 12px; background: rgba(221, 223, 216, 0.95); padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.3); }

.clock-card h3, .boss-card h3, .legend-card h3 { text-align:center; margin-bottom:10px; }

.game-time { font-size: 20px; font-weight:bold; text-align:center; }
.game-weekday { text-align:center; margin-bottom:8px; }
.tide-info { margin-bottom:4px; }
.tide-label { font-weight:bold; }
.tide-high { color:#4fc3f7; font-weight:bold; }
.tide-low { color:#ffb74d; font-weight:bold; }

.section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-weight:bold; font-size:16px; }

.boss-list { display:flex; flex-direction:column; gap:8px; }
.boss-item { background: rgba(255,255,255,0.05); padding:10px; border-radius:8px; transition:0.2s; }
.boss-item:hover { transform: translateY(-2px); box-shadow:0 2px 6px rgba(0,0,0,0.3); }
.boss-time { margin-bottom:8px; padding:4px 8px; background: rgba(255,255,255,0.1); border-radius:4px; display:inline-block; }
.boss-empty { text-align:center; color:#fdfdfd; padding:8px; }

.custom-btn { background:linear-gradient(135deg,#ff6b6b,#f06595); color:rgb(235, 222, 222); border-radius:6px; padding:4px 10px; font-size:14px; transition: all 0.2s; }
.custom-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
.custom-btn:active { transform: translateY(0); }

.legend-grid { display:flex; flex-wrap:wrap; gap:16px; justify-content:center; }
.legend-card-item { background: rgba(255,255,255,0.1); border-radius:10px; padding:8px; text-align:center; transition:0.2s; }
.legend-card-item:hover { transform: translateY(-4px); box-shadow:0 4px 12px rgba(0,0,0,0.3); }
.legend-pic { width:60px; height:60px; margin-bottom:4px; }
.legend-name { font-weight:bold; }
.legend-moves { display:flex; gap:4px; justify-content:center; margin-top:4px; }
.move-icon { width:24px; height:24px; }

.dialog-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:1000; }
.dialog { background:#1e1f1c; color:#f5f5f5; border-radius:12px; padding:16px; max-width:500px; width:90%; }
.dialog-header { display:flex; justify-content:space-between; align-items:center; font-size:16px; font-weight:bold; margin-bottom:8px; }
.dialog-body { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; }
.dialog-footer { text-align:right; padding-top:12px; }

.rotation-grid { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
.rotation-card { background: rgba(255,255,255,0.05); border-radius:10px; padding:8px; min-width:140px; text-align:center; }
.rotation-month { font-weight:bold; margin-bottom:6px; }
.rotation-month.current { color:#ff6b6b; }
.rotation-legends { display:flex; flex-direction:column; gap:6px; }
.mini-pic { width:39px; height:39px; vertical-align:middle; margin-right:4px; }
</style>
