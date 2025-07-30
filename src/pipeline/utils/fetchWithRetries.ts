/**
 * Every once in a while, the IPEDS bulk data download times out (some
 * of the files are relatively large), so we include a little bit of
 * light retrying logic here.
 */
export const fetchWithRetries = async (url: string, retries = 3) => {
  try {
    const rsp = await fetch(url);

    if (!rsp.ok) {
      throw new Error(`Failed to download file from ${url}`);
    }

    return rsp;
  } catch (error) {
    if (retries === 0) {
      throw error;
    }

    return await new Promise<Response>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const rsp = await fetchWithRetries(url, retries - 1)
          resolve(rsp);
        } catch (err) {
          reject(err);
        }
      }, 200);
    });
  }
};
