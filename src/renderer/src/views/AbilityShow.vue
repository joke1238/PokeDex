<template>
  <div class="ability-wrapper" ref="listRef" @scroll="onScroll">
    <!-- 搜索框 -->
    <el-input
      v-model="keyword"
      placeholder="搜索特性名称"
      clearable
      prefix-icon="el-icon-search"
      class="search-box"
    />

    <!-- 特性列表 -->
    <div class="ability-list">
      <AbilityCard
        v-for="ability in visibleAbilities"
        :key="ability.index"
        :ability="ability"
        class="ability-card"
      />
    </div>

    <!-- 加载提示 -->
    <div v-if="loading" class="loading">加载中...</div>
    <div
      v-else-if="visibleAbilities.length >= filteredAbilities.length"
      class="loading"
    >
      没有更多了
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import abilityjson from "@renderer/assets/data/ability_list.json";
import AbilityCard from "@renderer/components/AbilityDrawer.vue";

const keyword = ref("");
const limit = ref(120);
const loading = ref(false);
const listRef = ref<HTMLElement | null>(null);

// 搜索过滤
const filteredAbilities = computed(() => {
  if (!keyword.value) return abilityjson;
  return abilityjson.filter((a) =>
    a.name.toLowerCase().includes(keyword.value.toLowerCase())
  );
});

// 实际显示
const visibleAbilities = computed(() =>
  filteredAbilities.value.slice(0, limit.value)
);

// 搜索重置 limit
watch(keyword, () => {
  limit.value = 120;
});

// 滚动加载
let ticking = false;
const onScroll = (e: Event) => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const target = e.target as HTMLElement;
      if (
        target.scrollTop + target.clientHeight >= target.scrollHeight - 20 &&
        !loading.value
      ) {
        if (limit.value < filteredAbilities.value.length) {
          loading.value = true;
          setTimeout(() => {
            limit.value += 120; // 每次加载 120 条
            loading.value = false;
          }, 200);
        }
      }
      ticking = false;
    });
    ticking = true;
  }
};
</script>

<style scoped>
.ability-wrapper {
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.search-box {
  max-width: 350px;
  margin-bottom: 16px;
}

/* 卡片列表 */
.ability-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

/* 卡片样式 */
.ability-card {
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.ability-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.loading {
  text-align: center;
  padding: 16px 0;
  color: #888;
}
</style>
