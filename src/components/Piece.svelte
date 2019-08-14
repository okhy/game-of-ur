<script>
  export let id;
  export let type;
  $: isBlack = type === "black";
</script>

<style>
  .piece {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid black;
  }
  .black {
    background-color: black;
  }
  .white {
    background-color: white;
  }
</style>

<div class="piece {isBlack ? 'black' : 'white'}" />
