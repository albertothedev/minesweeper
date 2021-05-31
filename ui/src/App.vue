<template>
  <div class="app">
    <Modal v-if="show" :message="message" />
    <User />
    <Game />
    <Leaderboard />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from "vue";
import { useStore } from "vuex";
import { computed } from "vue";

import Game from "./components/Game.vue";
import Leaderboard from "./components/Leaderboard.vue";
import User from "./components/User.vue";

import Modal from "./components/Modal.vue";

import "normalize.css";
import "./styles/main.scss";

export default defineComponent({
  components: {
    Game,
    Leaderboard,
    User,
    Modal,
  },
  setup(props, context) {
    provide("openModal", openModal);

    let message = ref<string>("");
    let show = ref<boolean>(false);

    function openModal(response: string): void {
      message.value = response.toUpperCase();
      show.value = true;

      setTimeout((): void => {
        message.value = "";
        show.value = false;
      }, 3000);
    }

    return {
      show,
      openModal,
      message,
    };
  },
});
</script>
