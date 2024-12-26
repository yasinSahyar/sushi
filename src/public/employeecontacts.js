document.addEventListener("DOMContentLoaded", () => {
  const contactList = document.querySelector(".contact_list");

  // Fetch employee contact information
  fetch("/api/employees")
    .then((response) => response.json())
    .then((employees) => {
      // Clear the placeholder list
      contactList.innerHTML = "";

      // Populate the contact list with employee data
      employees.forEach((employee) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${employee.name}</strong> - ${employee.title}<br>
            ${employee.email}<br>
            ${employee.phone}
          `;
        contactList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching employee data:", error);
      contactList.innerHTML = "<li>Error loading employee contacts.</li>";
    });
});
