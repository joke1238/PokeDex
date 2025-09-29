<template>
  <div class="search-container">
    <el-autocomplete
      v-model="keyword"
      :fetch-suggestions="querySearch"
      placeholder="请输入关键词"
      @select="onSelect"
      @keyup.enter="handleSearch"
      clearable
      style="width: 300px"
    >
      <!-- 自动补全列表 -->
      <template #default="{ item }">
        <div style="display: flex; align-items: center; gap: 8px;">
          <el-image
            :src="getPixelImgMap(item.id)"
            fit="contain"
            style="width: 48px; height: 48px;"
          />
          <span>{{ item.value }}</span>
        </div>
      </template>

      <!-- 输入框后缀按钮 -->
      <template #suffix>
        <el-icon @click="handleSearch" style="cursor: pointer">
          <Search />
        </el-icon>
      </template>
    </el-autocomplete>

    <el-button type="primary" @click="handleSearch">搜索</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import PokeList from "@renderer/assets/data/pokemon_list.json";
import getPixelImgMap from "@renderer/utils/imgPixelMap";


const emit = defineEmits(["search"]);
const keyword = ref("");

// 自动补全
const querySearch = (queryString: string, callback: (arg: any[]) => void) => {
  if (!queryString) return callback([]);

  const lower = queryString.toLowerCase();
  const result = PokeList.filter(
    poke =>
      (poke.name && poke.name.includes(queryString)) ||
      (poke.name_en && poke.name_en.toLowerCase().includes(lower)) ||
      (poke.name_jp && poke.name_jp.includes(queryString)) ||
      (poke.id_str && poke.id_str.toString().includes(queryString))
  ).map(poke => ({
    value: poke.name,
    id: poke.id,
  }));

  callback(result);
};

// 选中自动补全
const onSelect = (item: any) => {
  keyword.value = item.value;
  handleSearch();
};

// 搜索处理
const handleSearch = () => {
  if (!keyword.value.trim()) {
    ElMessage.warning("请输入关键词");
    return;
  }

  const lower = keyword.value.toLowerCase();
  const filtered = PokeList.find(
    poke =>
      (poke.name && poke.name.includes(keyword.value.trim())) ||
      (poke.name_en && poke.name_en.toLowerCase() === lower) ||
      (poke.name_jp && poke.name_jp.includes(keyword.value.trim())) ||
      (poke.id_str && poke.id_str.toString() === keyword.value.trim())
  );

  if (!filtered) {
    ElMessage.error("未找到对应的宝可梦");
    return;
  }

  // 正确拼 JSON 名字： id_str-中文名
  const pokeJsonName = `0${filtered.id_str}-${filtered.name}`;
  emit("search", pokeJsonName);
};
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
