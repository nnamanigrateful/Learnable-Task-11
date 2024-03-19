import mongoose from 'mongoose';
const mongoose = mongoose()

const roomSchema = new mongoose.Schema({
  name: String,
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType',
  },
  price: Number,
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;