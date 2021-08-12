import { create } from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const fetchBar = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("fetchBar");
            resolve("bar 组件返回ajax数据");
        }, 1000);
    })
}

function createStore() {
    const store = new Vuex.Store({
        state: {
            bar: ''
        },

        mutations: {
            'SET_BAR'(state, data) {
                state.bar = data;
            }
        },

        actions: {
            fetchBar({ commot }) {
                return fetchBar().then((data) => {
                    commit('SET_BAR', data);
                }).catch(err => {
                    console.log(err);
                })
            }
        }
    });

    if (typeof window !== 'undefined' && window.__INITIAL_STATE) {
        console.log('window.__INITIAL_STATE', window.__INITIAL_STATE);
        store.replaceState(window.__INITIAL_STATE);
    } else {
        console.log('no browser');
    }

    return store;
}

export default createStore;