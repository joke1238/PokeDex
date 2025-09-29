<template>
  <el-card class="ability-card" shadow="hover" @click="clickCard">
    <!-- 卡片头部 -->
    <div class="ability-header">
      <el-tag class="ability-name">{{ ability.name }}</el-tag>
    </div>
    <div class="ability-desc">{{ ability.text || '暂无描述' }}</div>

    <!-- 抽屉 -->
    <el-drawer
      v-model="openDrawer"
      size="60%"
      append-to-body
      :with-header="false"
      :destroy-on-close="true"
    >
      <!-- 自定义 header -->
      <div class="drawer-header">
        {{ abilityDetail?.name || '加载中...' }}
        <el-button
          icon="el-icon-close"
          class="close-btn"
          circle
          size="small"
          @click="openDrawer = false"
        />
      </div>

      <!-- 内容 -->
      <div class="drawer-body">
        <div v-if="abilityDetail">
          <p class="field"><strong>中文：</strong><el-tag>{{ abilityDetail.name }}</el-tag></p>
          <p class="field"><strong>描述：</strong>{{ abilityDetail.text }}</p>
          <p class="field"><strong>效果：</strong></p>
          <pre class="effect">{{ abilityDetail.effect }}</pre>
          <p class="field"><strong>同特性宝可梦：</strong></p>
          <ul class="pokemon-list">
            <li v-for="poke in abilityDetail.pokemon || []" :key="poke.index">
              <span class="poke-index">{{ poke.index }}</span> - 
              <span class="poke-name">{{ poke.name }}</span> 
              (<span class="poke-types">{{ poke.types.join('/') }}</span>)
            </li>
          </ul>
        </div>
        <div v-else class="loading">
          数据加载中...
        </div>
      </div>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { AbilityListItem, AbilityDetail } from "@renderer/interface/ability"
import AbilityList from "@renderer/assets/data/ability_list.json"
import getAbilityJsonMap from "@renderer/utils/abilityJsonMap"

const props = defineProps<{ ability: AbilityListItem }>()

const openDrawer = ref(false)
const abilityDetail = ref<AbilityDetail | undefined>(undefined)

const getAbilityFileName = (name: string) => {
  const ab = AbilityList.find(a => a.name === name)
  return ab ? `${ab.index}-${name}` : name
}

const loadAbility = async (name: string | undefined) => {
  if (!name) return
  const fileName = getAbilityFileName(name)
  try {
    const data = await getAbilityJsonMap(fileName)
    abilityDetail.value = data
  } catch (err) {
    console.error('加载特性数据失败:', err)
    abilityDetail.value = undefined
  }
}

const clickCard = async () => {
  openDrawer.value = true
  await loadAbility(props.ability.name)
}
</script>

<style scoped>
/* 卡片 */
.ability-card {
  cursor: pointer;
  padding: 16px;
  border-radius: 12px;
  background-color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.ability-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.ability-header {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
}

.ability-desc {
  font-size: 12px;
  color: #555;
  min-height: 32px;
}

/* 抽屉 header */
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  padding: 16px 24px;
  border-bottom: 1px solid #ebeef5;
  color: #303133;
}

/* 关闭按钮 */
.close-btn {
  color: #909399;
  background: transparent;
}

/* 抽屉 body */
.drawer-body {
  padding: 20px 24px;
  color: #303133;
  max-height: 80vh;
  overflow-y: auto;
}

/* 字段 */
.field {
  margin-bottom: 12px;
  line-height: 1.6;
}

/* 效果文本 */
.effect {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 6px;
  white-space: pre-wrap;
  color: #606266;
}

/* 宝可梦列表 */
.pokemon-list {
  list-style: disc;
  padding-left: 20px;
  color: #606266;
}

.pokemon-list li {
  margin-bottom: 6px;
}

.poke-index {
  font-weight: 600;
}

.poke-name {
  color: #409eff;
}

.poke-types {
  font-style: italic;
  color: #909399;
}

/* 加载中 */
.loading {
  text-align: center;
  color: #909399;
  padding: 50px 0;
  font-size: 14px;
}
</style>
