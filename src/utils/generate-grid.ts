export function generateGrid(): string[][] {
  const shipsSizes = [6, 4, 4, 3, 3, 3, 2, 2, 2, 2];
  const grid = createGrid();

  let allShipsPlaced = false;
  while (!allShipsPlaced) {
    const shipSize = shipsSizes[0];
    const { x, y } = getRandomCoordinate(9, 9);
    const shouldPlacedShipHorizontal = Math.random() < 0.5;

    if (shouldPlacedShipHorizontal && checkHorizontally(grid, x, y, shipSize)) {
      placeShipHorizontal(grid, x, y, shipSize);
      shipsSizes.shift();
    }

    if (!shouldPlacedShipHorizontal && checkVertically(grid, x, y, shipSize)) {
      placeShipVertical(grid, x, y, shipSize);
      shipsSizes.shift();
    }

    allShipsPlaced = shipsSizes.length === 0;
  }

  return grid;
}

function createGrid(): string[][] {
  return [
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~']
  ];
}

function placeShipHorizontal(grid: string[][], x: number, y: number, shipSize: number): string[][] {
  for (let index = 0; index < shipSize; index++) {
    const xPos = x + index;
    if (index === 0) {
      grid[y][xPos] = '<';
    } else {
      grid[y][xPos] = '-';
    }
  }
  return grid;
}

function placeShipVertical(grid: string[][], x: number, y: number, shipSize: number): string[][] {
  for (let index = 0; index < shipSize; index++) {
    const yPos = y + index;
    if (index === 0) {
      grid[yPos][x] = '^';
    } else {
      grid[yPos][x] = '|';
    }
  }
  return grid;
}

function checkHorizontally(grid: string[][], x: number, y: number, shipSize: number): boolean {
  if (x + shipSize >= 10) {
    return false;
  }

  let isValid = true;
  for (let index = x; index < x + shipSize; index++) {
    if (grid[y][index] !== '~') {
      isValid = false;
      break;
    }
  }

  return isValid;
}

function checkVertically(grid: string[][], x: number, y: number, shipSize: number): boolean {
  if (y + shipSize >= 10) {
    return false;
  }

  let isValid = true;
  for (let index = y; index < y + shipSize; index++) {
    if (grid[index][x] !== '~') {
      isValid = false;
      break;
    }
  }

  return isValid;
}

function getRandomCoordinate(maxX: number, maxY: number) {
  const x = Math.floor(Math.random() * Math.floor(maxX) + 1);
  const y = Math.floor(Math.random() * Math.floor(maxY) + 1);
  return { x, y };
}
