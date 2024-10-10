const invalidChars = /[<>:"/\\|?*\u0000-\u001F]/g;
const reservedNames = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
const validReactComponentNameRegex = /^[A-Z][a-zA-Z0-9_]*$/;
const validExtensions = /\.(tsx)$/;

/**
 * Returns whether the provided name is a valid React component name.
 *
 * @param name the proposed name
 * @returns whether the provided name is a valid React component name
 */
export function isValidReactComponentName(name: string): boolean {
  return validReactComponentNameRegex.test(name);
}

/**
 * Returns whether the provided filename is valid.
 *
 * @param name the proposed filename
 * @returns whether the provided filename is valid
 */
export function isValidFileName(name: string): boolean {
  const nameWithoutExtension = name.replace(validExtensions, "");

  if (invalidChars.test(nameWithoutExtension)) return false;
  if (reservedNames.test(nameWithoutExtension)) return false;
  return nameWithoutExtension.trim().length > 0 && validExtensions.test(name);
}
