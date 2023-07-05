<script lang="ts">
// 还是vue2的方式好用, vue3+ts+setup的写法不太好排查问题
// Home页的list列表页
export default {
  data() {
    return {
      characterList: []
    }
  },

  // mounted数据和html渲染是异步执行的，所以可以做到先渲染出HTML框架，再加载数据填充进页面
  async mounted() {
    this.characterList = await this.listCharacteHome()
  },
  methods: {
    async _listCharacterHome() {
      return await $fetch(useRuntimeConfig().public.apiBaseUrl + "/character/listCharacters", {
        method: "POST",
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          "listCharacterTypeEnum": "HOME"
        })
      })
    },

    async listCharacteHome() {
      let res = await this._listCharacterHome()
      let jsonObject = JSON.parse(JSON.stringify(res))
      if (jsonObject['code'] == 0) {
        let _list = JSON.parse(JSON.stringify(jsonObject['data']['characterDTOList']))
        return _list
      }
      return
    },
  }
}

</script>

<template>
  <div class="mx-auto h-full w-full">
    <div class="flex flex-wrap justify-between overflow-auto h-full w-full px-[5%]">
      <div v-for="(_character, index) in characterList">
        <CharacterInfo v-bind:character=_character></CharacterInfo>
      </div>
    </div>
  </div>
</template>

<style>
</style>