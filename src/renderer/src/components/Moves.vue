<template>
    <el-collapse accordion>
        <el-collapse-item title="升级技能" name="learned">
            <el-table :data="props.PokeData?.moves.learned[0].data">
                <el-table-column prop="level_learned_at" label="等级" />
                <el-table-column prop="name" label="技能">
                    <template #default="scope">
                        <img :src="getMoveImgMap(types[scope.row.type])" style="width: 20px; height: 20px; margin-right: 5px;">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="属性" >
                    <template #default="scope"> 
                        <el-tag :style="{ backgroundColor: typeColors[scope.row.type], color: '#fff' }">
                            {{ scope.row.type }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="category" label="分类" >
                    <template #default="scope">
                        <el-tag :style="{ backgroundColor: categoryColors[scope.row.category], color: '#fff' }">
                            {{ scope.row.category }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="power" label="威力" />
                <el-table-column prop="accuracy" label="命中" />
                <el-table-column prop="pp" label="PP" />
            </el-table>
        </el-collapse-item>

        <el-collapse-item title="学习器技能" name="machine">
            <el-table :data="props.PokeData?.moves.machine[0].data">
                <el-table-column prop="name" label="技能" >
                <template #default="scope">
                    <img :src="getMoveImgMap(types[scope.row.type])" style="width: 20px; height: 20px; margin-right: 5px;">
                    {{ scope.row.name }}
                </template>
                </el-table-column>
                <el-table-column prop="type" label="属性" >
                    <template #default="scope"> 
                        <el-tag :style="{ backgroundColor: typeColors[scope.row.type], color: '#fff' }">
                            {{ scope.row.type }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="category" label="分类" >
                    <template #default="scope">
                        <el-tag :style="{ backgroundColor: categoryColors[scope.row.category], color: '#fff' }">
                            {{ scope.row.category }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="power" label="威力" />
                <el-table-column prop="accuracy" label="命中" />
                <el-table-column prop="pp" label="PP" />
            </el-table>
        </el-collapse-item>
    </el-collapse>


</template>

<script lang="ts" setup>
import { defineProps, PropType, reactive } from 'vue';
import type { Pokemon } from '@renderer/interface/pokedata';
import getMoveImgMap from '@renderer/utils/imgMoveMap';

const types = reactive({
    "一般": "Normal",
    "格斗": "Fighting",
    "飞行": "Flying",
    "毒": "Poison",
    "地面": "Ground",
    "岩石": "Rock",
    "虫": "Bug",
    "幽灵": "Ghost",
    "钢": "Steel",
    "火": "Fire",
    "水": "Water",
    "草": "Grass",
    "电": "Electric",
    "超能力": "Psychic",
    "冰": "Ice",
    "龙": "Dragon",
    "恶": "Dark",
    "妖精": "Psychic"
});

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


const categoryColors: Record<string, string> = {
  "物理": "#FF6F61",
  "特殊": "#6B5B95",
  "变化": "#88B04B"
};





const props = defineProps({
  PokeData: { type: Object as PropType<Pokemon> }
});

</script>