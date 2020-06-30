let actions = {
  updateColumn({ commit }, payload) {
    commit('updateColumn', payload);
  },
  deleteColumn({ commit }, payload) {
    commit('deleteColumn', payload);
  },
};

export default actions;
