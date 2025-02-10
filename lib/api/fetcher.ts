const fetcher = async (url: string, useLocal = false) => {
  useLocal = process.env.NODE_ENV === "development";
  const baseUrl = useLocal
    ? process.env.LOCAL_API_URL // Use local API URL if `useLocal` is true
    : process.env.NEXT_PUBLIC_API_URL; // Otherwise, use the deployed API URL

  const fullUrl = `${baseUrl}${url}`;

  try {
    const res = await fetch(fullUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch from ${fullUrl}: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default fetcher;
