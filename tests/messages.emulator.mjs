import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const { FIREBASE_AUTH_EMULATOR_HOST: authHost, FIRESTORE_EMULATOR_HOST: storeHost, GCLOUD_PROJECT: project } = process.env;
assert.match(authHost ?? '', /^127\.0\.0\.1:\d+$/);
assert.match(storeHost ?? '', /^127\.0\.0\.1:\d+$/);
assert.match(project ?? '', /^demo-/);

async function signUp() {
  const response = await fetch(`http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: `${randomUUID()}@example.test`,
      password: 'Somente-emulador-123',
      returnSecureToken: true
    })
  });
  assert.equal(response.status, 200);
  return response.json();
}

const [sender, recipient, other] = await Promise.all([signUp(), signUp(), signUp()]);
const participants = [sender.localId, recipient.localId].sort();
const threadId = participants.join('_');
const base = `http://${storeHost}/v1/projects/${project}/databases/(default)/documents/artifacts/${project}`;
const thread = `dm_threads/${threadId}`;

async function request(user, method, path, expected, fields) {
  const headers = { 'content-type': 'application/json' };
  if (user) headers.authorization = `Bearer ${user.idToken}`;
  const response = await fetch(`${base}/${path}`, {
    method,
    headers,
    body: fields ? JSON.stringify({ fields }) : undefined
  });
  const body = await response.json();
  assert.equal(response.status, expected, `${method} ${path}: ${body.error?.message ?? ''}`);
  return body;
}

await request(sender, 'GET', thread, 404);
await request(null, 'GET', thread, 403);
await request(sender, 'POST', `dm_threads?documentId=${threadId}`, 200, {
  participants: { arrayValue: { values: participants.map(stringValue => ({ stringValue })) } }
});
await request(recipient, 'GET', thread, 200);
await request(other, 'GET', thread, 403);

const message = {
  senderId: { stringValue: sender.localId },
  text: { stringValue: 'Olá, HobbyHub!' },
  createdAt: { integerValue: String(Date.now()) }
};
await request(sender, 'POST', `${thread}/messages?documentId=hello`, 200, message);
const received = await request(recipient, 'GET', `${thread}/messages/hello`, 200);
assert.equal(received.fields.text.stringValue, message.text.stringValue);
const inbox = await request(recipient, 'GET', `${thread}/messages`, 200);
assert.equal(inbox.documents.length, 1);
await request(other, 'GET', `${thread}/messages/hello`, 403);
await request(other, 'POST', `${thread}/messages?documentId=other`, 403, {
  ...message,
  senderId: { stringValue: other.localId }
});

const blocked = `public/data/members/${sender.localId}/blocked`;
const block = `${blocked}/${recipient.localId}`;
const blockFields = { createdAt: { integerValue: String(Date.now()) } };
await request(recipient, 'POST', `${blocked}?documentId=${recipient.localId}`, 403, blockFields);
await request(sender, 'POST', `${blocked}?documentId=${recipient.localId}`, 200, blockFields);
await request(sender, 'GET', blocked, 200);
await request(recipient, 'GET', block, 403);
await request(recipient, 'GET', `${thread}/messages/hello`, 200);
await request(sender, 'GET', `${thread}/messages/hello`, 200);
await request(sender, 'POST', `${thread}/messages?documentId=blocked-sender`, 403, message);
const reply = { ...message, senderId: { stringValue: recipient.localId } };
await request(recipient, 'POST', `${thread}/messages?documentId=blocked-recipient`, 403, reply);
await request(sender, 'DELETE', block, 200);
await request(recipient, 'POST', `${thread}/messages?documentId=after-unblock`, 200, reply);

const freshPair = [sender.localId, other.localId].sort();
const freshThread = `dm_threads?documentId=${freshPair.join('_')}`;
await request(sender, 'POST', `${blocked}?documentId=${other.localId}`, 200, blockFields);
await request(other, 'POST', freshThread, 403, {
  participants: { arrayValue: { values: freshPair.map(stringValue => ({ stringValue })) } }
});
await request(sender, 'DELETE', `${blocked}/${other.localId}`, 200);

await request(sender, 'POST', 'public/data/messages?documentId=hello', 200, {
  ...message,
  location: { stringValue: 'Brasil' }
});
await request(recipient, 'GET', 'public/data/messages/hello', 200);
await request(null, 'GET', 'public/data/messages/hello', 403);

const following = `public/data/members/${sender.localId}/following`;
await request(sender, 'POST', `${following}?documentId=${recipient.localId}`, 200, {
  createdAt: { integerValue: String(Date.now()) }
});
const follows = await request(sender, 'GET', following, 200);
assert.equal(follows.documents.length, 1);
await request(recipient, 'GET', following, 403);
await request(null, 'GET', following, 403);
await request(sender, 'POST', `${following}?documentId=${sender.localId}`, 403, {
  createdAt: { integerValue: String(Date.now()) }
});
await request(sender, 'DELETE', `${following}/${recipient.localId}`, 200);

const profile = `public/data/members/${recipient.localId}`;
const photoUrl = 'https://example.test/foto.jpg';
await request(recipient, 'POST', `public/data/members?documentId=${recipient.localId}`, 200, {
  uid: { stringValue: recipient.localId },
  name: { stringValue: 'Pessoa de teste' },
  avatar: { stringValue: '🌟' },
  location: { stringValue: 'Brasil' },
  bio: { stringValue: '' },
  hobbies: { arrayValue: { values: [] } }
});
const updated = await request(recipient, 'PATCH', `${profile}?updateMask.fieldPaths=photoUrl`, 200, {
  photoUrl: { stringValue: photoUrl }
});
assert.equal(updated.fields.photoUrl.stringValue, photoUrl);
await request(sender, 'PATCH', `${profile}?updateMask.fieldPaths=photoUrl`, 403, {
  photoUrl: { stringValue: 'https://example.test/outra.jpg' }
});
await request(recipient, 'PATCH', `${profile}?updateMask.fieldPaths=photoUrl`, 403, {
  photoUrl: { stringValue: 'http://example.test/foto.jpg' }
});

const testimonials = `${profile}/testimonials`;
const testimonial = `${testimonials}/${sender.localId}`;
await request(sender, 'POST', `${testimonials}?documentId=${sender.localId}`, 200, {
  text: { stringValue: 'Ótima companhia para fotografar!' },
  createdAt: { integerValue: String(Date.now()) },
  approved: { booleanValue: false }
});
await request(other, 'GET', testimonial, 403);
await request(other, 'GET', testimonials, 403);
await request(recipient, 'GET', testimonials, 200);
await request(sender, 'PATCH', `${testimonial}?updateMask.fieldPaths=approved`, 403, {
  approved: { booleanValue: true }
});
await request(recipient, 'PATCH', `${testimonial}?updateMask.fieldPaths=approved`, 200, {
  approved: { booleanValue: true }
});
await request(other, 'GET', testimonial, 200);
await request(null, 'GET', testimonial, 403);
const publicQuery = await fetch(`${base}/${profile}:runQuery`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', authorization: `Bearer ${other.idToken}` },
  body: JSON.stringify({ structuredQuery: {
    from: [{ collectionId: 'testimonials' }],
    where: { fieldFilter: { field: { fieldPath: 'approved' }, op: 'EQUAL', value: { booleanValue: true } } }
  } })
});
assert.equal(publicQuery.status, 200);
assert.equal((await publicQuery.json()).filter(row => row.document).length, 1);
await request(recipient, 'PATCH', `${testimonial}?updateMask.fieldPaths=approved`, 200, {
  approved: { booleanValue: false }
});
await request(other, 'GET', testimonial, 403);
await request(sender, 'DELETE', testimonial, 200);

console.log('Mensagens, seguimentos, mídia de perfil e aprovação de depoimentos testados no emulador.');
