import React from "react";

export default function Inventario({ progresso, setProgresso, voltarAoMapa, irParaEnigma }) {
  
  // Se 'progresso' ou 'pistasColetadas' não existirem, assume um array vazio para não quebrar
  const pistas = progresso?.pistasColetadas || [];

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("indexPista", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = e.dataTransfer.getData("indexPista");
    
    if (sourceIndex === "" || sourceIndex === undefined) return;

    const lista = [...pistas];
    const [reordenado] = lista.splice(Number(sourceIndex), 1);
    lista.splice(targetIndex, 0, reordenado);

    // Salva a nova ordem no estado global do jogo
    setProgresso(prev => ({
      ...prev,
      pistasColetadas: lista
    }));
  };

  // Tag visual baseada no fragmento de código coletado
  const descobrirTipoPista = (pista) => {
    if (!pista) return "LOGIC";
    if (pista.includes("<") || pista.includes(">") || pista === "header") return "HTML5";
    if (pista.includes("{") || pista.includes(":") || pista === "color") return "CSS3";
    return "REACT / JS";
  };

  return (
    <div className="mochila-stage">
      <div className="mochila-hud-box">
        
        {/* Cabeçalho */}
        <div className="mochila-header">
          <div className="mochila-title-block">
            <span className="mochila-icon">🎒</span>
            <h1>Mochila de Componentes</h1>
          </div>
          <p>
            <strong>QUEBRA-CABEÇA DIMENSIONAL:</strong> Arraste e reordene os fragmentos de código abaixo para reconstruir a sequência correta de descriptografia.
          </p>
        </div>

        {/* Grid do Quebra-Cabeça */}
        <div className="mochila-grid-items">
          {pistas.length > 0 ? (
            pistas.map((pista, index) => (
              <div 
                key={index}
                className="mochila-item-card"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                style={{ cursor: "grab" }}
              >
                <div className="item-tag-type">{descobrirTipoPista(pista)}</div>
                <div className="item-fragment-code">{pista}</div>
                <span className="item-status-glow">🧩 BLOCO DE CONEXÃO #{index + 1}</span>
              </div>
            ))
          ) : (
            /* Se a array estiver vazia por erro de fluxo, exibe este aviso em vez de tela preta */
            <div className="mochila-vazia-feedback" style={{ gridColumn: "1 / -1", padding: "40px", color: "var(--primary)", fontFamily: "monospace", textAlign: "center", border: "1px dashed var(--primary)", borderRadius: "8px" }}>
              ⚡ [ ALERTA DE SINAL: NENHUM FRAGMENTO ENCONTRADO NA MEMÓRIA ] <br/>
              <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Certifique-se de que as fases estão salvando os códigos digitados na mochila ao avançar!
              </span>
            </div>
          )}
        </div>

        {/* Rodapé com as funções corretas de navegação */}
        <div className="mochila-footer" style={{ display: "flex", gap: "15px", width: "100%" }}>
          <button type="button" onClick={voltarAoMapa} className="vn-btn vn-btn-secondary">
            ◀ VOLTAR AO TERMINAL
          </button>
          
          {pistas.length > 0 && (
            <button type="button" onClick={irParaEnigma} className="vn-btn vn-btn-accent" style={{ marginLeft: "auto" }}>
              INJETAR SEQUÊNCIA NO NÚCLEO ▶
            </button>
          )}
        </div>

      </div>
    </div>
  );
}