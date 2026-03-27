export async function sendToBackend(text: string) {

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;   

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
    }

  const res = await fetch(`${baseUrl}/intake`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      session_id: "demo",
      text
    })
  });

  return res.json();
}