<template>
  <div>
    <!-- 搜索框 -->
    <el-input
      v-model="keyword"
      placeholder="搜索宝可梦"
      clearable
      class="search-box"
    />

    <div 
      class="pokedex-container" 
      ref="scrollContainer" 
      @scroll="onScroll"
    >
      <PokeDexCard
        v-for="poke in displayList"
        :key="poke.id"
        :PokeData="poke"
        @click="handleClick(poke)"
      />
      
      <!-- 底部提示 -->
      <div v-if="isLoading && !keyword" class="loading">加载中...</div>
      <div v-else-if="!keyword && displayList.length >= PokeList.length" class="finished">
        已经到底啦 🎉
      </div>

      <!-- 抽屉 -->
      <PokeDrawer 
        v-model:drawer-visible="drawerVisible"
        :PokeData="PokeData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import PokeDexCard from "@renderer/components/PokeDexCard.vue";
import PokeList from "@renderer/assets/data/pokemon_list.json";
import PokeDrawer from "@renderer/components/PokeDrawer.vue";
import getJsonMap from "@renderer/utils/jsonMap";
import type { Pokemon } from "@renderer/interface/pokedata"; 


// 每次加载数量
const batchSize = 50;
const visibleList = ref(PokeList.slice(0, batchSize));

const scrollContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false);

// 搜索关键字
const keyword = ref("");

// 搜索结果（在全量列表里过滤）
const searchResults = computed(() => {
  if (!keyword.value) return [];
  const lower = keyword.value.toLowerCase();
  return PokeList.filter(p =>
    p.name.toLowerCase().includes(lower) || 
    (p.id && p.id.toString().includes(lower))
  );
});

// 展示列表：有搜索 → 搜索结果，否则 → 懒加载可见列表
const displayList = computed(() => {
  return keyword.value ? searchResults.value : visibleList.value;
});

// 滚动触发节流
let ticking = false;
const onScroll = () => {
  if (!scrollContainer.value || ticking || keyword.value) return; // 搜索时禁用懒加载
  ticking = true;

  requestAnimationFrame(() => {
    handleScroll();
    ticking = false;
  });
};

const handleScroll = () => {
  if (!scrollContainer.value || isLoading.value) return;

  const { scrollTop, clientHeight, scrollHeight } = scrollContainer.value;

  // 滚动到底部 200px 内时加载
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    loadMore();
  }
};

// 抽屉
const drawerVisible = ref(false)
const PokeData = ref({} as Pokemon | undefined);


// 点击宝可梦
const handleClick = async (poke:any) => {
  PokeData.value = await getJsonMap( `0${poke.id_str}-${poke.name}`)
  // imgUrl.value = getOfficialImgMap(poke.index + '-' + poke.name)
  drawerVisible.value = true
}

// 加载更多
const loadMore = () => {
  const currentLength = visibleList.value.length;
  if (currentLength >= PokeList.length) return;

  isLoading.value = true;

  setTimeout(() => {
    visibleList.value.push(
      ...PokeList.slice(currentLength, currentLength + batchSize)
    );
    isLoading.value = false;
  }, 300); // 模拟加载延迟
};
</script>

<style scoped>
.search-box {

  width: 300px;
  margin: 5px auto;

}

.pokedex-container {
  display: grid;
  flex-direction: column;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  padding: 20px;
  background-color: #f5f5f5;
  height: calc(100vh - 100px);
  overflow-y: auto;
  border-radius: 8px;
}

.loading,
.finished {
  width: 100%;
  text-align: center;
  padding: 10px;
  color: #888;
  font-size: 14px;
}
</style>
