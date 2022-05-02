<template>
  <div :class="`user user--${userMode}`">
    <div class="user__buttons" v-if="userMode === 'signIn' || userMode === 'signUp'">
      <button @click="userMode = 'signIn'" :class="`user__buttons__button ${userMode === 'signIn' ? 'user__buttons__button--active' : ''}`">
        SIGN IN
      </button>

      <button @click="userMode = 'signUp'" :class="`user__buttons__button ${userMode === 'signUp' ? 'user__buttons__button--active' : ''}`">
        SIGN UP
      </button>
    </div>

    <form class="user__signIn" v-if="userMode === 'signIn'" @submit.prevent="signIn">
      <input className="user__signIn__username" type="text" name="name" placeholder="USERNAME" required />
      <input className="user__signIn__password" type="password" name="password" placeholder="PASSWORD" required />

      <button class="user__signIn__submit">SUBMIT</button>
    </form>

    <form class="user__signUp" v-if="userMode === 'signUp'" @submit.prevent="signUp">
      <input className="user__signUp__username" type="text" name="name" placeholder="USERNAME" required />
      <input className="user__signUp__password" type="password" name="password" placeholder="PASSWORD" required />
      <input className="user__signUp__confirmPassword" type="password" name="password" placeholder="CONFIRM PASSWORD" required />

      <button class="user__signUp__submit">SUBMIT</button>
    </form>

    <div class="user__welcome" v-if="userMode === 'welcome'">
      <p class="user__welcome__username">{{ usernameTemp }}</p>
      <button class="user__welcome__logOut" @click="logOut">LOG OUT</button>
    </div>
  </div>
</template>

<script lang="ts">
import axios, { AxiosResponse, AxiosError } from "axios";
import { defineComponent, onMounted, ref, inject } from "vue";

export default defineComponent({
  setup(props, context) {
    let userMode = ref<"signIn" | "welcome" | "signUp">("signIn");
    let usernameTemp = ref<string>("");

    const openModal: any = inject("openModal");

    onMounted(() =>
      axios
        .get(`${process.env.VUE_APP_MINESWEEPER_API_URL}/user`, {
          withCredentials: true,
        })
        .then((res: AxiosResponse) => {
          usernameTemp.value = res.data.username;
          userMode.value = "welcome";
        })
        .catch((error: AxiosError) => console.error(error))
    );

    function signIn(): void {
      const username: string = (<HTMLInputElement>document.querySelector(".user__signIn__username")).value.trim();
      const password: string = (<HTMLInputElement>document.querySelector(".user__signIn__password")).value.trim();

      if (username.length !== 0 && password.length !== 0)
        axios
          .post(
            `${process.env.VUE_APP_MINESWEEPER_API_URL}/signIn`,
            {
              username,
              password,
            },
            { withCredentials: true }
          )
          .then((res: AxiosResponse): void => {
            usernameTemp.value = res.data.username;
            userMode.value = "welcome";
          })
          .catch((error: any): void => openModal(error.response!.data.message));
      else openModal("please fill all fields");
    }

    function signUp(): void {
      const username: string = (<HTMLInputElement>document.querySelector(".user__signUp__username")).value.trim();
      const password: string = (<HTMLInputElement>document.querySelector(".user__signUp__password")).value.trim();
      const confirmPassword = (<HTMLInputElement>document.querySelector(".user__signUp__confirmPassword")).value.trim();

      if (password === confirmPassword && password.length !== 0 && confirmPassword.length !== 0 && username.length !== 0)
        axios
          .post(`${process.env.VUE_APP_MINESWEEPER_API_URL}/signUp`, { username, password }, { withCredentials: true })
          .then((res: AxiosResponse): void => {
            usernameTemp.value = res.data.username;
            userMode.value = "welcome";
            openModal(res.data.message);
          })
          .catch((error: any): void => openModal(error.response!.data.message));
      else if (password !== confirmPassword && password.length !== 0 && confirmPassword.length !== 0 && username.length !== 0)
        openModal("passwords do not match");
      else if (password.length === 0 || confirmPassword.length === 0 || username.length === 0) openModal("please fill all fields");
    }

    function logOut(): void {
      axios
        .get(`${process.env.VUE_APP_MINESWEEPER_API_URL}/logOut`, {
          withCredentials: true,
        })
        .then((): void => {
          usernameTemp.value = "";
          userMode.value = "signIn";
        });
    }

    return {
      userMode,
      usernameTemp,
      signIn,
      logOut,
      signUp,
    };
  },
});
</script>
