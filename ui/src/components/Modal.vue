<template>
  <div class="modal">
    <span className="modal__message">{{ message }}</span>
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
