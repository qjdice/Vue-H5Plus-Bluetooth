import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Bluetooth from '@/components/setting'
Vue.use(Router)

export default new Router({
  routes: [
       {
         path: '/',
         name: 'HelloWorld',
         component: HelloWorld
       },
       {
         path: '/setting',
         name: 'Bluesetting',
         component: Bluetooth
       }
  ]
})
