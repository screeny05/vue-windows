<template>
<div class="window"
    :style="{
        transform: 'translate(' + x + 'px, ' + y + 'px)',
        width: width + 'px',
        height: height + 'px',
        zIndex
    }"
    @click="emitEventParent('windowClick')"
    @mousedown="emitEventParent('windowMousedown')"
    v-if="isOpen">

    <div class="window__handles">
        <div ref="borderTop" class="window__border window__border--top"></div>
        <div ref="borderRight" class="window__border window__border--right"></div>
        <div ref="borderBottom" class="window__border window__border--bottom"></div>
        <div ref="borderLeft" class="window__border window__border--left"></div>
        <div ref="cornerTopLeft" class="window__corner window__corner--top-left"></div>
        <div ref="cornerTopRight" class="window__corner window__corner--top-right"></div>
        <div ref="cornerBottomRight" class="window__corner window__corner--bottom-right"></div>
        <div ref="cornerBottomLeft" class="window__corner window__corner--bottom-left"></div>
    </div>

    <div class="window__inner">
        <titlebar
            ref="titlebar"
            :title="title"
            @actionClose="close()"
            @actionMaximize="toggleMaximized()"
            @actionMinimize="$parent.addWindow()"/>

        <div class="window__content">
            <slot/>
        </div>
    </div>

</div>
</template>

<script>
import throttle from 'throttle-debounce/throttle';
import draggableMixin from '../mixins/draggable';
import addEventListener from '../utils/add-event-listener';

export default {
    name: 'window',
    mixins: [
        draggableMixin('titlebar'),
        draggableMixin('borderTop'),
        draggableMixin('borderRight'),
        draggableMixin('borderBottom'),
        draggableMixin('borderLeft'),
        draggableMixin('cornerTopLeft'),
        draggableMixin('cornerTopRight'),
        draggableMixin('cornerBottomRight'),
        draggableMixin('cornerBottomLeft'),
    ],

    data: () => ({
        preMaximizeData: null,
        addedListeners: [],
        width: 800,
        height: 600,
        zIndex: 0,
        isOpen: true,
        isMaxmimized: false,
        x: 0,
        y: 0,
        documentResizeThrottle: 250
    }),

    props: {
        title: {
            type: String,
            default: 'Untitled Window'
        },
        $desktop: null
    },

    created(){
        this.addedListeners.push(addEventListener(window, 'resize', throttle(this.documentResizeThrottle, this.onDocumentResize.bind(this))));
        this.$on('titlebarDrag', this.onTitlebarDrag.bind(this));
        this.bubbleEventParent('titlebarDrag', 'windowMove');
        this.bubbleEventParent('dragStart', 'windowMoveOrResizeStart');
        this.bubbleEventParent('dragEnd', 'windowMoveOrResizeEnd');
        this.$on('borderTopDrag', e => this.resizeTop(e.moveY));
        this.$on('borderLeftDrag', e => this.resizeLeft(e.moveX));
        this.$on('borderRightDrag', e => this.resizeRight(e.moveX));
        this.$on('borderBottomDrag', e => this.resizeBottom(e.moveY));
        this.$on('cornerTopLeftDrag', e => { this.resizeTop(e.moveY); this.resizeLeft(e.moveX); });
        this.$on('cornerTopRightDrag', e => { this.resizeTop(e.moveY); this.resizeRight(e.moveX); });
        this.$on('cornerBottomLeftDrag', e => { this.resizeBottom(e.moveY); this.resizeLeft(e.moveX); });
        this.$on('cornerBottomRightDrag', e => { this.resizeBottom(e.moveY); this.resizeRight(e.moveX); });
    },

    mounted(){
        this.$parent.$emit('windowMount', this);
        const startPosition = this.$parent.getStartPosition(this);
        this.x = startPosition.x;
        this.y = startPosition.y;
    },

    beforeDestroy(){
        this.addedListeners.forEach(remover => remover());
    },

    methods: {
        emitEventParent(eventname){
            this.$parent.$emit(eventname, this);
        },
        bubbleEventParent(srcEvent, targetEvent){
            this.$on(srcEvent, e => this.$parent.$emit(targetEvent, this));
        },
        onTitlebarDrag(e){
            if(!this.canMove()) return;
            this.x += e.moveX;
            this.y += e.moveY;
        },
        onDocumentResize(){
            if(!this.isMaxmimized) return;
            this.setSizeFullscreen();
        },
        resizeTop(delta){
            if(!this.canResize()) return;
            this.height -= delta;
            this.y += delta;
        },
        resizeLeft(delta){
            if(!this.canResize()) return;
            this.width -= delta;
            this.x += delta;
        },
        resizeRight(delta){
            if(!this.canResize()) return;
            this.width += delta;
        },
        resizeBottom(delta){
            if(!this.canResize()) return;
            this.height += delta;
        },

        canResize(){
            return !this.isMaxmimized;
        },

        canMove(){
            return !this.isMaxmimized;
        },

        close(){
            this.isOpen = false;
        },

        toggleMaximized(){
            if(this.isMaxmimized){
                this.x = this.preMaximizeData.x;
                this.y = this.preMaximizeData.y;
                this.width = this.preMaximizeData.width;
                this.height = this.preMaximizeData.height;
            } else {
                this.preMaximizeData = { x: this.x, y: this.y, width: this.width, height: this.height };
                this.x = 0;
                this.y = 0;
                this.setSizeFullscreen();
            }

            this.isMaxmimized = !this.isMaxmimized;
            this.emitEventParent('windowToggleMaximized');
        },

        setSizeFullscreen(widthFactor, heightFactor){
            widthFactor = widthFactor || 1;
            heightFactor = heightFactor || 1;

            const { width, height } = this.$parent.getAvailableSize();

            this.width = width * widthFactor;
            this.height = height * heightFactor;
        }
    }
};
</script>

