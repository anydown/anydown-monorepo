<template>
  <g>
    <rect x="0.5" y="0.5" width="48" height="24" fill="#EEE" stroke="#666" stroke-width="1"></rect>
    <g
      transform="translate(0.5, 0.5)"
      class="typeNav__item"
      :class="{active: selectedItem.type==='box'}"
      @click="selectedItem.type = 'box'"
    >
      <rect x="0" y="0" width="24" height="24" fill="currentcolor"></rect>
      <rect stroke="#333" fill="none" x="4" y="4" width="16" height="16"></rect>
      <path
        d="M10.5 8.8c-.4 0-.7.1-1 .4a9 9 0 01-1 .7c-.2 0-.3 0-.3-.3v-.2l.1-1.2.3-.3H14.7c.4 0 .7 0 .7.2.1.1.2.4.2.9v.3c0 .4-.1.7-.3.7-.2 0-.4-.2-.6-.5L14 9c-.2-.2-.5-.2-.8-.2-.2 0-.4.2-.4.5a63.5 63.5 0 000 5.3c0 .2.2.4.5.6.3.2.4.4.4.5 0 .1 0 .2-.2.3H11a5 5 0 01-.8 0c-.1 0-.2-.1-.2-.3l.4-.5.5-.6v-2.7a33.8 33.8 0 00-.1-3l-.4-.1z"
        fill="#333"
      />
    </g>
    <g
      transform="translate(24.5, 0.5)"
      class="typeNav__item"
      :class="{active: selectedItem.type==='text'}"
      @click="selectedItem.type = 'text'"
    >
      <rect x="0" y="0" width="24" height="24" fill="currentcolor"></rect>
      <path
        d="M10.5 8.8c-.4 0-.7.1-1 .4a9 9 0 01-1 .7c-.2 0-.3 0-.3-.3v-.2l.1-1.2.3-.3H14.7c.4 0 .7 0 .7.2.1.1.2.4.2.9v.3c0 .4-.1.7-.3.7-.2 0-.4-.2-.6-.5L14 9c-.2-.2-.5-.2-.8-.2-.2 0-.4.2-.4.5a63.5 63.5 0 000 5.3c0 .2.2.4.5.6.3.2.4.4.4.5 0 .1 0 .2-.2.3H11a5 5 0 01-.8 0c-.1 0-.2-.1-.2-.3l.4-.5.5-.6v-2.7a33.8 33.8 0 00-.1-3l-.4-.1z"
        fill="#333"
      />
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
}
.typeNav__item.active {
  color: #a4d3ff;
}
</style>