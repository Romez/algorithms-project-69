// @ts-check
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { expect, test } from '@jest/globals';
import search from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (name) => path.join(__dirname, '..', '__fixtures__', name);

const getDocumentText = async (id) => {
  const documentPath = getFixturePath(id);
  const text = await fs.readFile(documentPath, 'utf8');
  return { id, text };
};

test('search empty', () => {
  expect(search([], 'shoot')).toEqual([]);
});

test('search term', () => {
  const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
  const docs = [doc1];
  expect(search(docs, 'pint')).toEqual(['doc1']);
  expect(search(docs, 'pint!')).toEqual(['doc1']);
});

test('fuzzy search', () => {
  const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
  const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
  const doc3 = { id: 'doc3', text: "I'm your shooter." };
  const docs = [doc1, doc2, doc3];

  expect(search(docs, 'shoot at me')).toEqual(['doc2', 'doc1']);
});

test('simple search', async () => {
  const searchText = 'trash island';
  const docIds = ['garbage_patch_NG', 'garbage_patch_ocean_clean', 'garbage_patch_wiki'];

  const documentsPaths = await Promise.all(docIds.map(getDocumentText));
  const result = await search(documentsPaths, searchText);

  expect(result).toEqual(docIds);
});

test('search with spam, pretext', async () => {
  const searchText = 'the trash island is a';
  const docIds = [
    'garbage_patch_NG',
    'garbage_patch_ocean_clean',
    'garbage_patch_wiki',
    'garbage_patch_spam',
  ];

  const documentsPaths = await Promise.all(docIds.map(getDocumentText));
  const result = await search(documentsPaths, searchText);

  expect(result).toEqual(docIds);
});

test('short strings', async () => {
  const doc1 = "I can't shoot straight unless I've had a pint!";
  const doc2 = "Don't shoot shoot shoot that thing at me.";
  const doc3 = "I'm your shooter.";
  const docs = [
    { id: 'doc1', text: doc1 },
    { id: 'doc2', text: doc2 },
    { id: 'doc3', text: doc3 },
  ];

  const result = await search(docs, 'shoot at me, nerd');

  expect(result).toEqual(['doc2', 'doc1']);
});
