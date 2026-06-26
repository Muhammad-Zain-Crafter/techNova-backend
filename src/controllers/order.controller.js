import { sql } from "../db/database.js";
import { io } from "../index.js";

const createOrder = async (req, res) => {
  const { items, address_id } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({
      error: "Please provide at least one item for the order",
    });
  }

  if (!address_id) {
    return res.status(400).json({
      error: "Please provide address_id",
    });
  }

  try {
    // 1. Validate address belongs to user
    const address = await sql`
      SELECT * FROM addresses
      WHERE id = ${address_id} AND user_id = ${req.user.id}
    `;

    if (address.length === 0) {
      return res.status(400).json({ error: "Invalid address" });
    }

    // 2. Get all products in one query
    const productIds = items.map((i) => i.product_id);

    const products = await sql`
      SELECT * FROM products
      WHERE id = ANY(${productIds})
    `;

    // 3. Calculate total
    let totalPrice = items.reduce((total, item) => {
      const product = products.find((p) => p.id === item.product_id);

      if (!product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      return total + Number(product.price) * item.quantity;
    }, 0);

    // 4. Create order
    const newOrder = await sql`
      INSERT INTO orders (user_id, address_id, total_price, status)
      VALUES (${req.user.id}, ${address_id}, ${totalPrice}, 'pending')
      RETURNING *
    `;

    console.log("Emitting new_order event");
    io.emit("new_order", {
      message: "New order received",
      order: newOrder[0],
    });

    // 5. Insert order items (NO extra product query)
    for (let item of items) {
      const product = products.find((p) => p.id === item.product_id);

      await sql`
        INSERT INTO order_item (order_id, product_id, quantity, price)
        VALUES (${newOrder[0].id}, ${item.product_id}, ${item.quantity}, ${product.price})
      `;
    }

    return res.status(201).json({
      success: true,
      data: newOrder[0],
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const cancelOrder = async (req, res) => {
  const { id } = req.params;
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const order = await sql`
            SELECT * FROM orders WHERE id = ${id} AND user_id = ${req.user.id}
        `;
    if (order.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order[0].status !== "pending") {
      return res
        .status(400)
        .json({ error: "Only pending orders can be cancelled" });
    }
    if (order[0].status === "cancel") {
      return res.status(400).json({ error: "Order is already cancelled" });
    }
    await sql`
            UPDATE orders SET status = 'cancelled' WHERE id = ${id} AND user_id = ${req.user.id}
        `;
    console.log("Emitting order_cancelled event");
    io.emit("order_cancelled", {
      orderId: id,
      userId: req.user.id,
    });
    return res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMyOrders = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const orders = await sql`
      SELECT
        o.id,
        o.total_price,
        o.status,
        o.address_id,
        o.created_at,

        a.full_name,
        a.phone,
        a.address_line,
        a.city,
        a.state,
        a.postal_code,

        json_agg(
          json_build_object(
            'product_id', p.id,
            'name', p.name,
            'image', p.image,
            'price', oi.price,
            'quantity', oi.quantity
          )
        ) AS items

      FROM orders o

      JOIN addresses a
        ON a.id = o.address_id

      JOIN order_item oi
        ON oi.order_id = o.id

      JOIN products p
        ON p.id = oi.product_id

      WHERE o.user_id = ${req.user.id}
      AND o.status != 'cancelled'

      GROUP BY
        o.id,
        a.id

      ORDER BY o.id DESC
    `;

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getAllOrders = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const orders = await sql`
            SELECT * FROM orders
        `;
    return res.status(200).json({ data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const order = await sql`
            SELECT * FROM orders WHERE id = ${id}
        `;
    if (order.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    await sql`
            UPDATE orders SET status = ${status} WHERE id = ${id}
        `;
    // Emit order status update event to clients:
    console.log("Emitting order_status_updated event");
    io.emit("order_status_updated", {
      orderId: id,
      status,
    });
    return res
      .status(200)
      .json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  createOrder,
  cancelOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
