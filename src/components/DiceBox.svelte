<script>
  export let dices;
  let result = 0;

  const throwDices = diceSet => {
    result = diceSet.reduce((acc, dice) => {
      return acc + dice[Math.floor(Math.random() * dice.length)];
    }, 0);
  };

  const handleDiceThrow = () => throwDices(dices);
</script>

<div>
  <span>There are {dices.length} dices in the box</span>

  <span>Dice Throw result = {result}</span>

  <button on:click={handleDiceThrow}>roll</button>
</div>
