import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Products', key: 'id' }
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true   // allow guest reviews if you want
  },
  reviewerName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Anonymous'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});