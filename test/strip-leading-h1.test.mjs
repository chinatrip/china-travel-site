import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripLeadingH1 } from '../src/plugins/remark-strip-leading-h1.mjs';

const h = (depth, text) => ({
  type: 'heading',
  depth,
  children: [{ type: 'text', value: text }],
});
const p = (text) => ({
  type: 'paragraph',
  children: [{ type: 'text', value: text }],
});
const root = (...children) => ({ type: 'root', children });

test('removes the leading H1', () => {
  const tree = root(h(1, 'How to Use DiDi'), p('DiDi is...'), h(2, 'Sign up'), p('Steps...'));
  stripLeadingH1(tree);
  assert.deepEqual(tree, root(p('DiDi is...'), h(2, 'Sign up'), p('Steps...')));
});

test('leaves a document without any H1 unchanged', () => {
  const tree = root(p('Intro'), h(2, 'Section'), p('Body'));
  const before = structuredClone(tree);
  stripLeadingH1(tree);
  assert.deepEqual(tree, before);
});

test('leaves a document starting with H2 unchanged, even if an H1 appears mid-document', () => {
  const tree = root(h(2, 'Section'), p('Body'), p('More'), p('Even more'), h(1, 'Stray mid-doc H1'));
  const before = structuredClone(tree);
  stripLeadingH1(tree);
  assert.deepEqual(tree, before);
});

test('preserves all content after the removed leading H1, including later H1s', () => {
  const tree = root(h(1, 'Title'), p('Intro'), h(1, 'Stray H1 kept'), h(3, 'Sub'), p('Tail'));
  stripLeadingH1(tree);
  assert.deepEqual(tree, root(p('Intro'), h(1, 'Stray H1 kept'), h(3, 'Sub'), p('Tail')));
});

test('still removes a leading H1 preceded by a stray comment node', () => {
  const comment = { type: 'html', value: '<!-- synced from wiki -->' };
  const tree = root(comment, h(1, 'Title'), p('Body'));
  stripLeadingH1(tree);
  assert.deepEqual(tree, root(comment, p('Body')));
});
