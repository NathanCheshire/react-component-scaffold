import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { ActivationCommands } from "./ActivationCommands";
import { createAndWrite, getFolderUri } from "./FileHelpers";
import { getReactComponentName, shouldOverwriteFile } from "./InputHelpers";
import { vscodeError, vscodeInfo } from "./MessageHelpers";

async function generateReactComponentCommand(uri: vscode.Uri) {
  const outputUri = getFolderUri(uri);
  if (!outputUri) return;

  const componentName = await getReactComponentName();
  if (!componentName) {
    vscodeError("Component name is required.");
    return;
  }

  const filePath = path.join(uri.fsPath, `${componentName}.tsx`);
  if (fs.existsSync(filePath)) {
    const shouldOverwrite = await shouldOverwriteFile(componentName);
    if (!shouldOverwrite) return;
  }

  const componentTemplate = `
interface Props {}

export default function ${componentName}({}: Props) {
// Preconditions

// Constants

// State

// Hooks

// Context

// Memos

// Effects

// Functions

return <></>;
}`;

  async function onCreateSuccess() {
    vscodeInfo(`${componentName}.tsx created successfully.`);
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);
  }

  function onCreateError(error: any) {
    vscodeError("Failed to create component: " + error.message);
  }

  createAndWrite(filePath, componentTemplate, onCreateSuccess, onCreateError);
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    ActivationCommands.GenerateReactComponent,
    generateReactComponentCommand
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
