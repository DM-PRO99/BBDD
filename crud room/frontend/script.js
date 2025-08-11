import { get, post, deletes, update } from "./services.js";

const urlUser = "/api/users";

const routes = {
  "/": "./login.html",
  "/users": "./users.html",
  "/newuser": "./newuser.html",
  "/about": "./about.html",
  "/rooms": "./rooms.html"
};

document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  }
});

async function navigate(pathname) {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  history.pushState({}, "", pathname);

  if (pathname === "/" && user) {
    return navigate("/users");
  }

  if (!user && pathname !== "/") {
    alert('Primero iniciá sesión');
    return navigate("/");
  }

  if (pathname === "/newuser" && user?.role !== "admin") {
    alert('No tienes permisos');
    return navigate("/users");
  }

  if (pathname === "/") {
    document.getElementById("app").style.display = "none";
    document.getElementById("login-content").innerHTML = html;
    setupLogin();
  } else {
    document.getElementById("login-content").innerHTML = "";
    document.getElementById("app").style.display = "flex";
    document.getElementById("content").innerHTML = html;
  }

  if (pathname === "/users") {
    renderUsers();
  }
  if (pathname === "/newuser") {
    createUser();
  }
  if (pathname === "/rooms") {
    renderRooms();
  }
}

window.addEventListener("popstate", () => navigate(location.pathname));

async function renderUsers() {
  let containerUsers = document.getElementById("container-users");
  containerUsers.innerHTML = "";

  const userLogged = JSON.parse(localStorage.getItem("loggedUser"));
  const isAdmin = userLogged?.role === "admin";

  let userData = await get(urlUser);

  userData.forEach((user) => {
    containerUsers.innerHTML += `
      <div style="border: 1px solid black; padding: 10px; margin: 10px;" id="user-${user.id}">
        <p><span class="user-name">${user.name}</span></p>
        <p><span class="user-email">${user.email}</span></p>
        <p><span class="user-phone">${user.phone || ''}</span></p>
        ${
          isAdmin
            ? `<button class="delete-user" data-id="${user.id}">Eliminar</button>
                <button class="edit-user" data-id="${user.id}">Editar</button>`
            : ""
        }
      </div>
    `;
  });

  if (isAdmin) {
    let buttonsDelete = document.querySelectorAll(".delete-user");
    buttonsDelete.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        let id = btn.dataset.id;
        let deleteUser = await deletes(urlUser, id);
        if (deleteUser) {
          Swal.fire('Usuario eliminado correctamente');
          navigate("/users");
        } else {
          Swal.fire('Error al eliminar el usuario');
        }
      });
    });

    let editButtons = document.querySelectorAll(".edit-user");
    editButtons.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = btn.dataset.id;
        const userDiv = document.getElementById(`user-${id}`);
        const currentName = userDiv.querySelector(".user-name").textContent;
        const currentEmail = userDiv.querySelector(".user-email").textContent;
        const currentPhone = userDiv.querySelector(".user-phone").textContent;

        userDiv.innerHTML = `
          <input type="text" class="edit-name" value="${currentName}" />
          <input type="email" class="edit-email" value="${currentEmail}" />
          <input type="text" class="edit-phone" value="${currentPhone}" />
          <button class="save-user" data-id="${id}">Guardar</button>
          <button class="cancel-edit" data-id="${id}">Cancelar</button>
        `;

        userDiv.querySelector(".save-user").addEventListener("click", async () => {
          const newName = userDiv.querySelector(".edit-name").value.trim();
          const newEmail = userDiv.querySelector(".edit-email").value.trim();
          const newPhone = userDiv.querySelector(".edit-phone").value.trim();

          if (!newName || !newEmail) {
            Swal.fire('Por favor, completa los campos obligatorios');
            return;
          }

          const updatedUser = {
            name: newName,
            email: newEmail,
            phone: newPhone
          };

          const updated = await update(urlUser, id, updatedUser);

          if (updated) {
            Swal.fire('Usuario actualizado correctamente');
            renderUsers();
          } else {
            Swal.fire('Error al actualizar el usuario');
          }
        });

        userDiv.querySelector(".cancel-edit").addEventListener("click", () => {
          renderUsers();
        });
      });
    });
  }
}

function createUser() {
  let form = document.getElementById("new-user-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;
    let role = "user";

    let newuser = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      role: role
    };
    let createUSer = await post(urlUser, newuser);
    if (createUSer) {
      Swal.fire('Usuario creado correctamente');
      navigate('/users');
    } else {
      Swal.fire('Error al crear el usuario');
    }
  });
}

async function setupLogin() {
  const form = document.getElementById("login-form");
  const msg = document.getElementById("login-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailOrUser = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // call backend login
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username: emailOrUser, password })
      });
      const data = await res.json();
      if (!res.ok) {
        msg.textContent = data.error || 'Credenciales inválidas';
        return;
      }
      // save token and user info
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('loggedUser', JSON.stringify({ username: data.username, role: data.role }));
      navigate('/users');
    } catch(err){
      console.error(err);
      msg.textContent = 'Error en el servidor';
    }
  });

  // register
  const regForm = document.getElementById('register-form');
  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        document.getElementById('register-msg').textContent = data.error || 'No se pudo registrar';
        return;
      }
      Swal.fire('Registrado correctamente. Inicia sesión.');
    } catch(err){
      console.error(err);
      document.getElementById('register-msg').textContent = 'Error en el servidor';
    }
  });
}

document.addEventListener("click", (e) => {
  if (e.target.id === "logout-btn") {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("loggedUser");
        navigate("/");
      }
    });
  }
});


// Rooms CRUD
const roomsUrl = "/api/rooms";

async function renderRooms() {
  const container = document.getElementById('rooms-container');
  container.innerHTML = '';
  const rooms = await get(roomsUrl);
  rooms.forEach(r=>{
    const div = document.createElement('div');
    div.innerHTML = `<strong>${r.name}</strong> - Capacidad: ${r.capacity} - Estado: ${r.status}
      <div>
        <button class="edit-room" data-id="${r.id}">Editar</button>
        <button class="delete-room" data-id="${r.id}">Borrar</button>
      </div>`;
    container.appendChild(div);
  });

  // attach handlers
  document.querySelectorAll('.delete-room').forEach(btn=>{
    btn.addEventListener('click', async (e)=>{
      const id = btn.dataset.id;
      const ok = await deletes(roomsUrl, id);
      if(ok) Swal.fire('Eliminado');
      renderRooms();
    });
  });

  document.querySelectorAll('.edit-room').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const id = btn.dataset.id;
      const newName = prompt('Nuevo nombre');
      const newCapacity = prompt('Nueva capacidad');
      if(!newName || !newCapacity) return;
      await update(roomsUrl, id, { name: newName, capacity: parseInt(newCapacity) });
      renderRooms();
    });
  });
}

document.getElementById && document.getElementById('new-room-form') && document.getElementById('new-room-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('room-name').value;
  const capacity = parseInt(document.getElementById('room-capacity').value);
  await post(roomsUrl, { name, capacity });
  document.getElementById('room-name').value = '';
  document.getElementById('room-capacity').value = '';
  renderRooms();
});

// Initial navigation
navigate(location.pathname);
