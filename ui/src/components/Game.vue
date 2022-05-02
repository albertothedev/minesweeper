<template>
  <div :class="`game game--${gameMode}`">
    <div class="game__gameSelection">
      <button @click="init('easy')" :class="`game__gameSelection__button ${gameMode === 'easy' ? 'game__gameSelection__button--active' : ''}`">
        EASY
      </button>

      <button @click="init('medium')" :class="`game__gameSelection__button ${gameMode === 'medium' ? 'game__gameSelection__button--active' : ''}`">
        MEDIUM
      </button>

      <button @click="init('hard')" :class="`game__gameSelection__button ${gameMode === 'hard' ? 'game__gameSelection__button--active' : ''}`">
        HARD
      </button>
    </div>

    <div class="game__scoreboard">
      <div class="game__scoreboard__flags">{{ flagsLeft }}</div>
      <button class="game__scoreboard__faceButton" @click="() => init(gameMode)">
        <img class="game__scoreboard__faceButton__face" :src="currentFace" alt="Face" />
      </button>
      <div class="game__scoreboard__time">{{ time }}</div>
    </div>

    <div class="game__board">
      <div
        v-for="cell in board"
        :id="cell.id"
        :class="`game__board__cell${cell.open ? ' game__board__cell--open' : ''}`"
        @mousedown.left="(e) => leftClick(e)"
        @contextmenu.prevent="(e) => rightClick(e)"
      >
        <img
          v-if="cell.mined && !cell.flagged && cell.open && gameState === 'over' && clickedCellId !== cell.id"
          :src="mine"
          class="game__board__cell--mine"
          alt="Mine"
        />

        <img
          :src="mineClicked"
          v-if="cell.mined && !cell.flagged && cell.open && gameState === 'over' && clickedCellId === cell.id"
          class="game__board__cell--mine"
          alt="Mine"
        />

        <img
          v-if="!cell.mined && cell.flagged && cell.open && gameState === 'over'"
          :src="flagWrong"
          class="game__board__cell--mineClicked"
          alt="Mine exploded"
        />

        <img
          v-if="cell.adjacentMines && !cell.mined && cell.open && !cell.flagged"
          :src="numbers[cell.adjacentMines - 1]"
          class="game__board__cell--number"
          alt="Number of mines"
        />

        <img v-if="cell.flagged && !cell.open" :src="flag" class="game__board__cell--flag" alt="Flag" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios, { AxiosResponse, AxiosError } from "axios";
import { useStore } from "vuex";
import { defineComponent, ref, provide, inject, computed, onMounted } from "vue";

import { TCell, TAdjacentCell, TGame } from "../types/index";

import face from "../assets/face.png";
import faceLoss from "../assets/faceLoss.png";
import faceWin from "../assets/faceWin.png";
import faceFlag from "../assets/faceFlag.png";

import mine from "../assets/mine.png";
import mineClicked from "../assets/mineClicked.png";
import flagWrong from "../assets/flagWrong.png";
import flag from "../assets/flag.png";
import number1 from "../assets/number1.png";
import number2 from "../assets/number2.png";
import number3 from "../assets/number3.png";
import number4 from "../assets/number4.png";
import number5 from "../assets/number5.png";
import number6 from "../assets/number6.png";
import number7 from "../assets/number7.png";
import number8 from "../assets/number8.png";

export default defineComponent({
  setup(props, context) {
    const store = useStore();

    const dataFetched = computed(() => store.state.dataFetched);
    const setDataFetched = (state: boolean) => store.commit("setDataFetched", state);
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
    let clickedCellId = ref<string | null>(null);

    const openModal: any = inject("openModal");

    const numbers: Array<string> = [number1, number2, number3, number4, number5, number6, number7, number8];

    onMounted(() =>
      setInterval(() => {
        if (gameState.value === "playing") {
          time.value++;

          if (time.value === maxTime.value) {
            currentFace.value = faceLoss;
            gameState.value = "over";
          }
        }
      }, 1000)
    );

    function endGame() {
      gameState.value = "over";
      currentFace.value = faceLoss;
    }

    init("easy");

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

        while (board.value[randomCell].mined) randomCell = Math.floor(Math.random() * board.value.length);

        board.value[randomCell].mined = true;
        minedCells.value.push(board.value[randomCell].id);

        Object.values(getAdjacentCells(board.value[randomCell].id)).forEach((adjacentCell) => {
          if (adjacentCell) board.value[getBoardPosition(adjacentCell)].adjacentMines++;
        });
      }
    }

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
        clickedCellId.value = cell.id;
        gameState.value = "over";

        for (let i: number = 0; i < flaggedCells.value.length; i++)
          if (!board.value[getBoardPosition(flaggedCells.value[i])].mined) board.value[getBoardPosition(flaggedCells.value[i])].open = true;

        for (let j: number = 0; j < minedCells.value.length; j++)
          if (!board.value[getBoardPosition(minedCells.value[j])].flagged) board.value[getBoardPosition(minedCells.value[j])].open = true;
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
        board.value.filter((elm: TCell) => elm.open && !elm.mined).length === board.value.length - minesLeft.value ||
        board.value.filter((elm: TCell) => elm.flagged && elm.mined).length === minesLeft.value
      ) {
        setDataFetched(false);

        currentFace.value = faceWin;

        axios
          .post(
            `${process.env.VUE_APP_MINESWEEPER_API_URL}/saveGame`,
            {
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
          .catch((error: any) => openModal(error.response!.data.message));

        gameState.value = "over";

        return true;
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

        if (column !== 1) adjacentCells.topLeft = `cell-${row - 1}-${column - 1}`;

        if (column !== boardSize.value.columns) adjacentCells.topRight = `cell-${row - 1}-${column + 1}`;
      }

      if (row !== boardSize.value.rows) {
        adjacentCells.bottomCenter = `cell-${row + 1}-${column}`;

        if (column !== 1) adjacentCells.bottomLeft = `cell-${row + 1}-${column - 1}`;

        if (column !== boardSize.value.columns) adjacentCells.bottomRight = `cell-${row + 1}-${column + 1}`;
      }

      if (column !== 1) adjacentCells.middleLeft = `cell-${row}-${column - 1}`;

      if (column !== boardSize.value.columns) adjacentCells.middleRight = `cell-${row}-${column + 1}`;

      return adjacentCells;
    }

    function getAdjacentMines(cellID: string): number {
      let adjacentCells: TAdjacentCell = getAdjacentCells(cellID);
      let adjacentMines: number = 0;

      Object.entries(adjacentCells).forEach((entry) => {
        if (entry[1] && board.value[getBoardPosition(entry[1])].mined) adjacentMines++;
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
      isGameWon,
      dataFetched,
      setDataFetched,
      games,
      setGames,
      addGame,
      numbers,
      flag,
      mine,
      mineClicked,
      flagWrong,
      number1,
      number2,
      number3,
      number4,
      number5,
      number6,
      number7,
      number8,
      clickedCellId,
    };
  },
});
</script>
