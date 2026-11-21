import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Tests the UI and chat creation logic without real Firebase credentials.
function appContext(handlers = {}) {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8')
    .replace(/\binit\(\);\s*$/, '');
  const context = vm.createContext({
    console, Date, URL, TextEncoder, setTimeout, clearTimeout, navigator: {},
    localStorage: { getItem: () => null, setItem: () => {} },
    window: { addEventListener: () => {}, scrollTo: () => {}, scrollY: 0 },
    document: { addEventListener: (event, handler) => { handlers[event] = handler; }, getElementById: () => null }
  });
  vm.runInContext(source, context, {filename: 'app.js', timeout: 1500});
  return context;
}

test('the feed reminds confirmed attendees about active events tomorrow using the current details', () => {
  const context = appContext();
  const markup = vm.runInContext(`
    state.user={uid:'guest'};
    state.events=[
      {id:'e',title:'Caminhada confirmada',date:'2099-01-01',time:'14:30',location:'Biblioteca nova',attendees:['guest']},
      {id:'other',title:'Sem confirmação',date:'2099-01-01',attendees:['another']},
      {id:'cancelled',title:'Inativo',date:'2099-01-01',attendees:['guest'],cancelled:true},
      {id:'later',title:'Mais tarde',date:'2099-01-02',attendees:['guest']}
    ];
    renderEventReminders(tomorrow(new Date(2098,11,31,23)))
  `, context);
  assert.match(markup, /Caminhada confirmada/);
  assert.match(markup, /14:30 · Biblioteca nova/);
  assert.match(markup, /data-action="view-event" data-id="e"/);
  assert.doesNotMatch(markup, /Sem confirmação|Inativo|Mais tarde/);
  assert.equal(vm.runInContext(`state.events[0].cancelled=true;renderEventReminders('2099-01-01')`, context), '');
});

test('the organizer can repeat a finished event with a new date and fresh confirmations', async () => {
  const handlers = {};
  const context = appContext(handlers);
  context.writes = [];
  context.opened = [];
  const organizer = vm.runInContext(`
    state.user={uid:'owner'};
    state.groups=[{id:'group',name:'Fotografia',hobby:'Fotografia',members:['owner']}];
    state.events=[{id:'old',groupId:'group',createdBy:'owner',title:'Caminhada',date:'2000-01-01',time:'10:00',
      hobby:'Fotografia',location:'Praça pública',description:'Encontro do grupo',attendees:['owner','guest'],revision:1}];
    state.selectedEvent='old';state.modal='event-detail';renderModal()
  `, context);
  assert.match(organizer, /data-action="repeat-event"/);
  assert.doesNotMatch(vm.runInContext(`state.user={uid:'guest'};renderModal()`, context), /data-action="repeat-event"/);
  await vm.runInContext(`state.user={uid:'owner'};onAction({dataset:{action:'repeat-event',id:'old'}})`, context);
  const form = vm.runInContext('renderModal()', context);
  assert.match(form, /value="Caminhada"/);
  assert.match(form, /value="Praça pública"/);
  assert.match(form, /Encontro do grupo/);
  assert.doesNotMatch(form, /2000-01-01|10:00/);
  context.FormData = function () { return Object.entries({
    title:'Caminhada',date:'2099-05-09',time:'14:30',hobby:'Fotografia',location:'Praça pública',description:'Encontro do grupo'
  }); };
  vm.runInContext(`
    closeModal=()=>{};setTab=()=>{};showToast=()=>{};openEventDetail=id=>opened.push(id);
    firebase={collection:()=> 'events',addDoc:(_path,value)=>{writes.push(value);return {id:'new'};}};
  `, context);
  await handlers.submit({target:{id:'event-form'},preventDefault(){}});
  const newEvent = context.writes[0];
  assert.equal(newEvent.groupId, 'group');
  assert.equal(newEvent.date, '2099-05-09');
  assert.deepEqual([...newEvent.attendees], ['owner']);
  assert.equal('revision' in newEvent, false);
  assert.deepEqual(context.opened, ['new']);
  assert.equal(vm.runInContext('state.events[0].attendees.length', context), 2);
});

