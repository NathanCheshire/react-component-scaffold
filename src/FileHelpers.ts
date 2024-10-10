import * as vscode from "vscode";
import { vscodeError } from "./MessageHelpers";
import * as fs from "fs";
/**
 * Returns the URI of the folder to create a file inside of.
 * If this function was not invoked inside of the context of a folder,
 * the first workspace folder is returned if available.
 *
 * @param uri the current URI
 * @returns the URI to use
 */
export function getFolderUri(uri: vscode.Uri): vscode.Uri | undefined {
  if (uri) return uri;
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscodeError("Could not find a valid workspace folder.");
    return undefined;
  }
  return workspaceFolders[0].uri;
}

export function createAndWrite(
  filepath: string,
  contents: string,
  onSuccess?: () => void,
  onError?: (error: NodeJS.ErrnoException) => void
) {
  fs.writeFile(
    filepath,
    contents,
    async (err: NodeJS.ErrnoException | null) => {
      if (err) {
        onError?.(err);
      } else {
        onSuccess?.();
      }
    }
  );
}
