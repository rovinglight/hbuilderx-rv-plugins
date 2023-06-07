/**
 *
 * @param {*} editor
 * @param {{start: Number; end: Number}} range
 */
async function getMultiLines(editor, range) {
  if (range.end < range.start) throw new Error("getMultiLine failed");
  if (range.start === 0 && range.end === 0) return [];
  const linesToSearch = Array(range.end - range.start + 1)
    .fill(range.start)
    .map((start, index) => start + index);
  const lines = Promise.all(
    linesToSearch.map(lineNumber => editor.document.lineAt(lineNumber))
  );
  return lines;
}

module.exports = { getMultiLines };
