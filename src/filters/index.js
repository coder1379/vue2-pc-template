import Vue from 'vue'
import * as filter from './filter'

// 将自定义filter绑定到vuefilter
Object.keys(filter).forEach(k => Vue.filter(k, filter[k]))

// 将部分自定义filter绑定到vue this上方便调用
Vue.prototype.$formatDate = Vue.filter('formatDate')
Vue.prototype.$hidePhone = Vue.filter('hidePhone')
