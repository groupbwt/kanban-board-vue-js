<template>
  <div id="app" class="kanban-board">
    <KanbanBoard />
  </div>
</template>

<script>
import KanbanBoard from './components/KanbanBoard.vue';

export default {
  name: 'App',

  components: {
    KanbanBoard,
  },
};
</script>
