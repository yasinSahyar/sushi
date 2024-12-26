// Dropdown menu display
document.getElementById("login_icon").addEventListener("click", function () {
  console.log("Login icon clicked!"); // Add this log to see if the event is triggered
  const dropdown = document.getElementById("dropdown_menu");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

// Show the login modal when clicking 'Login/Register'
document
  .getElementById("login_register_option")
  .addEventListener("click", function () {
    document.getElementById("login_modal").style.display = "block";
  });

// Close the modal when clicking outside of it
window.onclick = function (event) {
  if (event.target === document.getElementById("login_modal")) {
    document.getElementById("login_modal").style.display = "none";
  }
};

// Dropdown menu display
document
  .getElementById("mobile_login_icon")
  .addEventListener("click", function () {
    console.log("Login icon clicked!"); // Add this log to see if the event is triggered
    const dropdown = document.getElementById("mobile_dropdown_menu");
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });

// Show the login modal when clicking 'Login/Register'
document
  .getElementById("mobile_login_register_option")
  .addEventListener("click", function () {
    document.getElementById("login_modal").style.display = "block";
  });
