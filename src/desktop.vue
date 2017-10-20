<template>
    <div class="desktop"
        :style="{
            userSelect: isWindowDragInProgress ? 'none' : 'text'
        }">

        <template v-for="(window, index) in windows">
            <component :is="window" :key="index"/>
        </template>
    </div>
</template>

<script>
    import Window from './components/window';
    import Vue from 'vue';

    export default {
        name: 'desktop',

        components: { window: Window },

        data: () => ({
            isWindowDragInProgress: false,
            windows: [],
            windowsVms: []
        }),

        created(){
            this.$on('windowMount', this.onWindowMount.bind(this));
            this.$on('windowMoveOrResizeStart', this.onWindowMoveOrResizeStart.bind(this));
            this.$on('windowMoveOrResizeEnd', this.onWindowMoveOrResizeEnd.bind(this));
            this.$on('windowMousedown', this.focusWindow.bind(this));
            this.$on('windowToggleMaximized', this.focusWindow.bind(this));

            this.addWindow();
        },

        methods: {
            onWindowMount($window){
                this.windowsVms.push($window);
                this.focusWindow($window);
            },
            onWindowMoveOrResizeStart(){
                this.isWindowDragInProgress = true;
            },
            onWindowMoveOrResizeEnd(){
                this.isWindowDragInProgress = false;
            },
            focusWindow($window){
                let maxZindex = 0;
                this.windowsVms.forEach($child => maxZindex = $child.zIndex > maxZindex ? $child.zIndex : maxZindex);

                $window.zIndex = maxZindex + 1;

                // ensure zIndex is always in line
                this.windowsVms.sort(($a, $b) => $a.zIndex - $b.zIndex).forEach(($child, i) => $child.zIndex = i);
            },

            getStartPosition($window){
                const { width, height } = this.getAvailableSize();
                let x = 0;
                let y = 0;

                if(this.windowsVms.indexOf($window) === 0 || this.windowsVms.length === 1){
                    x = width / 3 - $window.width / 3;
                    y = height / 3 - $window.height / 3;
                } else {
                    const $previousChild = this.windowsVms[this.windowsVms.length - 2];
                    x = $previousChild.x + 20;
                    y = $previousChild.y + 20;

                    if(x + $window.width > width){
                        x = 20;
                    }

                    if(y + $window.height > height){
                        y = 20;
                    }
                }

                return { x, y };
            },

            getAvailableSize(){
                return {
                    width: this.$el.clientWidth,
                    height: this.$el.clientHeight
                };
            },

            addWindow(){
                const constructor = Vue.extend(Window);
                const $vm = new constructor({
                    $slots: ['asdsad']
                });
                console.log($vm);
                this.windows.push(constructor);
            }
        }
    };
</script>

<style scoped>
    .desktop {
        font-family: Arial, Verdana, sans-serif;
        font-size: 12px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('https://files.gitter.im/shopware/offtopic/fBta/next-01.png') center center no-repeat, linear-gradient(165deg, #c6eaf6 5%, #dff1f6 45%, #daedf5 55%, #abc8ee 100%);
    }
</style>
