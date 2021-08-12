import Vue from 'vue';
import App from './App.vue';

// 每个用户都会生成新的应用程序实例

export function createApp() {
    const app = new Vue({
        render: h => h(App)
    });

    return { app }
}