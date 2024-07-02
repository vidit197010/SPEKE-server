const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('SPEKE Server is running');
});

// Sample in-memory key store with pre-populated data
const keyStore = {
  'example-resource': {
    'content-123': {
      keyId: 'example-key-id-123',
      key: 'example-key-123'
    },
    'content-456': {
      keyId: 'example-key-id-456',
      key: 'example-key-456'
    }
  },
  'another-resource': {
    'content-789': {
      keyId: 'another-key-id-789',
      key: 'another-key-789'
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
  const { systemIds, resourceId } = req.body;

  if (!systemIds || !resourceId) {
    console.error('Invalid request:', req.body);
    return res.status(400).send('SystemIds and ResourceId are required');
  }

  // Parse resourceId to extract resource and contentId
  const [resource, contentId] = resourceId.split('|');

  if (!contentId) {
    console.error('ContentId not found in ResourceId');
    return res.status(400).send('ContentId not found in ResourceId');
  }

  console.log('Received request:', req.body);

  let keys = keyStore[resource]?.[contentId];

  if (!keys) {
    keys = generateKey(contentId);
    if (!keyStore[resource]) {
      keyStore[resource] = {};
    }
    keyStore[resource][contentId] = keys;
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
