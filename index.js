require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello, Express app is working!');
});
connectDB();
app.use('/api', apiRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
;
