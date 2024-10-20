const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const draftRoute = require('./drafts');
const alertRoute = require('./alerts');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/drafts', draftRoute);
app.use('/api/alerts', alertRoute);

app.use((req, res, next) => {
  console.log('Current user id:', req.user?.uid);
  next();
});

// Set COOP headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoD connected'))
.catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Note-taking App API');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
