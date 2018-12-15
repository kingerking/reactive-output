import { EventEmitter } from "events";

/**
 * Will represent a Element on the screen / group of lines.
 * One element is executed at a time so elements have a simple repressive easy to manage responsibility.
 * Their line numbers can be calculated as such: elementOffset + currentLinePosition.
 * Elements are responsible for making renderer operation calls(rendering their self so to speak).
 */
export default class Element extends EventEmitter {
    _buffer = "";
    constructor(props) {

    }
}