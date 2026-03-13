/**
 * IQ SIGNALS PRO - MASTER ENGINE v4.6
 */

class SignalEngine {
    constructor() {
        this.activeSignal = null;
        this.radarSignalsM1 = [];
        this.radarSignalsM5 = [];
        this.pendingTrades = [];
        // Força Reset para R$ 262,78 (v5.1 - MARKET REALISM)
        const currentVersion = 'v5.1_market_realism';
        const lastAppliedVersion = localStorage.getItem('iq_system_version');

        if (lastAppliedVersion !== currentVersion) {
            console.log("!!! APLICANDO RESET REALISMO V5.1 !!!");
            localStorage.clear();
            
            this.balance = 262.78;
            this.initialBalance = 262.78;
            this.dailyInitialBalance = 262.78;
            this.history = [];
            this.iaStats = { wins: 0, losses: 0 };
            this.stats = { wins: 0, losses: 0, streak: 0 };
            
            localStorage.setItem('iq_system_version', currentVersion);
            this.saveData();
        } else {
            this.history = JSON.parse(localStorage.getItem('iq_history')) || [];
            this.stats = JSON.parse(localStorage.getItem('iq_stats')) || { wins: 0, losses: 0, streak: 0 };
            this.iaStats = JSON.parse(localStorage.getItem('iq_ia_stats')) || { wins: 0, losses: 0 };
            this.balance = parseFloat(localStorage.getItem('iq_balance')) || 262.78;
            this.dailyInitialBalance = parseFloat(localStorage.getItem('iq_daily_balance')) || 262.78;
            this.initialBalance = 262.78;
        }

        this.marketPrices = {}; // Simulação de preços reais
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

            const pendingBtn = e.target.closest('button[onclick*="confirmPendingTrade"]');
            if (pendingBtn) { this.confirmPendingTrade(); return; }

            const radarCard = e.target.closest('.radar-hero-card');
            if (radarCard) {
                // O novo sistema usa onclick direto no card, mas mantemos o listener por segurança
                // ou removemos se o onclick no HTML for suficiente.
                // Como adicionei onclick="window.engine.selectRadarSignal()" no JS, 
                // este listener pode ser mais genérico ou removido.
            }
        });

        window.engine = this;
    }

    tick() {
        const now = Date.now();
        this.updateMarketSimulation();
        
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
                    timerEl.style.color = diff <= 20 ? '#ff5252' : '#00e676';
                    timerEl.style.fontSize = '24px';
                    timerEl.style.fontWeight = '900';
                }
            } else {
                if (timerEl) {
                    timerEl.innerText = "ENTRADA AGORA!";
                    timerEl.style.color = "#00e676"; 
                }
                
                if (!this.activeSignal.moving) {
                    this.activeSignal.moving = true;
                    this.activeSignal.entryPrice = this.marketPrices[this.activeSignal.pair.split(' ')[0]] || 1.1234;
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
                
                if (!trade.confirmed && diff <= 20) {
                    trade.lockConfirmation = true;
                }

                if (diff <= 0) {
                    const finalPrice = this.marketPrices[trade.pair.split(' ')[0]] || trade.entryPrice;
                    const isWin = trade.type === 'COMPRA' ? (finalPrice > trade.entryPrice) : (finalPrice < trade.entryPrice);
                    this.resolveTrade(trade.id, isWin ? 'win' : 'loss', true);
                    return false;
                }
                return true;
            });
            this.renderPending();
        }

        this.checkMidnightReset();
        this.updateRadarTimers(now);
    }

    updateMarketSimulation() {
        const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/CAD', 'EUR/GBP', 'USD/CHF', 'EUR/AUD', 'GBP/AUD', 'NZD/USD', 'EUR/JPY', 'GBP/JPY', 'ETH/USD'];
        pairs.forEach(p => {
            if (!this.marketPrices[p]) {
                this.marketPrices[p] = p.includes('JPY') ? 150.45 : (p.includes('USD') && !p.startsWith('USD') ? 1.0850 : 0.8540);
            }
            // Simulação de volatilidade (Caminhada aleatória)
            const vol = p.includes('ETH') ? 0.5 : 0.00015;
            this.marketPrices[p] += (Math.random() - 0.5) * vol;
        });
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
        // Atualiza Timers M1
        this.radarSignalsM1.forEach((s, idx) => {
            const timerEl = document.getElementById(`radar-timer-m1-${idx}`);
            if (timerEl) {
                const diff = Math.floor((s.entry.getTime() - now) / 1000);
                timerEl.innerText = diff > 0 ? this.formatTimer(diff) : "EXPIRADO";
            }
        });
        // Atualiza Timers M5
        this.radarSignalsM5.forEach((s, idx) => {
            const timerEl = document.getElementById(`radar-timer-m5-${idx}`);
            if (timerEl) {
                const diff = Math.floor((s.entry.getTime() - now) / 1000);
                timerEl.innerText = diff > 0 ? this.formatTimer(diff) : "EXPIRADO";
            }
        });
    }

    formatTimer(diff) {
        const m = Math.floor(diff / 60);
        const s = diff % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    generateSignal() {
        const basePairs = ['EUR/USD', 'GBP/USD', 'AUD/CAD', 'USD/JPY', 'EUR/GBP'];
        const isOTC = Math.random() > 0.4;
        const pair = basePairs[Math.floor(Math.random() * basePairs.length)] + (isOTC ? ' (OTC)' : '');
        const entryTime = this.calculateEntryTime('M1', 2);
        const timeframe = Math.random() > 0.5 ? 'M1' : 'M5';
        
        this.activeSignal = {
            id: Date.now(),
            pair: pair,
            type: Math.random() > 0.5 ? 'COMPRA' : 'VENDA',
            timeframe: timeframe,
            prob: Math.floor(Math.random() * 12 + 82), // Probabilidade visual apenas
            entry: entryTime,
            duration: timeframe === 'M5' ? 300000 : 60000 
        };

        this.renderPrimary();
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
                <span id="main-timer" class="live-timer timer-highlight">00:00</span>
                <p id="entry-time-label" class="entry-badge entry-time-highlight">PRÓXIMA ENTRADA: ${entryStr}</p>
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
        if (window.marketChart && typeof window.marketChart.changeAsset === 'function') {
            window.marketChart.changeAsset(s.pair);
        }
    }

    generateRadar() {
        const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/CAD', 'EUR/GBP', 'USD/CHF', 'EUR/AUD', 'GBP/AUD', 'NZD/USD (OTC)', 'EUR/JPY (OTC)'];
        
        this.radarSignalsM1 = [];
        this.radarSignalsM5 = [];

        // Top 5 M1
        for (let i = 0; i < 5; i++) {
            this.radarSignalsM1.push(this.createRadarSignal(pairs[i] || pairs[0], 'M1', (i + 1) * 2));
        }

        // Top 5 M5
        for (let i = 0; i < 5; i++) {
            this.radarSignalsM5.push(this.createRadarSignal(pairs[pairs.length - 1 - i] || pairs[0], 'M5', (i + 1) * 5));
        }

        this.renderRadar();
    }

    createRadarSignal(pair, timeframe, offsetMin) {
        return {
            pair: pair,
            type: Math.random() > 0.5 ? 'COMPRA' : 'VENDA',
            prob: Math.floor(Math.random() * 10 + 88),
            timeframe: timeframe,
            entry: this.calculateEntryTime(timeframe, offsetMin),
            duration: timeframe === 'M5' ? 300000 : 60000
        };
    }

    renderRadar() {
        const listM1 = document.getElementById('radar-list-m1');
        const listM5 = document.getElementById('radar-list-m5');
        if (!listM1 || !listM5) return;

        listM1.innerHTML = this.radarSignalsM1.map((s, idx) => this.getRadarCardHTML(s, `m1-${idx}`)).join('');
        listM5.innerHTML = this.radarSignalsM5.map((s, idx) => this.getRadarCardHTML(s, `m5-${idx}`)).join('');
    }

    getRadarCardHTML(s, idSuffix) {
        return `
            <div class="radar-hero-card animate-slide" onclick="window.engine.selectRadarSignal('${idSuffix}')">
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
                        <span id="radar-timer-${idSuffix}" style="color: white; font-size: 11px;">--:--</span>
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
        `;
    }

    selectRadarSignal(idStr) {
        const [type, idx] = idStr.split('-');
        const selected = type === 'm1' ? this.radarSignalsM1[idx] : this.radarSignalsM5[idx];
        if (!selected) return;
        this.activeSignal = { ...selected, id: Date.now() };
        this.renderPrimary();
        this.playSound('new');
    }

    confirmTrade() {
        if (!this.activeSignal || this.currentTrade) return;
        const amount = parseFloat(document.getElementById('trade-amount').value);
        if (amount > this.balance) { alert("Saldo insuficiente!"); return; }
        
        // Marca o sinal ativo como confirmado antes de enfileirar
        this.activeSignal.confirmed = true;
        this.activeSignal.amount = amount;
        
        this.balance -= amount;
        this.currentTrade = { id: this.activeSignal.id, amount: amount, pair: this.activeSignal.pair, confirmed: true };
        
        this.updateBalanceUI();
        this.saveData();
        this.playSound('new');
        
        // Feedback visual no botão
        const btn = document.getElementById('btn-confirm-trade');
        if (btn) {
            btn.innerText = "ENTRADA CONFIRMADA!";
            btn.style.background = "var(--green)";
            btn.disabled = true;
        }
    }

    moveToPending(sig) {
        const tradeData = this.currentTrade || { amount: 0, confirmed: false };
        this.pendingTrades = [{ 
            ...sig, 
            amount: tradeData.amount, 
            confirmed: tradeData.confirmed, 
            lockConfirmation: false,
            timestamp: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}),
            resTime: Date.now() + (sig.timeframe === 'M5' ? 300000 : 60000)
        }];
        this.currentTrade = null;
        this.renderPending();
    }

    confirmPendingTrade() {
        const t = this.pendingTrades[0];
        if (!t || t.confirmed || t.lockConfirmation) return;

        const amountInput = document.getElementById('trade-amount');
        const amount = amountInput ? parseFloat(amountInput.value) : 5.00;
        if (amount > this.balance) { alert("Saldo insuficiente!"); return; }

        this.balance -= amount;
        t.confirmed = true;
        t.amount = amount;
        
        this.updateBalanceUI();
        this.saveData();
        this.playSound('new');
        this.renderPending();
    }

    resolveTrade(id, result, isAuto = false) {
        const t = this.pendingTrades[0];
        if (!t) return;
        
        const isWin = result === 'win';
        const isSkip = result === 'skip';

        // Atualiza SALDO apenas se foi uma entrada confirmada (TRADE REAL)
        if (t.confirmed) {
            if (isWin) {
                const profit = t.amount * 1.85; // Retorno total (Investimento + 85% lucro)
                this.balance += profit;
            } else if (isSkip) {
                this.balance += t.amount; // Devolve se cancelado
            }
        }

        // Atualiza ESTATÍSTICA DIÁRIA sempre (IA GLOBAL)
        if (!isSkip) {
            this.iaStats[isWin ? 'wins' : 'losses']++;
        }

        // Adiciona ao Histórico
        this.history.unshift({ 
            ...t, 
            win: isWin, 
            skip: isSkip,
            h: t.timestamp,
            profit: (t.confirmed && isWin) ? (t.amount * 0.85) : 0
        });
        
        if (this.history.length > 20) this.history.pop();
        
        this.pendingTrades = [];
        this.updateBalanceUI();
        this.saveData();
        this.renderPending();
        this.renderHistory();
        
        if (isWin) this.playSound('win'); else if (!isSkip) this.playSound('loss');
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
        const timeStr = this.formatTimer(diff);

        let actionArea = '';
        if (t.confirmed) {
            actionArea = `<p style="font-size: 10px; color: var(--green); font-weight: 900; text-align: center; margin-top: 10px;">OPERANDO SALDO REAL (R$ ${t.amount.toFixed(2)})</p>`;
        } else if (t.lockConfirmation) {
            actionArea = `<p style="font-size: 9px; color: var(--red); font-weight: 800; text-align: center; margin-top: 10px; opacity: 0.7;">CONFIRMAÇÃO BLOQUEADA (FIM DE TIME)</p>`;
        } else {
            actionArea = `
                <button onclick="window.engine.confirmPendingTrade()" class="confirm-btn" style="width: 100%; margin-top: 10px; background: var(--accent); color: black; font-size: 10px; padding: 12px;">
                    CONFIRMAR ENTRADA AGORA
                </button>
            `;
        }

        container.innerHTML = `
            <div class="pending-card animate-slide" style="padding: 18px; border-color: ${t.confirmed ? 'var(--green)' : 'var(--text-dim)'}; background: rgba(255,255,255,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="font-size: 14px; font-weight: 900; color: white; margin-bottom: 2px;">${t.pair}</p>
                        <p style="font-size: 10px; font-weight: 800; color: ${t.type === 'COMPRA' ? 'var(--green)' : 'var(--red)'}">${t.type} - IA ${t.timeframe}</p>
                    </div>
                    <span style="font-family: 'Outfit'; font-size: 20px; color: var(--accent); font-weight: 900;">${timeStr}</span>
                </div>
                ${actionArea}
            </div>
        `;
    }

    renderHistory() {
        const list = document.getElementById('history-list');
        if (!list) return;

        // Mostrar RIGOROSAMENTE as 10 últimas ordens confirmadas (Execução Real)
        const filteredHistory = this.history
            .filter(item => item.confirmed === true)
            .slice(0, 10);

        if (filteredHistory.length === 0) {
            list.innerHTML = '<p style="font-size: 11px; opacity: 0.3; text-align: center; padding: 20px;">Nenhuma operação real recente.</p>';
            return;
        }

        list.innerHTML = filteredHistory.map(item => `
            <div class="history-card animate-slide">
                <div class="h-card-top">
                    <span class="history-asset">${item.pair}</span>
                    <span class="history-res ${item.win ? 'win' : 'loss'}">${item.skip ? 'CANCELADO' : (item.win ? 'VITÓRIA' : 'DERROTA')}</span>
                </div>
                <div class="h-card-info">
                    <span>${item.h || item.timestamp}</span>
                    <span style="color: var(--green); font-weight: 800;">
                        INVESTIDO: R$ ${item.amount.toFixed(2)}
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
        
        const highImpactEvents = [
            { pair: 'USD', title: 'Non-Farm Payrolls (NFP)', time: '09:30', impact: 'high' },
            { pair: 'EUR', title: 'Decisão Taxa de Juros BCE', time: '11:15', impact: 'high' },
            { pair: 'GBP', title: 'Relatório Inflação (CPI)', time: '08:00', impact: 'high' },
            { pair: 'USD', title: 'FOMC Statement', time: '15:00', impact: 'high' },
            { pair: 'JPY', title: 'BoJ Monetary Policy', time: '02:00', impact: 'high' },
            { pair: 'AUD', title: 'RBA Interest Rate', time: '03:30', impact: 'high' }
        ];

        // Seleciona 3 eventos aleatórios para o dia
        const shuffled = highImpactEvents.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        list.innerHTML = selected.map(news => `
            <div class="news-item">
                <div class="news-impact high">
                    <span class="bull-icon"><i class="fas fa-bullhorn"></i> 3 Touros</span>
                </div>
                <div class="news-info">
                    <p class="news-pair">${news.pair}</p>
                    <p class="news-text">${news.title}</p>
                </div>
                <span class="news-time">${news.time}</span>
            </div>
        `).join('');
    }
}

// O SignalsEngine agora é instanciado via index.html para garantir o contexto global.
