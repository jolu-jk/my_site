const latin = [
    "Consuetudo est altera natura",
    "Nota bene",
    "Nulla calamitas sola",
    "Per aspera ad astra",
    "Faber est suae quisque fortunae",
    "Vita brevis est, ars longa"

];

const russian = [
    "Привычка — вторая натура",
    "Заметьте хорошо!",
    "Беда не приходит одна",
    "Через тернии к звёздам",
    "Каждый сам кузнец своей судьбы",
    "Жизнь коротка, искусство вечно"
];

let order = [];
let clickCount = 0;

function shuffleArray() {
    order = [...latin.keys()];
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
}

shuffleArray();

const tableBody = document.getElementById("tableBody");
const createBtn = document.getElementById("createBtn");
const styleBtn = document.getElementById("styleBtn");

createBtn.addEventListener("click", function () {
    if (order.length === 0) {
        alert("Фразы закончились");
        return;
    }

    clickCount++;

    const index = order.shift();
    const row = document.createElement("tr");

    if (clickCount % 2 === 0) {
        row.classList.add("class1");
    } else {
        row.classList.add("class2");
    }

    const tdLatin = document.createElement("td");
    const tdRussian = document.createElement("td");

    tdLatin.textContent = latin[index];
    tdRussian.textContent = russian[index];

    row.appendChild(tdLatin);
    row.appendChild(tdRussian);
    tableBody.appendChild(row);
});

styleBtn.addEventListener("click", function () {
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(function (row, index) {
        if ((index + 1) % 2 === 0) {
            row.classList.add("bold");
        }
    });
});
