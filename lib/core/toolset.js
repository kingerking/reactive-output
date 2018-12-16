import debug from 'debug';
import {render} from './render';
import readline from 'readline';

/**
 * Generate a toolset for a given element to use to render things.
 * 
 * NOTE: Encapsulating the sub functions is necessary since we want to keep these operations queued until
 * their invoked by the renderer when its ready to render.
 */

const toolset = {};

toolset.log = debug("Toolset");

toolset.cursorTo = (x = render.position.x, y = render.position.y) => () => new Promise((resolve, reject) => {
    if (x === render.position.x && y === render.position.y)
        return resolve();
    // readline.cursorTo(render.options.interface.output, x, y);
    // render.position = { x, y };
    // From CanvasBox Renderer V2(My old project)
    const yPos = render.position.y;
    if (y > yPos)
        var offset = (y - yPos);
    if (!offset && y < yPos)
        var offset = -(yPos - y);
    
    readline.moveCursor(render.streams.output, 0, offset);
    readline.cursorTo(render.streams.output, x);
    render.position.y = y;
    render.position.x = x;
    resolve();
});

toolset.clearLine = () => () => new Promise((resolve, reject) => {
    readline.clearLine(render.streams.output, 0);
    resolve();
});

// Clear all lines. // TODO:
toolset.clear = (relativeLine) => () => new Promise((resolve, reject) => {});

/**
 * Write something to the screen.
 */
toolset.write = (relativeStart, buffer) => () => new Promise((resolve, reject) => {
    // TODO: find a to manage elements current lines and updatting them etc...
    render.position.x += buffer.length - 1;
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
    toolset.element = element;
    return toolset;
}