test('only the organizer sees the feedback summary and confirmed guests can answer after the event date', () => {
  const context = appContext();
  const organizer = vm.runInContext(`
    state.user={uid:'owner'};
    const ended={id:'e',createdBy:'owner',date:'2000-01-01',attendees:['guest']};
    state.eventFeedback={id:'e',entries:[{id:'guest',attended:true,comment:'<b>Repetir</b>'}]};
    renderEventFeedback(ended)
  `, context);
  assert.match(organizer, /Resumo privado/);
  assert.match(organizer, /1 compareceu/);
  assert.match(organizer, /&lt;b&gt;Repetir&lt;\/b&gt;/);
  const guest = vm.runInContext(`state.user={uid:'guest'};renderEventFeedback(ended)`, context);
  assert.match(guest, /Você compareceu/);
  assert.doesNotMatch(guest, /Resumo privado/);
  assert.equal(vm.runInContext(`state.user={uid:'stranger'};renderEventFeedback(ended)`, context), '');
  assert.equal(vm.runInContext(`state.user={uid:'guest'};renderEventFeedback({...ended,date:'2099-01-01'})`, context), '');
  assert.equal(vm.runInContext(`renderEventFeedback({...ended,cancelled:true})`, context), '');
});

test('event invitations wait for login and display participation before the calendar action', () => {
  const context = appContext();
  context.window.location = {hash:'#event=e',pathname:'/HobbyHub/',origin:'https://example.test'};
  vm.runInContext(`state.eventsLoaded=true;openLinkedContent()`, context);
  assert.equal(vm.runInContext('state.modal', context), null);
  const guest = vm.runInContext(`
    state.user={uid:'guest'};state.groups=[{id:'g',name:'Fotografia',members:[]}];
    state.events=[{id:'e',groupId:'g',title:'Caminhada',date:'2099-01-01',attendees:[]}];
    openLinkedContent();renderModal()
  `, context);
  assert.match(guest, /Caminhada/);
  assert.match(guest, /Participar da comunidade/);
  assert.doesNotMatch(guest, /data-action="event-calendar"/);
  const joined = vm.runInContext(`state.groups[0].members.push('guest');state.events[0].attendees.push('guest');renderModal()`, context);
  assert.match(joined, /Adicionar ao calendário/);
});

