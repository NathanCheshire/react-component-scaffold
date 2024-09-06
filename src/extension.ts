import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

function isValidReactComponentName(name: string): boolean {
  // React component names must start with a capital letter and can only contain alphanumeric characters and underscores
  const validNameRegex = /^[A-Z][a-zA-Z0-9_]*$/;
  return validNameRegex.test(name);
}

function isValidFileName(name: string): boolean {
  const invalidChars = /[<>:"/\\|?*\u0000-\u001F]/g;
  const reservedNames = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
  return (
    !invalidChars.test(name) &&
    !reservedNames.test(name) &&
    name.trim().length > 0
  );
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.generateReactComponent",
    async (uri: vscode.Uri) => {
      // If uri is undefined, get the current workspace folder
      if (!uri) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          vscode.window.showErrorMessage("No workspace folder is open.");
          return;
        }
        uri = workspaceFolders[0].uri;
      }

      let componentName: string | undefined;
      let filePath: string | undefined;

      while (true) {
        // Prompt for the component name
        componentName = await vscode.window.showInputBox({
          prompt: "Enter the component name",
          placeHolder: "MyComponent",
          validateInput: (value) => {
            if (!isValidFileName(value)) {
              return "Invalid file name. Please use a valid name for the file system.";
            }
            if (!isValidReactComponentName(value)) {
              return "Invalid React component name. It should start with a capital letter and contain only alphanumeric characters and underscores.";
            }
            return null;
          },
        });

        if (!componentName) {
          vscode.window.showErrorMessage("Component name is required.");
          return;
        }

        // Path to create the .tsx file
        filePath = path.join(uri.fsPath, `${componentName}.tsx`);

        // Check if file already exists
        if (fs.existsSync(filePath)) {
          const overwrite = await vscode.window.showQuickPick(["Yes", "No"], {
            placeHolder: `${componentName}.tsx already exists. Overwrite?`,
          });
          if (overwrite === "Yes") {
            break;
          }
          // If 'No', the loop continues and asks for a new name
        } else {
          break; // File doesn't exist, so we can proceed
        }
      }

      // At this point, we're guaranteed to have a valid filePath and componentName

      // Component template with section comments
      const template = `
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

      // Write the .tsx file
      fs.writeFile(filePath, template, async (err) => {
        if (err) {
          vscode.window.showErrorMessage(
            "Failed to create component: " + err.message
          );
        } else {
          vscode.window.showInformationMessage(
            `${componentName}.tsx created successfully.`
          );

          // Open the newly created file
          const document = await vscode.workspace.openTextDocument(filePath);
          await vscode.window.showTextDocument(document);
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
