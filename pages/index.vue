<script setup lang="ts">

import { sleep } from '/common/utils'

const route = useRoute()

let email = ref("")
let password = ref("");
let loginError1 = ref(false);
let loginError2 = ref(false);
let errorArray: any[] = [ref(false), ref(false), ref(false), ref(false)]

async function _login(_user: string, _pwd: string) {
  return await $fetch("https://chat-test.ursai.xyz/urs/account/login", {
    method: "POST",
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      "userNameOrEmail": `${_user}`,
      "password": `${_pwd}`
    })
  })
}

function login() {
  console.log(email.value)
  console.log(password.value)
  _login(email.value, password.value).then((res) => {
    let jsonObject = JSON.parse(JSON.stringify(res))
    console.log(jsonObject["code"])
    let code = jsonObject["code"]
    if (code != 0) {
      // 找到一个最近一个正在展现的div,它的前一个即可用于展现新的Error
      let i = 0
      for (i = 1; i < errorArray.length; i++) {
        if (errorArray[i].value == true) {
          break
        }
      }
      // 把可用的div设置可见，执行动画，5s后恢复不可见状态
      errorArray[i-1].value = true
      console.log(errorArray[0].value, errorArray[1].value, errorArray[2].value, errorArray[3].value)
      sleep(5000).then(() => errorArray[i-1].value = false)
    } else {
      localStorage.setItem('token', jsonObject["data"]["token"])
      localStorage.setItem('accountId', jsonObject["data"]["accountId"])
      navigateTo('/home')
    }
    console.log(jsonObject)
  })
}
</script>

<template>
  
  <!-- 错误提示框 -->
  <div class="fixed ml-auto mr-auto left-0 right-0 w-1/4">
    <div v-for="loginError in errorArray">
    <div v-if="loginError.value === true" class="animate-duration-500 animate-fill-forwards animate-[jump-in_2s,jump-out_2s_3s] flex flex-row justify-center top-0 bg-white mt-4 p-4 rounded-xl">
      <Icon class="mb-1" name="ri:alert-fill" color="red"></Icon>
      <text class="text-black">  Incorrect Username Or Password</text>
    </div>
  </div>
  </div>

  <div style="background-color: #1F2128;">
    <div class="flex flex-row justify-between py-12 pl-12">
      <nuxt-img
        src="/static/logo.png"
        width="80%"
        height="80%"
        format="png"
      />
    </div>

    <div class="flex flex-row justify-between">
      <div class="w-full flex justify-center">
        <nuxt-img
          src="/static/index_lef.png"
          format="png"
        /> 
      </div>
      <div class="w-full flex justify-center">
        <!-- 右侧登录框外部 -->
        <div class="h-4/5 rounded-3xl mx-a" style="background-color: #242731; width:60%">
          <!-- 右侧登录框内部 -->
          <div class="h-full" style="padding: 10%;">
            <!-- 所有组件垂直居中靠拢 -->
            <div class="h-full flex flex-col justify-center">
              <div class="h-full flex flex-col justify-around">
                <div class="text-[40px] text-white font-[600]" style="font-family: Poppins-Regular;">Sign in</div>
                <div class="text-[12px] text-[#808191]">New User <text class="text-[#25D4D0]">Create an account</text></div>
              </div>
              <div class="h-full flex flex-col justify-around">
                <!-- 文字部分再次使用flex做垂直居中 -->
                <div class="flex flex-col justify-center h-1/2">
                  <div class="text-2 text-[#808191]">Username or email</div>
                </div>
                <div style="height:50%">
                  <input class="h-full w-full rounded-xl text-white px-6" type="text" required id="name" style="background-color: #2E303A;" v-model="email">
                </div>
              </div>
              <div class="h-full flex flex-col justify-between">
                <div class="flex flex-col justify-center h-1/2">
                  <div class="text-2 text-[#808191]">Password</div>
                </div>
                <div class="h-1/2">
                  <input class="h-full w-full rounded-2xl text-white px-6" type="text" id="name" style="background-color: #2E303A;" v-model="password">
                </div>
              </div>
              <div class="h-full flex flex-col justify-center">
                <button type="button" class="rounded-2xl h-1/2 bg-[#25D4D0]" @click="login">Continue</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    
  </div>
  
</template>