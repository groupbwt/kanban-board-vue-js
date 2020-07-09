<template>
  <ul class="kanban-board__columns-list">
    <KanbanBoardColumn
      v-for="column in kanbanBoard"
      :key="column.id"
      :title="column.title"
      :cards="column.cards"
      @store-column="(data) => storeColumn(column.id, data)"
      @update-column="(data) => updateColumn(column.id, data)"
      @delete-column="(save) => deleteColumn(column.id, save)"
    />

    <li class="kanban-board__column">
      <div class="kanban-board__column-footer">
        <button
          class="kanban-board__add-button active-element"
          @click="addColumn"
        >
          <img src="../assets/static/icons/plus.svg" alt="plus icon" />
          {{
            kanbanBoard.length
              ? $t('buttons.addColumn')
              : $t('buttons.addFirstColumn')
          }}
        </button>
      </div>
    </li>
  </ul>
</template>

<script>
import KanbanBoardColumn from './KanbanBoardColumn.vue';

export default {
  name: 'KanbanBoard',

  components: {
    KanbanBoardColumn,
  },

  data() {
    return {
      kanbanBoard: [],
    };
  },

  computed: {
    columns() {
      return this.$store.state.columns;
    },
  },

  created() {
    this.kanbanBoard = this.columns;
  },

  methods: {
    addColumn() {
      this.kanbanBoard = [
        ...this.kanbanBoard,
        {
          id: Date.now(),
          title: '',
          cards: [],
        },
      ];
    },

    storeColumn(id, data) {
      let index = this.kanbanBoard.findIndex((column) => column.id === id);
      let newColumn = Object.assign({}, this.kanbanBoard[index], data);

      this.$store.dispatch('storeColumn', { index, newColumn });
      this.updateKanbanBoard(index, newColumn);
    },

    updateColumn(id, data) {
      let index = this.kanbanBoard.findIndex((column) => column.id === id);
      let newColumn = Object.assign({}, this.kanbanBoard[index], data);

      this.$store.dispatch('updateColumn', { index, newColumn });
      this.updateKanbanBoard(index, newColumn);
    },

    deleteColumn(id, save = false) {
      let index = this.kanbanBoard.findIndex((column) => column.id === id);

      if (save) {
        this.$store.dispatch('deleteColumn', { index });
      }

      this.updateKanbanBoard(index);
    },

    updateKanbanBoard(index, newColumn = null) {
      if (!newColumn) {
        this.kanbanBoard = this.kanbanBoard
          .slice(0, index)
          .concat(this.kanbanBoard.slice(index + 1));
      } else {
        this.kanbanBoard = this.kanbanBoard
          .slice(0, index)
          .concat([newColumn, ...this.kanbanBoard.slice(index + 1)]);
      }
    },
  },
};
</script>
