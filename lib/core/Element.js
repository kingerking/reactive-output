import { EventEmitter } from "events";

/**
 * Will represent a Element on the screen / group of lines.
 * see planning/docs-general/ElementClass.md for further imformation.
 * 
 * @author Kyle King
 */
export default class Element extends EventEmitter {
    _buffer = "";

    get offset() {
        return this._renderer.getElementOffset(this)
    }

    /**
     * Will need this for prompts.
     * (halting a action chain mid execution is only possible if a element is focused,
     * for now we dont need it.)
     */
    get focused() {
        return false;
    }

    get buffer() {
        return this._buffer;
    }

    constructor(renderer, str) {
        super();
        this._renderer = renderer;
        // TEMP
        this._buffer = str;

        // the React adapter should emit this when a Component update / state change happens.
        this.on('render', this.render);
        this.initialize().then(() => this.emit("initialized"));
    }

    /**
     * Initialize this element.
     * For now this can be a empty resolving promise.
     */
    initialize = () => new Promise((resolve, reject) => {
        return resolve();
    });

    render = (action, toolset) => {
        console.log("usr rndr");
        return action([
            toolset.clearLine(0),
            toolset.write(0, "hello world")
        ]);
    };

}