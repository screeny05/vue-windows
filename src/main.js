import Vue from 'vue';

import Desktop from './desktop';
import Window from './components/window';
import Titlebar from './components/titlebar';
import Icon from './components/icon';
import Btn from './components/btn';

import 'reset.css';
import 'ionicons/dist/css/ionicons.css';

Vue.config.productionTip = false;

Vue.component('desktop', Desktop);
Vue.component('window', Window);
Vue.component('titlebar', Titlebar);
Vue.component('icon', Icon);
Vue.component('btn', Btn);

new Vue({
    el: '#app'
});
