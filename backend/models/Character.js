// models/Character.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Character = sequelize.define('Character', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageWebp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageJpeg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fallbackAvatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    gallery: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    premiumPhotos: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    premiumVideos: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });

  return Character;
};
