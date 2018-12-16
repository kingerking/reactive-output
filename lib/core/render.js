import * as _ from 'lodash';
import Element from './Element';
import readline from 'readline';
import debug from 'debug';
import async from 'async';


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
    exitOnFirst: false,


}

const render = {
    /**
     * This must be defined before a initialization call.
     */
    rootElement: null,
    /**
     * This will indicate if the renderer has be initialized properly.
     */
    initialized: false,
    log: debug("Renderer")
};

render.queue = [];


/**
 * Generate a toolset for a given element to use to render things.
 * 
 * NOTE: Encapsulating the sub functions is necessary since we want to keep these operations queued until
 * their invoked by the renderer when its ready to render.
 */
render.toolset = (element) => {
    // calculate and pull info from element to assist in executing the acutal renderer calls.
    return {
        write: (relativeStart, buffer) => () => new Promise((resolve, reject) => {
            render.log("in toolset action creator promise body. write body");    
        }),
        writeLines: (relativeStart, relativeEnd, buffer) => () => new Promise((resolve, reject) => {
            render.log("in toolset action creator promise body. writeLines body");    
        }),
        clearLine: (relativeLine) => () => new Promise((resolve, reject) => {
            render.log("in toolset action creator promise body. clearLine body");
        }),
    };
}

/**
 * Return a int that is the relative offset of a given element on the screen or viewport.
 */
render.getElementOffset = element => {

}

/**
 * this is the main action creator constructor.
 * When calling render you will create a action creator and pass it to the user
 * so they can finish constructing the action and return it from their render().
 * Creates a Action Object based off a array of actions to be executed.
 */
render.action = (element) => (operations) => {

    // returns a action Object. witch can be interpreted by the renderer.
    return {
        /**
         * Execute the action chain on a action object.
         *  what takes place:
         *  1. this will emit to the element when the operation is finished.
         *  2. will execute all the render calls.
         */
        execute: () => new Promise((resolve, reject) => {
            // this is where the render operations are executed one by one, in a async way.
            const resolutions = [];
            
            /**
             * TODO: continue this later.
             * use async.forEachOf() async forEach function.
             */
            
            render.log("finished render operations.");
        }),
        getElement: () => element,
    }
}

/**
 * This will set and prepare the root element for render.
 */
render.root = (rootElement) => {
    render.log("creating root element");
    const action = rootElement.render(render.action(rootElement), render.toolset(rootElement));

    render.queue.push(action);
    return rootElement;
};

render.queueOperating = false;


/**
 * Renderer loop.
 */
render.loop = () => {
    if (!render.queue.length && !render.queueOperating) return;
    render.queueOperating = true;
    // clone the queue.
    const activeQueue = [...render.queue];
    render.queue = [];
    activeQueue.forEach(action => {
        render.log("executing action: ", action);
        const element = action.getElement();
        // function where actions are turned into raw render calls.
        action.execute().
            then(() => element.emit('successful-render')).
            catch(e => element.emit('non-successful-render'));
    });
    render.queueOperating = false;
}

/**
 * Initialize the renderer
 */
render.initialize = configuration => {
    // initialize the renderer with render.options.
    render.log("Render process initialized with options: ", render.options);
    /**
     * The Node.js readline interface options object.
     * Recommended to not touch this in your custom configuration.
     */    
    render.interface = readline.createInterface(configuration.interface || {
        input: process.stdin,
        output: process.stdout
    });
}

/**
 * Main render function(will initialize the renderer)
 */
export default (rootElement, options = DEFAULT_RENDER_OPTIONS) => {
    render.options = _.merge(DEFAULT_RENDER_OPTIONS, options);
    render.initialize(options);
    render.initialized = true && !!rootElement;
    if (!render.initialized)
        throw new Error("Failed to initialize Renderer.");
    render.root(rootElement);
    return render;
};