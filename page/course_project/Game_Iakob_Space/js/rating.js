document.addEventListener("DOMContentLoaded", () => {
    const rankingContainer = document.getElementById('ranking-container');
    const userRanking = JSON.parse(localStorage.getItem('userRanking')) || [];

    if (rankingContainer) {
        const rankingTableBody = document.querySelector('#ranking-table tbody');

        if (userRanking.length === 0) {
            rankingTableBody.innerHTML = '<tr><td colspan="3">Рейтинг пуст.</td></tr>';
        } else {
            userRanking.forEach((user, index) => {
                const row = document.createElement('tr');
            
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.score}</td>
                    <td>${user.timeSpent} секунд</td> 
                `;
                rankingTableBody.appendChild(row);
            });
        }
    }
});