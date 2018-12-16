import * as _ from 'lodash';
import Element from './Element';

const DEFAULT_RENDER_OPTIONS = {
    /**
     * "true": render inline(this is how the CanvasBox Renderer V2 works.).
     * "false": render full screen(this is how the npm package "blessed" renders.).
     */
    inline: true,
    /**
     * Weather or not the render process will un-block the process(exit process) after the initial
     * render has happened.
     * (this is useful if you want to render out a status report or some formatted information)
     */
    exitOnFirst: false
}

const render = {
    /**
     * This must be defined before a initialization call.
     */
    rootElement: null,
    /**
     * This will indicate if the renderer has be initialized properly.
     */
    initialized: false
};

render.queue = {};


/**
 * Write to the stdout stream.
 */
render.writeLine = (offset, subOffset, buffer) => {

}


/**
 * Generate a toolset for a given element to use to render things.
 */
render.toolset = (element) => {
    return {
        write: render.writeLine(element.offset, 0, element.buffer)
    };
}

/**
 * This will set and prepare the root element for render.
 */
render.root = (rootElement) => {
    // rootElement.render(render.toolset(rootElement));
    return rootElement;
};

render.queue.operationsProxyHandler = {
    set: (ar, prop, value) => {

    }
};

render.queue.operationsProxy = new Proxy([], render.queue.operationsProxyHandler);

render.queue.operating = false;

/**
 * @returns true if operations were queued and executed in order. false if otherwise(didnt work)
 */
render.queue.operations = (render) => {
    if (render.queue.operating) return false;
 
    return true;
}

/**
 * Initialize the renderer
 */
render.initialize = () => {
    // initialize the renderer with render.options.
    console.log("Render process initialized with options: ", render.options);
}

/**
 * Main render function(will initialize the renderer)
 */
export default (rootElement, options = DEFAULT_RENDER_OPTIONS) => {
    render.options = _.merge(DEFAULT_RENDER_OPTIONS, options);
    render.initialize();
    render.initialized = true && !!rootElement;
    render.root(rootElement);
    return render;
};