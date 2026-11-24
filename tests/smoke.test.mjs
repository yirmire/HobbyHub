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

test('notifications count unread items and only show reports to current moderators', () => {
  const context = appContext();
  vm.runInContext(`
    state.user={uid:'owner'};
    state.members=[{uid:'visitor',name:'Lia'}];
    state.notifications=[{id:'follow-visitor',type:'follow',actorId:'visitor',createdAt:10}];
    state.receivedTestimonials=[{id:'visitor',createdAt:20}];
    state.groups=[{id:'owned',name:'Fotografia',createdBy:'owner'},{id:'other',name:'Pintura',createdBy:'visitor'}];
    state.reportNotices.set('owned',[{id:'one',createdAt:30}]);
    state.reportNotices.set('other',[{id:'two',createdAt:40}]);
  `, context);
  const html = vm.runInContext('renderNotifications()', context);
  assert.match(html, /Nova denúncia em Fotografia/);
  assert.match(html, /Lia começou a seguir você/);
  assert.match(html, /Ver depoimentos/);
  assert.doesNotMatch(html, /Pintura/);
  assert.match(vm.runInContext('notificationButton(true)', context), /4 não lidas/);
  vm.runInContext('markNotificationsRead(notificationItems())', context);
  assert.doesNotMatch(vm.runInContext('notificationButton()', context), /não lidas/);
  vm.runInContext("state.notifications[0].createdAt=50", context);
  assert.match(vm.runInContext('notificationButton()', context), /1 não lidas/);
});

test('group moderation history offers restoration to the creator only and escapes reasons', () => {
  const context = appContext();
  const owner = vm.runInContext(`
    state.user={uid:'owner'};state.modal='moderation-history';state.selectedGroup='g';
    state.groups=[{id:'g',createdBy:'owner',members:['owner','moderator']}];
    state.moderationHistory={groupId:'g',entries:[{id:'a',post:{content:'Texto original'},reason:'<b>Motivo</b>'}]};
    renderModal()
  `, context);
  assert.match(owner, /Restaurar publicação/);
  assert.match(owner, /&lt;b&gt;Motivo&lt;\/b&gt;/);
  const moderator = vm.runInContext(`state.user={uid:'moderator'};state.groupRoles.set('g','active');renderModal()`, context);
  assert.match(moderator, /Texto original/);
  assert.doesNotMatch(moderator, /Restaurar publicação/);
  assert.doesNotMatch(vm.runInContext(`state.groupRoles.clear();renderModal()`, context), /Texto original/);
});

test('comments left on a removed post do not render while the post is absent', () => {
  const context = appContext();
  const content = vm.runInContext(`
    state.modal='comments';state.selectedPost='removed';state.comments=[{text:'Comentário anterior'}];renderModal()
  `, context);
  assert.match(content, /Publicação indisponível/);
  assert.doesNotMatch(content, /Comentário anterior|id="comment-form"/);
});

test('group moderators can open a reason form for just the selected comment', async () => {
  const context = appContext();
  const comments = vm.runInContext(`
    state.user={uid:'moderator'};state.modal='comments';state.selectedPost='p';
    state.groups=[{id:'g',createdBy:'owner',members:['moderator']}];
    state.groupRoles.set('g','active');
    state.posts=[{id:'p',groupId:'g',content:'Publicação'}];
    state.comments=[{id:'c',userId:'owner',text:'Trecho selecionado'},{id:'sibling',userId:'owner',text:'Outro trecho'}];
    renderModal()
  `, context);
  assert.match(comments, /data-action="moderate-comment" data-id="c"/);
  await vm.runInContext(`onAction({dataset:{action:'moderate-comment',id:'c'}})`, context);
  const form = vm.runInContext('renderModal()', context);
  assert.match(form, /Remover comentário/);
  assert.match(form, /Trecho selecionado/);
  assert.doesNotMatch(form, /Outro trecho/);
});

test('a pending moderator can accept, and only active moderators get controls for that group', () => {
  const context = appContext();
  const pending = vm.runInContext(`
    state.user={uid:'member'};state.selectedGroup='g';state.modal='group-detail';
    state.groups=[{id:'g',name:'Fotografia',createdBy:'owner',members:['owner','member']},
      {id:'other',name:'Leitura',createdBy:'someone',members:['member','someone']}];
    state.posts=[{id:'p',groupId:'g',content:'Publicação do grupo'},{id:'p2',groupId:'other',content:'Publicação de outro grupo'}];
    state.groupRoles.set('g','pending');
    renderModal()
  `, context);
  assert.match(pending, /Aceitar convite/);
  assert.doesNotMatch(pending, /data-action="pin-group-post"/);
  const active = vm.runInContext(`state.groupRoles.set('g','active');renderModal()`, context);
  assert.match(active, /data-action="pin-group-post"/);
  assert.match(active, /data-action="moderate-post"/);
  assert.match(active, /Deixar a moderação/);
  assert.doesNotMatch(vm.runInContext(`state.selectedGroup='other';renderModal()`, context), /data-action="pin-group-post"/);
  assert.doesNotMatch(vm.runInContext(`state.selectedGroup='g';state.groupRoles.delete('g');renderModal()`, context), /data-action="pin-group-post"/);
});

test('community tabs separate memberships and show the latest post and nearest active event', () => {
  const context = appContext();
  const mine = vm.runInContext(`
    state.user={uid:'a'};
    state.groups=[
      {id:'mine',name:'Meu clube',members:['a'],hobby:'Fotografia',location:'São Paulo'},
      {id:'discovery',name:'Fotografia no litoral',members:['b'],hobby:'Fotografia',location:'Santos, SP'},
      {id:'wrongCity',name:'Fotografia da serra',members:['b'],hobby:'Fotografia',location:'Petrópolis'},
      {id:'wrongHobby',name:'Leitores do litoral',members:['b'],hobby:'Leitura',location:'Santos'}
    ];
    state.posts=[
      {id:'old',groupId:'mine',content:'Post antigo',createdAt:1},
      {id:'fresh',groupId:'mine',content:'Post mais recente',createdAt:2}
    ];
    state.events=[
      {id:'later',groupId:'mine',title:'Evento posterior',date:'2099-01-02',time:'15:00'},
      {id:'cancelled',groupId:'mine',title:'Evento cancelado',date:'2099-01-01',time:'10:00',cancelled:true},
      {id:'next',groupId:'mine',title:'Próximo encontro',date:'2099-01-01',time:'15:00'}
    ];
    renderGroups()
  `, context);
  assert.match(mine, /Meu clube/);
  assert.match(mine, /data-action="comments" data-id="fresh"/);
  assert.match(mine, /data-action="view-event" data-id="next"/);
  assert.doesNotMatch(mine, /Post antigo|Evento posterior|Evento cancelado|Fotografia no litoral/);
  const discovery = vm.runInContext(`
    state.groupView='discover';state.groupHobby='Fotografia';state.groupCity='santos';renderGroups()
  `, context);
  assert.match(discovery, /Fotografia no litoral/);
  assert.doesNotMatch(discovery, /Meu clube|Fotografia da serra|Leitores do litoral/);
});

test('the event agenda combines search, hobby, community and date filters', () => {
  const context = appContext();
  const results = vm.runInContext(`
    state.groups=[{id:'club',name:'Clube Litorâneo',location:'Santos, SP'},{id:'other',name:'Outro clube',location:'Santos'}];
    state.events=[
      {id:'match',title:'Passeio fotográfico',hobby:'Fotografia',groupId:'club',date:'2099-01-01',location:'Praça'},
      {id:'history',title:'Encontro antigo',hobby:'Fotografia',groupId:'club',date:'2000-01-01',location:'Praça'},
      {id:'hobby',title:'Outro hobby',hobby:'Leitura',groupId:'club',date:'2099-01-01'},
      {id:'group',title:'Outra comunidade',hobby:'Fotografia',groupId:'other',date:'2099-01-01'},
      {id:'city',title:'Outro local',hobby:'Fotografia',date:'2099-01-01',location:'Recife'}
    ];
    state.eventSearch='SANTOS';state.eventCommunity='club';state.eventHobby='Fotografia';
    renderEvents()
  `, context);
  assert.match(results, /Passeio fotográfico/);
  assert.match(results, /1 evento encontrado/);
  assert.doesNotMatch(results, /Encontro antigo|Outro hobby|Outra comunidade|Outro local/);
  assert.match(vm.runInContext(`state.eventFilter='past';renderEvents()`, context), /Encontro antigo/);
  assert.match(vm.runInContext(`state.eventSearch='Campinas';renderEvents()`, context), /Nenhum evento encontrado/);
});

