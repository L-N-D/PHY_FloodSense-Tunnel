import app from './app';
import dotenv from 'dotenv';
import connectDB from './config/db.config';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 2706;

app.get('/', (req, res) => {res.send('Backend is running');});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));