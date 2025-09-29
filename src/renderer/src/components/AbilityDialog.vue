<template>
  <div>
    <!-- ability1 是对象 -->
    <el-tag
      v-if="abilityPropObj"
      @click="openDialog = true"
      class="ability-tag"
      size="small"
      :type="abilityPropObj.is_hidden ? 'warning' : 'success'"
    >
      {{ abilityPropObj.name }}
      <span v-if="abilityPropObj.is_hidden">(隐藏)</span>
    </el-tag>

    <!-- ability2 是字符串 -->
    <el-dialog v-model="openDialog" :title="abilityDetail?.name || '特性详情'" width="500px">
      <div v-if="abilityDetail">
        <p><strong>中文：</strong>{{ abilityDetail.name }}</p>
        <p><strong>描述：</strong>{{ abilityDetail.text }}</p>
        <p><strong>效果：</strong></p>
        <pre style="white-space: pre-wrap;">{{ abilityDetail.effect }}</pre>
        <p><strong>同特性宝可梦：</strong></p>
        <ul>
          <li v-for="poke in abilityDetail.pokemon" :key="poke.index">
            {{ poke.index }} - {{ poke.name }} ({{ poke.types.join('/') }})
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import type { ability } from "@renderer/interface/pokedata"
import type { AbilityDetail } from "@renderer/interface/ability"
import getAbilityJsonMap from "@renderer/utils/abilityJsonMap"
import AbilityList from "@renderer/assets/data/ability_list.json"

const props = defineProps<{
  ability1: ability,  // 对象

}>()

const openDialog = ref(false)
const abilityDetail = ref<AbilityDetail | undefined>(undefined)

const abilityPropObj = props.ability1


const getAbilityFileName = (name: string) => {
  const ab = AbilityList.find(a => a.name === name)
  return ab ? `${ab.index}-${name}` : name
}

const loadAbility = async (name: string | undefined) => {
  if (!name) return
  const fileName = getAbilityFileName(name)
  abilityDetail.value = await getAbilityJsonMap(fileName)
}

// 初始化
onMounted(() => {
  loadAbility(abilityPropObj.name)
 
})


</script>

<style scoped>
.ability-tag {
  cursor: pointer;
  margin-right: 4px;
}
</style>
