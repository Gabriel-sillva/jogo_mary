import React, { useState } from "react";
import TextoEfeito from "./TextoEfeito";

export default function VisualNovelStage({ fase, onVoltar, onFaseConcluida }) {
  const [resposta, setResposta] = useState("");
  const [mostrarSucesso, setMostrarSucesso] = useState(false); 

  const nomeDoPersonagem = fase.personagem || "Guardião";
  const falaAgente = fase.falaInicial || "";
  const perguntaDesafio = fase.prompt || "";
  const pistaLiberada = fase.pistaCompleta || "";

  const enviarResposta = (e) => {
    e.preventDefault();
    
    const respostasValidas = Array.isArray(fase.resposta) 
      ? fase.resposta.map(r => r.trim().toUpperCase())
      : [String(fase.resposta).trim().toUpperCase()];

    const respostaFormatada = resposta.trim().toUpperCase();

    if (respostasValidas.includes(respostaFormatada)) {
      // Ativa o sucesso interno e NÃO sai da tela ainda!
      setMostrarSucesso(true);
    } else {
      alert("🚨 FALHA NA INJEÇÃO: Sintaxe incorreta ou tag inválida para esta fenda!");
    }
  };

  // Esta função será chamada apenas quando o jogador clicar no botão verde de Avançar
  const lidarComAvanco = () => {
    if (onFaseConcluida) {
      onFaseConcluida(fase.id, pistaLiberada);
    }
    setMostrarSucesso(false);
    setResposta("");
  };

  const urlFundo = fase.background || "/background/fase1.jpg";

  return (
    <div className="vn-container" style={{ backgroundImage: `url(${urlFundo})` }}>
      
      {/* PALCO DO SPRITE */}
      <div className="vn-sprite-stage">
        <img 
          src={fase.sprite} 
          alt={nomeDoPersonagem} 
          className="vn-character-image" 
        />
      </div>

      {/* INTERFACE DO RODAPÉ */}
      <div className="vn-dialog-interface">
        <div className="vn-nametag">{nomeDoPersonagem}</div>
        
        <div className="vn-dialog-box">
          
          {mostrarSucesso ? (
            /* SE ACERTOU: Mostra a mensagem de sucesso e o botão de avançar internos */
            <div className="vn-success-inside-box">
              <div className="vn-success-message">
                <span className="success-pulse-icon">⚡</span>
                <p><strong>CÓDIGO INJETADO COM SUCESSO!</strong> Fenda dimensional estabilizada.</p>
              </div>
              <button 
                type="button"
                className="vn-btn vn-btn-accent" 
                onClick={lidarComAvanco}
              >
                AVANÇAR ▶
              </button>
            </div>
          ) : (
            /* SE NÃO ACERTOU INDA: Mostra o fluxo padrão de pergunta e input */
            <>
              <div className="vn-text-content-side">
                <p className="vn-main-speech">"{falaAgente}"</p>
                <p className="vn-challenge-prompt">
                  [{perguntaDesafio}] <span className="terminal-arrow">➡️</span>
                </p>
              </div>

              <div className="vn-interaction-zone">
                <form onSubmit={enviarResposta} className="vn-form-inline">
                  <input 
                    type="text" 
                    className="vn-input" 
                    placeholder="Insira a instrução de código..." 
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                    required 
                    autoFocus
                  />
                  <button type="submit" className="vn-btn vn-btn-accent">INJETAR</button>
                  <button type="button" onClick={onVoltar} className="vn-btn vn-btn-secondary">SAIR</button>
                </form>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}