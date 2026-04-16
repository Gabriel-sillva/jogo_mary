import ButtonQuestion from "./ButtonQuestion";

export default function IconGrid({questoes, onOpen, modalOpen, trancada, resolvidas}) {

    return(
        <section
        className="icon-grid-container"
        aria-hidden={modalOpen || undefined}
        inert={modalOpen? "" : undefined} >
            <ul className="icon-grid">
                {questoes.map((q, idx) => {
                    const bloqueada = idx > trancada
                    const solu = resolvidas.has(q.id);

                    return(
                        <ButtonQuestion
                            key={q.id}
                            questoes={q}
                            onOpen={onOpen}
                            bloqueada={bloqueada}
                            solu={solu}
                        />
                    )
                })}
            </ul>
        </section>
    )
}