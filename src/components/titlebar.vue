<template>
<div class="window__titlebar titlebar" @dblclick="$emit('actionMaximize')">
    <div class="titlebar__title">{{title}}</div>
    <div class="window__titlebar-actions titlebar__actions" @mousedown.stop @dblclick.stop>
        <btn class="titlebar__action titlebar__action--minimize" @click="$emit('actionMinimize')">
            <icon name="remove"/>
        </btn>
        <btn class="titlebar__action titlebar__action--maximize" @click="$emit('actionMaximize')">
            <icon name="expand"/>
        </btn>
        <btn class="titlebar__action titlebar__action--close" isPrimary="true" @click="$emit('actionClose')">
            <icon name="close"/>
        </btn>
    </div>
</div>
</template>

<script>
export default {
    name: 'titlebar',
    props: ['title'],
};
</script>

<style scoped>
.titlebar {
    display: flex;
    background: linear-gradient(to bottom, rgb(240, 240, 240) 0%, rgb(194, 204, 211) 100%);
    font-weight: bold;
    padding: 7px 8px 7px 15px;
    border-bottom: 1px solid #a4b5c0;
    cursor: default;
}

.titlebar__title {
    flex: 1 0 auto;
    text-shadow: 0 1px 0 #fdfdfd;
}

.titlebar__action {
    width: 15px;
    height: 15px;
    line-height: 15px;
    float: left;
    margin-left: 2px;
    position: relative;
}
</style>
