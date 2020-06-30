import ru from 'vee-validate/dist/locale/ru.json';

const translations = {
  buttons: {
    addColumn: 'Добавить еще одну колонку',
    addCard: 'Добавить еще одну карточку',
    saveColumn: 'Добавить колонку',
    saveCard: 'Добавить карточку',
  },
  fields: {
    title: "'Название колонки'",
    card: "'Название карточки'",
  },
  placeholders: {
    title: 'Введите название колонки',
    card: 'Введите название карточки',
  },
  validation: ru.messages,
  confirmation: {
    column: 'Вы уверены что хотите удалить эту колонку?',
    card: 'Вы уверены что хотите удалить эту карточку?',
  },
};

export default translations;
