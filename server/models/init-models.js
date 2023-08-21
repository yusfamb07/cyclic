import Sequelize from "sequelize";
import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _carts from  "./carts.js";
import _categories from  "./categories.js";
import _form_payment from  "./form_payment.js";
import _payment_method from  "./payment_method.js";
import _products from  "./products.js";
import _roles from  "./roles.js";
import _users from  "./users.js";

import config from "../config/config.js";

const sequelize = new Sequelize(
config.db_name,
config.db_username,
config.db_password,
{
  logging : false,
  host: config.db_host, 
  dialect: 'postgres',
  pool : {
    max : 5,
    min : 0,
    acquire : 30000,
    idle : 10000,
  }
}
)

const initModels = (sequelize) => {
  const carts = _carts.init(sequelize, DataTypes);
  const categories = _categories.init(sequelize, DataTypes);
  const form_payment = _form_payment.init(sequelize, DataTypes);
  const payment_method = _payment_method.init(sequelize, DataTypes);
  const products = _products.init(sequelize, DataTypes);
  const roles = _roles.init(sequelize, DataTypes);
  const users = _users.init(sequelize, DataTypes);

  products.belongsTo(categories, { as: "prod_cate", foreignKey: "prod_cate_id"});
  categories.hasMany(products, { as: "products", foreignKey: "prod_cate_id"});
  carts.belongsTo(products, { as: "cart_prod", foreignKey: "cart_prod_id"});
  products.hasMany(carts, { as: "carts", foreignKey: "cart_prod_id"});
  users.belongsTo(roles, { as: "user_role", foreignKey: "user_role_id"});
  roles.hasMany(users, { as: "users", foreignKey: "user_role_id"});
  carts.belongsTo(users, { as: "cart_user", foreignKey: "cart_user_id"});
  users.hasMany(carts, { as: "carts", foreignKey: "cart_user_id"});
  form_payment.belongsTo(users, { as: "fopa_user", foreignKey: "fopa_user_id"});
  users.hasMany(form_payment, { as: "form_payments", foreignKey: "fopa_user_id"});

  return {
    carts,
    categories,
    form_payment,
    payment_method,
    products,
    roles,
    users,
  };
}

const models = initModels(sequelize);

export default models;
export {sequelize};