<script lang="ts">

import { Character } from '~/common/types'

export default {
  data() {
    return {
      // v-bind无法使用数组下标方式，所以需要把数组中每个元素转成单独的变量使用
      menuActive: [true, false, false],
      menuActive0: true,
      menuActive1: false,
      menuActive2: false,
      count: 0,
      clickedCharacter: null
    }
  },
  beforeCreate() {
    this.menuActive = [true, false, false]
    console.log('created', this.menuActive)
  },
  methods: {
    handleMenuSelect(index: string) {
      console.log("handleMenuSelect", this.menuActive, index)
      for (var i = 0; i < this.menuActive.length; i++) {
        if (parseInt(index) - 1 == i) {
          this.menuActive[i] = true
        } else {
          this.menuActive[i] = false
        }
      }
      this.menuActive0 = this.menuActive[0]
      this.menuActive1 = this.menuActive[1]
      this.menuActive2 = this.menuActive[2]
    },

    // 接收CharacterList子组件返回的消息,这里是一个点击事件
    handleCharacterListMessage(_character: any) {
      console.log('handleCharacterListMessage', _character)
      this.clickedCharacter = _character
      this.handleMenuSelect("2")
    }
  }
}
</script>

<template>
  <div style="background-color: #1F2128;" class="h-[100vh]">
    <el-row :gutter="0">
      <el-col :span="4" class="border-r-[#33343B] border-r-[1px]">
        <div class="py-8 pl-8">
          <nuxt-img src="/static/logo.png" width="80%" height="80%" format="png" />
        </div>
        <div class="flex justify-center">
          <el-menu default-active="1" background-color="#1F2128" class="w-5/6 el-hover-bg" style="border-width: 0px;"
            @Select="handleMenuSelect">
            <el-menu-item index="1" v-bind:class="menuActive0 ? 'bg-[#20A6AF]' : 'bg-[#1F2128]'" class="rounded-xl mt-6" style="height: 4rem;" :style="menuActive0 ? '--el-menu-hover-bg-color: #20A6AF': '--el-menu-hover-bg-color: #1F2128'">
              <Icon class="w-6 h-6" name="material-symbols:home-rounded" color="white"></Icon>
              <span v-bind:class="menuActive0 ? 'text-[#FFFFFF]' : 'text-[#808191]'" class="font-[600] pl-4">Home</span>
            </el-menu-item>
            <el-menu-item index="2" v-bind:class="menuActive1 ? 'bg-[#20A6AF]' : 'bg-[#1F2128]'" class="rounded-xl mt-6" style="height: 4rem;" :style="menuActive1 ? '--el-menu-hover-bg-color: #20A6AF': '--el-menu-hover-bg-color: #1F2128'">
              <Icon class="w-6 h-6" name="ph:chat-circle-dots" color="white"></Icon>
              <span v-bind:class="menuActive1 ? 'text-[#FFFFFF]' : 'text-[#808191]'" class="font-[600] pl-4">Chats</span>
            </el-menu-item>
            <el-menu-item index="3" v-bind:class="menuActive2 ? 'bg-[#20A6AF]' : 'bg-[#1F2128]'" class="rounded-xl mt-6" style="height: 4rem;" :style="menuActive2 ? '--el-menu-hover-bg-color: #20A6AF': '--el-menu-hover-bg-color: #1F2128'">
              <Icon class="w-6 h-6" name="material-symbols:add-circle-outline" color="white"></Icon>
              <span v-bind:class="menuActive2 ? 'text-[#FFFFFF]' : 'text-[#808191]'" class="font-[600] pl-4">Create</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="border-b-[#33343B] border-b-[1px] h-[10vh]">
          <SearchBar></SearchBar>
        </div>
        <div v-if="menuActive0" class="h-[88vh] w-full"><CharacterList v-on:listenToCharacterListEvent="handleCharacterListMessage"></CharacterList></div>
        <div v-if="menuActive1" class="h-[88vh]"><ChatsChat :clickedCharacter="clickedCharacter"></ChatsChat></div>
        <!-- <div v-if="menuActive[2]"><CharacterList></CharacterList></div> -->
      </el-col>
    </el-row>
  </div>
</template>

<style>
</style>