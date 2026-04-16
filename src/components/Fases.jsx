import { useMemo, useState } from "react"
import QUESTOES from "../../public/data/perguntas.json"
import "./fases.css"


export default function Fases() {
    const [selecionado, setSelecionado] = useState(null);
    const [trancado, setTrancado] = useState(0);
    const [resolvido, setResolvido] = useState(() => new Set())

    const total = QUESTOES.length

    const handleOpen = (q) => selecionado(q);
    const handleClose = () => selecionado(null);

    const handleCorrect = (id) => {
        setResolvido((prev) => {
            const next = new Set (prev);
            next.add(id);
            return next
        });

        const idx = QUESTOES.findIndex((q) =>
        q.id === id )

        if (idx > -1 && idx < QUESTOES.length -1) {
            setTrancado((prev) => Math.max(prev, idx + 1))
        }
    }

    const progresso = useMemo(() => {
        const perguntasResolvidas = resolvido.size;

        const porcentagem = Math.round(( perguntasResolvidas/total ) *100)
    
        return{
            resolvido: perguntasResolvidas,
            total: total,
            porcentagem: porcentagem
        }
    }, [resolvido, total])

    return(
        <main className="questoes">
            <header className="q-header">
                <h1 className="q-title">Hexatombe</h1>
                <p className="q-subtitle">Toque no icone para abrir a pergunta</p>

                <div className="progress">
                    <div
                        className="progress-bar"
                        role = "progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progresso.porcentagem}
                        aria-label={`Progresso: ${progresso.resolvido} de ${progresso.total} resolvidas`}
                        style={{width: `${progresso.porcentagem}%`}}/>
                    
                    <span className="progress-label">
                        {progresso.resolvido} / {progresso.total}
                    </span>
                </div>
            </header>
            <IconGrid
                questoes = {QUESTOES}
                onOpen = {handleOpen}
                modalOpen = {Boolean(selecionada)}
                trancada = {trancada}
                resolvidas = {resolvidas}
            />
        </main>
    )
}