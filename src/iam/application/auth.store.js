import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null,
        user: null
    }),
    actions: {
        async login(email, password) {
            // Mock API call
            return new Promise((resolve) => {
                setTimeout(() => {
                    const fakeToken = 'mock-jwt-token-12345';
                    const fakeRole = 'distributor';
                    this.token = fakeToken;
                    this.role = fakeRole;
                    localStorage.setItem('token', fakeToken);
                    localStorage.setItem('role', fakeRole);
                    resolve({ success: true });
                }, 500);
            });
        },
        logout() {
            this.token = null;
            this.role = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('role');
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token
    }
});
