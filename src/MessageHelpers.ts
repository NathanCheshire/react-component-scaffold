import * as vscode from "vscode";

export function vscodeInfo(message: string) {
  vscode.window.showInformationMessage(message);
}

export function vscodeError(message: string) {
  vscode.window.showErrorMessage(message);
}
