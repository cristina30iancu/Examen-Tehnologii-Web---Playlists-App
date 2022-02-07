const express = require('express');
const cors = require("cors");
const path= require('path')
const sequelize = require('./database/sequelize');
const port = process.env.PORT || 3000;
const { Playlist, Song} = require('./database/models');
const playlists = require('./routes/playRoutes');
const songs = require('./routes/songRoutes');

const pg = require('pg');
const server = express();
server.use(express.urlencoded({ extended: true, }) );
server.use(express.static(path.join(__dirname,'build')))
server.use(express.json());
server.use(cors());

// if(process.env.DATABASE_URL){
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  }
});
client.connect();
client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
      console.log(JSON.stringify(row));
  }
  client.end();
});


server.listen(port, function() {
    console.log("Listening on port " + port + "...");
});

Playlist.hasMany(Song);
Song.belongsTo(Playlist);

server.get("/create", async (req, res, next) => {
    try {
      await sequelize.sync({ force: true });
      res.status(201).json({ message: "Database created." });
    } catch (err) {
      next(err);
    }
});

server.use('/playlists',playlists);
server.use('/songs',songs);
server.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'build','index.html'));
});