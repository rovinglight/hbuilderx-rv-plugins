const hx = require("hbuilderx");
const fileHeadService = require("./services/fileHeadService");
const funcService = require("./services/funcService");
//该方法将在插件激活的时候调用
function activate(context) {
  [
    hx.commands.registerCommand("extension.insertHeadAnnotation", () => {
      fileHeadService.insert();
    }),
	hx.commands.registerCommand("extension.insertFuncAnnotation", () => {
	  funcService.insert();
	}),
    hx.workspace.onWillSaveTextDocument((event) => {
      fileHeadService.update();
    }),
  ].forEach(context.subscriptions.push);
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {}
module.exports = {
  activate,
  deactivate,
};
