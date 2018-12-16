/**
 * reactive-output experiment version 1.
 * Written primarily in Functional javascript.
 * @author Kyle King
 */
import render from './render';
import Element from './Element';
import { throttle } from 'lodash';


// core library components.
const core = {};
core.Element = Element;
core.running = false;
core.loopIteration = 0;

// approx. 30 times a second.
core.refreshRate = 1000 / 30;

/**
 * Main application loop body.
 * This is where render queues will be executed, etc..
 */
core.loop = () => {
    core.loopIteration++;
    console.log("looping: ", core.loopIteration);
    if (core.running)
        return (core.currentTimeout = setTimeout(
            (core.currentThrottle = throttle(core.loop, core.refreshRate, { trailing: false })),
            core.refreshRate
        ));
}

core.startLoop = (renderInstance) => {
    core.running = true;
    setTimeout(core.stopLoop,5000);
    core.loop();
}

core.stopLoop = () => {
    if (!core.running) throw new Error("Loop has already been halted.");
    core.running = false;
    if (core.currentThrottle)
        core.currentThrottle.cancel();
    if (core.currentTimeout)
        clearTimeout(core.currentTimeout);
    console.log("stoped loop.");
}

core.initialize = (rootElement, configuration) => {
    // create a basic renderer
    const renderInstance = render(rootElement, configuration);
    const loop = core.startLoop(renderInstance);
    return {
        renderer: renderInstance,
        ...core
    };
}

export default core;