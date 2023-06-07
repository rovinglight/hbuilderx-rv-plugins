const hx = require("hbuilderx");
const dayjs = require("dayjs");
const { getMultiLines } = require("../utils/editor");

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
const USER_NAME = "rovinglight";

class FileHeadService {
  constructor() {
    this.skipUpdateOnce = false;
  }

  /**
   * 向文件头部插入描述注释
   */
  async insert() {
    try {
      const editor = await hx.window.getActiveTextEditor();
      const pattern = this.getPattern(editor.document.languageId);
      // TODO: 添加配置项来决定是否进行如下判断，默认为 true
      await this.checkIfAdded(editor);
      const linesToInsert = [
        pattern[0],
        this.getAnnotationLine("Description"),
        this.getAnnotationLine("Author"),
        this.getAnnotationLine("Date"),
        this.getAnnotationLine("LastEditors"),
        this.getAnnotationLine("LastEditTime"),
        pattern[1],
		""
      ];
      editor.edit(editBuilder => {
        editBuilder.replace(
          {
            start: 0,
            end: 0
          },
          linesToInsert.join("\n")
        );
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 更新文件头部描述注释
   */
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

  /**
   * 根据类型返回对应的注释行字符串
   * @param {string} type
   */
  getAnnotationLine(type) {
    switch (type) {
      case "Description":
        return ` * @Description: `;
      case "Author":
        return ` * @Author: ${USER_NAME}`;
      case "Date":
        return ` * @Date: ${dayjs().format(DATE_FORMAT)}`;
      case "LastEditors":
        return ` * @LastEditors: ${USER_NAME}`;
      case "LastEditTime":
        return ` * @LastEditTime: ${dayjs().format(DATE_FORMAT)}`;
    }
  }

  /**
   * 判断是否已经添加过头部注释了
   */
  async checkIfAdded(editor) {
    const lines = await getMultiLines(editor, { start: 0, end: 2 });
    /** 当前文件类型对应的注释类型 */
    const pattern = this.getPattern(editor.document.languageId);
    /** 是否已经添加过注释头了 */
    const hasAdded = lines.some(line => line.text.includes(pattern[0]));
    if (hasAdded) throw "头部已添加注释";
  }

  /**
   * 根据文件类型返回对应的注释头尾模版
   * @param {string} languageId
   * @returns {[string, string]}
   */
  getPattern(languageId) {
    switch (languageId) {
      case "vue":
      case "html":
        return ["<!--", "-->"];
      default:
        return ["/*", "*/"];
    }
  }
}

module.exports = new FileHeadService();
