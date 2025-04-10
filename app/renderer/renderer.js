// Configuration du client Supabase
const supabaseUrl = 'https://htxebvruzoabicaxhzak.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0eGVidnJ1em9hYmljYXhoemFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzY5ODgsImV4cCI6MjA1OTQ1Mjk4OH0.HEMM7Y1NUOdDyBTgdpNh8YrBDXSF9-rzAn71UfdudPM';

// Créer le client Supabase
let supabaseClient;

// Éléments DOM
const shortcutInput = document.getElementById('shortcut-input');
const currentShortcut = document.getElementById('current-shortcut');
const userProfileElement = document.querySelector('.user-profile .username');

// Éléments de l'overlay
const overlayControl = document.querySelector('.overlay-control');
const toggleOverlayBtn = document.querySelector('.toggle-overlay');
const editShortcutBtn = document.querySelector('.edit-shortcut');
const shortcutText = document.querySelector('.shortcut-text');

let isOverlayVisible = false;

// Charger le client Supabase de manière dynamique
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Charger le script Supabase
        await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/dist/umd/supabase.min.js');
        
        // Initialiser le client Supabase
        supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
        
        // Vérifier l'authentification
        checkAuth();
        
        // Initialiser les autres fonctionnalités
        initOverlay();
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

// Vérification de l'authentification
async function checkAuth() {
    const session = await supabaseClient.auth.getSession();
    const isAuthenticated = session && session.data.session !== null;
    
    if (!isAuthenticated) {
        // Rediriger vers la page d'authentification
        window.location.href = 'auth.html';
        return false;
    }
    
    // Charger les informations de l'utilisateur
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
        window.location.href = 'auth.html';
        return false;
    }
    
    // Récupérer le profil de l'utilisateur
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
    
    // Mettre à jour l'interface avec les informations de l'utilisateur
    if (data && userProfileElement) {
        userProfileElement.textContent = data.username || 'Utilisateur';
    }
    
    return true;
}

