<template>
  <form class="signUp" @submit.prevent="signUp">
    <input
      className="signUp__username"
      type="text"
      name="name"
      placeholder="USERNAME"
    />
    <input
      className="signUp__password"
      type="password"
      name="password"
      placeholder="PASSWORD"
    />
    <input
      className="signUp__confirmPassword"
      type="password"
      name="password"
      placeholder="CONFIRM PASSWORD"
    />

    <button class="signUp__submit">SUBMIT</button>
  </form>
</template>

<script lang="ts">
import axios, { AxiosError, AxiosResponse } from "axios";
import { defineComponent, inject } from "vue";

export default defineComponent({
  setup(props, context) {
    const openModal: any = inject("openModal");

    function signUp(): void {
      const username: string = (<HTMLInputElement>(
        document.querySelector(".signUp__username")
      )).value.trim();
      const password: string = (<HTMLInputElement>(
        document.querySelector(".signUp__password")
      )).value.trim();
      const confirmPassword = (<HTMLInputElement>(
        document.querySelector(".signUp__confirmPassword")
      )).value.trim();

      if (
        password === confirmPassword &&
        password.length !== 0 &&
        confirmPassword.length !== 0 &&
        username.length !== 0
      )
        axios
          .post(
            `${process.env.VUE_APP_MINESWEEPER_API_URL}/signUp`,
            { username, password },
            { withCredentials: true }
          )
          .then((res: AxiosResponse): void => {
            context.emit("signUp", res.data.username);
            openModal(res.data.message);
          })
          .catch((error: AxiosError): void =>
            openModal(error.response!.data.message)
          );
      else if (
        password !== confirmPassword &&
        password.length !== 0 &&
        confirmPassword.length !== 0 &&
        username.length !== 0
      )
        openModal("passwords do not match");
      else if (
        password.length === 0 ||
        confirmPassword.length === 0 ||
        username.length === 0
      )
        openModal("please fill all fields");
    }

    return { signUp };
  },
});
</script>
