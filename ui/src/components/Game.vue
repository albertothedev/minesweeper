<template>
  <div :class="`game game--${gameMode}`">
    <GameSelection />
    <Scoreboard />
    <Board
      @setGameState="(state) => (gameState = state)"
      :gameState="gameState"
      :board="board"
    />
  </div>
</template>

<script lang="ts">
import axios, { AxiosResponse, AxiosError } from "axios";
import { useStore } from "vuex";
import { defineComponent, ref, provide, inject, computed } from "vue";

import Board from "./Game/Board.vue";
import Scoreboard from "./Game/Scoreboard.vue";
import GameSelection from "./Game/GameSelection.vue";

import { TCell, TAdjacentCell, TGame } from "../types/index";

import face from "../assets/face.png";
import faceLoss from "../assets/faceLoss.png";
import faceWin from "../assets/faceWin.png";
import faceFlag from "../assets/faceFlag.png";

export default defineComponent({
  components: {
    GameSelection,
    Scoreboard,
    Board,
  },
  setup(props, context) {
    const store = useStore();

    const dataFetched = computed(() => store.state.dataFetched);
    const setDataFetched = (state: boolean) =>
      store.commit("setDataFetched", state);
    const games = computed(() => store.state.games);
    const setGames = (games: Array<TGame>) => store.commit("setGames", games);
    const addGame = (game: TGame) => store.commit("addGame", game);

    let time = ref<number>(0);
    let minesLeft = ref<number>(10);
    let flagsLeft = ref<number>(10);
    let gameState = ref<"waiting" | "playing" | "over">("waiting");
    let minedCells = ref<Array<string>>([]);
    let flaggedCells = ref<Array<string>>([]);
    let gameMode = ref<"easy" | "medium" | "hard">("easy");
    let boardSize = ref<{ rows: number; columns: number }>({
      rows: 9,
      columns: 9,
    });
    let board = ref<Array<TCell>>([]);
    let currentFace = ref<string>(face);
    let maxTime = ref<number>(999);

    const openModal: any = inject("openModal");

    provide("leftClick", leftClick);
    provide("rightClick", rightClick);
    provide("init", init);
    provide("incrementTime", incrementTime);
    provide("endGame", endGame);
    provide("isGameOver", isGameOver);

    provide("gameMode", gameMode);
    provide("currentFace", currentFace);
    provide("flagsLeft", flagsLeft);
    provide("gameState", gameState);
    provide("time", time);

    function incrementTime() {
      time.value++;
    }

    function endGame() {
      gameState.value = "over";
      currentFace.value = faceLoss;
    }

    function init(buttonType: "easy" | "medium" | "hard") {
      time.value = 0;
      flaggedCells.value = [];
      minedCells.value = [];
      gameState.value = "waiting";
      currentFace.value = face;
      board.value = [];

      switch (buttonType) {
        case "easy":
          boardSize.value = { rows: 9, columns: 9 };
          minesLeft.value = 10;
          flagsLeft.value = 10;
          gameMode.value = "easy";
          break;

        case "medium":
          boardSize.value = { rows: 16, columns: 16 };
          minesLeft.value = 40;
          flagsLeft.value = 40;
          gameMode.value = "medium";
          break;

        case "hard":
          boardSize.value = { rows: 16, columns: 30 };
          minesLeft.value = 99;
          flagsLeft.value = 99;
          gameMode.value = "hard";

          break;
      }

      let cells: Array<TCell> = [];

      for (let i = 1; i <= boardSize.value.rows; i++)
        for (let j = 1; j <= boardSize.value.columns; j++)
          board.value.push({
            id: `cell-${i}-${j}`,
            row: i,
            column: j,
            open: false,
            flagged: false,
            mined: false,
            adjacentMines: 0,
          });

      for (let i = 0; i < minesLeft.value; i++) {
        let randomCell: number = Math.floor(Math.random() * board.value.length);

        while (board.value[randomCell].mined)
          randomCell = Math.floor(Math.random() * board.value.length);

        board.value[randomCell].mined = true;
        minedCells.value.push(board.value[randomCell].id);

        Object.values(getAdjacentCells(board.value[randomCell].id)).forEach(
          (adjacentCell) => {
            if (adjacentCell)
              board.value[getBoardPosition(adjacentCell)].adjacentMines++;
          }
        );
      }
    }

    init("easy");

    function leftClick(e: any) {
      e.preventDefault();

      const cell: TCell = board.value[getBoardPosition(e.target.id)];

      if (gameState.value === "over" || cell.open || cell.flagged) return;

      if (gameState.value === "waiting") gameState.value = "playing";

      function isCellEmpty(adjacentCells: TAdjacentCell) {
        for (let id of Object.values(adjacentCells)) {
          if (id === null) continue;

          let cell = board.value[getBoardPosition(id)];

          if (cell.open || cell.flagged || cell.mined) continue;

          board.value[getBoardPosition(id)].open = true;

          if (!cell.adjacentMines) isCellEmpty(getAdjacentCells(id));
        }
      }

      if (!cell.mined) {
        cell.open = true;

        if (!getAdjacentMines(cell.id)) isCellEmpty(getAdjacentCells(cell.id));
      }

      if (cell.mined) {
        currentFace.value = faceLoss;
        gameState.value = "over";

        for (let i: number = 0; i < flaggedCells.value.length; i++)
          if (!board.value[getBoardPosition(flaggedCells.value[i])].mined)
            board.value[getBoardPosition(flaggedCells.value[i])].open = true;

        for (let j: number = 0; j < minedCells.value.length; j++)
          if (!board.value[getBoardPosition(minedCells.value[j])].flagged)
            board.value[getBoardPosition(minedCells.value[j])].open = true;
      }

      isGameWon(cell, "left");
    }

    function rightClick(e: any): void {
      const cell: TCell = board.value[getBoardPosition(e.target.id)];

      if (gameState.value === "over" || cell.open) return;

      if (gameState.value === "waiting") gameState.value = "playing";

      if (cell.flagged) {
        flaggedCells.value.splice(flaggedCells.value.indexOf(cell.id), 1);
        flagsLeft.value++;
        cell.flagged = false;
      } else if (!cell.flagged && flagsLeft.value > 0) {
        flaggedCells.value.push(cell.id);
        flagsLeft.value--;
        cell.flagged = true;
      }

      if (!isGameWon(cell, "right")) {
        if (flagsLeft.value > 0) currentFace.value = faceFlag;

        setTimeout(() => (currentFace.value = face), 300);
      }
    }

    function isGameWon(cell: TCell, click: "left" | "right") {
      if (
        board.value.filter((elm: TCell) => elm.open && !elm.mined).length ===
          board.value.length - minesLeft.value ||
        board.value.filter((elm: TCell) => elm.flagged && elm.mined).length ===
          minesLeft.value
      ) {
        setDataFetched(false);

        currentFace.value = faceWin;

        const token: string = document.cookie;

        axios
          .post(
            `${process.env.VUE_APP_MINESWEEPER_API_URL}/saveGame`,
            {
              token,
              gameMode: gameMode.value,
              time: time.value,
            },
            { withCredentials: true }
          )
          .then((res: AxiosResponse) => {
            addGame({
              username: res.data.username,
              gameMode: gameMode.value,
              time: time.value,
            });
            setDataFetched(true);
            openModal(res.data.message);
          })
          .catch((error: AxiosError) => {
            console.error(error);
            openModal(error.response!.data.message);
          });

        gameState.value = "over";

        return true;
      }
    }

    function isGameOver(): void {
      if (time.value === maxTime.value) {
        currentFace.value = faceLoss;
        gameState.value = "over";
      }
    }

    function getBoardPosition(id: string) {
      return board.value.findIndex((cell: TCell) => cell.id === id);
    }

    function getAdjacentCells(id: string): TAdjacentCell {
      let row: number = parseInt(id.match(/\d+/g)![0]);
      let column: number = parseInt(id.match(/\d+/g)![1]);

      let adjacentCells: TAdjacentCell = {
        topLeft: null,
        topCenter: null,
        topRight: null,
        middleLeft: null,
        middleRight: null,
        bottomLeft: null,
        bottomCenter: null,
        bottomRight: null,
      };

      if (row !== 1) {
        adjacentCells.topCenter = `cell-${row - 1}-${column}`;

        if (column !== 1)
          adjacentCells.topLeft = `cell-${row - 1}-${column - 1}`;

        if (column !== boardSize.value.columns)
          adjacentCells.topRight = `cell-${row - 1}-${column + 1}`;
      }

      if (row !== boardSize.value.rows) {
        adjacentCells.bottomCenter = `cell-${row + 1}-${column}`;

        if (column !== 1)
          adjacentCells.bottomLeft = `cell-${row + 1}-${column - 1}`;

        if (column !== boardSize.value.columns)
          adjacentCells.bottomRight = `cell-${row + 1}-${column + 1}`;
      }

      if (column !== 1) adjacentCells.middleLeft = `cell-${row}-${column - 1}`;

      if (column !== boardSize.value.columns)
        adjacentCells.middleRight = `cell-${row}-${column + 1}`;

      return adjacentCells;
    }

    function getAdjacentMines(cellID: string): number {
      let adjacentCells: TAdjacentCell = getAdjacentCells(cellID);
      let adjacentMines: number = 0;

      Object.entries(adjacentCells).forEach((entry) => {
        if (entry[1] && board.value[getBoardPosition(entry[1])].mined)
          adjacentMines++;
      });

      return adjacentMines;
    }

    return {
      time,
      minesLeft,
      flagsLeft,
      gameState,
      minedCells,
      flaggedCells,
      gameMode,
      boardSize,
      board,
      currentFace,
      init,
      leftClick,
      rightClick,
      getBoardPosition,
      getAdjacentCells,
      getAdjacentMines,
      isGameOver,
      isGameWon,
      dataFetched,
      setDataFetched,
      games,
      setGames,
      addGame,
    };
  },
});
</script>
