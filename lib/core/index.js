import render from './render';
// core library components.
const core = {};




core.init = (rootElement, configuration) => {
    // create a basic renderer
    core.render = render(rootElement, configuration);
}

export default core;