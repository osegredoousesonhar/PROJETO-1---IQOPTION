/**
 * IQ SIGNALS PRO - MASTER ENGINE v4.6
 */

class SignalEngine {
    constructor() {
        this.activeSignal = null;
        this.radarSignals = [];
        this.history = JSON.parse(localStorage.getItem('iq_history')) || [];
        this.stats = JSON.parse(localStorage.getItem('iq_stats')) || { wins: 0, losses: 0, streak: 0 };
        this.isAdmin = false;
        this.targetWinRate = 94; 
        this.news = [];
        this.iaStats = JSON.parse(localStorage.getItem('iq_ia_stats')) || { wins: 0, losses: 0 };
        this.globalIndications = JSON.parse(localStorage.getItem('iq_global_indications')) || [];
        this.pendingEvaluations = []; 
        this.initialBalance = 265.65;
        this.balance = parseFloat(localStorage.getItem('iq_balance'));
        
        // Marcador de Versão para Sincronização de Saldo (Força 265.65 uma vez)
        const balanceVersion = localStorage.getItem('iq_balance_v_set');
        if (balanceVersion !== '265.65') {
            this.balance = 265.65;
            this.dailyInitialBalance = 265.65;
            this.iaStats = { wins: 0, losses: 0 };
            localStorage.setItem('iq_balance', this.balance);
            localStorage.setItem('iq_daily_balance', this.balance);
            localStorage.setItem('iq_ia_stats', JSON.stringify(this.iaStats));
            localStorage.setItem('iq_balance_v_set', '265.65'); 
            localStorage.setItem('iq_reset_date', new Date().toLocaleDateString('pt-BR'));
        }

        const lastReset = localStorage.getItem('iq_reset_date');
        const todayStr = new Date().toLocaleDateString('pt-BR');
        
        if (lastReset !== todayStr) {
            this.iaStats = { wins: 0, losses: 0 };
            this.dailyInitialBalance = this.balance;
            localStorage.setItem('iq_reset_date', todayStr);
            localStorage.setItem('iq_ia_stats', JSON.stringify(this.iaStats));
            localStorage.setItem('iq_daily_balance', this.dailyInitialBalance);
        } else {
            this.dailyInitialBalance = parseFloat(localStorage.getItem('iq_daily_balance')) || this.balance;
        }

        this.pendingTrades = [];
        this.currentTrade = null;
        this.audioCtx = null;
        this.init();
    }

    playSound(type) {
        try {
            if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);
            if (type === 'new') {
                oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(880, this.audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime); oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
                oscillator.stop(this.audioCtx.currentTime + 0.5);
            } else if (type === 'win') {
                oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(1046.50, this.audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime); oscillator.start();
                oscillator.frequency.exponentialRampToValueAtTime(1318.51, this.audioCtx.currentTime + 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
                oscillator.stop(this.audioCtx.currentTime + 0.5);
            } else if (type === 'loss') {
                oscillator.type = 'sawtooth'; oscillator.frequency.setValueAtTime(220, this.audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.05, this.audioCtx.currentTime); oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
                oscillator.stop(this.audioCtx.currentTime + 0.3);
            }
        } catch(e) {}
    }

    saveData() {
        localStorage.setItem('iq_balance', this.balance);
        localStorage.setItem('iq_stats', JSON.stringify(this.stats));
        localStorage.setItem('iq_ia_stats', JSON.stringify(this.iaStats));
        localStorage.setItem('iq_history', JSON.stringify(this.history));
        localStorage.setItem('iq_daily_balance', this.dailyInitialBalance);
    }

    calculateEntryTime(timeframe, minOffset = 1) {
        const finalOffset = Math.min(minOffset, 5);
        let date = new Date(Date.now() + finalOffset * 60000);
        date.setSeconds(0, 0); date.setMilliseconds(0);
        if (timeframe === 'M5') {
            let m = date.getMinutes();
            let remainder = m % 5;
            if (remainder !== 0) date.setMinutes(m + (5 - remainder));
        }
        return date;
    }

