import React, { useState, useEffect } from "react";

export default function QuestionDialog({ questao, onClose, onResponderSucesso }) {
  if (!questao) return null;

  const [respostaUser, setRespostaUser] = useState("");
  const [status, setStatus] = useState("inicial"); 
  const [falaAtual, setFalaAtual] = useState("");

  useEffect(() => {
    setFalaAtual(questao.falaInicial);
    setStatus("inicial");
    setRespostaUser("");
  }, [questao]);

  const handleValidar = (e) => {
    e.preventDefault();
    if (!respostaUser.trim()) return;

    const formatada = respostaUser.trim().toUpperCase();
    const respostasValidas = Array.isArray(questao.resposta) ? questao.resposta : [questao.resposta];
    const acertou = respostasValidas.some(r => r.toString().trim().toUpperCase() === formatada);

    if (acertou) {
      setStatus("sucesso");
      setFalaAtual(`Incrível! Código corrigido. Pegue este fragmento para o terminal: "${questao.pistaCompleta}"`);
    } else {
      setStatus("erro");
      setFalaAtual("Eita... a fenda rejeitou esse comando. Dê uma olhada na sintaxe e tente de novo!");
    }
  };

  const handleColetar = () => {
    onResponderSucesso(questao.id, questao.pistaCompleta);
    onClose();
  };

  return (
    <div className="vn-overlay">
      <div className="cyber-modal">
        <h3 className="highlight" style={{ textAlign: "center", marginTop: 0 }}>⚡ {questao.titulo.toUpperCase()} ⚡</h3>
        
        {/* CORPO DO DIÁLOGO REESTRUTURADO COM FOTO */}
        <div className="vn-body">
          {questao.sprite && (
            <div className="vn-avatar-container">
              <img 
                src={questao.sprite} 
                alt={questao.personagem} 
                className="vn-avatar" 
                onError={(e) => {
                  // Fallback caso a imagem suma ou quebre
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="vn-content">
            <p className="vn-speaker" style={{ margin: "0 0 5px 0" }}>{questao.personagem}:</p>
            <p className="vn-text">"{falaAtual}"</p>
          </div>
        </div>

        {status === "inicial" && (
          <form onSubmit={handleValidar} className="cyber-form">
            <p className="vn-prompt"><strong>DESAFIO:</strong> {questao.prompt}</p>
            <input 
              type="text"
              className="cyber-input"
              placeholder="Digite sua resposta..."
              value={respostaUser}
              onChange={e => setRespostaUser(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-accent">INJETAR</button>
          </form>
        )}

        <div className="btn-row">
          {status === "erro" && (
            <button onClick={() => { setStatus("inicial"); setFalaAtual(questao.falaInicial); }} className="btn btn-primary flex-1">🔄 TENTAR NOVAMENTE</button>
          )}
          {status === "sucesso" && (
            <button onClick={handleColetar} className="btn btn-accent flex-1">💾 GUARDAR NA MOCHILA</button>
          )}
          {status !== "sucesso" && (
            <button type="button" onClick={onClose} className="btn btn-secondary">SAIR</button>
          )}
        </div>
      </div>
    </div>
  );
}