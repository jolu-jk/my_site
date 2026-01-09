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
    let correctGridSelections = 0;
    let gameData = { 
        questions: [],
        score: 0,
        timeLeft: timeLeft,
        level: 1, 
        timeSpent: 0, 
    };


    const allQuestions = [
        { type: "choice", question: "Какая планета находится ближе всего к Солнцу?", items: ["Меркурий", "Венера", "Земля", "Марс"], correctAnswer: "Меркурий" },
        { type: "choice", question: "Какая планета известна как Красная планета?", items: ["Юпитер", "Марс", "Венера", "Сатурн"], correctAnswer: "Марс" },
        { type: "choice", question: "Какое небесное тело является спутником Земли?", items: ["Марс", "Луна", "Солнце", "Венера"], correctAnswer: "Луна" },
        { type: "choice", question: "Какая планета является самой большой в Солнечной системе?", items: ["Земля", "Марс", "Юпитер", "Сатурн"], correctAnswer: "Юпитер" },
        { type: "grid", question: "Найдите все планеты земной группы", grid: ["Меркурий", "Венера", "Земля", "Марс", "Юпитер", "Сатурн", "Уран", "Нептун"], correctAnswers: ["Меркурий", "Венера", "Земля", "Марс"] },
        { type: "grid", question: "Найдите все газовые гиганты", grid: ["Земля", "Юпитер", "Марс", "Сатурн", "Меркурий", "Уран", "Нептун", "Венера"], correctAnswers: ["Юпитер", "Сатурн", "Уран", "Нептун"] },  
        { type: "grid", question: "Найдите все объекты, являющиеся звёздами", grid: ["Солнце", "Земля", "Луна", "Сириус", "Марс", "Полярная звезда", "Венера", "Альфа Центавра"], correctAnswers: ["Солнце", "Сириус", "Полярная звезда", "Альфа Центавра"] }
    ];


    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function getRandomQuestions() {
        return shuffle(allQuestions).slice(0, 3);
    }

  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(startTime);
        }
    }, 1000);
}

    function displayQuestion() {
        const question = questions[currentQuestionIndex];
        const hintElement = document.getElementById("hint");  
        hintElement.style.display = 'none';  
    
        if (question.type === "choice") {
            gameArea.innerHTML = ` 
              <div id="hint" class="hint" style="display: inline-block;"> <span style="font-weight: bold; color: #FF6347;">Подсказка:</span> Нажмите на один правильный ответ.</div>
                <div class="question">${question.question}</div>
              
                <div class="answers">
                    ${question.items.map(item => ` 
                        <div class="game-item">
                            <button class="answer-button">${item}</button>
                        </div>
                    `).join('')}
                </div>
            `;
            document.querySelectorAll('.answer-button').forEach(button => {
                button.addEventListener('click', checkAnswer);
            });
        } else if (question.type === "grid") {
            correctGridSelections = 0;
          
            gameArea.innerHTML = ` 
              <div id="hint" class="hint" style="display: inline-block;"> <span style="font-weight: bold; color: #FF6347;">Подсказка:</span> Нажмите на несколько правильных ответов.</div>
                <div class="question">${question.question}</div>
                <div class="grid-container">
                    ${question.grid.map(item => `
                        <div class="grid-item answer-button" style="padding: 10px; border: 1px solid #ccc; text-align: center; cursor: pointer;">${item}</div>
                    `).join('')}
                </div>
            `;
            document.querySelectorAll('.grid-item').forEach(item => {
                item.addEventListener('click', checkGridAnswer);
            });
        }
    }
    

    function checkAnswer(event) {
        const selectedAnswer = event.target.textContent;
        const correctAnswer = questions[currentQuestionIndex].correctAnswer;

        gameData.questions.push({
            question: questions[currentQuestionIndex].question,
            selectedAnswer: selectedAnswer,
            correctAnswer: correctAnswer
        });

        if (selectedAnswer === correctAnswer) {
            score += 10;
            event.target.style.backgroundColor = '#94ca95'; 
            event.target.classList.add('correct');
        } else {
            score -= 5;
            timeLeft -= 10; 
            timeLeftElement.textContent = timeLeft; 
            event.target.style.backgroundColor = '#da7272'; 
            event.target.classList.add('incorrect');
        }

        scoreValueElement.textContent = score;
        if (score < 0) {
            scoreValueElement.style.color = '#da7272';
        } else {
            scoreValueElement.style.color = '#94ca95';
        }
        document.querySelectorAll('.answer-button').forEach(button => {
            button.disabled = true;
        });

        answeredQuestions++;
        currentQuestionIndex++;

        if (answeredQuestions < questions.length) {
            setTimeout(displayQuestion, 1000); 
        } else {
            setTimeout(() => endGame(startTime), 1000);
        }
    }
    function checkGridAnswer(event) {
        const selectedWord = event.target.textContent;
        const question = questions[currentQuestionIndex];
        
        let selectedWords = gameData.questions.find(q => q.question === question.question);
        if (!selectedWords) {
            selectedWords = { question: question.question, selectedAnswers: [], correctAnswers: question.correctAnswers }; 
            gameData.questions.push(selectedWords);
        }
    
        selectedWords.selectedAnswers.push(selectedWord); 
        
        if (question.correctAnswers.includes(selectedWord)) {
            score += 5;
            correctGridSelections++;
            event.target.style.backgroundColor = '#94ca95'; 
            event.target.classList.add('correct');
        } else {
            score -= 2;
            timeLeft -= 5; 
            event.target.style.backgroundColor = '#da7272'; 
            event.target.classList.add('incorrect');
        }
    
        scoreValueElement.textContent = score;
    
        event.target.removeEventListener('click', checkGridAnswer);
    
        if (correctGridSelections === question.correctAnswers.length) {
            timeLeft += 10;
            answeredQuestions++;
            currentQuestionIndex++;
            if (answeredQuestions < questions.length) {
                setTimeout(displayQuestion, 1000);
            } else {
                setTimeout(() => endGame(startTime), 1000);

            }
        }
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
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [false, false];
            completedLevels[0] = true; 
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels));

            gameArea.innerHTML = `<p>Поздравляем! Вы успешно прошли уровень 1!</p>`;
            nextLevelButton.style.display = 'inline-block';
            retryButton.style.display = 'none';
        } else {
            gameArea.innerHTML = `<p>Уровень не пройден. Попробуйте снова!</p>`;
            retryButton.style.display = 'inline-block';
            nextLevelButton.style.display = 'none';
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

    nextLevelButton.addEventListener('click', () => {
        window.location.href = 'level2.html'; 
    });

    const questions = getRandomQuestions();
    displayQuestion();
    startTimer();
});
