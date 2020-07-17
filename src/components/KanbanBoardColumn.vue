<template>
  <li class="kanban-board__column-wrapper">
    <div class="kanban-board__column">
      <template v-if="showTitleForm">
        <div class="kanban-board__column-block">
          <ValidationProvider
            ref="titleForm"
            v-slot="{ errors, failed, validate }"
            name="title"
            rules="required|uniqueColumnName"
            mode="lazy"
          >
            <input
              ref="titleField"
              v-model="formData.columnTitle"
              type="text"
              :placeholder="$t('placeholders.title')"
              :class="['kanban-board__form-control', { 'is-invalid': failed }]"
              @keydown.enter.prevent="submitTitleForm"
              @input="validate"
            />
            <div class="invalid-feedback">{{ errors[0] }}</div>
          </ValidationProvider>
        </div>
        <div class="kanban-board__column-footer">
          <button
            class="kanban-board__save-button active-element"
            @click="submitTitleForm"
          >
            {{ $t('buttons.saveColumn') }}
          </button>
          <div class="spacer"></div>
          <button
            class="kanban-board__close-button active-element"
            @click="disableTitleForm"
          >
            <img src="../assets/static/icons/cross.svg" alt="cross icon" />
          </button>
        </div>
      </template>
      <template v-else>
        <div class="kanban-board__column-header">
          <h4 class="kanban-board__column-title">{{ title | clipText }}</h4>
          <button
            class="kanban-board__icon-button active-element"
            @click="deleteColumn"
          >
            <img src="../assets/static/icons/delete.svg" alt="trash icon" />
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
          :filter="filterSelectors"
          :prevent-on-filter="false"
          :invert-swap="true"
          @start="onDragStart"
          @end="onDragEnd"
        >
          <KanbanBoardColumnCard
            v-for="card in columnItems"
            :key="card.id"
            :title="card.title"
            @update-card="(data) => updateCard(card.id, data)"
            @delete-card="() => deleteCard(card.id)"
          />
        </Draggable>

        <div v-if="showCardForm" class="kanban-board__column-block">
          <ValidationProvider
            ref="cardForm"
            v-slot="{ errors, failed, validate }"
            name="card"
            rules="required"
            mode="lazy"
          >
            <textarea
              ref="cardField"
              v-model="formData.cardTitle"
              :placeholder="$t('placeholders.card')"
              :class="[
                'kanban-board__form-control kanban-board__form-control--card-input',
                { 'is-invalid': failed },
              ]"
              @keydown.enter.prevent="submitCardForm"
              @input="validate"
            ></textarea>
            <div class="invalid-feedback">{{ errors[0] }}</div>
          </ValidationProvider>
        </div>

        <div class="kanban-board__column-footer">
          <template v-if="showCardForm">
            <button
              class="kanban-board__save-button active-element"
              @click="submitCardForm"
            >
              {{ $t('buttons.saveCard') }}
            </button>
            <div class="spacer"></div>
            <button
              class="kanban-board__close-button active-element"
              @click="disableCardForm"
            >
              <img src="../assets/static/icons/cross.svg" alt="cross icon" />
            </button>
          </template>
          <template v-else>
            <button
              class="kanban-board__add-button active-element"
              @click="enableCardForm"
            >
              <img src="../assets/static/icons/plus.svg" alt="plus icon" />
              {{
                columnItems.length
                  ? $t('buttons.addCard')
                  : $t('buttons.addFirstCard')
              }}
            </button>
          </template>
        </div>
      </template>

      <ModalWindow ref="confirmModal" :text="$t('confirmation.column')" />
    </div>
  </li>
</template>

<script>
import Draggable from 'vuedraggable';
import { ValidationProvider, extend } from 'vee-validate';
import KanbanBoardColumnCard from './KanbanBoardColumnCard.vue';
import ModalWindow from './ModalWindow.vue';

export default {
  name: 'KanbanBoardColumn',

  components: {
    Draggable,
    ValidationProvider,
    KanbanBoardColumnCard,
    ModalWindow,
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
      filterSelectors:
        '.kanban-board__form-control--edit-input, .kanban-board__card-actions, .modal',
    };
  },

  computed: {
    columns() {
      return this.$store.state.columns.map((column) => column.title);
    },
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

    // register custom validation rule
    extend('uniqueColumnName', (value) => {
      if (this.columns.indexOf(value) === -1) {
        return true;
      }

      return this.$t('validation.uniqueColumnName');
    });
  },

  methods: {
    disableTitleForm() {
      this.$emit('delete-column');
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
        this.$emit('store-column', { title });
        this.resetTitleForm();
      }
    },

    async submitCardForm() {
      const validationResult = await this.$refs.cardForm.validate();

      if (validationResult.valid) {
        let cards = [
          ...this.columnItems,
          { id: Date.now(), title: this.formData.cardTitle },
        ];
        this.$emit('update-column', { cards });
        this.showCardForm = false;
        this.resetCardForm();
      }
    },

    updateCard(id, data) {
      let index = this.columnItems.findIndex((card) => card.id === id);
      let cards = this.columnItems
        .slice(0, index)
        .concat([data, ...this.columnItems.slice(index + 1)]);

      this.$emit('update-column', { cards });
    },

    deleteCard(id) {
      let index = this.columnItems.findIndex((card) => card.id === id);
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
      this.$refs.confirmModal.open({}, () => {
        this.$emit('delete-column', true);
      });
    },

    onDragStart() {
      this.isDragging = true;
    },

    onDragEnd() {
      this.isDragging = false;
    },
  },
};
</script>
