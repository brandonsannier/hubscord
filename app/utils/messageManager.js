class MessageManager {
    constructor() {
        this.messageContainer = this.createMessageContainer();
    }

    createMessageContainer() {
        const container = document.createElement('div');
        container.className = 'message-container';
        document.body.appendChild(container);
        return container;
    }

    show(type, message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}-message`;
        messageElement.textContent = message;
        
        // Supprimer les messages existants du même type
        const existingMessages = this.messageContainer.querySelectorAll(`.${type}-message`);
        existingMessages.forEach(msg => msg.remove());
        
        this.messageContainer.appendChild(messageElement);
        
        // Animation d'entrée
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        
        // Suppression après 5 secondes
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => messageElement.remove(), 300);
        }, 5000);
    }

    error(message) {
        console.error('Error:', message);
        this.show('error', message);
    }

    success(message) {
        console.log('Success:', message);
        this.show('success', message);
    }
}

module.exports = {
    messageManager: new MessageManager()
}; 