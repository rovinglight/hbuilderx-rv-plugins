const hx = require("hbuilderx");
const parser = require("@babel/parser");

/**
 * 函数注释
 */
class FuncService {
  constructor() {}

  /**
   * 插入函数注释
   */
  async insert() {
    const editor = await hx.window.getActiveTextEditor();
    const selectLine = await editor.document.lineFromPosition(
      editor.selection.active
    );
    const lineNumber = selectLine.lineNumber;
    const paramString = await this.getFuncParamsString(editor, lineNumber);
    const params = this.resolveParams(paramString);
    let indent = "";
    try {
	  const text = (await editor.document.lineAt(lineNumber)).text;
      indent = text.match(
        /^\s*/
      )?.[0];
    } catch (e) {
      console.error(e);
    }
    const annotationString = this.assembleAnnotationString(params, indent);
    editor.edit(editBuilder => {
      editBuilder.replace(
        {
          start: selectLine.end,
          end: selectLine.end
        },
        annotationString
      );
    });
  }

  assembleAnnotationString(params, indent) {
    return [
      "",
      indent + "/**",
      indent + " * @description: ",
      ...params.map(param =>
        this.getParamLine(
          param.name,
          param.tsType || param.defaultValueType,
          indent
        )
      ),
      indent + " * @returns",
      indent + " */"
    ].join("\n");
  }

  getParamLine(name, type = "*", indent = "") {
    const typeString = type ? type : "*";
    return `${indent} * @param {${typeString}} ${name}`;
  }

  /**
   * 获取函数参数字符串
   * @param {Object} editor
   * @param {Number} lineNumberToStart 从第几行开始寻找
   */
  async getFuncParamsString(editor, lineNumberToStart) {
    /** 最多查找多少行 */
    const MAX_LINES = 50;
    /** 分别找到几个左右括号 */
    let leftBracketFound = 0;
    let rightBracketFound = 0;
    /** 已经找了几行了 */
    let lineOffset = 0;
    let string = "";
    while (
      (leftBracketFound === 0 || leftBracketFound !== rightBracketFound) &&
      lineOffset < MAX_LINES
    ) {
      const line = await editor.document.lineAt(lineNumberToStart + lineOffset);
      leftBracketFound += line.text.match(/\(/g)?.length || 0;
      rightBracketFound += line.text.match(/\)/g)?.length || 0;
      string = string + line.text;
      lineOffset += 1;
    }
    const paramString = string.match(/\(.*\)/)[0];
    if (!leftBracketFound || !rightBracketFound || !paramString)
      throw new Error("未找到函数");
    return paramString;
  }

  resolveParams(paramsString) {
    const ast = parser.parseExpression(`function${paramsString}{}`, {
      plugins: ["typescript"]
    });
    console.log("ast", JSON.stringify(ast));
    return ast.params.map(paramNode => {
      let name = this.getNameFromNode(paramNode);
      let defaultValueType = this.getDefaultValueTypeFromNode(paramNode);
      let tsType = this.getTsTypeFromNode(paramNode);
      return {
        name,
        defaultValueType,
        tsType
      };
    });
  }

  getNameFromNode(node) {
    try {
      switch (node.type) {
        case "AssignmentPattern":
          return node.left.name;
        case "Identifier":
          return node.name;
      }
    } catch (e) {
      return null;
    }
  }

  getTsTypeFromNode(node) {
    try {
      const typeAnnotation =
        node.typeAnnotation?.typeAnnotation ||
        node?.left?.typeAnnotation?.typeAnnotation;
      if (!typeAnnotation) return null;
      switch (typeAnnotation.type) {
        case "TSStringKeyword":
          return "string";
        case "TSNumberKeyword":
          return "number";
        case "TSArrayType":
          return "Array";
        case "TSTypeLiteral":
          return "object";
        case "TSUndefinedKeyword":
          return "undefined";
        case "TSSymbolKeyword":
          return "symbol";
        case "TSNullKeyword":
          return "null";
        case "TSBooleanKeyword":
          return "boolean";
        case "TSBigIntKeyword":
          return "bigint";
        case "TSAnyKeyword":
          return "any";
        case "TSTypeReference":
          return typeAnnotation?.typeName?.name;
        default:
          return null;
        // TODO: 识别 union type
      }
    } catch (e) {
      return null;
    }
  }

  getDefaultValueTypeFromNode(node) {
    try {
      if (node.type !== "AssignmentPattern") return null;
      switch (node.right.type) {
        case "ObjectExpression":
          return "Object";
        case "NumericLiteral":
          return "Number";
        case "StringLiteral":
          return "String";
        case "ArrayExpression":
          return "Array";
        default:
          return null;
      }
    } catch (e) {
      return null;
    }
  }
}

module.exports = new FuncService();
