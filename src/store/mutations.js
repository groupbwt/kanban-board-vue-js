let mutations = {
  updateColumn(state, { index, data }) {
    let newColumn = Object.assign({}, state.columns[index], data);
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
