"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidRole(roleValue) {
            const acceptedRoles = ["owner", "admin", "client"];
            if (!acceptedRoles.includes(roleValue)) {
              throw new Error(`Model: User: ${roleValue} is not a valid role`);
            }
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 20],
          hasSpaces(pass) {
            const removedSpace = pass
              .split("")
              .filter((char) => char !== " ")
              .join("");
            if (pass !== removedSpace) {
              throw new Error(
                "Model: User: password must not contain any spaces"
              );
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
