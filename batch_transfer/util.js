/* jslint es6 */
'use strict';

module.exports.toHex = (str) => {
    return str.split('').reduce((a, l) => a += l.charCodeAt().toString(16), '');
};