<template>
  <div class="modal">
    <span>{{ message }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    message: String,
  },
});
</script>
