async function populateNextWeekBuffetForm() {
  try {
    // Replace the simulated data with a real API call
    const response = await fetch("/api/getbuffetproducts");
    const products = await response.json();

    const productSelect = document.getElementById("product-select");

    // Populate the product-select dropdown
    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.productName; // Use productName as the value
      option.textContent = product.productName; // Display productName
      option.dataset.rowData = JSON.stringify(product); // Store the full row data in a data attribute
      productSelect.appendChild(option);
    });

    // Add event listener to update form fields when a product is selected
    productSelect.addEventListener("change", (event) => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      const rowData = JSON.parse(selectedOption.dataset.rowData || "{}");

      // Populate read-only input fields with the selected product's details
      document.getElementById("productDescription").value =
        rowData.productDescription || "";
      document.getElementById("productAllergens").value =
        rowData.productAllergens || "";
      document.getElementById("type").value = rowData.type || "";
    });
  } catch (error) {
    console.error("Error populating form:", error);
  }
}