test('the personal agenda recommends active events by profile hobby or community membership', () => {
  const context = appContext();
  const markup = vm.runInContext(`
    state.user={uid:'reader'};
    state.profile={hobbies:[' Fotografia analógica ']};
    state.groups=[{id:'joined',name:'Clube local',members:['reader']},{id:'external',name:'Outro clube',members:['other']}];
    state.events=[
      {id:'hobby',title:'Câmera e filme',date:'2099-06-02',hobby:'FOTOGRAFIA ANALOGICA'},
      {id:'community',title:'Corrida do clube',date:'2099-06-01',time:'16:00',groupId:'joined',hobby:'Corrida'},
      {id:'earlier-today',title:'Corrida concluída hoje',date:'2099-06-01',time:'09:00',groupId:'joined'},
      {id:'outside',title:'Corrida de fora',date:'2099-06-01',groupId:'external',hobby:'Corrida'},
      {id:'past',title:'Corrida antiga do clube',date:'2000-01-01',groupId:'joined'},
      {id:'cancelled',title:'Corrida cancelada do clube',date:'2099-06-03',groupId:'joined',cancelled:true}
    ];
    state.eventFilter='recommended';renderEvents(new Date(2099,5,1,10))
  `, context);
  assert.match(markup, /Corrida do clube[\s\S]*Câmera e filme/);
  assert.doesNotMatch(markup, /Corrida de fora|Corrida antiga do clube|Corrida concluída hoje|Corrida cancelada do clube/);
  const filtered = vm.runInContext("state.eventCommunity='joined';renderEvents(new Date(2099,5,1,10))", context);
  assert.match(filtered, /Corrida do clube/);
  assert.doesNotMatch(filtered, /Câmera e filme/);
});

test('Meus eventos lists confirmed events chronologically and keeps cancellation details visible', () => {
  const context = appContext();
  const markup = vm.runInContext(`
    state.user={uid:'reader'};
    state.events=[
      {id:'later',title:'Encontro da tarde',date:'2099-07-01',time:'15:00',location:'Praça',attendees:['reader']},
      {id:'earlier',title:'Encontro da manhã',date:'2099-07-01',time:'08:00',location:'Parque',attendees:['reader']},
      {id:'cancelled',title:'Encontro cancelado',date:'2099-06-30',cancelled:true,attendees:['reader']},
      {id:'outside',title:'Sem confirmação',date:'2099-06-30',attendees:['other']}
    ];
    state.eventFilter='mine';renderEvents()
  `, context);
  assert.match(markup, /Encontro cancelado[\s\S]*Evento cancelado[\s\S]*Encontro da manhã[\s\S]*Parque[\s\S]*Encontro da tarde[\s\S]*Praça/);
  assert.doesNotMatch(markup, /Sem confirmação/);
  const empty = vm.runInContext('state.events=[];renderEvents()', context);
  assert.match(empty, /Você ainda não confirmou nenhum evento/);
  assert.match(empty, /Ver próximos eventos/);
});

test('community polls present private ballots, totals after voting, and no controls after closing', () => {
  const context = appContext();
  const open = vm.runInContext(`
    state.user={uid:'member'};
    state.selectedGroup='club';
    state.groups=[{id:'club',createdBy:'owner',members:['owner','member']}];
    state.pollDetail={groupId:'club',poll:{id:'poll',question:'Passeio <especial>?',options:{a:'Sábado',b:'Domingo',c:'',d:''},
      endsAt:{toMillis:()=>Date.now()+10000,toDate:()=>new Date()}},loading:false};
    renderPoll()
  `, context);
  assert.match(open, /Passeio &lt;especial&gt;/);
  assert.match(open, /Votar nesta opção/);
  assert.match(open, /Os resultados aparecem depois que você votar/);
  assert.doesNotMatch(vm.runInContext('renderGroupPolls()', context), /Criar enquete/);
  vm.runInContext("state.groupRoles.set('club','active')", context);
  assert.match(vm.runInContext('renderGroupPolls()', context), /Criar enquete/);
  const voted = vm.runInContext("state.pollDetail.choice='b';state.pollDetail.totals={a:1,b:3,c:0,d:0};renderPoll()", context);
  assert.match(voted, /3 votos · 75%/);
  assert.match(voted, /disabled>Seu voto/);
  assert.match(voted, /Mudar para esta opção/);
  const closed = vm.runInContext("state.pollDetail.poll.endsAt.toMillis=()=>0;renderPoll()", context);
  assert.match(closed, /Encerrada em/);
  assert.doesNotMatch(closed, /data-action="vote-poll"/);
  assert.match(vm.runInContext("state.groups[0].members=['owner'];renderPoll()", context), /Enquete indisponível/);
});

test('poll notifications show open polls to members and final counts to voters', async () => {
  const context = appContext();
  vm.runInContext(`
    state.user={uid:'member'};
    state.groups=[
      {id:'club',name:'Fotografia',members:['member']},
      {id:'elsewhere',name:'Privado',members:['other']}
    ];
    const timestamp=ms=>({toMillis:()=>ms});
    const poll=(id,question,deadline)=>({id,question,createdAt:timestamp(now()-5000),endsAt:timestamp(deadline)});
    state.pollWatches.set('club',{polls:[
      poll('new','Novo passeio',now()+5000),poll('voted','Resultado do museu',now()-1000),poll('ignored','Sem voto',now()-1000)
    ],ballots:new Map([['voted',true],['ignored',false]])});
    state.pollWatches.set('elsewhere',{polls:[poll('private','Apenas associados',now()+5000)],ballots:new Map()});
    openPoll=async(group,poll)=>{state.selectedGroup=group;state.pollDetail={groupId:group,poll};};
  `, context);
  const html = vm.runInContext('renderNotifications()', context);
  assert.match(html, /Nova enquete em Fotografia · Novo passeio/);
  assert.match(html, /Resultado da enquete em Fotografia · Resultado do museu/);
  assert.doesNotMatch(html, /Sem voto|Apenas associados/);
  const openResult = `onAction({dataset:{action:'open-notification',id:notificationItems().find(item=>item.type==='poll-result').readKey}})`;
  await vm.runInContext(openResult, context);
  assert.equal(vm.runInContext('state.pollDetail.poll.id', context), 'voted');
  assert.match(vm.runInContext('notificationButton()', context), /2 não lidas/);
});

test('a closed poll drafts a group event with the sole winning option for active moderators', async () => {
  const context = appContext();
  vm.runInContext(`
    state.user={uid:'moderator'};
    state.groups=[{id:'club',createdBy:'owner',name:'Clube',hobby:'Fotografia',members:['owner','moderator']}];
    state.modal='poll-detail';
    state.pollDetail={groupId:'club',poll:{id:'poll',question:'Qual passeio?',options:{a:'Passeio no parque',b:'Visita ao museu',c:'',d:''},
      endsAt:{toMillis:()=>0,toDate:()=>new Date(0)}},totals:{a:3,b:1,c:0,d:0}};
  `, context);
  assert.doesNotMatch(vm.runInContext('renderPoll()', context), /event-from-poll/);
  await vm.runInContext("onAction({dataset:{action:'event-from-poll'}})", context);
  assert.equal(vm.runInContext('state.modal', context), 'poll-detail');
  vm.runInContext("state.groupRoles.set('club','active')", context);
  assert.match(vm.runInContext('renderPoll()', context), /event-from-poll/);
  await vm.runInContext("onAction({dataset:{action:'event-from-poll'}})", context);
  assert.equal(vm.runInContext('state.eventGroupId', context), 'club');
  const draft = vm.runInContext('renderModal()', context);
  assert.match(draft, /Evento em Clube/);
  assert.match(draft, /name="title"[^>]+value="Passeio no parque"/);
  assert.match(draft, /name="time" type="time" required/);
  assert.doesNotMatch(draft, /Nova edição/);
  assert.equal(vm.runInContext('state.pollDetail.totals.b=3;pollEventTitle(state.pollDetail)', context), '');
  assert.equal(vm.runInContext('state.pollDetail.totals.a=0;state.pollDetail.totals.b=0;pollEventTitle(state.pollDetail)', context), '');
  assert.doesNotMatch(vm.runInContext('state.pollDetail.poll.endsAt.toMillis=()=>Date.now()+10000;renderPoll()', context), /event-from-poll/);
});

test('event questions display the pinned answer and organize response controls by role', () => {
  const context = appContext();
  vm.runInContext(`
    state.user={uid:'guest'};
    const event={id:'event',createdBy:'organizer'};
    state.eventDiscussion={eventId:'event',pinned:'pinned',questions:[
      {id:'pinned',authorId:'guest',question:'Onde encontrar o grupo?',answer:'Portão <principal>'},
      {id:'open',authorId:'guest',question:'Preciso levar algo?'}
    ]};
  `, context);
  const guest = vm.runInContext('renderEventQuestions(event)', context);
  assert.match(guest, /Resposta fixada[\s\S]*Portão &lt;principal&gt;/);
  assert.match(guest, /event-question-form/);
  assert.doesNotMatch(guest, /answer-event-question|unpin-event-question/);
  const organizer = vm.runInContext("state.user={uid:'organizer'};renderEventQuestions(event)", context);
  assert.match(organizer, /data-action="unpin-event-question"/);
  assert.match(organizer, /data-action="answer-event-question" data-id="open"/);
  assert.doesNotMatch(organizer, /data-action="pin-event-question" data-id="open"/);
  const cancelled = vm.runInContext('event.cancelled=true;renderEventQuestions(event)', context);
  assert.match(cancelled, /Resposta fixada/);
  assert.doesNotMatch(cancelled, /event-question-form|answer-event-question/);
});

