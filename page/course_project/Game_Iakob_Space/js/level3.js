document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById("game-area");
    const timeLeftElement = document.getElementById("time-left");
    const scoreValueElement = document.getElementById("score-value");
    const retryButton = document.getElementById("retry");

    let timeLeft = 60;  
    let score = 0;
    let answeredQuestions = 0;  
    let currentQuestionIndex = 0;  
    let timerInterval;
    let gameData = {
        score: 0,
        level: 3,
        timeLeft: timeLeft,
        timeSpent: 0,
        answers: [],      
        selectedAnswers: [], 
        correctAnswers: [],
        questions: [],
    };

 const questions = [
    {
        type: "fill-in-the-blanks",
        text: "______ — космический объект с хвостом",
        blanks: 6,
        letters: ["К", "О", "А", "Е", "Т", "М", "Л"],
        correctLetters: ["К", "О", "М", "Е", "Т", "А"],
    },
    {
        type: "fill-in-the-blanks",
        text: "____ вращается вокруг Земли",
        blanks: 4,
        letters: ["Л", "А", "Н", "У", "С", "Т", "Р", "О"],
        correctLetters: ["Л", "У", "Н", "А"],
    },
    {
        type: "select-words",
        text: "Выберите слова, связанные с космосом.",
        blanks: 0,
        letters: [],
        correctLetters: ["ЗВЕЗДА", "ПЛАНЕТА", "ОРБИТА"],
        words: ["ЗВЕЗДА", "ПЛАНЕТА", "ОРБИТА", "ЛЕС", "РЕКА"]
    },
    {
        type: "select-words",
        text: "Выберите слова, связанные с Луной.",
        blanks: 0,
        letters: [],
        correctLetters: ["СПУТНИК", "КРАТЕР", "ФАЗА"],
        words: ["СПУТНИК", "КРАТЕР", "ФАЗА", "МОРЕ", "ВЕТЕР"]
    },
    {
        type: "select-words",
        text: "Выберите слова, связанные с космическими полётами.",
        blanks: 0,
        letters: [],
        correctLetters: ["РАКЕТА", "ОРБИТА", "КОСМОНАВТ"],
        words: ["РАКЕТА", "ОРБИТА", "КОСМОНАВТ", "ПОЕЗД", "ДОРОГА"]
    },
];



    function shuffleQuestions() {
        questions.sort(() => Math.random() - 0.5);
    }

    shuffleQuestions();

   function displayQuestion() {
    const question = questions[currentQuestionIndex];


    gameData.questions.push(question.text); 
    gameData.correctAnswers.push(question.correctLetters); 
    if (question.type === "select-words") {  
        gameArea.innerHTML = `
        <div id="hint" class="hint" style="display: inline-block;">  <span style="font-weight: bold; color: #FF6347;">Подсказка:</span> Нажмите на все правильные ответы.</div>
            <p>${question.text}</p>
            <div id="words-container" class="words-container"></div>
            <div id="instructions">
                <p>Нажмите на правильные слова!</p>
            </div>
        `;
        startFlyingWords(question.words);
    } else if (question.type === "fill-in-the-blanks") {
        let questionText = question.text.split("").map(char => {
            if (char === "_") {
                return `<div class="blank" onclick="insertLetter(event)"></div>`;
            } else {
                return `<span>${char}</span>`;
            }
        }).join("");

        gameArea.innerHTML = `
             <div id="hint" class="hint" style="display: inline-block;">  <span style="font-weight: bold; color: #FF6347;">Подсказка:</span> С помощью двойного клика выберите букву</div>
            <div class="question">${questionText}</div>
            <div class="letters">
                ${question.letters.map(letter => `<div class="letter" ondblclick="insertLetter(event, '${letter}')">${letter}</div>`).join('')}
            </div>
        `;
    }
}


    function startFlyingWords(words) {
        const wordsContainer = document.getElementById("words-container");

        words.forEach(word => {
            const wordElement = document.createElement("div");
            wordElement.classList.add("word");
            wordElement.textContent = word;
            wordElement.style.position = "absolute";

            const container = document.getElementById("words-container");
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;

            const randomTop = Math.random() * containerHeight;
            const randomLeft = Math.random() * containerWidth;

            wordElement.style.top = `${randomTop}px`;
            wordElement.style.left = `${randomLeft}px`;
            wordElement.style.transition = "top 2s, left 2s";
        
            wordElement.addEventListener("click", () => checkWordAnswer(wordElement, word));

            wordsContainer.appendChild(wordElement);
        });

        setInterval(() => {
            const wordElements = document.querySelectorAll(".word");

            wordElements.forEach(wordElement => {
                const container = document.getElementById("words-container");
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;

                const randomTop = Math.random() * containerHeight;
                const randomLeft = Math.random() * containerWidth;

                wordElement.style.top = `${randomTop}px`;
                wordElement.style.left = `${randomLeft}px`;
            });
        }, 3000);  
    }

    function checkWordAnswer(wordElement, word) {
        const question = questions[currentQuestionIndex];
    
        if (question.correctLetters.includes(word)) {
            wordElement.classList.add("correct");
            wordElement.classList.remove("incorrect");
            score += 5;
            timeLeft += 10;
            gameData.selectedAnswers.push(word); 
        } else {
            wordElement.classList.add("incorrect");
            wordElement.classList.remove("correct");
            score -= 15;
            timeLeft -= 15;
        }
    
        scoreValueElement.textContent = score;
        checkAllWordsSelected(); 
    }
    
    

    function checkAllWordsSelected() {
        const correctWordsSelected = Array.from(document.querySelectorAll(".word"))
            .filter(wordElement => wordElement.classList.contains("correct"));

        if (correctWordsSelected.length === questions[currentQuestionIndex].correctLetters.length) {
            answeredQuestions++;
            currentQuestionIndex++;

            if (currentQuestionIndex < questions.length) {
                setTimeout(displayQuestion, 1000);
            } else {
                setTimeout(endGame, 1000);
            }
        }
    }

    window.insertLetter = function (event, letter = null) {
        if (letter) {
            const blanks = document.querySelectorAll(".blank");
            for (let i = 0; i < blanks.length; i++) {
                if (!blanks[i].textContent) {
                    blanks[i].textContent = letter;
                    blanks[i].setAttribute("data-letter", letter);
                    checkAnswer(blanks[i]);
                    break;
                }
            }
        } else if (event.target.classList.contains("blank") && !event.target.textContent) {
            const letter = document.querySelector(".letter"); 
            event.target.textContent = letter.textContent;
            event.target.setAttribute("data-letter", letter.textContent);
            checkAnswer(event.target);
        }
    };

    function checkAnswer(blank) {
        const question = questions[currentQuestionIndex];
        const index = Array.from(document.querySelectorAll(".blank")).indexOf(blank);
        const insertedLetter = blank.textContent;
        const correctLetter = question.correctLetters[index];

        if (insertedLetter === correctLetter) {
            blank.classList.add("correct");
        } else {
            blank.classList.add("incorrect");
            score -= 10;
            timeLeft -= 15;
            scoreValueElement.textContent = score;
            timeLeftElement.textContent = timeLeft;

            setTimeout(() => {
                blank.textContent = "";
                blank.classList.remove("incorrect");
            }, 500);
        }

        const allBlanks = document.querySelectorAll(".blank");
        const filledBlanks = Array.from(allBlanks).filter(blank => blank.textContent !== "");

        if (filledBlanks.length === allBlanks.length) {
            score += 5;
            timeLeft += 10;
            scoreValueElement.textContent = score;
            timeLeftElement.textContent = timeLeft;

            gameData.answers.push(Array.from(allBlanks).map(blank => blank.textContent));
            gameData.correctAnswers.push(question.correctLetters);
            gameData.questions.push(question.text);

            answeredQuestions++;
            currentQuestionIndex++;

            if (answeredQuestions < questions.length) {
                setTimeout(displayQuestion, 1000);
            } else {
                setTimeout(endGame, 1000);
            }
        }
    }

    function startTimer() {
        const startTime = Date.now();
        timerInterval = setInterval(() => {
            timeLeft -= 2;
            timeLeftElement.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame(startTime);
            }
        }, 500);
    }

    function endGame(startTime) {
        clearInterval(timerInterval);
        gameData.score = score;
        gameData.timeLeft = timeLeft;
        gameData.timeSpent = Math.round((Date.now() - startTime) / 1000);
    
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory_' + localStorage.getItem('gameUsername'))) || [];
        gameHistory.push(gameData);
        localStorage.setItem('gameHistory_' + localStorage.getItem('gameUsername'), JSON.stringify(gameHistory));
    
        const username = localStorage.getItem('gameUsername');
        if (username) {
            updateUserRanking(username, score, gameData.timeLeft);
        }
    
        if (score >= 5 && timeLeft > 0) {
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [false, false, false];
            completedLevels[2] = true;
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
    
            gameArea.innerHTML = `<p>Поздравляем! Игра завершена.</p>`;
        } else {
            gameArea.innerHTML = `<p>Уровень не пройден. Попробуйте снова!</p>`;
            retryButton.style.display = 'inline-block';
        }
    }
    
    function updateUserRanking(username, score, timeSpent) {
        const userRanking = JSON.parse(localStorage.getItem('userRanking')) || [];

        userRanking.push({
            username: username,
            score: score,
            timeSpent: timeSpent
        });

        userRanking.sort((a, b) => b.score - a.score || a.timeSpent - b.timeSpent);

        localStorage.setItem('userRanking', JSON.stringify(userRanking));
    }

    retryButton.addEventListener('click', () => {
        location.reload();
    });

    displayQuestion();
    startTimer();
});
