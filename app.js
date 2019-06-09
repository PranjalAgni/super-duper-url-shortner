const express = require('express');
const app = express();
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const utils = require('./utils');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(limiter);
app.use(compression());
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/api/url', async (req, res) => {
  try {
    const result = await utils.almostShorten(req.body);
    if (result.url) {
      await res.status(200).json({
        success: true,
        url: req.body.url
      });
    } else {
      await res.status(404).json({
        success: false
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false
    });
  }
});

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
