<template>
    <div id="clock">
        <container>
            <h1>The time right now is:</h1>
            <h1><Clock :blink="true" /></h1>
        </container>
     </div>
</template>

<script>
    import Clock from 'vue-digital-clock'

    export default {
        name: 'app',
        components: {
            Clock,
        },
    }
</script>