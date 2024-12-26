// Orders Data and Functions
const orders = [
  { number: 1001, time: "2024-04-25 10:30", progress: "Waiting" },
  { number: 1002, time: "2024-04-25 11:15", progress: "In progress" },
  { number: 1003, time: "2024-04-25 12:45", progress: "Done" },
  { number: 1004, time: "2024-04-25 13:20", progress: "Waiting" },
  { number: 1005, time: "2024-04-25 14:05", progress: "In progress" },
  { number: 1006, time: "2024-04-25 15:30", progress: "Done" },
];

const orderDetails = {
  1001: {
    products: [
      { name: "Sushi Roll", price: 10 },
      { name: "Tempura", price: 8 },
    ],
  },
  1002: {
    products: [
      { name: "Ramen", price: 12 },
      { name: "Gyoza", price: 6 },
    ],
  },
  // Add more order details as needed
};

// Function to create a progress status element
function createProgressStatus(status) {
  const statusDiv = document.createElement("div");
  statusDiv.classList.add("progress-status");

  const circle = document.createElement("div");
  circle.classList.add("status-circle");

  if (status === "Waiting") circle.classList.add("status-waiting");
  else if (status === "In progress") circle.classList.add("status-in-progress");
  else if (status === "Done") circle.classList.add("status-done");

  const statusText = document.createElement("span");
  statusText.textContent = status;

  statusDiv.appendChild(circle);
  statusDiv.appendChild(statusText);

  return statusDiv;
}

// Function to render orders
function renderOrders(orderList) {
  const ordersContainer = document.getElementById("ordersContainer");
  ordersContainer.innerHTML = "";

  if (orderList.length === 0) {
    const noResult = document.createElement("div");
    noResult.classList.add("order-item");
    noResult.textContent = "No orders found.";
    ordersContainer.appendChild(noResult);
    return;
  }

  orderList.forEach((order) => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order-item");

    const numberDiv = document.createElement("div");
    numberDiv.classList.add("column", "order-number");
    numberDiv.innerHTML = `<a href="#" class="order-link">${order.number}</a>`;
    orderDiv.appendChild(numberDiv);

    const timeDiv = document.createElement("div");
    timeDiv.classList.add("column", "order-time");
    timeDiv.textContent = order.time;
    orderDiv.appendChild(timeDiv);

    const progressDiv = document.createElement("div");
    progressDiv.classList.add("column", "order-progress");
    progressDiv.appendChild(createProgressStatus(order.progress));
    orderDiv.appendChild(progressDiv);

    ordersContainer.appendChild(orderDiv);

    // Add event listener to the order link
    numberDiv.querySelector(".order-link").addEventListener("click", (e) => {
      e.preventDefault();
      handleOrderClick(order);
    });
  });
}

