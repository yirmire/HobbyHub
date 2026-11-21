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

const readCollection = `public/data/members/${recipient.localId}/privateReads`;
const readMarker = `${readCollection}/${threadId}`;
const readAt = value => ({ lastReadAt: { integerValue: String(value) } });
await request(recipient, 'POST', `${readCollection}?documentId=${threadId}`, 200, readAt(100));
await request(recipient, 'GET', readCollection, 200);
await request(sender, 'GET', readMarker, 403);
await request(sender, 'PATCH', readMarker, 403, readAt(200));
await request(recipient, 'PATCH', readMarker, 403, readAt(99));
await request(recipient, 'PATCH', readMarker, 200, readAt(200));
await request(other, 'POST', `public/data/members/${other.localId}/privateReads?documentId=${threadId}`, 403, readAt(100));
const inboxQuery = await fetch(`${base}/${thread}:runQuery`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', authorization: `Bearer ${recipient.idToken}` },
  body: JSON.stringify({ structuredQuery: {
    from: [{ collectionId: 'messages' }],
    where: { fieldFilter: { field: { fieldPath: 'senderId' }, op: 'EQUAL', value: { stringValue: sender.localId } } },
    orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
    limit: 1
  } })
});
assert.equal(inboxQuery.status, 200);
const incoming = (await inboxQuery.json()).filter(row => row.document);
assert.equal(incoming.length, 1);
assert.equal(incoming[0].document.fields.senderId.stringValue, sender.localId);

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
const str = stringValue => ({ stringValue });
const reportCollection = 'public/data/reports';
const reportFields = ({ reporter, type, targetId, parentId, author, text }) => ({
  reporterId: str(reporter.localId),
  targetType: str(type),
  targetId: str(targetId),
  parentId: str(parentId),
  targetUserId: str(author.localId),
  targetText: str(text),
  reason: str('Outro'),
  details: str(''),
  createdAt: { integerValue: String(Date.now()) },
  status: str('pending')
});
const privateReport = reportFields({
  reporter: recipient, type: 'privateMessage', targetId: 'hello',
  parentId: threadId, author: sender, text: message.text.stringValue
});
await request(recipient, 'POST', `${reportCollection}?documentId=private-valid`, 200, privateReport);
await request(other, 'POST', reportCollection, 403, { ...privateReport, reporterId: str(other.localId) });
await request(recipient, 'POST', reportCollection, 403, { ...privateReport, targetText: str('Texto diferente') });
await request(recipient, 'POST', reportCollection, 403, { ...privateReport, threadHistory: str('Outro conteúdo') });
await request(recipient, 'GET', `${reportCollection}/private-valid`, 403);
await request(sender, 'GET', reportCollection, 403);
const communityReport = reportFields({
  reporter: recipient, type: 'communityMessage', targetId: 'hello',
  parentId: '', author: sender, text: message.text.stringValue
});
await request(recipient, 'POST', reportCollection, 200, communityReport);
const testimonialReport = reportFields({
  reporter: recipient, type: 'testimonial', targetId: sender.localId,
  parentId: recipient.localId, author: sender, text: 'Ótima companhia para fotografar!'
});
await request(recipient, 'POST', reportCollection, 200, testimonialReport);
await request(other, 'POST', reportCollection, 403, { ...testimonialReport, reporterId: str(other.localId) });
const profileReport = reportFields({
  reporter: sender, type: 'profile', targetId: recipient.localId,
  parentId: '', author: recipient, text: 'Pessoa de teste'
});
await request(sender, 'POST', reportCollection, 200, profileReport);
await request(sender, 'DELETE', testimonial, 200);

