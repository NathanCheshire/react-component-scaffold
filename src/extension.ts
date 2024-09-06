import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { ActivationCommands } from "./ActivationCommands";
import { getReactComponentName } from "./InputHelpers";
import { vscodeError, vscodeInfo } from "./MessageHelpers";
import { getFolderUri } from "./FileHelpers";

async function command(uri: vscode.Uri) {
  const outputUri = getFolderUri(uri);
  if (!outputUri) return;

  const componentName = await getReactComponentName();
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
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    ActivationCommands.GenerateReactComponent,
    command
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
