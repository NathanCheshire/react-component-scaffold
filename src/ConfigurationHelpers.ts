import * as vscode from "vscode";

const extensionName = "reactComponentScaffold";
const defaultNumTabs = 4;

/**
 * Returns the vs code workspace configuration for this extension.
 */
export function getExtensionConfig(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration(extensionName);
}

/**
 * Returns the indentation string to use per the extension configuration.
 */
export function getConfiguredIndentation() {
  const tabSize = getExtensionConfig().get<number>("tabSize", defaultNumTabs);
  return " ".repeat(tabSize);
}
