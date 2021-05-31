<template>
  <div
    :id="cell.id"
    :class="`cell${cell.open ? ' cell--open' : ''}`"
    @mousedown.left="(e) => gameLeftClick(e)"
    @contextmenu.prevent="(e) => gameRightClick(e)"
    v-if="cell"
  >
    <img
      v-if="cell.mined && !cell.flagged && cell.open && gameState === 'over'"
      :src="mine"
      class="cell--mine"
      alt="Mine"
    />
    <img
      v-if="!cell.mined && cell.flagged && cell.open && gameState === 'over'"
      :src="mineWrong"
      class="cell--mineClicked"
      alt="Mine exploded"
    />
    <img
      v-if="cell.adjacentMines && !cell.mined && cell.open && !cell.flagged"
      :src="numbers[cell.adjacentMines - 1]"
      class="cell--number"
      alt="Number of mines"
    />

    <img
      v-if="cell.flagged && !cell.open"
      :src="flag"
      class="cell--flag"
      alt="Flag"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, inject } from "vue";

import { TCell } from "../../../types/index";
import mine from "../../../assets/mine.png";
import mineWrong from "../../../assets/mineWrong.png";
import flag from "../../../assets/flag.png";
import number1 from "../../../assets/number1.png";
import number2 from "../../../assets/number2.png";
import number3 from "../../../assets/number3.png";
import number4 from "../../../assets/number4.png";
import number5 from "../../../assets/number5.png";
import number6 from "../../../assets/number6.png";
import number7 from "../../../assets/number7.png";
import number8 from "../../../assets/number8.png";

export default defineComponent({
  props: {
    gameState: String,
    cell: Object,
  },
  setup(props, context) {
    const gameLeftClick = inject("leftClick");
    const gameRightClick = inject("rightClick");

    const numbers: Array<string> = [
      number1,
      number2,
      number3,
      number4,
      number5,
      number6,
      number7,
      number8,
    ];

    return {
      numbers,
      flag,
      mine,
      mineWrong,
      number1,
      number2,
      number3,
      number4,
      number5,
      number6,
      number7,
      number8,
      gameLeftClick,
      gameRightClick,
    };
  },
});
</script>
