/**
 * US module
 */
type UsState = {
  fips: string;
  name: string;
  abbr: string;
  ap_abbr: string;
}

declare module "us" {
  const STATES: UsState[];
  function lookup(val: string): UsState | null;
}
