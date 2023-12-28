export type BoardType = string[][];

export function checkWinner(board: BoardType, player: string | null): number {
  // check for rows
  //   console.log(board, player);
  let countTie = 0;

  for (let i = 0; i < 3; i++) {
    let count: number = 0;
    for (let j = 0; j < 3; j++) {
      if (board[i][j] !== "") countTie = countTie + 1;
      if (board[i][j] == player) count = count + 1;
    }

    if (count === 3) return 1;
  }

  // check for columns
  for (let i = 0; i < 3; i++) {
    let count: number = 0;
    for (let j = 0; j < 3; j++) {
      if (board[j][i] == player) count = count + 1;
    }

    if (count === 3) return 1;
  }

  // check for diagonals
  let d1: number = 0,
    d2: number = 0;
  for (let i = 0; i < 3; i++) {
    if (board[i][i] == player) d1 = d1 + 1;
    if (board[i][2 - i] == player) d2 = d2 + 1;

    if (d1 === 3 || d2 === 3) return 1;
  }

  if (countTie === 9) return 2;
  return 0;
}
