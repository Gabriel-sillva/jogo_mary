import React, { useState } from "react";

export default function EnigmaFinal({ progresso, voltarAoInventario, onSucesso }) {
  const [tentativa, setTentativa] = useState("");
  const [erro, setErro] = useState(false);

  // Palavra chave ou código gerado pela união correta das pistas
  const CODIGO_CORRETO = "ordem"; 

  const validarCod = (e) => {
    e.preventDefault();
    if (tentativa.toLowerCase().trim() === CODIGO_CORRETO) {
      onSucesso();
    } else {
      setErro(true);
      setTimeout(() => setErro(false), 2000);
    }
  };

  return (
    <div className="game-screen final-enigma">
      <header className="game-header">
        <button className="btn-hud" onClick={voltarAoInventario}>⬅️ Ver Pistas</button>
        <h2>☣️ TERMINAL CRÍTICO</h2>
      </header>

      <div className="cyber-card container-center">
        <h3>INSIRA A CHAVE DO ENIGMA</h3>
        <p>Ordene seus fragmentos no inventário para descobrir o segredo final.</p>
        
        <form onSubmit={validarCod} className="terminal-form">
          <input 
            type="text" 
            className={`cyber-input terminal-input ${erro ? "shake-error" : ""}`}
            placeholder="DIGITE A PALAVRA-CHAVE..." 
            value={tentativa}
            onChange={e => setTentativa(e.target.value)}
          />
          {erro && <p className="error-text">❌ CÓDIGO INCORRETO. ACESSO NEGADO.</p>}
          <button type="submit" className="btn btn-primary">Executar Override</button>
        </form>
      </div>
    </div>
  );
}