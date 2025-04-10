// Configuration du client Supabase
const supabaseUrl = 'https://htxebvruzoabicaxhzak.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0eGVidnJ1em9hYmljYXhoemFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzY5ODgsImV4cCI6MjA1OTQ1Mjk4OH0.HEMM7Y1NUOdDyBTgdpNh8YrBDXSF9-rzAn71UfdudPM';

// Créer le client Supabase
let supabaseClient;

// Charger le client Supabase de manière dynamique
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Charger le script Supabase
        await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/dist/umd/supabase.min.js');
        
        // Initialiser le client Supabase
        supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
        
        // Initialiser l'interface
        initUI();
    } catch (error) {
        console.error('Erreur lors du chargement de Supabase:', error);
    }
});

// Fonction pour charger un script externe
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Initialiser l'interface utilisateur
function initUI() {
    // Éléments DOM
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const passwordToggles = document.querySelectorAll('.password-toggle');

    // Contrôles de fenêtre Electron
    document.getElementById('minimizeBtn')?.addEventListener('click', () => {
        window.electronAPI.minimizeWindow();
    });

    document.getElementById('maximizeBtn')?.addEventListener('click', () => {
        window.electronAPI.maximizeWindow();
    });

    document.getElementById('closeBtn')?.addEventListener('click', () => {
        window.electronAPI.closeWindow();
    });

    // Gestion des onglets d'authentification
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Supprimer la classe active de tous les onglets
            authTabs.forEach(t => t.classList.remove('active'));
            // Ajouter la classe active à l'onglet cliqué
            tab.classList.add('active');
            
            // Masquer tous les formulaires
            authForms.forEach(form => form.classList.remove('active'));
            // Afficher le formulaire correspondant à l'onglet
            const tabName = tab.dataset.tab;
            document.getElementById(`${tabName}-form`).classList.add('active');
        });
    });

    // Gestion des toggles de mot de passe
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const passwordField = toggle.parentElement.querySelector('input');
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                toggle.innerHTML = '<iconify-icon icon="mdi:eye-off"></iconify-icon>';
            } else {
                passwordField.type = 'password';
                toggle.innerHTML = '<iconify-icon icon="mdi:eye"></iconify-icon>';
            }
        });
    });

    // Vérification de la force du mot de passe
    const passwordInput = document.getElementById('register-password');
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');

    if (passwordInput) {
        passwordInput.addEventListener('input', evaluatePasswordStrength);
    }

    function evaluatePasswordStrength() {
        const password = passwordInput.value;
        const segments = document.querySelectorAll('.strength-segment');
        
        // Réinitialiser les segments
        segments.forEach(segment => {
            segment.className = 'strength-segment';
        });
        
        // Vérifier la force du mot de passe
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        // Mettre à jour l'UI en fonction de la force
        for (let i = 0; i < strength; i++) {
            if (segments[i]) {
                if (strength === 1) {
                    segments[i].classList.add('weak');
                } else if (strength === 2 || strength === 3) {
                    segments[i].classList.add('medium');
                } else if (strength === 4) {
                    segments[i].classList.add('strong');
                }
            }
        }
        
        // Mettre à jour le texte de force
        if (password.length === 0) {
            strengthText.textContent = 'Force du mot de passe';
        } else if (strength === 1) {
            strengthText.textContent = 'Faible';
        } else if (strength === 2) {
            strengthText.textContent = 'Moyen';
        } else if (strength === 3) {
            strengthText.textContent = 'Bon';
        } else if (strength === 4) {
            strengthText.textContent = 'Excellent';
        }
    }

    // Gestion du formulaire de connexion
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        try {
            // Connexion avec Supabase
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            // Si la connexion réussit
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Stocker la session de manière plus persistante si "Se souvenir de moi" est coché
            if (rememberMe) {
                localStorage.setItem('session', JSON.stringify(data.session));
            }
            
            // Rediriger vers la page principale
            window.location.href = 'index.html';
        } catch (error) {
            showError(loginForm, error.message || 'Erreur de connexion');
        }
    });

    // Gestion du formulaire d'inscription
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        
        // Vérification des mots de passe
        if (password !== confirmPassword) {
            showError(registerForm, 'Les mots de passe ne correspondent pas');
            return;
        }
        
        try {
            // Inscription avec Supabase
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username
                    }
                }
            });
            
            if (error) throw error;
            
            // Si l'inscription réussit, ajouter l'utilisateur à la table des profils
            const { error: profileError } = await supabaseClient
                .from('profiles')
                .insert([
                    { 
                        id: data.user.id,
                        username: username,
                        email: email
                    }
                ]);
            
            if (profileError) throw profileError;
            
            // Afficher un message de succès et rediriger vers la connexion
            showSuccess(registerForm, "Inscription réussie ! Vérifiez votre email pour confirmer votre compte.");
            setTimeout(() => {
                document.querySelector('[data-tab="login"]').click();
            }, 3000);
        } catch (error) {
            showError(registerForm, error.message || 'Erreur d\'inscription');
        }
    });

    // Gestion de l'authentification sociale
    document.getElementById('google-auth').addEventListener('click', async () => {
        try {
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google'
            });
            
            if (error) throw error;
        } catch (error) {
            showError(loginForm, error.message || 'Erreur d\'authentification Google');
        }
    });

    document.getElementById('discord-auth').addEventListener('click', async () => {
        try {
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'discord'
            });
            
            if (error) throw error;
        } catch (error) {
            showError(loginForm, error.message || 'Erreur d\'authentification Discord');
        }
    });

    // Fonctions utilitaires
    function showError(form, message) {
        // Supprimer les messages d'erreur existants
        const existingError = form.querySelector('.form-feedback');
        if (existingError) existingError.remove();
        
        // Créer et afficher le message d'erreur
        const errorElement = document.createElement('div');
        errorElement.className = 'form-feedback invalid-feedback';
        errorElement.textContent = message;
        
        // Ajouter à la fin du formulaire
        form.appendChild(errorElement);
    }

    function showSuccess(form, message) {
        // Supprimer les messages existants
        const existingFeedback = form.querySelector('.form-feedback');
        if (existingFeedback) existingFeedback.remove();
        
        // Créer et afficher le message de succès
        const successElement = document.createElement('div');
        successElement.className = 'form-feedback valid-feedback';
        successElement.textContent = message;
        
        // Ajouter à la fin du formulaire
        form.appendChild(successElement);
    }
} 