// Function to handle order click
function handleOrderClick(order) {
  const modal = document.getElementById("orderDetailsModal");
  const productList = document.getElementById("productList");
  const totalPrice = document.getElementById("totalPrice");

  // Populate Modal
  document.getElementById("modalOrderNumber").textContent = order.number;
  document.getElementById("modalOrderTime").textContent = order.time;
  document.getElementById("modalOrderStatus").value = order.progress;

  const products = orderDetails[order.number]?.products || [];
  productList.innerHTML = "";
  let total = 0;
  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.name} - $${product.price}`;
    productList.appendChild(li);
    total += product.price;
  });
  totalPrice.textContent = total;

  // Show modal and set up event listeners for close/save actions
  modal.classList.remove("hidden");
  initializeModalListeners(); // Reinitialize event listeners every time the modal is opened
}

function initializeModalListeners() {
  const modal = document.getElementById("orderDetailsModal");
  const closeModal = document.getElementById("closeModal");
  const saveChanges = document.getElementById("saveChanges");

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  saveChanges.addEventListener("click", () => {
    const orderNumber = parseInt(
      document.getElementById("modalOrderNumber").textContent,
      10
    );
    const newStatus = document.getElementById("modalOrderStatus").value;

    // Update the order's status
    const order = orders.find((order) => order.number === orderNumber);
    if (order) {
      order.progress = newStatus;
    }

    modal.classList.add("hidden");
    renderOrders(orders); // Re-render the orders list
  });
}

// Buffet/Menu Handling
const buffetOrMenu = document.getElementById("buffetOrMenu");
const buffetFields = document.getElementById("buffetFields");
const menuFields = document.getElementById("menuFields");
const addBuffetRowButton = document.getElementById("addBuffetRow");
const nextWeekBuffetForm = document.getElementById("nextWeekBuffetForm");
const modals = document.querySelectorAll(".managementmodal");
const closeButtons = document.querySelectorAll(".managementclose");

// Show modals on button click
document.querySelectorAll("[data-modal-target]").forEach((button) => {
  const targetModal = document.querySelector(button.dataset.modalTarget);
  button.addEventListener("click", () => {
    targetModal.style.display = "block";
  });
});

// Hide modals on close button click
closeButtons.forEach((close, index) => {
  close.addEventListener("click", () => {
    modals[index].style.display = "none";
  });
});

// Hide modals on outside click
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("managementmodal")) {
    e.target.style.display = "none";
  }
});

// Handle Buffet or Menu dropdown change
buffetOrMenu.addEventListener("change", () => {
  const value = buffetOrMenu.value;
  buffetFields.classList.toggle("visible", value === "Buffet");
  menuFields.classList.toggle("visible", value === "Menu");
});

get_products = async () => {
  try {
    const response = await fetch(`/api/menu?categorie=buffet`, {
      method: "POST",
      body: JSON.stringify(),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    console.log("Response:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

get_buffet_nextweek = async () => {
  try {
    const response = await fetch(`/api/weekly_buffet_nextweek`, {
      method: "POST",
      body: JSON.stringify(),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    console.log("Response:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

const delete_next_buffet = async (id, thiselement) => {
  console.log(id);
  thiselement.remove();
  try {
    const response = await fetch(`/api/delete_weeklybuffet_next?id=${id}`, {
      method: "POST",
      body: JSON.stringify(),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    console.log("Response:", result);
    return;
  } catch (error) {
    console.error("Error:", error);
  }
};

fill_modal = async () => {
  const modal = document.getElementById("nextWeekBuffetForm");
  const next_week_buffet = await get_buffet_nextweek();
  console.log(next_week_buffet);

  next_week_buffet.forEach((element) => {
    const ul = document.createElement("ul");
    const product_name = document.createElement("li");
    const weekday = document.createElement("li");
    const product_description = document.createElement("li");
    const product_allergens = document.createElement("li");
    const delete_button = document.createElement("input");
    delete_button.type = "button";
    delete_button.setAttribute(
      "onclick",
      `delete_next_buffet('${element.id}', this.parentElement)`
    );
    delete_button.value = "Delete from database";
    product_name.innerHTML = `<li><p>Product_name:</p><p>${element.product_name}</p></li>`;
    weekday.innerHTML = `<li><p>Weekday:</p><p>${element.weekday}</p></li>`;
    product_description.innerHTML = `<li><p>Product_description:</p><p>${element.product_description}</p></li>`;
    product_allergens.innerHTML = `<li><p>Product_allergens:</p><p>${element.product_allergens}</p></li>`;
    ul.appendChild(product_name);
    ul.appendChild(weekday);
    ul.appendChild(product_description);
    ul.appendChild(product_allergens);
    ul.appendChild(delete_button);
    modal.insertBefore(ul, modal.firstChild);
  });

  /* modal.insertAdjacentHTML(
    "afterbegin",
    `
     <ul>
        <li>product_name</li>
        <li>weekday</li>
        <li>product_description</li>
        <li>product_allergens</li>
        <li>price_text</li>
      </ul>`
  );*/
};

// Add new product-weekday rows in Next Week's Buffet modal
/*addBuffetRowButton.addEventListener("click", async () => {
  products = await get_products();

  const newRow = document.createElement("div");
  newRow.classList.add("form-row");
  newRow.innerHTML = `
    <label>Product</label>
    `;

  const productSelect = document.createElement("select");
  productSelect.classList.add("product-select");

  products.forEach((element) => {
    productSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${element.product_name}">${element.product_name}</option>`
    );
  });

  const description = document.createElement("p");
  const type = document.createElement("p");
  const allergens = document.createElement("p");

  description.innerText = `Description: ${
    products.filter((value) => value.product_name === productSelect.value)[0]
      .product_description
  }`;

  type.innerText = `Type: ${
    products.filter((value) => value.product_name === productSelect.value)[0]
      .type
  }`;

  allergens.innerText = `Allergens: ${
    products.filter((value) => value.product_name === productSelect.value)[0]
      .product_allergens
  }`;

  productSelect.onchange = () => {
    description.innerText = `Description: ${
      products.filter((value) => value.product_name === productSelect.value)[0]
        .product_description
    }`;

    type.innerText = `Type: ${
      products.filter((value) => value.product_name === productSelect.value)[0]
        .type
    }`;

    allergens.innerText = `Allergens: ${
      products.filter((value) => value.product_name === productSelect.value)[0]
        .product_allergens
    }`;
  };

  const newRow2 = document.createElement("div");
  newRow2.classList.add("form-row");
  newRow2.innerHTML = `
    <label>Weekday</label>
    `;

  const weekdaySelect = document.createElement("select");
  weekdaySelect.classList.add("weekday-select");
  weekdaySelect.innerHTML = `
      <option value="monday">Monday</option>
      <option value="tuesday">Tuesday</option>
      <option value="wednesday">Wednesday</option>
      <option value="thursday">Thursday</option>
      <option value="friday">Friday</option>
      <option value="saturday">Saturday</option>
      <option value="sunday">Sunday</option>
    `;

  newRow.appendChild(productSelect);
  newRow.appendChild(description);
  newRow.appendChild(type);
  newRow.appendChild(allergens);
  newRow.appendChild(weekdaySelect);

  nextWeekBuffetForm.insertBefore(newRow, addBuffetRowButton);
});*/

