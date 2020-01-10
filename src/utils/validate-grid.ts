const verification = [0, 0, 4, 3, 2, 0, 1];

interface Ship {
  length: number;
  x?: number;
  y?: number;
  isDone?: boolean;
}

export function validateGrid(grid: string[][]): boolean {
  const horizontalShips: Ship[] = [];
  const verticalShips: Ship[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];

      const horizontalShip = horizontalShips.find((s) => s.y === y && !s.isDone);
      if (horizontalShip) {
        if (cell === '-') {
          horizontalShip.length++;
          continue;
        }
        horizontalShip.isDone = true;
      }

      const verticalShip = verticalShips.find((s) => s.x === x && !s.isDone);
      if (verticalShip) {
        if (cell === '|') {
          verticalShip.length++;
          continue;
        }
        verticalShip.isDone = true;
      }

      // Empty cell
      if (cell === '~') {
        continue;
      }

      // Store horizontal ship so we can keep track of the length throughout different columns
      if (cell === '<') {
        horizontalShips.push({ y, length: 1 });
        continue;
      }

      // Store vertical ship so we can keep track of the length throughout different rows
      if (cell === '^') {
        verticalShips.push({ x, length: 1 });
        continue;
      }

      // No valid symbol found
      return false;
    }
  }

  const count: number[] = [];
  horizontalShips.concat(verticalShips).forEach((ship) => {
    const { length } = ship;
    if (!count[length]) {
      count[length] = 0;
    }
    count[length]++;
  });

  return verifyShips(count);
}

const verifyShips = (count: number[]): boolean => {
  return (
    count.every((c, i) => {
      const length = c || 0;
      return length === verification[i];
    }) &&
    verification.every((verificationLength, i) => {
      const length = count[i] || 0;
      return length === verificationLength;
    })
  );
};