    init() {
        console.log("Terminal Master v4.6 - Produção Online");
        try {
            this.generateSignal();
            this.generateRadar();
            this.updateBalanceUI();
            this.renderHistory();
            this.renderPending();
            this.updateNews();
        } catch (e) {
            console.error("Erro na inicialização:", e);
        }
        
        // Timer principal a cada segundo (Countdown de entrada)
        if (this.tickInterval) clearInterval(this.tickInterval);
        this.tickInterval = setInterval(() => this.tick(), 1000);

        // Radar a cada 20 segundos
        if (this.radarInterval) clearInterval(this.radarInterval);
        this.radarInterval = setInterval(() => this.generateRadar(), 20000);

        // Notícias a cada 5 minutos
        if (this.newsInterval) clearInterval(this.newsInterval);
        this.newsInterval = setInterval(() => this.updateNews(), 300000);

        // Eventos Globais de Clique
        document.body.addEventListener('click', (e) => {
            const tradeBtn = e.target.closest('#btn-confirm-trade');
            if (tradeBtn) { this.confirmTrade(); return; }

            const radarCard = e.target.closest('.radar-hero-card');
            if (radarCard) {
                const idx = radarCard.getAttribute('data-index');
                if (idx !== null) {
                    console.log("Sinal Radar Selecionado:", idx);
                    this.selectRadarSignal(parseInt(idx));
                }
            }
        });

        window.engine = this;
    }

    tick() {
        const now = Date.now();
        
        // 1. Processamento de Sinais de Fundo
        if (this.globalIndications) {
            this.globalIndications = this.globalIndications.filter(sig => {
                const entryDate = sig.entry instanceof Date ? sig.entry : new Date(sig.entry);
                const resTime = sig.resolutionTime || (entryDate.getTime() + 90000);
                if (now > resTime) {
                    const isWin = Math.random() < (this.targetWinRate / 100);
                    if (isWin) this.iaStats.wins++; else this.iaStats.losses++;
                    this.history.unshift({ pair: sig.pair, type: sig.type, win: isWin, confirmed: false, timestamp: new Date(resTime).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) });
                    if (this.history.length > 10) this.history.pop();
                    this.updateBalanceUI();
                    this.saveData();
                    this.renderHistory();
                    return false;
                }
                return true;
            });
        }

        // 2. Atualização do Cronômetro de Entrada
        if (this.activeSignal) {
            const entryDate = this.activeSignal.entry instanceof Date ? this.activeSignal.entry : new Date(this.activeSignal.entry);
            const diff = Math.floor((entryDate.getTime() - now) / 1000);
            const timerEl = document.getElementById('main-timer');

            if (diff > 0) {
                const m = Math.floor(diff / 60);
                const s = diff % 60;
                if (timerEl) {
                    const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                    timerEl.innerText = `FALTAM ${timeStr} PARA ENTRADA`;
                    timerEl.style.color = diff <= 30 ? '#ff5252' : 'var(--accent)';
                    timerEl.style.fontSize = '18px';
                }
            } else {
                // Entrada Iniciada - Mover para Pendentes (Descer para apuração)
                if (timerEl) {
                    timerEl.innerText = "ENTRADA AGORA!";
                    timerEl.style.color = "#00e676"; // Verde Brilhante
                }
                
                // Evita chamadas duplicadas
                if (!this.activeSignal.moving) {
                    this.activeSignal.moving = true;
                    this.playSound('win'); 
                    setTimeout(() => {
                        this.moveToPending(this.activeSignal);
                        this.generateSignal();
                    }, 1000);
                }
            }
        }

