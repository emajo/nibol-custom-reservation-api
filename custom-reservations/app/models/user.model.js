module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.ENUM("dev", "cs", "fix")
    },
    nibol_token: {
      type: Sequelize.TEXT
    },
    auth_token: {
      type: Sequelize.STRING
    },
  });

  return User;
};
