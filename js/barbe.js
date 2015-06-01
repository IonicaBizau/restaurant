(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * RegexEscape
 * Encodes a string for using in a regular expression.
 *
 * @name RegexEscape
 * @function
 * @param {String} input The string that must be encoded.
 * @return {String} The encoded string.
 */
function RegexEscape(input) {
    return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * proto
 * Adds the `RegexEscape` function to `RegExp` class.
 *
 * @name proto
 * @function
 * @return {Function} The `RegexEscape` function.
 */
RegexEscape.proto = function () {
    RegExp.escape = RegexEscape;
    return RegexEscape;
};

module.exports = RegexEscape;

},{}],2:[function(require,module,exports){
// Dependencies
var RegexEscape = require("regex-escape");

/**
 * Barbe
 * Renders the input template including the data.
 *
 * @name Barbe
 * @function
 * @param {String} text The template text.
 * @param {Array} arr An array of two elements: the first one being the start snippet (default: `"{"`) and the second one being the end snippet (default: `"}"`).
 * @param {Object} data The template data.
 * @return {String} The rendered template.
 */
function Barbe(text, arr, data) {
    if (!Array.isArray(arr)) {
        data = arr;
        arr = ["{", "}"];
    }

    if (!data || data.constructor !== Object) {
        return text;
    }

    arr = arr.map(RegexEscape);

    Object.keys(data).forEach(function (c) {
        text = text.replace(new RegExp(arr[0] + c + arr[1], "g"), data[c]);
    });

    return text;
}

window.Barbe = Barbe;

},{"regex-escape":1}]},{},[2]);
