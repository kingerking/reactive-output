import render from './render';
import Element from './Element';
// core library components.
const core = {};
core.Element = Element;



core.initialize = (rootElement, configuration) => {
    // create a basic renderer
    core.render = render(rootElement, configuration);
}

export default core;