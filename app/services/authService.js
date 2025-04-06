const { config } = require('../config/config');

class AuthService {
    constructor() {
        this.validateConfig();
    }

    validateConfig() {
        if (!config.supabase.url || !config.supabase.key) {
            throw new Error('Configuration Supabase manquante');
        }
    }

    async request(endpoint, options) {
        try {
            const response = await fetch(`${config.supabase.url}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': config.supabase.key,
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Erreur de requête');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Request error:', error);
            throw this.handleError(error);
        }
    }

    handleError(error) {
        // Gestion personnalisée des erreurs
        if (error.message.includes('Invalid login credentials')) {
            return new Error('Identifiants invalides');
        }
        if (error.message.includes('Email not confirmed')) {
            return new Error('Email non confirmé');
        }
        return error;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        // Au moins 8 caractères, une majuscule, une minuscule, un chiffre
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    async login(email, password) {
        if (!this.validateEmail(email)) {
            throw new Error('Format d\'email invalide');
        }

        return this.request('/auth/v1/token?grant_type=password', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(email, password, username) {
        if (!this.validateEmail(email)) {
            throw new Error('Format d\'email invalide');
        }

        if (!this.validatePassword(password)) {
            throw new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre');
        }

        if (username.length < 3) {
            throw new Error('Le nom d\'utilisateur doit contenir au moins 3 caractères');
        }

        return this.request('/auth/v1/signup', {
            method: 'POST',
            body: JSON.stringify({ 
                email, 
                password, 
                user_metadata: { username } 
            })
        });
    }
}

module.exports = {
    authService: new AuthService()
}; 