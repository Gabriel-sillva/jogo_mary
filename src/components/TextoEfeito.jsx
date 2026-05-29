import React, { useState, useEffect, useRef } from "react";

export default function TextoEfeito({ texto, velocidade = 20, onTerminouDigitacao, forcarTextoCompleto }) {
  const [textoExibido, setTextoExibido] = useState("");
  const timerRef = useRef(null);
  const indexRef = useRef(0);

  // Limpa o timer ativo com segurança
  const limparTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    // Se o pai ordenou forçar o texto completo, exibe tudo e mata o timer
    if (forcarTextoCompleto) {
      limparTimer();
      setTextoExibido(texto);
      if (onTerminouDigitacao) onTerminouDigitacao();
      return;
    }

    // Inicializa nova animação de digitação
    limparTimer();
    indexRef.current = 0;
    setTextoExibido("");

    timerRef.current = setInterval(() => {
      if (indexRef.current < texto.length) {
        setTextoExibido((prev) => prev + texto.charAt(indexRef.current));
        indexRef.current += 1;
      } else {
        limparTimer();
        if (onTerminouDigitacao) onTerminouDigitacao();
      }
    }, velocidade);

    return () => limparTimer();
  }, [texto, velocidade, forcarTextoCompleto]);

  return <p className="vn-text-display">{textoExibido}</p>;
}