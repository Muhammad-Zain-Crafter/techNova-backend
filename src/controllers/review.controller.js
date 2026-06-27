import { sql } from "../db/database.js";

const createReview = async (req, res) => {
  const { product_id, rating, comment } = req.body;

  if (!req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  if (!product_id || !rating) {
    return res.status(400).json({
      success: false,
      message: "product_id and rating are required",
    });
  }
  const existingReview = await sql`
    SELECT *
    FROM reviews
    WHERE user_id = ${req.user.id}
    AND product_id = ${product_id}
`;

  if (existingReview.length > 0) {
    return res.status(400).json({
      success: false,
      message: "You have already reviewed this product.",
    });
  }
  try {
    const newReview = await sql`
            INSERT INTO reviews (user_id, product_id, rating, comment)
            VALUES (${req.user.id}, ${product_id}, ${rating}, ${comment})
            RETURNING *
        `;
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: newReview[0]
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const editReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  if (!req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  const review = await sql`
    SELECT *
    FROM reviews
    WHERE id = ${reviewId}
    AND user_id = ${req.user.id}
`;

  if (review.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }
  try {
    const updateReview = await sql`
            UPDATE reviews
            SET rating = ${rating}, comment = ${comment}
            WHERE id = ${reviewId} AND user_id = ${req.user.id}
            RETURNING *
        `;
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updateReview[0],
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  if (!req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const deletedReview = await sql`
    DELETE FROM reviews
    WHERE id = ${reviewId}
    AND user_id = ${req.user.id}
    RETURNING *
`;

    if (deletedReview.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      review: deletedReview[0]
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await sql`
        SELECT r.id, r.user_id, r.rating, r.comment, r.created_at, u.userid, u.name
        FROM reviews r INNER JOIN users u on r.user_id = u.userid
        WHERE r.product_id = ${productId}
        ORDER BY r.created_at DESC;
    `;
    const average = await sql`
        SELECT
        ROUND(AVG(rating),1) AS average_rating,
        COUNT(*) AS total_reviews
        FROM reviews
        WHERE product_id = ${productId}
`;
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews: reviews,
      average: average[0],
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { createReview, editReview, deleteReview, getReviewsByProduct };
