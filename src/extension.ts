// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

var statusBarItem
export function activate(context: vscode.ExtensionContext) {

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right)
    
    function _updateStatusBar() {
        var showStatusBarButton = vscode.workspace.getConfiguration("rot").get<boolean>("showStatusBarButton")
        var statusBarCommand = vscode.workspace.getConfiguration("rot").get<string>("statusBarCommand")

        statusBarItem.command = statusBarCommand
        if (statusBarCommand == "rot.13") {
            statusBarItem.text = "ROT 13"
        } else if (statusBarCommand == "rot.47") {
            statusBarItem.text = "ROT 47"
        }
        if (showStatusBarButton) {
            statusBarItem.show()
        } else {
            statusBarItem.hide()
        }
    }
    
    _updateStatusBar()

    var rot13Command = vscode.commands.registerCommand('rot.13', () => {
        commandFunc(rot13)
    })
    context.subscriptions.push(rot13Command)

    var rot47Command = vscode.commands.registerCommand('rot.47', () => {
        commandFunc(rot47)
    })
    context.subscriptions.push(rot47Command)

    var configListener = vscode.workspace.onDidChangeConfiguration(_updateStatusBar, this, context.subscriptions)
}

export function deactivate() {
}

function rot13(text) {
    return text.replace(/[a-zA-Z]/g, function(c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
};

function rot47(text) {
    var s = [];
    for (var i = 0; i < text.length; i++) {
        var j = text.charCodeAt(i)
        if ((j >= 33) && (j <= 126)) {
            s[i] = String.fromCharCode(33 + ((j + 14) % 94));
        } else {
            s[i] = String.fromCharCode(j)
        }
    }
    return s.join('');
}

function commandFunc(rotFunc) {
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }

    var selections = editor.selections;

    editor.edit((edits) => {
        selections.forEach(selection => {
            var text = editor.document.getText(selection)
            edits.replace(selection, rotFunc(text))
        })
    })
}