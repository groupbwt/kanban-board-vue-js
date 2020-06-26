<template>
  <ul class="kanban-board__columns-list">
    <KanbanBoardColumn
      v-for="(column, index) in columns"
      :key="index"
      :title="column.title"
      :cards="column.cards"
      @update-column="(data) => updateColumn(index, data)"
      @delete-column="() => deleteColumn(index)"
    />

    <li class="kanban-board__column">
      <div class="kanban-board__column-footer">
        <button class="kanban-board__add-button" @click="addColumn">
          <img src="../assets/static/icons/plus.svg" alt="">{{ $t("buttons.addColumn") }}
        </button>
      </div>
    </li>
  </ul>
</template>

<script>
import KanbanBoardColumn from "./KanbanBoardColumn.vue";

export default {
  name: 'KanbanBoard',

  components: {
    KanbanBoardColumn
  },

  computed: {
    columns() {
      return this.$store.state.columns;
    }
  },

  methods: {
    addColumn() {
      let columns = [...this.columns, {
        title: '',
        cards: []
      }];
      this.setColumns(columns);
    },

    updateColumn(index, data) {
      let newColumn = Object.assign({}, this.columns[index], data);
      let columns = this.columns.slice(0, index).concat([newColumn, ...this.columns.slice(index + 1)]);
      this.setColumns(columns);
    },

    deleteColumn(index) {
      let columns = this.columns.slice(0, index).concat(this.columns.slice(index + 1));
      this.setColumns(columns);
    },

    setColumns(columns) {
      this.$store.dispatch('setColumns', { columns });
    }
  }
}
</script>