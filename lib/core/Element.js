import { EventEmitter } from "events";
import { v4 } from 'uuid';

/**
 * Will represent a Element on the screen / group of lines.
 * see planning/docs-general/ElementClass.md for further imformation.
 * 
 * @author Kyle King
 */
export default class Element extends EventEmitter {
    _buffer = "";
    _prevProps = {};
    _props = {};
    _renderer = null; // elements default renderer if no custom one is passed.
 
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

    get id() {
        return this._uuid || -1;
    }

    get renderer() {
        return this._renderer;
    }

    set renderer(v) {
        if (!v) return;
        this._renderer = v;
    } 

    get props() {
        return this._props;
    }

    set props(v) {
        this._props = v;
    }


    constructor(props = {}, renderer = null) {
        super();
        this._uuid = v4();
        // TEMP
        this._props = props;
        if (renderer)
            this._renderer = renderer;
        

        // the React adapter should emit this when a Component update / state change happens.
        this.on('render', this.render);
        this.on('successful-render', () => {
            console.log(`SUC render: ${this.props}`);
        });
        this.initialize().then(() => this.emit("initialized"));
    }

    /**
     * Initialize this element.
     * For now this can be a empty resolving promise.
     */
    initialize = () => new Promise((resolve, reject) => {
        return resolve();
    });

    /**
     * This is a helper function that will contact the renderer
     * and get a render call executed.
     */
    render = (use_renderer = this.renderer) => {
        if (!use_renderer)
            throw new Error("You tried rendering a element with out an attached renderer instance. Please read the documentation for more info.");
        const funct = use_renderer.prepare(this);
        const action = funct();
        use_renderer.queueAction(action);
    }
}