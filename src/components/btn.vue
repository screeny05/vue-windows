<template>
    <div :class="['btn', isPrimary ? 'btn--primary' : '']" @click="$emit('click')">
        <slot/>
    </div>
</template>

<script>
export default {
    name: 'btn',
    props: ['isPrimary']
};
</script>

<style>
.btn {
    cursor: default;
    user-select: none;
    color: #fff;
    text-shadow: 0 1px 0 rgba(14, 14, 14, 0.31);
    text-align: center;
    border-radius: 2px;
    background: linear-gradient(to bottom, #a9b9c3, #7990a0);
}
.btn:hover {
    background: linear-gradient(to bottom, #bcc8d1, #8fa2b0);
}

.btn--primary {
    background: linear-gradient(#20b2fb, #0481d7);
}
.btn--primary:hover {
    background: linear-gradient(#00c7fd, #0099e6);
}
</style>
