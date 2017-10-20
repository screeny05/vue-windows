export default function($el, eventname, handler){
    $el = $el.$el ? $el.$el : $el;

    $el.addEventListener(eventname, handler, false);
    return () => {
        $el.removeEventListener(eventname, handler, false);
    }
};
