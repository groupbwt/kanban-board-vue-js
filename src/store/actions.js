let actions = {
  storeColumn({ commit }, payload) {
    commit('storeColumn', payload);
  },
  updateColumn({ commit }, payload) {
    commit('updateColumn', payload);
  },
  deleteColumn({ commit }, payload) {
    commit('deleteColumn', payload);
  },
};

export default actions;
