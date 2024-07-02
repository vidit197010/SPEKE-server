const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('SPEKE Server is running');
});

// A simple in-memory key store
const keyStore = {
  'example-resource': {
    'content-123': {
      keyId: 'example-key-id',
      key: 'example-key'
    }
  }
};

const generateKey = (contentId) => {
  return {
    keyId: crypto.randomBytes(16).toString('hex'),
    key: crypto.randomBytes(16).toString('base64')
  };
};

app.post('/speke', (req, res) => {
  const { contentId, systemIds, resourceId } = req.body;

  if (!contentId || !systemIds || !resourceId) {
    return res.status(400).send('ContentId, SystemIds, and ResourceId are required');
  }

  let keys = keyStore[resourceId]?.[contentId];

  if (!keys) {
    keys = generateKey(contentId);
    if (!keyStore[resourceId]) {
      keyStore[resourceId] = {};
    }
    keyStore[resourceId][contentId] = keys;
  }

  const responseKeys = systemIds.map(systemId => ({
    systemId: systemId,
    keyId: keys.keyId,
    key: keys.key
  }));

  res.json({ keys: responseKeys });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`SPEKE Server is running on port ${port}`);
});
