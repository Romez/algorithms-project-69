const search = (docs, str) => {
  const terms = {};

  for (let i = 0; i < docs.length; i += 1) {
    const words = docs[i].text.split(' ');
    for (let j = 0; j < words.length; j += 1) {
      const term = words[j].match(/\w+/g);
      if (!terms[term]) {
        terms[term] = {};
      }
      const doc = docs[i];
      const { id } = doc;

      if (!terms[term][id]) {
        terms[term][id] = { doc: docs[i], weight: 1 };
      } else {
        terms[term][id].weight += 1;
      }
    }
  }

  const strTerm = str.match(/\w+/g);

  const termDocs = terms[strTerm];
  if (!termDocs) {
    return [];
  }

  const items = Object.values(termDocs);
  items.sort((a, b) => {
    if (a.weight > b.weight) {
      return -1;
    }
    if (a.weight < b.weight) {
      return 1;
    }
    return 0;
  });

  return items.map(({ doc }) => doc.id) || [];
};

export default search;