const groups = 'public/data/groups';
const group = `${groups}/welcome-group`;
await request(sender, 'POST', `${groups}?documentId=welcome-group`, 200, {
  name: str('Fotógrafos'),
  hobby: str('Fotografia'),
  description: str('Comunidade de fotografia'),
  location: str('Brasil'),
  createdBy: str(sender.localId),
  members: { arrayValue: { values: [str(sender.localId)] } }
});
await request(recipient, 'GET', group, 200);
const welcome = {
  userId: str(sender.localId), userName: str('Pessoa de teste'), content: str('Boas-vindas!'),
  hobby: str('Fotografia'), location: str('Brasil'), likes: { arrayValue: { values: [] } },
  createdAt: { integerValue: String(Date.now()) }
};
await request(sender, 'POST', 'public/data/posts?documentId=welcome-post', 200, { ...welcome, groupId: str('welcome-group') });
await request(sender, 'POST', 'public/data/posts?documentId=unrelated-post', 200, welcome);
const pin = `${group}?updateMask.fieldPaths=pinnedPostId`;
await request(recipient, 'PATCH', pin, 403, { pinnedPostId: str('welcome-post') });
await request(sender, 'PATCH', pin, 403, { pinnedPostId: str('unrelated-post') });
await request(sender, 'PATCH', pin, 200, { pinnedPostId: str('welcome-post') });
const groupForVisitor = await request(recipient, 'GET', group, 200);
assert.equal(groupForVisitor.fields.pinnedPostId.stringValue, 'welcome-post');
await request(sender, 'PATCH', pin, 200, { pinnedPostId: str('') });

const events = 'public/data/events';
const eventFields = {
  title: str('Caminhada'), description: str('Encontro do grupo'), hobby: str('Fotografia'),
  location: str('Praça pública'), date: str('2099-01-01'), time: str('10:00'), groupId: str('welcome-group'),
  createdBy: str(sender.localId), attendees: { arrayValue: { values: [str(sender.localId)] } }
};
const eventPath = `${events}/group-event`;
await request(sender, 'POST', `${events}?documentId=group-event`, 200, eventFields);
await request(recipient, 'POST', events, 403, {
  ...eventFields, createdBy: str(recipient.localId), attendees: { arrayValue: { values: [str(recipient.localId)] } }
});
const both = { arrayValue: { values: [str(sender.localId), str(recipient.localId)] } };
const organizerOnly = { arrayValue: { values: [str(sender.localId)] } };
const rsvp = `${eventPath}?updateMask.fieldPaths=attendees`;
await request(recipient, 'PATCH', rsvp, 403, { attendees: both });
await request(recipient, 'PATCH', `${group}?updateMask.fieldPaths=members`, 200, { members: both });
await request(recipient, 'PATCH', rsvp, 200, { attendees: both });
await request(recipient, 'PATCH', `${group}?updateMask.fieldPaths=members`, 200, { members: organizerOnly });
await request(recipient, 'PATCH', rsvp, 200, { attendees: organizerOnly });
const { groupId: _groupId, ...standalone } = eventFields;
await request(sender, 'POST', `${events}?documentId=standalone`, 200, standalone);
await request(recipient, 'PATCH', `${events}/standalone?updateMask.fieldPaths=attendees`, 200, { attendees: both });
const updateDetails = `${events}/standalone?updateMask.fieldPaths=date&updateMask.fieldPaths=time&updateMask.fieldPaths=location&updateMask.fieldPaths=revision&updateMask.fieldPaths=previousSchedule`;
const changedDetails = {
  date:str('2099-01-02'),time:str('14:30'),location:str('Biblioteca pública'),revision:{integerValue:'1'},
  previousSchedule:{mapValue:{fields:{date:standalone.date,time:standalone.time,location:standalone.location,revision:{integerValue:'1'}}}}
};
await request(recipient, 'PATCH', updateDetails, 403, changedDetails);
const editedEvent = await request(sender, 'PATCH', updateDetails, 200, changedDetails);
assert.equal(editedEvent.fields.attendees.arrayValue.values.length, 2);
assert.equal(editedEvent.fields.time.stringValue, '14:30');
const seen = `public/data/members/${recipient.localId}/eventReads/standalone`;
const revision = value => ({revision:{integerValue:String(value)}});
await request(recipient, 'PATCH', seen, 200, revision(1));
await request(sender, 'GET', seen, 403);
await request(recipient, 'PATCH', seen, 403, revision(2));
await request(other, 'PATCH', `public/data/members/${other.localId}/eventReads/standalone`, 403, revision(1));
const cancel = `${events}/standalone?updateMask.fieldPaths=cancelled&updateMask.fieldPaths=revision`;
const cancelled = {cancelled:{booleanValue:true},revision:{integerValue:'2'}};
await request(recipient, 'PATCH', cancel, 403, cancelled);
await request(sender, 'PATCH', cancel, 200, cancelled);
await request(recipient, 'PATCH', seen, 200, revision(2));
await request(recipient, 'PATCH', seen, 403, revision(1));
const cancelledEvent = await request(other, 'GET', `${events}/standalone`, 200);
assert.equal(cancelledEvent.fields.cancelled.booleanValue, true);
assert.equal(cancelledEvent.fields.attendees.arrayValue.values.length, 2);
await request(other, 'PATCH', `${events}/standalone?updateMask.fieldPaths=attendees`, 403, {
  attendees: { arrayValue: { values: [...both.arrayValue.values, str(other.localId)] } }
});
await request(sender, 'PATCH', updateDetails, 403, {...changedDetails,revision:{integerValue:'3'}});
await request(sender, 'PATCH', `${eventPath}?updateMask.fieldPaths=time&updateMask.fieldPaths=revision`, 200, {
  time:str('11:00'),revision:{integerValue:'1'}
});

