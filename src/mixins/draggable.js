import addEventListener from '../utils/add-event-listener';

export default function(targetRefName){
    let lastX;
    let lastY;
    let addedListeners;

    const targetX = targetRefName + 'X';
    const targetY = targetRefName + 'Y';
    const targetIsElementPressed = targetRefName + 'IsElementPressed';

    const endDrag = function(){
        this[targetIsElementPressed] = false;
        this.$emit('dragEnd');
        this.$emit(targetRefName + 'DragEnd');
    };

    const onElementMouseDown = function(e){
        this[targetIsElementPressed] = true;
        lastX = e.x;
        lastY = e.y;
        this.$emit('dragStart');
        this.$emit(targetRefName + 'DragStart');
    };

    const onDocumentMouseMove = function(e){
        if(!this[targetIsElementPressed]){
            return;
        }
        if(e.buttons !== 1){
            return endDrag.call(this);
        }

        let moveX = e.x - lastX;
        let moveY = e.y - lastY;

        if(e.x < 0 || e.x > document.documentElement.clientWidth){
            moveX = 0;
        }

        if(e.y < 0 || e.y > document.documentElement.clientHeight){
            moveY = 0;
        }

        this[targetX] += moveX;
        this[targetY] += moveY;

        lastX = e.x;
        lastY = e.y;

        this.$emit('drag');
        this.$emit(targetRefName + 'Drag', { moveX, moveY });
    };


    return {
        data: () => ({
            [targetX]: 0,
            [targetY]: 0,
            [targetIsElementPressed]: false
        }),

        mounted(){
            addedListeners = [
                addEventListener(document, 'mousemove', onDocumentMouseMove.bind(this)),
                addEventListener(this.$refs[targetRefName], 'mousedown', onElementMouseDown.bind(this)),
                addEventListener(this.$refs[targetRefName], 'mouseup', endDrag.bind(this))
            ];
        },

        beforeDestroy(){
            addedListeners.forEach(remover => remover());
        },
    }
}
