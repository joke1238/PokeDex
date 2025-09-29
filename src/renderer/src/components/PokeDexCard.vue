<template>
  <div class="pokedexcard-container">
    <el-card class="poke-card" shadow="hover">
      <!-- 图片 -->
      <div class="img-wrapper">
        <el-image :src="getOfficialImgMap(props.PokeData.id)" fit="contain" />
      </div>

      <!-- 信息 -->
      <div class="info">
        <div class="name">{{ props.PokeData.name }}</div>

        <!-- 类型标签 -->
        <div class="types">
          <el-tag :style="{ backgroundColor: typeColors[props.PokeData.type1], color: '#fff' }">{{ props.PokeData.type1 }}</el-tag>
          <el-tag v-if="props.PokeData.type2" :style="{ backgroundColor: typeColors[props.PokeData.type2], color: '#fff' }">{{ props.PokeData.type2 }}</el-tag>
        </div>

        <!-- 描述 -->
        <div class="info-desc">
          <p>{{ props.PokeData.desc || '暂无描述信息' }}</p>
        </div>
      </div>
    </el-card>  
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import getOfficialImgMap from "@renderer/utils/imgOfficialMap";

const props = defineProps({
  PokeData: {
    type: Object as PropType<any>,
    required: true,
  },
});

const typeColors: Record<string, string> = {
  一般: "#A8A77A", 格斗: "#C22E28", 飞行: "#A98FF3", 毒: "#A33EA1",
  地面: "#E2BF65", 岩石: "#B6A136", 虫: "#A6B91A", 幽灵: "#735797",
  钢: "#B7B7CE", 火: "#EE8130", 水: "#6390F0", 草: "#7AC74C",
  电: "#F7D02C", 超能力: "#F95587", 冰: "#96D9D6", 龙: "#6F35FC",
  恶: "#705746", 妖精: "#D685AD",
};
</script>

<style scoped>
.pokedexcard-container {
  width: 220px;
  height: 340px;
  margin: 12px;
}

.poke-card {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.poke-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
}

.img-wrapper {
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa, #e0e5ec);
}

.img-wrapper .el-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.info {
  padding: 10px 12px;
  background: #fff;
  text-align: center;
}

.name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #2c3e50;
}

.types {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
}

.type-tag {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}

.info-desc {
  background: rgba(255, 255, 255, 0.8); /* 半透明背景 */
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  padding: 6px 8px;
  max-height: 60px;
  overflow-y: auto;
  word-break: break-word;
  text-align: center;
  transition: background 0.3s ease;
}

/* 滚动条美化 */
.info-desc::-webkit-scrollbar {
  width: 6px;
}

.info-desc::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 3px;
}

.info-desc p {
  margin: 0;
}
</style>
