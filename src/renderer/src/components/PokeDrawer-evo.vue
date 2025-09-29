<template>
    <div class="evolution-chains">
      <div 
            class="evolution-chain" 
            v-for="(chain, index) in props.PokeData?.evolution_chains" 
            :key="index"
        >
            <div 
            class="evolution-stage" 
            v-for="(stage, idx) in chain" 
            :key="idx"
            > 
            <!-- 精灵展示 -->
            <div v-if="stage.text" class="evolution-stage-text">--{{ stage.text }}--></div>
            <div class="evolution-stage-img">
                <div class="poke-name">{{ stage.name }}</div>
                <el-image 
                :src="getDreamImgMap(stage.image)" 
                :alt="stage.name" 
                class="poke-img"
                />
            </div>

            
            </div>
      </div> 
    </div>   
</template>

<script lang="ts" setup>
import { defineProps, PropType } from 'vue';
import type { Pokemon } from '@renderer/interface/pokedata';
import getDreamImgMap from '@renderer/utils/imgDreamMap'

const props = defineProps({
  
  PokeData: { type: Object as PropType<Pokemon> },
  
})

</script>

<style scoped>
.evolution-chains{
  display: flex;
  flex-direction: column;
  color: #000;
  padding:16px;
  border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.05);
  background:#fff;
}

.evolution-chain{
  display: flex;
  align-items: top;
  margin-bottom: 16px;
}
.evolution-stage{
  display: flex;
  align-items: center;
  margin-right: 16px;
}
.evolution-stage-img {
  display: flex;
  flex-direction: column;
  align-items: center;
}


.evolution-stage-text{
  font-size: 14px;
  color: #666;
  margin: 0 8px;
}
</style>