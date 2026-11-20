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

await request(sender, 'POST', 'public/data/messages?documentId=hello', 200, {
  ...message,
  location: { stringValue: 'Brasil' }
});
await request(recipient, 'GET', 'public/data/messages/hello', 200);
await request(null, 'GET', 'public/data/messages/hello', 403);

console.log('Mensagens privadas e da comunidade testadas com três contas no emulador.');
