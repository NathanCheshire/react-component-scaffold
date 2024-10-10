import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import {
  getComponentSections,
  getConfiguredIndentation,
} from "../ConfigurationHelpers";
import { createAndWrite, getFolderUri } from "../FileHelpers";
import { getReactComponentName, shouldOverwriteFile } from "../InputHelpers";
import { vscodeError, vscodeInfo } from "../MessageHelpers";
import { getComponentFileName, getSafeComponentName } from "../RegexHelpers";

/**
 * Generates the contents for the new component file.
 */
function generateComponentTemplate(componentName: string): string {
  const indent = getConfiguredIndentation();

  const sections = getComponentSections()
    .sort((a, b) => a.ordinal - b.ordinal)
    .map((section) => `${indent}// ${section.name}`)
    .join("\n\n");

  const lines = [
    "interface Props {}",
    "",
    `export default function ${componentName}({}: Props) {`,
    sections,
    "",
    `${indent}return <></>;`,
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

  const userInput = await getReactComponentName();
  // Nothing provided so probably purposeful cancel event
  if (!userInput) return;

  const componentFilename = getComponentFileName(userInput);
  const componentName = getSafeComponentName(userInput);

  const filePath = path.join(uri.fsPath, componentFilename);
  if (fs.existsSync(filePath)) {
    const shouldOverwrite = await shouldOverwriteFile(userInput);
    if (!shouldOverwrite) return;
  }

  async function onCreateSuccess() {
    vscodeInfo(`${componentFilename} created successfully.`);
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);
  }

  function onCreateError(error: NodeJS.ErrnoException) {
    vscodeError(
      `Failed to create component at file: ${componentFilename}, error message: ${error.message}`
    );
  }

  createAndWrite(
    filePath,
    generateComponentTemplate(componentName),
    onCreateSuccess,
    onCreateError
  );
}
