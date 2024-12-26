app.post("/api/addbuffetproduct", async (req, res) => {
  const { productName, productDescription, productAllergens, type, weekday } =
    req.body;

  try {
    console.log(
      productName,
      productDescription,
      productAllergens,
      type,
      weekday
    );
    await pool.query(
      `INSERT INTO wasabi.weekly_buffet_next (product_name, product_description, product_allergens, type, weekday) VALUES ('${productName}', '${productDescription}', '${productAllergens}', '${type}', '${weekday}')`
    );
    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product." });
  }
});
