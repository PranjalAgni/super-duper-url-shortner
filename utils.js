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
  console.log(isRecord);

  if (isRecord) {
    return Promise.resolve({
      result: 'Not Unique'
    });
  } else {
    return Promise.reject({
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
      return await urls.insert({
        url: data.url,
        name: data.keyword,
        created: Date.now()
      });
    } else {
      return Promise.reject(isUnique.result);
    }
  } else {
    return Promise.reject(result.error);
  }
}

module.exports = {
  almostShorten
};
