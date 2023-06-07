const hx = require("hbuilderx");
const dayjs = require("dayjs");
const { getMultiLines } = require("../utils/editor");

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

class FileHeadService {
  constructor() {
    this.skipUpdateOnce = false;
  }

  /**
   * 向文件头部插入描述注释
   */
  async insert() {
    const editor = await hx.window.getActiveTextEditor();
    const pattern = this.getPattern(editor.document.languageId);
    // TODO: 添加配置项来决定是否进行如下判断，默认为 true
    await this.checkIfAdded(editor);
    const linesToInsert = [
      pattern[0],
      this.getAnnotationLine("Description"),
      this.getAnnotationLine("Author"),
      this.getAnnotationLine("Date"),
      this.getAnnotationLine("LastEditor"),
      this.getAnnotationLine("LastEditTime"),
      pattern[1],
      ""
    ];
    const textToInsert = linesToInsert.join("\n");
    try {
      editor.edit(editBuilder => {
        editBuilder.replace(
          {
            start: 0,
            end: 0
          },
          textToInsert
        );
      });
    } catch (e) {
      /**
       * TODO:
       * 空文件下 HBuilder 提供的 api 无法插入文本，去社区反馈。
       * 把弹窗放在 catch 中也是为了兼容后续版本 HBuilder 对这个问题的修复
       */
      if (editor.document.lineCount === 0) {
        hx.window.showErrorMessage(
          "空文件暂时无法插入注释，请加个回车再尝试添加。"
        );
      }
    }
  }

  /**
   * 更新文件头部描述注释
   */
  async update() {
    try {
      const editor = await hx.window.getActiveTextEditor();
      const END_LINE = 10;
      if (editor.document.lineCount < 3) return;
      const lines = await getMultiLines(editor, {
        start: 0,
        end: Math.min(editor.document.lineCount - 1, END_LINE)
      });
      let editorLine = null;
      let editTimeLine = null;
      lines.forEach(line => {
        if (line.text.includes("@LastEditor")) {
          editorLine = line;
        } else if (line.text.includes("@LastEditTime")) {
          editTimeLine = line;
        }
      });
      console.log("editorLine", editorLine);
      console.log("editTimeLine", editTimeLine);
      editor.edit(editBuilder => {
        if (editorLine) {
          editBuilder.replace(
            {
              start: editorLine.start,
              end: editorLine.end
            },
            this.getAnnotationLine("LastEditor")
          );
        }
        if (editTimeLine) {
          editBuilder.replace(
            {
              start: editTimeLine.start,
              end: editTimeLine.end
            },
            this.getAnnotationLine("LastEditTime")
          );
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 根据类型返回对应的注释行字符串
   * @param {string} type
   */
  getAnnotationLine(type) {
    const config = hx.workspace.getConfiguration();
    switch (type) {
      case "Description":
        return ` * @Description: `;
      case "Author":
        return ` * @Author: ${config.get("author")}`;
      case "Date":
        return ` * @Date: ${dayjs().format(DATE_FORMAT)}`;
      case "LastEditor":
        return ` * @LastEditor: ${config.get("author")}`;
      case "LastEditTime":
        return ` * @LastEditTime: ${dayjs().format(DATE_FORMAT)}`;
    }
  }

  /**
   * 判断是否已经添加过头部注释了
   */
  async checkIfAdded(editor) {
    const END_LINE = 2;
    if (editor.document.lineCount === 0) return;
    const lines = await getMultiLines(editor, {
      start: 0,
      end: Math.min(editor.document.lineCount - 1, END_LINE)
    });
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
