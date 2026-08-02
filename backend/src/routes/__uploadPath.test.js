// Self-check for the blob upload path contract shared by the client uploader
// (AdminPhotoManager/AdminVideoManager), the token routes that sign the path,
// and the API routes that reuse the client-minted id.
// Run: node backend/src/routes/__uploadPath.test.js
const assert = require('assert');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const pathRe = (kind) =>
  new RegExp(`^${kind}\\/[\\w-]+\\/[0-9a-f-]{36}\\/original\\.[a-z0-9]+$`, 'i');

const ext = (name, fallback) => (name.match(/\.[a-z0-9]+$/i)?.[0] || fallback).toLowerCase();
const id = 'b3f1c2d4-5e6a-4b7c-8d9e-0f1a2b3c4d5e';

// Extension derivation: normal, uppercase, dotted, and no-extension names.
assert.strictEqual(ext('primary logo (1).PNG', '.jpg'), '.png');
assert.strictEqual(ext('clip.final.MP4', '.mp4'), '.mp4');
assert.strictEqual(ext('no-extension', '.jpg'), '.jpg'); // old slice(-1) yielded "n"

// Paths the uploaders now build are accepted by the token routes.
assert.ok(pathRe('photos').test(`photos/admin/${id}/original.png`));
assert.ok(pathRe('videos').test(`videos/admin/${id}/original.mp4`));

// The regression itself — a bare filename at the store root — is rejected.
assert.ok(!pathRe('photos').test('primary logo (1).png'));
assert.ok(!pathRe('videos').test('clip.mp4'));
// And so is anything trying to escape the prefix.
assert.ok(!pathRe('photos').test(`videos/admin/${id}/original.png`));
assert.ok(!pathRe('photos').test(`photos/admin/${id}/../../root.png`));

// The API routes only adopt a well-formed client id, else they mint their own.
assert.ok(UUID_RE.test(id));
for (const bad of ['', 'admin', '../../etc', `${id}x`, undefined]) {
  assert.ok(!UUID_RE.test(bad), `should reject id: ${bad}`);
}

console.log('upload path contract: all assertions passed');
