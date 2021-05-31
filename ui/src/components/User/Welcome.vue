<template>
  <div class="welcome">
    <p class="welcome__username">{{ username }}</p>
    <button class="welcome__logOut" @click="logOut">LOG OUT</button>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    username: String,
  },
  setup(props, context) {
    function logOut(): void {
      axios
        .get(`${process.env.VUE_APP_MINESWEEPER_API_URL}/logOut`, {
          withCredentials: true,
        })
        .then((): void => context.emit("logOut"));
    }

    return { logOut };
  },
});
</script>
