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
const durationEvent=events+'/duration-event';
await request(sender,'POST',events+'?documentId=invalid-duration',403,{...standalone,time:str('09:00'),endTime:str('08:30')});
await request(sender,'POST',events+'?documentId=duration-event',200,{...standalone,time:str('09:00'),endTime:str('10:30')});
const endEdit=durationEvent+'?updateMask.fieldPaths=endTime&updateMask.fieldPaths=revision&updateMask.fieldPaths=previousSchedule';
const endFields={
  endTime:str('11:00'),revision:{integerValue:'1'},
  previousSchedule:{mapValue:{fields:{date:standalone.date,time:str('09:00'),endTime:str('10:30'),location:standalone.location,revision:{integerValue:'1'}}}}
};
await request(recipient,'PATCH',endEdit,403,endFields);
await request(sender,'PATCH',endEdit,403,{...endFields,endTime:str('09:00')});
await request(sender,'PATCH',endEdit,200,endFields);
assert.equal((await request(recipient,'GET',durationEvent,200)).fields.endTime.stringValue,'11:00');
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
await request(recipient, 'DELETE', `${commentPath}/moderated-comment`, 403);
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
const onlineEvent=events+'/online-test',roomPath=onlineEvent+'/private/room';
const online={...standalone,format:str('online'),location:str('Online'),timeZone:str('America/Manaus')};
const roomFields={url:str('https://meet.example.test/sala'),ownerId:str(sender.localId)};
const onlineCreate={update:{name:documents+onlineEvent,fields:online},currentDocument:{exists:false}};
const roomCreate={update:{name:documents+roomPath,fields:roomFields}};
await moderate(sender,[onlineCreate],403);
await moderate(sender,[{...onlineCreate,update:{...onlineCreate.update,fields:{...online,timeZone:str('Invalid/Zone')}}},roomCreate],403);
await moderate(sender,[onlineCreate,{update:{name:documents+roomPath,fields:{...roomFields,url:str('http://meet.example.test/sala')}}}],403);
await moderate(sender,[onlineCreate,roomCreate],200);
assert.equal((await request(other,'GET',onlineEvent,200)).fields.roomUrl,undefined);
await request(recipient,'GET',roomPath,403);
await request(recipient,'PATCH',onlineEvent+'?updateMask.fieldPaths=attendees',200,{attendees:both});
assert.equal((await request(recipient,'GET',roomPath,200)).fields.url.stringValue,roomFields.url.stringValue);
await request(recipient,'PATCH',roomPath+'?updateMask.fieldPaths=url',403,{url:str('https://example.test/other')});
await request(recipient,'PATCH',onlineEvent+'?updateMask.fieldPaths=attendees',200,{attendees:organizerOnly});
await request(recipient,'GET',roomPath,403);
const switchToPhysical={update:{name:documents+onlineEvent,fields:{
  format:str('in-person'),location:str('Praça'),timeZone:str(''),revision:{integerValue:'1'},
  previousSchedule:{mapValue:{fields:{date:online.date,time:online.time,endTime:str(''),timeZone:online.timeZone,location:online.location,revision:{integerValue:'1'}}}}
}},updateMask:{fieldPaths:['format','location','timeZone','revision','previousSchedule']}};
await moderate(sender,[switchToPhysical],403);
await moderate(sender,[switchToPhysical,{delete:documents+roomPath}],200);
await request(sender,'GET',roomPath,403);
const productFeedback='productFeedback/product-test';
const feedbackWrite=(uid,category='suggestion',message='Melhorar a busca por eventos.',status='new')=>({
  update:{name:documents+productFeedback,fields:{authorId:str(uid),category:str(category),message:str(message),status:str(status)}},
  updateTransforms:stamp('createdAt')
});
await moderate(other,[feedbackWrite(sender.localId)],403);
await moderate(sender,[feedbackWrite(sender.localId,'invalid')],403);
await moderate(sender,[feedbackWrite(sender.localId,'problem','x'.repeat(601))],403);
await moderate(sender,[feedbackWrite(sender.localId,'suggestion','Mensagem válida','reviewed')],403);
await moderate(sender,[feedbackWrite(sender.localId)],200);
await request(sender,'GET',productFeedback,200);
await request(other,'GET',productFeedback,403);
await request(sender,'GET','productFeedback',403);
await request(recipient,'GET','productFeedback',403);
await request(sender,'DELETE',productFeedback,403);
async function listOwnFeedback(actor,author,expected){
  const result=await fetch(base+':runQuery',{method:'POST',
    headers:{'content-type':'application/json',authorization:`Bearer ${actor.idToken}`},
    body:JSON.stringify({structuredQuery:{from:[{collectionId:'productFeedback'}],
      where:{fieldFilter:{field:{fieldPath:'authorId'},op:'EQUAL',value:str(author.localId)}}}})});
  assert.equal(result.status,expected);
  return result.json();
}
assert.equal((await listOwnFeedback(sender,sender,200)).filter(row=>row.document).length,1);
await listOwnFeedback(other,sender,403);
const adminRole=`feedbackAdmins/${recipient.localId}`;
const enabled={active:{booleanValue:true},email:str(recipient.email)};
await request(recipient,'GET',adminRole,404);
await request(recipient,'PATCH',adminRole,403,enabled);
await request({idToken:'owner'},'PATCH',adminRole,200,enabled);
await request(sender,'GET',adminRole,403);
await request(recipient,'GET','productFeedback',403);
const verifyResponse=await fetch(`http://${authHost}/identitytoolkit.googleapis.com/v1/projects/${project}/accounts:update`,{
  method:'POST',headers:{'content-type':'application/json',authorization:'Bearer owner'},
  body:JSON.stringify({localId:recipient.localId,emailVerified:true})
});
assert.equal(verifyResponse.status,200,await verifyResponse.text());
const verifiedLogin=await fetch(`http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo`,{
  method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
    email:recipient.email,password:'Somente-emulador-123',returnSecureToken:true
  })
});
assert.equal(verifiedLogin.status,200);
const reviewer=await verifiedLogin.json();
await request(reviewer,'GET','productFeedback',200);
const triage=(actor,status,resolution)=>({
  update:{name:documents+productFeedback,fields:{status:str(status),reviewedBy:str(actor.localId),
    ...(resolution===undefined?{}:{resolution:str(resolution)})}},
  updateMask:{fieldPaths:resolution===undefined?['status','reviewedBy']:['status','reviewedBy','resolution']},
  updateTransforms:stamp('reviewedAt')
});
await moderate(sender,[triage(sender,'resolved')],403);
await moderate(reviewer,[triage(reviewer,'invalid')],403);
await moderate(reviewer,[{...triage(reviewer,'in-review'),updateMask:{fieldPaths:['status','reviewedBy','message']}}],403);
await moderate(reviewer,[triage(reviewer,'in-review')],200);
await moderate(reviewer,[triage(reviewer,'resolved')],200);
assert.equal((await request(reviewer,'GET',productFeedback,200)).fields.status.stringValue,'resolved');
assert.equal((await request(sender,'GET',productFeedback,200)).fields.status.stringValue,'resolved');
await moderate(reviewer,[triage(reviewer,'in-review')],200);
await moderate(sender,[triage(sender,'resolved','Resposta indevida')],403);
await moderate(reviewer,[triage(reviewer,'in-review','Resposta fora da resolução')],403);
await moderate(reviewer,[triage(reviewer,'resolved','a'.repeat(601))],403);
await moderate(reviewer,[triage(reviewer,'resolved','Corrigimos o envio.')],200);
await moderate(reviewer,[triage(reviewer,'resolved','Outra resposta')],403);
assert.equal((await request(sender,'GET',productFeedback,200)).fields.resolution.stringValue,'Corrigimos o envio.');
const resolutionChoice=value=>({
  update:{name:documents+productFeedback,fields:{resolutionChoice:str(value)}},
  updateMask:{fieldPaths:['resolutionChoice']}
});
await moderate(other,[resolutionChoice('helped')],403);
await moderate(reviewer,[resolutionChoice('helped')],403);
await moderate(sender,[resolutionChoice('invalid')],403);
await moderate(sender,[{...resolutionChoice('helped'),updateMask:{fieldPaths:['resolutionChoice','message']}}],403);
await moderate(sender,[resolutionChoice('needs-help')],200);
await moderate(sender,[resolutionChoice('helped')],403);
assert.equal((await request(reviewer,'GET',productFeedback,200)).fields.resolutionChoice.stringValue,'needs-help');
async function listFeedbackNeedingAttention(actor,expected){
  const filters=[['status','resolved'],['resolutionChoice','needs-help']].map(([fieldPath,value])=>({
    fieldFilter:{field:{fieldPath},op:'EQUAL',value:str(value)}
  }));
  const result=await fetch(base+':runQuery',{method:'POST',
    headers:{'content-type':'application/json',authorization:`Bearer ${actor.idToken}`},
    body:JSON.stringify({structuredQuery:{from:[{collectionId:'productFeedback'}],
      where:{compositeFilter:{op:'AND',filters}},limit:40}})});
  assert.equal(result.status,expected);
  return result.json();
}
assert.equal((await listFeedbackNeedingAttention(reviewer,200)).find(row=>row.document).document.name,documents+productFeedback);
await listFeedbackNeedingAttention(sender,403);
const supplementPath=productFeedback+'/supplements/first';
const addSupplement=(message,id='first')=>[{
  update:{name:documents+productFeedback+'/supplements/'+id,fields:{message:str(message)}},
  updateTransforms:stamp('createdAt'),currentDocument:{exists:false}
},{
  update:{name:documents+productFeedback,fields:{hasUnreadSupplements:{booleanValue:true},lastSupplementId:str(id)}},
  updateMask:{fieldPaths:['hasUnreadSupplements','lastSupplementId']}
}];
await moderate(sender,addSupplement('Detalhes adicionais'),403);
await moderate(reviewer,[triage(reviewer,'in-review')],200);
await moderate(other,addSupplement('Tentativa de outra conta'),403);
await moderate(reviewer,addSupplement('Tentativa da equipe'),403);
await moderate(sender,addSupplement('ab'),403);
await moderate(sender,addSupplement('Detalhes adicionais').slice(0,1),403);
await moderate(sender,addSupplement('Detalhes adicionais').slice(1),403);
await moderate(sender,addSupplement('Detalhes adicionais'),200);
assert.equal((await request(reviewer,'GET',productFeedback,200)).fields.hasUnreadSupplements.booleanValue,true);
const clearSupplementFlag={
  update:{name:documents+productFeedback,fields:{hasUnreadSupplements:{booleanValue:false}}},
  updateMask:{fieldPaths:['hasUnreadSupplements']}
};
await moderate(sender,[clearSupplementFlag],403);
await moderate(reviewer,[clearSupplementFlag],200);
assert.equal((await request(reviewer,'GET',productFeedback,200)).fields.hasUnreadSupplements.booleanValue,false);
await moderate(sender,addSupplement('Mais detalhes','second'),200);
assert.equal((await request(reviewer,'GET',productFeedback,200)).fields.lastSupplementId.stringValue,'second');
assert.equal((await request(reviewer,'GET',supplementPath,200)).fields.message.stringValue,'Detalhes adicionais');
await request(sender,'GET',productFeedback+'/supplements',200);
await request(reviewer,'GET',productFeedback+'/supplements',200);
await request(other,'GET',productFeedback+'/supplements',403);
await request(sender,'PATCH',supplementPath,403,{message:str('Tentativa de edição')});
await request(sender,'DELETE',supplementPath,403);
assert.ok(!(await listFeedbackNeedingAttention(reviewer,200)).some(row=>row.document));
assert.equal((await request(sender,'GET',productFeedback,200)).fields.resolution.stringValue,'Corrigimos o envio.');
await moderate(reviewer,[triage(reviewer,'resolved','Novo retorno.')],403);
const followup=triage(reviewer,'resolved','Novo retorno.');
followup.update.fields.resolutionChoice=str('');
followup.updateMask.fieldPaths.push('resolutionChoice');
await moderate(reviewer,[followup],200);
assert.equal((await request(sender,'GET',supplementPath,200)).fields.message.stringValue,'Detalhes adicionais');
await moderate(sender,[resolutionChoice('helped')],200);
await request(other,'GET',productFeedback,403);
await request({idToken:'owner'},'PATCH',adminRole,200,{active:{booleanValue:false}});
await request(reviewer,'GET','productFeedback',403);
const readState=`public/data/members/${recipient.localId}/notificationReadState/main`;
const readKeys=values=>({arrayValue:{values:values.map(str)}});
await request(recipient,'GET',readState,404);
await request(other,'PATCH',readState,403,{keys:readKeys(['notice:1'])});
await request(recipient,'PATCH',readState,200,{keys:readKeys(['notice:1'])});
await request(other,'GET',readState,403);
await request(recipient,'PATCH',readState,403,{keys:str('notice:1')});
await request(recipient,'PATCH',readState,403,{keys:readKeys(Array.from({length:501},(_,index)=>'notice:'+index))});
await request(recipient,'PATCH',readState,200,{keys:readKeys(['notice:1','notice:2'])});
assert.equal((await request(recipient,'GET',readState,200)).fields.keys.arrayValue.values.length,2);
const mutedCommunity=`public/data/members/${recipient.localId}/mutedCommunities/welcome-group`;
const mute={update:{name:documents+mutedCommunity,fields:{}},updateTransforms:stamp('mutedAt')};
await moderate(other,[mute],403);
await moderate(other,[{...mute,update:{...mute.update,name:documents+mutedCommunity.replace(recipient.localId,other.localId)}}],403);
await moderate(recipient,[mute],200);
await request(recipient,'GET',mutedCommunity,200);
await request(sender,'GET',mutedCommunity,403);
await request(recipient,'DELETE',mutedCommunity,200);
const notificationSettings=`public/data/members/${recipient.localId}/notificationSettings/main`;
await request(recipient,'GET',notificationSettings,404);
await request(other,'PATCH',notificationSettings,403,{polls:{booleanValue:false}});
await request(recipient,'PATCH',notificationSettings,200,{polls:{booleanValue:false}});
await request(other,'GET',notificationSettings,403);
await request(recipient,'PATCH',notificationSettings,403,{polls:str('yes')});
await request(recipient,'PATCH',notificationSettings,403,{urgent:{booleanValue:false}});
await request(recipient,'PATCH',`${notificationSettings}?updateMask.fieldPaths=bulletins`,200,{bulletins:{booleanValue:false}});
assert.equal((await request(recipient,'GET',notificationSettings,200)).fields.polls.booleanValue,false);
const reminderSettings=notificationSettings+'?updateMask.fieldPaths=eventReminders';
await request(other,'PATCH',reminderSettings,403,{eventReminders:str('both')});
await request(recipient,'PATCH',reminderSettings,403,{eventReminders:str('weekly')});
await request(recipient,'PATCH',reminderSettings,200,{eventReminders:str('both')});
const savedReminders=(await request(recipient,'GET',notificationSettings,200)).fields;
assert.equal(savedReminders.eventReminders.stringValue,'both');
assert.equal(savedReminders.polls.booleanValue,false);
const timestampedEvent=`${events}/timestamped`;
await request(sender,'POST',`${events}?documentId=timestamped`,200,standalone);
const attendChange={update:{name:documents+timestampedEvent,fields:{location:str('Biblioteca'),revision:{integerValue:'1'}}},
  updateMask:{fieldPaths:['location','revision']},updateTransforms:stamp('scheduleChangedAt')};
