<template>
  <li class="kanban-board__column">
    <template v-if="showTitleForm">
      <div class="kanban-board__column-block">
        <ValidationProvider
          ref="titleForm"
          v-slot="{ errors, failed }"
          name="title"
          mode="passive"
          rules="required"
        >
          <input
            ref="titleField"
            v-model="formData.columnTitle"
            type="text"
            :placeholder="$t('placeholders.title')"
            :class="['kanban-board__form-control', { 'is-invalid': failed }]"
            @keyup.enter="submitTitleForm"
          />
          <div class="invalid-feedback">{{ errors[0] }}</div>
        </ValidationProvider>
      </div>
      <div class="kanban-board__column-footer">
        <button class="kanban-board__save-button" @click="submitTitleForm">
          {{ $t('buttons.saveColumn') }}
        </button>
        <div class="spacer"></div>
        <button class="kanban-board__close-button" @click="disableTitleForm">
          <img src="../assets/static/icons/cross.svg" alt />
        </button>
      </div>
    </template>
    <template v-else>
      <div class="kanban-board__column-header">
        <h4>{{ title }}</h4>
        <button class="kanban-board__icon-button" @click="deleteColumn">
          <img src="../assets/static/icons/delete.svg" alt />
        </button>
      </div>

      <Draggable
        v-model="columnItems"
        :class="[
          'kanban-board__cards-list',
          { 'kanban-board__cards-list--empty': !columnItems.length },
          { 'kanban-board__cards-list--dragging': isDragging },
        ]"
        tag="ul"
        group="cards"
        ghost-class="kanban-board__card-wrapper--ghost"
        drag-class="kanban-board__card-wrapper--drag"
        filter=".kanban-board__card-wrapper--edit-mode"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <KanbanBoardColumnCard
          v-for="(cardTitle, index) in columnItems"
          :key="index"
          :title="cardTitle"
          @update-card="(data) => updateCard(index, data)"
          @delete-card="() => deleteCard(index)"
        />
      </Draggable>

      <div v-if="showCardForm" class="kanban-board__column-block">
        <ValidationProvider
          ref="cardForm"
          v-slot="{ errors, failed }"
          name="card"
          mode="passive"
          rules="required"
        >
          <textarea
            ref="cardField"
            v-model="formData.cardTitle"
            :placeholder="$t('placeholders.card')"
            :class="[
              'kanban-board__form-control kanban-board__form-control--card-input',
              { 'is-invalid': failed },
            ]"
            @keyup.enter="submitCardForm"
          ></textarea>
          <div class="invalid-feedback">{{ errors[0] }}</div>
        </ValidationProvider>
      </div>

      <div class="kanban-board__column-footer">
        <template v-if="showCardForm">
          <button class="kanban-board__save-button" @click="submitCardForm">
            {{ $t('buttons.saveCard') }}
          </button>
          <div class="spacer"></div>
          <button class="kanban-board__close-button" @click="disableCardForm">
            <img src="../assets/static/icons/cross.svg" alt />
          </button>
        </template>
        <template v-else>
          <button class="kanban-board__add-button" @click="enableCardForm">
            <img src="../assets/static/icons/plus.svg" alt />
            {{ $t('buttons.addCard') }}
          </button>
        </template>
      </div>
    </template>
  </li>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import KanbanBoardColumnCard from './KanbanBoardColumnCard.vue';
import Draggable from 'vuedraggable';

export default {
  name: 'KanbanBoardColumn',

  components: {
    ValidationProvider,
    KanbanBoardColumnCard,
    Draggable,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isDragging: false,
      showCardForm: false,
      formData: {
        columnTitle: '',
        cardTitle: '',
      },
    };
  },

  computed: {
    columnItems: {
      get() {
        return this.cards;
      },
      set(cards) {
        this.$emit('update-column', { cards });
      },
    },
    showTitleForm() {
      return !this.title && !this.columnItems.length;
    },
  },

  mounted() {
    // set focus on the new column input field
    if (this.showTitleForm) {
      this.$refs.titleField.focus();
    }
  },

  methods: {
    disableTitleForm() {
      this.$emit('remove-column');
    },

    enableCardForm() {
      this.showCardForm = true;
      this.$nextTick(() => {
        this.$refs.cardField.focus();
      });
    },

    disableCardForm() {
      this.showCardForm = false;
      this.resetCardForm();
    },

    async submitTitleForm() {
      const validationResult = await this.$refs.titleForm.validate();

      if (validationResult.valid) {
        let title = this.formData.columnTitle;
        this.$emit('update-column', { title });
        this.resetTitleForm();
      }
    },

    async submitCardForm() {
      const validationResult = await this.$refs.cardForm.validate();

      if (validationResult.valid) {
        let cards = [...this.columnItems, this.formData.cardTitle];
        this.$emit('update-column', { cards });
        this.showCardForm = false;
        this.resetCardForm();
      }
    },

    updateCard(index, data) {
      let cards = this.columnItems
        .slice(0, index)
        .concat([data, ...this.columnItems.slice(index + 1)]);
      this.$emit('update-column', { cards });
    },

    deleteCard(index) {
      let cards = this.columnItems
        .slice(0, index)
        .concat(this.columnItems.slice(index + 1));
      this.$emit('update-column', { cards });
    },

    resetTitleForm() {
      this.formData.columnTitle = '';
      this.$refs.titleForm.reset();
    },

    resetCardForm() {
      this.formData.cardTitle = '';
      this.$refs.cardForm.reset();
    },

    deleteColumn() {
      const confirmationResult = confirm(this.$t('confirmation.column'));

      if (confirmationResult) {
        this.$emit('delete-column');
      }
    },
  },
};
</script>