test('an event answer notice identifies the event and opens the exact question', async () => {
  const context = appContext();
  vm.runInContext(`
    state.user={uid:'guest'};
    state.events=[{id:'event',title:'Passeio no parque'}];state.eventsLoaded=true;
    state.notifications=[{id:'reply',type:'event-answer',actorId:'organizer',eventId:'event',questionId:'older-question',createdAt:10}];
    openEventDetail=(id,questionId)=>{state.selectedEvent=id;state.eventAnswerId=questionId;};
  `, context);
  assert.match(vm.runInContext('renderNotifications()', context), /Sua pergunta foi respondida · Passeio no parque/);
  await vm.runInContext("onAction({dataset:{action:'open-notification',id:'reply:10'}})", context);
  assert.equal(vm.runInContext('state.selectedEvent', context), 'event');
  assert.equal(vm.runInContext('state.eventAnswerId', context), 'older-question');
  assert.match(vm.runInContext('notificationButton()', context), /1 não lidas/);
});

test('limited events offer the reserved seat only to the head of the waitlist', () => {
  const context = appContext();
  vm.runInContext(`
    state.user={uid:'first'};
    const event={id:'event',title:'Oficina',date:'2099-01-01',capacity:2,attendees:['organizer'],
      waitlist:['first','second'],offerAt:{toMillis:()=>now()-1000}};
    state.events=[event];
  `, context);
  assert.match(vm.runInContext('eventCard(event)', context), /Confirmar vaga/);
  assert.match(vm.runInContext('eventCard(event)', context), /Liberar vaga/);
  assert.match(vm.runInContext('renderNotifications()', context), /Uma vaga está reservada para você · Oficina/);
  const second = vm.runInContext("state.user={uid:'second'};eventCard(event)", context);
  assert.match(second, /Sair da lista de espera/);
  assert.match(second, /posição 2/);
  assert.doesNotMatch(second, /Liberar vaga/);
  assert.doesNotMatch(vm.runInContext('renderNotifications()', context), /Uma vaga/);
  assert.match(vm.runInContext("state.user={uid:'other'};eventCard(event)", context), /Entrar na lista de espera/);
});

test('the waiting-list agenda shows current entries and releasing a seat leaves its queue', async () => {
  const context = appContext();
  vm.runInContext(`
    state.user={uid:'reader'};
    state.eventFilter='waitlist';
    const event={id:'office',title:'Oficina em espera',date:'2099-01-01',capacity:2,attendees:['host'],
      waitlist:['reader','other'],offerAt:{toMillis:()=>now()-1000}};
    state.events=[event,{...event,id:'cancelled',cancelled:true,title:'Encontro cancelado'},
      {...event,id:'another',title:'Outra fila',waitlist:['other']}];
    changeEventSeat=async(id,intent,uid)=>{state.release={id,intent,uid};event.waitlist.shift();return 'left-queue';};
    showToast=()=>{};
  `, context);
  const agenda = vm.runInContext('renderEvents()', context);
  assert.match(agenda, /Oficina em espera[\s\S]*Sua vaga está reservada até[\s\S]*Liberar vaga/);
  assert.doesNotMatch(agenda, /Encontro cancelado|Outra fila/);
  await vm.runInContext("onAction({dataset:{action:'release-event-seat',id:'office'}})", context);
  assert.equal(vm.runInContext('state.release.intent', context), 'leave-queue');
  assert.match(vm.runInContext('renderEvents()', context), /Você não está em nenhuma lista de espera/);
});

test('organizer panel separates confirmed, reserved, free and waiting seats', () => {
  const context = appContext();
  const markup = vm.runInContext(`
    state.user={uid:'host'};
    state.members=[{uid:'host',name:'Zélia'},{uid:'confirmed',name:'Ana <Teste>'},{uid:'queued',name:'Pessoa na fila'}];
    const event={id:'office',title:'Oficina',date:'2099-01-01',capacity:4,createdBy:'host',attendees:['host','confirmed'],
      waitlist:['reserved','queued'],offerAt:{toMillis:()=>now()-1000}};
    state.events=[event];state.selectedEvent=event.id;state.modal='event-detail';
    renderModal()
  `, context);
  assert.match(markup, /Vagas ocupadas<\/dt><dd><strong>2 de 4/);
  assert.match(markup, /Vagas livres<\/dt><dd><strong>1/);
  assert.match(markup, /Reservas pendentes<\/dt><dd><strong>1/);
  assert.match(markup, /Pessoas aguardando na fila<\/dt><dd><strong>1/);
  assert.match(markup, /Ana &lt;Teste&gt;[\s\S]*Zélia \(organizador\)/);
  assert.doesNotMatch(markup, /Pessoa na fila/);
  assert.doesNotMatch(vm.runInContext("state.user={uid:'confirmed'};renderModal()", context), /Painel do organizador/);
  assert.doesNotMatch(vm.runInContext("state.user={uid:'host'};event.cancelled=true;renderModal()", context), /Vagas livres|Reservas pendentes/);
});

test('organizer bulletins appear in the event and bell only for the intended roles', async () => {
  const context = appContext();
  vm.runInContext(`
    state.user={uid:'confirmed'};
    const event={id:'event',title:'Oficina de fotografia',createdBy:'host',attendees:['confirmed']};
    state.events=[event];
    state.eventBulletins.set('event',{entries:[{id:'update',text:'Portão <lateral>',createdAt:{toMillis:()=>10}}]});
    openEventDetail=id=>{state.selectedEvent=id;};
  `, context);
  assert.match(vm.runInContext('renderEventBulletins(event)', context), /Portão &lt;lateral&gt;/);
  assert.doesNotMatch(vm.runInContext('renderEventBulletins(event)', context), /event-bulletin-form/);
  assert.match(vm.runInContext('renderNotifications()', context), /Recado do organizador · Oficina de fotografia/);
  await vm.runInContext("onAction({dataset:{action:'open-notification',id:'event-bulletin:event:update:10'}})", context);
  assert.equal(vm.runInContext('state.selectedEvent', context), 'event');
  assert.equal(vm.runInContext("state.user={uid:'outsider'};renderEventBulletins(event)", context), '');
  assert.doesNotMatch(vm.runInContext('renderNotifications()', context), /Recado do organizador/);
  assert.match(vm.runInContext("state.user={uid:'host'};renderEventBulletins(event)", context), /event-bulletin-form/);
  assert.doesNotMatch(vm.runInContext('renderNotifications()', context), /Recado do organizador/);
});

