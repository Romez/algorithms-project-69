const search = (docs, str) => {
  const terms = {};
  for (let i = 0; i < docs.length; i += 1) {
    const words = docs[i].text.split(' ');
    for (let j = 0; j < words.length; j += 1) {
      const term = words[j].match(/\w+/g);
      if (!terms[term]) {
        terms[term] = [];
      }
      if (!terms[term].includes(docs[i])) {
        terms[term].push(docs[i]);
      }
    }
  }

  const strTerm = str.match(/\w+/g);
  return terms[strTerm]?.map((doc) => doc.id) || [];
};

export default search;