// Function to initialize event listeners
function initializeEventListeners() {
  document.getElementById("searchBar").addEventListener("input", handleSearch);

  const filterCheckboxes = document.querySelectorAll(".filter-checkbox");
  filterCheckboxes.forEach((checkbox) =>
    checkbox.addEventListener("change", handleSearch)
  );
}

// Function to handle search and apply filters
function handleSearch() {
  const searchTerm = document.getElementById("searchBar").value.toLowerCase();
  const showWaiting = document.getElementById("filterWaiting").checked;
  const showInProgress = document.getElementById("filterInProgress").checked;
  const showDone = document.getElementById("filterDone").checked;

  const allChecked = showWaiting && showInProgress && showDone;
  const noneChecked = !showWaiting && !showInProgress && !showDone;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.number.toString().toLowerCase().includes(searchTerm) ||
      order.time.toLowerCase().includes(searchTerm) ||
      order.progress.toLowerCase().includes(searchTerm);

    if (noneChecked || allChecked) return matchesSearch;

    const matchesStatus =
      (showWaiting && order.progress === "Waiting") ||
      (showInProgress && order.progress === "In progress") ||
      (showDone && order.progress === "Done");

    return matchesSearch && matchesStatus;
  });

  renderOrders(filteredOrders);
}

function sortOrdersByProgress() {
  const priority = { Waiting: 1, "In progress": 2, Done: 3 };
  orders.sort((a, b) => priority[a.progress] - priority[b.progress]);
}

document
  .getElementById("addProductForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const productName = document.getElementById("productName").value.trim();
    const productDescription = document
      .getElementById("productDescription")
      .value.trim();
    const productAllergens = document
      .getElementById("productAllergens")
      .value.trim();
    const buffetOrMenu = document.getElementById("buffetOrMenu").value;

    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("productAllergens", productAllergens);
    formData.append("buffetOrMenu", buffetOrMenu);

    if (buffetOrMenu === "Buffet") {
      const buffetType = document.getElementById("buffetType").value;
      formData.append("buffetType", buffetType);
    } else if (buffetOrMenu === "Menu") {
      const menuCategory = document.getElementById("menuCategory").value;
      const menuPrice = document.getElementById("menuPrice").value;
      const menuImage = document.getElementById("menuImage").files[0];

      formData.append("menuCategory", menuCategory);
      formData.append("menuPrice", menuPrice);

      if (menuImage) {
        formData.append("menuImage", menuImage);
      }
    }

    try {
      const response = await fetch("/api/addproduct", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add product.");
      }

      const result = await response.json();
      alert("Product added successfully!");
      console.log("Result:", result);

      // Reset the form and close the modal
      document.getElementById("addProductForm").reset();
      document.getElementById("addProductModal").style.display = "none";
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding product.");
    }
  });

