module.exports = (sequelize, Sequelize) => {
  const TodoModel = sequelize.define('todo', {
    title: {
      type: Sequelize.STRING
    },
    done: {
      type: Sequelize.BOOLEAN
    }
  });

  return TodoModel;
};
