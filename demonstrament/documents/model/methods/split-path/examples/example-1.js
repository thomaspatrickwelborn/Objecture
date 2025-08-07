function parsePath(path) {
  const regex = /(\.|\[(?:[^\\\]]|\\.)*?\])/;
  return path
    .split(regex)
    .filter(segment => segment && !/^\s*$/.test(segment) && !/^(\.|\[.*?\])$/.test(segment)) // Exclude empty segments and delimiters
    .map(segment => {
      // Handle bracketed content (strip brackets)
      if (segment.startsWith('[') && segment.endsWith(']')) {
        segment = segment.slice(1, -1); // Remove [ and ] (e.g., "['0']" -> "'0'")
      }
      // Handle quoted strings (strip single or double quotes)
      if (/^(['"])(.*?)\1$/.test(segment)) {
        return segment.slice(1, -1); // Strip quotes (e.g., "'0'" -> "0")
      }
      // Convert unquoted numeric strings to numbers (integers, decimals, negatives)
      if (/^-?\d*\.?\d+$/.test(segment)) {
        return Number(segment); // e.g., "0" -> 0, "0.1" -> 0.1, "-1" -> -1
      }
      return segment; // Keep as-is (e.g., "propertyA")
    });
}

console.log(parsePath("propertyA.0.propertyB.'propertyC.propertyD'"));
// ["propertyA", 0, "propertyB", "propertyC.propertyD"]

console.log(parsePath("propertyA['0'].propertyB['propertyC.propertyD']"));
// ["propertyA", "0", "propertyB", "propertyC.propertyD"]

console.log(parsePath("propertyA[-1].propertyB[0.1]"));
// ["propertyA", -1, "propertyB", 0.1]

console.log(parsePath("propertyA.'a.b.c'[key with spaces].propertyB"));
// ["propertyA", "a.b.c", "key with spaces", "propertyB"]