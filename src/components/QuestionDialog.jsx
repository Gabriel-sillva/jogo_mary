import { useEffect, useState, useId, useRef } from "react";

export default function QuestionDialog({
    questoes,
    index,
    total,
    onClose,
    onCorrect,
}) {

    const titleId = useId();

    const dialogRef = useRef(null);
    const closeBtn = useRef(null);
    const prevFocus = useRef(null);

    const [resposta, setResposta] = useState("");
    const [feedback, setFeedback] = useState({ type: "info", msg: "" })
    const [isCorrect, setIsCorrect] = useState(false);

    const normalize = (s) =>
        (s ?? "")
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[.,;:!?()\"'´^~]/g, "")
            .trim()
            .toLoweCase();
}