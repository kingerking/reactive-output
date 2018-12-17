import * as _ from 'lodash';
import Element from './Element';
import readline from 'readline';
import debug from 'debug';
import toolset from './toolset';
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

    /**
     * Input and output streams to use.
     */
    streams: {
        input: process.stdin,
        output: process.stdout
    }
    
}

export const render = {
    /**
     * This must be defined before a initialization call.
     */
    rootElement: null,
    /**
     * This will indicate if the renderer has be initialized properly.
     */
    initialized: false,
    log: debug("Renderer"),
    position: { x: 0, y: 0 }
};

render.queue = [];
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
        execute: () => {
            // this is where the render operations are executed one by one, in a async way.
            async.forEachOf(operations, (operation, key, cb) => {
                operation(cb);
            }, output => {
                if (output)
                    render.log("Action operation(Potential Error): \n", output);
            });
        },
        getElement: () => element,
    }
}

/**
 * return a function to invoke a render.
 * Prepare children here as well.
 * (recursive child tree lookup and update offsets).
 * @returns an array of actions the first element will be the target element its self. 
 *      rest will be a flattened tree of sub-nodes / children.
 * note on the return:
 * The desired outcome from this function is to properly prepare and inform all
 * types / managers of actions happening on a given element therefore we create spreate action
 * creation helpers to combat this and make the process alot easier. when it comes to flattening the tree
 * we can to turn something like this: {
 *  this(element 1): {
 *      childElements: {
 *          childElement(element2): { 
 *              etc..   
 *          }
 *      }
 *  }
 * }
 * into something as follows
 * [ElementAction1, ElementAction2, etc...];
 */
render.prepare = (element) => () => {
    if (!element.draw)
        throw new Error(`An element does not have a draw() function. This is a required function for all elements, element: ${element}`);
    return element.draw(render.action(element), render.toolset(element));
};

/**
 * actually push element to render queue so the operations can be executed.
 */
render.queueAction = (action) => {
    render.queue.push(action);
}


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
        const element = action.getElement();
        action.execute();
    });
    render.queueOperating = false;
}

/**
 * Initialize the renderer
 */
render.initialize = configuration => {
    // initialize the renderer with render.options.
    // render.log("Render process initialized with configuration: ", configuration);
    render.streams = configuration.streams;

    /**
     * The Node.js readline interface options object.
     * Recommended to not touch this in your custom configuration.
     */    
    // render.interface = readline.createInterface(configuration.interface);
}

/**
 * Main render function(will initialize the renderer)
 */
export default (options = DEFAULT_RENDER_OPTIONS) => {
    render.options = _.merge(options, DEFAULT_RENDER_OPTIONS);
    if (!render.options.inline)
        throw new Error("Full screen rendering is not supported yet.");
    render.initialize(options);
    render.toolset = toolset;
    render.initialized = true;
    if (!render.initialized)
        throw new Error("Failed to initialize Renderer.");
    return render;
};