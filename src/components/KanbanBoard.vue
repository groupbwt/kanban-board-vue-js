<template>
  <ul class="kanban-board__columns-list">
    <KanbanBoardColumn
      v-for="(column, index) in kanbanBoard"
      :key="index"
      :title="column.title"
      :cards="column.cards"
      @update-column="(data) => updateColumn(index, data)"
      @delete-column="() => deleteColumn(index)"
    />

    <li class="kanban-board__column">
      <div class="kanban-board__column-footer">
        <button class="kanban-board__add-button" @click="addColumn">
          <img src="../assets/static/icons/plus.svg" alt />
          {{ $t('buttons.addColumn') }}
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

  watch: {
    columns() {
      this.kanbanBoard = this.columns;
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

    updateColumn(index, data) {
      let newColumn = Object.assign({}, this.kanbanBoard[index], data);
      this.$store.dispatch('updateColumn', { index, newColumn });
    },

    deleteColumn(index) {
      this.$store.dispatch('deleteColumn', { index });
    },
  },
};
</script>
