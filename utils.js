const config = require('./config');
const monk = require('monk');
const Joi = require('joi');
const db = monk(config.url);
db.then(() => {
  console.log('Connected correctly to server');
});
const urls = db.get('urls');

const schema = Joi.object()
  .keys({
    url: Joi.string().uri({
      scheme: [/https?/]
    }),
    name: Joi.string()
      .token()
      .min(1)
      .max(100)
      .required()
  })
  .with('name', 'url');

async function checkUnique(data) {
  const isRecord = await urls.findOne({
    name: data.keyword
  });

  if (isRecord) {
    return Promise.resolve({
      result: 'Not Unique'
    });
  } else {
    return Promise.resolve({
      result: 'good'
    });
  }
}
async function almostShorten(data) {
  const result = Joi.validate(
    {
      url: data.url,
      name: data.keyword
    },
    schema
  );

  if (result.error == null) {
    const isUnique = await checkUnique(data);
    console.log('Isunique result', isUnique);
    if (isUnique.result === 'good') {
      console.log('unique proved...');
      return await urls.insert({
        url: data.url,
        name: data.keyword,
        created: Date.now()
      });
    } else {
      return Promise.resolve(isUnique.result);
    }
  } else {
    return Promise.reject(result.error);
  }
}

async function sendBackUrl(keyword) {
  const myRecord = await urls.findOne({
    name: keyword
  });

  if (myRecord) {
    return Promise.resolve({
      result: 'Found',
      url: myRecord.url
    });
  } else {
    return Promise.reject({
      result: 'Not Found'
    });
  }
}

module.exports = {
  almostShorten,
  sendBackUrl
};
