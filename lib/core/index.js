/**
 * reactive-output experiment version 1.
 * Written primarily in Functional javascript.
 * @author Kyle King
 */
import render from './render';
import Element from './Element';
import { throttle } from 'lodash';
import debug from 'debug';


// core library components.
const core = {
    log: debug("Core")
};
core.Element = Element;
core.running = false;
core.loopIteration = 0;

// try to loop 15 times a second.
// try to keep this as low as possible to avoid potential hardware limitations will make it fall behind
// as seen in CanvasBox Renderer V2
core.refreshRate = 15;

/**
 * Main application loop body.
 * This is where render queues will be executed, etc..
 */
core.loop = (renderInstance) => {
    
    // Loop Tasks
    if (!renderInstance || !renderInstance.loop)
        throw new Error(`renderer doesn't contain a loop function: (typeof renderInstance, iteration): ${typeof renderInstance}, ${core.loopIteration}`);
    renderInstance.loop();
    
    // Loop functions.
    if (core.running)
        return (core.currentTimeout = setTimeout(
            (core.currentThrottle = throttle(() => core.loop(renderInstance), 1000 / core.refreshRate, { trailing: false })),
            1000 / core.refreshRate
        ));
    
    core.loopIteration++;
}

core.startLoop = (renderInstance) => {
    core.running = true;
    core.loop(renderInstance);
}

core.stopLoop = () => {
    if (!core.running) throw new Error("Loop has already been halted.");
    core.running = false;
    if (core.currentThrottle)
        core.currentThrottle.cancel();
    if (core.currentTimeout)
        clearTimeout(core.currentTimeout);
    core.log("stoped loop.");
}

core.initialize = (rootElement, configuration) => {
    // allow users to set custom refresh rates based on their needs.
    core.refreshRate = configuration.refreshRate || core.refreshRate;

    // create a basic renderer
    const renderInstance = render(rootElement, configuration);
    core.log("created render instance in core.initialize: ", typeof renderInstance)
    core.startLoop(renderInstance);
    return {
        renderer: renderInstance,
        ...core
    };
}

export default core;