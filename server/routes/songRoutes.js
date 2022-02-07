const { Song, Playlist } = require("../database/models");
const express = require('express');
const app = express();

//gets all Songs of a certain Playlist
app.get('/Playlists/:PlaylistId',async (req, res, next) => {
  try {
    const playlist = await Playlist.findByPk(req.params.PlaylistId);
      if (playlist) {
        const Songs =  await playlist.getSongs(); 
        if(Songs && Songs.length>0){
          res.json(Songs);
        }
        else res.json([]);
      } else res.status(404).json({ message: "No such Playlist." });
  } catch (err) {
    next(err);
  }
}); 
// post Song to a certain Playlist
app.post('/Playlists/:PlaylistId', async (req, res, next) => {
  try {
    const playlist = await Playlist.findByPk(req.params.PlaylistId);
    if(!playlist) res.status(404).json({message:"No such Playlist."});
    if(req.body.stil &&req.body.titlu&&req.body.url){
      const obj = await Song.create(req.body);
      playlist.addSong(obj);
      await playlist.save();
      res.status(201).json({ message: "Song Created!" });
    } else {
      res.status(400).json({ error: "Malformed request!" });
    }
  } catch (err) {
    next(err);
  }
});
// get Song by id
app.get('/:SongId/Playlists/:PlaylistId', async (req, res, next) => {
  try {
    const playlist = await Playlist.findByPk(req.params.PlaylistId);
    if(!playlist) res.status(404).json({message:"No such Playlist."});
    const song = await Song.findByPk(req.params.SongId);
    if(!song) res.status(404).json({message:"No such Song."});
    const found = await Song.findOne({where: {PlaylistId : req.params.PlaylistId, id:req.params.SongId}})
    if(found) res.json(found);
    else res.status(404).json({message:`Song ${req.params.SongId} doesn't belong to Playlist ${req.params.PlaylistId}`});
  } catch (err) {
    next(err);
  }
});
// update Song by id
app.put('/:SongId/Playlists/:PlaylistId', async (req, res, next) => {
  try {
    const playlist = await Playlist.findByPk(req.params.PlaylistId);
    if(!playlist) res.status(404).json({message:"No such Playlist."});
    const song = await Song.findByPk(req.params.SongId);
    if(!song) res.status(404).json({message:"No such Song."});
    const found = await Song.findOne({where: {PlaylistId : req.params.PlaylistId,id:req.params.SongId}})
    if(found){
      if(req.body.stil &&req.body.titlu&&req.body.url){
        await found.update(req.body);
        res.status(201).json({ message: "Update on Song is done." });
      } else {
        res.status(400).json({ error: "Malformed request!" });
      }
    }
    else res.status(404).json({message:`Song ${req.params.SongId} doesn't belong to Playlist ${req.params.PlaylistId}`});
  } catch (err) {
    next(err);
  }
});
// delete Song by id
app.delete('/:SongId/Playlists/:PlaylistId', async (req, res, next) => {
  try {
    const playlist = await Playlist.findByPk(req.params.PlaylistId);
    if(!playlist) res.status(404).json({message:"No such Playlist."});
    const song = await Song.findByPk(req.params.SongId);
    if(!song) res.status(404).json({message:"No such Song."});
    const found = await Song.findOne({where: {PlaylistId : req.params.PlaylistId}})
    if(found){
      await found.destroy();
      res.status(202).json({ message: "Song deleted" });
    }
    else res.status(404).json({message:`Song ${req.params.SongId} doesn't belong to Playlist ${req.params.PlaylistId}`});
  } catch (err) {
    next(err);
  }
});

// optional:
// get all existent Songs
app.get('/', async (req, res, next) => {
  try {
    const Songs = await Song.findAll();
    res.status(200).json(Songs);
  } catch (err) {
    next(err);
  }
});
module.exports=app;