document.addEventListener("DOMContentLoaded", () => {
    const historyContainer = document.getElementById('history-container');
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory_' + localStorage.getItem('gameUsername'))) || [];
    const clearHistoryButton = document.getElementById('clear-history');
    const gridAnswersContainer = document.getElementById('grid-answers-container'); 


    if (gameHistory.length === 0) {
        clearHistoryButton.style.display = 'none'; 
    } else {
        gameHistory.forEach((game, index) => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('game-record');

            gameElement.innerHTML = 
                `<h3>Игра ${index + 1} </h3>
                <p><strong>Баллы:</strong> ${game.score}</p>
                <p><strong>Пройденный уровень:</strong> ${game.level}</p>
                <p><strong>Оставшееся время:</strong> ${game.timeLeft} секунд</p>`
            ;

            gameElement.addEventListener('click', () => {
                const modal = document.getElementById('game-detail-modal');
                const closeBtn = document.querySelector('.close');
                const gameDetailTable = document.getElementById('game-detail-table').getElementsByTagName('tbody')[0];


                gameDetailTable.innerHTML = '';
                gridAnswersContainer.innerHTML = ''; 

                if (game.level === 2) {
                    game.questionsList.forEach((question, qIndex) => {
                        const row = gameDetailTable.insertRow();
                        row.insertCell(0).textContent = question;

                        if (qIndex === 0) { 
                            const correctAnswers = game.correctAnswers[0] || {};
                            const correctPredators = correctAnswers.predators?.join(', ') || 'Россия, Исландия';
                            const correctHerbivores = correctAnswers.herbivores?.join(', ') || 'Бразилия | Индия ';
                            const selectedPredators = game.groups?.predators?.trim()?.replace(/,\s*$/, '') || 'Не выбраны';
                            const selectedHerbivores = game.groups?.herbivores?.trim()?.replace(/,\s*$/, '') || 'Не выбраны';
                            
                            row.insertCell(1).textContent = `${selectedPredators} | ${selectedHerbivores}`;
                            row.insertCell(2).textContent = `${correctPredators} | ${correctHerbivores}`;
                            
                        } else {
                            const selectedAnswer = game.answers[qIndex - 1] || 'Нет выбранного ответа';
                            const correctAnswer = game.correctAnswers[qIndex] || 'Нет правильного ответа';
                            
                            row.insertCell(1).textContent = selectedAnswer;
                            row.insertCell(2).textContent = correctAnswer;
                        }
                    });
                } else if (game.level === 1) {
                    game.questions.forEach((question, qIndex) => {
                        const row = gameDetailTable.insertRow();
                        const rowClass = (question.selectedAnswers && question.correctAnswers) 
                            && question.selectedAnswers.join(', ') === question.correctAnswers.join(', ');
                
                        row.classList.add(rowClass);
                        row.insertCell(0).textContent = question.question;
                
                        if (question.selectedAnswers && Array.isArray(question.selectedAnswers)) {
                            const selectedAnswersText = question.selectedAnswers.length > 0 
                                ? question.selectedAnswers.join(', ')  
                                : 'Нет выбранных слов';
                            const correctAnswersText = question.correctAnswers && question.correctAnswers.length > 0 
                                ? question.correctAnswers.join(', ') 
                                : question.correctAnswer;
                
                            row.insertCell(1).textContent = selectedAnswersText;
                            row.insertCell(2).textContent = correctAnswersText;
                        } else {
                          
                            row.insertCell(1).textContent = question.selectedAnswer || 'Нет выбранного ответа';
                            row.insertCell(2).textContent = question.correctAnswer || 'Нет правильного ответа';
                        }
                    });
              
                
                } else if (game.level === 3) {
             
                    gameDetailTable.innerHTML = '<tr><td colspan="3">Это сложный уровень, нельзя подсматривать ответы!</td></tr>';
                }
                
      
                modal.style.display = 'block';

                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });

                window.addEventListener('click', (event) => {
                    if (event.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            });

            historyContainer.appendChild(gameElement);
        });

        clearHistoryButton.style.display = 'inline-block';
    }

    // Обработчик для кнопки очистки истории
    clearHistoryButton.addEventListener('click', () => {
        historyContainer.classList.add('delete-animation');
        setTimeout(() => {
            localStorage.removeItem('gameHistory_' + localStorage.getItem('gameUsername'));
            clearHistoryButton.style.display = 'none';
            historyContainer.innerHTML = ''; 
        }, 1000);
    });
});