# `stats`

An advanced statistics library with an awesome documentation.

## Installation

It's already installed in your `node_modules`, all good.

## API

### `getMaxIndex(input, comparator)`

 * Returns index of the maximum element in the array.
 * Returns `-1` if array is empty.

### `getMaxElement(input, comparator)`

 * Returns the maximum element in the array.
 * Returns `null` if array is empty.

### `getMinIndex(input, comparator)`

 * Returns index of the minimum element in the array.
 * Returns `-1` if array is empty.

### `getMinElement(input, comparator)`

 * Returns the minimum element in the array.
 * Returns `null` if array is empty.

### `getMedianIndex(input, comparator)`

 * Returns index of the median element in the array.
 * Returns `-1` if array is empty.

### `getMedianElement(input, comparator)`

 * Returns the median element in the array.
 * Returns `null` if array is empty.

### `getAverageValue(input, getValue)`

 * Returns the average numeric value of the array.
 * Returns `null` if array is empty.

## Common arguments

### input

Input array.

### comparator

Comparator argument is the same comparator as used in `Array.prototype.sort` function.

### getValue

Returns the numeric value for a corresponding array item.
