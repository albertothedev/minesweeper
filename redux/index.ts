import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TGame } from "types/index";

type TInitialState = {
  dataFetched: boolean;
  games: Array<TGame>;
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
  },
});

export const { setDataFetched, setGames, addGame } = rootSlice.actions;

const store = configureStore({ reducer: rootSlice.reducer });

export type RootState = TInitialState;

export default store;
