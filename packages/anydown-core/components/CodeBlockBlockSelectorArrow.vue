<template>
  <g>
    <g
      transform="translate(0, 0)"
      class="typeNav__item"
      :class="{active: selectedItem.type==='arrow'}"
      @click="selectedItem.type = 'arrow'"
    >
      <rect x="0" y="0" width="24" height="24" fill="#666"></rect>
      <g transform="translate(20, 12) scale(0.5)">
        <polygon points="0,0 -20,-8 -18,0 -20,8" fill="currentcolor" />
      </g>
      <line x1="4" y1="12" x2="20" y2="12" stroke="currentcolor" />
    </g>
    <g
      transform="translate(28, 0)"
      class="typeNav__item"
      :class="{active: selectedItem.type==='line'}"
      @click="selectedItem.type = 'line'"
    >
      <rect x="0" y="0" width="24" height="24" fill="#666"></rect>
      <line x1="4" y1="12" x2="20" y2="12" stroke="currentcolor" />

    </g>
  </g>
</template>

<script>
export default {
  props: ["selectedItem"]
};
</script>

<style>
.typeNav__item {
  color: white;
  opacity: 0.5;
}
.typeNav__item.active {
  color: #6db9ff;
  opacity: 1;
}
</style>