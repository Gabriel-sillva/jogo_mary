import React, { useState, useEffect } from "react";
import QuestionDialog from "./components/QuestionDialog";
import Inventario from "./components/Inventario";
import GameMap from "./components/GameMap";
import "./styles/game.css";

export default function App() {
  // 1. ESTADO DE NAVEGAÇÃO (Telas obrigatórias pelo PDF: "abertura", "mapa", "inventario", "terminal", "vitoria") [cite: 91, 92, 98, 99, 101, 102]
  const [telaAtual, setTelaAtual] = useState("abertura");

  // 2. ESTADO GLOBAL DO PROGRESSO (Cumpre o critério de salvamento automático sem perda de dados) [cite: 40, 41]
  const [progresso, setProgresso] = useState(() => {
    const salvo = localStorage.getItem("spider_verse_progress");
    if (salvo) return JSON.parse(salvo);
    return {
      quizesResolvidos: [],       // IDs dos quizes já respondidos [cite: 47]
      pistasColetadas: [],        // Array de objetos com as pistas do inventário [cite: 45]
      pontosDesbloqueados: ["q1"], // Controle da Névoa de Guerra / Modo Sequencial sem GPS [cite: 21, 37, 46]
      ordemInventario: ["q1", "q2", "q3"] // Guarda a posição exata das peças no Drag and Drop [cite: 48]
    };
  });

  // 3. ESTADO DA ANOMALIA SELECIONADA NO MAPA (Para abrir a Tela do Quiz / Visual Novel) [cite: 100]
  const [questaoAtiva, setQuestaoAtiva] = useState(null);

  // 4. BANCO DE DADOS DE PERGUNTAS 
  const [bancoQuestoes, setBancoQuestoes] = useState([]);

  // Sincroniza e grava no LocalStorage automaticamente a cada alteração [cite: 44, 58]
  useEffect(() => {
    localStorage.setItem("spider_verse_progress", JSON.stringify(progresso));
  }, [progresso]);

  // Busca os pontos do Caça-Tesouro (Nome, Lat/Lng, Pergunta, Recompensas) [cite: 64, 65, 66, 69, 70]
  useEffect(() => {
    fetch("/data/perguntas.json")
      .then((res) => res.json())
      .then((data) => setBancoQuestoes(data))
      .catch((err) => console.error("Erro ao carregar fendas dimensionais:", err));
  }, []);

  // Lógica de reset em conformidade com o fluxo de segurança da SeaWeb [cite: 7]
  const resetarJogo = () => {
    if (window.confirm("Cuidado! Isto vai colapsar a linha do tempo e resetar o teu progresso. Continuar?")) {
      const reset = { quizesResolvidos: [], pistasColetadas: [], pontosDesbloqueados: ["q1"], ordemInventario: ["q1", "q2", "q3"] };
      setProgresso(reset);
      setTelaAtual("abertura");
    }
  };

  return (
    <div className="app-container">
      
      {/* TELA 1: ABERTURA (MENU INICIAL / TUTORIAL) [cite: 73, 92] */}
      {telaAtual === "abertura" && (
        <div className="game-screen tela-abertura animated fadeIn">
          <div className="cyber-card">
            <h1 className="game-title">SPIDER-VERSE</h1>
            <h3 style={{ color: "#fff", marginBottom: "2rem" }}>
              CRISIS: <span className="highlight">WEB COLLAPSE</span>
            </h3>
            <p style={{ lineHeight: "1.6", marginBottom: "2rem" }}>
              <strong>Desafio SeaWeb Inovação:</strong> Uma anomalia temporal está a corromper o código semântico da internet[cite: 3, 7, 8]. 
              Viaje pelas coordenadas do SENAI "Roberto Mange", encontre os heróis guardiões e use as suas habilidades 
              de Front-End para recalibrar as fendas[cite: 4, 10, 25]!
            </p>
            <button 
              className="btn btn-primary btn-block btn-pulse"
              onClick={() => setTelaAtual("mapa")}
            >
              INICIAR MISSÃO 🕷️
            </button>
          </div>
        </div>
      )}

      {/* TELA 2: O MAPA MÁGICO INTERATIVO [cite: 18, 98] */}
      {telaAtual === "mapa" && (
        <div className="game-screen">
          <header className="game-header">
            <span className="character-name-tag" style={{ position: "static", transform: "none" }}>
              ARANHA-LOG: {progresso.quizesResolvidos.length}/3
            </span>
            <button className="btn-hud" onClick={() => setTelaAtual("inventario")}>
              🎒 Mochila ({progresso.pistasColetadas.length})
            </button>
          </header>

          <main className="map-wrapper">
            <GameMap 
              progresso={progresso}
              bancoQuestoes={bancoQuestoes}
              setQuestaoAtiva={setQuestaoAtiva}
            />
          </main>
        </div>
      )}

      {/* TELA 3: INVENTÁRIO (DRAG AND DROP COM SUPORTE A ORDENAÇÃO) [cite: 22, 53, 54, 99] */}
      {telaAtual === "inventario" && (
        <Inventario
          progresso={progresso}
          setProgresso={setProgresso}
          voltarAoMapa={() => setTelaAtual("mapa")}
          irParaEnigma={() => setTelaAtual("terminal")}
        />
      )}

      {/* TELA 4: TERMINAL (ENIGMA FINAL DE RESOLUÇÃO) [cite: 15, 80, 101] */}
      {telaAtual === "terminal" && (
        <div className="game-screen" style={{ padding: "2rem", alignItems: "center", justifyContent: "center" }}>
          <div className="cyber-modal" style={{ width: "100%", maxWidth: "500px" }}>
            <h2 className="highlight" style={{ textAlign: "center" }}>🖥️ TERMINAL DE SEGURANÇA</h2>
            <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
              Junte os fragmentos de código coletados nos slots da sua mochila na ordem correta para descriptografar a palavra-chave[cite: 23, 54].
            </p>
            
            <div style={{ background: "#000", padding: "1rem", color: "var(--success)", margin: "1rem 0", borderRadius: "4px", textAlign: "center" }}>
              <strong>CÓDIGO ESTRUTURADO NO INVENTÁRIO:</strong>
              <div style={{ display: "flex", gap: "5px", justifyContent: "center", marginTop: "10px" }}>
                {progresso.pistasColetadas.length === 0 ? (
                  <span style={{ color: "var(--primary)" }}>Nenhuma pista coletada ainda[cite: 107].</span>
                ) : (
                  progresso.pistasColetadas.map((p, i) => (
                    <span key={i} style={{ border: "1px solid var(--success)", padding: "2px 8px", fontSize: "1.1rem" }}>
                      {p.texto}
                    </span>
                  ))
                )}
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const senha = e.target.senhaFinal.value.toUpperCase().trim();
              
              // Validação do enigma final combinando as pistas do Caça-Tesouro [cite: 9, 80]
              if (senha === "INTERNET") {
                setTelaAtual("vitoria");
              } else {
                alert("🚨 CÓDIGO INCORRETO! A fenda rejeitou a chave de criptografia.");
                e.target.reset();
              }
            }}>
              <input 
                name="senhaFinal" 
                type="text" 
                className="cyber-input" 
                placeholder="DIGITE A PALAVRA-CHAVE RECONSTITUÍDA" 
                required 
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" className="btn-hud" style={{ width: "50%" }} onClick={() => setTelaAtual("inventario")}>🎒 Ver Mochila</button>
                <button type="submit" className="btn btn-primary" style={{ width: "50%" }}>INJECT_KEY</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TELA 5: CONCLUSÃO DA AVENTURA (VITÓRIA) [cite: 102] */}
      {telaAtual === "vitoria" && (
        <div className="game-screen tela-abertura">
          <div className="cyber-card" style={{ borderColor: "var(--success)", boxShadow: "0 0 30px rgba(0, 245, 212, 0.4)" }}>
            <h1 className="highlight">MISSÃO CUMPRIDA!</h1>
            <p style={{ fontSize: "1.2rem", margin: "1.5rem 0" }}>
              🕸️ Excelente trabalho! Você reordenou os fragmentos do banco de dados e estabilizou o Aranhaverso usando o protocolo da <strong>INTERNET</strong>.
            </p>
            <p style={{ color: "#aaa", fontSize: "0.9rem" }}>
              Desafio Somativa Front-End concluído com sucesso no espaço de testes do SENAI Roberto Mange[cite: 3, 4, 10].
            </p>
            <button className="btn btn-primary btn-block" style={{ marginTop: "2rem" }} onClick={resetarJogo}>
              Jogar Novamente 🔄
            </button>
          </div>
        </div>
      )}

      {/* INTERFACE DO QUIZ DOS GUARDIÕES (VISUAL NOVEL MODE) [cite: 25, 77, 100] */}
      {questaoAtiva && (
        <QuestionDialog
          questoes={questaoAtiva}
          onClose={() => setQuestaoAtiva(null)}
          progresso={progresso}
          setProgresso={setProgresso}
        />
      )}

    </div>
  );
}