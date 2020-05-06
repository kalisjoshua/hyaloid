// `Array.apply(0, new Array(diff))` creates a non-sparse array
const range = (from, to, inclusive) => Array
  .apply(0, new Array(+!!inclusive + (to ? (to - from) : from)))
  .map((_, i) => i + (to ? from : 1));

export default range;
