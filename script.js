const apiUrl = "https://jsonplaceholder.typicode.com/users";
const userForm = document.querySelector(".userForm");
const userList = document.querySelector(".userList");

const displayUsers = (users) => {
  console.log("Displaying users:", users);
  userList.innerHTML = "";
  users.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");
    userDiv.innerHTML = `
      <h3>${user.name}</h3>
      <p>Username: ${user.username}</p>
      <p>Email: ${user.email}</p>
      <p>Phone: ${user.phone}</p>
        <p>User ID: ${user.id}</p>
      <p>Website: ${user.website}</p>
      <p>Address: ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>
       <button class="edit" onclick="editUser(${user.id})">Edit</button>
      <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
      <hr>
    `;
    userList.appendChild(userDiv);
  });
};


// Indi API dan getirilir data, displaye ötürülür:
const getAllUsers = async () => {
  console.log("All users getirilir");
  try {
    const response = await fetch(apiUrl);
    const users = await response.json();
    console.log("Fetched users:", users);
    displayUsers(users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const createUser = async (data) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const newUser = await response.json();
    showNotification("User created successfully!");
    console.log("Created user:", newUser);

    displayUsers([...(await fetch(apiUrl).then((res) => res.json())), newUser]);
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const showNotification = (message) => {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.classList.add("show");

  notification.addEventListener(
    "animationend",
    () => {
      notification.classList.remove("show");
    },
    { once: true }
  );
};

const updateUser = async (id, data) => {
  console.log("Update user:", id, data);
  try {
    
    await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    showNotification("User updated successfully!");
    
  } catch (error) {
    console.error("Error updating user:", error);
  }
};




const deleteUser = async (id) => {
  console.log("Delete user:", id);
  try {

    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    showNotification("User deleted successfully!");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};





//Fln ID ye malik melumatlari getirmeliyem:
const editUser = (id) => {
  fetch(`${apiUrl}/${id}`)
    .then((response) => response.json())
    .then((user) => {
      userForm.name.value = user.name;
      userForm.username.value = user.username;
      userForm.email.value = user.email;
      userForm.phone.value = user.phone;
      userForm.website.value = user.website;
      userForm.userId.value = user.id;
    });
};







userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = {
    name: userForm.name.value,
    username: userForm.username.value,
    email: userForm.email.value,
    phone: userForm.phone.value,
    website: userForm.website.value,
    address: {
      street: userForm.street.value,
      suite: userForm.suite.value,
      city: userForm.city.value,
      zipcode: userForm.zipcode.value,
    },
  };
  const userId = userForm.userId.value;

  if (userId) {
    updateUser(userId, formData);
  } else {
    createUser(formData);
  }

  userForm.reset();
});

window.onload = getAllUsers; // sehife yuklendikde butun istifadeci melumatlari yuklenir.



