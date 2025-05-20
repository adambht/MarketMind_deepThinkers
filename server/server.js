require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./utils/errorHandler');
const speakersRouter = require('./routes/speakers');
const textRoutes = require('./routes/TextRoutes');
const sentimentRoutes = require('./routes/sentimentRoutes');
const bodyParser = require('body-parser');
const tunisianAdRoutes = require('./routes/tunisianAdRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const path = require('path');
const imageRoutes = require('./routes/imageRoutes');







const app = express();


const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',  // React dev server
      'http://127.0.0.1:3000', 
      'http://localhost:5000',  // Express backend
      'http://127.0.0.1:5000'
    ];
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
};
// Middleware
app.use(cors(corsOptions));

app.options('/api/tts', cors(corsOptions));


app.use(bodyParser.json());

// Create audio storage directory if it doesn't exist
const audioDir = path.join(__dirname, 'server/audio-storage');

app.use('/audio-files', express.static(path.join(__dirname, 'audio-storage')));





app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data


// Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', textRoutes);  // Now accessible at /api/generate-text
app.use('/api', sentimentRoutes);
app.use('/api/speakers', speakersRouter);
app.use('/api/tts', require('./routes/tts'));
app.use('/api/audio-files', require('./routes/audioFiles'));
app.use('/api/tunisian-ad', tunisianAdRoutes);
// Register routes
app.use('/api', recommendationRoutes);

app.use('/generate', imageRoutes);



// Error Handling
app.use(errorHandler);






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));