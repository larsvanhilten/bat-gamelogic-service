export function isShip(cell: string): boolean {
  switch (cell) {
    case '^':
      return true;
    case '|':
      return true;
    case '<':
      return true;
    case '-':
      return true;
    default:
      return false;
  }
}
