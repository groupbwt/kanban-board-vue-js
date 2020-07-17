<template>
  <p class="clipped-text">
    <span v-html="itemText"></span> <br />
    <a
      v-if="needClipButton"
      href="#"
      class="clipped-text__toggle-link active-element"
      @click.prevent="toggle"
    >
      {{ isClipped ? 'show more' : 'show less' }}
    </a>
  </p>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    maxLength: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      isClipped: true,
    };
  },
  computed: {
    itemText() {
      return this.isClipped ? this.clippedText : this.value;
    },
    clippedText() {
      let spaceIndex = this.value.indexOf(' ', this.maxLength);
      if (spaceIndex < 0) {
        return this.value;
      }
      return this.value.substr(0, spaceIndex) + '...';
    },
    needClipButton() {
      return this.value.length > this.clippedText.length;
    },
  },
  methods: {
    toggle() {
      this.isClipped = !this.isClipped;
    },
  },
};
</script>
