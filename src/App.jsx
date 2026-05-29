import React, { useState, useEffect } from "react";
import VisualNovelStage from "./components/VisualNovelStage";
import Inventario from "./components/Inventario";
import "./game.css";

export default function App() {
  const [telaAtual, setTelaAtual] = useState("abertura"); 
  const [bancoQuestoes, setBancoQuestoes] = useState([]);
  const [faseAtiva, setFaseAtiva] = useState(null);
  
  const [mostrarSettings, setMostrarSettings] = useState(false);
  const [mostrarCredits, setMostrarCredits] = useState(false);

  const [progresso, setProgresso] = useState(() => {
    const salvo = localStorage.getItem("spider_vn_progress");
    return salvo ? JSON.parse(salvo) : { quizesResolvidos: [], pistasColetadas: [] };
  });

  useEffect(() => {
    localStorage.setItem("spider_vn_progress", JSON.stringify(progresso));
  }, [progresso]);

  useEffect(() => {
    fetch("/data/perguntas.json")
      .then(res => res.json())
      .then(data => setBancoQuestoes(data))
      .catch(err => console.error("Erro ao carregar banco de fendas:", err));
  }, []);

  const handleConcluirFase = (idQuestao, textoPista) => {
    if (!progresso.quizesResolvidos.includes(idQuestao)) {
      setProgresso(prev => ({
        quizesResolvidos: [...prev.quizesResolvidos, idQuestao],
        pistasColetadas: [...prev.pistasColetadas, { id: idQuestao, texto: textoPista }]
      }));
    }
    setTelaAtual("seletor");
  };

  const carregarJogoSalvo = () => {
    const salvo = localStorage.getItem("spider_vn_progress");
    if (salvo && JSON.parse(salvo).quizesResolvidos.length > 0) {
      setTelaAtual("seletor");
    } else {
      alert("Nenhum registro de fenda encontrado! Inicie um Novo Jogo.");
    }
  };

  return (
    <div>
      
      {/* TELA 1: MENU PRINCIPAL TRIPLE-A */}
      {telaAtual === "abertura" && (
        <div className="main-menu-stage">
          <div className="menu-side-box">
            <div>
              <h1 className="menu-game-title">SPIDER-VERSE</h1>
              <p className="menu-game-subtitle">Crisis: Web Collapse</p>
              <p className="menu-game-desc">
                Anomalias críticas de código estão a corromper a estrutura semântica da rede corporativa do SENAI Roberto Mange. 
                Conecte-se aos guardiões da rede, decifre os enigmas e recalibre as fendas temporais.
              </p>
            </div>

            <ul className="menu-vertical-list">
              <li>
                <button onClick={() => {
                  setProgresso({ quizesResolvidos: [], pistasColetadas: [] });
                  setTelaAtual("seletor");
                }} className="menu-list-link">New Game</button>
              </li>
              <li>
                <button onClick={carregarJogoSalvo} className="menu-list-link">Load Game</button>
              </li>
              <li>
                <button onClick={() => setMostrarSettings(true)} className="menu-list-link">Settings</button>
              </li>
              <li>
                <button onClick={() => setMostrarCredits(true)} className="menu-list-link">Credits</button>
              </li>
            </ul>
          </div>

          {/* POPUP: SETTINGS */}
          {mostrarSettings && (
            <div className="modal-overlay-fullscreen">
              <div className="modal-side-card">
                <h3 className="vn-challenge-text">⚙️ CONFIGURAÇÕES</h3>
                <p className="modal-text-row"><strong>DISPLAY:</strong> Fullscreen (100vw)</p>
                <p className="modal-text-row"><strong>AUDIO ENGINE:</strong> Master Vol (100%)</p>
                <p className="modal-text-row"><strong>NÓ DE REDE:</strong> SENAI Roberto Mange</p>
                <button onClick={() => setMostrarSettings(false)} className="vn-btn vn-btn-primary btn-block">SALVAR E FECHAR</button>
              </div>
            </div>
          )}

          {/* POPUP: CREDITS */}
          {mostrarCredits && (
            <div className="modal-overlay-fullscreen">
              <div className="modal-side-card">
                <h3 className="vn-challenge-text">🎬 CRÉDITOS</h3>
                <p className="modal-text-row"><strong>Desenvolvimento:</strong> Squad Front-End Dev</p>
                <p className="modal-text-row"><strong>Framework:</strong> React JS + Vite Core</p>
                <p className="modal-text-primary">Desafio SeaWeb Inovação &copy; 2026</p>
                <button onClick={() => setMostrarCredits(false)} className="vn-btn vn-btn-secondary btn-block">VOLTAR</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TELA 2: SELETOR DE CAPÍTULOS */}
      {telaAtual === "seletor" && (
        <div className="menu-fullscreen">
          <div className="seletor-layout-box">
            <div className="seletor-header-row">
              <h2>SISTEMA DE CAPÍTULOS ({progresso.quizesResolvidos.length}/3)</h2>
              <div>
                <button onClick={() => setTelaAtual("inventario")} className="vn-btn vn-btn-accent">🎒 MOCHILA ({progresso.pistasColetadas.length})</button>
                <button onClick={() => setTelaAtual("abertura")} className="vn-btn vn-btn-secondary">SAIR</button>
              </div>
            </div>

            <div className="fases-grid">
              {bancoQuestoes.map((fase) => {
                const concluido = progresso.quizesResolvidos.includes(fase.id);
                return (
                  <div key={fase.id} className="fase-card-select" onClick={() => { setFaseAtiva(fase); setTelaAtual("jogando"); }}>
                    <span className="vn-challenge-text">{fase.nomeLocal}</span>
                    <h3>{fase.titulo}</h3>
                    <div className="card-footer-flex">
                      <span>Agente: {fase.personagem}</span>
                      {concluido ? <span className="text-success">✅ CONCLUÍDO</span> : <span className="vn-challenge-text">⚡ ATIVAR</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {progresso.quizesResolvidos.length === 3 && (
              <div className="terminal-action-group">
                <button onClick={() => setTelaAtual("terminal")} className="vn-btn vn-btn-primary giant-btn">
                  🔓 ACESSAR NÚCLEO DO TERMINAL OVERRIDE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

        {/* TELA 3: INTERFACE DA VISUAL NOVEL */}
        {telaAtual === "jogando" && faseAtiva && (
          <VisualNovelStage 
            fase={faseAtiva} 
            onVoltar={() => setTelaAtual("seletor")} 
            onFaseConcluida={handleConcluirFase} // <--- Verifique se está exatamente "handleConcluirFase" aqui!
          />
        )}

      {/* TELA 4: INVENTÁRIO */}
      {telaAtual === "inventario" && (
        <Inventario 
          progresso={progresso} 
          setProgresso={setProgresso} 
          voltarAoMapa={() => setTelaAtual("seletor")} 
          irParaEnigma={() => setTelaAtual("terminal")} 
        />
      )}

      {/* TELA 5: TERMINAL DE DESCRIPTOGRAFIA FINAL */}
      {telaAtual === "terminal" && (
        <div className="menu-fullscreen">
          <div className="menu-card">
            <h2 className="vn-challenge-text">🖥 `TERMINAL CORE OVERRIDE`</h2>
            <p className="modal-text-row">Combine os fragmentos de código obtidos nas fendas para gerar o bypass do Aranhaverso.</p>
            
            <div className="buffer-box-terminal">
              <strong>BUFFER COMPILADO:</strong> {progresso.pistasColetadas.map(p => p.texto).join("")}
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const seq = progresso.pistasColetadas.map(p => p.texto).join("").toUpperCase();
              const entrada = e.target.chaveFinal.value.trim().toUpperCase();

              if (entrada === "INTERNET" && seq === "INTERNET") {
                setTelaAtual("vitoria");
              } else {
                alert("🚨 FIRMWARE CORROMPIDO: Certifique-se de coletar todos os 3 blocos de dados na ordem correta!");
              }
            }} className="terminal-action-group">
              <input name="chaveFinal" type="text" className="vn-input" placeholder="DIGITE A PALAVRA-CHAVE RECONSTITUÍDA..." required />
              <div className="seletor-header-row btn-block">
                <button type="button" onClick={() => setTelaAtual("inventario")} className="vn-btn vn-btn-secondary flex-fill">Abrir Mochila</button>
                <button type="submit" className="vn-btn vn-btn-accent flex-fill">COMPILAR EXP-BYPASS</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TELA 6: TELA DE VITÓRIA DO DESAFIO */}
      {telaAtual === "vitoria" && (
        <div className="menu-fullscreen absolute-black">
          <div className="menu-card border-accent-glow">
            <h1 className="vn-challenge-text victory-font-size">SISTEMA INTEGRADO</h1>
            <p className="modal-text-row">Excepcional! O código semântico da rede corporativa do SENAI Roberto Mange foi totalmente restaurado!</p>
            <button onClick={() => {
              setProgresso({ quizesResolvidos: [], pistasColetadas: [] });
              setTelaAtual("abertura");
            }} className="vn-btn vn-btn-accent">Resetar e Ir ao Menu</button>
          </div>
        </div>
      )}

    </div>
  );

        // Exemplo de como salvar a pista quando o jogador clica em "AVANÇAR" ou "INJETAR" com sucesso:
      const salvarPistaColetada = (novaPista) => {
        setProgresso(prev => {
          // Evita duplicar a mesma pista se o jogador jogar a mesma fase de novo
          if (prev.pistasColetadas.includes(novaPista)) return prev;
          
          return {
            ...prev,
            pistasColetadas: [...prev.pistasColetadas, novaPista]
          };
        });
      };

}