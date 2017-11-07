import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import VueRouter from 'vue-router'
import Index from './Index.vue';
import GPA from './GPA.vue';
import Zone from './zone.vue';
import Clock from './clock.vue';


Vue.use(Vuetify);
Vue.use(VueRouter);

const routes = [
    {path:'/gpa',component:GPA},
    {path:'/',component:Index},
    {path:'/fitness',component:Zone},
    {path:'/clock',component:Clock},

];

const router = new VueRouter({
    routes
})

new Vue({
  el: '#app',
    router:router,
    components:{
      'GPA':GPA,
      'Index':Index,
      'fintess':Zone,
      'Clock':Clock,
    },
  render: h => h(App)
})
