import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TGame } from "types/index";

type TInitialState = {
  dataFetched: boolean;
  games: Array<TGame>;
  username?: string;
};

const initialState: TInitialState = {
  dataFetched: false,
  games: [],
};

const rootSlice = createSlice({
  name: "rootSlice",
  initialState,
  reducers: {
    setDataFetched: (state, action: PayloadAction<boolean>) =>
      void (state.dataFetched = action.payload),
    setGames: (state, action: PayloadAction<Array<TGame>>) =>
      void (state.games = action.payload),
    addGame: (state, action: PayloadAction<TGame>) =>
      void state.games.push(action.payload),
    setUsername: (state, action: PayloadAction<string>) =>
      void (state.username = action.payload),
  },
});

export const { setDataFetched, setGames, addGame, setUsername } =
  rootSlice.actions;

const store = configureStore({ reducer: rootSlice.reducer });

export type RootState = TInitialState;

export default store;
