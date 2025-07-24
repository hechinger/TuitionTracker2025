import Papa from "papaparse";

/**
 * Parse a CSV file downloaded from IPEDS.
 */
export const parseCsv = async <T = unknown>(text: string) => {
  const data =  new Promise<Papa.ParseResult<T>>((resolve, reject) => {
    try {
      Papa.parse<T>(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          resolve(results);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
  return data;
};
