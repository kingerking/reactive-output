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

    get props() {
        return this._props;
    }

    set props(v) {
        this._props = v;
    }

    constructor(props = {}) {
        super();
        this._uuid = v4();
        // TEMP
        this._props = props;

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

    /**
     * This is a helper function that will contact the renderer
     * and get a render call executed.
     */
    render = (renderer) => {
        const funct = renderer.prepare(this);
        const action = funct();
        renderer.queueAction(action);
    }

    draw = (action, toolset) => {
        return action([
            toolset.cursorTo(0, 0),
            toolset.clearLine(),
            toolset.write(0, this.props.value || "<no prop>")
        ]);
    };

}