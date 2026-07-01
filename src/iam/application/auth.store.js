import { defineStore } from 'pinia';

const API_URL = 'https://fruitlogix-platform.onrender.com/api/v1/authentication';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null,
        user: JSON.parse(localStorage.getItem('user') || 'null')
    }),
    actions: {
        async login(username, password) {
            try {
                // 1. LLAMADA REAL AL BACKEND PARA EL JWT
                const response = await fetch(`${API_URL}/sign-in`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    throw new Error('Usuario o contraseña incorrectos');
                }

                const data = await response.json(); // Trae { id, username, token }

                // 2. RESCATAMOS LA METADATA DEL FRONTEND (Para saber a qué panel enviarlo)
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const foundMetadata = registeredUsers.find(u => u.username === username) || {};

                // Si no se encuentra rol, asumimos distribuidor por defecto
                const role = foundMetadata.role || 'distributor';

                // 3. GUARDAMOS LA SESIÓN REAL
                this.token = data.token;
                this.role = role;
                this.user = { id: data.id, username: data.username, role };

                localStorage.setItem('token', data.token);
                localStorage.setItem('role', role);
                localStorage.setItem('user', JSON.stringify(this.user));

                console.log(`✅ Login real exitoso: ${username} (Token JWT recibido)`);
                return { success: true, role };

            } catch (error) {
                console.error('❌ Error de login:', error);
                alert(error.message);
                return { success: false, message: error.message };
            }
        },

        async register(userData) {
            try {
                // 1. LLAMADA REAL AL BACKEND PARA CREAR LA CUENTA
                const response = await fetch(`${API_URL}/sign-up`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: userData.username,
                        password: userData.password
                    })
                });

                if (!response.ok) {
                    throw new Error('El usuario ya existe o los datos son inválidos');
                }

                // 2. GUARDAMOS EL ROL Y EL TELÉFONO EN EL LOCALSTORAGE
                const roleMap = {
                    'Cliente Comercial': 'customer',
                    'Distribuidor': 'distributor',
                    'Productor': 'producer'
                };
                const role = roleMap[userData.userType] || 'distributor';

                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

                // Evitamos duplicados en el LocalStorage
                if (!registeredUsers.some(u => u.username === userData.username)) {
                    registeredUsers.push({
                        username: userData.username,
                        email: userData.email,
                        phone: userData.phone,
                        role: role
                    });
                    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                }

                console.log(`✅ Registro real exitoso en Base de Datos: ${userData.username}`);
                return { success: true, role };

            } catch (error) {
                console.error('❌ Error de registro:', error);
                alert(error.message);
                return { success: false, message: error.message };
            }
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