test('organizer check-in distinguishes arrivals and limits edits to the active event day', () => {
  const context = appContext();
  vm.runInContext(`
    state.user={uid:'host'};
    state.members=[{uid:'host',name:'Organizadora'},{uid:'guest',name:'Lia'}];
    const event={id:'office',date:eventCheckinDay(),createdBy:'host',attendees:['host','guest']};
    state.eventCheckins={eventId:'office',present:new Set(['guest'])};
  `, context);
  const panel = vm.runInContext('renderEventOrganizerPanel(event)', context);
  assert.match(panel, /1 pessoa presente/);
  assert.match(panel, /Lia <strong>· Presente/);
  assert.match(panel, /undo-event-checkin" data-id="guest"/);
  assert.match(panel, /record-event-checkin" data-id="host"/);
  assert.doesNotMatch(vm.runInContext("event.date='2001-01-01';renderEventOrganizerPanel(event)", context), /record-event-checkin|undo-event-checkin/);
  assert.equal(vm.runInContext("state.user={uid:'guest'};renderEventOrganizerPanel(event)", context), '');
});

test('personal history includes ended confirmations and private check-ins without a current RSVP', () => {
  const context = appContext();
  const markup=vm.runInContext(`
    state.user={uid:'reader'};state.eventFilter='history';
    const checked={id:'y',title:'Chegada registrada',date:'2000-01-02',attendees:['host']};
    state.events=[checked,{id:'x',title:'Confirmação anterior',date:'2000-01-01',attendees:['reader']},
      {id:'z',title:'Visita sem confirmação',date:'2000-01-03',attendees:['host']},
      {id:'later',title:'Encontro futuro',date:'2099-01-01',attendees:['reader']}];
    state.personalHistory.records.set(historyKey(checked),true);
    renderEvents()
  `,context);
  assert.match(markup,/Chegada registrada[\s\S]*Presença registrada[\s\S]*Avaliar encontro[\s\S]*Confirmação anterior/);
  assert.doesNotMatch(markup,/Visita sem confirmação|Encontro futuro/);
  const feedback=vm.runInContext("state.eventFeedback={id:'y',entries:[]};renderEventFeedback(checked)",context);
  assert.match(feedback,/event-feedback-form/);
  assert.doesNotMatch(feedback,/Resumo privado/);
});

test('an organizer can draft a public recap using only the completed group event title', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'host'};state.profile={name:'Host'};
    state.groups=[{id:'club',name:'Clube',members:['host','guest']}];
    const event={id:'ended',groupId:'club',date:'2000-01-01',createdBy:'host',title:'Oficina <especial>'};
    state.events=[event];state.selectedEvent='ended';state.modal='event-detail';
    state.eventFeedback={id:'ended',entries:[{id:'guest',comment:'Comentário privado'}]};
  `,context);
  assert.match(vm.runInContext('renderEventOrganizerPanel(event)',context),/Publicar relato do encontro/);
  await vm.runInContext("onAction({dataset:{action:'compose-event-recap',id:'ended'}})",context);
  const draft=vm.runInContext('renderModal()',context);
  assert.match(draft,/Relato do encontro/);
  assert.match(draft,/Oficina &lt;especial&gt;/);
  assert.doesNotMatch(draft,/Comentário privado/);
  assert.equal(vm.runInContext('state.composingGroup',context),'club');
  assert.equal(vm.runInContext("state.user={uid:'guest'};canComposeEventRecap(event)",context),false);
  assert.equal(vm.runInContext("state.user={uid:'host'};canComposeEventRecap({...event,date:'2099-01-01'})",context),false);
});

test('recap links connect the matching event and publication in both directions', () => {
  const context=appContext();
  vm.runInContext(`
    const event={id:'event',groupId:'group'};
    const post={id:'recap',groupId:'group',eventRecapId:'event'};
    state.events=[event];state.posts=[post];
  `,context);
  assert.match(vm.runInContext('postCard(post)',context),/data-action="view-event" data-id="event">Ver encontro/);
  assert.match(vm.runInContext('eventRecapButton(event)',context),/data-action="comments" data-id="recap">Ler relato/);
  assert.equal(vm.runInContext("recapEventButton({...post,groupId:'other'})",context),'');
  assert.equal(vm.runInContext('state.posts=[];eventRecapButton(event)',context),'');
});

test('saved events are filtered separately from attendance and queues', () => {
  const context=appContext();
  const saved=vm.runInContext(`
    state.user={uid:'reader'};state.eventFilter='saved';
    state.events=[{id:'saved',title:'Oficina guardada',date:'2099-01-01',location:'Biblioteca',time:'14:30',capacity:4,attendees:['host'],waitlist:[]},
      {id:'confirmed',title:'Feira confirmada',date:'2099-01-01',attendees:['reader']}];
    state.savedEventDates.set('saved',null);
    renderEvents()
  `,context);
  assert.match(saved,/Oficina guardada/);
  assert.match(saved,/Biblioteca/);
  assert.match(saved,/14:30/);
  assert.match(saved,/Remover dos salvos/);
  assert.match(saved,/Confirmar presença/);
  assert.doesNotMatch(saved,/Feira confirmada/);
  assert.match(vm.runInContext("state.savedEventDates.clear();renderEvents()",context),/Você ainda não salvou nenhum evento/);
});

test('bookmark notices report only schedule changes made after saving and open the event', async () => {
  const context=appContext();
  const html=vm.runInContext(`
    state.user={uid:'reader'};
    const ts=value=>({toMillis:()=>value});
    const event={id:'saved',title:'Oficina',createdBy:'host',date:'2099-01-02',time:'15:00',location:'Biblioteca',
      revision:1,scheduleChangedAt:ts(20),previousSchedule:{revision:1,date:'2099-01-01',time:'14:00',location:'Praça'}};
    state.events=[event,{...event,id:'old',title:'Já alterado',scheduleChangedAt:ts(5)},
      {...event,id:'unsaved',title:'Não salvo'}];
    state.savedEventDates=new Map([['saved',ts(10)],['old',ts(10)]]);
    openEventDetail=id=>{state.selectedEvent=id;};
    renderNotifications()
  `,context);
  assert.match(html,/Seu evento salvo mudou · Oficina/);
  assert.match(html,/Data alterada de 01\/01\/2099 para 02\/01\/2099/);
  assert.match(html,/Horário alterado de 14:00 para 15:00/);
  assert.match(html,/Local alterado de Praça para Biblioteca/);
  assert.doesNotMatch(html,/Já alterado|Não salvo/);
  await vm.runInContext("onAction({dataset:{action:'open-notification',id:'saved-event-change:saved:1:20'}})", context);
  assert.equal(vm.runInContext('state.selectedEvent',context),'saved');
  assert.match(vm.runInContext("event.cancelled=true;event.revision=2;event.scheduleChangedAt=ts(30);renderNotifications()",context),/Evento salvo cancelado · Oficina/);
});

test('weekly agenda groups confirmations and flags equal start times across filters', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.eventFilter='mine';state.eventAgendaView='week';
    const date=new Date(2099,0,7,12);
    const week=eventWeek(date,0);
    const first={id:'a',title:'Oficina confirmada',date:localDateKey(week[0]),time:'09:00',location:'Biblioteca',hobby:'Arte',attendees:['reader']};
    state.events=[first,{...first,id:'b',title:'Passeio confirmado',hobby:'Fotografia'},
      {...first,id:'c',title:'Encontro cancelado',cancelled:true,time:'10:00'},
      {...first,id:'d',title:'Na outra semana',date:localDateKey(eventWeek(date,1)[0])},
      {...first,id:'e',title:'Sem confirmação',attendees:['other']}];
    state.eventHobby='Arte';
  `,context);
  const current=vm.runInContext('renderEvents(date)',context);
  assert.match(current,/segunda-feira[\s\S]*Conflito:[\s\S]*Oficina confirmada/);
  assert.match(current,/09:00[\s\S]*Biblioteca/);
  assert.equal((current.match(/Conflito:/g)||[]).length,1);
  assert.doesNotMatch(current,/Passeio confirmado|Na outra semana|Sem confirmação/);
  await vm.runInContext("onAction({dataset:{action:'event-week',value:'next'}})",context);
  assert.match(vm.runInContext('renderEvents(date)',context),/Na outra semana/);
  await vm.runInContext("onAction({dataset:{action:'event-week',value:'current'}})",context);
  assert.equal(vm.runInContext('state.eventWeekOffset',context),0);
});

test('notification settings hide optional categories and retain seat offers and confirmed cancellations', () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};
    const ts=value=>({toMillis:()=>value});
    const event={id:'e',title:'Oficina cancelada',createdBy:'host',date:'2099-01-01',attendees:['reader'],
      cancelled:true,revision:1,scheduleChangedAt:ts(50)};
    state.events=[event,{id:'seat',title:'Passeio com vaga',date:'2099-01-01',waitlist:['reader'],offerAt:ts(now()-1000)}];
    state.savedEventDates.set('e',ts(10));
    state.notifications=[{id:'follow',type:'follow',actorId:'host',createdAt:30}];
  `,context);
  assert.match(vm.runInContext('renderNotifications()',context),/começou a seguir você/);
  const muted=vm.runInContext("state.notificationSettings={polls:false,bulletins:false,savedEvents:false,interactions:false};renderNotifications()",context);
  assert.doesNotMatch(muted,/começou a seguir você|Evento salvo cancelado/);
  assert.match(muted,/Evento confirmado cancelado · Oficina cancelada/);
  assert.match(muted,/Uma vaga está reservada para você · Passeio com vaga/);
  assert.match(vm.runInContext('renderNotificationSettings()',context),/role="switch" aria-checked="false" aria-label="Enquetes"/);
});

test('muting one community only hides its optional group notices', () => {
  const context=appContext();
  const html=vm.runInContext(`
    state.user={uid:'member'};state.mutedCommunitiesLoaded=true;state.mutedCommunityIds.add('quiet');
    const ts=value=>({toMillis:()=>value});
    state.groups=[{id:'quiet',name:'Grupo silenciado',members:['member']},{id:'active',name:'Grupo ativo',members:['member']}];
    const poll={id:'poll',question:'Escolher passeio',createdAt:ts(10),endsAt:ts(now()+10000)};
    state.pollWatches.set('quiet',{polls:[poll],ballots:new Map()});
    state.pollWatches.set('active',{polls:[poll],ballots:new Map()});
    state.events=[
      {id:'urgent',title:'Encontro cancelado',groupId:'quiet',createdBy:'host',attendees:['member'],cancelled:true,revision:1,scheduleChangedAt:ts(20)},
      {id:'memo',title:'Oficina silenciada',groupId:'quiet',createdBy:'host',attendees:['member']},
      {id:'seat',title:'Passeio reservado',groupId:'quiet',date:'2099-01-01',waitlist:['member'],offerAt:ts(now()-1000)}
    ];
    state.eventBulletins.set('memo',{entries:[{id:'memo',createdAt:ts(15)}]});
    renderNotifications()
  `,context);
  assert.match(html,/Nova enquete em Grupo ativo/);
  assert.match(html,/Evento confirmado cancelado · Encontro cancelado/);
  assert.match(html,/Uma vaga está reservada para você/);
  assert.doesNotMatch(html,/Nova enquete em Grupo silenciado|Oficina silenciada/);
  assert.match(vm.runInContext("renderCommunityMute('quiet')",context),/Reativar avisos/);
  assert.match(vm.runInContext("state.mutedCommunityIds.delete('quiet');renderNotifications()",context),/Nova enquete em Grupo silenciado/);
});

test('notification settings list muted communities and can restore an entry directly', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.modal='notification-settings';
    state.mutedCommunitiesLoaded=true;
    state.groups=[{id:'z',name:'Zoologia'},{id:'a',name:'Arte <teste>'},{id:'other',name:'Grupo ativo'}];
    state.mutedCommunityIds=new Set(['z','a','missing']);
    showToast=()=>{};
    firebase={doc:(_db,...segments)=>segments.slice(-4).join('/'),runTransaction:async(_db,callback)=>callback({
      get:async()=>({exists:()=>true}),
      delete:path=>{state.removedPreference=path;state.mutedCommunityIds.delete('missing');}
    })};
  `,context);
  const html=vm.runInContext('renderNotificationSettings()',context);
  assert.match(html,/Comunidades silenciadas[\s\S]*Arte &lt;teste&gt;[\s\S]*Zoologia/);
  assert.doesNotMatch(html,/Grupo ativo/);
  assert.match(html,/Comunidade indisponível/);
  await vm.runInContext("onAction({dataset:{action:'restore-community-notices',id:'missing'}})",context);
  assert.equal(vm.runInContext('state.removedPreference',context),'members/reader/mutedCommunities/missing');
  assert.doesNotMatch(vm.runInContext('renderNotificationSettings()',context),/Comunidade indisponível/);
});

