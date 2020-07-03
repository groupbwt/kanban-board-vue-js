<template>
  <ul class="kanban-board__columns-list">
    <KanbanBoardColumn
      v-for="(column, index) in kanbanBoard"
      :key="index"
      :title="column.title"
      :cards="column.cards"
      @store-column="(data) => storeColumn(index, data)"
      @update-column="(data) => updateColumn(index, data)"
      @delete-column="(save) => deleteColumn(index, save)"
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
          title: '',
          cards: [],
        },
      ];
    },

    storeColumn(index, data) {
      let newColumn = Object.assign({}, this.kanbanBoard[index], data);
      this.$store.dispatch('storeColumn', { index, newColumn });
      this.updateKanbanBoard(index, newColumn);
    },

    updateColumn(index, data) {
      let newColumn = Object.assign({}, this.kanbanBoard[index], data);
      this.$store.dispatch('updateColumn', { index, newColumn });
      this.updateKanbanBoard(index, newColumn);
    },

    deleteColumn(index, save = false) {
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
