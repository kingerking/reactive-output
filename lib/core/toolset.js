import debug from 'debug';
import {render} from './render';
import readline from 'readline';

/**
 * Generate a toolset for a given element to use to render things.
 * 
 * NOTE: Encapsulating the sub functions is necessary since we want to keep these operations queued until
 * their invoked by the renderer when its ready to render.
 */
const toolset = { position: { x: 0, y: 0 } };
toolset.log = debug("Toolset");

toolset.cursorTo = (x, y) => () => new Promise((resolve, reject) => {
    toolset.position = { x, y };
    readline.cursorTo(render.interface.stdout, x, y);
    resolve();
});

toolset.clearLine = () => () => new Promise((resolve, reject) => {
    readline.clearLine(render.interface.stdout, 0);
    resolve();
});

// Clear all lines. // TODO:
toolset.clear = (relativeLine) => () => new Promise((resolve, reject) => {});

/**
 * Write something to the screen.
 */
toolset.write = (relativeStart, buffer) => () => new Promise((resolve, reject) => {
    // TODO: find a to manage elements current lines and updatting them etc...
    toolset.cursorTo(relativeStart, toolset.position.y);
    toolset.position.x += buffer.length - 1;
    process.stdout.write(buffer);
    resolve();
});

/**
 * Write Some lines to the screen.
 */
toolset.writeLines = (relativeStart, relativeEnd, buffer) => () => new Promise((resolve, reject) => {
    toolset.log("in toolset action creator promise body. writeLines body");
    resolve();
});




export default element => {
    
    return toolset;
}