await moderate(other,[attendChange],403);
await moderate(sender,[{...attendChange,updateTransforms:[],update:{...attendChange.update,fields:{
  ...attendChange.update.fields,scheduleChangedAt:{timestampValue:'2020-01-01T12:00:00.000Z'}
}},updateMask:{fieldPaths:['location','revision','scheduleChangedAt']}}],403);
await moderate(sender,[attendChange],200);
assert.ok((await request(other,'GET',timestampedEvent,200)).fields.scheduleChangedAt.timestampValue);
const savedEvent=`public/data/members/${recipient.localId}/savedEvents/group-event`;
const saveEvent={update:{name:documents+savedEvent,fields:{}},updateTransforms:stamp('savedAt')};
await moderate(other,[saveEvent],403);
await moderate(recipient,[saveEvent],200);
await request(recipient,'GET',savedEvent,200);
await request(sender,'GET',savedEvent,403);
await request(other,'GET',`public/data/members/${recipient.localId}/savedEvents`,403);
assert.deepEqual((await request(sender,'GET',eventPath,200)).fields.attendees,organizerOnly);
await request(recipient,'DELETE',savedEvent,200);
await request(sender,'POST',`${events}?documentId=recap-event`,200,{...eventFields,date:str('2020-01-01')});
const recapPost={...welcome,groupId:str('welcome-group'),eventRecapId:str('recap-event')};
await request(sender,'POST','public/data/posts?documentId=recap-bad-event',403,{...recapPost,eventRecapId:str('group-event')});
await request(recipient,'POST','public/data/posts?documentId=recap-bad-author',403,{...recapPost,userId:str(recipient.localId)});
await request(sender,'POST','public/data/posts?documentId=recap-good',200,recapPost);
assert.equal((await request(other,'GET','public/data/posts/recap-good',200)).fields.eventRecapId.stringValue,'recap-event');
const checkinDay=new Date(Date.now()-3*60*60*1000).toISOString().slice(0,10);
const checkinEvent=`${events}/checkin-today`;
const arrival=(event,actor)=>({
  update:{name:documents+event+'/checkins/'+actor.localId,fields:{}},
  updateTransforms:stamp('checkedAt')
});
await request(sender,'POST',`${events}?documentId=checkin-today`,200,{...standalone,date:str(checkinDay)});
await request(recipient,'PATCH',`${checkinEvent}?updateMask.fieldPaths=attendees`,200,{attendees:both});
await moderate(recipient,[arrival(checkinEvent,recipient)],403);
await moderate(sender,[arrival(checkinEvent,other)],403);
await moderate(sender,[arrival(eventPath,sender)],403);
await moderate(sender,[arrival(checkinEvent,recipient)],200);
await request(sender,'GET',`${checkinEvent}/checkins`,200);
await request(recipient,'GET',`${checkinEvent}/checkins/${recipient.localId}`,200);
await request(recipient,'GET',`${checkinEvent}/checkins`,403);
await request(other,'GET',`${checkinEvent}/checkins/${recipient.localId}`,403);
await moderate(sender,[arrival(checkinEvent,recipient)],403);
await request({idToken:'owner'},'PATCH',`${finished}/checkins/${other.localId}`,200,{
  checkedAt:{timestampValue:'2020-01-01T12:00:00.000Z'}
});
await request(other,'GET',`${finished}/checkins/${other.localId}`,200);
await sendFeedback(other,'finished',200);
await request(recipient,'DELETE',`${checkinEvent}/checkins/${recipient.localId}`,403);
await request(sender,'DELETE',`${checkinEvent}/checkins/${recipient.localId}`,200);
await request(sender,'PATCH',`${checkinEvent}?updateMask.fieldPaths=cancelled&updateMask.fieldPaths=revision`,200,{cancelled:{booleanValue:true},revision:{integerValue:'1'}});
await moderate(sender,[arrival(checkinEvent,recipient)],403);
const bulletinPath=`${eventPath}/bulletins/meeting-update`;
const bulletin={update:{name:documents+bulletinPath,fields:{text:str('Vamos nos encontrar no portão lateral.')}},updateTransforms:stamp('createdAt')};
await moderate(other,[bulletin],403);
await moderate(sender,[bulletin],200);
await request(sender,'GET',bulletinPath,200);
await request(other,'GET',bulletinPath,403);
await request(null,'GET',bulletinPath,403);
await request(recipient,'GET',`${eventPath}/bulletins`,403);
await request(recipient,'PATCH',rsvp,200,{attendees:both});
assert.equal((await request(recipient,'GET',bulletinPath,200)).fields.text.stringValue,'Vamos nos encontrar no portão lateral.');
await request(recipient,'PATCH',rsvp,200,{attendees:organizerOnly});
await request(recipient,'GET',bulletinPath,403);
const limitedPath=`${events}/limited-event`;
const cleared={nullValue:null};
const people=(...actors)=>({arrayValue:{values:actors.map(actor=>str(actor.localId))}});
const seat=(attendees,waitlist,offer=false)=>({
  update:{name:documents+limitedPath,fields:{attendees:people(...attendees),waitlist:people(...waitlist),...(!offer?{offerAt:cleared}:{})}},
  updateMask:{fieldPaths:['attendees','waitlist',...(!offer?['offerAt']:[])]},
  ...(offer?{updateTransforms:stamp('offerAt')}:{} )
});
await request(sender,'POST',`${events}?documentId=limited-event`,200,{
  ...standalone,capacity:{integerValue:'2'},waitlist:people(),offerAt:cleared
});
await moderate(recipient,[seat([sender,recipient],[])],200);
await moderate(other,[seat([sender,recipient,other],[])],403);
await moderate(other,[seat([sender,recipient],[other])],200);
await moderate(recipient,[seat([sender],[other])],403);
await moderate(recipient,[seat([sender],[other],true)],200);
await moderate(recipient,[seat([sender,recipient],[other])],403);
await moderate(other,[seat([sender,other],[])],200);
const limited=await request(sender,'GET',limitedPath,200);
assert.deepEqual(limited.fields.attendees.arrayValue.values,people(sender,other).arrayValue.values);
assert.equal(limited.fields.offerAt.nullValue,null);
const nextGuest=await signUp();
await moderate(recipient,[seat([sender,other],[recipient])],200);
await moderate(nextGuest,[seat([sender,other],[recipient,nextGuest])],200);
await moderate(other,[seat([sender],[recipient,nextGuest],true)],200);
await request({idToken:'owner'},'PATCH',`${limitedPath}?updateMask.fieldPaths=offerAt`,200,{offerAt:{timestampValue:new Date(Date.now()-3700000).toISOString()}});
await moderate(recipient,[seat([sender,recipient],[nextGuest])],403);
await moderate(nextGuest,[seat([sender],[nextGuest],true)],200);
await moderate(nextGuest,[seat([sender,nextGuest],[])],200);
const questionPath=`${eventPath}/questions/meeting-point`;
const eventPin=`${eventPath}/discussion/pinned`;
const ask=(actor,path=questionPath)=>({
  update:{name:documents+path,fields:{authorId:str(actor.localId),question:str('Onde o grupo vai se encontrar?')}},
  updateTransforms:stamp('createdAt')
});
const answer={
  update:{name:documents+questionPath,fields:{answer:str('No portão principal.')}},
  updateMask:{fieldPaths:['answer']},updateTransforms:stamp('answeredAt')
};
await moderate(other,[ask(recipient)],403);
await moderate(other,[ask(other)],200);
await request(other,'GET',`${eventPath}/questions`,200);
await request(null,'GET',questionPath,403);
await request(sender,'PATCH',eventPin,403,{questionId:str('meeting-point')});
await moderate(other,[answer],403);
await moderate(sender,[{...answer,updateMask:{fieldPaths:['answer','question']}}],403);
const replyNoticePath=`public/data/members/${other.localId}/notifications/event-answer-group-event:meeting-point`;
const replyNotice={update:{name:documents+replyNoticePath,fields:{
  type:str('event-answer'),actorId:str(sender.localId),eventId:str('group-event'),questionId:str('meeting-point')
}},updateTransforms:stamp('createdAt')};
await moderate(sender,[replyNotice],403);
await moderate(sender,[answer,{...replyNotice,update:{...replyNotice.update,name:documents+replyNoticePath.replace(other.localId,recipient.localId)}}],403);
await moderate(sender,[answer,replyNotice],200);
await request(other,'GET',replyNoticePath,200);
await request(sender,'GET',replyNoticePath,403);
await request(recipient,'GET',replyNoticePath,403);
await moderate(sender,[answer,replyNotice],403);
await request(other,'PATCH',eventPin,403,{questionId:str('meeting-point')});
await request(sender,'PATCH',eventPin,200,{questionId:str('meeting-point')});
assert.equal((await request(other,'GET',eventPin,200)).fields.questionId.stringValue,'meeting-point');
assert.equal((await request(other,'GET',questionPath,200)).fields.answer.stringValue,'No portão principal.');
await moderate(other,[ask(other,`${events}/standalone/questions/cancelled`)],403);
await request(other,'DELETE',eventPin,403);
await request(sender,'DELETE',eventPin,200);
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
const selectedCommentPath=`${commentPath}/moderated-comment`;
const selectedComment=await request(sender, 'GET', selectedCommentPath, 200);
const siblings=`${commentPath}/unaffected`;
await request(sender, 'POST', `${commentPath}?documentId=unaffected`, 200, {
  userId:str(sender.localId),text:str('Outro comentário permanece'),createdAt:{integerValue:'2'}
});
const commentEntry=`${group}/moderationLog/comment-removal-1`;
const commentPointer='public/data/posts/welcome-post/removedComments/moderated-comment';
await moderate(recipient,[
  {update:{name:documents+commentEntry,fields:{postId:str('welcome-post'),commentId:str('moderated-comment'),
    comment:{mapValue:{fields:selectedComment.fields}},reason:str('Motivo do comentário'),removedBy:str(recipient.localId)}},
    updateTransforms:stamp('removedAt')},
  {update:{name:documents+commentPointer,fields:{groupId:str('welcome-group'),entryId:str('comment-removal-1')}}},
  {delete:documents+selectedCommentPath}
],200);
await request(other, 'GET', selectedCommentPath, 404);
await request(other, 'GET', siblings, 200);
await request(other, 'GET', 'public/data/posts/welcome-post', 200);
await request(other, 'GET', commentEntry, 403);
await request(sender, 'POST', `${commentPath}?documentId=moderated-comment`, 403, selectedComment.fields);
const restoreComment=actor=>[
  {update:{name:documents+selectedCommentPath,fields:selectedComment.fields}},
  {delete:documents+commentPointer},
  {update:{name:documents+commentEntry,fields:{restoredBy:str(actor.localId)}},
    updateMask:{fieldPaths:['restoredBy']},updateTransforms:stamp('restoredAt')}
];
await moderate(recipient,restoreComment(recipient),403);
await moderate(sender,restoreComment(sender),200);
const originalComment=await request(other, 'GET', selectedCommentPath, 200);
assert.equal(originalComment.fields.text.stringValue,selectedComment.fields.text.stringValue);
await request(other, 'GET', siblings, 200);
const commentHistory=await request(sender, 'GET', commentEntry, 200);
assert.equal(commentHistory.fields.restoredBy.stringValue,sender.localId);
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

