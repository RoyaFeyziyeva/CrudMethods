const apiUrl = "https://jsonplaceholder.typicode.com/users";
const userForm = document.querySelector(".userForm");
const userList = document.querySelector(".userList");

const notification = document.getElementById("notification");

const showNotification = (message) => {
  notification.innerText = message;
  notification.classList.add("show");
  setTimeout(() => notification.classList.remove("show"), 3000);
};

const displayUsers = (users) => {
  userList.innerHTML = "";
  users.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");
    userDiv.innerHTML = `
      <h3>${user.name}</h3>
      <p>Username: ${user.username}</p>
      <p>Email: ${user.email}</p>
      <p>Phone: ${user.phone}</p>
      <p>Website: ${user.website}</p>
      <button onclick="editUser(${user.id})">Edit</button>
      <button onclick="deleteUser(${user.id})">Delete</button>
      <hr>
    `;
    userList.appendChild(userDiv);
  });
};

const getAllUsers = async () => {
  try {
    const response = await fetch(apiUrl);
    const users = await response.json();
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
    getAllUsers();
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const updateUser = async (id, data) => {
  try {
    await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    showNotification("User updated successfully!");
    getAllUsers();
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const deleteUser = async (id) => {
  try {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    showNotification("User deleted successfully!");
    getAllUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

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
  };
  const userId = userForm.userId.value;

  if (userId) {
    updateUser(userId, formData);
  } else {
    createUser(formData);
  }

  userForm.reset();
});

window.onload = getAllUsers;
