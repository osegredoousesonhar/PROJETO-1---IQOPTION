/**
 * IQ SIGNALS PRO - MASTER ENGINE
 */

class SignalEngine {
    constructor() {
        this.activeSignal = null;
        this.radarSignals = [];
        this.history = JSON.parse(localStorage.getItem('iq_history')) || [];
        this.stats = JSON.parse(localStorage.getItem('iq_stats')) || { wins: 0, losses: 0, streak: 0 };
        this.isAdmin = false;
        this.targetWinRate = 94; // Padrão
        this.news = [];
        
        // Estatísticas Globais da IA (SaaS Performance - Independente de entrar ou não)
        this.iaStats = JSON.parse(localStorage.getItem('iq_ia_stats')) || { wins: 0, losses: 0 };
        this.globalIndications = JSON.parse(localStorage.getItem('iq_global_indications')) || [];
        this.pendingEvaluations = []; 
        
        // 1. Saldo Inicial de TODO O SEMPRE (para o SaaS)
        this.initialBalance = 230.00;
        
        // 2. Saldo Atual
        this.balance = parseFloat(localStorage.getItem('iq_balance')) || 230.00;
        
        // Se mudou o saldo inicial via código, forçar atualização
        if (localStorage.getItem('iq_initial_balance') !== "230.00") {
            this.balance = 230.00;
            this.initialBalance = 230.00;
            localStorage.setItem('iq_initial_balance', "230.00");
        }
        
        // 3. Saldo Inicial do DIA (24h)
        const dayStart = localStorage.getItem('iq_daily_timestamp');
        const now = Date.now();
        
        // Se não existir ou se passou mais de 24h, reseta o balanço diário
        if (!dayStart || (now - parseInt(dayStart)) > 86400000) {
            this.dailyInitialBalance = this.balance;
            localStorage.setItem('iq_daily_balance', this.balance);
            localStorage.setItem('iq_daily_timestamp', now);
        } else {
            this.dailyInitialBalance = parseFloat(localStorage.getItem('iq_daily_balance')) || this.balance;
        }

        if (!localStorage.getItem('iq_initial_balance')) {
            localStorage.setItem('iq_initial_balance', 237.04);
        }
        
        this.pendingTrades = [];
        this.currentTrade = null;
        this.audioCtx = null;
        this.init();
    }

