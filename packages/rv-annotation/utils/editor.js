/**
 * @description 获取指定几行的信息
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

/**
 * @description 从某几行中找到某段文本在文件中的起止位置
 * @param {Object} editor
 * @param {Object} text
 * @param {Object} range
 */
async function getRangeOfText(editor, text, range) {
	console.log("getRangeOfText:", text, range);
	const lines = await getMultiLines(editor, {
		start: range.start,
		end: range.end
	});
	try {
		const targetLine = lines.find(line => line.text.includes(text));
		const {index} = new RegExp(text).exec(targetLine.text);
		const startIndex = index + targetLine.start;
		return {
			start: startIndex,
			end: startIndex + text.length
		}
	} catch (e) {
		console.error(e);
	}
}

module.exports = {
	getMultiLines,
	getRangeOfText
};