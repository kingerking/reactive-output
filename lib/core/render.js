
const DEFAULT_RENDER_OPTIONS = {
    inline: true
}

const render = {
    /**
     * This must be defined before a initialization call.
     */
    rootElement: null
};

render.queue = {};


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
    
}

/**
 * Main render function(will initialize the renderer)
 */
export default (rootElement, options = DEFAULT_RENDER_OPTIONS) => {
    render.options = options;
    render.root = rootElement;
    render.initialize();
};