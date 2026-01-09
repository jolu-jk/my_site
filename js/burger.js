const burgerToggle = document.querySelector('.burger-toggle');
const burgerMenu = document.querySelector('.burger-menu');
const menuItems = document.querySelectorAll('.menu-items a');


burgerToggle.addEventListener('click', () => {
    burgerToggle.classList.toggle('open');
    burgerMenu.classList.toggle('open');
});
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        burgerMenu.classList.remove('open');  
        burgerToggle.classList.remove('open'); 
    });
});
