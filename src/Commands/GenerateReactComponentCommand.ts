import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { getConfiguredIndentation } from "../ConfigurationHelpers";
import { ComponentSections } from "../enums/ComponentSections";
import { getFolderUri, createAndWrite } from "../FileHelpers";
import { getReactComponentName, shouldOverwriteFile } from "../InputHelpers";
import { vscodeError, vscodeInfo } from "../MessageHelpers";

/**
 * Generates the contents for the new component file.
 */
function generateComponentTemplate(componentName: string): string {
  const indent = getConfiguredIndentation();

  const sections = Object.values(ComponentSections)
    .map((section) => `${indent}// ${section}`)
    .join("\n\n");

  const lines = [
    "interface Props {}",
    "",
    `export default function ${componentName}({}: Props) {`,
    sections,
    "",
    `${indent}return <></>`,
    "}",
  ];

  return lines.join("\n");
}

/**
 * Obtains a valid URI and requests a name for the React component scaffold from the user.
 * Once acquired and validated, the component is generated and opened.
 */
export async function generateReactComponentCommand(uri: vscode.Uri) {
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

  async function onCreateSuccess() {
    vscodeInfo(`${componentName}.tsx created successfully.`);
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);
  }

  function onCreateError(error: any) {
    vscodeError("Failed to create component: " + error.message);
  }

  createAndWrite(
    filePath,
    generateComponentTemplate(componentName),
    onCreateSuccess,
    onCreateError
  );
}
