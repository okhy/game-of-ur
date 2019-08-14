<script>
  import Piece from "./Piece.svelte";
  export let pieces; // number
  export let type; //string
</script>

<style>
  .bucket {
    display: flex;
  }
</style>

<div class="bucket">
  {#each Array(pieces) as piece}
    <Piece {type} />
  {/each}
</div>
