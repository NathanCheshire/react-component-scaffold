import * as vscode from "vscode";
import { defaultComponentSections } from "./enums/ComponentSections";

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

/**
 * Returns the configured component sections.
 */
export function getComponentSections() {
  return getExtensionConfig().get("sections", defaultComponentSections);
}
