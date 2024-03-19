import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import RoomType from './roomType.js';
import Room from './room.js';

const app = express();
bodyParser.urlencoded({extended:true})
const PORT = 3000;
const MONGODB_URI = 'mongodb://localhost//HotelManagement';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


app.use(bodyParser.json());

app.post('/api/v1/rooms-types', async (req, res) => {
  try {
    const { name } = req.body;
    const roomType = await RoomType.create({ name });
    res.status(201).json(roomType);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/v1/rooms-types', async (req, res) => {
  try {
    const roomTypes = await RoomType.find();
    res.json(roomTypes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/v1/rooms', async (req, res) => {
  try {
    const { name, roomType, price } = req.body;
    const room = await Room.create({ name, roomType, price });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/v1/rooms', async (req, res) => {
  try {
    const { search, roomType, minPrice, maxPrice } = req.query;
    const filters = {};
    if (search) filters.name = new RegExp(search, 'i');
    if (roomType) filters.roomType = roomType;
    if (minPrice) filters.price = { $gte: minPrice };
    if (maxPrice) {
      filters.price = { ...filters.price, $lte: maxPrice };
    } else if (minPrice && !maxPrice) {
      filters.price = { $gte: minPrice, $lte: 0 };
    }
    const rooms = await Room.find(filters);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.patch('/api/v1/rooms/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { name, roomType, price } = req.body;
    const room = await Room.findByIdAndUpdate(roomId, { name, roomType, price }, { new: true });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/v1/rooms/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    await Room.findByIdAndDelete(roomId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/v1/rooms/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});