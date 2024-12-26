document
  .getElementById("nextWeekBuffetForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const productName = document.getElementById("product-select").value.trim();
    const weekday = document.getElementById("weekday-select").value.trim();
    const productDescription = document
      .getElementById("productDescription")
      .value.trim();
    const type = document.getElementById("type").value.trim();
    const productAllergens = document
      .getElementById("productAllergens")
      .value.trim();

    // Ensure all fields are filled
    if (!productName || !weekday) {
      alert("Please select a product and weekday.");
      return;
    }

    const data = {
      productName,
      productDescription,
      productAllergens,
      type,
      weekday,
    };

    try {
      const response = await fetch("/api/addbuffetproduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add product.");
      }

      const result = await response.json();
      alert("Product added successfully!");
      console.log("Result:", result);

      // Reset the form and close the modal
      document.getElementById("nextWeekBuffetForm").reset();
      document.getElementById("nextWeekBuffetModal").style.display = "none";
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding product.");
    }
  });
