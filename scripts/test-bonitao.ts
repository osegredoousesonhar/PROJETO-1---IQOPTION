import { SignalEngine } from "../src/lib/engine/signals";
import { MarketSimulator } from "../src/lib/engine/market";

async function testBonitao() {
    console.log("🚀 Iniciando Teste do Motor Bonitão...");
    
    const asset = "EUR/USD";
    const history = MarketSimulator.getHistory(asset, 300);
    
    console.log(`📊 Analisando histórico de ${history.length} velas para ${asset}...`);
    
    // Simular 2000 iterações para encontrar sinais que passem nas 18 regras
    let signalFound = false;
    for (let i = 0; i < 2000; i++) {
        MarketSimulator.tick(asset);
        const currentHistory = MarketSimulator.getHistory(asset);
        const signal = SignalEngine.analyze(asset, currentHistory, "5m");
        
        if (signal) {
            console.log("\n✅ SINAL DETECTADO!");
            console.log(`ID: ${signal.id}`);
            console.log(`Tipo: ${signal.type}`);
            console.log(`Estratégia: ${signal.strategy}`);
            console.log(`Score (Probabilidade): ${signal.probability}`);
            console.log(`Confluências: \n - ${signal.confluences.join("\n - ")}`);
            signalFound = true;
            break;
        }
    }
    
    if (!signalFound) {
        console.log("\n⚠️ Nenhum sinal de alta convicção (score > 75) encontrado no histórico simulado.");
    }
    
    console.log("\n🏁 Teste Concluído.");
}

testBonitao().catch(console.error);
