<template>
  <div
    :class="['modal', { 'modal--opened': isOpened }]"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div class="modal__backdrop"></div>
    <div class="modal__dialog modal__dialog--centered" role="document">
      <div class="modal__content">
        <div v-if="title" class="modal__header">
          <h5 class="modal__title">{{ title }}</h5>
          <button class="modal__close-button" @click="onCancel">
            <img src="../assets/static/icons/cross.svg" alt="cross icon" />
          </button>
        </div>
        <div class="modal__body">
          <p>{{ text }}</p>
        </div>
        <div class="modal__footer">
          <button
            type="button"
            class="modal__footer-button modal__footer-button--secondary"
            @click="onCancel"
          >
            Cancel
          </button>
          <button
            type="button"
            class="modal__footer-button modal__footer-button--primary"
            @click="onConfirm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalWindow',

  props: {
    title: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isOpened: false,
      options: {},
    };
  },

  methods: {
    onConfirm() {
      if (this.isOpened) {
        const { data, onSuccess } = this.options;

        this.close();

        if (onSuccess) {
          onSuccess(data);
        }
      }
    },
    onCancel() {
      if (this.isOpened) {
        const { data, onCancel } = this.options;

        this.close();

        if (onCancel) {
          onCancel(data);
        }
      }
    },
    open(data, onSuccess, onCancel) {
      this.options = {
        data,
        onSuccess,
        onCancel,
      };
      this.isOpened = true;
    },
    close() {
      this.options = {};
      this.isOpened = false;
    },
  },
};
</script>