        // 3. Processamento de Sinais em Apuração (Pendentes)
        if (this.pendingTrades.length > 0) {
            this.pendingTrades = this.pendingTrades.filter(trade => {
                const diff = Math.floor((trade.resTime - now) / 1000);
                if (diff <= 0) {
                    // Auto-resolução se o usuário não clicou ainda
                    const isWin = Math.random() < (this.targetWinRate / 100);
                    this.resolveTrade(null, isWin ? 'win' : 'loss');
                    return false;
                }
                return true;
            });
            this.renderPending();
        }

        this.checkMidnightReset();
        this.updateRadarTimers(now);
    }

    checkMidnightReset() {
        const todayStr = new Date().toLocaleDateString('pt-BR');
        const lastReset = localStorage.getItem('iq_reset_date');
        if (lastReset !== todayStr) {
            console.log("Reiniciando estatísticas diárias (00:00)...");
            this.iaStats = { wins: 0, losses: 0 };
            this.dailyInitialBalance = this.balance;
            localStorage.setItem('iq_reset_date', todayStr);
            this.saveData();
            this.updateBalanceUI();
        }
    }

    updateRadarTimers(now) {
        this.radarSignals.forEach((s, idx) => {
            const timerEl = document.getElementById(`radar-timer-${idx}`);
            if (timerEl) {
                const entryDate = s.entry instanceof Date ? s.entry : new Date(s.entry);
                const diff = Math.floor((entryDate.getTime() - now) / 1000);
                if (diff > 0) {
                    const m = Math.floor(diff / 60);
                    const s_rem = diff % 60;
                    timerEl.innerText = `${m.toString().padStart(2, '0')}:${s_rem.toString().padStart(2, '0')}`;
                } else {
                    timerEl.innerText = "EXPIRADO";
                }
            }
        });
    }

    generateSignal() {
        const basePairs = ['EUR/USD', 'GBP/JPY', 'AUD/CAD', 'USD/JPY', 'EUR/GBP'];
        const isOTC = Math.random() > 0.4;
        const pair = basePairs[Math.floor(Math.random() * basePairs.length)] + (isOTC ? ' (OTC)' : '');
        const entryTime = this.calculateEntryTime('M1', 2); // Mais rápido para teste
        const timeframe = Math.random() > 0.5 ? 'M1' : 'M5';
        
        this.activeSignal = {
            id: Date.now(),
            pair: pair,
            type: Math.random() > 0.5 ? 'COMPRA' : 'VENDA',
            timeframe: timeframe,
            prob: Math.floor(Math.random() * 12 + 86),
            entry: entryTime,
            duration: timeframe === 'M5' ? 300000 : 60000 
        };

        this.renderPrimary();
        
        // Contabiliza estatística de indicações geradas no Principal
        this.stats.streak++; // Apenas marcador interno para saber que houve movimentação
        this.saveData();
    }

    renderPrimary() {
        const container = document.getElementById('main-signal-card');
        const s = this.activeSignal;
        if (!container || !s) return;

        const entryStr = s.entry.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        container.innerHTML = `
            <span class="hero-pair">${s.pair}</span>
            <span class="hero-timeframe">IA SCALPER ${s.timeframe}</span>
            <div class="main-action-box ${s.type === 'COMPRA' ? 'call' : 'put'}">
                <i class="fas fa-arrow-${s.type === 'COMPRA' ? 'up' : 'down'} action-icon"></i>
                <span class="action-label">${s.type}</span>
            </div>
            <div class="timer-display">
                <span id="main-timer" class="live-timer">00:00</span>
                <p id="entry-time-label" class="entry-badge">PRÓXIMA ENTRADA: ${entryStr}</p>
            </div>
            <div class="input-container">
                <input type="number" id="trade-amount" value="5.00" class="trade-input">
                <button id="btn-confirm-trade" class="confirm-btn">Confirmar Entrada</button>
            </div>
            <div class="confidence">
                <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; margin-bottom: 8px;">
                    <span>CONFIANÇA IA</span>
                    <span>${s.prob}%</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden;">
                    <div style="height: 100%; width: ${s.prob}%; background: var(--accent); box-shadow: 0 0 15px var(--accent-glow);"></div>
                </div>
            </div>
        `;
        
        document.getElementById('current-asset').innerText = s.pair;
        if (window.marketChart) window.marketChart.changeAsset(s.pair);
    }

    generateRadar() {
        const pairs = ['USD/CHF', 'EUR/AUD', 'GBP/AUD', 'EUR/USD', 'NZD/USD (OTC)', 'EUR/JPY (OTC)', 'BTC/USD', 'ETH/USD', 'GBP/USD', 'AUD/JPY'];
        this.radarSignals = [];
        for (let i = 0; i < 5; i++) {
            const pair = pairs[Math.floor(Math.random() * pairs.length)];
            const timeframe = Math.random() > 0.5 ? 'M1' : 'M5';
            this.radarSignals.push({
                pair: pair,
                type: Math.random() > 0.5 ? 'COMPRA' : 'VENDA',
                prob: Math.floor(Math.random() * 10 + 88),
                timeframe: timeframe,
                entry: this.calculateEntryTime(timeframe, (i + 1) * 2),
                duration: timeframe === 'M5' ? 300000 : 60000
            });
        }
        this.renderRadar();
    }

    renderRadar() {
        const list = document.getElementById('radar-list');
        if (!list) return;
        list.innerHTML = this.radarSignals.map((s, idx) => `
            <div class="radar-hero-card animate-slide" data-index="${idx}">
                <!-- Timeframe Badge -->
                <div style="position: absolute; top: 10px; left: 10px; background: ${s.timeframe === 'M1' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 184, 0, 0.3)'}; 
                            color: white; padding: 2px 8px; border-radius: 4px; font-size: 8px; font-weight: 900; 
                            border: 1px solid currentColor; z-index: 5;">
                    IA ${s.timeframe}
                </div>

                <div class="hero-signal-header" style="margin-top: 10px;">
                    <span class="hero-pair" style="font-size: 18px; margin-bottom: 2px;">${s.pair}</span>
                    <span style="font-size: 10px; color: var(--text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                        Entrada: ${s.entry.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
                    </span>
                </div>
                
                <div class="mini-status-box ${s.type === 'COMPRA' ? 'call' : 'put'}" style="margin: 15px 0; padding: 12px; border-radius: 12px; border: 1px solid currentColor; background: rgba(255,255,255,0.02);">
                    <i class="fas fa-arrow-${s.type === 'COMPRA' ? 'up' : 'down'}" style="font-size: 18px;"></i>
                    <span style="font-size: 14px; font-weight: 900; margin-left: 8px; letter-spacing: 1px;">${s.type}</span>
                </div>

                <div style="margin-top: 15px; margin-bottom: 20px; text-align: left;">
                    <div style="display: flex; justify-content: space-between; font-size: 9px; font-weight: 800; margin-bottom: 6px; color: var(--text-dim);">
                        <span>SINAL IA AGUARDANDO</span>
                        <span id="radar-timer-${idx}" style="color: white; font-size: 11px;">--:--</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; font-size: 9px; font-weight: 800; margin-bottom: 6px; margin-top: 12px; color: var(--text-dim);">
                        <span>CONFIANÇA ALGORÍTMICA</span>
                        <span style="color: var(--accent);">${s.prob}%</span>
                    </div>
                    <div style="height: 5px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden;">
                        <div style="height: 100%; width: ${s.prob}%; background: linear-gradient(90deg, var(--accent), #ff8c00); box-shadow: 0 0 10px var(--accent-glow);"></div>
                    </div>
                </div>

                <button class="confirm-btn" style="width: 100%; padding: 10px; font-size: 10px; height: auto; border-radius: 12px; letter-spacing: 1px; font-weight: 900;">SELECIONAR OPERAÇÃO</button>
            </div>
        `).join('');
    }

    selectRadarSignal(idx) {
        const selected = this.radarSignals[idx];
        if (!selected) return;
        this.activeSignal = { ...selected, id: Date.now() };
        this.renderPrimary();
        this.playSound('new');
    }

    confirmTrade() {
        if (!this.activeSignal || this.currentTrade) return;
        const amount = parseFloat(document.getElementById('trade-amount').value);
        if (amount > this.balance) { alert("Saldo insuficiente!"); return; }
        this.balance -= amount;
        this.currentTrade = { id: this.activeSignal.id, amount: amount, pair: this.activeSignal.pair };
        this.moveToPending(this.activeSignal);
        this.generateSignal();
        this.dailyInitialBalance = parseFloat(localStorage.getItem('iq_daily_balance')) || 235.62;
        this.updateBalanceUI();
        this.saveData();
        this.playSound('new');
    }

    moveToPending(sig) {
        const tradeData = this.currentTrade || { amount: 0, confirmed: false };
        this.pendingTrades = [{ 
            ...sig, 
            amount: tradeData.amount, 
            confirmed: tradeData.confirmed, 
            timestamp: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}),
            resTime: Date.now() + (sig.timeframe === 'M5' ? 300000 : 60000)
        }];
        this.currentTrade = null;
        this.renderPending();
    }

    resolveTrade(id, result) {
        const t = this.pendingTrades[0];
        if (!t) return;
        
        const isWin = result === 'win';
        const isSkip = result === 'skip';

        // Atualiza SALDO apenas se foi uma entrada confirmada
        if (t.confirmed) {
            if (isWin) this.balance += t.amount * 1.85;
            else if (isSkip) this.balance += t.amount;
            // Se for loss, o valor já foi debitado no confirmTrade()
        }

        // Atualiza ESTATÍSTICA DIÁRIA sempre (independente de confirmação)
        if (!isSkip) {
            this.iaStats[isWin ? 'wins' : 'losses']++;
        }

        // Adiciona ao Histórico em formato detalhado
        this.history.unshift({ 
            ...t, 
            win: isWin, 
            skip: isSkip,
            h: t.timestamp,
            profit: t.confirmed && isWin ? (t.amount * 0.85) : 0
        });
        
        if (this.history.length > 10) this.history.pop();
        
        this.pendingTrades = [];
        this.updateBalanceUI();
        this.saveData();
        this.renderPending();
        this.renderHistory();
    }

    renderPending() {
        const container = document.getElementById('pending-list');
        if (!container) return;
        if (this.pendingTrades.length === 0) {
            container.innerHTML = '<p style="font-size: 11px; opacity: 0.3; text-align: center; padding: 20px;">Aguardando sinal...</p>';
            return;
        }
        const t = this.pendingTrades[0];
        const now = Date.now();
        const diff = Math.max(0, Math.floor((t.resTime - now) / 1000));
        const m = Math.floor(diff / 60);
        const s = diff % 60;
        const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        container.innerHTML = `
            <div class="pending-card animate-slide" style="padding: 15px; border-color: ${t.confirmed ? 'var(--accent)' : 'var(--text-dim)'}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <p style="font-size: 14px; font-weight: 900; color: white;">${t.pair} - ${t.type}</p>
                    <span style="font-family: 'Outfit'; font-size: 16px; color: var(--accent); font-weight: 900;">${timeStr}</span>
                </div>
                <p style="font-size: 9px; color: var(--text-dim); margin-top: 5px;">${t.confirmed ? 'OPERANDO SALDO REAL' : 'APURAÇÃO AUTOMÁTICA (OBSERVAÇÃO)'}</p>
                <div style="display: flex; gap: 5px; margin-top: 10px;">
                    <button onclick="window.engine.resolveTrade(null, 'win')" class="p-btn win" style="flex:1">WIN</button>
                    <button onclick="window.engine.resolveTrade(null, 'loss')" class="p-btn loss" style="flex:1">LOSS</button>
                </div>
            </div>
        `;
    }

    renderHistory() {
        const list = document.getElementById('history-list');
        if (!list) return;
        list.innerHTML = this.history.map(item => `
            <div class="history-card animate-slide">
                <div class="h-card-top">
                    <span class="history-asset">${item.pair}</span>
                    <span class="history-res ${item.win ? 'win' : 'loss'}">${item.skip ? 'SKIP' : (item.win ? 'WIN' : 'LOSS')}</span>
                </div>
                <div class="h-card-info">
                    <span>${item.h || item.timestamp}</span>
                    <span style="color: ${item.confirmed ? 'var(--green)' : 'var(--text-dim)'}">
                        ${item.confirmed ? 'INVEST: R$ ' + item.amount.toFixed(2) : 'OBSERVAÇÃO'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    updateBalanceUI() {
        const b = document.getElementById('user-balance');
        if (b) b.innerText = `R$ ${this.balance.toFixed(2)}`;
        
        const w = document.getElementById('stat-wins');
        const l = document.getElementById('stat-losses');
        if (w) w.innerText = this.iaStats.wins;
        if (l) l.innerText = this.iaStats.losses;

        // Cálculo de Assertividade
        const total = this.iaStats.wins + this.iaStats.losses;
        const acc = total > 0 ? (this.iaStats.wins / total * 100).toFixed(0) : 0;
        const accEl = document.getElementById('stat-accuracy');
        if (accEl) accEl.innerText = `${acc}%`;

        // Cálculo de Crescimento Diário
        const dailyGrowth = ((this.balance - this.dailyInitialBalance) / this.dailyInitialBalance * 100).toFixed(2);
        const dgEl = document.getElementById('daily-growth');
        const bgEl = document.getElementById('balance-growth');
        if (dgEl) dgEl.innerText = `${dailyGrowth > 0 ? '+' : ''}${dailyGrowth}%`;
        if (bgEl) bgEl.innerText = `${dailyGrowth > 0 ? '+' : ''}${dailyGrowth}%`;

        // Crescimento Total
        const totalGrowth = ((this.balance - this.initialBalance) / this.initialBalance * 100).toFixed(2);
        const tgEl = document.getElementById('total-growth');
        if (tgEl) tgEl.innerText = `${totalGrowth > 0 ? '+' : ''}${totalGrowth}%`;

        // Atualiza a aba Business também
        this.updateBusinessUI();
    }

    updateBusinessUI() {
        const revEl = document.getElementById('business-total-revenue');
        const salesEl = document.getElementById('business-sales-today');
        const roiEl = document.getElementById('business-roi');
        
        if (revEl) {
            // Faturamento simulado: Inicial + (vendas * ticket médio)
            const totalRev = 14280.00 + (this.iaStats.wins * 47.00);
            revEl.innerText = `R$ ${totalRev.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        }
        
        if (salesEl) {
            const totalSales = 12 + this.iaStats.wins;
            salesEl.innerText = `${totalSales} ORDENS`;
        }

        if (roiEl) {
            const winRate = (this.iaStats.wins / (this.iaStats.wins + this.iaStats.losses || 1)) * 100;
            roiEl.innerText = `${winRate > 0 ? '+' : ''}${winRate.toFixed(2)}%`;
        }
    }

    resetData() {
        if (confirm("Deseja realmente resetar todos os dados de teste?")) {
            localStorage.clear();
            location.reload();
        }
    }

    updateNews() {
        const list = document.getElementById('news-list');
        if (!list) return;
        const pairs = ['USD/FED', 'EUR/BCE', 'GBP/BCE', 'JPY/BoJ'];
        const p = pairs[Math.floor(Math.random() * pairs.length)];
        list.innerHTML = `<div class="news-item"><div class="news-impact high"></div><div class="news-info"><p class="news-pair">${p}</p><p class="news-text">Decisão Taxa de Juros</p></div><span class="news-time">14:00</span></div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => { window.engine = new SignalEngine(); });
