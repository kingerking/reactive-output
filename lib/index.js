import reactInterface from './react-interface';
import coreLib from './core/index';

/**
 * Library exports(expose to user).
 */
export default {
    /**
     * export the react renderer interface function as "render"
     */
    render: reactInterface,
    /**
     * Expand core framework to export.
     */
    core: coreLib
}