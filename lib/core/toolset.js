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
toolset.currentLines = 0;

/**
 * Tell a element about a line being rendered or manipulated.
 * this will inject this info into the element so it can be used to clear output upon next render cycle.
 */
function informElementLineManipulation(line) {
    toolset.element.previousLines.push(line);
}

function calculateOffset(y) {
    const yPos = render.position.y;
    if (y > yPos)
        var offset = (y - yPos);
    if (!offset && y < yPos)
        var offset = -(yPos - y);
    return offset || 0;
}

/**
 * This will create extras lines if they are required.
 * i.e: If user wants to render something on line 9 and only 4 lines exist then this will create the remainder.
 * NOTE:
 * This is to only be used internally by toolset.cursorTo().
 * NOTE: DESIGN:
 * Make sure to have one extra line below any rendered line.
 */
function createAbsentLines(targetY, currentPosY) {
    // we got enough lines.
    if(targetY < toolset.currentLines)
        return;
    const toAdd = ((targetY) - toolset.currentLines) - 1;
    if(toAdd <= 0)
        return;
    const moveOffset = calculateOffset(toolset.currentLines);
    readline.moveCursor(render.streams.output, 0, moveOffset);
    for(let i = 0; i <= toAdd;i++)
        render.streams.output.write('\n');
    readline.moveCursor(render.streams.output, 0, -(moveOffset))
}

toolset.cursorTo = (x = render.position.x, y = render.position.y) => (errorHandler) => {
    if (x === render.position.x && y === render.position.y)
        return;
    createAbsentLines(y, render.position.y);
    if (y !== null && y !== undefined)
    {
        var offset = calculateOffset(y);
        readline.moveCursor(render.streams.output, 0, offset);
    }
    if (x !== render.position.x)
        readline.cursorTo(render.streams.output, x);
    render.position.y = y;
    render.position.x = x;
};

toolset.clearLine = () => (errorHandler) => {
    readline.clearLine(render.streams.output, 1);
};

// Clear prevous rendered stuff.
toolset.clear = (relativeLine) => (errorHandler) => {
    if (!toolset.element.drawCount) return;
    toolset.log("Clearing last edits: ", toolset.element.previousLines);
    toolset.lastLines(line => [toolset.cursorTo(0, line), toolset.clearLine()])(errorHandler);
    toolset.element.previousLines = [];
};

/**
 * Write something to the screen.
 */
toolset.write = (relativeStart, buffer) => (errorHandler) => {
    // TODO: find a to manage elements current lines and updatting them etc...
    // toolset.cursorTo(relativeStart, null)();
    render.position.x += (buffer.length - 1);
    // const output = [...(lines => {
    //     const buf = [];
    //     if(lines == 0 || !lines) return buf;
    //     for(let i = 0; i <= lines; i++)
    //         buf.push('\n');
    //     render.position.y += buf.length - 1;
    //     return buf;
    // })(render.position.y >= toolset.currentLines ? (render.position.y - toolset.currentLines) : 0), buffer].join("");

    render.streams.output.write(buffer);
    informElementLineManipulation(render.position.y);
};


/**
 * This will target the last lines this element changed(what lines were rendered last cycle) and call the iterator on each line.
 */
toolset.lastLines = (iterator) => (errorHandler) => {
    // create action chain based off of previous rendered lines.
    const subAction = toolset.element.previousLines.map(iterator);
    // execute sub action.
    subAction.forEach(operation => operation(errorHandler));
};




export default element => {
    toolset.element = element;
    return toolset;
}