test('unread notifications can be marked individually without opening the content', async () => {
  const context=appContext();
  context.document.querySelector=()=>null;
  vm.runInContext(`
    state.user={uid:'reader'};state.notifications=[
      {id:'first',type:'follow',actorId:'a',createdAt:10},
      {id:'second',type:'follow',actorId:'b',createdAt:20}
    ];
    state.members=[{uid:'a',name:'Ana'},{uid:'b',name:'Bruno'}];
  `,context);
  await vm.runInContext("onAction({dataset:{action:'notification-filter',value:'unread'}})",context);
  await vm.runInContext("onAction({dataset:{action:'read-notification',id:'first:10'}})",context);
  const unread=vm.runInContext('renderNotifications()',context);
  assert.doesNotMatch(unread,/Ana começou/);
  assert.match(unread,/Bruno começou/);
  assert.match(vm.runInContext('notificationButton()',context),/2 não lidas/);
  await vm.runInContext("onAction({dataset:{action:'notification-filter',value:'all'}})",context);
  const all=vm.runInContext('renderNotifications()',context);
  assert.match(all,/Ana começou/);
  assert.equal((all.match(/data-action="read-notification"/g)||[]).length,2);
  await vm.runInContext("onAction({dataset:{action:'read-notifications'}});state.notificationFilter='unread';",context);
  assert.match(vm.runInContext('renderNotifications()',context),/Nenhuma notificação não lida/);
});

test('notification read sync merges older browser reads with the account and retries failures', async () => {
  const context=appContext();
  let persisted=JSON.stringify(['local:20']);
  context.localStorage.getItem=()=>persisted;
  context.localStorage.setItem=(_key,value)=>{persisted=value;};
  context.console={...console,error:()=>{}};
  vm.runInContext(`
    state.user={uid:'reader'};
    state.notificationReadSync={uid:'reader',pending:new Set(readPendingNotifications('reader')),flushing:false};
    let online=false;
    firebase={doc:()=>({}),runTransaction:async(_db,callback)=>{
      if(!online)throw Error('offline');
      return callback({get:async()=>({data:()=>({keys:['remote:30']})}),set:(_ref,value)=>{state.synced=value;}});
    }};
  `,context);
  await vm.runInContext('syncNotificationReads()',context);
  assert.deepEqual(JSON.parse(persisted),['local:20']);
  await vm.runInContext('online=true;syncNotificationReads()',context);
  assert.deepEqual(JSON.parse(persisted),[]);
  assert.deepEqual([...vm.runInContext('state.synced.keys',context)],['remote:30','local:20']);
  assert.deepEqual([...vm.runInContext('state.notificationReads',context)],['remote:30','local:20']);
});

test('product feedback sends the selected category to a separate administrative collection', async () => {
  const handlers={},context=appContext(handlers);
  vm.runInContext(`
    state.user={uid:'reader'};state.profile={name:'Leitora'};
    FormData=class { [Symbol.iterator](){return Object.entries({category:'suggestion',message:' Uma dica para o site. '})[Symbol.iterator]();} };
    firebase={collection:(_db,...path)=>path.join('/'),serverTimestamp:()=>123,
      addDoc:async(path,data)=>{state.sentFeedback={path,data};}};
    closeModal=()=>{state.modal=null;};showToast=message=>{state.sentToast=message;};
  `,context);
  assert.match(vm.runInContext('renderProfile()',context),/data-action="send-feedback"/);
  await vm.runInContext("onAction({dataset:{action:'send-feedback'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Relatar um problema[\s\S]*Sugerir uma melhoria/);
  await handlers.submit({target:{id:'product-feedback-form'},preventDefault(){}});
  assert.match(vm.runInContext('state.sentFeedback.path',context),/^artifacts\/[^/]+\/productFeedback$/);
  assert.equal(vm.runInContext('state.sentFeedback.data.message',context),'Uma dica para o site.');
  assert.equal(vm.runInContext('state.sentFeedback.data.category',context),'suggestion');
  assert.match(vm.runInContext('state.sentToast',context),/Feedback enviado/);
});

test('the feedback panel is restricted, filters categories and changes triage status', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reviewer'};state.profile={name:'Revisora'};state.modal='product-feedback-admin';
    state.productFeedbackQueue={entries:[
      {id:'broken',category:'problem',message:'Tela <travada>',status:'new'},
      {id:'idea',category:'suggestion',message:'Proposta de melhoria',status:'new'}
    ],category:'',more:false};
    showToast=()=>{};
    firebase={doc:(_db,...path)=>path.join('/'),serverTimestamp:()=>123,
      updateDoc:async(path,data)=>{state.triage={path,data};}};
  `,context);
  assert.doesNotMatch(vm.runInContext('renderProfile()',context),/data-action="product-feedback-admin"/);
  assert.doesNotMatch(vm.runInContext('renderProductFeedbackAdmin()',context),/Proposta de melhoria/);
  vm.runInContext('state.feedbackAdmin=true',context);
  await vm.runInContext("onAction({dataset:{action:'product-feedback-category',value:'problem'}})",context);
  const panel=vm.runInContext('renderProductFeedbackAdmin()',context);
  assert.match(panel,/Tela &lt;travada&gt;/);
  assert.doesNotMatch(panel,/Proposta de melhoria/);
  await vm.runInContext("updateProductFeedbackStatus('broken','in-review')",context);
  assert.match(vm.runInContext('state.triage.path',context),/\/productFeedback\/broken$/);
  assert.equal(vm.runInContext('state.triage.data.reviewedBy',context),'reviewer');
  assert.match(vm.runInContext('renderProductFeedbackAdmin()',context),/value="in-review" selected/);
});

test('the attention queue queries pending feedback and resumes only open follow-ups', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reviewer'};state.modal='product-feedback-admin';state.feedbackAdmin=true;
    showToast=()=>{};
    resetProductFeedbackQueue();
    const pending={id:'pending',status:'resolved',resolutionChoice:'needs-help',message:'Mensagem original',resolution:'Resposta anterior'};
    const stale={...pending,id:'stale',message:'Já retomado em outra sessão'};
    firebase={
      collection:()=>null,where:(...args)=>args,limit:value=>value,
      query:(_collection,...filters)=>filters,
      getDocs:async filters=>{
        state.attentionFilters=filters;
        return {docs:[pending,stale].map(item=>({id:item.id,data:()=>item}))};
      },
      doc:(_db,...path)=>path.at(-1),serverTimestamp:()=>123,
      runTransaction:async(_db,callback)=>callback({
        get:async id=>({data:()=>id==='pending'?pending:{...stale,status:'in-review'}}),
        update:(_target,data)=>{(state.attentionWrites??=[]).push(data);}
      })
    };
  `,context);
  await vm.runInContext("onAction({dataset:{action:'product-feedback-category',value:'attention'}})",context);
  assert.equal(vm.runInContext('JSON.stringify(state.attentionFilters)',context),'[["status","==","resolved"],["resolutionChoice","==","needs-help"],40]');
  assert.match(vm.runInContext('renderModal()',context),/Mensagem original[\s\S]*Resposta anterior[\s\S]*Retomar análise/);
  await vm.runInContext("onAction({dataset:{action:'resume-feedback-review',id:'pending'}})",context);
  assert.equal(vm.runInContext('JSON.stringify(state.attentionWrites)',context),'[{"status":"in-review","reviewedAt":123,"reviewedBy":"reviewer"}]');
  assert.doesNotMatch(vm.runInContext('renderModal()',context),/Mensagem original/);
  await vm.runInContext("onAction({dataset:{action:'resume-feedback-review',id:'stale'}})",context);
  assert.equal(vm.runInContext('state.attentionWrites.length',context),1);
  assert.match(vm.runInContext('renderModal()',context),/Nenhum feedback precisa de atenção/);
});

