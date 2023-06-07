const hx = require("hbuilderx");
const fileHeadService = require("./services/fileHeadService");
//该方法将在插件激活的时候调用
function activate(context) {
	const insertHeadAnnotationDisposable = hx.commands.registerCommand('extension.insertHeadAnnotation', () => {
		fileHeadService.insert();
	});
	const willSaveTextDocumentEventDisposable = hx.workspace.onWillSaveTextDocument(function(event) {
		fileHeadService.update();
	});
	//订阅销毁钩子，插件禁用的时候，自动注销该command。
	context.subscriptions.push(insertHeadAnnotationDisposable);
	context.subscriptions.push(willSaveTextDocumentEventDisposable);
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
	activate,
	deactivate
}