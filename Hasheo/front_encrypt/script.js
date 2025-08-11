import { getUserByName } from "./api";
import bcrypt from 'bcryptjs'

// Elementos del DOM
const loginForm = document.getElementById('login');
const loginMessage = document.getElementById('loginMessage');

export const showMessage = (element, message, type) => {
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
    setTimeout(() => {
        element.innerHTML = '';
    }, 5000);
};


const verifyPassword = async (passwordLogin, passwordDB) => {
    return await bcrypt.compare(passwordLogin, passwordDB )
}

// Manejo del formulario de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('loginName').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validaciones básicas
    if (!name || !password) {
        showMessage(loginMessage, 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    try {
        //  Obtener usuario específico por nombre
        const user = await getUserByName(name);

        console.log('user', user);
        
        if (!user) {
            showMessage(loginMessage, 'Usuario no encontrado', 'error');
            return;
        }
        
        //  Validar contraseña en el frontend 
        const isValidPassword = verifyPassword(password, user[0].password);

      
        
        if (!isValidPassword) {
            showMessage(loginMessage, 'Contraseña incorrecta', 'error');
            return;
        }
        
        showMessage(loginMessage, `¡Bienvenido ${user[0].name}!`, 'success');
        
        // Limpiar formulario
        loginForm.reset();
        
        // Aquí podrías redirigir a otra página o mostrar contenido adicional
        console.log('Usuario autenticado:', user);
        
        // Opcional: Guardar información del usuario en localStorage
        localStorage.setItem('user', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        }));
        
    } catch (error) {
        console.error('Error en el login:', error);
        
        // Manejar diferentes tipos de errores
        if (error.response) {
            // Error del servidor
            if (error.response.status === 404) {
                showMessage(loginMessage, 'Usuario no encontrado', 'error');
            } else {
                const errorMessage = error.response.data.message || 'Error al iniciar sesión';
                showMessage(loginMessage, errorMessage, 'error');
            }
        } else if (error.request) {
            // Error de red
            showMessage(loginMessage, 'Error de conexión. Verifica tu internet.', 'error');
        } else {
            // Otro error
            showMessage(loginMessage, 'Error al iniciar sesión. Inténtalo de nuevo.', 'error');
        }
    }
});

