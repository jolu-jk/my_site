
document.getElementById('auth-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    if (username.trim().length >= 3) {
        localStorage.setItem('gameUsername', username);
        window.location.href = 'page/game.html'; 
    } else {
        alert('Пожалуйста, введите корректное имя (от 3 до 20 символов).');
    }
});
