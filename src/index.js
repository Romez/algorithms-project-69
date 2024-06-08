const tokenize = (text) => text.toLowerCase().match(/\b\w+\b/g);

const search = (docs, query) => {
  const reverseIndex = {}; // {term: [docId, ...]}
  const termInDocIndex = {}; // {docId: {term: N}}
  const termsCountInDoc = {}; // {docId: N}

  docs.forEach(({ id, text }) => {
    const terms = tokenize(text);
    termsCountInDoc[id] = terms.length;
    termInDocIndex[id] = {};

    terms.forEach((term) => {
      if (!reverseIndex[term]) {
        reverseIndex[term] = new Set();
      }
      if (!termInDocIndex[id][term]) {
        termInDocIndex[id][term] = 0;
      }
      reverseIndex[term].add(id);
      termInDocIndex[id][term] += 1;
    });
  });

  const queryTerms = tokenize(query);

  const weights = {}; // {term: 4}

  queryTerms.forEach((term) => {
    reverseIndex[term]?.forEach((id) => {
      const termCountInDoc = termInDocIndex[id][term];
      const docSize = termsCountInDoc[id];
      const tf = termCountInDoc / docSize;

      const termCount = reverseIndex[term].size;
      const docsCount = docs.length;
      const idf = Math.log(1 + (docsCount - termCount + 1) / (termCount + 0.5));
      weights[id] = (weights[id] || 0) + (tf * idf);
    });
  });

  const items = Object.entries(weights);
  items.sort((a, b) => (b[1] - a[1]));

  return items.map((a) => a[0]) || [];
};

export default search;
