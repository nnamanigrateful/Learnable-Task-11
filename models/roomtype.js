import mongoose from 'mongoose';
const mongoose = mongoose()

const roomTypeSchema = new mongoose.Schema({
  name: String,
});

const RoomType = mongoose.model('RoomType', roomTypeSchema);

module.exports = RoomType;