<template>
  <div class="board">
    <Cell
      v-for="cell in board"
      :key="cell.id"
      :cell="cell"
      :gameState="gameState"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated } from "vue";

import Cell from "./Board/Cell.vue";
import { TCell } from "../../types/index";
import mine from "../../assets/mine.png";

export default defineComponent({
  props: {
    gameState: String,
    board: Array,
  },
  components: {
    Cell,
  },
});
</script>
