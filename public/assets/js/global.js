/**
 * @fileoverview Helper functions and prototype declarations for the front-end.
 */

String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};