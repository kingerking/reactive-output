import debug from 'debug';
import {render} from './render';
import readline from 'readline';

/**
 * Generate a toolset for a given element to use to render things.
 * think of the toolset as action creators.
 * NOTE: Encapsulating the sub functions is necessary since we want to keep these operations queued until
 * their invoked by the renderer when its ready to render.
 */
const toolset = {};

toolset.log = debug("Toolset");

// number of lines created.
toolset.currentLines = 1;

/**
 * This will create extras lines if they are required.
 * i.e: If user wants to render something on line 9 and only 4 lines exist then this will create the remainder.
 * NOTE:
 * This is to only be used internally by toolset.cursorTo().
 * NOTE: DESIGN:
 * Make sure to have one extra line below any rendered line.
 */
function checkLines(targetY, currentPosY) { 
    if (targetY <= currentPosY)
        return;
    const toAdd = (targetY - toolset.currentLines);
    for (let i = 0; i <= toAdd; i++)
        render.streams.output.write(`\n`);
};

toolset.cursorTo = (x = render.position.x, y = render.position.y) => (errorHandler) => {
    if (x === render.position.x && y === render.position.y)
        return;
    checkLines(y, render.position.y);
    if (y !== null && y !== undefined)
    {
        const yPos = render.position.y;
        if (y > yPos)
            var offset = (y - yPos);
        if (!offset && y < yPos)
            var offset = -(yPos - y);
        readline.moveCursor(render.streams.output, 0, offset);
    }
    if (x !== render.position.x)
        readline.cursorTo(render.streams.output, x);
    render.position.y = y;
    render.position.x = x;
};

toolset.clearLine = () => (errorHandler) => {
    readline.clearLine(render.streams.output, 0);
};

// Clear all lines. // TODO:
toolset.clear = (relativeLine) => (errorHandler) => {};

/**
 * Write something to the screen.
 */
toolset.write = (relativeStart, buffer) => (errorHandler) => {
    // TODO: find a to manage elements current lines and updatting them etc...
    toolset.cursorTo(relativeStart, null)();
    render.position.x += (buffer.length - 1);
    render.streams.output.write(buffer);
};





export default element => {
    toolset.element = element;
    return toolset;
}