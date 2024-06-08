const tokenize = (text) => text.toLowerCase().match(/\w+/g).map((s) => s.toLowerCase());

const search = (docs, query) => {
  if (docs.length === 0) {
    return [];
  }
  const index = {};
  const weights = {};
  const stats = {};

  docs.forEach(({ id, text }) => {
    const terms = tokenize(text);
    terms.forEach((term) => {
      if (!index[term]) {
        index[term] = new Set();
      }
      index[term].add(id);

      if (!stats[term]) {
        stats[term] = {};
      }

      if (!stats[term][id]) {
        stats[term][id] = { total: terms.length, count: 0 };
      }

      stats[term][id].count += 1;
    });
  });

  Object.keys(stats).forEach((term) => {
    Object.keys(stats[term]).forEach((id) => {
      const termStats = stats[term][id];
      const tf = termStats.count / termStats.total;

      const termCount = index[term].size;
      const docsCount = docs.length;
      const idf = Math.log2(1 + (docsCount - termCount + 1) / (termCount + 0.5));

      if (!weights[term]) {
        weights[term] = 0;
      }
      weights[term] = Math.max(weights[term], tf * idf);
    });
  });

  const queryTerms = tokenize(query);

  const docsWithTerm = queryTerms.reduce((acc, term) => {
    index[term].forEach((id) => {
      if (!acc[id]) {
        acc[id] = 0;
      }
      acc[id] += weights[term];
    });
    return acc;
  }, {});

  const items = Object.entries(docsWithTerm);

  items.sort((a, b) => (b[1] - a[1]));

  return items.map((a) => a[0]) || [];
};

export default search;
