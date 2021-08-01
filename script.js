const gridContainer = document.querySelector('.grid');
let gridSize = 16;
function createGrid() {
  // Create a series of squares to form a grid
  for (let i = 0; i < gridSize * gridSize; i += 1) {
    const grid = document.createElement('div');
    grid.classList.add('grid__square');
    gridContainer.appendChild(grid);
  }
  // Change number of columns depending on grid size
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
}
createGrid();

const isGradient = document.querySelector('.checkbox');

let fillColor = 'rgb(0, 0, 0)';
sessionStorage.fillColor = fillColor;
const colorPicker = new window.iro.ColorPicker('#picker', { width: 150 });

colorPicker.on('color:change', () => {
  // log the current color as a HEX string
  fillColor = colorPicker.color.rgbString;
  // Store current rgb values to be used after erase mode
  sessionStorage.fillColor = fillColor;
});

gridContainer.addEventListener('mouseover', (e) => {
  // Prevent whole grid from being coloured when grid's border is hovered over
  if (!e.target.classList.contains('grid__square')) return;

  // Reset the opacity to 0.1 when a different colour is hovered over a filled square
  if (e.target.style.backgroundColor !== fillColor) e.target.style.opacity = '0.1';
  console.log(`Square colour: ${e.target.style.backgroundColor}`);
  console.log(`Fill colour ${fillColor}`);
  e.target.style.backgroundColor = fillColor;

  // Increase opacity of any square by .1 everytime mouse hovers over it
  if (isGradient.checked) e.target.style.opacity -= '-0.1 ';
  else e.target.style.opacity = '1';
});

// Erase functionality
document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyE') fillColor = 'rgba(255,255,255, 0)';
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'KeyE') fillColor = sessionStorage.fillColor;
});

function resetGrid() {
  // gridContainer.childNodes.forEach((child) => gridContainer.removeChild(child));
  gridContainer.textContent = '';
  fillColor = 'rgb(0, 0, 0)';
}

const btnClearGrid = document.querySelector('#btnClearGrid');
btnClearGrid.addEventListener('click', () => {
  gridContainer.childNodes.forEach((child) => {
    child.style.backgroundColor = '#fff';
    child.style.opacity = 0;
  });
  gridSize = prompt('Enter new sketch grid size pls:');

  resetGrid();
  createGrid();
});

// Use dom-to-image and file-saver libraries to save grid state as png
const btnSave = document.querySelector('#btnSave');
btnSave.addEventListener('click', () => domtoimage.toBlob(document.querySelector('.grid')).then((blob) => window.saveAs(blob, 'sketch.png'))); // eslint-disable-line no-undef
