const search = (docs, s) => {
  const filtred = docs.filter(({ text }) => {
    const words = text.split(' ');
    return words.includes(s);
  });
  return filtred.map(({ id }) => id);
};

export default search;
