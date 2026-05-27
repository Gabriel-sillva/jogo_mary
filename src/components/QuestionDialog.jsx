import { useEffect, useState, useId, useRef } from "react";

export default function QuestionDialog({
    questoes,
    index,
    total,
    onClose,
    onCorrect,
}) {
    const titleId = useId();
    const closeBtn = useRef(null);
    const prevFocus = useRef(null);

    const [resposta, setResposta] = useState("");
    const [feedback, setFeedback] = useState({ type: "info", msg: "" });
    const [isCorrect, setIsCorrect] = useState(false);

    const normalize = (s) =>
        (s ?? "")
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[.,;:!?()\"'´^~]/g, "")
            .trim()
            .toLowerCase(); // Corrigido typo aqui

    const handleSubmit = (event) => {
        event.preventDefault();

        const user = normalize(resposta);
        const ok = (questoes.resposta || []).some(
            (resp) => normalize(resp) === user
        );

        if (ok) {
            setIsCorrect(true);
            setFeedback({ type: "success", msg: "Resposta correta! Próxima liberada." });
        } else {
            setIsCorrect(false);
            setFeedback({ type: "error", msg: "Não foi dessa vez. Tente novamente!" });
        }
    };

    useEffect(() => {
        prevFocus.current = document.activeElement;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeBtn.current?.focus();

        const onkey = (ev) => { if (ev.key === "Escape") onClose(); };
        window.addEventListener("keydown", onkey);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onkey);
            if (prevFocus.current instanceof HTMLElement) prevFocus.current.focus();
        };
    }, [onClose]);

    return (
        <div
            id={`dialog-${questoes.id}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="dialog"
        >
            <header className="dialog-header">
                <h2 id={titleId} className="dialog-title">
                    {questoes.titulo}
                </h2>
                <p className="dialog-subtitle"> Pergunta {index + 1} de {total}</p>
                <button
                    ref={closeBtn}
                    type="button"
                    className="dialog-close"
                    aria-label={`Fechar pergunta: ${questoes.titulo}`}
                    onClick={onClose}
                >
                    X
                </button>
            </header>

            <section className="dialog-content" tabIndex={-1}>
                <div className="dialog-card">
                    <p className="question-prompt">{questoes.prompt}</p>
                    
                    <form className="question-form" onSubmit={handleSubmit}>
                        <label className="question-label" htmlFor="resposta">
                            Sua resposta:
                        </label>
                        <input
                            id="resposta"
                            className="question-input"
                            type="text"
                            autoComplete="off"
                            aria-describedby="feedback"
                            aria-invalid={feedback.type === "error" ? "true" : "false"}
                            value={resposta}
                            onChange={(e) => setResposta(e.target.value)} // Corrigido de onChance
                            disabled={isCorrect}
                            placeholder="Escreva sua resposta aqui"
                        />
                        
                        <div
                            className={`question-feedback question-feedback--${feedback.type}`}
                            id="feedback"
                            aria-live="polite"
                        >
                            {feedback.msg}
                        </div>

                        {!isCorrect ? (
                            <div className="question-actions" style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    Confirmar
                                </button>
                                <button className="btn" type="button" onClick={onClose} style={{ background: '#333', color: '#fff' }}>
                                    Voltar
                                </button>
                            </div>
                        ) : (
                            <div className="question-actions">
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', background: 'var(--success)', color: 'var(--bg)' }}
                                    type="button"
                                    onClick={() => {
                                        onCorrect(questoes.id);
                                        onClose();
                                    }}
                                >
                                    Avançar
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </div>
    );
}