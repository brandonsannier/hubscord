const supabase = require('./supabaseClient.js');

// Service d'authentification pour gérer les utilisateurs
const authService = {
    /**
     * Vérifier si un utilisateur est connecté
     * @returns {boolean} Vrai si l'utilisateur est connecté
     */
    isAuthenticated: async () => {
        const session = await supabase.auth.getSession();
        return session && session.data.session !== null;
    },

    /**
     * Récupérer l'utilisateur actuel
     * @returns {Object|null} L'utilisateur actuel ou null
     */
    getCurrentUser: async () => {
        const { data } = await supabase.auth.getUser();
        return data.user || null;
    },

    /**
     * Récupérer le profil complet de l'utilisateur
     * @returns {Object|null} Profil utilisateur avec données personnalisées
     */
    getUserProfile: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
        if (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            return null;
        }
        
        return data;
    },

    /**
     * Déconnecter l'utilisateur
     */
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Erreur lors de la déconnexion:', error);
            throw error;
        }
        localStorage.removeItem('user');
        localStorage.removeItem('session');
    },

    /**
     * S'abonner aux changements d'état d'authentification
     * @param {Function} callback Fonction appelée lorsque l'état d'authentification change
     */
    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    },

    /**
     * Rediriger vers la page d'authentification si non connecté
     * @param {string} redirectTo Page de redirection après connexion
     */
    redirectToAuth: (redirectTo = window.location.pathname) => {
        localStorage.setItem('redirect_after_login', redirectTo);
        window.location.href = 'auth.html';
    },

    /**
     * Récupérer et effectuer la redirection après connexion
     */
    handleRedirectAfterLogin: () => {
        const redirectPath = localStorage.getItem('redirect_after_login') || 'index.html';
        localStorage.removeItem('redirect_after_login');
        window.location.href = redirectPath;
    },

    /**
     * Mettre à jour le profil utilisateur
     * @param {Object} profileData Données du profil à mettre à jour
     */
    updateProfile: async (profileData) => {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('Utilisateur non connecté');

        const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', user.id);
            
        if (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            throw error;
        }
        
        return true;
    }
};

module.exports = authService; 