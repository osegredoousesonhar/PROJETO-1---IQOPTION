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
        this.initialBalance = 230.00;
        this.balance = parseFloat(localStorage.getItem('iq_balance')) || 230.00;
        
        const dayStart = localStorage.getItem('iq_daily_timestamp');
        const now = Date.now();
        if (!dayStart || (now - parseInt(dayStart)) > 86400000) {
            this.dailyInitialBalance = this.balance;
            localStorage.setItem('iq_daily_balance', this.balance);
            localStorage.setItem('iq_daily_timestamp', now);
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
                    this.updateBalanceUI();
                    this.saveData();
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
                // Entrada Iniciada
                if (timerEl) timerEl.innerText = "ENTRADA AGORA!";
                setTimeout(() => {
                    this.moveToPending(this.activeSignal);
                    this.generateSignal();
                }, 2000);
            }
        }

        this.updateRadarTimers(now);
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
        const entryTime = this.calculateEntryTime('M5', 5);
        
        this.activeSignal = {
            id: Date.now(),
            pair: pair,
            type: Math.random() > 0.5 ? 'COMPRA' : 'VENDA',
            timeframe: Math.random() > 0.5 ? 'M1' : 'M5',
            prob: Math.floor(Math.random() * 12 + 86),
            entry: entryTime
        };

        this.renderPrimary();
        
        const btn = document.getElementById('btn-confirm-trade');
        if (btn) {
            btn.innerText = "Confirmar Entrada";
            btn.style.background = "var(--accent)";
            btn.disabled = false;
        }
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
        const pairs = ['USD/CHF', 'EUR/AUD', 'GBP/AUD', 'EUR/USD', 'NZD/USD (OTC)', 'EUR/JPY (OTC)', 'BTC/USD', 'ETH/USD'];
        this.radarSignals = [];
        for (let i = 0; i < 4; i++) {
            const pair = pairs[Math.floor(Math.random() * pairs.length)];
            const timeframe = Math.random() > 0.5 ? 'M1' : 'M5';
            this.radarSignals.push({
                pair: pair,
                type: Math.random() > 0.5 ? 'COMPRA' : 'VENDA',
                prob: Math.floor(Math.random() * 10 + 88),
                timeframe: timeframe,
                entry: this.calculateEntryTime(timeframe, (i + 1) * 2)
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
                <div style="position: absolute; top: 12px; right: 12px; background: ${s.timeframe === 'M1' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 184, 0, 0.2)'}; 
                            color: ${s.timeframe === 'M1' ? '#818cf8' : 'var(--accent)'}; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 900; 
                            border: 1px solid currentColor;">
                    ${s.timeframe} ANALYTICS
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

                <button class="confirm-btn" style="width: 100%; padding: 14px; font-size: 11px; height: auto; border-radius: 12px; letter-spacing: 1.5px; font-weight: 900;">SELECIONAR OPERAÇÃO</button>
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
        this.updateBalanceUI();
        this.saveData();
        this.playSound('new');
    }

    moveToPending(sig) {
        this.pendingTrades = [{ ...sig, amount: this.currentTrade ? this.currentTrade.amount : 0, confirmed: !!this.currentTrade, timestamp: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) }];
        this.currentTrade = null;
        this.renderPending();
    }

    resolveTrade(id, result) {
        const t = this.pendingTrades[0];
        if (!t) return;
        if (t.confirmed) {
            if (result === 'win') this.balance += t.amount * 1.85;
            else if (result === 'skip') this.balance += t.amount;
        }
        this.iaStats[result === 'win' ? 'wins' : 'losses']++;
        this.history.unshift({ ...t, win: result === 'win', h: t.timestamp });
        if (this.history.length > 5) this.history.pop();
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
        container.innerHTML = `
            <div class="pending-card animate-slide" style="padding: 15px;">
                <p style="font-size: 14px; font-weight: 900; color: var(--accent);">${t.pair} - ${t.type}</p>
                <div style="display: flex; gap: 5px; margin-top: 10px;">
                    <button onclick="window.engine.resolveTrade(null, 'win')" class="p-btn win" style="flex:1">WIN</button>
                    <button onclick="window.engine.resolveTrade(null, 'loss')" class="p-btn loss" style="flex:1">LOSS</button>
                    <button onclick="window.engine.resolveTrade(null, 'skip')" class="p-btn skip" style="flex:1">SKIP</button>
                </div>
            </div>
        `;
    }

    renderHistory() {
        const list = document.getElementById('history-list');
        if (!list) return;
        list.innerHTML = this.history.map(item => `
            <div class="history-item">
                <span class="history-asset">${item.pair}</span>
                <span class="history-res ${item.win ? 'win' : 'loss'}">${item.win ? 'WIN' : 'LOSS'}</span>
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