const finished = `${events}/finished`;
await request(sender, 'POST', `${events}?documentId=finished`, 200, {...standalone,date:str('2000-01-01')});
await request(recipient, 'PATCH', `${finished}?updateMask.fieldPaths=attendees`, 200, {attendees:both});
async function sendFeedback(user, eventId, expected) {
  const database = `projects/${project}/databases/(default)`;
  const response = await fetch(`http://${storeHost}/v1/${database}/documents:commit`, {
    method:'POST',
    headers:{'content-type':'application/json',authorization:`Bearer ${user.idToken}`},
    body:JSON.stringify({writes:[{
      update:{name:`${database}/documents/artifacts/${project}/public/data/events/${eventId}/feedback/${user.localId}`,
        fields:{attended:{booleanValue:true},comment:str('Repetir o encontro')}},
      updateTransforms:[{fieldPath:'updatedAt',setToServerValue:'REQUEST_TIME'}]
    }]})
  });
  assert.equal(response.status, expected, await response.text());
}
await sendFeedback(sender, 'group-event', 403);
await sendFeedback(recipient, 'standalone', 403);
await sendFeedback(other, 'finished', 403);
await sendFeedback(recipient, 'finished', 200);
await sendFeedback(recipient, 'finished', 200);
const summary = await request(sender, 'GET', `${finished}/feedback`, 200);
assert.equal(summary.documents.length, 1);
await request(recipient, 'GET', `${finished}/feedback/${recipient.localId}`, 200);
await request(recipient, 'GET', `${finished}/feedback`, 403);
await request(other, 'GET', `${finished}/feedback/${recipient.localId}`, 403);

