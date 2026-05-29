import React, { useState } from "react";

export default function QuestionDialog({ questao, onClose, onResponderSucesso }) {
  const [respostaUser, setRespostaUser] = useState("");
  const [status, setStatus] = useState("inicial"); // 'inicial', 'sucesso', 'erro'
  const [falaAtual, setFalaAtual] = useState(questao.falaInicial);

  if (!questao) return null;

  // Descobrir qual sprite exibir baseado no status da resposta
  let spriteExibido = questao.sprite;
  if (status === "sucesso") spriteExibido = questao.spriteSucesso;
  if (status === "erro") spriteExibido = questao.spriteErro;

  const handleValidarResposta = (e) => {
    e.preventDefault();

    // Limpa espaços e transforma em maiúsculas para comparar sem erro de digitação
    const respostaFormatada = respostaUser.trim().toUpperCase();
    
    // Verifica se o que o utilizador digitou existe dentro do array de respostas do teu JSON
    const acertou = questao.resposta.some(
      (resp) => resp.trim().toUpperCase() === respostaFormatada
    );

    if (acertou) {
      setStatus("sucesso");
      setFalaAtual(`Caramba, você é gênio! Conseguimos fechar a fenda! Pegue isto, vai te ajudar no enigma final: a pista completa é "${questao.pistaCompleta}".`);
    } else {
      setStatus("erro");
      setFalaAtual("Ih, deu ruim... Esse código não funcionou e a estabilização falhou. Tenta analisar com calma e tenta outra vez, sei que consegues!");
    }
  };

  const handleConcluir = () => {
    if (status === "sucesso") {
      // Passa para o App.jsx que esta questão foi resolvida para libertar a recompensa/pista
      onResponderSucesso(questao.id, questao.pistaCompleta);
    }
    onClose();
  };

  return (
    <div className="quiz-overlay">
      {/* Classe dinâmica injetada para mudar a cor da borda dependendo do acerto/erro */}
      <div className={`quiz-modal ${status === "sucesso" ? "sucesso" : status === "erro" ? "erro" : ""}`}>
        
        {/* Cabeçalho da Missão */}
        <div className="quiz-header">
          <h3 className="quiz-title">⚠️ {questao.titulo}</h3>
        </div>

        {/* Zona do Personagem estilo Visual Novel */}
        <div className="quiz-character-section">
          <img 
            src={`/${spriteExibido}`} 
            alt={questao.personagem} 
            className="quiz-character-sprite"
            onError={(e) => {
              e.target.src = "https://img.icons8.com/isometric/50/spider.png";
            }}
          />
          <div className="quiz-dialogue-box">
            <h4 className="quiz-character-name">{questao.personagem}</h4>
            <p className="quiz-character-speech">"{falaAtual}"</p>
          </div>
        </div>

        {/* Formulário de Resposta */}
        {status !== "sucesso" && (
          <form onSubmit={handleValidarResposta} className="quiz-modal" style={{ padding: 0, border: "none", boxShadow: "none" }}>
            <div className="quiz-prompt-box">
              <p className="quiz-prompt-text"><strong>DESAFIO:</strong> {questao.prompt}</p>
            </div>
            
            <input 
              type="text" 
              className="quiz-input"
              placeholder="Digita a tua resposta aqui..."
              value={respostaUser}
              onChange={(e) => setRespostaUser(e.target.value)}
              disabled={status === "sucesso"}
              autoFocus
            />

            <button type="submit" className="btn-quiz-submit">
              📡 ENVIAR CÓDIGO DE CORREÇÃO
            </button>
          </form>
        )}

        {/* Mensagens de Feedback */}
        {status === "sucesso" && (
          <div className="quiz-feedback feedback-sucesso">
            🎉 FENDA INTERCEPTADA COM SUCESSO!
          </div>
        )}
        
        {status === "erro" && (
          <div className="quiz-feedback feedback-erro">
            ❌ CÓDIGO INCORRETO. DETETADA REJEIÇÃO NA MATRIZ!
          </div>
        )}

        {/* Botão de Ação de Fecho */}
        {status === "sucesso" ? (
          <button onClick={handleConcluir} className="btn-quiz-submit">
            💾 COLETAR PISTA E CONTINUAR
          </button>
        ) : (
          <button onClick={onClose} className="btn-quiz-close">
            DESISTIR POR AGORA
          </button>
        )}

      </div>
    </div>
  );
}