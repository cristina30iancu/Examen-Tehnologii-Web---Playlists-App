const { Playlist, Song } = require("../database/models");
const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");

// get Playlists with or without filtering two attributes/sorting by an attribute, desc or asc
// with pagination or not
app.get('/', async (req, res, next) => {
  try {
    const query = {}
    let pageSize = 2;
    const allowedFilters = ['data', 'descriere'];
    const filterKeys = Object.keys(req.query).filter(e => allowedFilters.indexOf(e) !== -1)
    if (filterKeys.length > 0) {
      query.where = {}
      for (const key of filterKeys) {
        if(key == 'data'){
          let nextD = parseInt(req.query[key])+1
          console.log(nextD)
          query.where[key] = {
            [Op.gte]: `%${req.query[key]}%`,
            [Op.lte]: `%${nextD}%`
          }
        } else{
        query.where[key] = {
          [Op.like]: `%${req.query[key]}%`
        }
      }
      }
    } if (req.query.sortOrder && req.query.sortOrder === '-1') {
      sortOrder = 'DESC'
    }

    if (req.query.pageSize) {
      pageSize = parseInt(req.query.pageSize)
    }
    if (req.query.sort) {
      query.order =  [[Sequelize.fn('lower', Sequelize.col(req.query.sort)), req.query.how ? req.query.how : 'ASC']]
    }
    if (!isNaN(parseInt(req.query.page))) {
      query.limit = pageSize
      query.offset = pageSize * parseInt(req.query.page)
    }
    const records = await Playlist.findAndCountAll(query);
        res.status(200).json(records);
  } catch (err) {
    console.log(err.message + ' '+req)
    next(err);
  }
});
// import
app.post('/import', async (request, response, next) => {
  try {
    const registry = {};
    for (let u of request.body) {
      if(u.descriere&&u.data){
      const playlist = await Playlist.create(u);
      if(u.Songs)
      for (let s of u.Songs) {
        const child = await Song.create(s);
        registry[s.id] = child;
        playlist.addSong(child);
      }
      await playlist.save();
    }
    }
    return response.send(204).json({ message: "Imported." });
  } catch (error) {
    next(error);
  }
});
// export
app.get('/export', async (request, response, next) => {
  try {
    const result = [];
    for (let obj of await Playlist.findAll()) {
      const playlist = {
        descriere: obj.descriere,
        data: obj.data,
        Songs: []
      };
      for (let c of await obj.getSongs()) {
        playlist.Songs.push({
          titlu: c.titlu,
          stil: c.stil,
          url: c.url
        });
      }
      result.push(playlist);
    }
    if (result.length > 0) {
      response.json(result);
    } else {
      response.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
});
// post Playlist
app.post("/", async (req, res, next) => {
  try {
    if (req.body.data && req.body.descriere) {
      await Playlist.create(req.body);
      res.status(201).json({ message: "Playlist Created!" });
    } else {
      res.status(400).json({ message: "Missing attributes!" });
    }
  } catch (err) {
    next(err);
  }
});
// get Playlist by id
app.get('/:PlaylistId', async (req, res, next) => {
  try {
    const playlist = await Playlist.findByPk(req.params.PlaylistId);
    if (playlist) {
      res.status(200).json(playlist);
    } else {
      res.status(404).json({ message: "Playlist not found!" });
    }
  } catch (err) {
    next(err);
  }
});
// update Playlist by id
app.put("/:PlaylistId", async (req, res, next) => {
  try {
    const playlist = await Playlist.findByPk(req.params.PlaylistId);
    if (playlist) {
      if (req.body.data && req.body.descriere) {
        await playlist.update(req.body);
        res.status(201).json({ message: "Update on Playlist is done." });
      } else {
        res.status(400).json({ message: "Malformed request!" });
      }
    } else {
      res.status(404).json({ message: "Playlist not found!" });
    }
  } catch (err) {
    next(err);
  }
});
// delete Playlist by id
app.delete("/:PlaylistId", async (req, res, next) => {
  try {
    const playlist = await Playlist.findByPk(req.params.PlaylistId);
    if (playlist) {
      const Songs = await playlist.getSongs();
      if (Songs && Songs.length > 0) {
        for (let mem of Songs) {
          await mem.destroy();
        }
      }
      await playlist.destroy();
      res.status(202).json({ message: "Playlist is gone :(" });
    } else {
      res.status(404).json({ message: "Playlist not found!" });
    }
  } catch (err) {
    next(err);
  }
});
module.exports = app;