test('the supplement queue keeps newer details unread and removes a case after review', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reviewer'};state.feedbackAdmin=true;state.modal='feedback-admin-detail';
    const entry={id:'case',message:'Envio original',hasUnreadSupplements:true,lastSupplementId:'first'};
    state.productFeedbackQueue={category:'supplements',entries:[entry]};
    state.feedbackSupplements={id:'case',modal:state.modal,entries:[{id:'first',message:'Primeiro complemento'}]};
    state.latestSupplement='second';state.readWrites=0;
    showToast=()=>{};
    firebase={doc:()=>null,runTransaction:async(_db,fn)=>fn({
      get:async()=>({data:()=>({hasUnreadSupplements:true,lastSupplementId:state.latestSupplement})}),
      update:()=>state.readWrites++
    })};
  `,context);
  assert.match(vm.runInContext('renderModal()',context),/Marcar complementos como lidos/);
  await vm.runInContext("onAction({dataset:{action:'read-feedback-supplements'}})",context);
  assert.equal(vm.runInContext('state.readWrites',context),0);
  assert.doesNotMatch(vm.runInContext('renderModal()',context),/Marcar complementos como lidos/);
  vm.runInContext("state.feedbackSupplements.entries=[{id:'second',message:'Outro complemento'}]",context);
  await vm.runInContext("onAction({dataset:{action:'read-feedback-supplements'}})",context);
  assert.equal(vm.runInContext('state.readWrites',context),1);
  await vm.runInContext("onAction({dataset:{action:'back-feedback-admin'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Nenhum complemento novo/);
});

test('the bell shows only the latest product update and marks it read when opened', async () => {
  const context=appContext();
  vm.runInContext("state.user={uid:'reader'};state.notificationFilter='unread'",context);
  const first=vm.runInContext("notificationItems().find(item=>item.type==='product-news').readKey",context);
  assert.match(vm.runInContext('renderNotifications()',context),/Respostas da equipe aos feedbacks[\s\S]*Ver novidades/);
  await vm.runInContext(`onAction({dataset:{action:'open-notification',id:${JSON.stringify(first)}}})`,context);
  assert.equal(vm.runInContext('state.modal',context),'product-news');
  assert.equal(vm.runInContext(`state.notificationReads.has(${JSON.stringify(first)})`,context),true);
  assert.doesNotMatch(vm.runInContext('renderNotifications()',context),/Ver novidades/);
  vm.runInContext("productNews.unshift({...productNews[0],id:'mobile-update',title:'Melhorias no celular'})",context);
  const unread=vm.runInContext('renderNotifications()',context);
  assert.match(unread,/Melhorias no celular/);
  assert.doesNotMatch(unread,/Respostas da equipe aos feedbacks/);
});

test('product news shows dated public updates and links to the private feedback list', async () => {
  const context=appContext();
  vm.runInContext("state.user={uid:'reader'};state.profile={name:'Leitora'};state.myProductFeedback=[{id:'private',message:'Mensagem privada'}]",context);
  assert.match(vm.runInContext('renderProfile()',context),/Ajuda e feedback[\s\S]*data-action="product-news">Novidades/);
  await vm.runInContext("onAction({dataset:{action:'product-news'}})",context);
  const news=vm.runInContext('renderModal()',context);
  assert.match(news,/<time[^>]*datetime="2026-11-23">23 de novembro de 2026/);
  assert.match(news,/Respostas da equipe aos feedbacks/);
  assert.match(news,/data-action="my-product-feedback">Abrir meus feedbacks/);
  assert.doesNotMatch(news,/Mensagem privada/);
  await vm.runInContext("onAction({dataset:{action:'my-product-feedback'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Mensagem privada/);
});

test('my feedback shows each state and the resolution notice opens the exact submission', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.profile={name:'Leitora'};
    state.myProductFeedback=[
      {id:'first',category:'problem',message:'Tela com erro',status:'new'},
      {id:'second',category:'suggestion',message:'Ideia em análise',status:'in-review'},
      {id:'last',category:'problem',message:'A busca agora funciona <bem>',resolution:'Ajustamos a busca <agora>.',status:'resolved',reviewedAt:{toMillis:()=>20}}
    ];
  `,context);
  assert.match(vm.runInContext('renderProfile()',context),/Meus feedbacks/);
  await vm.runInContext("onAction({dataset:{action:'my-product-feedback'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Novo[\s\S]*Em análise[\s\S]*Resolvido/);
  assert.match(vm.runInContext('renderNotifications()',context),/Seu feedback foi resolvido/);
  assert.match(vm.runInContext('renderNotifications()',context),/Ver resposta/);
  await vm.runInContext("onAction({dataset:{action:'open-notification',id:'feedback-resolved:last:20'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/A busca agora funciona &lt;bem&gt;/);
  assert.match(vm.runInContext('renderModal()',context),/Resposta da equipe[\s\S]*Ajustamos a busca &lt;agora&gt;/);
  assert.match(vm.runInContext('renderModal()',context),/Isso resolveu\?[\s\S]*Ainda preciso de ajuda/);
  vm.runInContext("state.myProductFeedback[2].resolutionChoice='needs-help';state.myProductFeedback[2].status='in-review'",context);
  assert.match(vm.runInContext('renderModal()',context),/Resposta do autor: Ainda preciso de ajuda/);
  assert.match(vm.runInContext('renderModal()',context),/Ajustamos a busca/);
  assert.doesNotMatch(vm.runInContext('renderModal()',context),/Isso resolveu/);
  assert.doesNotMatch(vm.runInContext('renderModal()',context),/Tela com erro/);
});

test('a resumed feedback notice opens the correct case and is marked read', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.notificationFilter='unread';
    state.myProductFeedback=[
      {id:'first',message:'Primeira análise',status:'in-review',reviewedAt:{toMillis:()=>10}},
      {id:'reopened',message:'Envio retomado',status:'in-review',resolutionChoice:'needs-help',reviewedAt:{toMillis:()=>20}},
      {id:'waiting',message:'Aguardando retorno',status:'resolved',resolutionChoice:'needs-help',reviewedAt:{toMillis:()=>30}}
    ];
  `,context);
  assert.equal(vm.runInContext("notificationItems().filter(item=>item.type==='feedback-resumed').map(item=>item.readKey).join(',')",context),'feedback-resumed:reopened:20');
  assert.match(vm.runInContext('renderNotifications()',context),/A equipe retomou a análise do seu feedback/);
  await vm.runInContext("onAction({dataset:{action:'open-notification',id:'feedback-resumed:reopened:20'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Em análise[\s\S]*Envio retomado/);
  assert.match(vm.runInContext('renderModal()',context),/Complementar feedback/);
  vm.runInContext("state.feedbackSupplements.entries=[{message:'Celular <teste>',createdAt:{toMillis:()=>20}}]",context);
  assert.match(vm.runInContext('renderModal()',context),/Celular &lt;teste&gt;/);
  vm.runInContext("state.myProductFeedback[1].status='resolved'",context);
  assert.doesNotMatch(vm.runInContext('renderModal()',context),/Complementar feedback/);
  assert.match(vm.runInContext('renderModal()',context),/Celular &lt;teste&gt;/);
  assert.equal(vm.runInContext("state.notificationReads.has('feedback-resumed:reopened:20')",context),true);
  assert.doesNotMatch(vm.runInContext('renderNotifications()',context),/A equipe retomou a análise/);
});

test('event RSVP warns about a confirmed conflict and writes only after explicit confirmation', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'guest'};state.modal='event-detail';state.selectedEvent='new';
    const schedule={date:'2099-01-01',time:'10:30'};
    state.events=[
      {...schedule,id:'new',title:'Evento novo',attendees:[]},
      {...schedule,id:'old',title:'Encontro <confirmado>',time:'09:30',endTime:'11:00',attendees:['guest']},
      {...schedule,id:'cancelled',title:'Cancelado',attendees:['guest'],cancelled:true},
      {...schedule,id:'later',title:'Horário diferente',time:'11:30',attendees:['guest']},
      {...schedule,id:'full',title:'Sem vaga',capacity:1,waitlist:[],attendees:['other']}
    ];
    state.writes=[];
    showToast=()=>{};watchEventBulletins=()=>{};
    firebase={doc:(_db,...path)=>path.at(-1),arrayUnion:uid=>uid,updateDoc:async(path,data)=>state.writes.push({path,data})};
    changeEventSeat=async(id,intent)=>{state.queued={id,intent};return 'queued';};
  `,context);
  const action=(name,id)=>vm.runInContext(`onAction({dataset:{action:${JSON.stringify(name)},id:${JSON.stringify(id)}}})`,context);
  await action('rsvp','new');
  assert.equal(vm.runInContext('state.writes.length',context),0);
  const modal=vm.runInContext('renderModal()',context);
  assert.match(modal,/Conflito de horário[\s\S]*data-id="old">Encontro &lt;confirmado&gt;/);
  assert.doesNotMatch(modal,/Cancelado|Horário diferente/);
  await action('cancel-event-conflict','');
  assert.equal(vm.runInContext('state.modal',context),'event-detail');
  await action('rsvp','new');
  await action('confirm-event-conflict','new');
  assert.equal(vm.runInContext('JSON.stringify(state.writes)',context),'[{"path":"new","data":{"attendees":"guest"}}]');
  await action('rsvp','full');
  assert.equal(vm.runInContext('state.queued.intent',context),'join');
  assert.equal(vm.runInContext('state.modal',context),'event-detail');
});

