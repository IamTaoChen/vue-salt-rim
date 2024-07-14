import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import ToastPlugin from 'vue-toast-notification'
import InstantSearch from 'vue-instantsearch/vue3/es'
import router from './router'
import mitt from 'mitt'
import dialog from './components/Dialog/plugin'
import './assets/main.css'
import AppState from './AppState.js'
import Plausible from 'plausible-tracker'
import { registerSW } from 'virtual:pwa-register'
import { register as registerSwiperElements } from 'swiper/element/bundle'

import en_US from './locales/en-US'
import hr_HR from './locales/hr-HR'
import fr_FR from './locales/fr-FR'
import de_DE from './locales/de-DE'
import pl_PL from './locales/pl-PL'
import zh_CN from './locales/zh-CN'
import zh_TW from './locales/zh-TW'

registerSW({ immediate: true })
registerSwiperElements()

if (window.srConfig.ANALYTICS_HOST && window.srConfig.ANALYTICS_HOST != '') {
    const { enableAutoPageviews, enableAutoOutboundTracking } = Plausible({
        apiHost: window.srConfig.ANALYTICS_HOST
    })

    enableAutoPageviews()
    enableAutoOutboundTracking()
}

const appState = new AppState()

let userSelectedLocale = appState.language
if (!userSelectedLocale) {
    userSelectedLocale = window.srConfig.DEFAULT_LOCALE || 'en-US'
}

let userSelectedTheme = appState.theme
if (userSelectedTheme == 'dark' && !document.body.classList.contains('dark-theme')) {
    document.body.classList.add('dark-theme')
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#282238')
}

const emitter = mitt()
const app = createApp(App)
const i18n = createI18n({
    legacy: false,
    locale: userSelectedLocale,
    fallbackLocale: 'en-US',
    numberFormats: {
        'en-US': en_US.numbers,
        'hr-HR': hr_HR.numbers,
        'fr-FR': fr_FR.numbers,
        'de-DE': de_DE.numbers,
        'pl-PL': pl_PL.numbers,
        'zh-CN': zh_CN.numbers,
        'zh-TW': zh_TW.numbers,
    },
    datetimeFormats: {
        'en-US': en_US.datetime,
        'hr-HR': hr_HR.datetime,
        'fr-FR': fr_FR.datetime,
        'de-DE': de_DE.datetime,
        'pl-PL': pl_PL.datetime,
        'zh-CN': zh_CN.datetime,
        'zh-TW': zh_TW.datetime,
    },
    messages: {
        'en-US': en_US.messages,
        'hr-HR': hr_HR.messages,
        'fr-FR': fr_FR.messages,
        'de-DE': de_DE.messages,
        'pl-PL': pl_PL.messages,
        'zh-CN': zh_CN.messages,
        'zh-TW': zh_TW.messages,
    }
})

app.config.globalProperties.app_version = window.srConfig.VERSION || 'local'
app.config.globalProperties.$eventBus = emitter
app.config.globalProperties.site_title = appState.bar.name || 'Bar Assistant'

app.use(router)
app.use(dialog)
app.use(InstantSearch)
app.use(i18n)
app.use(ToastPlugin, {
    position: 'top',
    type: 'default',
    duration: 4000,
})

app.mount('#app')

console.info(`
                    ██▒▒██▒▒██  
                      ██▒▒██▒▒  
    ▒▒▒▒▒▒              ██▒▒██  
  ▒▒      ▒▒          ▒▒  ██▒▒  
  ▒▒  ██  ▒▒████████▒▒██    ██  
  ▒▒  ██          ▒▒  ██        
    ▒▒██░░░░░░░░▒▒░░░░██        
        ██░░░░░░░░░░██          
          ██░░░░░░██            
            ██████              
              ██                
              ██                
              ██                
              ██                
              ██                
          ████░░████            `)
