const tokenize = (str) => str.match(/\w+/g).map((s) => s.toLowerCase());

const search = (docs, query) => {
  const terms = {};

  for (let i = 0; i < docs.length; i += 1) {
    const doc = docs[i];
    const { id } = doc;
    const docTerms = tokenize(docs[i].text);
    for (let j = 0; j < docTerms.length; j += 1) {
      const term = docTerms[j];
      if (!terms[term]) {
        terms[term] = {};
      }

      if (!terms[term][id]) {
        terms[term][id] = { doc, weight: 1 };
      } else {
        terms[term][id].weight += 1;
      }
    }
  }

  // terms {
  //   i: {
  //     doc1: { doc: [Object], weight: 2 },
  //     doc3: { doc: [Object], weight: 1 }
  //   },
  //   can: { doc1: { doc: [Object], weight: 1 } },
  //   t: {
  //     doc1: { doc: [Object], weight: 1 },
  //     doc2: { doc: [Object], weight: 1 }
  //   },
  //   shoot: {
  //     doc1: { doc: [Object], weight: 1 },
  //     doc2: { doc: [Object], weight: 3 }
  //   },
  //   straight: { doc1: { doc: [Object], weight: 1 } },
  //   unless: { doc1: { doc: [Object], weight: 1 } },
  //   ve: { doc1: { doc: [Object], weight: 1 } },
  //   had: { doc1: { doc: [Object], weight: 1 } },
  //   a: { doc1: { doc: [Object], weight: 1 } },
  //   pint: { doc1: { doc: [Object], weight: 1 } },
  //   don: { doc2: { doc: [Object], weight: 1 } },
  //   that: { doc2: { doc: [Object], weight: 1 } },
  //   thing: { doc2: { doc: [Object], weight: 1 } },
  //   at: { doc2: { doc: [Object], weight: 1 } },
  //   me: { doc2: { doc: [Object], weight: 1 } },
  //   m: { doc3: { doc: [Object], weight: 1 } },
  //   your: { doc3: { doc: [Object], weight: 1 } },
  //   shooter: { doc3: { doc: [Object], weight: 1 } }
  // }

  const queryTerms = tokenize(query);

  const found = {};

  const termDocs = queryTerms.reduce((acc, queryTerm) => {
    if (!terms[queryTerm]) {
      return acc;
    }

    return Object.entries(terms[queryTerm]).reduce((currAcc, [id, { doc, weight }]) => {
      if (!currAcc[id] || currAcc[id].weight < weight) {
        return { ...currAcc, [id]: { doc, weight } };
      }
      return currAcc;
    }, acc);
  }, {});

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
