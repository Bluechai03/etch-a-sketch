const gridContainer = document.querySelector('.sketch-grid');
function createGrid(gridSize = 16) {
  // Create a series of squares to form a grid
  for (let i = 0; i < gridSize * gridSize; i += 1) {
    const grid = document.createElement('div');
    grid.classList.add('sketch-grid__square');
    gridContainer.appendChild(grid);
  }
  // Change number of columns depending on grid size
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
}
createGrid();

const isGradient = document.querySelector('#checkboxGradient');

const defaultColor = 'rgb(135, 121, 111)';
let fillColor = defaultColor;
sessionStorage.fillColor = fillColor;

const valueColorPicker = document.querySelector('#valueColorPicker');
valueColorPicker.textContent = fillColor;

// Configuring color picker
const pickr = Pickr.create({
  el: '#color-picker',
  theme: 'monolith', // or 'monolith', or 'nano'

  swatches: ['rgb(244,224,196)', 'rgb(233, 108, 122)', 'rgb(212, 218, 85)', 'rgb(137, 196, 219)', 'rgb(135, 121, 111)', 'rgb(88, 84, 129)'],
  comparison: false,
  default: defaultColor,
  defaultRepresentation: 'RGBA',
  closeOnScroll: true,
  position: 'left-end',

  components: {
    // Main components
    preview: true,
    opacity: true,
    hue: true,

    // Input / output Options
    interaction: {
      rgba: true,
      hex: true,
      hsla: true,
      hsva: false,
      cmyk: false,
      input: true,
      clear: false,
      save: false,
    },
  },
});

pickr.on('change', (color) => {
  // Convert each rgba value from color picker, except for alpha value, into a number to compare in later functions
  const rgb = [Math.round(Number(color.toRGBA()[0])), Math.round(Number(color.toRGBA()[1])), Math.round(Number(color.toRGBA()[2]))];
  console.log(Math.round(rgb[0]));

  fillColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  // Store current rgb values to be used after erase mode
  sessionStorage.fillColor = fillColor;
  gridContainer.style.borderColor = fillColor;
  valueColorPicker.textContent = fillColor;
  pickr.setColor(fillColor);
});

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomRGB() {
  // Call function to create random values and create random rgb value
  const red = getRandomNumber(0, 255);
  const green = getRandomNumber(0, 255);
  const blue = getRandomNumber(0, 255);

  fillColor = `rgb(${red}, ${green}, ${blue})`;
  console.log(fillColor);
}

const buttonRandomRGB = document.querySelector('#buttonRandomRGB');
buttonRandomRGB.addEventListener('click', (e) => {
  e.target.classList.toggle('btn--active');
});

function drawOnGrid(e) {
  console.log(e.target.style.opacity);
  // Prevent whole grid from being coloured when grid's border is hovered over
  if (!e.target.classList.contains('sketch-grid__square')) return;

  // Reset the opacity to 0.1 when a different colour is hovered over a filled square
  if (e.target.style.backgroundColor !== fillColor) e.target.style.opacity = '0.1';
  console.log(`Fill colour: ${fillColor}`);
  e.target.style.backgroundColor = fillColor;
  console.log(`Background colour: ${e.target.style.backgroundColor}`);

  // Increase opacity of any square by .1 everytime mouse hovers over it
  if (isGradient.checked) e.target.style.opacity -= '-0.1';
  else e.target.style.opacity = '1';

  if (buttonRandomRGB.classList.contains('btn--active')) getRandomRGB();
}

gridContainer.addEventListener('mouseover', drawOnGrid);

// Decide fill mode
const inputFillMode = document.querySelector('#checkboxClick');
inputFillMode.addEventListener('click', (inputEvent) => {
  // Add and remove certain event handlers to change drawing fill mode
  let removedEventHandler;
  let addedEventHandler;

  if (inputEvent.target.checked) {
    removedEventHandler = 'mouseover';
    addedEventHandler = 'click';
  } else {
    removedEventHandler = 'click';
    addedEventHandler = 'mouseover';
  }

  gridContainer.removeEventListener(removedEventHandler, drawOnGrid);
  gridContainer.addEventListener(addedEventHandler, drawOnGrid);
});

// Erase feature
document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyE') fillColor = 'rgba(255,255,255, 0)';
  console.log(fillColor);
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'KeyE') fillColor = sessionStorage.fillColor;
});

let gridSize;
const labelGridSize = document.querySelector('#labelGridSize');
const inputGridSize = document.querySelector('#inputGridSize');

inputGridSize.addEventListener('input', (e) => {
  gridSize = e.target.value;
  labelGridSize.textContent = `Grid size: ${gridSize}x${gridSize}`;
});

function resetGrid() {
  gridContainer.textContent = '';
  fillColor = defaultColor;
  pickr.setColor(fillColor);
  sessionStorage.fillColor = fillColor;
  gridContainer.style.borderColor = fillColor;

  const animation = 'animate__shakeY';

  const card = document.querySelector('.card');
  card.classList.toggle(animation);
  // Remove class after animation to reset trigger
  setTimeout(() => card.classList.remove(animation), 2000);
}

const buttonClearGrid = document.querySelector('#buttonClearGrid');
buttonClearGrid.addEventListener('click', () => {
  gridContainer.childNodes.forEach((child) => {
    child.style.backgroundColor = '#fff';
    child.style.opacity = 0;
  });
  gridSize = 16;
  inputGridSize.value = gridSize;
  labelGridSize.textContent = `Grid size: ${gridSize}x${gridSize}`;
  resetGrid();
  createGrid();
});

// Use dom-to-image and file-saver libraries to download grid state as png
const buttonSave = document.querySelector('#buttonSave');
buttonSave.addEventListener('click', () => domtoimage.toBlob(document.querySelector('.sketch-grid')).then((blob) => window.saveAs(blob, 'sketch.png'))); // eslint-disable-line no-undef

const buttonSetGridSize = document.querySelector('#buttonSetGridSize');
buttonSetGridSize.addEventListener('click', () => {
  resetGrid();
  createGrid(gridSize);
  console.log('Grid size changed!');
});
