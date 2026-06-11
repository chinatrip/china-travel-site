// Removes the leading `# Title` from markdown content at render time.
//
// Content pages render the frontmatter `title` as the layout's <h1>, while the
// synced wiki markdown also starts with its own `# Title` line — producing two
// visible H1s per page (a GEO/SEO problem: crawlers can't pick the canonical
// headline). Stripping happens here in the render pipeline so the wiki/content
// source files stay untouched.
//
// Defensive scope: only the FIRST depth-1 heading is removed, and only when it
// sits among the document's first few nodes (a leading title, possibly behind a
// stray comment). An H1 appearing mid-document is left alone.

// How deep into the document a "leading" H1 may sit (0-based child index).
const MAX_LEADING_INDEX = 2;

export function stripLeadingH1(tree) {
  if (!tree || !Array.isArray(tree.children)) return tree;
  const limit = Math.min(tree.children.length, MAX_LEADING_INDEX + 1);
  for (let i = 0; i < limit; i++) {
    const node = tree.children[i];
    if (node.type === 'heading' && node.depth === 1) {
      tree.children.splice(i, 1);
      break;
    }
  }
  return tree;
}

export default function remarkStripLeadingH1() {
  return (tree) => stripLeadingH1(tree);
}
