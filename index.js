import vueIp from './index.vue'
import _Vue from 'vue'

vueIp.install = function(Vue){
    if (!Vue) {
        window.Vue = Vue = _Vue
    }
    Vue.component(vueIp.name, vueIp)
}

export default vueIp