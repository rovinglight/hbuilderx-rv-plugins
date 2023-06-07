const hx = require('hbuilderx');

const headAnnotation = `
/*
 * @Description: 
 * @Author: OBKoro1
 * @Date: 2018-09-27 13:55:00
 * @LastEditors: OBKoro1
 * @LastEditTime: 2018-11-08 16:10:19
 */
`;

const vueHeadAnnotation = `
  <!--
  * @Description: 
  * @Author: OBKoro1
  * @Date: 2018-11-16 14:38:05
  * @LastEditors: OBKoro1
  * @LastEditTime: 2018-11-19 14:32:45
  -->
`;

class FileHeadService {
	constructor() {
		this.skipUpdateOnce = false;
	}

	async insert() {
		try {
			const editor = await hx.window.getActiveTextEditor();
			const document = editor.document;
			const languageId = document.languageId;
			// 检查头部是否已有注释，若有则不再添加
			const LINE_TO_SEARCH = 2;
			const linesToSearch = await Promise.all(
				new Array(LINE_TO_SEARCH)
				.fill()
				.map((_, index) => editor.document.lineAt(index))
			);
			const pattern = this.findPattern(languageId);
			const hasAdded = linesToSearch.some(
				line => line.text.includes(pattern[0])
			);
			if (hasAdded) return;
			editor.edit(editBuilder => {
				editBuilder.replace({
					start: 0,
					end: 0
				}, headAnnotation);
			});
		} catch (e) {
			console.error(e);
		}
	}

	async update() {
		if (this.skipUpdateOnce) {
			this.skipUpdateOnce = false;
			return;
		}
		try {
			this.skipUpdateOnce = true;
		} catch (e) {
			//TODO handle the exception
		}
	}

	findPattern(languageId) {
		switch (languageId) {
			case "vue":
			case "html":
				return [
					"<!--",
					"-->"
				];
			default:
				return [
					"/*",
					"*/"
				];
		}
	}
}

module.exports = new FileHeadService();