import { sql } from "../db/database.js";

// ADD ADDRESS
const addAddress = async (req, res) => {
  const { full_name, phone, address_line, city, state, postal_code } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const newAddress = await sql`
      INSERT INTO addresses (
        user_id,
        full_name,
        phone,
        address_line,
        city,
        state,
        postal_code
      )
      VALUES (
        ${req.user.id},
        ${full_name},
        ${phone},
        ${address_line},
        ${city},
        ${state},
        ${postal_code}
      )
      RETURNING *
    `;

    return res.status(201).json({
      success: true,
      data: newAddress[0],
    });
  } catch (error) {
    console.error("Error creating address:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAddress = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const address = await sql`
      SELECT *
      FROM addresses
      WHERE user_id = ${req.user.id}
      ORDER BY id DESC
      LIMIT 1
    `;

    return res.status(200).json({
      success: true,
      data: address.length ? address[0] : null,
    });
  } catch (error) {
    console.error("Error fetching address:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// DELETE ADDRESS
const deleteAddress = async (req, res) => {
  const { id } = req.params;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // check ownership
    const address = await sql`
      SELECT * FROM addresses
      WHERE id = ${id} AND user_id = ${req.user.id}
    `;

    if (address.length === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    // delete
    await sql`
      DELETE FROM addresses
      WHERE id = ${id} AND user_id = ${req.user.id}
    `;

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { addAddress, getAddress, deleteAddress };