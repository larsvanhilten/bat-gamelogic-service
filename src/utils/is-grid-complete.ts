import { isShip } from './is-ship';

export function isGridComplete(grid: string[][]): boolean {
  return !grid.some((row) => row.some((cell) => isShip(cell)));
}
