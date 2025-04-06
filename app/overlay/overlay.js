const { ipcRenderer, screen } = require('electron');

// Éléments DOM
const overlayContainer = document.querySelector('.overlay-container');
const gameName = document.querySelector('.game-name');
const achievementsList = document.querySelector('.achievements-list');
const controlButton = document.querySelector('.control-button');

let isOverlayVisible = false;

// Fonction pour détecter si la souris est proche du bord
function isMouseNearEdge(x) {
    return x >= window.screen.width - 10;
}

// Détection de la position de la souris globale
document.addEventListener('mousemove', (e) => {
    console.log('Mouse position:', e.screenX, 'Screen width:', window.screen.width);
    
    if (isMouseNearEdge(e.screenX)) {
        console.log('Mouse near edge, showing overlay');
        if (!isOverlayVisible) {
            isOverlayVisible = true;
            overlayContainer.classList.add('visible');
        }
    } else if (e.screenX < window.screen.width - 350) {
        console.log('Mouse far from edge, hiding overlay');
        if (isOverlayVisible) {
            isOverlayVisible = false;
            overlayContainer.classList.remove('visible');
        }
    }
});

let gameData = {
    name: 'League of Legends',
    playTime: 9030, // en minutes
    isDetected: true,
    achievements: {
        official: [],
        community: [
            {
                name: 'Pentakill Master',
                description: 'Réaliser 10 Pentakills en partie classée',
                progress: 30,
                icon: 'game-icons:pentacle',
                type: 'community'
            },
            {
                name: 'Diamant ou rien',
                description: 'Atteindre le rang Diamant',
                progress: 65,
                icon: 'game-icons:rank-3',
                type: 'community',
                rare: true
            },
            {
                name: 'Farm Parfait',
                description: 'Obtenir 100 CS en moins de 12 minutes',
                progress: 85,
                icon: 'game-icons:minions',
                type: 'community'
            }
        ]
    },
    stats: {
        achievementsUnlocked: '15/30',
        totalProgress: '50%'
    }
};

function formatPlayTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

function updateGameStatus(isDetected) {
    const statusElement = document.querySelector('.game-status');
    if (isDetected) {
        statusElement.classList.remove('not-detected');
        statusElement.innerHTML = `
            <iconify-icon icon="mdi:gamepad-variant"></iconify-icon>
            Jeu détecté
        `;
    } else {
        statusElement.classList.add('not-detected');
        statusElement.innerHTML = `
            <iconify-icon icon="mdi:gamepad-variant-off"></iconify-icon>
            Jeu non détecté
        `;
    }
}

// Gestion des onglets
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    let currentFilter = 'all';

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.textContent.toLowerCase();
            currentFilter = filter === 'tous' ? 'all' : filter === 'officiels' ? 'official' : 'community';
            updateAchievements(currentFilter);
        });
    });
});

function updateAchievements(filter = 'all') {
    const achievementsList = document.querySelector('.achievements-content');
    let achievements = [];

    if (filter === 'all') {
        achievements = [...(gameData.achievements.official || []), ...gameData.achievements.community];
    } else if (filter === 'official') {
        achievements = gameData.achievements.official || [];
    } else {
        achievements = gameData.achievements.community || [];
    }

    const achievementsHTML = achievements.map(achievement => `
        <div class="achievement ${achievement.type} ${achievement.rare ? 'rare' : ''}">
            <div class="achievement-type">${achievement.type === 'community' ? 'Communautaire' : 'Officiel'}</div>
            <div class="achievement-header">
                <iconify-icon class="achievement-icon" icon="${achievement.icon}"></iconify-icon>
                <div class="achievement-name">${achievement.name}</div>
            </div>
            <div class="achievement-desc">${achievement.description}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${achievement.progress}%"></div>
            </div>
        </div>
    `).join('');

    achievementsList.innerHTML = `
        <div class="section-header">
            <iconify-icon icon="mdi:trophy-variant"></iconify-icon>
            Succès en cours
        </div>
        ${achievementsHTML}
    `;
}

function updateOverlay(data) {
    if (!data) return;

    // Mise à jour du nom du jeu et du temps de jeu
    if (data.name) {
        document.querySelector('.game-name').textContent = data.name;
    }
    if (data.playTime !== undefined) {
        document.querySelector('.game-time').textContent = `Temps de jeu : ${formatPlayTime(data.playTime)}`;
    }

    // Mise à jour du statut de détection
    if (data.isDetected !== undefined) {
        updateGameStatus(data.isDetected);
    }

    // Mise à jour des succès
    if (data.achievements) {
        updateAchievements('all');
    }

    // Mise à jour des statistiques
    if (data.stats) {
        const statsContainer = document.querySelector('.stats-grid');
        statsContainer.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${data.stats.achievementsUnlocked}</div>
                <div class="stat-label">Succès Communautaires</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${data.stats.totalProgress}</div>
                <div class="stat-label">Progression Totale</div>
            </div>
        `;
    }
}

// Écouter les mises à jour du jeu
window.electronAPI.onGameUpdated((event, data) => {
    gameData = { ...gameData, ...data };
    updateOverlay(gameData);
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateOverlay(gameData);
});

// Désactivation du drag and drop
overlayContainer.style.cursor = 'default'; 