import app from './app.js'
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 1307;

app.get('/', (req, res) => {res.send('Backend is running');});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));