import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { ActivationCommands } from "./commands";
import { isValidFileName, isValidReactComponentName } from "./RegexHelpers";
import { vscodeError, vscodeInfo } from "./MessageHelpers";

function getFolderUri(uri: vscode.Uri): vscode.Uri | undefined {
  if (uri) return uri;
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscodeError("Could not find a valid workspace folder.");
    return undefined;
  }
  return workspaceFolders[0].uri;
}

async function getComponentNameInput() {
  return await vscode.window.showInputBox({
    prompt: "Enter the component name",
    placeHolder: "MyComponent",
    validateInput: (value: string) => {
      if (!isValidFileName(value)) {
        return "Invalid file name. Please use a valid name for the file system.";
      }
      if (!isValidReactComponentName(value)) {
        return "Invalid React component name. It should start with a capital letter and contain only alphanumeric characters and underscores.";
      }
      return null;
    },
  });
}

const command = async (uri: vscode.Uri) => {
  const outputUri = getFolderUri(uri);
  if (!outputUri) return;

  const componentName = await getComponentNameInput();
  if (!componentName) {
    vscodeError("Component name is required.");
    return;
  }

  const filePath = path.join(uri.fsPath, `${componentName}.tsx`);
  if (fs.existsSync(filePath)) {
    const overwrite = await vscode.window.showQuickPick(
      ["Overwrite", "Cancel"],
      {
        placeHolder: `${componentName}.tsx already exists.`,
      }
    );
    if (overwrite === "Cancel") return;
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

  fs.writeFile(
    filePath,
    componentTemplate,
    async (err: NodeJS.ErrnoException | null) => {
      if (err) {
        vscodeError("Failed to create component: " + err.message);
      } else {
        vscodeInfo(`${componentName}.tsx created successfully.`);

        // Open the newly created file
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
      }
    }
  );
};

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    ActivationCommands.GenerateReactComponent,
    command
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
