const positionOffsets = {
  block1: { block2: { x: 150, y: 0 }, block3: { x: 0, y: 150 } },
  block2: { block1: { x: -150, y: 0 }, block4: { x: 0, y: 150 } },
  block3: { block1: { x: 0, y: -150 }, block4: { x: 150, y: 0 } },
  block4: { block2: { x: 0, y: -150 }, block3: { x: -150, y: 0 } },
};

document.querySelectorAll('.piece').forEach((element) => {
  element.addEventListener('dragstart', (e) => {
    const elementRect = element.getBoundingClientRect();
    const offsetX = e.clientX - elementRect.left;
    const offsetY = e.clientY - elementRect.top;
    e.dataTransfer.setData('elementId', element.id);
    e.dataTransfer.setData('cursorOffsetX', offsetX);
    e.dataTransfer.setData('cursorOffsetY', offsetY);
  });

  element.addEventListener('click', () => {
    const currentAngle = parseInt(element.dataset.angle || '0', 10);
    const updatedAngle = (currentAngle + 90) % 360;
    element.dataset.angle = updatedAngle;
    element.style.transform = `rotate(${updatedAngle}deg)`;
  });

  const randomAngle = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
  element.dataset.angle = randomAngle;
  element.style.transform = `rotate(${randomAngle}deg)`;
});

document.getElementById('target-area').addEventListener('dragover', (e) => {
  e.preventDefault(); 
});

document.getElementById('target-area').addEventListener('drop', (e) => {
  e.preventDefault();
  const elementId = e.dataTransfer.getData('elementId');
  const cursorOffsetX = parseFloat(e.dataTransfer.getData('cursorOffsetX'));
  const cursorOffsetY = parseFloat(e.dataTransfer.getData('cursorOffsetY'));
  const element = document.getElementById(elementId);
  const areaRect = e.target.getBoundingClientRect();
  const newX = e.clientX - areaRect.left - cursorOffsetX;
  const newY = e.clientY - areaRect.top - cursorOffsetY;
  const adjustedX = Math.max(0, Math.min(newX, areaRect.width - element.offsetWidth));
  const adjustedY = Math.max(0, Math.min(newY, areaRect.height - element.offsetHeight));
  element.style.position = 'absolute';
  element.style.left = `${adjustedX}px`;
  element.style.top = `${adjustedY}px`;

  if (!e.target.contains(element)) {
    e.target.appendChild(element);
  }

  validatePuzzle();
});

function validatePuzzle() {
  const feedbackMessage = document.getElementById('feedback');
  const puzzleParts = document.querySelectorAll('.piece');
  const targetArea = document.getElementById('target-area');

  let allInside = true;
  puzzleParts.forEach((part) => {
    if (!targetArea.contains(part)) {
      allInside = false;
    }
  });

  if (!allInside) {
    feedbackMessage.style.display = 'none';
    return;
  }

  let isAssembledCorrectly = true;
  const allowedError = 10;

  for (const [blockId, adjacentBlocks] of Object.entries(positionOffsets)) {
    const block = document.getElementById(blockId);
    const blockRect = block.getBoundingClientRect();
    const blockAngle = parseInt(block.dataset.angle || '0', 10);

    for (const [adjacentId, expectedOffset] of Object.entries(adjacentBlocks)) {
      const adjacentBlock = document.getElementById(adjacentId);
      const adjacentRect = adjacentBlock.getBoundingClientRect();
      const adjacentAngle = parseInt(adjacentBlock.dataset.angle || '0', 10);

      if (blockAngle !== 0 || adjacentAngle !== 0) {
        isAssembledCorrectly = false;
        break;
      }

      const actualX = adjacentRect.left - blockRect.left;
      const actualY = adjacentRect.top - blockRect.top;

      if (
        Math.abs(actualX - expectedOffset.x) > allowedError ||
        Math.abs(actualY - expectedOffset.y) > allowedError
      ) {
        isAssembledCorrectly = false;
        break;
      }
    }

    if (!isAssembledCorrectly) {
      break;
    }
  }

  if (isAssembledCorrectly) {
    feedbackMessage.style.display = 'block';
    feedbackMessage.textContent = "Поздравляем! Дом собран!";
    feedbackMessage.style.color = 'green';
    targetArea.classList.add('success-animation');
    setTimeout(() => {
      targetArea.classList.remove('success-animation');
    }, 1000);
  } else {
    feedbackMessage.style.display = 'block';
    feedbackMessage.textContent = "Ошибка! Попробуйте снова.";
    feedbackMessage.style.color = 'red';
  }
}
