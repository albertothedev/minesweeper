import { createStore } from "vuex";

import { TGame } from "../types/index";

type TState = {
  dataFetched: boolean;
  games: Array<TGame>;
};

const store = createStore({
  state: <TState>{
    dataFetched: false,
    games: [],
  },
  mutations: {
    setDataFetched(state, payload: boolean) {
      state.dataFetched = payload;
    },
    setGames(state, payload: Array<TGame>) {
      state.games = payload;
    },
    addGame(state, payload: TGame) {
      state.games.push(payload);
    },
  },
  actions: {
    setDataFetched({ commit }, state) {
      commit("setDataFetched", state);
    },
    setGames({ commit }, games) {
      commit("setGames", games);
    },
    addGame({ commit }, game) {
      commit("addGame", game);
    },
  },
});

export default store;
