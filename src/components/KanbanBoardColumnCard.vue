<template>
  <li ref="root" class="kanban-board__card-wrapper">
    <div class="kanban-board__card">
      <ValidationProvider
        v-if="editMode"
        ref="editForm"
        v-slot="{ errors, failed }"
        name="card"
        rules="required"
      >
        <input
          ref="editField"
          v-model="formData.title"
          type="text"
          :placeholder="$t('placeholders.card')"
          :class="[
            'kanban-board__form-control',
            'kanban-board__form-control--edit-input',
            { 'is-invalid': failed },
          ]"
          @keydown.enter.prevent="submitEditForm"
        />
        <div class="invalid-feedback">{{ errors[0] }}</div>
      </ValidationProvider>

      <div v-else class="kanban-board__card-content">
        <ClippedText ref="title" :value="title" />
      </div>

      <div class="kanban-board__card-actions">
        <button
          class="kanban-board__icon-button active-element"
          @click="toggleEditForm"
        >
          <img src="../assets/static/icons/pencil.svg" alt="edit icon" />
        </button>
        <button
          class="kanban-board__icon-button active-element"
          @click="deleteCard"
        >
          <img src="../assets/static/icons/delete.svg" alt="trash icon" />
        </button>
      </div>
    </div>

    <ModalWindow ref="confirmModal" :text="$t('confirmation.card')" />
  </li>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import ModalWindow from './ModalWindow.vue';
import ClippedText from './ClippedText.vue';

export default {
  name: 'KanbanBoardColumnCard',

  components: {
    ValidationProvider,
    ModalWindow,
    ClippedText,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      observer: null,
      editMode: false,
      formData: {
        title: '',
      },
    };
  },

  mounted() {
    this.observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        const newValue = mutation.target.getAttribute(mutation.attributeName);
        this.$nextTick(() => {
          this.onClassChange(newValue, mutation.oldValue);
        });
      }
    });

    this.observer.observe(this.$refs.root, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['class'],
    });
  },

  beforeDestroy() {
    this.observer.disconnect();
  },

  methods: {
    toggleEditForm() {
      this.editMode ? this.disableEditForm() : this.enableEditForm();
    },

    enableEditForm() {
      this.formData.title = this.title;
      this.editMode = true;
      this.$nextTick(() => {
        this.$refs.editField.focus();
      });
    },

    disableEditForm() {
      this.editMode = false;
      this.resetForm();
    },

    async submitEditForm() {
      const validationResult = await this.$refs.editForm.validate();

      if (validationResult.valid) {
        let title = this.formData.title;
        this.$emit('update-card', { title });
        this.editMode = false;
        this.resetForm();
      }
    },

    resetForm() {
      this.formData.title = '';
      this.$refs.editForm.reset();
    },

    deleteCard() {
      this.$refs.confirmModal.open({}, () => {
        this.$emit('delete-card');
      });
    },

    onClassChange(classAttr) {
      const classList = classAttr.split(' ');

      if (
        classList.includes('kanban-board__card-wrapper--ghost') ||
        classList.includes('kanban-board__card-wrapper--drag')
      ) {
        this.$refs.title.isClipped = true;
      }
    },
  },
};
</script>
