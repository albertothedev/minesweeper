import { createApp } from "vue";

import App from "./App.vue";
import store from "./vuex/index";

createApp(App)
  .use(store)
  .mount("#app");
