<script setup lang="ts">

import { sleep } from '/common/utils'

const route = useRoute()

let email = ref("")  // 登录邮箱
let password = ref(""); // 登录密码
let errorArray: any[] = [ref(false), ref(false), ref(false), ref(false)] // 登录错误提示框，支持多个错误连续显示
let username = ref("") // 注册时用户名
let passwordAgain = ref("") // 注册时确认密码
let isSignUp = ref(false) // 是否注册页
let isSignIn = ref(true) // 是否登录页
let wrongPassword = ref(false) // 密码是否错误
let duplicateUsername = ref(false) // 用户名是否重复
let duplicateEmail = ref(false) // email是否重复
let registerSuccess = ref(false) // 注册成功提示框

async function _login(_user: string, _pwd: string) {
  return await $fetch(useRuntimeConfig().public.apiBaseUrl + "/account/login", {
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

async function _register(_user: string, _email: string, _pwd: string) {
  return await $fetch(useRuntimeConfig().public.apiBaseUrl + "/account/register", {
    method: "POST",
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      "userName": `${_user}`,
      "email": `${_email}`,
      "password": `${_pwd}`
    })
  })
}

function register() {
  console.log("register", username.value, email.value, password.value, passwordAgain.value)
  if (password.value !== passwordAgain.value) {
    wrongPassword.value = true
    return 
  }
  _register(username.value, email.value, password.value).then((res) => {
    console.log(res)
    let jsonObject = JSON.parse(JSON.stringify(res))
    if (jsonObject["code"] != 0) {
      if (jsonObject["code"] == 113) {
        duplicateEmail.value = true
      }
      if (jsonObject["code"] == 114) {
        duplicateUsername.value = true
      }
      if (jsonObject["code"] == 102) {
        duplicateUsername.value = true
        duplicateEmail.value = true
      }
    } else {
      registerSuccess.value = true
    }
  })
}

function toSignUp() {
  isSignUp.value = true
  isSignIn.value = false
  email.value = ""
  username.value = ""
  password.value = ""
  passwordAgain.value = ""
}

function toSignIn() {
  isSignUp.value = false
  isSignIn.value = true
  email.value = ""
  username.value = ""
  password.value = ""
  passwordAgain.value = ""
}

function deleteWrongPasswordTips() {
  wrongPassword.value = false
}

function handleCloseTips() {
  registerSuccess.value = false
  isSignIn.value = true
  isSignUp.value = false
}

function deleteDuplicateUsernameTips() {
  duplicateUsername.value = false
}

function deleteDuplicateEmailTips() {
  duplicateEmail.value = false
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

  <!-- 注册成功提示框 -->
  <el-dialog v-model="registerSuccess" title="Create Account Sucess!" width="30%" :before-close="handleCloseTips">
  </el-dialog>

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
        <div class="rounded-3xl mx-a" style="background-color: #242731; width:60%">
          <!-- 右侧登录框内部 -->
          <div v-if="isSignIn" class="h-full" style="padding: 10%;">
            <!-- 所有组件垂直居中靠拢 -->
            <div class="h-full flex flex-col justify-center">
              <div class="h-full flex flex-col justify-around">
                <div class="text-[40px] text-white font-[600]" style="font-family: Poppins-Regular;">Sign in</div>
                <div class="text-[12px] text-[#808191]">New User <text class="text-[#25D4D0] cursor-pointer" @click="toSignUp">Create an account</text></div>
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
                  <input class="h-full w-full rounded-2xl text-white px-6" type="password" id="name" style="background-color: #2E303A;" v-model="password">
                </div>
              </div>
              <div class="h-full flex flex-col justify-center">
                <button type="button" class="rounded-2xl h-1/2 bg-[#25D4D0] text-white" @click="login">Continue</button>
              </div>
            </div>
          </div>

          <div v-if="isSignUp" class="p-[10%]">
            <div class="flex flex-col justify-center">
              <div class="text-[40px] text-white font-[600]" style="font-family: Poppins-Regular;">Sign Up</div>
              <div class="text-[12px] text-[#808191] mt-[1vh]">Already has account <text class="text-[#25D4D0] cursor-pointer" @click="toSignIn">Login now</text></div>
              <div class="text-2 text-[#808191] mt-[3vh]">Username</div>
              <input class="h-[6vh] w-full rounded-xl text-white px-6 mt-[1vh]" type="text" required id="name" style="background-color: #2E303A;" v-model="username" @keypress="deleteDuplicateUsernameTips">
              <div v-if="duplicateUsername" class="text-red-600 text-sm">duplicate username</div>
              <div class="text-2 text-[#808191] mt-[3vh]">Email Address</div>
              <input class="h-[6vh] w-full rounded-2xl text-white px-6 mt-[1vh]" type="text" id="name" style="background-color: #2E303A;" v-model="email" @keypress="deleteDuplicateEmailTips">
              <div v-if="duplicateEmail" class="text-red-600 text-sm">duplicate email</div>
              <div class="text-2 text-[#808191] mt-[2vh]">Password</div>
              <input class="h-[6vh] w-full rounded-2xl text-white px-6 mt-[1vh]" type="password" id="name" style="background-color: #2E303A;" v-model="password" @keypress="deleteWrongPasswordTips">
              <input class="h-[6vh] w-full rounded-2xl text-white px-6 mt-[2vh]" type="password" id="name" style="background-color: #2E303A;" v-model="passwordAgain" @keypress="deleteWrongPasswordTips">
              <div v-if="wrongPassword" class="text-red-600 text-sm">Inconsistent passwords</div>
              <button type="button" class="h-[8vh] rounded-2xl bg-[#25D4D0] text-white mt-[2vh]" @click="register">Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    
  </div>
  
</template>