const queuePath=`${group}/reports`;
const postReport=`${queuePath}/post-report`;
const commentReport=`${queuePath}/comment-report`;
const fileReport=(actor,path,targetType,text,commentId='')=>[{
  update:{name:documents+path,fields:{targetType:str(targetType),postId:str('welcome-post'),
    commentId:str(commentId),text,reason:str('Spam'),details:str(''),reporterId:str(actor.localId),status:str('pending')}},
  updateTransforms:stamp('createdAt'),currentDocument:{exists:false}
}];
const welcomePost=await request(sender,'GET','public/data/posts/welcome-post',200);
const senderNotices=`public/data/members/${sender.localId}/notifications`;
const followNotice=`${senderNotices}/follow-${recipient.localId}`;
const followSource=`public/data/members/${recipient.localId}/following/${sender.localId}`;
const notice=(path,type,actor,postId='',commentId='')=>({
  update:{name:documents+path,fields:{type:str(type),actorId:str(actor.localId),postId:str(postId),commentId:str(commentId)}},
  updateTransforms:stamp('createdAt')
});
const followWrite={update:{name:documents+followSource,fields:{createdAt:{integerValue:'1'}}}};
await moderate(recipient,[notice(followNotice,'follow',recipient)],403);
await moderate(recipient,[followWrite,notice(followNotice,'follow',recipient)],200);
await request(sender,'GET',senderNotices,200);
await request(recipient,'GET',senderNotices,403);
await request(other,'GET',followNotice,403);
await moderate(recipient,[notice(followNotice,'follow',recipient)],403);
await request(recipient,'DELETE',followSource,200);
await moderate(recipient,[followWrite,notice(followNotice,'follow',recipient)],200);
const commentNotice=`${senderNotices}/comment-welcome-post:notified-comment`;
const commentWrite={update:{name:documents+commentPath+'/notified-comment',
  fields:{userId:str(recipient.localId),text:str('Comentário com aviso'),createdAt:{integerValue:'2'}}}};
