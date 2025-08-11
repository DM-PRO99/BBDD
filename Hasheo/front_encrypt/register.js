import bcrypt from 'bcryptjs'
import { getUsers, addUser } from "./api";

// Elementos del DOM
const registerForm = document.getElementById('register');
const registerMessage = document.getElementById('registerMessage');

// Función para mostrar mensajes
const showMessage = (element, message, type) => {
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
    setTimeout(() => {
        element.innerHTML = '';
    }, 5000);
};

const ecryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash
}

// Manejo del formulario de registro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    // Validaciones básicas
    if (!name || !email || !password) {
        showMessage(registerMessage, 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage(registerMessage, 'La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    try {
        // Verificar si el usuario ya existe
        const users = await getUsers();
        const existingUser = users.find(user => 
            user.name.toLowerCase() === name.toLowerCase() || 
            user.email.toLowerCase() === email.toLowerCase()
        );
        
        if (existingUser) {
            showMessage(registerMessage, 'El nombre o email ya están registrados', 'error');
            return;
        }

        const passwordHash = await ecryptPassword(password)

        // Crear objeto de usuario
        const newUser = {
            name,
            email,
            password: passwordHash
        };
        
        // Agregar usuario a la base de datos
        const result = await addUser(newUser);
        console.log(result);
        
        showMessage(registerMessage, 'Usuario registrado exitosamente', 'success');
        
        // Limpiar formulario
        registerForm.reset();
        
        // Redirigir a login después de 2 segundos
        setTimeout(() => {
            window.location.href = './index.html';
        }, 2000);
        
    } catch (error) {
        console.error('Error en el registro:', error);
        showMessage(registerMessage, 'Error al registrar usuario. Inténtalo de nuevo.', 'error');
    }
});

