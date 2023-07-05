<!-- 聊天页面，左边是character列表页，右边是聊天框 -->
<script lang="ts">

export default {
    data() {
        return {
            characterList: [], // 角色列表
            menuActive: [true, false], // ALL/MY点击tab页状态
            menuActive0: true,
            menuActive1: false,

            currentCharacter: null, // 当前聊天角色

            input: "", // 聊天输入框

            dialogList: [], // 聊天记录,

            // chatContent: ref(null)
        }
    },

    async mounted() {
        this.characterList = await this.listCharacteHome()
    },

    methods: {
        async _listCharacterHome() {
            return await $fetch(useRuntimeConfig().public.apiBaseUrl + "/character/listCharacters", {
                method: "POST",
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0aW1lU3RhbXAiOjE2ODc5NTY2NzM2NzksImFjY291bnRJZCI6MzgsImV4cCI6MTY4ODU2MTQ3M30.VLBGX2i13T3N1Ketl8eWI7z1TWYSGi1mqxFtYvpjhcM'
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

        // ALL/MY点击事件
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
            console.log('menuActive0', this.menuActive0, 'menuActive1', this.menuActive1)
        },

        // 点击角色进入聊天页面事件
        clickCharacter(index: number) {
            this.currentCharacter = this.characterList[index]
            this.dialogList = []
            console.log(this.currentCharacter)
        },

        async _ask() {
            return await $fetch(useRuntimeConfig().public.apiBaseUrl + "/mvp/ask", {
                method: "POST",
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    "accountId": localStorage.getItem("accountId"),
                    "characterId": this.currentCharacter["characterId"],
                    "message": this.input
                })
            })
        },

        async chat() {
            console.log(this.input)
            this.dialogList.push({ "role": "user", "message": this.input.slice() })
            console.log(this.dialogList)
            this.input = ""
            this.$nextTick(() => {
                this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
                console.log('height', this.$refs.chatContent.scrollHeight, 'scrollTop', this.$refs.chatContent.scrollTop)
            })
            let res = await this._ask()
            let jsonObject = JSON.parse(JSON.stringify(res))
            if (jsonObject['code'] == 0) {
                let reply = JSON.parse(JSON.stringify(jsonObject['data']['answer']))
                console.log('reply', reply)
                this.dialogList.push({ "role": "character", "message": reply })
            }
            console.log('height', this.$refs.chatContent.scrollHeight, 'scrollTop', this.$refs.chatContent.scrollTop)
            this.$nextTick(() => {
                this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
                console.log('height', this.$refs.chatContent.scrollHeight, 'scrollTop', this.$refs.chatContent.scrollTop)
            })
        }
    }
}
</script>

<template>
    <!-- 每一个div都必须是h-full，这样才能铺满外面的div的整个高度，多余的就用滚动条展示 -->
    <el-row class="h-full">
        <el-col :span="8" class="w-full h-full overflow-auto">
            <div class="">
                <el-menu default-active="1" mode="horizontal" background-color="#1F2128" class="w-full el-hover-bg"
                    style="border-width: 0px;" @Select="handleMenuSelect">
                    <el-menu-item index="1" class="rounded-xl mt-6 w-[26%]"
                        v-bind:class="menuActive0 ? 'bg-[#20A6AF]' : 'bg-[#203339]'"
                        style="height: 3.5rem; margin-left: 1.25rem; margin-top: 1rem;"
                        :style="menuActive0 ? '--el-menu-hover-bg-color: #20A6AF' : '--el-menu-hover-bg-color: #1F2128'">
                        <span v-bind:class="menuActive0 ? 'text-[#FFFFFF]' : 'text-[#808191]'" class="font-[600]">ALL</span>
                    </el-menu-item>
                    <el-menu-item index="2" class="rounded-xl mt-6 w-[36%]"
                        v-bind:class="menuActive1 ? 'bg-[#20A6AF]' : 'bg-[#203339]'"
                        style="height: 3.5rem; margin-left: 1.25rem; margin-top: 1rem"
                        :style="menuActive1 ? '--el-menu-hover-bg-color: #20A6AF' : '--el-menu-hover-bg-color: #1F2128'">
                        <span v-bind:class="menuActive1 ? 'text-[#FFFFFF]' : 'text-[#808191]'" class="font-[600]">MY</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <div v-for="(_character, index) of characterList" class="mx-0 px-0 right-0 mt-8" @click="clickCharacter(index)">
                <el-row>
                    <el-col :span="6" class="flex justify-end">
                        <div><el-avatar :size="50" :src="_character.portraitUrl" fit="fill" class="" /></div>
                    </el-col>
                    <el-col :span="15" class="pl-4">
                        <div class="text-white">{{ _character.name }}</div>
                        <div class="text-[#808191] text-[0.9rem]">2 hours ago</div>
                    </el-col>
                    <el-col :span="3">
                        <Icon name="material-symbols:arrow-forward-ios-rounded" color="white"></Icon>
                    </el-col>
                </el-row>
            </div>
        </el-col>
        <!-- <div ref="chatContent"></div> -->
        <el-col :span="16" class="h-full pb-16">
            <div class="overflow-auto h-full" ref="chatContent">
                <div v-if="currentCharacter" class="text-white text-2xl font-[600] mt-4 px-4 py-4">
                    {{ currentCharacter.name }}
                </div>
                <div v-for="(dialog, index) of dialogList">
                    <div v-if="dialog.role === 'user'">
                        <div>
                            <el-row justify="end">
                                <el-col :span="14">
                                    <div class="text-white text-sm flex justify-end mr-4 h-10">
                                        userName
                                    </div>
                                    <div class="flex justify-end">
                                        <div
                                            class="text-[#808191] mr-4 bg-[#33343B] w-fit p-3 rounded-l-2xl rounded-br-2xl">
                                            {{ dialog.message }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="2"><el-avatar :size="60" src="/static/mini_avatar.png" /></el-col>
                            </el-row>
                        </div>
                    </div>
                    <div v-if="dialog.role === 'character'">
                        <div>
                            <el-row justify="start">
                                <el-col :span="2" class="ml-4"><el-avatar :size="60"
                                        :src="currentCharacter.portraitUrl" /></el-col>
                                <el-col :span="14">
                                    <div class="text-white text-sm flex justify-start mr-4 h-10">
                                        {{ currentCharacter.name }}
                                    </div>
                                    <div class="flex justify-start">
                                        <div class="text-white mr-4 bg-[#25D4D0] w-fit p-3 rounded-r-2xl rounded-bl-2xl">
                                            {{ dialog.message }}
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="currentCharacter" class="absolute bottom-0 right-[10%] h-[6vh] w-[50%] bg-[#1F2128]">
                <el-input v-model="input" placeholder="Type Message" clearable @keyup.enter.native="chat" />
            </div>
        </el-col>
    </el-row>
</template>

<style>
.el-input {
    --el-input-bg-color: #1F2128;
    --el-input-border-radius: 2rem;
}
</style>