// Initialiser les fonctionnalités d'overlay
function initOverlay() {
    // Gestion de la configuration du raccourci
    if (shortcutInput) {
        shortcutInput.addEventListener('focus', () => {
            shortcutInput.value = 'Appuyez sur une touche...';
        });

        shortcutInput.addEventListener('keydown', (event) => {
            event.preventDefault();
            
            // Créer la combinaison de touches au format Electron
            let shortcut = [];
            
            // Ajouter les modificateurs dans l'ordre correct
            if (event.ctrlKey) shortcut.push('CommandOrControl');
            if (event.altKey) shortcut.push('Alt');
            if (event.shiftKey) shortcut.push('Shift');
            
            // Gérer les touches spéciales
            const specialKeys = {
                'ArrowUp': 'Up',
                'ArrowDown': 'Down',
                'ArrowLeft': 'Left',
                'ArrowRight': 'Right',
                'AudioVolumeMute': 'Mute',
                'AudioVolumeDown': 'VolumeDown',
                'AudioVolumeUp': 'VolumeUp',
                ' ': 'Space'
            };
            
            // Obtenir la touche en format ASCII
            let key = event.code;
            
            // Convertir les codes de touches en format Electron
            const keyMappings = {
                'Digit1': '1',
                'Digit2': '2',
                'Digit3': '3',
                'Digit4': '4',
                'Digit5': '5',
                'Digit6': '6',
                'Digit7': '7',
                'Digit8': '8',
                'Digit9': '9',
                'Digit0': '0',
                'KeyA': 'A',
                'KeyB': 'B',
                'KeyC': 'C',
                'KeyD': 'D',
                'KeyE': 'E',
                'KeyF': 'F',
                'KeyG': 'G',
                'KeyH': 'H',
                'KeyI': 'I',
                'KeyJ': 'J',
                'KeyK': 'K',
                'KeyL': 'L',
                'KeyM': 'M',
                'KeyN': 'N',
                'KeyO': 'O',
                'KeyP': 'P',
                'KeyQ': 'Q',
                'KeyR': 'R',
                'KeyS': 'S',
                'KeyT': 'T',
                'KeyU': 'U',
                'KeyV': 'V',
                'KeyW': 'W',
                'KeyX': 'X',
                'KeyY': 'Y',
                'KeyZ': 'Z'
            };

            if (keyMappings[key]) {
                key = keyMappings[key];
            }
            
            // Ne pas ajouter les touches modificatrices seules
            if (!['Alt', 'Control', 'Shift', 'Meta', 'Dead'].includes(event.key)) {
                shortcut.push(key);
            }
            
            // Créer la chaîne de raccourci au format Electron
            const shortcutString = shortcut.join('+');
            
            // Afficher et envoyer uniquement si nous avons une combinaison valide
            if (shortcut.length > 1 && /^[A-Z0-9+]+$/.test(shortcutString.replace('Alt', 'A').replace('CommandOrControl', 'C').replace('Shift', 'S'))) {
                shortcutInput.value = shortcutString;
                window.electronAPI.updateShortcut(shortcutString);
                if (currentShortcut) {
                    currentShortcut.textContent = shortcutString;
                }
            }
        });

        shortcutInput.addEventListener('blur', () => {
            shortcutInput.value = '';
        });
    }

    // Exemple de données de jeu
    const sampleGameData = {
        name: "The Witcher 3",
        achievements: [
            { name: "Maître des cartes", progress: "0%" },
            { name: "Chasseur de monstres", progress: "50%" },
            { name: "Collectionneur", progress: "25%" }
        ]
    };

    // Mise à jour de l'overlay
    function updateOverlay(gameData) {
        window.electronAPI.updateGame(gameData);
    }

    // Simulation de détection de jeu
    setInterval(() => {
        if (isOverlayVisible) {
            updateOverlay(sampleGameData);
        }
    }, 5000);

    // Gestion du basculement de l'overlay
    toggleOverlayBtn.addEventListener('click', () => {
        isOverlayVisible = !isOverlayVisible;
        toggleOverlayBtn.classList.toggle('active', isOverlayVisible);
        window.electronAPI.toggleOverlay();
    });

    // Gestion du clic sur l'overlay-control (pour la compatibilité)
    overlayControl.addEventListener('click', (e) => {
        // Si le clic n'est pas sur un bouton spécifique, basculer l'overlay
        if (!e.target.closest('.toggle-overlay') && !e.target.closest('.edit-shortcut')) {
            isOverlayVisible = !isOverlayVisible;
            toggleOverlayBtn.classList.toggle('active', isOverlayVisible);
            window.electronAPI.toggleOverlay();
        }
    });

    // Préparation de la modification du raccourci
    editShortcutBtn.addEventListener('click', () => {
        shortcutText.textContent = 'Appuyez sur une touche...';
        window.addEventListener('keydown', handleShortcutChange, { once: true });
    });
}

// Event listeners pour les boutons de la fenêtre
document.getElementById('minimizeBtn')?.addEventListener('click', () => {
    window.electronAPI.minimizeWindow();
});

document.getElementById('maximizeBtn')?.addEventListener('click', () => {
    window.electronAPI.maximizeWindow();
});

document.getElementById('closeBtn')?.addEventListener('click', () => {
    window.electronAPI.closeWindow();
});

// Écouteurs d'événements de l'overlay
window.electronAPI.onGameUpdated((event, gameData) => {
    // Mettre à jour l'interface avec les nouvelles données
    console.log('Données de jeu mises à jour:', gameData);
});

function handleShortcutChange(e) {
    e.preventDefault();
    
    const modifiers = [];
    if (e.ctrlKey) modifiers.push('Ctrl');
    if (e.altKey) modifiers.push('Alt');
    if (e.shiftKey) modifiers.push('Shift');
    
    const key = e.key.toUpperCase();
    const shortcut = [...modifiers, key].join(' + ');
    
    shortcutText.textContent = shortcut;
    window.electronAPI.updateShortcut(shortcut);
}

// Écouter les changements d'état de l'overlay
window.electronAPI.onOverlayToggled((event, isVisible) => {
    isOverlayVisible = isVisible;
    toggleOverlayBtn.classList.toggle('active', isVisible);
});

// Gérer la déconnexion
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.logout-button');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                if (supabaseClient) {
                    await supabaseClient.auth.signOut();
                }
                localStorage.removeItem('user');
                localStorage.removeItem('session');
                // Rediriger vers la page d'authentification
                window.location.href = 'auth.html';
            } catch (error) {
                console.error('Erreur de déconnexion:', error);
            }
        });
    }
}); 