await moderate(recipient,[notice(commentNotice,'comment',recipient,'welcome-post','notified-comment')],403);
await moderate(recipient,[commentWrite,notice(commentNotice.replace(sender.localId,other.localId),'comment',recipient,'welcome-post','notified-comment')],403);
await moderate(recipient,[commentWrite,notice(commentNotice,'comment',recipient,'welcome-post','notified-comment')],200);
await request(sender,'GET',commentNotice,200);
await request(other,'GET',commentNotice,403);
await moderate(other,fileReport(other,postReport,'post',welcomePost.fields.content),403);
await moderate(sender,fileReport(sender,postReport,'post',welcomePost.fields.content),403);
await moderate(recipient,fileReport(recipient,postReport,'post',str('Texto inventado')),403);
await moderate(recipient,fileReport(recipient,postReport,'post',welcomePost.fields.content),200);
await request(recipient,'GET',postReport,403);
await request(other,'GET',queuePath,403);
await request(sender,'GET',queuePath,200);
const review=(actor,path,status,moderationId='')=>({
  update:{name:documents+path,fields:{status:str(status),reviewedBy:str(actor.localId),moderationId:str(moderationId)}},
  updateMask:{fieldPaths:['status','reviewedBy','moderationId']},updateTransforms:stamp('reviewedAt')
});
await moderate(recipient,[review(recipient,postReport,'kept')],403);
await request(sender,'PATCH',rolePath,200,pendingRole);
await request(recipient,'PATCH',rolePath,200,activeRole);
await request(recipient,'GET',queuePath,200);
await moderate(recipient,[review(recipient,postReport,'kept')],200);
await moderate(sender,[review(sender,postReport,'kept')],403);
await moderate(recipient,fileReport(recipient,commentReport,'comment',originalComment.fields.text,'moderated-comment'),200);
const queueEntry=`${group}/moderationLog/queue-removal`;
await moderate(recipient,[review(recipient,commentReport,'removed','queue-removal')],403);
await moderate(recipient,[
  {update:{name:documents+queueEntry,fields:{postId:str('welcome-post'),commentId:str('moderated-comment'),
    comment:{mapValue:{fields:originalComment.fields}},reason:str('Spam'),removedBy:str(recipient.localId)}},
    updateTransforms:stamp('removedAt')},
  {update:{name:documents+commentPointer,fields:{groupId:str('welcome-group'),entryId:str('queue-removal')}}},
  {delete:documents+selectedCommentPath},
  review(recipient,commentReport,'removed','queue-removal')
],200);
await request(other,'GET',selectedCommentPath,404);
await request(other,'GET',siblings,200);
assert.equal((await request(sender,'GET',commentReport,200)).fields.status.stringValue,'removed');

