<template>
  <g>
    <rect x="0.5" y="0.5" :width="24*2" :height="24" fill="#EEE" stroke="#666" stroke-width="1"></rect>
    <g
      transform="translate(0.5, 0.5)"
      class="typeNav__item"
      :class="{active: arrow}"
      @click="onClickArrow"
    >
      <rect x="0" y="0" width="24" height="24" fill="currentcolor"></rect>
      <g transform="translate(20, 12) scale(0.5)">
        <polygon points="0,0 -20,-8 -18,0 -20,8" fill="#333" />
      </g>
      <line x1="4" y1="12" x2="20" y2="12" stroke="#333" />
    </g>
    <g
      transform="translate(24.5, 0.5)"
      class="typeNav__item"
      :class="{active: !arrow}"
      @click="onClickLine"
    >
      <rect x="0" y="0" width="24" height="24" fill="currentcolor"></rect>
      <line x1="4" y1="12" x2="20" y2="12" stroke="#333" />
    </g>
  </g>
</template>

<script>
export default {
  props: ["arrow"],
  methods: {
    onClickArrow() {
      this.$emit("arrow");
    },
    onClickLine() {
      this.$emit("line");
    },
  },
};
</script>

<style>
.typeNav__item {
  color: white;
}
.typeNav__item.active {
  color: #6db9ff;
  opacity: 1;
}
</style>