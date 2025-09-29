<template>
  <div class="move-container" @scroll="onScroll">
    <!-- 搜索框 -->
    <el-input
      v-model="keyword"
      placeholder="搜索招式名称"
      clearable
      class="search-box"
      prefix-icon="el-icon-search"
    />

    <!-- 招式列表 -->
    <div class="move-list">
      <el-card
        v-for="move in visibleAbilities"
        :key="move.index"
        class="move-card"
        shadow="hover"
      >
        <div class="move-info">
          <span class="move-name">{{ move.name }}</span>
          <el-tag
            size="small"
            :style="{ backgroundColor: typeColors[move.type], color: '#fff' }"
          >
            {{ move.type }}
          </el-tag>
        </div>
        <div class="move-desc">{{ move.text || '' }}</div>
      </el-card>
    </div>

    <!-- 加载提示 -->
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="visibleAbilities.length >= filteredAbilities.length" class="loading">
      没有更多了
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import movejson from "@renderer/assets/data/move_list.json";

const typeColors: Record<string, string> = {
  一般: "#A8A77A",
  格斗: "#C22E28",
  飞行: "#A98FF3",
  毒: "#A33EA1",
  地面: "#E2BF65",
  岩石: "#B6A136",
  虫: "#A6B91A",
  幽灵: "#735797",
  钢: "#B7B7CE",
  火: "#EE8130",
  水: "#6390F0",
  草: "#7AC74C",
  电: "#F7D02C",
  超能力: "#F95587",
  冰: "#96D9D6",
  龙: "#6F35FC",
  恶: "#705746",
  妖精: "#D685AD",
};

const keyword = ref("");
const limit = ref(120);
const loading = ref(false);

const filteredAbilities = computed(() => {
  if (!keyword.value) return movejson;
  return movejson.filter((a) =>
    a.name.toLowerCase().includes(keyword.value.toLowerCase())
  );
});

const visibleAbilities = computed(() =>
  filteredAbilities.value.slice(0, limit.value)
);

watch(keyword, () => {
  limit.value = 120;
});

let ticking = false;
const onScroll = (e: Event) => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const target = e.target as HTMLElement;
      if (
        target.scrollTop + target.clientHeight >= target.scrollHeight - 50 &&
        !loading.value
      ) {
        if (limit.value < filteredAbilities.value.length) {
          loading.value = true;
          setTimeout(() => {
            limit.value += 120;
            loading.value = false;
          }, 300);
        }
      }
      ticking = false;
    });
    ticking = true;
  }
};
</script>

<style scoped>
.move-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  padding: 16px;
  background-color: #f7f8fa;
  border-radius: 8px;
}

.search-box {
  margin-bottom: 16px;
  max-width: 300px;
  align-self: flex-start;
}

.move-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.move-card {
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.move-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.move-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.move-name {
  font-weight: 600;
  font-size: 14px;
}

.move-desc {
  font-size: 12px;
  color: #666;
}

.loading {
  text-align: center;
  padding: 16px 0;
  color: #888;
}
</style>