const moderation = `public/data/members/${recipient.localId}/moderation`;
const rolePath = `${moderation}/welcome-group`;
const pendingRole = {status:str('pending')};
const activeRole = {status:str('active')};
await request(recipient, 'PATCH', rolePath, 403, pendingRole);
await request(sender, 'PATCH', rolePath, 403, pendingRole);
await request(recipient, 'PATCH', `${group}?updateMask.fieldPaths=members`, 200, {members:both});
await request(sender, 'PATCH', rolePath, 200, pendingRole);
await request(recipient, 'GET', moderation, 200);
await request(other, 'GET', rolePath, 403);
await request(recipient, 'PATCH', pin, 403, {pinnedPostId:str('welcome-post')});
await request(sender, 'PATCH', rolePath, 403, activeRole);
await request(recipient, 'PATCH', rolePath, 200, activeRole);
await request(recipient, 'PATCH', pin, 200, {pinnedPostId:str('welcome-post')});
await request(recipient, 'DELETE', 'public/data/posts/unrelated-post', 403);
await request(recipient, 'POST', 'public/data/posts?documentId=moderated-post', 200, {
  ...welcome,groupId:str('welcome-group'),userId:str(recipient.localId)
});
await request(sender, 'DELETE', 'public/data/posts/moderated-post', 403);
const commentPath='public/data/posts/welcome-post/comments';
await request(sender, 'POST', `${commentPath}?documentId=moderated-comment`, 200, {
  userId:str(sender.localId),text:str('Comentário de teste'),createdAt:{integerValue:'1'}
});
await request(recipient, 'DELETE', `${commentPath}/moderated-comment`, 200);
await request(sender, 'POST', 'public/data/posts?documentId=remove-in-group', 200, {...welcome,groupId:str('welcome-group')});
const moderationPost='public/data/posts/remove-in-group';
await request(recipient, 'DELETE', moderationPost, 403);
const archivedComment=`${moderationPost}/comments/keep-comment`;
await request(sender, 'POST', `${moderationPost}/comments?documentId=keep-comment`, 200, {
  userId:str(sender.localId),text:str('Comentário que deve voltar'),createdAt:{integerValue:'1'}
});
const original=await request(sender, 'GET', moderationPost, 200);
const databasePath=`projects/${project}/databases/(default)`;
const documents=`${databasePath}/documents/artifacts/${project}/`;
const log=`${group}/moderationLog/removal-1`;
const pointer='public/data/removedPosts/remove-in-group';
const stamp=fieldPath=>[{fieldPath,setToServerValue:'REQUEST_TIME'}];
async function moderate(user,writes,expected) {
  const response=await fetch(`http://${storeHost}/v1/${databasePath}/documents:commit`, {
    method:'POST',
    headers:{'content-type':'application/json',authorization:`Bearer ${user.idToken}`},
    body:JSON.stringify({writes})
  });
  assert.equal(response.status,expected,await response.text());
}
await moderate(recipient,[
  {update:{name:documents+log,fields:{postId:str('remove-in-group'),post:{mapValue:{fields:original.fields}},
    reason:str('Fora das regras do grupo'),removedBy:str(recipient.localId)}},updateTransforms:stamp('removedAt')},
  {update:{name:documents+pointer,fields:{groupId:str('welcome-group'),entryId:str('removal-1')}}},
  {delete:documents+moderationPost}
],200);
await request(other, 'GET', moderationPost, 404);
await request(other, 'GET', archivedComment, 403);
await request(other, 'GET', log, 403);
await request(recipient, 'GET', log, 200);
await request(sender, 'POST', 'public/data/posts?documentId=remove-in-group', 403, welcome);
const restore=actor=>[
  {update:{name:documents+moderationPost,fields:original.fields}},
  {delete:documents+pointer},
  {update:{name:documents+log,fields:{restoredBy:str(actor.localId)}},updateMask:{fieldPaths:['restoredBy']},updateTransforms:stamp('restoredAt')}
];
await moderate(recipient,restore(recipient),403);
await moderate(sender,restore(sender),200);
await request(other, 'GET', moderationPost, 200);
const restoredComment=await request(other, 'GET', archivedComment, 200);
assert.equal(restoredComment.fields.text.stringValue,'Comentário que deve voltar');
const retainedHistory=await request(sender, 'GET', log, 200);
assert.equal(retainedHistory.fields.reason.stringValue,'Fora das regras do grupo');
assert.equal(retainedHistory.fields.restoredBy.stringValue,sender.localId);
await request(recipient, 'PATCH', `${group}?updateMask.fieldPaths=members`, 403, {members:organizerOnly});
await request(sender, 'DELETE', rolePath, 200);
await request(recipient, 'PATCH', pin, 403, {pinnedPostId:str('')});
await request(sender, 'PATCH', rolePath, 200, pendingRole);
await request(recipient, 'PATCH', rolePath, 200, activeRole);
const dbName=`projects/${project}/databases/(default)`;
const resourcePrefix=`${dbName}/documents/artifacts/${project}/`;
const leaving=await fetch(`http://${storeHost}/v1/${dbName}/documents:commit`, {
  method:'POST',
  headers:{'content-type':'application/json',authorization:`Bearer ${recipient.idToken}`},
  body:JSON.stringify({writes:[
    {update:{name:resourcePrefix+group,fields:{members:organizerOnly}},updateMask:{fieldPaths:['members']}},
    {delete:resourcePrefix+rolePath}
  ]})
});
assert.equal(leaving.status, 200, await leaving.text());
await request(recipient, 'GET', rolePath, 404);
await request(recipient, 'PATCH', `${group}?updateMask.fieldPaths=members`, 200, {members:both});
await request(recipient, 'PATCH', pin, 403, {pinnedPostId:str('')});

console.log('Permissões de mensagens, perfis, denúncias e publicações fixadas testadas no emulador.');
