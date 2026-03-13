/**
 * IQ SIGNALS PRO - UI CONTROL v4
 */

document.addEventListener('DOMContentLoaded', () => {
    // Lógica 24h de Sessões Globais (Melhor e Pior Horário Dinâmico)
    const updateMarketHours = () => {
        const now = new Date();
        const hr = now.getHours();
        
        // MOTOR DE SESSÕES 24H - SEM LACUNAS
        const getBestHours = (hour) => {
            if (hour >= 4 && hour < 12) return "04:00 - 12:00"; // London + NY Early
            if (hour >= 21 || hour < 2) return "21:00 - 02:00"; // Asia + Sydney
            return "04:00 - 12:00"; // Próxima grande janela
        };

        const getWorstHours = (hour) => {
            if (hour >= 13 && hour < 17) return "13:00 - 17:00"; // Troca de turno NY
            if (hour >= 17 && hour < 21) return "17:00 - 21:00"; // Baixa liquidez
            return "13:00 - 17:00"; // Padrão
        };

        const getRiskHours = (hour) => {
            if (hour >= 9 && hour < 11) return "09:30 - 10:45"; // Abertura NY
            if (hour >= 13 && hour < 15) return "14:00 - 15:00"; // Notícias USA
            if (hour >= 3 && hour < 5) return "03:00 - 05:00"; // Abertura London
            return "Próxima Notícia";
        };

        const bestStr = getBestHours(hr);
        const worstStr = getWorstHours(hr);
        const riskStr = getRiskHours(hr);

        // Previsão Amanhã (Sincronizada com hoje + 24h)
        const nextDayBest = getBestHours((hr + 12) % 24);
        const nextDayWorst = getWorstHours((hr + 12) % 24);
        const nextDayRisk = getRiskHours((hr + 12) % 24);

        const bEl = document.getElementById('best-market-time');
        const wEl = document.getElementById('worst-market-time');
        const rEl = document.getElementById('risk-market-time');
        
        const nextB = document.getElementById('next-best-time');
        const nextW = document.getElementById('next-worst-time');
        const nextR = document.getElementById('next-risk-time');
        
        if (bEl) bEl.innerText = bestStr;
        if (wEl) wEl.innerText = worstStr;
        if (rEl) rEl.innerText = riskStr;

        if (nextB) nextB.innerText = nextDayBest;
        if (nextW) nextW.innerText = nextDayWorst;
        if (nextR) nextR.innerText = nextDayRisk;
    };

    // 1. Relógio Master (Alta Precisão Local vs Servidor/Corretora)
    const clockLocal = document.getElementById('live-clock');
    const clockBroker = document.getElementById('broker-clock');

    const updateTime = () => {
        try {
            const now = new Date();
            
            // Atualiza o relógio do Ponto de Entrada (Local)
            if (clockLocal) {
                clockLocal.innerText = now.toLocaleTimeString('pt-BR');
            }

            // Atualiza o relógio de Operação (Corretora)
            if (clockBroker) {
                clockBroker.innerText = now.toLocaleTimeString('pt-BR');
            }
            
            // Atualiza a matemática das horas globais a cada minuto
            if (now.getSeconds() === 0) {
                updateMarketHours();
            }
        } catch (e) {
            console.error("Erro ao atualizar relógio:", e);
        }
    };
    
    // Roda no boot
    try {
        updateMarketHours();
        setInterval(updateTime, 1000);
        updateTime();
    } catch (e) {
        console.error("Erro no boot do AppUI:", e);
    }

    // 2. Navegação Interativa
    const links = document.querySelectorAll('.nav-link');
    links.forEach(l => {
        l.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(x => x.classList.remove('active'));
            l.classList.add('active');
            
            // Som de clique opcional se desejar futuramente
            console.log("Navegando para: " + l.innerText);
        });
    });

    // 4. Sistema de Login ADM
    const loginOverlay = document.getElementById('login-overlay');
    const loginBtn = document.getElementById('btn-login');
    const userField = document.getElementById('login-user');
    const passField = document.getElementById('login-pass');
    const errorMsg = document.getElementById('login-error');

    // Função para aplicar as mudanças visuais de Administrador
    function setupAdminUI() {
        const role = document.getElementById('user-role');
        const status = document.getElementById('user-status');
        const admBtn = document.getElementById('nav-adm-panel');
        const overlay = document.getElementById('login-overlay');

        if (role) role.innerText = "Administrador";
        if (status) {
            status.innerText = "Sessão Root Ativa";
            status.style.color = "var(--accent)";
        }
        if (admBtn) admBtn.style.display = "block";
        if (overlay) overlay.style.display = "none";
        
        // Ativa o modo ADM no motor de sinais (com retry caso o motor ainda não tenha subido)
        const setAdminMode = () => {
            if (window.engine) {
                window.engine.isAdmin = true;
                console.log("Modo ADM vinculado ao Motor.");
            } else {
                setTimeout(setAdminMode, 100);
            }
        };
        setAdminMode();
    }

    // Verifica se já está logado na sessão atual
    if (sessionStorage.getItem('iq_logged') === 'true') {
        setupAdminUI();
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const user = userField.value;
            const pass = passField.value;

            if (user === 'cipolari' && pass === 'Deus2026#') {
                sessionStorage.setItem('iq_logged', 'true');
                setupAdminUI();
                console.log("Acesso ADM Concedido.");
            } else {
                if (errorMsg) {
                    errorMsg.style.display = 'block';
                    setTimeout(() => errorMsg.style.display = 'none', 3000);
                }
            }
        });
    }

    // Modal ADM Controls
    const admOverlay = document.getElementById('adm-panel-overlay');
    const openAdmBtn = document.getElementById('nav-adm-panel');
    const closeAdmBtn = document.getElementById('close-adm-panel');
    const injectBtn = document.getElementById('btn-inject-signal');
    const winRateRange = document.getElementById('adm-winrate');
    const winRateLabel = document.getElementById('label-adm-winrate');

    if (openAdmBtn) openAdmBtn.onclick = () => admOverlay.style.display = 'flex';
    if (closeAdmBtn) closeAdmBtn.onclick = () => admOverlay.style.display = 'none';

    if (injectBtn) {
        injectBtn.onclick = () => {
            const pair = document.getElementById('adm-pair').value;
            const type = document.getElementById('adm-type').value;
            if (window.engine) {
                window.engine.injectSignal(pair, type);
                admOverlay.style.display = 'none';
            }
        };
    }

    if (winRateRange) {
        winRateRange.oninput = (e) => {
            const val = e.target.value;
            if (winRateLabel) winRateLabel.innerText = `IA MODO: ${val}%`;
            if (window.engine) window.engine.setGlobalWinRate(parseInt(val));
        };
    }

    // 3. Inicialização de Sistema
    console.log("Design Master Trader v4.5 - UI Pronta.");
});

// Funções Globais ADM
function switchAdmTab(tabId) {
    const tabs = document.querySelectorAll('.adm-tab-content');
    const btns = document.querySelectorAll('.adm-tab-btn');
    
    tabs.forEach(t => t.style.display = 'none');
    btns.forEach(b => b.classList.remove('active'));
    
    const targetTab = document.getElementById('tab-' + tabId);
    const targetBtn = Array.from(btns).find(b => b.innerText.toLowerCase().includes(tabId.toLowerCase()));
    
    if (targetTab) targetTab.style.display = tabId === 'operacional' ? 'block' : 'block'; // Block é padrão, mas business usa grid
    // Ajuste para business usar layout de blocos
    if (tabId === 'business' && targetTab) targetTab.style.display = 'block';

    if (targetBtn) targetBtn.classList.add('active');
}
