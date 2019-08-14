<script>
  import Piece from "./Piece.svelte";

  export let id;
  export let pieces;
  export let isRosette = false;
  export let accepts;
</script>

<style>
  .tile {
    display: flex;
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    background-color: aliceblue;
    border: 1px solid lightgray;
  }
  .rosette {
    background-color: lightcyan;
  }
  .empty {
    background-color: white;
    border-color: white;
  }
</style>

<div
  class=" tile {isRosette ? 'rosette' : ''}
  {accepts.length ? '' : 'empty'}
  ">
  {#if pieces.length}
    {#each pieces as piece, index}
      <Piece id={`${id}-piece-${index}`} type={piece} />
    {/each}
  {/if}
</div>
