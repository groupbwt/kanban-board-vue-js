import en from 'vee-validate/dist/locale/en.json';

const translations = {
  buttons: {
    addFirstColumn: 'Add your first column',
    addColumn: 'Add another column',
    addFirstCard: 'Add your first card',
    addCard: 'Add another card',
    saveColumn: 'Add column',
    saveCard: 'Add card',
  },
  fields: {
    title: "'Column title'",
    card: "'Card title'",
  },
  placeholders: {
    title: 'Enter column title',
    card: 'Enter card title',
  },
  validation: en.messages,
  confirmation: {
    column: 'Are you sure you want to delete this column?',
    card: 'Are you sure you want to delete this card?',
  },
};

export default translations;
