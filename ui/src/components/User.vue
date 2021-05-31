<template>
  <div :class="`user user--${userMode}`">
    <div
      class="user__buttons"
      v-if="userMode === 'signIn' || userMode === 'signUp'"
    >
      <button
        @click="userMode = 'signIn'"
        :class="
          `user__buttons__button ${
            userMode === 'signIn' ? 'user__buttons__button--active' : ''
          }`
        "
      >
        SIGN IN
      </button>

      <button
        @click="userMode = 'signUp'"
        :class="
          `user__buttons__button ${
            userMode === 'signUp' ? 'user__buttons__button--active' : ''
          }`
        "
      >
        SIGN UP
      </button>
    </div>

    <SignIn v-if="userMode === 'signIn'" @signIn="signIn" />

    <SignUp v-if="userMode === 'signUp'" @signUp="signIn" />

    <Welcome
      v-if="userMode === 'welcome'"
      @logOut="logOut"
      :username="username"
    />
  </div>
</template>

<script lang="ts">
import axios, { AxiosResponse, AxiosError } from "axios";
import { defineComponent, onMounted, ref, reactive } from "vue";

import SignIn from "./User/SignIn.vue";
import SignUp from "./User/SignUp.vue";
import Welcome from "./User/Welcome.vue";

export default defineComponent({
  components: {
    SignIn,
    SignUp,
    Welcome,
  },

  setup(props, context) {
    let userMode = ref<"signIn" | "welcome" | "signUp">("signIn");
    let username = ref<string>("");

    function signIn(param: string): void {
      username.value = param.toUpperCase();
      userMode.value = "welcome";
    }

    function logOut(): void {
      username.value = "";
      userMode.value = "signIn";
    }

    onMounted(() =>
      axios
        .get(`${process.env.VUE_APP_MINESWEEPER_API_URL}/user`, {
          withCredentials: true,
        })
        .then((res: AxiosResponse) => {
          username.value = res.data.username;
          userMode.value = "welcome";
        })
        .catch((error: AxiosError) => console.error({ error }))
    );

    return {
      userMode,
      username,
      signIn,
      logOut,
    };
  },
});
</script>