    playSound(type) {
        if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        if (type === 'new') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5
            gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
            oscillator.stop(this.audioCtx.currentTime + 0.5);
        } else if (type === 'win') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1046.50, this.audioCtx.currentTime); // C6
            gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
            oscillator.start();
            oscillator.frequency.exponentialRampToValueAtTime(1318.51, this.audioCtx.currentTime + 0.3); // E6
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
            oscillator.stop(this.audioCtx.currentTime + 0.5);
        } else if (type === 'loss') {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(220, this.audioCtx.currentTime); // A3
            gainNode.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
            oscillator.stop(this.audioCtx.currentTime + 0.3);
        }
    }

    saveData() {
        localStorage.setItem('iq_balance', this.balance);
        localStorage.setItem('iq_stats', JSON.stringify(this.stats));
        localStorage.setItem('iq_ia_stats', JSON.stringify(this.iaStats));
        localStorage.setItem('iq_history', JSON.stringify(this.history));
        localStorage.setItem('iq_daily_balance', this.dailyInitialBalance);
    }

    calculateEntryTime(timeframe, minOffset = 1) {
        // Garantir no máximo 5 minutos de antecedência conforme solicitado
        const finalOffset = Math.min(minOffset, 5);
        let date = new Date(Date.now() + finalOffset * 60000);
        date.setSeconds(0, 0);
        date.setMilliseconds(0);
        
        if (timeframe === 'M5') {
            let m = date.getMinutes();
            let remainder = m % 5;
            if (remainder !== 0) {
                date.setMinutes(m + (5 - remainder));
            }
        }
        return date;
    }

    init() {
        console.log("Terminal Inteligente v4.5 - Master Engine Online");
        
        // Recalcula estatísticas da IA com base no histórico salvo para não começar em 0%
        this.iaStats = { wins: 0, losses: 0 };
        this.history.forEach(item => {
            if (item.win) this.iaStats.wins++;
            else if (!item.skipped) this.iaStats.losses++;
            // Nota: Se foi 'skip', mas o histórico mostra o resultado da IA, contabilizamos.
            else if (item.skipped && item.win !== undefined) {
                if(item.win) this.iaStats.wins++; else this.iaStats.losses++;
            }
        });

        this.generateSignal();
        this.generateRadar();
        this.updateBalanceUI();
        this.renderHistory();
        this.renderPending();
        setInterval(() => this.tick(), 1000);
        setInterval(() => this.generateRadar(), 30000); // Atualiza radar a cada 30s
        this.updateNews(); // Gera notícias iniciais
        setInterval(() => this.updateNews(), 300000); // Atualiza notícias a cada 5 min
        
        // DELEGAÇÃO DE EVENTOS MASTER: Resolve o problema de perda de listeners em renderizações
        document.body.addEventListener('click', (e) => {
            // Botão Confirmar Entrada
            if (e.target.id === 'btn-confirm-trade' || e.target.closest('#btn-confirm-trade')) {
                if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                this.confirmTrade();
            }
            
            // Seleção no Radar
            const radarCard = e.target.closest('.radar-hero-card');
            if (radarCard) {
                const idx = Array.from(document.getElementById('radar-list').children).indexOf(radarCard);
                if (idx !== -1) this.selectRadarSignal(idx);
            }
        });
        
        window.engine = this;
        
        // Reconstrutor de estatísticas globais (últimas 24h)
        this.cleanOldGlobalIndications();
    }

    cleanOldGlobalIndications() {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        this.globalIndications = this.globalIndications.filter(sig => (now - sig.timestamp) < oneDay);
        this.saveData();
    }

    trackSignal(signal) {
        // Define o tempo de resolução (Ex: M1 resolve 1.5 min após entrada para garantir)
        const resolutionDelay = (parseInt(signal.timeframe.substring(1)) || 1) * 60 * 1000 + 30000;
        const resolutionTime = signal.entry.getTime() + resolutionDelay;

        this.pendingEvaluations.push({
            id: signal.id,
            pair: signal.pair,
            type: signal.type,
            timeframe: signal.timeframe,
            resolutionTime: resolutionTime,
            prob: signal.prob
        });
    }

    generateRadar() {
        const basePairs = [
            'EUR/USD', 'GBP/JPY', 'AUD/CAD', 'USD/JPY', 'EUR/GBP', 
            'USD/CHF', 'EUR/JPY', 'NZD/USD', 'GBP/USD', 'AUD/USD', 
            'USD/CAD', 'EUR/AUD', 'GBP/AUD', 'EUR/CAD', 'CAD/JPY', 'NZD/JPY'
        ];
        
        let allSignals = basePairs.map(pair => ({
            pair: pair + (Math.random() > 0.6 ? ' (OTC)' : ''),
            type: Math.random() > 0.5 ? 'COMPRA' : 'VENDA',
            prob: Math.floor(Math.random() * (99 - 85) + 85),
            timeframe: Math.random() > 0.5 ? 'M1' : 'M5'
        }));
        
        // Ordena por maior probabilidade e pega apenas as 3 melhores opções (Alta Assertividade)
        allSignals.sort((a, b) => b.prob - a.prob);
        this.radarSignals = allSignals.slice(0, 3);
        
        this.renderRadar();
        
        // Registra cada um dos novos sinais do radar para computação global
        this.radarSignals.forEach((s, idx) => {
             const entryTime = this.calculateEntryTime(s.timeframe, (idx + 1) * 2);
             this.trackSignal({...s, entry: entryTime, id: `radar-${Date.now()}-${idx}`});
        });
    }

    renderRadar() {
        const list = document.getElementById('radar-list');
        if (!list) return;
        list.innerHTML = this.radarSignals.map((s, idx) => {
            // Gera dados técnicos realistas baseados na probabilidade e direção
            const rsiVal = s.type === 'COMPRA' ? Math.floor(Math.random() * (40 - 20) + 20) : Math.floor(Math.random() * (80 - 60) + 60);
            const trendStrength = Math.floor(Math.random() * (100 - 80) + 80);
            
            const entryTime = this.calculateEntryTime(s.timeframe, (idx + 1) * 2);
            const entryStr = entryTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            return `
            <div class="radar-hero-card" onclick="window.engine.selectRadarSignal(${idx})">
                <div class="hero-signal-header">
                    <span class="hero-pair" style="font-size: 20px; margin-bottom: 2px;">${s.pair}</span>
                    <span class="hero-timeframe" style="font-size: 9px;">IA SCALPER ${s.timeframe}</span>
                </div>

                <div class="main-action-box ${s.type === 'COMPRA' ? 'call' : 'put'}" style="margin: 10px 0; padding: 12px; border-width: 2px;">
                    <i class="fas fa-arrow-${s.type === 'COMPRA' ? 'up' : 'down'}" style="font-size: 20px;"></i>
                    <span class="action-label" style="font-size: 14px; letter-spacing: 1px;">${s.type}</span>
                </div>

                <p class="entry-badge" style="font-size: 11px; padding: 5px 10px; margin-bottom: 12px; display: inline-block;">ENTRADA: ${entryStr}</p>

                <div class="input-container" style="grid-template-columns: 1fr;">
                    <button class="confirm-btn" style="padding: 15px; font-size: 14px; pointer-events: none;">SELECIONAR SINAL</button>
                </div>

                <div class="confidence" style="text-align: left;">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; margin-bottom: 8px;">
                        <span>CONFIANÇA IA</span>
                        <span>${s.prob}%</span>
                    </div>
                    <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden;">
                        <div style="height: 100%; width: ${s.prob}%; background: var(--accent); box-shadow: 0 0 15px var(--accent-glow);"></div>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }

    selectRadarSignal(idx) {
        const selected = this.radarSignals[idx];
        if (!selected) return;

        this.activeSignal = {
            id: Date.now(),
            pair: selected.pair,
            type: selected.type,
            timeframe: selected.timeframe,
            prob: selected.prob,
            entry: this.calculateEntryTime(selected.timeframe, 2), // Nova entrada em 2 min
            isOTC: selected.pair.includes('OTC')
        };
        
        this.renderPrimary();
        this.playSound('new');
        
        // Sincroniza o gráfico se ele existir
        if (window.marketChart) {
            window.marketChart.changeAsset(selected.pair);
        }
    }

    confirmTrade() {
        if (!this.activeSignal || this.currentTrade) return;

        const amountInput = document.getElementById('trade-amount');
        const amount = parseFloat(amountInput.value);

        if (isNaN(amount) || amount <= 0) {
            alert("Insira um valor válido para a entrada.");
            return;
        }

        if (amount > this.balance) {
            alert("Saldo insuficiente para esta entrada.");
            return;
        }

        // DEDUZ O VALOR DA ENTRADA IMEDIATAMENTE DA CONTA
        this.balance -= amount;

        this.currentTrade = {
            id: this.activeSignal.id,
            amount: amount,
            pair: this.activeSignal.pair
        };

        // DESCE O CARD IMEDIATAMENTE PARA APURAÇÃO
        this.moveToPending(this.activeSignal);
        
        // GERA O PRÓXIMO SINAL PARA O CARD PRINCIPAL
        this.generateSignal();
        
        this.updateBalanceUI();
        this.saveData();

        // Feedback visual de clique
        const btn = document.getElementById('btn-confirm-trade');
        if (btn) {
            btn.innerText = "ORDEM REGISTRADA!";
            btn.style.background = "var(--green)";
            btn.disabled = true;
        }
    }

    updateBalanceUI() {
        const balanceEl = document.getElementById('user-balance');
        const winsEl = document.getElementById('stat-wins');
        const lossesEl = document.getElementById('stat-losses');
        const growthEl = document.getElementById('balance-growth');
        
        if (balanceEl) balanceEl.innerText = `R$ ${this.balance.toFixed(2)}`;
        
        // Agora Vitórias e Derrotas mostram o desempenho do SAAS (Independente de entrar ou não)
        if (winsEl) winsEl.innerText = this.iaStats.wins;
        if (lossesEl) lossesEl.innerText = this.iaStats.losses;

        if (growthEl) {
            const growth = ((this.balance - this.initialBalance) / this.initialBalance) * 100;
            const sign = growth >= 0 ? '+' : '';
            growthEl.innerText = `${sign}${growth.toFixed(2)}%`;
            growthEl.style.color = growth >= 0 ? '#4ade80' : '#ff5252';
            
            // Atualiza ROI no Painel Business se existir
            const roiBusiness = document.getElementById('business-roi');
            if (roiBusiness) roiBusiness.innerText = `${sign}${growth.toFixed(2)}%`;
        }

        this.updateRiskHealth();

        // 1. Cálculo de Crescimento Diário (24h)
        const dailyGrowthEl = document.getElementById('daily-growth');
        if (dailyGrowthEl) {
            const dGrowth = ((this.balance - this.dailyInitialBalance) / this.dailyInitialBalance) * 100;
            const dSign = dGrowth >= 0 ? '+' : '';
            dailyGrowthEl.innerText = `${dSign}${dGrowth.toFixed(2)}%`;
            dailyGrowthEl.style.color = dGrowth >= 0 ? 'var(--green)' : 'var(--red)';
        }

        // 2. Cálculo de Crescimento Total (Desde o início)
        const totalGrowthEl = document.getElementById('total-growth');
        if (totalGrowthEl) {
            const tGrowth = ((this.balance - this.initialBalance) / this.initialBalance) * 100;
            const tSign = tGrowth >= 0 ? '+' : '';
            totalGrowthEl.innerText = `${tSign}${tGrowth.toFixed(2)}%`;
            totalGrowthEl.style.color = tGrowth >= 0 ? 'var(--green)' : 'var(--red)';
        }

        const accuracyEl = document.getElementById('stat-accuracy');
        if (accuracyEl) {
            const iaTotal = this.iaStats.wins + this.iaStats.losses;
            const iaAccuracy = iaTotal > 0 ? (this.iaStats.wins / iaTotal) * 100 : 0;
            accuracyEl.innerText = `${iaAccuracy.toFixed(0)}%`;
            accuracyEl.className = `stat-val ${iaAccuracy >= 70 ? 'win' : 'loss'}`;
        }
    }

    // FUNÇÕES ADM
    injectSignal(pair, type) {
        if (!this.isAdmin) return;
        
        const timeframe = Math.random() > 0.5 ? 'M1' : 'M5';
        const entryTime = this.calculateEntryTime(timeframe, 1);
        
        this.activeSignal = {
            id: Date.now(),
            pair: pair,
            type: type,
            timeframe: timeframe,
            prob: Math.floor(Math.random() * (98 - 94) + 94), // Sinais injetados são sempre alta confiança
            entry: entryTime,
            isOTC: pair.includes('OTC')
        };

        this.renderPrimary();
        this.playSound('new');
        console.log(`Sinal Injetado: ${pair} | ${type}`);
    }

    setGlobalWinRate(rate) {
        this.targetWinRate = rate;
        console.log(`Assertividade Global ajustada para: ${rate}%`);
    }

    getLastHourWinRate() {
        if (this.globalIndications.length === 0) return 100;

        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        
        const lastHourSignals = this.globalIndications.filter(s => s.timestamp > oneHourAgo);
        
        if (lastHourSignals.length === 0) return 100;

        const wins = lastHourSignals.filter(s => s.win).length;
        return (wins / lastHourSignals.length) * 100;
    }

    generateSignal() {
        // DISJUNTOR DE SEGURANÇA: Se performance da última hora < 70%, pausa sinais
        if (this.getLastHourWinRate() < 70) {
            this.activeSignal = null;
            this.renderPrimary();
            return;
        }

        const basePairs = ['EUR/USD', 'GBP/JPY', 'AUD/CAD', 'USD/JPY', 'EUR/GBP'];
        const isOTC = Math.random() > 0.4;
        const selectedPair = basePairs[Math.floor(Math.random() * basePairs.length)] + (isOTC ? ' (OTC)' : '');
        
        const types = ['COMPRA', 'VENDA'];
        const timeframes = ['M1', 'M5'];
        
        const entryTime = this.calculateEntryTime('M5', 5);
        
        this.activeSignal = {
            id: Date.now(),
            pair: selectedPair,
            type: types[Math.floor(Math.random() * types.length)],
            timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
            prob: Math.floor(Math.random() * (98 - 86) + 86),
            entry: entryTime,
            isOTC: isOTC
        };

        // Computa para a IA Global
        this.trackSignal(this.activeSignal);

        // Resetar botão de confirmação para o novo sinal
        const btn = document.getElementById('btn-confirm-trade');
        if (btn) {
            btn.innerText = "Confirmar Entrada";
            btn.style.background = "var(--accent)";
            btn.disabled = false;
        }
        this.currentTrade = null;

        this.renderPrimary();
        this.playSound('new');
    }

    renderPrimary() {
        const container = document.getElementById('main-signal-card');
        const s = this.activeSignal;

        if (!s) {
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px 10px; border: 2px solid var(--red); border-radius: 12px; background: rgba(255,82,82,0.05);">
                        <i class="fas fa-triangle-exclamation" style="font-size: 32px; color: var(--red); margin-bottom: 15px;"></i>
                        <p style="color: white; font-weight: 800; font-size: 14px; margin-bottom: 5px;">MERCADO INSTÁVEL</p>
                        <p style="color: var(--text-dim); font-size: 10px; line-height: 1.4;">
                            A assertividade da última hora está abaixo de 70%.<br>
                            <b>Sinais suspensos para proteção.</b>
                        </p>
                    </div>
                `;
            }
            return;
        }

        // Se houver sinal, reconstrói o card principal para garantir total funcionalidade
        if (container) {
            container.innerHTML = `
                <span id="label-pair" class="hero-pair">${s.pair}</span>
                <span id="info-timeframe" class="hero-timeframe">IA SCALPER ${s.timeframe}</span>

                <div id="direction-action" class="main-action-box ${s.type === 'COMPRA' ? 'call' : 'put'}">
                    <i id="direction-icon" class="fas fa-arrow-${s.type === 'COMPRA' ? 'up' : 'down'} action-icon"></i>
                    <span id="direction-text" class="action-label">${s.type}</span>
                </div>

                <div class="timer-display">
                    <span id="main-timer" class="live-timer">00:00</span>
                    <p id="entry-time-label" class="entry-badge">Aguardando IA...</p>
                </div>

                <div class="input-container">
                    <input type="number" id="trade-amount" value="0.00" class="trade-input">
                    <button id="btn-confirm-trade" class="confirm-btn">Confirmar Entrada</button>
                </div>

                <div class="confidence">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; margin-bottom: 8px;">
                        <span>CONFIANÇA IA</span>
                        <span id="label-prob">${s.prob}%</span>
                    </div>
                    <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden;">
                        <div id="prob-fill" style="height: 100%; width: ${s.prob}%; background: var(--accent); box-shadow: 0 0 15px var(--accent-glow);"></div>
                    </div>
                </div>
            `;
        }

        // Atualiza cabeçalho do Dashboard
        const assetTitle = document.getElementById('current-asset');
        if (assetTitle) assetTitle.innerText = s.pair;

        // Sugestão de Entrada automática (2% do Saldo)
        const suggestedAmount = Math.max(5, (this.balance * 0.02)).toFixed(0);
        const amountInput = document.getElementById('trade-amount');
        if (amountInput) {
            amountInput.value = suggestedAmount;
        }

        const entryLabel = document.getElementById('entry-time-label');
        if (entryLabel) {
            entryLabel.innerText = `PRÓXIMA ENTRADA: ${s.entry.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        }
    }

    tick() {
        const now = Date.now();

        // 1. Processa avaliações pendentes de sinais globais (Fundamental para o Circuit Breaker)
        this.pendingEvaluations = this.pendingEvaluations.filter(evalSig => {
            if (now >= evalSig.resolutionTime) {
                // Simula o resultado baseado na taxa de acerto alvo do SaaS (controlada pelo ADM)
                // Usamos a probabilidade do sinal + o target do ADM para ser realista
                const finalProb = (evalSig.prob + this.targetWinRate) / 2;
                const isWin = (Math.random() * 100) < finalProb;
                
                this.globalIndications.unshift({
                    ...evalSig,
                    win: isWin,
                    timestamp: now
                });

                if (isWin) this.iaStats.wins++; else this.iaStats.losses++;
                
                // Limita histórico global nas últimas 24h
                if (this.globalIndications.length > 200) this.globalIndications.pop();
                
                this.updateBalanceUI();
                this.saveData();
                return false; 
            }
            return true;
        });

        if (!this.activeSignal) return;

        const diff = Math.floor((this.activeSignal.entry.getTime() - now) / 1000);
        const timer = document.getElementById('main-timer');

        if (diff > 0) {
            const m = Math.floor(diff / 60);
            const s = diff % 60;
            if (timer) timer.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            
            if (diff <= 30 && timer) {
                timer.style.color = '#ff5252';
            } else if (timer) {
                timer.style.color = 'white';
            }
        } else {
            // FIM DO TEMPO: Move para apuração manual
            this.moveToPending(this.activeSignal);
            this.generateSignal();
        }
    }

    moveToPending(sig) {
        // Se houve uma entrada confirmada, ela vai para a lista de espera
        const trade = {
            ...sig,
            amount: this.currentTrade ? this.currentTrade.amount : 0,
            confirmed: !!this.currentTrade,
            timestamp: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})
        };
        
        // Mantém apenas o ÚLTIMO sinal terminado para apuração (fica até a próxima troca)
        this.pendingTrades = [trade]; 
        this.currentTrade = null; 
        this.renderPending();
    }

    resolveTrade(id, result) {
        const tradeIdx = this.pendingTrades.findIndex(t => t.id === id);
        if (tradeIdx === -1) return;

        const trade = this.pendingTrades[tradeIdx];
        
        // 1. Resultado para a CONTA (Ajuste baseado na dedução prévia)
        if (trade.confirmed) {
            if (result === 'win') {
                const totalWin = trade.amount + (trade.amount * 0.85); // Devolve o valor + 85% lucro
                this.balance += totalWin;
                this.stats.wins++;
                this.stats.streak++;
                this.playSound('win');
            } else if (result === 'loss') {
                // Não faz nada no saldo (o valor já foi subtraído no confirmTrade)
                this.stats.losses++;
                this.stats.streak = 0;
                this.playSound('loss');
            } else if (result === 'skip') {
                this.balance += trade.amount; // ESTORNO: Devolve o valor pois ele não entrou
            }
        }

        // 2. Resultado para a IA GLOBAL (Contabiliza TUDO que o SaaS passa)
        // Se o usuário clicou 'skip', o SaaS ainda precisa ter um resultado win/loss para a estatística
        let iaResultSucceeded = result === 'win';
        if (result === 'skip') {
            // Se pulou, simula se a IA teria ganho ou perdido conforme a probabilidade
            iaResultSucceeded = Math.random() < (trade.prob / 100);
        }

        if (iaResultSucceeded) {
            this.iaStats.wins++;
        } else {
            this.iaStats.losses++;
        }

        // Move para o histórico definitivo
        this.history.unshift({ 
            ...trade, 
            win: iaResultSucceeded, // O histórico passa a mostrar o resultado da IA
            skipped: result === 'skip',
            h: trade.timestamp 
        });
        
        if (this.history.length > 6) this.history.pop();
        
        // Remove da lista de pendentes
        this.pendingTrades.splice(tradeIdx, 1);
        
        this.updateBalanceUI();
        this.saveData();
        this.renderPending();
        this.renderHistory();
    }

    renderPending() {
        const container = document.getElementById('pending-list');
        if (!container) return;

        if (this.pendingTrades.length === 0) {
            container.innerHTML = '<p style="font-size: 11px; opacity: 0.3; text-align: center; padding: 20px;">Aguardando término da operação atual...</p>';
            return;
        }

        container.innerHTML = this.pendingTrades.map(t => `
            <div class="pending-card animate-slide">
                <div class="p-card-header">
                    <span class="p-pair">${t.pair}</span>
                    <span class="p-badge">${t.type} em ${t.timeframe}</span>
                </div>
                
                <div class="p-card-body">
                    <div class="p-info">
                        <p class="p-label">VALOR DA ENTRADA</p>
                        <p class="p-val">R$ ${t.amount.toFixed(2)}</p>
                    </div>
                    <div class="p-info" style="text-align: right;">
                        <p class="p-label">IA CONFID.</p>
                        <p class="p-val">${t.prob}%</p>
                    </div>
                </div>

                <p style="font-size: 10px; color: var(--text-dim); margin: 15px 0 10px 0; font-weight: 700;">CONCLUIU COM VITÓRIA OU DERROTA?</p>
                
                <div class="p-card-actions">
                    <button onclick="window.engine.resolveTrade(${t.id}, 'win')" class="p-btn win">VITÓRIA (WIN)</button>
                    <button onclick="window.engine.resolveTrade(${t.id}, 'loss')" class="p-btn loss">DERROTA (LOSS)</button>
                    <button onclick="window.engine.resolveTrade(${t.id}, 'skip')" class="p-btn skip">NÃO ENTREI</button>
                </div>
            </div>
        `).join('');
    }

    pushHistory(sig) {
        const isWin = Math.random() > 0.12; // 88% Simulado
        
        // Se houve uma entrada confirmada, calcular resultado financeiro
        if (this.currentTrade) {
            if (isWin) {
                const profit = this.currentTrade.amount * 0.85; // Payout 85%
                this.balance += profit; // Soma apenas o lucro líquido, pois o valor nunca saiu da conta
            } else {
                this.balance -= this.currentTrade.amount; // Perdeu: agora sim, desconta o valor da conta
            }
            this.updateBalanceUI();
        }

        if (isWin) {
            this.stats.wins++;
            this.stats.streak++;
        } else {
            this.stats.losses++;
            this.stats.streak = 0;
        }

        this.currentTrade = null;

        this.history.unshift({ ...sig, win: isWin, h: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) });
        if (this.history.length > 6) this.history.pop();
        
        // Som de resultado
        this.playSound(isWin ? 'win' : 'loss');

        this.saveData();
        this.renderHistory();
    }

    renderHistory() {
        const list = document.getElementById('history-list');
        if (!list) return;

        // Atualiza Quadro de Performance Hoje (SaaS Power - IA Global)
        if (document.getElementById('stat-wins')) {
            document.getElementById('stat-wins').innerText = this.iaStats.wins;
            document.getElementById('stat-losses').innerText = this.iaStats.losses;
        }

        list.innerHTML = this.history.map(item => `
            <div class="history-item">
                <div style="display: flex; flex-direction: column;">
                    <span class="history-asset">${item.pair} (${item.prob}%)</span>
                    <span style="font-size: 10px; opacity: 0.5;">${item.h} | ${item.type}</span>
                </div>
                <span class="history-res ${item.win ? 'win' : 'loss'}">
                    ${item.win ? 'VITÓRIA' : 'DERROTA'}
                </span>
            </div>
        `).join('');
    }

    /* MOTOR DE NOTÍCIAS DINÂMICAS */
    updateNews() {
        const pairs = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];
        const events = [
            'Decisão da Taxa de Juros',
            'Discurso de Autoridade Monetária',
            'Índice de Preços ao Produtor (PPI)',
            'Relatório de Empregos (Payroll)',
            'Índice de Confiança do Consumidor',
            'Vendas no Varejo Mensal',
            'Estoques de Petróleo Bruto',
            'Balança Comercial',
            'IPC (Inflação) Mensal'
        ];

        this.news = [];
        for (let i = 0; i < 6; i++) {
            const pair1 = pairs[Math.floor(Math.random() * pairs.length)];
            const pair2 = pairs.filter(p => p !== pair1)[Math.floor(Math.random() * (pairs.length - 1))];
            const impact = Math.random() > 0.8 ? 'high' : (Math.random() > 0.4 ? 'medium' : 'low');
            
            const now = new Date();
            // Gera horários espalhados nas próximas 4 horas
            const newsTime = new Date(now.getTime() + (i * 40 - 20 + Math.random() * 20) * 60000);

            this.news.push({
                pair: `${pair1}-${pair2}`,
                text: events[Math.floor(Math.random() * events.length)],
                impact: impact,
                time: newsTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            });
        }
        
        // Ordena por horário
        this.news.sort((a, b) => a.time.localeCompare(b.time));
        this.renderNews();
    }

    renderNews() {
        const list = document.getElementById('news-list');
        if (!list) return;
        
        list.innerHTML = this.news.map(n => `
            <div class="news-item">
                <div class="news-impact ${n.impact}"></div>
                <div class="news-info">
                    <p class="news-pair">${n.pair}</p>
                    <p class="news-text">${n.text}</p>
                </div>
                <span class="news-time">${n.time}</span>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.engine = new SignalEngine();
});
