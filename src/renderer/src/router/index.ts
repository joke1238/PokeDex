import {createRouter, createWebHistory} from 'vue-router'
import Home from '@renderer/views/Home.vue'
import Boss from '@renderer/views/Boss.vue'
import LevelElffect from '@renderer/views/LevelEffect.vue'
import Pokedex from '@renderer/views/Pokedex.vue'
import AbilityShow from '@renderer/views/AbilityShow.vue'
import MoveShow from '@renderer/views/MoveShow.vue'
import ItemShow from '@renderer/views/ItemShow.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            children: [
                {
                    path: 'boss',
                    name: 'boss',
                    component: Boss
                },{
                    path: 'level-effect',
                    name: 'level-effect',
                    component: LevelElffect
                },{
                    path: 'pokedex',
                    name: 'pokedex',
                    component: Pokedex
                },{
                    path:'ability',
                    name:'ability',
                    component:AbilityShow
                },{
                    path:'move',
                    name:'move',
                    component:MoveShow
                },{
                    path:'item',
                    name:'item',
                    component:ItemShow
                }
            ]
        }
    ]
})

export default router