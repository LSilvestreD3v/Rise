// RISE MVP - JavaScript Principal
class RiseApp {
    constructor() {
        this.currentUser = null;
        this.missions = [];
        this.stats = {
            completedMissions: 0,
            currentStreak: 0,
            totalPoints: 0
        };
        this.init();
    }

    init() {
        this.loadUserData();
        this.updateCurrentDate();
        this.loadDailyImpulse();
        this.loadMissions();
        this.updateStats();
        
        // Auto-save a cada 30 segundos
        setInterval(() => this.saveUserData(), 30000);
    }

    // === AUTENTICAÇÃO ===
    login() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showNotification('Preencha todos os campos', 'error');
            return;
        }

        // Simular login (em produção seria uma chamada à API)
        const userData = this.getUserFromStorage(email);
        
        if (userData && userData.password === password) {
            this.currentUser = userData;
            this.showNotification('Login realizado com sucesso!', 'success');
            
            if (userData.thirdVoice) {
                this.showDashboard();
            } else {
                this.showThirdVoiceCreation();
            }
        } else {
            this.showNotification('Email ou senha incorretos', 'error');
        }
    }

    signup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        if (!name || !email || !password) {
            this.showNotification('Preencha todos os campos', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }

        // Verificar se usuário já existe
        if (this.getUserFromStorage(email)) {
            this.showNotification('Email já cadastrado', 'error');
            return;
        }

        // Criar novo usuário
        const newUser = {
            name,
            email,
            password,
            createdAt: new Date().toISOString(),
            thirdVoice: null,
            missions: [],
            stats: { completedMissions: 0, currentStreak: 0, totalPoints: 0 }
        };

        this.saveUserToStorage(newUser);
        this.currentUser = newUser;
        this.showNotification('Conta criada com sucesso!', 'success');
        this.showThirdVoiceCreation();
    }

    createThirdVoice() {
        const personaName = document.getElementById('personaName').value;
        const dreams = document.getElementById('dreams').value;
        const powerPhrase = document.getElementById('powerPhrase').value;

        if (!personaName || !dreams || !powerPhrase) {
            this.showNotification('Preencha todos os campos', 'error');
            return;
        }

        const thirdVoice = {
            personaName,
            dreams,
            powerPhrase,
            createdAt: new Date().toISOString()
        };

        this.currentUser.thirdVoice = thirdVoice;
        this.saveUserData();
        
        this.showNotification(`${personaName} foi criado! Sua terceira voz está ativa.`, 'success');
        this.showDashboard();
    }

    // === NAVEGAÇÃO ===
    showScreen(screenId) {
        // Esconder todas as telas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostrar tela específica
        document.getElementById(screenId).classList.add('active');
    }

    showLogin() {
        this.showScreen('loginScreen');
    }

    showSignup() {
        this.showScreen('signupScreen');
    }

    showThirdVoiceCreation() {
        this.showScreen('thirdVoiceScreen');
    }

    showDashboard() {
        this.showScreen('dashboardScreen');
        this.updateDashboard();
        this.updateBottomNav('dashboard');
    }

    showMissions() {
        this.showDashboard(); // Por enquanto redireciona para dashboard
        this.updateBottomNav('missions');
    }

    showCommunity() {
        this.showNotification('Comunidade em desenvolvimento', 'info');
        this.updateBottomNav('community');
    }

    showProfile() {
        this.showNotification('Perfil em desenvolvimento', 'info');
        this.updateBottomNav('profile');
    }

    updateBottomNav(activeTab) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Adicionar classe active baseado no tab (implementar quando necessário)
    }

    // === DASHBOARD ===
    updateDashboard() {
        if (!this.currentUser || !this.currentUser.thirdVoice) return;

        // Atualizar saudação
        const greeting = this.getGreeting();
        const personaName = this.currentUser.thirdVoice.personaName;
        document.getElementById('userGreeting').innerHTML = `${greeting}, <span id="personaNameDisplay">${personaName}</span>`;
        
        // Atualizar iniciais do avatar
        const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        document.getElementById('userInitials').textContent = initials;
        
        // Carregar missões
        this.loadMissions();
        this.updateStats();
    }

    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    }

    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateStr = now.toLocaleDateString('pt-BR', options);
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            dateElement.textContent = dateStr;
        }
    }

    // === IMPULSO DO DIA ===
    loadDailyImpulse() {
        const impulses = [
            {
                quote: "A disciplina é liberdade. Quanto mais disciplinado você for, mais livre será.",
                author: "David Goggins"
            },
            {
                quote: "Você tem poder sobre sua mente - não sobre eventos externos. Perceba isso, e você encontrará força.",
                author: "Marco Aurélio"
            },
            {
                quote: "O caminho do guerreiro é a morte. Quando se está sempre preparado para morrer, se tem uma vida plena.",
                author: "Miyamoto Musashi"
            },
            {
                quote: "Não são os nossos objetivos que moldam nossa vida, mas sim nossos sistemas.",
                author: "James Clear"
            },
            {
                quote: "A maior vitória é aquela sobre si mesmo.",
                author: "Platão"
            }
        ];

        const today = new Date().getDate();
        const todayImpulse = impulses[today % impulses.length];
        
        document.getElementById('dailyImpulse').textContent = `"${todayImpulse.quote}"`;
        document.querySelector('.impulse-author').textContent = `- ${todayImpulse.author}`;
    }

    acceptChallenge() {
        if (!this.currentUser) return;
        
        const challenges = [
            "Complete uma tarefa que você tem adiado há mais de uma semana",
            "Faça 50 flexões agora mesmo, sem desculpas",
            "Leia 20 páginas de um livro de desenvolvimento pessoal",
            "Medite por 10 minutos em silêncio total",
            "Organize completamente um espaço da sua casa",
            "Faça uma ligação importante que você tem evitado"
        ];

        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        
        // Criar missão automática
        const challengeMission = {
            id: Date.now(),
            title: `DESAFIO: ${randomChallenge}`,
            category: 'challenge',
            difficulty: 3,
            completed: false,
            createdAt: new Date().toISOString(),
            isChallenge: true
        };

        this.missions.unshift(challengeMission);
        this.saveUserData();
        this.loadMissions();
        
        this.showNotification('Desafio aceito! Nova missão criada.', 'success');
    }

    // === MISSÕES ===
    loadMissions() {
        if (!this.currentUser) return;

        this.missions = this.currentUser.missions || [];
        
        // Se não há missões, criar algumas padrão
        if (this.missions.length === 0) {
            this.createDefaultMissions();
        }

        this.renderMissions();
    }

    createDefaultMissions() {
        const defaultMissions = [
            {
                id: Date.now() + 1,
                title: "Exercitar-se por 30 minutos",
                category: "physical",
                difficulty: 2,
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                title: "Ler 15 páginas de um livro",
                category: "mental",
                difficulty: 1,
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 3,
                title: "Organizar área de trabalho",
                category: "professional",
                difficulty: 1,
                completed: false,
                createdAt: new Date().toISOString()
            }
        ];

        this.missions = defaultMissions;
        this.currentUser.missions = this.missions;
        this.saveUserData();
    }

    renderMissions() {
        const missionsList = document.getElementById('missionsList');
        if (!missionsList) return;

        missionsList.innerHTML = '';

        this.missions.forEach(mission => {
            const missionElement = this.createMissionElement(mission);
            missionsList.appendChild(missionElement);
        });
    }

    createMissionElement(mission) {
        const missionDiv = document.createElement('div');
        missionDiv.className = `mission-item ${mission.completed ? 'completed' : ''}`;
        
        const categoryEmojis = {
            physical: '💪',
            mental: '🧠',
            professional: '💼',
            spiritual: '🙏',
            challenge: '🔥'
        };

        const difficultyStars = '★'.repeat(mission.difficulty);

        missionDiv.innerHTML = `
            <div class="mission-content">
                <div class="mission-title">${mission.title}</div>
                <div class="mission-category">
                    ${categoryEmojis[mission.category] || '📋'} 
                    ${mission.category.toUpperCase()} 
                    ${difficultyStars}
                </div>
            </div>
            <div class="mission-checkbox ${mission.completed ? 'checked' : ''}" 
                 onclick="app.toggleMission(${mission.id})">
                ${mission.completed ? '✓' : ''}
            </div>
        `;

        return missionDiv;
    }

    toggleMission(missionId) {
        const mission = this.missions.find(m => m.id === missionId);
        if (!mission) return;

        mission.completed = !mission.completed;
        
        if (mission.completed) {
            mission.completedAt = new Date().toISOString();
            this.stats.completedMissions++;
            this.stats.totalPoints += mission.difficulty * 10;
            
            const messages = [
                `${this.currentUser.thirdVoice.personaName}, mais uma vitória! Continue assim!`,
                "Excelente! Você está provando que pode fazer diferente.",
                "Sua disciplina está crescendo. Marco Aurélio ficaria orgulhoso.",
                "Cada missão completa é um passo para sua transformação.",
                "Você está deixando a carcaça para trás!"
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            this.showNotification(randomMessage, 'success');
        } else {
            this.stats.completedMissions = Math.max(0, this.stats.completedMissions - 1);
            this.stats.totalPoints = Math.max(0, this.stats.totalPoints - (mission.difficulty * 10));
        }

        this.saveUserData();
        this.renderMissions();
        this.updateStats();
    }

    addMission() {
        this.showMissionModal();
    }

    showMissionModal() {
        document.getElementById('missionModal').classList.add('active');
    }

    closeMissionModal() {
        document.getElementById('missionModal').classList.remove('active');
        // Limpar campos
        document.getElementById('missionTitle').value = '';
        document.getElementById('missionCategory').value = 'physical';
        document.getElementById('missionDifficulty').value = '1';
    }

    saveMission() {
        const title = document.getElementById('missionTitle').value;
        const category = document.getElementById('missionCategory').value;
        const difficulty = parseInt(document.getElementById('missionDifficulty').value);

        if (!title.trim()) {
            this.showNotification('Digite um título para a missão', 'error');
            return;
        }

        const newMission = {
            id: Date.now(),
            title: title.trim(),
            category,
            difficulty,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.missions.unshift(newMission);
        this.saveUserData();
        this.renderMissions();
        this.closeMissionModal();
        
        this.showNotification('Nova missão criada!', 'success');
    }

    // === ESTATÍSTICAS ===
    updateStats() {
        document.getElementById('completedMissions').textContent = this.stats.completedMissions;
        document.getElementById('currentStreak').textContent = this.stats.currentStreak;
        document.getElementById('totalPoints').textContent = this.stats.totalPoints;
    }

    // === MODO CAOS ===
    activateChaosMode() {
        this.showScreen('chaosScreen');
        this.showNotification('Modo Caos ativado. Respire fundo.', 'info');
    }

    exitChaosMode() {
        this.showDashboard();
        this.showNotification('Você superou a crise. Continue forte!', 'success');
    }

    startBreathing() {
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const instructions = document.getElementById('breathingInstructions');
        
        let phase = 0; // 0: inspire, 1: segure, 2: expire, 3: segure
        const phases = [
            { text: 'INSPIRE', instruction: 'Inspire por 4 segundos', duration: 4000, class: 'inhale' },
            { text: 'SEGURE', instruction: 'Segure por 7 segundos', duration: 7000, class: 'hold' },
            { text: 'EXPIRE', instruction: 'Expire por 8 segundos', duration: 8000, class: 'exhale' },
            { text: 'SEGURE', instruction: 'Segure por 2 segundos', duration: 2000, class: 'hold' }
        ];

        const runBreathingCycle = () => {
            const currentPhase = phases[phase];
            
            text.textContent = currentPhase.text;
            instructions.textContent = currentPhase.instruction;
            
            // Remover classes anteriores
            circle.classList.remove('inhale', 'exhale', 'hold');
            circle.classList.add(currentPhase.class);
            
            setTimeout(() => {
                phase = (phase + 1) % phases.length;
                runBreathingCycle();
            }, currentPhase.duration);
        };

        runBreathingCycle();
        this.showNotification('Exercício de respiração iniciado', 'info');
    }

    // === ARMAZENAMENTO ===
    saveUserData() {
        if (!this.currentUser) return;
        
        this.currentUser.missions = this.missions;
        this.currentUser.stats = this.stats;
        this.currentUser.lastLogin = new Date().toISOString();
        
        localStorage.setItem(`rise_user_${this.currentUser.email}`, JSON.stringify(this.currentUser));
    }

    loadUserData() {
        // Tentar carregar último usuário logado
        const lastUser = localStorage.getItem('rise_last_user');
        if (lastUser) {
            const userData = this.getUserFromStorage(lastUser);
            if (userData) {
                this.currentUser = userData;
                this.missions = userData.missions || [];
                this.stats = userData.stats || { completedMissions: 0, currentStreak: 0, totalPoints: 0 };
                
                if (userData.thirdVoice) {
                    this.showDashboard();
                } else {
                    this.showThirdVoiceCreation();
                }
                return;
            }
        }
        
        // Se não há usuário logado, mostrar login
        this.showLogin();
    }

    getUserFromStorage(email) {
        const userData = localStorage.getItem(`rise_user_${email}`);
        return userData ? JSON.parse(userData) : null;
    }

    saveUserToStorage(user) {
        localStorage.setItem(`rise_user_${user.email}`, JSON.stringify(user));
        localStorage.setItem('rise_last_user', user.email);
    }

    // === NOTIFICAÇÕES ===
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#A0392A' : type === 'error' ? '#DC143C' : '#2d1810'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            font-weight: 500;
            border: 2px solid ${type === 'success' ? '#ff6b35' : type === 'error' ? '#ff4444' : '#A0392A'};
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remover após 4 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// === FUNÇÕES GLOBAIS ===
function login() {
    app.login();
}

function signup() {
    app.signup();
}

function showLogin() {
    app.showLogin();
}

function showSignup() {
    app.showSignup();
}

function createThirdVoice() {
    app.createThirdVoice();
}

function showDashboard() {
    app.showDashboard();
}

function showMissions() {
    app.showMissions();
}

function showCommunity() {
    app.showCommunity();
}

function showProfile() {
    app.showProfile();
}

function acceptChallenge() {
    app.acceptChallenge();
}

function addMission() {
    app.addMission();
}

function closeMissionModal() {
    app.closeMissionModal();
}

function saveMission() {
    app.saveMission();
}

function activateChaosMode() {
    app.activateChaosMode();
}

function exitChaosMode() {
    app.exitChaosMode();
}

function startBreathing() {
    app.startBreathing();
}

// === INICIALIZAÇÃO ===
let app;

document.addEventListener('DOMContentLoaded', function() {
    // Adicionar estilos de animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Inicializar aplicação
    app = new RiseApp();
    
    // Adicionar event listeners para Enter nos campos de input
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const activeScreen = document.querySelector('.screen.active');
            if (activeScreen) {
                if (activeScreen.id === 'loginScreen') {
                    login();
                } else if (activeScreen.id === 'signupScreen') {
                    signup();
                } else if (activeScreen.id === 'thirdVoiceScreen') {
                    createThirdVoice();
                }
            }
        }
    });
    
    // Fechar modal clicando fora
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeMissionModal();
        }
    });
});

// === EASTER EGGS E FUNCIONALIDADES ESPECIAIS ===
document.addEventListener('keydown', function(e) {
    // Konami Code para ativar modo desenvolvedor
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    if (!window.konamiProgress) window.konamiProgress = 0;
    
    if (e.keyCode === konamiCode[window.konamiProgress]) {
        window.konamiProgress++;
        if (window.konamiProgress === konamiCode.length) {
            app.showNotification('Modo Desenvolvedor Ativado! 🔥', 'success');
            console.log('RISE MVP - Desenvolvido com disciplina estoica');
            window.konamiProgress = 0;
        }
    } else {
        window.konamiProgress = 0;
    }
});

