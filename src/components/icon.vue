<template>
<i v-bind:class="[`ion-${design}-${name}`]"></i>
</template>

<script>
export default {
    name: 'icon',
    props: {
        name: String,
        design: {
            type: String,
            default: 'md'
        }
    }
};
</script>
