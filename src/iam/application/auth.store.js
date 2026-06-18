import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null, // Se espera 'customer', 'distributor', or 'producer'
        user: JSON.parse(localStorage.getItem('user') || 'null')
    }),
    actions: {
        async login(email, password) {
            // ✅ Mock API call para el prototipo
            return new Promise((resolve) => {
                setTimeout(() => {
                    const fakeToken = 'mock-jwt-token-' + Date.now();

                    // ✅ Buscamos si existe un usuario registrado con este correo
                    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                    const foundUser = registeredUsers.find(u => u.email === email);

                    let role = 'distributor'; // ✅ Rol por defecto si no se encuentra usuario (opcional)
                    let userName = 'Operador FruitLogix';

                    if (foundUser) {
                        // ✅ CORRECCIÓN 1: Usamos el rol "corto" que guardamos al registrar
                        role = foundUser.role;
                        userName = foundUser.username;
                    } else {
                        // ✅ OPCIONAL: Si no se encuentra, puedes resolver con error o dejar el default
                        // resolve({ success: false, message: 'Usuario no encontrado' });
                        // return;
                    }

                    // ✅ Validamos que el rol sea uno de los reconocidos por el sistema
                    if (!['customer', 'distributor', 'producer'].includes(role)) {
                        console.error(`⚠️ Rol inválido detectado: ${role}. Reiniciando a distribuidor.`);
                        role = 'distributor';
                    }

                    // ✅ Actualizamos el estado de Pinia
                    this.token = fakeToken;
                    this.role = role;
                    this.user = { email, name: userName, role };

                    // ✅ Guardamos en el LocalStorage para persistencia
                    localStorage.setItem('token', fakeToken);
                    localStorage.setItem('role', role); // ✅ Guardamos el rol "corto" correcto (ej: 'producer')
                    localStorage.setItem('user', JSON.stringify(this.user));

                    console.log(`✅ Login exitoso: ${email} como ${role}`);
                    resolve({ success: true, role });
                }, 500);
            });
        },
        async register(userData) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // ✅ Map userType to internal "short" role
                    const roleMap = {
                        'Cliente Comercial': 'customer',
                        'Distribuidor': 'distributor',
                        'Productor': 'producer'
                    };

                    // ✅ CORRECCIÓN 2: Nos aseguramos de obtener el rol corto correcto
                    const role = roleMap[userData.userType] || 'distributor';

                    // ✅ Obtenemos usuarios existentes y agregamos el nuevo
                    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

                    // ✅ Verificamos si el correo ya existe
                    if (registeredUsers.some(u => u.email === userData.email)) {
                        console.error(`⚠️ El correo ${userData.email} ya está registrado.`);
                        resolve({ success: false, message: 'Correo ya registrado' });
                        return;
                    }

                    registeredUsers.push({
                        username: userData.username,
                        email: userData.email,
                        phone: userData.phone,
                        role: role, // ✅ Guardamos el rol CORTO ('producer', 'customer', 'distributor')
                        userType: userData.userType // ✅ Guardamos el nombre largo solo como referencia visual
                    });

                    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

                    console.log(`✅ Registro exitoso en LocalStorage: ${userData.email} como ${role}`);
                    resolve({ success: true, role });
                }, 500);
            });
        },
        logout() {
            this.token = null;
            this.role = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            console.log('🚪 Sesión cerrada correctamente');
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        isCustomer: (state) => state.role === 'customer',
        isDistributor: (state) => state.role === 'distributor',
        isProducer: (state) => state.role === 'producer',
        userRole: (state) => state.role
    }
});