import { EventEmitter } from "events";

/**
 * Will represent a Element on the screen / group of lines.
 * see planning/docs-general/ElementClass.md for further imformation.
 * 
 * @author Kyle King
 */
export default class Element extends EventEmitter {
    _buffer = "";

    get buffer() {
        return this._buffer;
    }

    constructor(renderer, str) {
        super();
        // TEMP
        this._buffer = str;

        // the React adapter should emit this when a Component update / state change happens.
        this.on('render', this.handleRender);
        this.initialize().then(() => this.emit("initialized"));
    }

    /**
     * Initialize this element.
     * For now this can be a empty resolving promise.
     */
    initialize = () => new Promise((resolve, reject) => {
        return resolve();
    });

    handleRender = () => {
        console.log("handle render has been called.");

    };

}