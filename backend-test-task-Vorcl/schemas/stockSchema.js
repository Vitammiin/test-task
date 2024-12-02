const stockSchema = {
  querystring: {
    type: 'object',
    properties: {
      symbol: { type: 'string' },
      country: { type: 'string', default: 'US' },
    },
    required: ['symbol'],
  },
};

module.exports = { stockSchema };
