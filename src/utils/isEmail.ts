/**
 * Regular expression found here:
 * https://stackoverflow.com/a/46181/7662668
 */
const email = new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

export function isEmail(value: string) {
  return email.test(value);
}