<style scoped>
.window {
    --window-border-size: 7px;
    --window-corner-size: 19px;
    --window-border-offset: 2px;

    background: #f9fafa;
    position: absolute;
    border: 1px solid #a5b5c1;
    border-radius: 5px;
    box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.08);
    will-change: transform;
}

.window__titlebar-actions {
    position: relative;
}

.window__titlebar {
    user-select: none;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.window__border,
.window__corner {
    position: absolute;
    user-select: none;
    background: tomato;
    opacity: 0;
}

.window__corner {
    background: rebeccapurple;
    width: var(--window-corner-size);
    height: var(--window-corner-size);
}

.window__border--top,
.window__border--bottom {
    height: var(--window-border-size);
    width: 100%;
    cursor: ns-resize;
}

/* top border is smaller */
.window__border--top {
    height: calc(var(--window-border-offset) + 1px);
}

.window__border--left,
.window__border--right {
    width: var(--window-border-size);
    height: 100%;
    cursor: ew-resize;
}

.window__border--top { top: calc(-1 * var(--window-border-offset)); }
.window__border--bottom { bottom: calc(-1 * var(--window-border-offset)); }
.window__border--left { left: calc(-1 * var(--window-border-offset)); }
.window__border--right { right: calc(-1 * var(--window-border-offset)); }

.window__corner--top-left,
.window__corner--top-right {
    top: calc(-1 * var(--window-border-offset));
}

.window__corner--bottom-left,
.window__corner--bottom-right {
    bottom: calc(-1 * var(--window-border-offset));
}

.window__corner--top-left,
.window__corner--bottom-left {
    left: calc(-1 * var(--window-border-offset));
}

.window__corner--top-right,
.window__corner--bottom-right {
    right: calc(-1 * var(--window-border-offset));
}

.window__corner--top-left,
.window__corner--bottom-right {
    cursor: nwse-resize;
}

.window__corner--top-right,
.window__corner--bottom-left {
    cursor: nesw-resize;
}
</style>
