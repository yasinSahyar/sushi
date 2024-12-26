/*<ul class="product-list">
<li class="product-item">
  <img src="Product1.png" class="product-image" />
  <div class="product-details">
    <h3 class="product-name">Product1</h3>
    <p class="product-description">Description</p>
    <p class="product-allergens">Allergens</p>
    <p class="product-price">Price</p>
  </div>
</li>*/

// fetching menu items from database. categories are: maincourse, drink
const fetch_menu_items = async (categorie) => {
  try {
    const response = await fetch(`/api/menu?categorie=${categorie}`, {
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

const create_menu_lists = async () => {
  const mainCourseList = document.getElementById("main_course");
  const drinksList = document.getElementById("drinks_list");
  const maincourse_data = await fetch_menu_items("maincourse");
  mainCourseList.innerHTML = "";

  maincourse_data.forEach((element) => {
    mainCourseList.insertAdjacentHTML(
      "beforeend",
      `<li class="product-item">
      <img src="${element.image_src}" class="product-image" />
      <div class="product-details">
        <h3 class="product-name">${element.product_name}</h3>
        <p class="product-description">${element.product_description}</p>
        <p class="product-allergens">${element.product_allergens}</p>
        <p class="product-price">${element.price_text}</p>
      </div>`
    );
  });

  const drinks_data = await fetch_menu_items("drink");
  drinksList.innerHTML = "";
  drinks_data.forEach((element) => {
    drinksList.insertAdjacentHTML(
      "beforeend",
      `<li class="product-item">
      <img src="${element.image_src}" class="product-image" />
      <div class="product-details">
        <h3 class="product-name">${element.product_name}</h3>
        <p class="product-description">${element.product_description}</p>
        <p class="product-allergens">${element.product_allergens}</p>
        <p class="product-price">${element.price_text}</p>
      </div>`
    );
  });
};

create_menu_lists();
