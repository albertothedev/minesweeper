<template>
  <form class="signIn" @submit.prevent="signIn">
    <input
      className="signIn__username"
      type="text"
      name="name"
      placeholder="USERNAME"
    />
    <input
      className="signIn__password"
      type="password"
      name="password"
      placeholder="PASSWORD"
    />

    <button class="signIn__submit">
      SUBMIT
    </button>
  </form>
</template>

<script lang="ts">
import axios, { AxiosResponse, AxiosError } from "axios";
import { defineComponent, ref, inject } from "vue";

export default defineComponent({
  setup(props, context) {
    const openModal: any = inject("openModal");

    function signIn(): void {
      const username: string = (<HTMLInputElement>(
        document.querySelector(".signIn__username")
      )).value.trim();
      const password: string = (<HTMLInputElement>(
        document.querySelector(".signIn__password")
      )).value.trim();

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
          .then((res: AxiosResponse): void =>
            context.emit("signIn", res.data.username)
          )
          .catch((error: AxiosError): void =>
            openModal(error.response!.data.message)
          );
      else openModal("please fill all fields");
    }

    return { signIn, openModal };
  },
});
</script>
