const API = '/api';
let token = localStorage.getItem('token') || null;

function setAuth(t, username){
  token = t;
  if(t) {
    localStorage.setItem('token', t);
    document.getElementById('user-area').innerHTML = `<div>Hola, ${username} <button id="logout">Logout</button></div>`;
    document.getElementById('logout').addEventListener('click', () => { localStorage.removeItem('token'); token=null; showLogin(); });
  } else {
    localStorage.removeItem('token');
    document.getElementById('user-area').innerHTML = '';
  }
}

function authHeaders(){ return token ? { 'Content-Type':'application/json', 'Authorization': 'Bearer '+token } : { 'Content-Type':'application/json' }; }

document.getElementById('show-register').addEventListener('click', () => {
  document.getElementById('login-form').style.display='none';
  document.getElementById('register-form').style.display='block';
});
document.getElementById('show-login').addEventListener('click', () => {
  document.getElementById('login-form').style.display='block';
  document.getElementById('register-form').style.display='none';
});

// register
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;
  const res = await fetch(`${API}/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password }) });
  const data = await res.json();
  if(res.ok){ alert('Registrado. Ahora inicia sesión.'); document.getElementById('show-login').click(); }
  else alert('Error: ' + (data.error || JSON.stringify(data)));
});

// login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const res = await fetch(`${API}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password }) });
  const data = await res.json();
  if(res.ok){ setAuth(data.token, data.username); showDashboard(); } else alert('Login failed: ' + (data.error || JSON.stringify(data)));
});

function showLogin(){
  setAuth(null);
  document.getElementById('auth-card').style.display='block';
  document.getElementById('dashboard').style.display='none';
}
function showDashboard(){
  document.getElementById('auth-card').style.display='none';
  document.getElementById('dashboard').style.display='block';
  fetchProducts();
  fetchCustomers();
}

if(token) {
  // verify token by calling a protected endpoint (customers)
  fetch(`${API}/customers`, { headers: authHeaders() }).then(r => {
    if(r.ok) {
      r.json().then(()=> { setAuth(token, ''); showDashboard(); });
    } else { showLogin(); }
  }).catch(()=> showLogin());
} else showLogin();

// products
async function fetchProducts(){
  const res = await fetch(`${API}/products`);
  const data = await res.json();
  const tbody = document.querySelector('#products-table tbody');
  tbody.innerHTML = '';
  data.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.product_id}</td>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.stock}</td>
      <td>${p.category || ''}</td>
      <td>
        <button onclick="editProduct(${p.product_id})">Editar</button>
        <button onclick="deleteProduct(${p.product_id})" class="secondary">Borrar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function editProduct(id){
  const res = await fetch(`${API}/products`);
  const all = await res.json();
  const p = all.find(x=>x.product_id==id);
  if(!p) return;
  document.getElementById('edit-id').value = p.product_id;
  document.getElementById('p-name').value = p.name;
  document.getElementById('p-desc').value = p.description || '';
  document.getElementById('p-price').value = p.price;
  document.getElementById('p-stock').value = p.stock;
  document.getElementById('p-category').value = p.category || '';
}

document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const body = {
    name: document.getElementById('p-name').value,
    description: document.getElementById('p-desc').value,
    price: parseFloat(document.getElementById('p-price').value),
    stock: parseInt(document.getElementById('p-stock').value),
    category: document.getElementById('p-category').value
  };
  if(!token){ alert('Debes iniciar sesión'); return; }
  if(!id){
    await fetch(`${API}/products`, { method:'POST', headers: authHeaders(), body: JSON.stringify(body) });
  } else {
    await fetch(`${API}/products/${id}`, { method:'PUT', headers: authHeaders(), body: JSON.stringify(body) });
  }
  clearProductForm();
  fetchProducts();
});

document.getElementById('clear-form').addEventListener('click', clearProductForm);
function clearProductForm(){ document.getElementById('edit-id').value=''; document.getElementById('p-name').value=''; document.getElementById('p-desc').value=''; document.getElementById('p-price').value=''; document.getElementById('p-stock').value=''; document.getElementById('p-category').value=''; }

async function deleteProduct(id){
  if(!confirm('Borrar producto?')) return;
  if(!token){ alert('Debes iniciar sesión'); return; }
  await fetch(`${API}/products/${id}`, { method:'DELETE', headers: authHeaders() });
  fetchProducts();
}

// CSV upload
document.getElementById('upload-csv').addEventListener('click', async () => {
  const fileInput = document.getElementById('product-csv');
  if (!fileInput.files.length) { alert('Selecciona un CSV'); return; }
  if(!token){ alert('Debes iniciar sesión'); return; }
  const fd = new FormData();
  fd.append('file', fileInput.files[0]);
  const res = await fetch(`${API}/upload/products`, { method:'POST', headers: { 'Authorization': 'Bearer '+token }, body: fd });
  const data = await res.json();
  if(res.ok){ alert('Insertados: ' + data.inserted); fileInput.value=''; fetchProducts(); } else alert('Error: ' + (data.error || JSON.stringify(data)));
});

// customers
async function fetchCustomers(){
  if(!token) return;
  const res = await fetch(`${API}/customers`, { headers: authHeaders() });
  const data = await res.json();
  const tbody = document.querySelector('#customers-table tbody');
  tbody.innerHTML = '';
  data.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.customer_id}</td>
      <td>${c.first_name} ${c.last_name}</td>
      <td>${c.email || ''}</td>
      <td>${c.phone || ''}</td>
      <td>
        <button onclick="editCustomer(${c.customer_id})">Editar</button>
        <button onclick="deleteCustomer(${c.customer_id})" class="secondary">Borrar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('customer-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if(!token){ alert('Debes iniciar sesión'); return; }
  const id = document.getElementById('c-edit-id').value;
  const body = {
    first_name: document.getElementById('c-first').value,
    last_name: document.getElementById('c-last').value,
    email: document.getElementById('c-email').value,
    phone: document.getElementById('c-phone').value
  };
  if(!id){
    await fetch(`${API}/customers`, { method:'POST', headers: authHeaders(), body: JSON.stringify(body) });
  } else {
    await fetch(`${API}/customers/${id}`, { method:'PUT', headers: authHeaders(), body: JSON.stringify(body) });
  }
  clearCustomerForm();
  fetchCustomers();
});

document.getElementById('clear-customer-form').addEventListener('click', clearCustomerForm);
function clearCustomerForm(){ document.getElementById('c-edit-id').value=''; document.getElementById('c-first').value=''; document.getElementById('c-last').value=''; document.getElementById('c-email').value=''; document.getElementById('c-phone').value=''; }

async function editCustomer(id){
  const res = await fetch(`${API}/customers`, { headers: authHeaders() });
  const all = await res.json();
  const c = all.find(x=>x.customer_id==id);
  if(!c) return;
  document.getElementById('c-edit-id').value = c.customer_id;
  document.getElementById('c-first').value = c.first_name;
  document.getElementById('c-last').value = c.last_name;
  document.getElementById('c-email').value = c.email || '';
  document.getElementById('c-phone').value = c.phone || '';
}
