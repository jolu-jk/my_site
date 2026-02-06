document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById("game-area");
    const nextLevelButton = document.getElementById("next-level");
    const timeLeftElement = document.getElementById("time-left");
    const scoreValueElement = document.getElementById("score-value");
    const retryButton = document.getElementById("retry");

    let timeLeft = 60;
    let score = 0;
    let answeredQuestions = 0;
    let currentQuestionIndex = 0;
    let timerInterval;

    let gameData = {
        questions: [],
        score: 0,
        timeLeft: timeLeft,
        level: 2,
        timeSpent: 0,
        answers: [],
        correctAnswers: [],
        groups: {
            group1: "",
            group2: ""
        },
        questionsList: []
    };

    const usedObjects = [];

    let allQuestions = [
        {
            type: "drag-and-drop",
            question: "Распредели объекты по их назначению в космосе",
            options: ["Солнце", "Луна", "Спутник", "Телескоп"],
            correctAnswer: {
                group1: ["Солнце", "Луна"],
                group2: ["Спутник", "Телескоп"]
            },
            headers: {
                group1: "Небесные тела",
                group2: "Косм. аппараты"
            }
        },
        { type: "text", question: "Как называется крупная космическая система, состоящие из миллиардов звёзд?", correctAnswer: "Галактика" },
        { type: "text", question: "Как называется путь, по которому планета движется вокруг звезды?", correctAnswer: "Орбита" },
        { type: "text", question: "Как называется аппарат для наблюдения за далёкими космическими объектами?", correctAnswer: "Телескоп" }
    ];

 
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Новая функция для чередования типов
function prepareAlternatingQuestions() {
    
    const dragType = allQuestions.filter(q => q.type === "drag-and-drop");
    const textType = allQuestions.filter(q => q.type === "text");
    shuffle(dragType);
    shuffle(textType);

    const sortedList = [];
    const maxLen = Math.max(dragType.length, textType.length);

    for (let i = 0; i < maxLen; i++) {
        if (i < dragType.length) sortedList.push(dragType[i]);
        if (i < textType.length) sortedList.push(textType[i]);
    }

    allQuestions = sortedList;
}

    function startTimer() {
    const startTime = Date.now();
    let timeDecayRate = 600;

    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(startTime, true);
        }

        timeDecayRate -= 100;
    }, timeDecayRate);
}


    function displayQuestion() {
        if (timeLeft <= 0) return;

        const question = allQuestions[currentQuestionIndex];
        gameData.questionsList.push(question.question);

        if (question.type === "drag-and-drop") {
            gameArea.innerHTML = `
                <div id="hint" class="hint" style="display: inline-block;">
                    <span style="font-weight: bold; color: #FF6347;">Подсказка:</span> Перетащите космические объекты в соответствующие группы.
                </div>
                <div class="question">${question.question}</div>
                <div class="group-container">
                    <div class="group" id="group1">
                        <h3>${question.headers.group1}</h3>
                        <div class="drop-area" id="drop-group1"></div>
                    </div>
                    <div class="group" id="group2">
                        <h3>${question.headers.group2}</h3>
                        <div class="drop-area" id="drop-group2"></div>
                    </div>
                </div>
                <div class="options" id="options"></div>
            `;

            const optionsContainer = document.getElementById("options");

            question.options.forEach((item) => {
                const option = document.createElement("div");
                option.classList.add("option");
                option.setAttribute("draggable", "true");
                option.textContent = item;
                option.addEventListener("dragstart", dragStart);
                optionsContainer.appendChild(option);
            });

            const dropGroup1 = document.getElementById("drop-group1");
            const dropGroup2 = document.getElementById("drop-group2");

            dropGroup1.addEventListener("dragover", dragOver);
            dropGroup2.addEventListener("dragover", dragOver);

            dropGroup1.addEventListener("drop", dropObject.bind(null, "group1"));
            dropGroup2.addEventListener("drop", dropObject.bind(null, "group2"));
        } else if (question.type === "text") {
            gameArea.innerHTML = `
                <div id="hint" class="hint" style="display: inline-block;">
                    <span style="font-weight: bold; color: #FF6347;">Подсказка:</span> Введите ответ и нажмите ENTER.
                </div>
                <div class="question">${question.question}</div>
                <input type="text" id="text-answer" class="answer-input" placeholder="Введите ответ">
                <div id="correct-answer" class="correct-answer" style="display: none;">
                    Правильный ответ: ${question.correctAnswer}
                </div>
            `;

            const input = document.getElementById("text-answer");
            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    checkTextAnswer();
                }
            });
        }
    }

    function checkTextAnswer() {
        const input = document.getElementById("text-answer");
        const userAnswer = input.value.trim();
        const question = allQuestions[currentQuestionIndex];
        const correctAnswer = question.correctAnswer;

        gameData.answers.push(userAnswer);
        gameData.correctAnswers.push(correctAnswer);

        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            score += 5;
            input.style.backgroundColor = "#94ca95";
        } else {
            score -= 10;
            timeLeft -= 15;
            input.style.backgroundColor = "#da7272";
        }

        scoreValueElement.textContent = score;

        answeredQuestions++;
        currentQuestionIndex++;

        if (answeredQuestions < allQuestions.length && timeLeft > 0) {
            setTimeout(displayQuestion, 1000);
        } else {
            setTimeout(() => endGame(Date.now()), 1000);
        }
    }

    function dragStart(event) {
        event.dataTransfer.setData("text", event.target.textContent);
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function dropObject(group, event) {
        const spaceObject = event.dataTransfer.getData("text");

        if (usedObjects.includes(spaceObject)) {
            return;
        }

        const dropArea = event.target;

        const question = allQuestions[currentQuestionIndex];
        const correctGroup = question.correctAnswer[group];

        const placedObject = document.createElement("div");
        placedObject.textContent = spaceObject;
        placedObject.classList.add("dropped-object");

        const isCorrect = correctGroup.includes(spaceObject);

        if (isCorrect) {
            placedObject.classList.add("correct");
            score += 5;
        } else {
            placedObject.classList.add("incorrect");
            score -= 5;
            timeLeft -= 10;
        }

        dropArea.appendChild(placedObject);

        usedObjects.push(spaceObject);

        const optionsContainer = document.getElementById("options");
        const optionToRemove = [...optionsContainer.children].find(option => option.textContent === spaceObject);
        if (optionToRemove) {
            optionsContainer.removeChild(optionToRemove);
        }

        scoreValueElement.textContent = score;

        if (group === "group1") {
            gameData.groups.group1 += spaceObject + ", ";
        } else {
            gameData.groups.group2 += spaceObject + ", ";
        }

        checkAnswer();
    }

    function checkAnswer() {
        const question = allQuestions[currentQuestionIndex];

        const group1Container = document.getElementById("drop-group1");
        const group2Container = document.getElementById("drop-group2");

        const placedGroup1 = [...group1Container.children].map(child => child.textContent);
        const placedGroup2 = [...group2Container.children].map(child => child.textContent);

        if (placedGroup1.length === question.correctAnswer.group1.length &&
            placedGroup2.length === question.correctAnswer.group2.length) {

            score += 10;
            scoreValueElement.textContent = score;

            gameData.correctAnswers.push({
                group1: question.correctAnswer.group1,
                group2: question.correctAnswer.group2
            });

            answeredQuestions++;
            currentQuestionIndex++;

            if (answeredQuestions < allQuestions.length && timeLeft > 0) {
                setTimeout(displayQuestion, 1000);
            } else {
                setTimeout(() => endGame(Date.now()), 1000);
            }
        }
    }

    function endGame(startTime, gameOver = false) {
        clearInterval(timerInterval);

        gameData.score = score;
        gameData.timeLeft = timeLeft;
        gameData.timeSpent = Math.round((Date.now() - startTime) / 1000);

        const username = localStorage.getItem("gameUsername");
        const gameHistory = JSON.parse(localStorage.getItem("gameHistory_" + username)) || [];
        gameHistory.push(gameData);
        localStorage.setItem("gameHistory_" + username, JSON.stringify(gameHistory));

        if (username) {
            updateUserRanking(username, score, gameData.timeSpent);
        }

        if (gameOver || score < 5 || timeLeft <= 0) {
            gameArea.innerHTML = `<p>Игра завершена. Ваш результат: ${score} баллов.</p>`;
            retryButton.style.display = "inline-block";
            nextLevelButton.style.display = "none";
        } else {
            const completedLevels = JSON.parse(localStorage.getItem("completedLevels")) || [false, false];
            completedLevels[1] = true;
            localStorage.setItem("completedLevels", JSON.stringify(completedLevels));

            gameArea.innerHTML = `<p>Поздравляем! Вы успешно прошли уровень 2!</p>`;
            nextLevelButton.style.display = "inline-block";
            retryButton.style.display = "none";
        }
    }

    function updateUserRanking(username, score, timeSpent) {
        const userRanking = JSON.parse(localStorage.getItem("userRanking")) || [];

        userRanking.push({ username, score, timeSpent });
        userRanking.sort((a, b) => b.score - a.score || a.timeSpent - b.timeSpent);

        localStorage.setItem("userRanking", JSON.stringify(userRanking));
    }

    retryButton.addEventListener("click", () => location.reload());
    nextLevelButton.addEventListener("click", () => window.location.href = "level3.html");

    prepareAlternatingQuestions(); 
    displayQuestion();
    startTimer();
});
