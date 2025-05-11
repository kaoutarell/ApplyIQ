export async function fetchResults(query: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch results from backend");
  }

  const data = await response.json();

  return {
    think_text: data.think_text,
    assistant_text: data.assistant_text,
    citation_cards: data.cards, // Cards array is directly mapped here
  };
}
