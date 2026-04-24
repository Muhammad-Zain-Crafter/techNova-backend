import { sql } from "../db/database";

const addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  try {
    const existing = await sql`
      SELECT * FROM cart 
      WHERE user_id = ${user_id} AND product_id = ${product_id}
    `;

    if (existing.length > 0) {
      const updated = await sql`
        UPDATE cart
        SET quantity = quantity + ${quantity}
        WHERE user_id = ${user_id} AND product_id = ${product_id}
        RETURNING *
      `;

      return res.json({ success: true, data: updated[0] });
    }

    const newItem = await sql`
      INSERT INTO cart (user_id, product_id, quantity)
      VALUES (${user_id}, ${product_id}, ${quantity})
      RETURNING *
    `;

    return res.json({ success: true, data: newItem[0] });

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export {addToCart}