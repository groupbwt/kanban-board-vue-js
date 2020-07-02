<template>
  <li class="kanban-board__card-wrapper">
    <ValidationProvider
      v-if="editMode"
      ref="editForm"
      v-slot="{ errors, failed }"
      name="card"
      mode="passive"
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
        @keyup.enter="submitEditForm"
      />
      <div class="invalid-feedback">{{ errors[0] }}</div>
    </ValidationProvider>

    <div v-else class="kanban-board__card">
      <p>{{ title }}</p>
    </div>

    <div class="kanban-board__card-actions">
      <button class="kanban-board__icon-button" @click="toggleEditForm">
        <img src="../assets/static/icons/pencil.svg" alt="edit icon" />
      </button>
      <button class="kanban-board__icon-button" @click="deleteCard">
        <img src="../assets/static/icons/delete.svg" alt="trash icon" />
      </button>
    </div>
  </li>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  name: 'KanbanBoardColumnCard',

  components: {
    ValidationProvider,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      editMode: false,
      formData: {
        title: '',
      },
    };
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
        this.$emit('update-card', this.formData.title);
        this.editMode = false;
        this.resetForm();
      }
    },

    resetForm() {
      this.formData.title = '';
      this.$refs.editForm.reset();
    },

    deleteCard() {
      const confirmationResult = confirm(this.$t('confirmation.card'));

      if (confirmationResult) {
        this.$emit('delete-card');
      }
    },
  },
};
</script>
