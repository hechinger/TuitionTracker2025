const nbsp = "\xA0";
const widontRegex = new RegExp(/\s+([^\s]*)\s*$/);

/**
 * Prevents "widows" - a word by itself on a line - from appearing in strings
 * by replacing the space between the last two words with a non-breaking space
 * character.
 *
 * Copied from the lovely [journalize][] package because its types weren't
 * playing nicely.
 *
 * [journalize]: https://www.npmjs.com/package/journalize
 */
export function widont(val: string, replaceChar = nbsp) {
  if (!val) return "";
  return val.replace(widontRegex, `${replaceChar}$1`);
}
