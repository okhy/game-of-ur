<script>
  import Tile from "./Tile.svelte";
  export let rowSet; // two dimensional array
</script>

<style>
  .row {
    display: flex;
  }
</style>

<div class="board">
  {#each rowSet as row}
    <div class="row">
      {#each row as tile}
        <Tile {...tile} />
      {/each}
    </div>
  {/each}
</div>
