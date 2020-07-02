let mutations = {
  storeColumn(state, { index, newColumn }) {
    state.columns.splice(index, 0, newColumn);
  },
  updateColumn(state, { index, newColumn }) {
    state.columns = state.columns
      .slice(0, index)
      .concat([newColumn, ...state.columns.slice(index + 1)]);
  },
  deleteColumn(state, { index }) {
    state.columns = state.columns
      .slice(0, index)
      .concat(state.columns.slice(index + 1));
  },
};

export default mutations;
