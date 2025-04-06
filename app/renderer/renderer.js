// Éléments DOM
const shortcutInput = document.getElementById('shortcut-input');
const currentShortcut = document.getElementById('current-shortcut');

// Éléments de l'overlay
const overlayControl = document.querySelector('.overlay-control');
const toggleOverlayBtn = document.querySelector('.toggle-overlay');
const editShortcutBtn = document.querySelector('.edit-shortcut');
const shortcutText = document.querySelector('.shortcut-text');

let isOverlayVisible = false;

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