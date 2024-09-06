import * as vscode from "vscode";

/**
 * Displays the provided message as a VS code information message.
 */
export function vscodeInfo(message: string) {
  vscode.window.showInformationMessage(message);
}

/**
 * Displays the provided message as a VS code error message.
 */
export function vscodeError(message: string) {
  vscode.window.showErrorMessage(message);
}
