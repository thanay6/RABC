import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string | null;
  role: string;
  phone_number: string;
}

// Sequelize requires some attributes to be optional when creating a model
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

// Extending Model with UserAttributes and UserCreationAttributes
export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public phone_number!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const UserModel = (sequelize: Sequelize): typeof User => {
  const user = User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true, // Ensuring email uniqueness
      },
      password: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING(10), // Adjusted length for country code
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(15), // Adjusted length for phone number
        allowNull: true,
      },
    },
    {
      sequelize, // Use the Sequelize instance from db_connections
      tableName: "users",
      freezeTableName: true,
    }
  );
  return user;
};

export default UserModel;
