btn = document.getElementById('button')

const screenW = window.screen.width;
const screenH = window.screen.height;

btn.addEventListener('click', () => {
  window.alert(`Размеры экрана: ${screenW} x ${screenH}`);
})