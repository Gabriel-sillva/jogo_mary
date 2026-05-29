import React from "react";

export default function Inventario({ progresso, setProgresso, voltarAoMapa, irParaEnigma }) {
  
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("indexPista", index);
  };

  const handleDrop = (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData("indexPista");
    const listaAtualizada = [...progresso.pistasColetadas];
    const [reordenado] = listaAtualizada.splice(sourceIndex, 1);
    listaAtualizada.splice(targetIndex, 0, reordenado);

    setProgresso(prev => ({ ...prev, pistasColetadas: listaAtualizada }));
  };

  const moverTeclado = (index, direcao) => {
    const targetIndex = index + direcao;
    if (targetIndex < 0 || targetIndex >= progresso.pistasColetadas.length) return;
    const listaAtualizada = [...progresso.pistasColetadas];
    const [reordenado] = listaAtualizada.splice(index, 1);
    listaAtualizada.splice(targetIndex, 0, reordenado);
    setProgresso(prev => ({ ...prev, pistasColetadas: listaAtualizada }));
  };

  return (
    <div className="game-screen inventory-screen">
      <header className="game-header">
        <button className="btn-hud" onClick={voltarAoMapa}>⬅️ Voltar ao Mapa</button>
        <h2>🎒 INVENTÁRIO DE PISTAS</h2>
      </header>

      <main className="inventory-container">
        <p className="instruction">Arraste e solte ou use as setas para ordenar os fragmentos do código:</p>
        
        {progresso.pistasColetadas.length === 0 ? (
          <p className="empty-state">Nenhuma pista encontrada nos pontos de geolocalização ainda.</p>
        ) : (
          <div className="pistas-grid">
            {progresso.pistasColetadas.map((pista, idx) => (
              <div 
                key={pista.id}
                className={`pista-card slot-${pista.status}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, idx)}
                aria-label={`Pista ${pista.id}, Conteúdo: ${pista.texto}. Use as setas para mover.`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowLeft") moverTeclado(idx, -1);
                  if (e.key === "ArrowDown" || e.key === "ArrowRight") moverTeclado(idx, 1);
                }}
              >
                <div className="pista-badge">{pista.status.toUpperCase()}</div>
                <p className="pista-text">"{pista.texto}"</p>
                <div className="keyboard-actions-hint">↔️ Mover com as setas</div>
              </div>
            ))}
          </div>
        )}

        {progresso.quizesResolvidos.length === 3 && (
          <button className="btn btn-accent btn-pulse" onClick={irParaEnigma}>🔓 Decifrar Enigma Final</button>
        )}
      </main>
    </div>
  );
}