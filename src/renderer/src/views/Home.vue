<template>
  <div :class="['layout-container', isMoon ? 'dark' : 'light']">
    <el-container class="full-height">
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            :icon="asideCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            circle
            size="small"
            @click="toggleAside"
            title="收起/展开侧边栏"
          ></el-button>

          <GlobaSearch @search="handleSearch" />
        </div>

        <SunMoon
          ball="cut-in"
          halo="flex"
          delay="100"
          finish="now"
          @onStatus="handleSunMoonStatus"
        />
      </el-header>

      <el-container class="full-height">
        <!-- 侧边栏 -->
        <el-aside
          :width="asideCollapsed ? '64px' : '200px'"
          class="aside"
        >
          <el-menu
            :collapse="asideCollapsed"
            default-active="boss"
            @select="handleSelect"
            class="custom-menu"
            :background-color="isMoon ? '#2c2c3e' : '#f5f7fa'"
            :text-color="isMoon ? '#f5f5f5' : '#333'"
            active-text-color="#409EFF"
            unique-opened
          >
            <el-menu-item index="boss" :title="asideCollapsed ? '头目爆点' : ''">
              <img :src="imgUrl.boss" class="menu-icon" />
              <span v-if="!asideCollapsed">头目爆点</span>
            </el-menu-item>

            <el-menu-item index="level-effect" :title="asideCollapsed ? '等级限制' : ''">
              <img :src="imgUrl['level-effect']" class="menu-icon" />
              <span v-if="!asideCollapsed">等级限制</span>
            </el-menu-item>

            <el-menu-item index="pokedex" :title="asideCollapsed ? '图鉴展示' : ''">
              <img :src="imgUrl['pokedex']" class="menu-icon" />
              <span v-if="!asideCollapsed">图鉴展示</span>
            </el-menu-item>

            <el-menu-item index="ability" :title="asideCollapsed ? '特性展示' : ''">
              <img :src="imgUrl['ability']" class="menu-icon" />
              <span v-if="!asideCollapsed">特性展示</span>
            </el-menu-item>

            <el-menu-item index="move" :title="asideCollapsed ? '技能展示' : ''">
              <img :src="imgUrl['move']" class="menu-icon" />
              <span v-if="!asideCollapsed">技能展示</span>
            </el-menu-item>

            <el-menu-item index="item" :title="asideCollapsed ? '道具展示' : ''">
              <img :src="imgUrl['item']" class="menu-icon" />
              <span v-if="!asideCollapsed">道具展示</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 主内容 -->
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- 宝可梦抽屉 -->
    <PokeDrawer
      v-model:drawerVisible="drawerVisible"
      :PokeData="PokeData"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import router from '@renderer/router';
import GlobaSearch from '@renderer/components/GlobaSearch.vue';
import PokeDrawer from '@renderer/components/PokeDrawer.vue';
import SunMoon from '@renderer/components/SunMoon.vue';
import type { Pokemon } from '@renderer/interface/pokedata';
import getJsonMap from '@renderer/utils/jsonMap';

const imgUrl = reactive({
  boss: new URL('@renderer/assets/pokeBoss.svg', import.meta.url).href,
  'level-effect': new URL('@renderer/assets/levelEffect.svg', import.meta.url).href,
  pokedex: new URL('@renderer/assets/pokedex_selected.png', import.meta.url).href,
  ability: new URL('@renderer/assets/abilityList.svg', import.meta.url).href,
  move: new URL('@renderer/assets/pokeMoveList.svg', import.meta.url).href,
  item: new URL('@renderer/assets/itemShow.png', import.meta.url).href,
});

const drawerVisible = ref(false);
const PokeData = ref({} as Pokemon);
const isMoon = ref(false);
const asideCollapsed = ref(false);

const toggleAside = () => {
  asideCollapsed.value = !asideCollapsed.value;
};

const openDrawer = () => {
  drawerVisible.value = true;
};

const handleSearch = async (kw: string) => {
  PokeData.value = (await getJsonMap(kw)) as unknown as Pokemon;
  openDrawer();
};

const handleSelect = (index: string) => {
  router.push({ name: index });
};

const handleSunMoonStatus = (value: boolean) => {
  isMoon.value = value;
};

onMounted(() => {
  router.push('/boss');
});
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  transition: background-color 0.4s;
  font-family: 'Segoe UI', sans-serif;
}

.layout-container.light {
  background-color: #f5f7fa;
  color: #fffefe;
}

.layout-container.dark {
  background-color: #1f1f2e;
  color: #f5f5f5;
}

.full-height {
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 60px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.aside {
  transition: width 0.3s ease;
  border-radius: 8px;
}

.custom-menu ::v-deep(.el-menu-item) {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s;
}

.custom-menu ::v-deep(.el-menu-item:hover) {
  background-color: #e6f0ff;
  color: #409EFF;
}

.custom-menu ::v-deep(.el-menu-item.is-active) {
  background-color: #409EFF;
  color: #fff;
}

.menu-icon {
  width: 22px;
  height: 22px;
  vertical-align: middle;
}

.main {
  flex: 1;
  padding: 20px;
  border-radius: 12px;
  box-sizing: border-box; /* 关键：padding 不增加宽度 */
  background-color: #ffffff;
  transition: background-color 0.4s;
}

.layout-container.dark .main {
  background-color: #2c2c3e;
}
</style>
