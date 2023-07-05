<script setup lang="ts">

import { Character } from '~/common/types'

const props = defineProps<{
    character: Character
}>()
</script>

<template>
    <div class="bg-[#242731] h-[24rem] w-[16rem] rounded-3xl mt-8">
        <div class="w-[85%] h-[12rem] mx-auto pt-4">
            <div class="">
                <el-avatar :size="220" :src="character.portraitUrl" fit="fill" />
            </div>
            <div class="text-white h-12 flex flex-col justify-center">{{ character.name }}</div>
            <div class="text-[#A7A9AD] text-xs h-8">{{ character.tags }}</div>
            <div class="h-16 flex flex-col justify-center">
                <div>
                    <Icon name="material-symbols:account-circle" color="white" class="w-6 h-6"></Icon>
                    <text class="text-[#A7A9AD] text-xs pl-4">@{{ character.name }}</text>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* 覆盖el-avatar的size设定，原来只可以按照px来设计固定大小，无法按比例设置，按比例的话可以保持和父div的自适应 */
/* .el-avatar {
    --el-avatar-size: 100%
} */
</style>