import { hasBeenFiredUpon } from './has-been-fired-upon';

export interface Coordinate {
  x: number;
  y: number;
}

export function getMaxVote(voteGrid: number[][], shipGrid: string[][]): Coordinate {
  let max = { value: -Infinity, x: 0, y: 0 };

  voteGrid.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > max.value && !hasBeenFiredUpon(shipGrid[y][x])) {
        max = { value, x, y };
      }
    });
  });

  return max;
}
