
# ¿Por qué encriptar (o hashear) contraseñas antes de enviarlas a la base de datos?

En realidad, para contraseñas no se usa **encriptación** sino **hashing**. Aunque a veces se dice "encriptar contraseñas", el término correcto es **hashear contraseñas**.

## 1️⃣ Proteger la contraseña si la base de datos se filtra
- Si guardas contraseñas en **texto plano**, cualquiera que acceda a la base podrá leerlas.
- Si están **hasheadas**, aunque roben la base, no podrán obtener fácilmente la contraseña original.

## 2️⃣ Evitar problemas por reutilización de contraseñas
- Muchos usuarios usan la misma contraseña en varios servicios.
- Si tu base guarda contraseñas sin protección y se filtra, el atacante podrá entrar a otros servicios del usuario.

## 3️⃣ Cumplir con buenas prácticas y normativas
- Normas como **GDPR**, **ISO 27001** o **OWASP** recomiendan/obligan no almacenar contraseñas en texto plano.


## 4️⃣ Que ni el propio administrador pueda verlas
- La contraseña es **propiedad del usuario** y ni siquiera el admin debería conocerla.

---

## Hashing vs Encriptación

| Característica | Hashing | Encriptación |
|---------------|---------|--------------|
| **Reversible** | ❌ No | ✅ Sí |
| **Usado para contraseñas** | ✅ Sí | ❌ No recomendado |
| **Ejemplos** | bcrypt, argon2, pbkdf2 | AES, RSA |

> **Conclusión:** Para contraseñas se usa hashing, no encriptación.

---

## ¿`bcryptjs` encripta o hashea?
`bcryptjs` **no encripta**, **hashea** contraseñas.

### Cómo funciona `bcryptjs`:
1. **Genera un salt** → un valor aleatorio que se añade a la contraseña para que sea más difícil romperla por ataques.
2. **Aplica el algoritmo bcrypt** varias veces (cost factor o rondas).
3. **Devuelve el hash** → una cadena irreversible que no revela la contraseña original.

### Ejemplo en JavaScript:
```javascript
import bcrypt from 'bcryptjs';

// Hashear una contraseña
const password = 'mi_secreta_123';
const salt = await bcrypt.genSalt(10); // genera salt con 10 rondas
const hash = await bcrypt.hash(password, salt);
console.log('Hash generado:', hash);

// Verificar una contraseña
const isValid = await bcrypt.compare('mi_secreta_123', hash);
console.log('¿Contraseña correcta?', isValid);
```