const pollPath=`${group}/polls/test-poll`;
const totalsPath=`${pollPath}/totals/main`;
const ballotPath=actor=>`${pollPath}/votes/${actor.localId}`;
const integer=value=>({integerValue:String(value)});
const end=timestampValue=>({timestampValue});
const pollWrites=(actor,endsAt=Date.now()+86400000)=>[
  {update:{name:documents+pollPath,fields:{question:str('Qual será o próximo encontro?'),
    options:{mapValue:{fields:{a:str('Passeio'),b:str('Oficina'),c:str(''),d:str('')}}},
    createdBy:str(actor.localId),endsAt:end(new Date(endsAt).toISOString())}},updateTransforms:stamp('createdAt')},
  {update:{name:documents+totalsPath,fields:{a:integer(0),b:integer(0),c:integer(0),d:integer(0)}}}
];
const ballot=(actor,choice)=>({update:{name:documents+ballotPath(actor),fields:{option:str(choice)}}});
const countChanges=changes=>({transform:{document:documents+totalsPath,fieldTransforms:
  Object.entries(changes).map(([fieldPath,value])=>({fieldPath,increment:integer(value)}))}});
await request(sender,'DELETE',rolePath,200);
await moderate(recipient,pollWrites(recipient),403);
await request(sender,'PATCH',rolePath,200,pendingRole);
await moderate(recipient,pollWrites(recipient),403);
await moderate(sender,pollWrites(sender,Date.now()-1000),403);
await moderate(sender,[pollWrites(sender)[0]],403);
await moderate(sender,pollWrites(sender),200);
await request(recipient,'GET',`${group}/polls`,200);
await request(other,'GET',`${group}/polls`,403);
await request(recipient,'GET',ballotPath(recipient),404);
await request(recipient,'GET',totalsPath,403);
await moderate(other,[ballot(other,'a'),countChanges({a:1})],403);
await moderate(recipient,[ballot(recipient,'a')],403);
await moderate(recipient,[countChanges({a:1})],403);
await moderate(recipient,[ballot(recipient,'a'),countChanges({a:2})],403);
await moderate(recipient,[ballot(recipient,'c'),countChanges({c:1})],403);
await moderate(recipient,[ballot(recipient,'a'),countChanges({a:1})],200);
await request(sender,'GET',ballotPath(recipient),403);
await request(recipient,'GET',`${pollPath}/votes`,403);
await request(recipient,'GET',totalsPath,200);
await moderate(recipient,[ballot(recipient,'a'),countChanges({a:1})],403);
await moderate(recipient,[ballot(recipient,'b'),countChanges({a:-1,b:1})],200);
const tallies=await request(recipient,'GET',totalsPath,200);
assert.equal(tallies.fields.a.integerValue,'0');
assert.equal(tallies.fields.b.integerValue,'1');
await request(recipient,'PATCH',rolePath,200,activeRole);
await moderate(recipient,pollWrites(recipient).map(write=>({
  ...write,update:{...write.update,name:write.update.name.replace('test-poll','moderator-poll')}
})),200);
await request({idToken:'owner'},'PATCH',`${pollPath}?updateMask.fieldPaths=endsAt`,200,{endsAt:end(new Date(0).toISOString())});
await request(sender,'GET',totalsPath,200);
await moderate(recipient,[ballot(recipient,'a'),countChanges({a:1,b:-1})],403);

console.log('Permissões de mensagens, perfis, denúncias e publicações fixadas testadas no emulador.');
