// Set the initial index of the menu day
let currentIndex = 0;

// Get all the menu day elements, navigation buttons, and carousel wrapper
let days = document.querySelectorAll(".menu-day");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const carouselWrapper = document.querySelector(".carousel-wrapper");

// Function to get today's date in Finnish timezone
function getLocalDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Helsinki" })
  );
}

// Function to get a formatted date string (e.g., "Friday, December 6, 2024")
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Helsinki",
  });
}

// Function to rearrange the DOM elements based on the current day
function reorderMenuDays() {
  const today = getLocalDate();
  const currentDayIndex = today.getDay();

  const dayOrder = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const orderedDays = Array.from(document.querySelectorAll(".menu-day")).sort(
    (a, b) => {
      const aIdx = (dayOrder.indexOf(a.id) - currentDayIndex + 7) % 7;
      const bIdx = (dayOrder.indexOf(b.id) - currentDayIndex + 7) % 7;

      return aIdx - bIdx;
    }
  );

  // Log the order of weekdays in the console
  const orderNames = orderedDays.map((dayEl) => dayEl.id);
  console.log("Order of weekdays in the carousel:", orderNames);

  // Clear the wrapper and append new DOM elements back
  while (carouselWrapper.firstChild) {
    carouselWrapper.removeChild(carouselWrapper.firstChild);
  }

  orderedDays.forEach((dayEl) => {
    const h2 = dayEl.querySelector("h2");
    const formattedDate = formatDate(today);

    h2.textContent = `${dayEl.id.charAt(0).toUpperCase()}${dayEl.id.slice(
      1
    )} - ${formattedDate}`;

    carouselWrapper.appendChild(dayEl);
  });

  // Re-select the DOM elements to refresh `days` references
  days = document.querySelectorAll(".menu-day");
  currentIndex = 0; // Reset to initial index after DOM rearrangement

  updateMenuDates(); // Update the headers with the correct dates
  changeDay(currentIndex);
}

// Function to update the menu day headers with the correct dates
function updateMenuDates() {
  const today = getLocalDate();

  days.forEach((dayElement, index) => {
    const menuDate = new Date(today);
    menuDate.setDate(today.getDate() + index);

    const formattedDate = formatDate(menuDate);

    const h2 = dayElement.querySelector("h2");
    // Directly replace the content of h2 with the formatted date
    h2.textContent = formattedDate;
  });
}

function moveFirstOptionToLast() {
  const firstOption = carouselWrapper.firstElementChild;

  const newDate = getLocalDate();
  newDate.setDate(newDate.getDate() + 7);

  const dayName = firstOption.querySelector("h2").textContent.split(" ")[0];

  const formattedDate = formatDate(newDate);

  firstOption.querySelector("h2").textContent = `${dayName} ${formattedDate}`;

  carouselWrapper.appendChild(firstOption);
}

function setupMidnightUpdate() {
  const now = getLocalDate();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  const timeUntilMidnight = midnight.getTime() - now.getTime();

  setTimeout(() => {
    moveFirstOptionToLast();
    setupMidnightUpdate();
  }, timeUntilMidnight);
}

function changeDay(newIndex) {
  // Ensure newIndex is wrapped around properly
  if (newIndex < 0) newIndex = days.length - 1;
  if (newIndex >= days.length) newIndex = 0;

  // Remove the active class from the current day
  days[currentIndex].classList.remove("active");

  setTimeout(() => {
    currentIndex = newIndex;
    days[currentIndex].classList.add("active");
    carouselWrapper.style.transition = "transform 0.5s ease-in-out";
    carouselWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
  }, 500); // Prevent rapid clicking by matching animation duration
  // Apply the transform effect without delay
  currentIndex = newIndex;
  days[currentIndex].classList.add("active");

  carouselWrapper.style.transition = "transform 0.5s ease-in-out";
  carouselWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
}

let isAnimating = false;

prevButton.addEventListener("click", () => {
  if (isAnimating) return;

  isAnimating = true;
  changeDay(currentIndex - 1);

  setTimeout(() => {
    isAnimating = false;
  }, 500); // Prevent rapid clicking by matching animation duration
});

nextButton.addEventListener("click", () => {
  if (isAnimating) return;

  isAnimating = true;
  changeDay(currentIndex + 1);

  setTimeout(() => {
    isAnimating = false;
  }, 500); // Prevent rapid clicking by matching animation duration
});

days[currentIndex].classList.add("active");
carouselWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

reorderMenuDays(); // Dynamically rearranging DOM elements
setupMidnightUpdate();