document.getElementById("buffetsubmit").addEventListener("click", async (e) => {
  e.preventDefault();

  const productName = document.getElementById("product-select").value.trim();
  const weekday = document.getElementById("weekday-select").value.trim();
  const productDescription = document
    .getElementById("description")
    .value.trim();
  const type = document.getElementById("type").value.trim();
  const productAllergens = document.getElementById("allergens").value.trim();

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
  console.log(data);

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

// Function to populate nextWeekBuffetForm
async function populateNextWeekBuffetForm() {
  try {
    // Replace the simulated data with a real API call
    const response = await fetch("/api/getbuffetproducts");
    const products = await response.json();

    const productSelect = document.getElementById("product-select");

    // Populate the product-select dropdown
    products.forEach((product) => {
      console.log("Product:", product);

      const option = document.createElement("option");
      option.value = product.product_name; // Use productName as the value
      option.textContent = product.product_name; // Display productName
      option.dataset.rowData = JSON.stringify(product); // Store the full row data in a data attribute
      productSelect.appendChild(option);
    });

    // Add event listener to update form fields when a product is selected
    productSelect.addEventListener("change", (event) => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      console.log("Selected Option:", selectedOption);

      const rowData = JSON.parse(selectedOption.dataset.rowData || "{}");
      console.log("Row Data:", rowData);
      console.log(rowData.product_allergens);

      document.getElementById("description").value =
        rowData.product_description;
      document.getElementById("allergens").value = rowData.product_allergens;
      document.getElementById("type").value = rowData.type;
    });
  } catch (error) {
    console.error("Error populating form:", error);
  }
}

get_products = async () => {
  try {
    const response = await fetch(`/api/products`, {
      method: "POST",
      body: JSON.stringify(),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    console.log("Response:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

const delete_products = async (id, thiselement) => {
  console.log(id);
  thiselement.remove();
  try {
    const response = await fetch(`/api/delete_from_products?id=${id}`, {
      method: "POST",
      body: JSON.stringify(),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    console.log("Response:", result);
    return;
  } catch (error) {
    console.error("Error:", error);
  }
};

fill_delete_product_modal = async () => {
  const modal = document.getElementById("deleteProductForm");
  const all_products = await get_products();
  console.log(all_products);

  all_products.forEach((element) => {
    const ul = document.createElement("ul");
    const product_name = document.createElement("li");
    const category = document.createElement("li");
    const type = document.createElement("li");
    const weekday = document.createElement("li");
    const product_description = document.createElement("li");
    const product_allergens = document.createElement("li");
    const price_text = document.createElement("li");
    const delete_button = document.createElement("input");
    delete_button.type = "button";
    delete_button.setAttribute(
      "onclick",
      `delete_products('${element.id}', this.parentElement)`
    );
    delete_button.value = "Delete from database";

    product_name.textContent = element.product_name;
    category.textContent = element.categorie;
    type.textContent = element.type;
    weekday.textContent = element.weekday;
    product_description.textContent = element.product_description;
    product_allergens.textContent = element.product_allergens;
    price_text.textContent = element.price_text;
    ul.appendChild(product_name);
    ul.appendChild(category);
    ul.appendChild(type);
    ul.appendChild(weekday);
    ul.appendChild(product_description);
    ul.appendChild(product_allergens);
    ul.appendChild(price_text);
    ul.appendChild(delete_button);
    modal.insertBefore(ul, modal.firstChild);
  });
};
// Function to clear all select fields when opening the modal
function resetModalSelects() {
  const selects = document.querySelectorAll("#addProductForm select");
  const buffetselects = document.querySelectorAll("#nextWeekBuffetForm select");
  selects.forEach((select) => {
    select.value = ""; // Set the select value to empty string
  });
  buffetselects.forEach((select) => {
    select.value = "";
  });
}

// Event listener to open the modal
document.getElementById("openAddProductModal").addEventListener("click", () => {
  resetModalSelects();
  document.getElementById("addProductModal").style.display = "block";
});

initializeEventListeners();
sortOrdersByProgress();
renderOrders(orders);
populateNextWeekBuffetForm();
fill_modal();
fill_delete_product_modal();
