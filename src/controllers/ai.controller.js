import { sql } from "../db/database.js";
import { getRecommendations } from "../services/ai.service.js";

export const recommendProducts = async (req, res) => {
  const { query } = req.body;

  try {
    // get products from DB
    const products = await sql`
      SELECT * FROM products
      LIMIT 20
    `;

    // send to AI
    const aiResponse = await getRecommendations(query, products);

    return res.json({
      success: true,
      data: aiResponse
    });

  } catch (error) {
  console.error("AI ERROR:", error);
  return res.status(500).json({ 
    error: "AI service failed",
    details: error.message 
  });
}
};