const burgerToggle = document.querySelector('.burger-toggle');
const menuItems = document.querySelector('.menu-items');
const burgerMenu = document.querySelector('.burger-menu');

burgerToggle.addEventListener('click', () => {
    burgerToggle.classList.toggle('open');
    burgerMenu.classList.toggle('open');
});
