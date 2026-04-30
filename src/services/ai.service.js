export const getRecommendations = async (userPrompt, products) => {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const prompt = `
User request: ${userPrompt}

Products:
${products.map(p => `- ${p.name}, price: ${p.price}`).join("\n")}

Return top 3 products with reasons in JSON.
`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  const data = await response.json();

  console.log("GEMINI RESPONSE:", JSON.stringify(data, null, 2));

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No AI response";
};