get_prfofiledata = async () => {
  try {
    const response = await fetch("/api/profileinformation", {
      method: "POST",
      body: JSON.stringify(),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.log(response);
    }
    const result = await response.json();
    console.log("Response:", result);
    document.getElementById("name").value = result[0].name;
    document.getElementById("surname").value = result[0].surname;
    document.getElementById("phone").value = result[0].phonenumber;
    return;
  } catch (error) {
    console.error("Error:", error);
  }
};

get_prfofiledata();
