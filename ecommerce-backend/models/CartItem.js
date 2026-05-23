import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const CartItem = sequelize.define('CartItem', {
  // userId comes from the JWT token (MongoDB user _id as string)
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Products', key: 'id' }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deliveryOptionId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: 'DeliveryOptions', key: 'id' }
  }
});
