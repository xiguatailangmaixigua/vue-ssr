<template>
    <div class="bar">
        <h1 @click="onHandleClick">Bar Component</h1>
        <h2>异步Ajax数据</h2>
        <span>{{ msg }}</span>
    </div>
</template>
<script>
    const fetchInitialData = (store => {
        store.dispatch('fetchBar')
    })

    export default {
        asyncData: fetchInitialData,

        methods: {
            onHandleClick() {
                console.log('bar')
            }
        },

        mounted() {
            // 因为服务端渲染只有 beforeCreate 和 created 俩个生命周期，不会走这里
            // 所以把调用Ajax初始化数据写在这里
            let store = this.$store
            fetchInitialData({ store })
        },

        computed: {
            msg() {
                return this.$store.state.bar;
            }
        }
    }
</script>
<style>
    .bar {
        background: bisque;
    }
</style>