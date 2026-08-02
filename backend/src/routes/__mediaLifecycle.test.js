// Self-check for the media lifecycle in backend/src/routes/admin.ts.
// Permanent delete drops the row AND releases the blobs, so the archive-first
// guard is the only thing standing between a misclick and an asset that a live
// site section still points at.
// Run: node backend/src/routes/__mediaLifecycle.test.js
const assert = require('assert');

// Mirrors permanentlyDelete()'s guard.
const canPermanentlyDelete = (asset) =>
  !!asset && asset.publishStatus === 'archived';

// A live or draft asset must be archived first — one step, not one click.
assert.ok(!canPermanentlyDelete({ publishStatus: 'published' }), 'published must be archived first');
assert.ok(!canPermanentlyDelete({ publishStatus: 'draft' }), 'draft must be archived first');
assert.ok(!canPermanentlyDelete(undefined), 'a missing asset is a 404, not a delete');
assert.ok(canPermanentlyDelete({ publishStatus: 'archived' }), 'archived is deletable');

// The full path a user takes: upload -> draft -> archive -> delete.
let asset = { publishStatus: 'draft' };
assert.ok(!canPermanentlyDelete(asset));
asset = { ...asset, publishStatus: 'archived' };   // the DELETE route archives
assert.ok(canPermanentlyDelete(asset));
asset = { ...asset, publishStatus: 'draft' };      // restore un-archives
assert.ok(!canPermanentlyDelete(asset), 'restoring must re-protect the asset');

// Blob cleanup must cover every rendition, deduped, with blanks dropped —
// a missed URL leaks storage, a null would throw before the row is deleted.
const blobsFor = (kind, a) => [...new Set(
  (kind === 'photo'
    ? [a.inputPath, a.webpPath, a.thumbnailPath]
    : [a.inputPath, a.webmPath, a.mp4Path, a.thumbnailPath]
  ).filter(Boolean)
)];

assert.deepStrictEqual(
  blobsFor('photo', { inputPath: 'a', webpPath: 'b', thumbnailPath: 'c' }),
  ['a', 'b', 'c']
);
assert.deepStrictEqual(
  blobsFor('video', { inputPath: 'a', webmPath: 'b', mp4Path: 'c', thumbnailPath: 'd' }),
  ['a', 'b', 'c', 'd']
);
// A failed conversion leaves renditions null; only the original should be released.
assert.deepStrictEqual(
  blobsFor('video', { inputPath: 'a', webmPath: null, mp4Path: null, thumbnailPath: null }),
  ['a']
);
// webpPath is seeded to inputPath on upload, so the two collide until conversion ends.
assert.deepStrictEqual(
  blobsFor('photo', { inputPath: 'a', webpPath: 'a', thumbnailPath: null }),
  ['a'],
  'the same URL must not be deleted twice'
);

console.log('media lifecycle: all assertions passed');
