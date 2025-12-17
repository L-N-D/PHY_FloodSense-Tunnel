// index.js
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
import './mqtt/mqtt.client.js'; // NEW: tự động connect MQTT
import http from 'http';
import { initSocket } from './services/socket.service.js';

dotenv.config();

await connectDB();

const PORT = process.env.PORT || 1307;

const server = http.createServer(app);
initSocket(server);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
