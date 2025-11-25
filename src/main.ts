import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRight,
  faBars,
  faBell,
  faBagShopping,
  faCheck,
  faChartLine,
  faChevronDown,
  faChevronRight,
  faCircleCheck,
  faCircleExclamation,
  faCircleNotch,
  faClock,
  faComments,
  faEnvelope,
  faFilter,
  faGlobe,
  faLanguage,
  faMoon,
  faPhone,
  faPlus,
  faPowerOff,
  faSearch,
  faSignInAlt,
  faSliders,
  faSun,
  faTimes,
  faTrash,
  faUpload,
  faUsers,
  faUtensils,
  faEye
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import './style.css'
import router from './router'
import i18n from './i18n'
import { pinia } from './stores'

library.add(
  faArrowRight,
  faBars,
  faBell,
  faBagShopping,
  faCheck,
  faChartLine,
  faChevronDown,
  faChevronRight,
  faCircleCheck,
  faCircleExclamation,
  faCircleNotch,
  faClock,
  faComments,
  faEnvelope,
  faFilter,
  faGlobe,
  faLanguage,
  faMoon,
  faPhone,
  faPlus,
  faPowerOff,
  faSearch,
  faSignInAlt,
  faSliders,
  faSun,
  faTimes,
  faUpload,
  faTrash,
  faUsers,
  faUtensils,
  faEye,
  faWhatsapp
)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)
app.component('FaIcon', FontAwesomeIcon)

app.mount('#app')
