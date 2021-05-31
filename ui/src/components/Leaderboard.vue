<template>
  <div class="leaderboard">
    <div class="leaderboard__buttons">
      <button
        @click="getType = 'easy'"
        :class="
          `leaderboard__buttons__button ${
            getType === 'easy' ? 'leaderboard__buttons__button--active' : ''
          }`
        "
      >
        EASY
      </button>
      <button
        @click="getType = 'medium'"
        :class="
          `leaderboard__buttons__button ${
            getType === 'medium' ? 'leaderboard__buttons__button--active' : ''
          }`
        "
      >
        MEDIUM
      </button>
      <button
        @click="getType = 'hard'"
        :class="
          `leaderboard__buttons__button ${
            getType === 'hard' ? 'leaderboard__buttons__button--active' : ''
          }`
        "
      >
        HARD
      </button>
    </div>

    <div class="leaderboard__loading" v-if="!dataFetched">LOADING...</div>

    <ul class="leaderboard__rankings" v-if="dataFetched">
      <li
        class="leaderboard__rankings__game"
        v-for="(game, index) in games
          .filter((game) => game.gameMode === getType)
          .sort((a, b) => a.time - b.time)"
        :key="index"
      >
        <span class="leaderboard__rankings__game__player">{{
          game.username
        }}</span>
        <span class="leaderboard__rankings__game__time">{{
          convertTime(game.time)
        }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useStore } from "vuex";

import { TGame } from "../types/index";

export default defineComponent({
  setup() {
    const store = useStore();

    let getType = ref<"easy" | "medium" | "hard">("easy");
    let retrieved = ref<boolean>(false);

    const dataFetched = computed(() => store.state.dataFetched);
    const setDataFetched = (state: boolean) =>
      store.commit("setDataFetched", state);
    const games = computed(() => store.state.games);
    const setGames = (games: Array<TGame>) => store.commit("setGames", games);

    onMounted(() =>
      axios
        .get(`${process.env.VUE_APP_MINESWEEPER_API_URL}/leaderboard`, {
          withCredentials: true,
        })
        .then((res: AxiosResponse) => {
          setDataFetched(true);
          setGames(res.data);
        })
        .catch((error: AxiosError) => console.error(error))
    );

    function convertTime(gameTime: number): string {
      let newTime: string = "";

      if (Math.floor(gameTime / 60) === 0) newTime = "00:";
      else if (Math.floor(gameTime / 60) < 10)
        newTime += `0${Math.floor(gameTime / 60)}:`;
      else if (Math.floor(gameTime / 60) < 100)
        newTime += `${Math.floor(gameTime / 60)}:`;

      if (gameTime - Math.floor(gameTime / 60) * 60 === 0) newTime += "00";
      else if (gameTime - Math.floor(gameTime / 60) * 60 < 10)
        newTime += `0${gameTime - Math.floor(gameTime / 60) * 60}`;
      else newTime += gameTime - Math.floor(gameTime / 60) * 60;

      return newTime;
    }

    return {
      getType,
      retrieved,
      convertTime,
      dataFetched,
      setDataFetched,
      games,
      setGames,
    };
  },
});
</script>
