/**
 * IQ SIGNALS PRO - GRÁFICOS v5.1
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
        if (!this.container || typeof LightweightCharts === 'undefined') {
            setTimeout(() => this.init(), 500);
            return;
        }

        let w = this.container.clientWidth || 600;
        let h = this.container.clientHeight || 300;
        
        console.log("Iniciando Gráfico Tradicional:", w, h);

        this.chart = LightweightCharts.createChart(this.container, {
            width: w,
            height: h,
            layout: { background: { type: 'solid', color: '#05060a' }, textColor: '#94a3b8' },
            grid: { vertLines: { visible: false }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
            timeScale: { visible: true, timeVisible: true }
        });

        this.series = this.chart.addCandlestickSeries({
            upColor: '#00e676', downColor: '#ff5252',
            borderVisible: false, wickUpColor: '#00e676', wickDownColor: '#ff5252',
        });

        this.generateData();
        setInterval(() => this.updateChart(), 1000);

        new ResizeObserver(() => {
            if (this.chart) this.chart.applyOptions({ width: this.container.clientWidth, height: this.container.clientHeight });
        }).observe(this.container);
    }

    generateData() {
        const data = [];
        let t = Math.floor(Date.now() / 1000) - 100 * 60;
        for (let i = 0; i < 100; i++) {
            const open = this.lastPrice;
            const close = open + (Math.random() - 0.5) * 0.0010;
            data.push({ time: t, open, high: Math.max(open, close) + 0.0005, low: Math.min(open, close) - 0.0005, close });
            this.lastPrice = close;
            t += 60;
        }
        this.series.setData(data);
    }

    updateChart() {
        if (!this.series) return;
        const now = Math.floor(Date.now() / 1000);
        const time = now - (now % 60);
        const close = this.lastPrice + (Math.random() - 0.5) * 0.0002;
        this.series.update({
            time: time,
            open: this.lastPrice,
            high: Math.max(this.lastPrice, close) + 0.0001,
            low: Math.min(this.lastPrice, close) - 0.0001,
            close: close
        });
        this.lastPrice = close;
    }

    changeAsset(asset) {
        console.log("Gráfico para:", asset);
        this.lastPrice = 1.000 + Math.random();
        if (this.series) this.generateData();
    }
}

document.addEventListener('DOMContentLoaded', () => { window.marketChart = new MarketChart('main-chart'); });
