const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');


const Playlist = sequelize.define('Playlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descriere: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 100]
    }
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: { error: 'Must be a valid date!' },
    },
  }
})

const Song = sequelize.define('Song', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titlu: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { error: 'Song must have a name!' },
      notEmpty: { error: 'name must not be empty!' },
      len: [5, 50]
    }
  },url:{
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl:true
    }
  }, stil: {
    type: DataTypes.ENUM('POP', 'ALTERNATIVE','ROCK','JAZZ','FOLK'),
    allowNull: false
  }
});

module.exports = {  Playlist, Song };


