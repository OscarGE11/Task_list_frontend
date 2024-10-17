import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faTrash,
  faPencilAlt,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

library.add(faTrash, faPencilAlt, faCheck, faXmark);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});
