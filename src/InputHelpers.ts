import * as vscode from "vscode";
import { isValidFileName, isValidReactComponentName } from "./RegexHelpers";

/**
 * Requests a name for the tsx and React component. The name is requried to be
 * valid for the file system and as a standard React component.
 */
export async function getReactComponentName() {
  return await vscode.window.showInputBox({
    prompt: "Enter the name for the React Component",
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