test('event end times are optional and mark overlaps without including the end boundary', () => {
  const context=appContext();
  const matches=vm.runInContext(`
    state.user={uid:'guest'};
    const start={date:'2099-01-01',attendees:['guest']};
    state.events=[
      {...start,id:'during',time:'15:00'},
      {...start,id:'touching',time:'16:00'},
      {...start,id:'earlier',time:'13:00',endTime:'14:30'},
      {...start,id:'unknown-end',time:'13:30'}
    ];
    conflictingEvents({...start,id:'new',time:'14:00',endTime:'16:00'}).map(item=>item.id).join(',')
  `,context);
  assert.equal(matches,'during,earlier');
  assert.throws(()=>vm.runInContext("validateEventEndTime('14:00','13:00')",context),/depois do início/);
  assert.doesNotThrow(()=>vm.runInContext("validateEventEndTime('14:00','')",context));
});

test('the bell reminds confirmed attendees once per event and opens its details', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'guest'};
    const event={id:'tomorrow',date:tomorrow(),title:'Caminhada confirmada',time:'14:30',attendees:['guest']};
    state.events=[event,{...event,id:'cancelled',cancelled:true},{...event,id:'waiting',attendees:[],waitlist:['guest']},{...event,id:'today',date:today()}];
    state.notificationFilter='unread';
  `,context);
  assert.equal(vm.runInContext("notificationItems().filter(item=>item.type==='event-reminder').map(item=>item.readKey).join(',')",context),'event-reminder:tomorrow');
  assert.match(vm.runInContext('renderNotifications()',context),/Amanhã: Caminhada confirmada · às 14:30/);
  await vm.runInContext("onAction({dataset:{action:'open-notification',id:'event-reminder:tomorrow'}})",context);
  assert.equal(vm.runInContext('state.selectedEvent',context),'tomorrow');
  assert.equal(vm.runInContext("state.notificationReads.has('event-reminder:tomorrow')",context),true);
  assert.doesNotMatch(vm.runInContext("state.events[0].time='15:00';renderNotifications()",context),/Caminhada confirmada/);
  assert.equal(vm.runInContext("state.events[0].attendees=[];notificationItems().some(item=>item.type==='event-reminder')",context),false);
});

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
  assert.match(organizer, /1 declarou que compareceu/);
  assert.match(organizer, /&lt;b&gt;Repetir&lt;\/b&gt;/);
  const guest = vm.runInContext(`state.user={uid:'guest'};renderEventFeedback(ended)`, context);
  assert.match(guest, /Você compareceu/);
  assert.doesNotMatch(guest, /Resumo privado/);
  assert.equal(vm.runInContext(`state.user={uid:'stranger'};renderEventFeedback(ended)`, context), '');
  assert.equal(vm.runInContext(`state.user={uid:'guest'};renderEventFeedback({...ended,date:'2099-01-01'})`, context), '');
  assert.equal(vm.runInContext(`renderEventFeedback({...ended,cancelled:true})`, context), '');
});

test('the completed event puts recorded arrivals and private feedback in the same organizer panel', () => {
  const context = appContext();
  const organizer = vm.runInContext(`
    state.user={uid:'owner'};
    state.selectedEvent='ended';state.modal='event-detail';
    state.events=[{id:'ended',title:'Oficina',createdBy:'owner',date:'2000-01-01',attendees:['owner','guest']}];
    state.eventCheckins={eventId:'ended',present:new Set(['guest'])};
    state.eventFeedback={id:'ended',entries:[{id:'guest',attended:false,comment:'Levar mais material'}]};
    renderModal()
  `, context);
  assert.match(organizer, /Resumo pós-evento[\s\S]*Confirmações registradas<\/dt><dd><strong>2[\s\S]*Check-ins registrados<\/dt><dd><strong>1/);
  assert.match(organizer, /Resumo privado[\s\S]*1 declarou que não compareceu[\s\S]*Levar mais material/);
  assert.equal((organizer.match(/Resumo privado/g)||[]).length, 1);
  const guest = vm.runInContext("state.user={uid:'guest'};renderModal()", context);
  assert.match(guest, /Você compareceu/);
  assert.doesNotMatch(guest, /Resumo pós-evento|Check-ins registrados|Resumo privado/);
});

test('event invitations wait for login and display participation before the calendar action', () => {
  const context = appContext();
  context.window.location = {hash:'#event=e',pathname:'/HobbyHub/',origin:'https://example.test'};
  vm.runInContext(`state.eventsLoaded=true;openLinkedContent()`, context);
  assert.equal(vm.runInContext('state.modal', context), null);
  const guest = vm.runInContext(`
    state.user={uid:'guest'};state.groups=[{id:'g',name:'Fotografia',members:[]}];
    state.events=[{id:'e',groupId:'g',title:'Caminhada',date:'2099-01-01',time:'10:30',attendees:[]}];
    openLinkedContent();renderModal()
  `, context);
  assert.match(guest, /Caminhada/);
  assert.match(guest, /Participar da comunidade/);
  assert.doesNotMatch(guest, /data-action="event-calendar"/);
  const joined = vm.runInContext(`state.groups[0].members.push('guest');state.events[0].attendees.push('guest');renderModal()`, context);
  assert.match(joined, /Adicionar ao calendário/);
  assert.equal((joined.match(/data-action="event-calendar"/g)||[]).length,1);
  assert.match(vm.runInContext('eventCard(state.events[0])',context),/Adicionar ao calendário/);
});

test('event cards and details link only to an in-person destination', () => {
  const context=appContext();
  const location='Praça São José, 12 & 14';
  context.event={id:'e',title:'Caminhada',date:'2099-01-01',location,attendees:[]};
  const card=vm.runInContext('eventCard(event)',context);
  assert.match(card,/target="_blank" rel="noopener noreferrer">Como chegar/);
  const href=card.match(/href="([^"]+)"/)[1].replaceAll('&amp;','&');
  const directions=new URL(href);
  assert.equal(directions.origin,'https://www.google.com');
  assert.equal(directions.pathname,'/maps/dir/');
  assert.equal(directions.searchParams.get('api'),'1');
  assert.equal(directions.searchParams.get('destination'),location);
  assert.match(vm.runInContext("state.events=[event];state.selectedEvent='e';state.modal='event-detail';renderModal()",context),/Como chegar/);
  for(const location of ['', 'Evento on-line', 'Local a combinar', 'Endereço a confirmar', 'Google Meet', 'https://meet.example.test/sala']){
    context.event={...context.event,location};
    assert.doesNotMatch(vm.runInContext('eventCard(event)',context),/Como chegar/);
  }
  assert.equal(vm.runInContext("eventDirectionsLink({location:'Praça da Sé',cancelled:true})",context),'');
});

test('calendar data includes the clean event link and escapes user text', () => {
  const context = appContext();
  context.window.location = {pathname:'/HobbyHub/',origin:'https://example.test',hostname:'example.test',search:'?utm_source=test'};
  const event = {id:'e',title:'Foto, vídeo; encontro',description:'Linha 1\n'+ 'ç'.repeat(80),location:'Praça',date:'2099-05-07',time:'10:30',endTime:'11:30',revision:2};
  context.event = event;
  const file = vm.runInContext(`calendarFile(event,new Date('2026-11-21T10:00:00Z'))`, context);
  assert.match(file, /DTSTART:20990507T103000/);
  assert.match(file, /DTEND:20990507T113000/);
  assert.doesNotMatch(vm.runInContext("calendarFile({...event,endTime:''})",context),/DTEND/);
  assert.match(file, /DTSTAMP:20261121T100000Z/);
  assert.match(file, /UID:e@example.test\r\n/);
  assert.match(file, /SEQUENCE:2\r\n/);
  assert.match(file, /SUMMARY:Foto\\, vídeo\\; encontro/);
  assert.match(file, /LOCATION:Praça/);
  assert.match(file, /URL:https:\/\/example.test\/HobbyHub\/#event=e/);
  assert.doesNotMatch(file, /utm_source/);
  assert.ok(file.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
});

test('sharing from an event card uses the native share menu or copies the same clean link', async () => {
  const context=appContext();
  context.window.location={pathname:'/HobbyHub/',origin:'https://example.test',search:'?utm_source=test'};
  const shared=[],copied=[];
  context.navigator.share=async data=>shared.push(data);
  context.navigator.clipboard={writeText:async url=>copied.push(url)};
  vm.runInContext(`
    showToast=()=>{};
    state.events=[
      {id:'walk',title:'Caminhada',date:'2099-01-02',time:'10:30'},
      {id:'cancelled',date:'2099-01-02',cancelled:true}
    ];
  `,context);
  const share=()=>vm.runInContext("onAction({dataset:{action:'share-event',id:'walk'}})",context);
  assert.match(vm.runInContext('eventCard(state.events[0])',context),/data-action="share-event"[^>]*>Compartilhar evento/);
  assert.doesNotMatch(vm.runInContext('eventCard(state.events[1])',context),/data-action="share-event"/);
  await share();
  const url='https://example.test/HobbyHub/#event=walk';
  assert.equal(shared[0].url,url);
  assert.equal(shared[0].text,'Caminhada · 02/01/2099 às 10:30');
  context.navigator.share=async()=>{throw Object.assign(new Error(),{name:'AbortError'});};
  await share();
  assert.equal(copied.length,0);
  context.navigator.share=async()=>{throw new Error('Unavailable');};
  await share();
  delete context.navigator.share;
  await share();
  assert.deepEqual(copied,[url,url]);
});

test('the calendar action downloads the confirmed event from its card', async () => {
  const context=appContext();
  context.window.location={pathname:'/HobbyHub/',origin:'https://example.test',hostname:'example.test'};
  vm.runInContext(`
    state.user={uid:'guest'};
    state.events=[
      {id:'e',title:'Caminhada',location:'Parque',date:'2099-01-01',time:'10:30',attendees:['guest']},
      {id:'other',date:'2099-01-01',time:'10:30',attendees:['other']},
      {id:'invalid',date:'2099-01-01',attendees:['guest']},
      {id:'cancelled',date:'2099-01-01',time:'10:30',cancelled:true,attendees:['guest']}
    ];
    state.downloads=[];downloadCalendar=(file,name)=>state.downloads.push({file,name});
  `,context);
  for(const id of ['other','invalid','cancelled','e']){
    await vm.runInContext(`onAction({dataset:{action:'event-calendar',id:${JSON.stringify(id)}}})`,context);
  }
  assert.equal(vm.runInContext('state.downloads.length',context),1);
  assert.equal(vm.runInContext('state.downloads[0].name',context),'evento-hobbyhub.ics');
  assert.match(vm.runInContext('state.downloads[0].file',context),/DTSTART:20990101T103000[\s\S]*SUMMARY:Caminhada[\s\S]*LOCATION:Parque[\s\S]*URL:https:\/\/example.test\/HobbyHub\/#event=e/);
});

test('weekly calendar exports confirmed, scheduled events in one file', () => {
  const context=appContext();
  context.window.location={pathname:'/HobbyHub/',origin:'https://example.test',hostname:'example.test'};
  const file=vm.runInContext(`
    state.user={uid:'reader'};
    const days=eventWeek(new Date(2099,0,7,12),0);
    const event={id:'first',title:'Oficina',location:'Biblioteca',date:localDateKey(days[0]),time:'14:00',attendees:['reader']};
    state.events=[event,{...event,id:'second',date:localDateKey(days[6]),time:'09:00'},
      {...event,id:'cancelled',cancelled:true},{...event,id:'saved',attendees:['other']},
      {...event,id:'bad',time:'25:00'},{...event,id:'later',date:'2099-03-01'}];
    calendarEventsFile(exportableWeekEvents(days),new Date('2026-11-23T10:00:00Z'))
  `,context);
  assert.equal((file.match(/BEGIN:VCALENDAR/g)||[]).length,1);
  assert.equal((file.match(/BEGIN:VEVENT/g)||[]).length,2);
  assert.match(file,/UID:first@example.test[\s\S]*UID:second@example.test/);
  assert.match(file,/LOCATION:Biblioteca/);
  assert.match(file,/URL:https:\/\/example.test\/HobbyHub\/#event=first/);
  assert.doesNotMatch(file,/UID:(cancelled|saved|bad|later)@/);
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
    state.events=[{id:'e',createdBy:'owner',title:'Caminhada',date:'2099-01-01',time:'10:30',attendees:['owner','guest'],revision:1}];
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

test('mobile navigation links directly to Events and marks it as the current page', () => {
  const context=appContext();
  const mobile=vm.runInContext("state.tab='events';renderBottomNav()",context);
  assert.match(mobile,/data-action="tab" data-tab="events" aria-current="page"[^>]*>[\s\S]*?<span>Eventos<\/span>/);
  assert.equal((mobile.match(/aria-current="page"/g)||[]).length,1);
  assert.equal((mobile.match(/<button/g)||[]).length,7);
  assert.deepEqual([...mobile.matchAll(/data-tab="([^"]+)"/g)].map(match=>match[1]),
    ['home','explore','events','groups','messages','profile']);
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

test('publication search combines keywords, hobby and community and opens the matching post', async () => {
  const handlers = {};
  const context = appContext(handlers);
  vm.runInContext(`
    state.user={uid:'reader'};
    state.tab='explore';state.exploreView='posts';
    state.groups=[{id:'film',name:'Clube da Fotografia'},{id:'other',name:'Outro grupo'}];
    state.posts=[
      {id:'wanted',content:'Uma câmera analógica',groupId:'film',hobby:'Fotografia'},
      {id:'other-group',content:'Outra câmera analógica',groupId:'other',hobby:'Fotografia'},
      {id:'other-hobby',content:'Um livro sobre câmera analógica',groupId:'film',hobby:'Leitura'},
      {id:'other-text',content:'Técnicas digitais',groupId:'film',hobby:'Fotografia'}
    ];
    state.search='  ANALOGICA   camera ';
  `, context);
  handlers.change({target:{id:'post-search-hobby',value:'fotografia'}});
  handlers.change({target:{id:'post-search-group',value:'film'}});
  const markup = vm.runInContext('renderExplore()', context);
  assert.match(markup, /1 resultado/);
  assert.match(markup, /data-action="comments" data-id="wanted">.*Abrir publicação/);
  assert.doesNotMatch(markup, /data-id="other-(?:group|hobby|text)"/);
  vm.runInContext("openComments=id=>{state.selectedPost=id;}", context);
  await vm.runInContext("onAction({dataset:{action:'comments',id:'wanted'}})", context);
  assert.equal(vm.runInContext('state.selectedPost', context), 'wanted');
  handlers.input({target:{id:'explore-search',value:'inexistente',matches:()=>true}});
  assert.match(vm.runInContext('renderExplore()', context), /Nenhuma publicação encontrada/);
});

test('publication search includes older results and resets pagination when a filter changes', async () => {
  const handlers = {};
  const context = appContext(handlers);
  vm.runInContext(`
    state.user={uid:'reader'};
    state.tab='explore';state.exploreView='posts';
    state.posts=Array.from({length:125},(_,i)=>({id:'post-'+i,content:i===124?'Filme raro':'Filme',hobby:'Fotografia'}));
  `, context);
  const initial = vm.runInContext('renderExplore()', context);
  assert.match(initial, /125 resultados/);
  assert.doesNotMatch(initial, /data-id="post-20"/);
  await vm.runInContext("onAction({dataset:{action:'more-post-results'}})", context);
  assert.match(vm.runInContext('renderExplore()', context), /data-id="post-20"/);
  handlers.change({target:{id:'post-search-hobby',value:'fotografia'}});
  assert.doesNotMatch(vm.runInContext('renderExplore()', context), /data-id="post-20"/);
  handlers.input({target:{id:'explore-search',value:'filme raro',matches:()=>true}});
  assert.match(vm.runInContext('renderExplore()', context), /data-id="post-124"/);
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
