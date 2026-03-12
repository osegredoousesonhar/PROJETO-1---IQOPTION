/**
 * IQ SIGNALS PRO - GRÁFICOS v5 (Garantia Total)
 */

class MarketChart {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.chart = null;
        this.series = null;
        this.lastPrice = 1.0850;
        this.init();
    }

    async init() {
        if (!this.container) return;

        // Se o container ainda não tiver dimensões na DOM, usa valores padrão para não travar
        const w = this.container.clientWidth || document.querySelector('.main-stage').clientWidth || 800;
        const h = this.container.clientHeight || 250;

        const chartOptions = {
            width: w,
            height: h,
            layout: { 
                background: { color: 'transparent' }, 
                textColor: '#94a3b8',
                fontSize: 10
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
            },
            timeScale: { borderColor: 'rgba(255, 255, 255, 0.1)', timeVisible: true },
            rightPriceScale: { borderColor: 'rgba(255, 255, 255, 0.1)' },
            handleScroll: true,
            handleScale: true,
        };

        this.chart = LightweightCharts.createChart(this.container, chartOptions);
        this.series = this.chart.addCandlestickSeries({
            upColor: '#00e676', downColor: '#ff5252', 
            borderVisible: false, wickUpColor: '#00e676', wickDownColor: '#ff5252'
        });

        this.generateData();
        this.startStream();

        // Monitor de Redimensionamento Robusto
        const ro = new ResizeObserver(() => {
            if (this.chart && this.container) {
                this.chart.applyOptions({
                    width: this.container.clientWidth,
                    height: this.container.clientHeight
                });
            }
        });
        ro.observe(this.container);
    }

    generateData() {
        const data = [];
        let t = Math.floor(Date.now() / 1000) - 100 * 60;
        for (let i = 0; i < 100; i++) {
            const open = this.lastPrice;
            const close = open + (Math.random() - 0.5) * 0.0006;
            data.push({ 
                time: t, 
                open, 
                high: Math.max(open, close) + 0.0001, 
                low: Math.min(open, close) - 0.0001, 
                close 
            });
            this.lastPrice = close;
            t += 60;
        }
        this.series.setData(data);
    }

    startStream() {
        setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            const time = now - (now % 60);
            const close = this.lastPrice + (Math.random() - 0.5) * 0.0001;
            this.series.update({
                time: time,
                open: this.lastPrice,
                high: Math.max(this.lastPrice, close) + 0.00005,
                low: Math.min(this.lastPrice, close) - 0.00005,
                close
            });
            this.lastPrice = close;
        }, 1000);
    }

    // Método para trocar de ativo e resetar o gráfico
    changeAsset(newAsset) {
        if (!this.series) return;
        console.log("Mudando gráfico para: " + newAsset);
        this.lastPrice = 1.0000 + (Math.random() * 0.5); // Semente de preço aleatória para o novo ativo
        this.generateData(); // Gera novo histórico
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.marketChart = new MarketChart('main-chart');
});
