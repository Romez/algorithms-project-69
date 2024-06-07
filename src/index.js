const tokenize = (str) => str.match(/\w+/g).map((s) => s.toLowerCase());

const search = (docs, query) => {
  const index = {};
  const weights = {};

  for (let i = 0; i < docs.length; i += 1) {
    const doc = docs[i];
    const { id, text } = doc;
    const docTerms = tokenize(text);
    for (let j = 0; j < docTerms.length; j += 1) {
      const term = docTerms[j];

      if (!index[term]) {
        index[term] = new Set();
      }
      index[term].add(id);

      if (!weights[term]) {
        weights[term] = {};
      }

      if (!weights[term][id]) {
        weights[term][id] = 0;
      }

      weights[term][id] += 1;
    }
  }

  const queryTerms = tokenize(query);

  const termDocs = queryTerms.reduce((acc, term) => {
    if (!index[term]) {
      return acc;
    }

    return Array.from(index[term]).reduce((currAcc, id) => {
      const weight = weights[term][id];
      if (!currAcc[id] || currAcc[id] < weight) {
        return { ...currAcc, [id]: weight };
      }
      return currAcc;
    }, acc);
  }, {});

  const items = Object.entries(termDocs);

  items.sort((a, b) => (b[1] - a[1]));

  return items.map((a) => a[0]) || [];
};

export default search;
