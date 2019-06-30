const express = require('express');
const app = express();
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const utils = require('./utils');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15
});

app.set('views', path.join(__dirname, '/public'));

app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(compression());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/try', (req, res) => {
  res.render('index-react');
});
app.get('/:key', async (req, res) => {
  try {
    const keyword = req.params.key;

    const myUrl = await utils.sendBackUrl(keyword);
    res.redirect(myUrl.url);
  } catch (error) {
    res.status(404).json({
      code: 'This url does not exists....'
    });
  }
});

app.post('/api/url', async (req, res) => {
  try {
    const result = await utils.almostShorten(req.body);

    if (result.url) {
      await res.status(201).json({
        success: true,
        url: req.body.url
      });
    } else {
      await res.status(502).json({
        success: false
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
