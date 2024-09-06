import * as vscode from "vscode";
import { generateReactComponentCommand } from "./Commands/GenerateReactComponentCommand";
import { ActivationCommands } from "./enums/ActivationCommands";

/**
 * Executed by VS code when a registered Activation event fires.
 */
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    ActivationCommands.GenerateReactComponent,
    generateReactComponentCommand
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  console.debug("Deactivating React Component Scaffold");
}
