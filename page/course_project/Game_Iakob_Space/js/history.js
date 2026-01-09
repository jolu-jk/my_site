document.addEventListener("DOMContentLoaded", () => {
    const historyContainer = document.getElementById("history-container");
    const clearHistoryButton = document.getElementById("clear-history");
    const gridAnswersContainer = document.getElementById("grid-answers-container");

    const username = localStorage.getItem("gameUsername");
    const storageKey = "gameHistory_" + username;

    const gameHistory = JSON.parse(localStorage.getItem(storageKey)) || [];

    const modal = document.getElementById("game-detail-modal");
    const closeBtn = document.querySelector(".close");
    const gameDetailTableBody = document
        .getElementById("game-detail-table")
        .getElementsByTagName("tbody")[0];

    function openModal() {
        modal.style.display = "block";
    }
    function closeModal() {
        modal.style.display = "none";
    }

    closeBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });


    function normalizeListString(s) {
        return (s || "").trim().replace(/,\s*$/, "") || "Не выбраны";
    }

    function arraysEqualAsSets(a, b) {
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        const sa = [...a].map(x => String(x).trim()).sort();
        const sb = [...b].map(x => String(x).trim()).sort();
        if (sa.length !== sb.length) return false;
        for (let i = 0; i < sa.length; i++) {
            if (sa[i] !== sb[i]) return false;
        }
        return true;
    }

    function renderLevel2Details(game) {
        const textCorrectAnswers = (game.correctAnswers || []).filter(x => typeof x === "string");
        const dragCorrectObj = (game.correctAnswers || []).find(x =>
            x && typeof x === "object" && Array.isArray(x.group1) && Array.isArray(x.group2)
        ) || { group1: [], group2: [] };

        const selectedGroup1 = normalizeListString(game.groups?.group1);
        const selectedGroup2 = normalizeListString(game.groups?.group2);

        const correctGroup1 = (dragCorrectObj.group1 || []).join(", ") || "—";
        const correctGroup2 = (dragCorrectObj.group2 || []).join(", ") || "—";

        (game.questionsList || []).forEach((qText, qIndex) => {
            const row = gameDetailTableBody.insertRow();
            row.insertCell(0).textContent = qText;

            if (qIndex === 0) {
                // Drag & Drop
                row.insertCell(1).textContent = `${selectedGroup1} | ${selectedGroup2}`;
                row.insertCell(2).textContent = `${correctGroup1} | ${correctGroup2}`;
            } else {
                // Text-вопросы
                const textIndex = qIndex - 1;
                const userAnswer = (game.answers || [])[textIndex] ?? "Нет выбранного ответа";
                const correctAnswer = textCorrectAnswers[textIndex] ?? "Нет правильного ответа";

                row.insertCell(1).textContent = userAnswer;
                row.insertCell(2).textContent = correctAnswer;
            }
        });
    }

    function renderLevel1Details(game) {
        (game.questions || []).forEach((q) => {
            const row = gameDetailTableBody.insertRow();
            row.insertCell(0).textContent = q.question || "—";

            if (Array.isArray(q.selectedAnswers)) {
                const selected = q.selectedAnswers;
                const correct = q.correctAnswers || [];

                const selectedText = selected.length ? selected.join(", ") : "Нет выбранных ответов";
                const correctText = correct.length ? correct.join(", ") : (q.correctAnswer || "—");

                row.insertCell(1).textContent = selectedText;
                row.insertCell(2).textContent = correctText;

                const ok = arraysEqualAsSets(selected, correct);
                row.classList.add(ok ? "correct" : "incorrect");
                return;
            }

            // обычный choice
            const selectedAnswer = q.selectedAnswer ?? "Нет выбранного ответа";
            const correctAnswer = q.correctAnswer ?? "Нет правильного ответа";

            row.insertCell(1).textContent = selectedAnswer;
            row.insertCell(2).textContent = correctAnswer;

            const ok = String(selectedAnswer).trim() === String(correctAnswer).trim();
            row.classList.add(ok ? "correct" : "incorrect");
        });
    }

    if (!historyContainer) return;

    if (gameHistory.length === 0) {
        clearHistoryButton.style.display = "none";
        historyContainer.innerHTML = `<div class="game-record"><p>История пуста.</p></div>`;
        return;
    }

    gameHistory.forEach((game, index) => {
        const gameElement = document.createElement("div");
        gameElement.classList.add("game-record");

        gameElement.innerHTML = `
            <h3>Игра ${index + 1}</h3>
            <p><strong>Баллы:</strong> ${game.score ?? 0}</p>
            <p><strong>Пройденный уровень:</strong> ${game.level ?? "—"}</p>
            <p><strong>Оставшееся время:</strong> ${game.timeLeft ?? 0} секунд</p>
        `;

        gameElement.addEventListener("click", () => {
            gameDetailTableBody.innerHTML = "";
            if (gridAnswersContainer) gridAnswersContainer.innerHTML = "";

            if (game.level === 2) {
                renderLevel2Details(game);
            } else if (game.level === 1) {
                renderLevel1Details(game);
            } else if (game.level === 3) {
                gameDetailTableBody.innerHTML =
                    '<tr><td colspan="3">Это сложный уровень, нельзя подсматривать ответы!</td></tr>';
            } else {
                gameDetailTableBody.innerHTML =
                    '<tr><td colspan="3">Нет данных по этой записи.</td></tr>';
            }

            openModal();
        });

        historyContainer.appendChild(gameElement);
    });

    clearHistoryButton.style.display = "inline-block";

    clearHistoryButton.addEventListener("click", () => {
        historyContainer.classList.add("delete-animation");

        setTimeout(() => {
            localStorage.removeItem(storageKey);
            clearHistoryButton.style.display = "none";
            historyContainer.innerHTML = "";
            if (gridAnswersContainer) gridAnswersContainer.innerHTML = "";
            gameDetailTableBody.innerHTML = "";
            closeModal();
        }, 1000);
    });
});
