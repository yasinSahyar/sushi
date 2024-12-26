const fetchBuffetItems = async (type, weekday) => {
  try {
    const response = await fetch(
      `/api/weekly_buffet?type=${type}&weekday=${weekday}`,
      {
        method: "POST",
        body: JSON.stringify(),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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

// Populate the menu for a specific day
const populateMenu = async (weekday) => {
  const types = ["carbohydrate", "maincourse", "soup"];
  for (const type of types) {
    const items = await fetchBuffetItems(type, weekday);

    const listElement = document.getElementById(`${weekday}_${type}`);
    listElement.innerHTML = ""; // Clear existing items
    items.forEach((item) => {
      const listItem = document.createElement("li");

      listItem.innerHTML = `
            <strong>${item.product_name}</strong><br>
            <p>${item.product_description}</p>
            <p><strong>Allergens:</strong> ${item.product_allergens}</p>
          `;

      listElement.appendChild(listItem);
    });
  }
};

// Populate all days of the week
const populateBuffetForWeek = async () => {
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  daysOfWeek.forEach(async (day) => {
    await populateMenu(day); // Populate each day of the week
  });
};

populateBuffetForWeek();
