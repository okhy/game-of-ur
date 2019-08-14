<script>
  import { boardState } from "./store";
  import Board from "./components/Board.svelte";
  import PieceBucket from "./components/PieceBucket.svelte";
  import DiceBox from "./components/DiceBox.svelte";

  // Customisable player paths defined as collection of board tile ids
  const midLane = [9, 10, 11, 12, 13, 14, 15, 16];
  const blackPath = [4, 3, 2, 1, ...midLane, 8, 7];
  const whitePath = [20, 19, 18, 17, ...midLane, 24, 23];

  // Global boolean to be stored in a store in the future
  let whiteMoves = true;

  // Dice is an array with sides and values
  const dice = [0, 0, 1, 1];
  const dices = [dice, dice, dice, dice];

  const pieceType = {
    1: "black",
    2: "white"
  };

  const movePiece = (tileId, moves) => {};
</script>

<div class="wrapper">
  <h3>Now moves {whiteMoves ? 'white' : 'black'}</h3>
  <Board {boardState} />
  <br />
  <PieceBucket pieces={7} type={pieceType[1]} />
  <PieceBucket pieces={7} type={pieceType[2]} />
  <DiceBox {dices} />
</div>
