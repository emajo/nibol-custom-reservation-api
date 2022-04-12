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
    default_desk: {
      type: Sequelize.STRING
    },
    launch_slot: {
      type: Sequelize.ENUM("12:30", "13:00", "13:30", "")
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
