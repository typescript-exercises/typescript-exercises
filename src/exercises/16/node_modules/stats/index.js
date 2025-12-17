function getMaxIndex(input, comparator) {
    if (input.length === 0) {
        return -1;
    }
    var maxIndex = 0;
    for (var i = 1; i < input.length; i++) {
        if (comparator(input[i], input[maxIndex]) > 0) {
            maxIndex = i;
        }
    }
    return maxIndex;
}

function getMaxElement(input, comparator) {
    var index = getMaxIndex(input, comparator);
    return index === -1 ? null : input[index];
}

function getMinIndex(input, comparator) {
    if (input.length === 0) {
        return -1;
    }
    var maxIndex = 0;
    for (var i = 1; i < input.length; i++) {
        if (comparator(input[maxIndex], input[i]) > 0) {
            maxIndex = i;
        }
    }
    return maxIndex;
}

function getMinElement(input, comparator) {
    var index = getMinIndex(input, comparator);
    return index === -1 ? null : input[index];
}

function getMedianIndex(input, comparator) {
    if (input.length === 0) {
        return -1;
    }
    var data = input.slice().sort(comparator);
    return input.indexOf(data[Math.floor(data.length / 2)]);
}

function getMedianElement(input, comparator) {
    var index = getMedianIndex(input, comparator);
    return index === -1 ? null : input[index];
}

function getAverageValue(input, getValue) {
    if (input.length === 0) {
        return null;
    }
    return input.reduce(
        function (result, item) {
            return result + getValue(item);
        },
        0
    ) / input.length;
}

module.exports = {
    getMaxIndex,
    getMaxElement,
    getMinIndex,
    getMinElement,
    getMedianIndex,
    getMedianElement,
    getAverageValue
};