test('calendar data includes the clean event link and escapes user text', () => {
  const context = appContext();
  context.window.location = {pathname:'/HobbyHub/',origin:'https://example.test',hostname:'example.test',search:'?utm_source=test'};
  const event = {id:'e',title:'Foto, vídeo; encontro',description:'Linha 1\n'+ 'ç'.repeat(80),location:'Praça',date:'2099-05-07',time:'10:30',revision:2};
  context.event = event;
  const file = vm.runInContext(`calendarFile(event,new Date('2026-11-21T10:00:00Z'))`, context);
  assert.match(file, /DTSTART:20990507T103000/);
  assert.match(file, /DTSTAMP:20261121T100000Z/);
  assert.match(file, /UID:e@example.test\r\n/);
  assert.match(file, /SEQUENCE:2\r\n/);
  assert.match(file, /SUMMARY:Foto\\, vídeo\\; encontro/);
  assert.match(file, /LOCATION:Praça/);
  assert.match(file, /URL:https:\/\/example.test\/HobbyHub\/#event=e/);
  assert.doesNotMatch(file, /utm_source/);
  assert.ok(file.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
});

test('event notices show schedule changes and only reach confirmed members with unseen revisions', () => {
  const context = appContext();
  const initial = vm.runInContext(`
    state.user={uid:'guest'};state.eventReadsLoaded=true;
    state.events=[
      {id:'e',title:'Caminhada',date:'2099-01-01',time:'14:30',location:'Praça',revision:1,attendees:['guest'],
       previousSchedule:{date:'2099-01-01',time:'10:00',location:'Praça',revision:1}},
      {id:'other',title:'Sem confirmação',date:'2099-01-01',revision:2,attendees:['another']}
    ];
    renderEventNotices()
  `, context);
  assert.match(initial, /Horário alterado de 10:00 para 14:30/);
  assert.doesNotMatch(initial, /Sem confirmação/);
  assert.equal(vm.runInContext(`state.eventReads.set('e',1);renderEventNotices()`, context), '');
  assert.match(vm.runInContext(`state.events[0].revision=2;state.events[0].cancelled=true;renderEventNotices()`, context), /Evento cancelado/);
});

test('an event notice stays unread until the server confirms the receipt', async () => {
  const context = appContext();
  let confirmWrite;
  context.pendingWrite = new Promise(resolve => { confirmWrite = resolve; });
  vm.runInContext(`
    state.user={uid:'guest'};
    state.events=[{id:'e',revision:1,attendees:['guest']}];
    firebase={doc:()=> 'receipt',setDoc:()=>pendingWrite};
  `, context);
  const opening = vm.runInContext(`onAction({dataset:{action:'view-event-notice',id:'e'}})`, context);
  assert.equal(vm.runInContext("state.eventReads.has('e')", context), false);
  confirmWrite();
  await opening;
  assert.equal(vm.runInContext("state.eventReads.get('e')", context), 1);
});

test('organizer controls are private and cancelled event links remain readable', () => {
  const context = appContext();
  const setup = `
    state.user={uid:'owner'};state.modal='event-detail';state.selectedEvent='e';
    state.events=[{id:'e',createdBy:'owner',title:'Caminhada',date:'2099-01-01',attendees:['owner','guest'],revision:1}];
    renderModal()
  `;
  const organizer = vm.runInContext(setup, context);
  assert.match(organizer, /data-action="edit-event"/);
  assert.match(organizer, /Baixar calendário atualizado/);
  const guest = vm.runInContext(`state.user={uid:'guest'};renderModal()`, context);
  assert.doesNotMatch(guest, /data-action="(?:edit|cancel)-event"/);
  const cancelled = vm.runInContext(`state.events[0].cancelled=true;renderModal()`, context);
  assert.match(cancelled, /Evento cancelado/);
  assert.match(cancelled, /disabled>Cancelado/);
  assert.match(cancelled, /Copiar link do evento/);
  assert.doesNotMatch(cancelled, /data-action="event-calendar"/);
});

test('community events appear in their group with member-only confirmation', () => {
  const context = appContext();
  const markup = vm.runInContext(`
    state.user={uid:'member'};
    state.selectedGroup='g';state.modal='group-detail';
    state.groups=[{id:'g',name:'Fotografia',members:['member']}];
    state.events=[
      {id:'e',groupId:'g',title:'Caminhada do grupo',date:'2099-01-01'},
      {id:'other',groupId:'x',title:'Evento de outro grupo',date:'2099-01-01'}
    ];
    renderModal()
  `, context);
  assert.match(markup, /Caminhada do grupo/);
  assert.match(markup, /Confirmar presença/);
  assert.match(markup, /data-action="group-event"/);
  assert.doesNotMatch(markup, /Evento de outro grupo/);
  const visitor = vm.runInContext(`state.user={uid:'visitor'};renderModal()`, context);
  assert.match(visitor, /disabled>Só para membros/);
  assert.doesNotMatch(visitor, /data-action="group-event"/);
});

test('an invited visitor sees Participar before the first-contribution actions', () => {
  const context = appContext();
  context.window.location = {hash:'#group=g'};
  const before = vm.runInContext(`
    state.user={uid:'guest'};state.groupsLoaded=true;state.welcomePending=true;
    state.groups=[{id:'g',name:'Fotografia',createdBy:'owner',members:['owner'],pinnedPostId:'p'}];
    state.posts=[{id:'p',groupId:'g',content:'Conte seu hobby favorito'}];
    openLinkedContent();renderModal()
  `, context);
  assert.match(before, /Participe desta comunidade/);
  assert.doesNotMatch(before, /data-action="introduce-group"/);
  assert.equal(vm.runInContext('state.welcomePending', context), false);
  const after = vm.runInContext(`state.groups[0].members.push('guest');renderModal()`, context);
  assert.match(after, /Responder à publicação fixada/);
  assert.match(after, /data-action="introduce-group"/);
});

test('a new member without an invitation sees matching groups and can skip to the feed', () => {
  const context = appContext();
  context.window.location = {hash:''};
  const first = vm.runInContext(`
    state.user={uid:'new'};state.profile={location:'Santos, SP',hobbies:['Leitura']};
    state.groups=[
      {id:'outside',name:'Clube de outra cidade',location:'Campinas',hobby:'Games'},
      {id:'matching',name:'Leitura em Santos',location:'Santos',hobby:'Leitura'},
      {id:'already',name:'Grupo já seguido',location:'Santos',hobby:'Leitura',members:['new']}
    ];
    state.groupsLoaded=true;state.welcomePending=true;
    openLinkedContent();renderModal()
  `, context);
  assert.match(first, /Boas-vindas ao HobbyHub/);
  assert.match(first, /Pular e ir ao feed/);
  assert.ok(first.indexOf('Leitura em Santos') < first.indexOf('Clube de outra cidade'));
  assert.doesNotMatch(first, /Grupo já seguido/);
  assert.equal(vm.runInContext("state.modal=null;openLinkedContent();state.modal", context), null);
});

test('a community invitation waits for sign-in and opens the intended group without query parameters', () => {
  const context = appContext();
  context.window.location = { pathname:'/HobbyHub/',origin:'https://example.test',hash:'#group=g_123',search:'?utm_source=chatgpt.com' };
  vm.runInContext(`state.groups=[{id:'g_123'}];state.groupsLoaded=true;openLinkedContent()`, context);
  assert.equal(vm.runInContext('state.modal', context), null);
  vm.runInContext(`state.user={uid:'member'};state.groupsLoaded=false;openLinkedContent()`, context);
  assert.equal(vm.runInContext('state.modal', context), null);
  vm.runInContext(`state.groupsLoaded=true;openLinkedContent()`, context);
  assert.equal(vm.runInContext('state.selectedGroup', context), 'g_123');
  assert.equal(vm.runInContext('state.modal', context), 'group-detail');
  assert.equal(vm.runInContext(`contentLink('group','g_123')`, context), 'https://example.test/HobbyHub/#group=g_123');
});

test('a pinned group post appears once and only the creator sees pin controls', () => {
  const context = appContext();
  const owner = vm.runInContext(`
    state.user={uid:'owner'};
    state.selectedGroup='g';
    state.modal='group-detail';
    state.groups=[{id:'g',name:'Fotógrafos',createdBy:'owner',members:['owner'],pinnedPostId:'pinned'}];
    state.posts=[{id:'new',groupId:'g',content:'Mais recente'},{id:'pinned',groupId:'g',content:'Boas-vindas ao grupo'}];
    renderModal()
  `, context);
  assert.equal([...owner.matchAll(/Boas-vindas ao grupo/g)].length, 1);
  assert.ok(owner.indexOf('Boas-vindas ao grupo') < owner.indexOf('Mais recente'));
  assert.match(owner, /data-action="unpin-group-post"/);
  const member = vm.runInContext(`state.user={uid:'visitor'};renderModal()`, context);
  assert.match(member, /Publicação fixada/);
  assert.doesNotMatch(member, /data-action="(?:un)?pin-group-post"/);
});

test('unread navigation counts conversations and highlights each one in the list', () => {
  const context = appContext();
  const list = vm.runInContext(`
    state.user={uid:'a'};
    state.threads=[{id:'a_b',participants:['a','b']},{id:'a_c',participants:['a','c']}];
    state.latestInboundAt.set('a_b',200);state.latestInboundAt.set('a_c',300);
    state.privateReadAt.set('a_c',300);
    renderMessages()
  `, context);
  assert.match(list, /chat-unread"[^>]+data-id="b"/);
  assert.doesNotMatch(list, /chat-unread"[^>]+data-id="c"/);
  const badges = vm.runInContext('renderSidebar() + renderBottomNav()', context);
  assert.equal([...badges.matchAll(/1 conversa não lida/g)].length, 2);
  assert.equal(vm.runInContext("state.privateReadAt.set('a_b',200);unreadBadge('messages')", context), '');
});

test('read markers advance to received messages only when the private chat is visible', async () => {
  const context = appContext();
  context.writes = [];
  vm.runInContext(`
    state.user={uid:'a'};state.chatTarget={uid:'b'};
    state.tab='messages';state.chatMode='direct';
    state.directMessages=[{senderId:'b',createdAt:200},{senderId:'a',createdAt:400}];
    document.visibilityState='hidden';render=()=>{};db={};
    firebase={doc:()=> 'marker',runTransaction:async(_db,operation)=>operation({
      get:async()=>({data:()=>({lastReadAt:100})}),set:(_path,marker)=>writes.push(marker.lastReadAt)
    })};
  `, context);
  await vm.runInContext('markOpenConversationRead()', context);
  assert.deepEqual(context.writes, []);
  await vm.runInContext("document.visibilityState='visible';markOpenConversationRead()", context);
  assert.deepEqual(context.writes, [200]);
  assert.equal(vm.runInContext("state.privateReadAt.get('a_b')", context), 200);
});

test('reports only the selected private message', async () => {
  const handlers = {};
  const context = appContext(handlers);
  context.FormData = function () { return [['reason', 'Outro'], ['details', 'Contexto opcional']]; };
  context.writes = [];
  vm.runInContext(`
    state.user={uid:'a'};
    state.chatTarget={uid:'b'};
    state.directMessages=[
      {id:'selected',senderId:'b',text:'Mensagem selecionada'},
      {id:'other',senderId:'b',text:'Mensagem que deve permanecer privada'}
    ];
    render=()=>{};
    closeModal=()=>{};
    showToast=()=>{};
    firebase={collection:()=> 'reports', addDoc:(_path,report)=>{writes.push(report);}};
    openReport('privateMessage','selected');
  `, context);
  await handlers.submit({target:{id:'report-form'},preventDefault(){}});
  assert.equal(context.writes.length, 1);
  const report = context.writes[0];
  assert.equal(report.targetId, 'selected');
  assert.equal(report.targetText, 'Mensagem selecionada');
  assert.equal(report.parentId, 'a_b');
  assert.doesNotMatch(JSON.stringify(report), /Mensagem que deve permanecer privada/);
});

test('blocked private conversations keep the history and hide the composer', () => {
  const context = appContext();
  const markup = vm.runInContext(`
    state.user={uid:'a'};
    state.chatMode='direct';
    state.chatTarget={uid:'b',name:'Pessoa'};
    state.directMessages=[{text:'Mensagem anterior'}];
    state.blockedIds=['b'];
    renderMessages()
  `, context);
  assert.match(markup, /Mensagem anterior/);
  assert.match(markup, /data-action="unblock-member"/);
  assert.doesNotMatch(markup, /id="message-form"/);
});

test('Explorar combines hobby and city filters', () => {
  const context = appContext();
  const markup = vm.runInContext(`
    state.user={uid:'a'};
    state.profile={hobbies:['Fotografia'],location:'Nova Friburgo, RJ'};
    state.members=[
      {uid:'b',name:'Persona compatível',hobbies:['Fotografia'],location:'Nova Friburgo - RJ'},
      {uid:'c',name:'Pessoa de outra cidade',hobbies:['Fotografia'],location:'Petrópolis'},
      {uid:'d',name:'Pessoa de outro hobby',hobbies:['Leitura'],location:'Nova Friburgo'}
    ];
    state.exploreCity='nova friburgo';state.exploreHobby='fotografia';
    renderExplore()
  `, context);
  assert.match(markup, /Persona compatível/);
  assert.match(markup, /Também gosta de Fotografia/);
  assert.doesNotMatch(markup, /Pessoa de outra cidade|Pessoa de outro hobby/);
});

test('profile media renders HTTPS files and rejects unsafe protocols', () => {
  const context = appContext();
  const markup = vm.runInContext(`
    renderProfileMedia({photoUrl:'https://example.test/foto.jpg',videoUrl:'https://example.test/video.mp4'})
  `, context);
  assert.match(markup, /<img src="https:\/\/example.test\/foto.jpg"/);
  assert.match(markup, /<video src="https:\/\/example.test\/video.mp4"/);
  assert.equal(vm.runInContext(`renderProfileMedia({photoUrl:'javascript:alert(1)',videoUrl:'http://example.test/video.mp4'})`, context), '');
});

test('global chat and city chat show distinct messages, including older local messages', () => {
  const context = appContext();
  const local = vm.runInContext(`
    state.profile={location:'Nova Friburgo, RJ'};
    state.messages=[
      {text:'Mensagem antiga da cidade',location:'Nova Friburgo'},
      {text:'Mensagem de outra cidade',location:'Petrópolis'},
      {text:'Mensagem para todos',scope:'global',location:'Nova Friburgo'}
    ];
    renderMessages()
  `, context);
  assert.match(local, /Mensagem antiga da cidade/);
  assert.doesNotMatch(local, /Mensagem de outra cidade|Mensagem para todos/);
  const global = vm.runInContext(`state.chatMode='global';renderMessages()`, context);
  assert.match(global, /Mensagem para todos/);
  assert.doesNotMatch(global, /Mensagem antiga da cidade|Mensagem de outra cidade/);
});

for (const replacementText of ['Olá!', 'Próxima mensagem']) {
  test(`handles a replaced message form containing "${replacementText}" after sending`, async () => {
    const submitHandler = {};
    const context = appContext(submitHandler);
    context.FormData = function () { return [['message', 'Olá!']]; };
    const key = 'message-form:user-a:global';
    const form = {id:'message-form',dataset:{draftKey:key},elements:{message:{value:'Olá!'}}};
    const current = {dataset:{draftKey:key},elements:{message:{value:replacementText}}};
    let finishSending;
    context.sending = new Promise(resolve => { finishSending = resolve; });
    context.writes = [];
    vm.runInContext(`
      state.user={uid:'user-a'};state.chatMode='global';render=()=>{};db={};
      firebase={collection:()=> 'messages', addDoc:(_target,payload)=>{writes.push(payload);return sending;}};
    `, context);
    context.document.getElementById = () => form;
    const submission = submitHandler.submit({target:form,preventDefault(){}});
    context.document.getElementById = () => current;
    finishSending();
    await submission;
    assert.equal(current.elements.message.value, replacementText === 'Olá!' ? '' : replacementText);
    assert.equal(context.writes[0].scope, 'global');
    assert.equal(context.writes.length, 1);
  });
}

test('escapes untrusted text before HTML rendering', () => {
  const context = appContext();
  assert.equal(vm.runInContext(`esc('<img src=x onerror="alert(1)">')`, context),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});

test('search normalization handles diacritics and whitespace', () => {
  const context = appContext();
  assert.equal(vm.runInContext(`norm('  Fotógrafos  DA  Serra ')`, context),
    'fotografos da serra');
});

test('login offers password recovery without password field on reset screen', () => {
  const context = appContext();
  const login = vm.runInContext(`state.authMode='login';renderAuth()`, context);
  const reset = vm.runInContext(`state.authMode='reset';renderAuth()`, context);
  assert.match(login, /data-action="forgot-password"/);
  assert.match(reset, /id="reset-form"/);
  assert.match(reset, /name="email"/);
  assert.doesNotMatch(reset, /name="password"/);
});

test('direct message thread ID is stable for either participant order', () => {
  const context = appContext();
  assert.equal(vm.runInContext(`threadId('user-b','user-a')`, context),
    vm.runInContext(`threadId('user-a','user-b')`, context));
});

for (const exists of [false,true]) {
  test(exists ? 'does not overwrite an existing chat' : 'creates a new chat once', async()=>{
    const context = appContext();
    context.writes = [];
    vm.runInContext(`
      state.user={uid:'user-a'};
      state.profile={name:'Alice',location:'Brasil'};
      state.members=[{uid:'user-b',name:'Bruno'}];
      render=()=>{};
      db={};
      firebase={
        doc:(_db,...parts)=>parts.join('/'),
        collection:()=>({}),
        onSnapshot:()=>()=>{},
        runTransaction:async(_db,callback)=>callback({
          get:async()=>({exists:()=>${exists}}),
          set:(...args)=>writes.push(args)
        })
      };
    `, context);
    await vm.runInContext(`startDirect('user-b')`, context);
    assert.equal(context.writes.length, exists?0:1);
    assert.equal(vm.runInContext('state.chatMode',context),'direct');
  });
}

test('opens a conversation while a follow is awaiting confirmation', async () => {
  const context = appContext();
  let confirmFollow;
  context.followWrite = new Promise(resolve => { confirmFollow = resolve; });
  vm.runInContext(`
    state.user={uid:'user-a'};
    state.profile={name:'Alice'};
    state.members=[{uid:'user-b',name:'Bruno'}];
    render=()=>{};
    showToast=()=>{};
    db={};
    firebase={
      doc:(_db,...parts)=>parts.join('/'),
      collection:()=>({}),
      onSnapshot:()=>()=>{},
      setDoc:()=>followWrite,
      runTransaction:async(_db,callback)=>callback({
        get:async()=>({exists:()=>false}),
        set:()=>{}
      })
    };
  `, context);
  const follow = vm.runInContext(`onAction({dataset:{action:'follow',id:'user-b'}})`, context);
  try {
    assert.equal(vm.runInContext('state.updatingFollow', context), true);
    await vm.runInContext(`onAction({dataset:{action:'open-dm',id:'user-b'}})`, context);
    assert.equal(vm.runInContext('state.chatTarget?.uid', context), 'user-b');
  } finally {
    confirmFollow();
    await follow;
  }
});

test('local feed matches a city even with state suffix, but not a different city',()=>{
 const context=appContext();
 assert.equal(vm.runInContext(`state.profile={location:'Nova Friburgo, RJ'};locate('NOVA FRIBURGO - Rio de Janeiro')`,context),true);
 assert.equal(vm.runInContext(`locate('Petrópolis, RJ')`,context),false);
});
test('post card includes a share action for valid public posts',()=>{
 const context=appContext();
 const markup=vm.runInContext(`postCard({id:'abc123',userId:'other',content:'Olá!',hobby:'Leitura',location:'Brasil',likes:[]})`,context);
 assert.match(markup,/data-action="share-post"/);
 assert.match(markup,/data-id="abc123"/);
});
