/**
 * Reverses a string.
 * @param {String} value
 * @return {String}
 */
function strReverse(value) {
    return value.split('').reverse().join('');
}

/**
 * Converts a string to lower case.
 * @param {String} value
 * @return {String}
 */
function strToLower(value) {
    return value.toLowerCase();
}

/**
 * Converts a string to upper case.
 * @param {String} value
 * @return {String}
 */
function strToUpper(value) {
    return value.toUpperCase();
}

/**
 * Randomizes characters of a string.
 * @param {String} value
 * @return {String}
 */
function strRandomize(value) {
    var array = value.split('');
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array.join('');
}

/**
 * Inverts case of a string.
 * @param {String} value
 * @return {String}
 */
function strInvertCase(value) {
    return value
        .split('')
        .map(function(c) {
            if (c === c.toLowerCase()) {
                return c.toUpperCase();
            } else {
                return c.toLowerCase();
            }
        })
        .join('');
}

module.exports = {
    strReverse,
    strToLower,
    strToUpper,
    strRandomize,
    strInvertCase
};
