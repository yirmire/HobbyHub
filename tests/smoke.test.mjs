import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Tests the UI and chat creation logic without real Firebase credentials.
function appContext(handlers = {}) {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8')
    .replace(/\binit\(\);\s*$/, '');
  const context = vm.createContext({
    console, Date, URL, URLSearchParams, TextEncoder, setTimeout, clearTimeout, navigator: {},
    localStorage: { getItem: () => null, setItem: () => {} },
    window: { addEventListener: () => {}, scrollTo: () => {}, scrollY: 0,
      location: new URL('https://example.test/HobbyHub/') },
    document: { addEventListener: (event, handler) => { handlers[event] = handler; }, getElementById: () => null }
  });
  vm.runInContext(source, context, {filename: 'app.js', timeout: 1500});
  return context;
}

test('hobby notices include only new matching events and respect city and format', () => {
  const context=appContext();
  const alerts=vm.runInContext(`
    state.user={uid:'reader'};state.profile={location:'São Paulo, SP'};
    state.eventHobbyAlerts=new Map([
      ['Fotografia',{scope:'city',since:{toMillis:()=>100}}],
      ['Leitura',{scope:'online',since:{toMillis:()=>100}}]
    ]);
    const base={date:'2099-05-01',time:'10:00',createdAt:200,createdBy:'organizer',attendees:[]};
    state.events=[
      {...base,id:'local',hobby:'Fotografia',location:'Praça central, São Paulo - SP'},
      {...base,id:'online',hobby:'Leitura',format:'online',location:'Online'},
      {...base,id:'other-city',hobby:'Fotografia',location:'Rio de Janeiro'},
      {...base,id:'old',hobby:'Fotografia',location:'São Paulo',createdAt:99},
      {...base,id:'wrong-format',hobby:'Leitura',location:'São Paulo'},
      {...base,id:'cancelled',hobby:'Fotografia',location:'São Paulo',cancelled:true}
    ];
    notificationItems().filter(item=>item.type==='event-hobby-alert').map(item=>item.eventId).sort().join(',')
  `,context);
  assert.equal(alerts,'local,online');
});

test('mobile chat navigation preserves the inbox search and filter when returning from a conversation', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'owner'};
    window.matchMedia=()=>({matches:true});
    state.directThreadSearch='Lia';state.directThreadFilter='archived';
  `,context);
  assert.doesNotMatch(vm.runInContext('renderMessages()',context),/chat-shell mobile-chat-open/);
  await vm.runInContext("onAction({dataset:{action:'chat-community',value:'global'}})",context);
  assert.match(vm.runInContext('renderMessages()',context),/chat-shell mobile-chat-open/);
  vm.runInContext("state.chatMode='direct';state.chatTarget={uid:'peer',name:'Lia'}",context);
  await vm.runInContext("onAction({dataset:{action:'toggle-mobile-chat-options'}})",context);
  assert.match(vm.runInContext('renderMessages()',context),/chat-options is-open/);
  await vm.runInContext("onAction({dataset:{action:'back-mobile-chats'}})",context);
  const inbox=vm.runInContext('renderMessages()',context);
  assert.doesNotMatch(inbox,/chat-shell mobile-chat-open|chat-options is-open/);
  assert.match(inbox,/value="Lia"/);
  assert.match(inbox,/data-value="archived" aria-pressed="true"/);
});

test('removed direct messages hide their content and disappear from saved messages and links', () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'owner'};state.chatMode='direct';state.chatTarget={uid:'peer',name:'Lia'};
    state.directMessages=[
      {id:'deleted',senderId:'owner',createdAt:now()-100,text:'https://secret.example',deletedAt:{}},
      {id:'reply',senderId:'peer',createdAt:now()-50,text:'Entendido',replyTo:'deleted'}
    ];
    state.directSavedIds=new Set(['deleted']);
  `,context);
  const chat=vm.runInContext('renderMessages()',context);
  assert.equal((chat.match(/Mensagem apagada/g)||[]).length,2);
  assert.doesNotMatch(chat,/secret\.example|data-action="delete-direct-message" data-id="deleted"/);
  assert.match(vm.runInContext("state.directLinksLimit=25;renderMessages()",context),/Nenhum link compartilhado/);
  assert.match(vm.runInContext("state.directLinksLimit=0;state.directSavedLimit=25;renderMessages()",context),/Nenhuma mensagem salva/);
});

test('only the sender can edit a recent direct message and edited messages are labeled', () => {
  const context=appContext();
  const html=vm.runInContext(`
    state.user={uid:'owner'};state.chatMode='direct';state.chatTarget={uid:'peer',name:'Lia'};
    state.directMessages=[
      {id:'old',senderId:'owner',createdAt:now()-directMessageEditWindow,text:'Antiga'},
      {id:'peer',senderId:'peer',createdAt:now()-100,text:'Recebida',editedAt:{}},
      {id:'own',senderId:'owner',createdAt:now()-100,text:'Minha'}
    ];
    renderMessages()
  `,context);
  assert.match(html,/data-action="edit-direct-message" data-id="own"/);
  assert.doesNotMatch(html,/data-action="edit-direct-message" data-id="(?:old|peer)"/);
  assert.match(html,/Editada/);
});

test('muting a private conversation changes the navigation badge but keeps it in the unread filter', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'owner'};state.chatMode='direct';state.chatTarget={uid:'peer',name:'Lia'};
    state.threads=[{id:'owner_peer',participants:['owner','peer']}];
    state.latestInboundAt.set('owner_peer',10);state.directThreadFilter='unread';
    render=()=>{};showToast=()=>{};
    firebase={doc:(_db,...parts)=>parts.join('/'),
      setDoc:async (path,data)=>{state.mutePath=path;state.mutedDirectThreads.set('owner_peer',data.until??0);},
      deleteDoc:async path=>{state.unmutePath=path;state.mutedDirectThreads.clear();}};
  `,context);
  assert.match(vm.runInContext("unreadBadge('messages')",context),/1 conversa não lida/);
  await vm.runInContext("onAction({dataset:{action:'toggle-direct-mute'}})",context);
  assert.match(vm.runInContext('renderMessages()',context),/1 hora[\s\S]*8 horas[\s\S]*Até reativar manualmente/);
  await vm.runInContext("onAction({dataset:{action:'set-direct-mute-duration',value:'1h'}})",context);
  assert.equal(vm.runInContext("unreadBadge('messages')",context),'');
  assert.match(vm.runInContext('renderMessages()',context),/data-id="peer"[\s\S]*Reativar contador/);
  assert.match(vm.runInContext('state.mutePath',context),/members\/owner\/privateMuted\/owner_peer$/);
  assert.equal(vm.runInContext("directThreadMuted('owner_peer',state.mutedDirectThreads.get('owner_peer'))",context),false);
  vm.runInContext("const expires=state.mutedDirectThreads.get('owner_peer');state.mutedDirectThreads.set('owner_peer',Date.now()-1);",context);
  assert.match(vm.runInContext("unreadBadge('messages')",context),/1 conversa não lida/);
  vm.runInContext("state.mutedDirectThreads.set('owner_peer',expires)",context);
  await vm.runInContext("onAction({dataset:{action:'toggle-direct-mute'}})",context);
  assert.equal(vm.runInContext('state.mutePath===state.unmutePath',context),true);
  assert.match(vm.runInContext("unreadBadge('messages')",context),/1 conversa não lida/);
});

test('the combined saved-message list fetches personal markers and searches names or message text', async () => {
  const handlers={};
  const context=appContext(handlers);
  vm.runInContext(`
    state.user={uid:'owner'};
    state.threads=[
      {id:'archive_owner',participants:['owner','archive'],names:{archive:'João'}},
      {id:'owner_peer',participants:['owner','peer'],names:{peer:'Lia'}}
    ];
    state.archivedDirectThreads.set('archive_owner',0);
    firebase={
      collection:(_db,...parts)=>parts.join('/'),
      doc:(path,id)=>path+'/'+id,
      getDocs:async path=>{
        if(!path.includes('/members/owner/privateSaved/'))throw Error('wrong marker path');
        return {docs:[{id:path.includes('archive_owner')?'first':'second'}]};
      },
      getDoc:async path=>({exists:()=>true,data:()=>path.endsWith('/first')
        ?{text:'Endereço da feira',createdAt:1}:{text:'Confirmado',createdAt:2}}),
      onSnapshot:(path,update)=>{if(path.endsWith('/first'))state.savedFirstUpdate=update;return ()=>{};}
    };
  `,context);
  await vm.runInContext('openAllSavedDirectMessages()',context);
  assert.match(vm.runInContext('renderMessages()',context),/Lia[\s\S]*João/);
  handlers.input({target:{id:'all-saved-direct-search',value:'JOAO'}});
  const byName=vm.runInContext('renderMessages()',context);
  assert.match(byName,/data-id="first" data-value="archive"/);
  assert.doesNotMatch(byName,/Confirmado/);
  handlers.input({target:{id:'all-saved-direct-search',value:'endereco'}});
  assert.match(vm.runInContext('renderMessages()',context),/Endereço da feira/);
  vm.runInContext('state.savedFirstUpdate({data:()=>({deletedAt:{},text:""})})',context);
  assert.doesNotMatch(vm.runInContext('renderMessages()',context),/Endereço da feira/);
});

test('saved private messages show only personal markers and can jump to their source', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'owner'};state.chatMode='direct';state.chatTarget={uid:'peer',name:'Lia'};
    state.directMessages=[
      {id:'saved',text:'Endereço <principal>',senderId:'peer',createdAt:1},
      {id:'other',text:'Mensagem comum',senderId:'owner',createdAt:2}
    ];
    state.directSavedIds=new Set(['saved']);
  `,context);
  await vm.runInContext("onAction({dataset:{action:'toggle-direct-saved-panel'}})",context);
  const panel=vm.runInContext('renderMessages()',context);
  assert.match(panel,/Endereço &lt;principal&gt;/);
  assert.match(panel,/data-action="toggle-direct-saved-message" data-id="saved"[^>]*>Remover dos salvos/);
  assert.doesNotMatch(panel,/Mensagem comum/);
  await vm.runInContext("onAction({dataset:{action:'jump-direct-message',id:'saved'}})",context);
  assert.equal(vm.runInContext('state.directSavedLimit',context),0);
  assert.equal(vm.runInContext('state.directHistoryAnchor',context),'saved');
});

test('shared private links render newest first with safe addresses and can jump to the source', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'owner'};
    state.chatMode='direct';state.chatTarget={uid:'peer',name:'Lia'};
    state.directMessages=[
      {id:'older',senderId:'owner',createdAt:1,text:'Veja (https://example.com/wiki/Foo(bar)).'},
      {id:'newer',senderId:'peer',createdAt:2,text:'https://example.org/?x=1&y=2; javascript:alert(1) https://user:pass@example.net/'}
    ];
    state.messages=[{id:'public',text:'https://public.example/'}];
  `,context);
  await vm.runInContext("onAction({dataset:{action:'toggle-direct-links'}})",context);
  const panel=vm.runInContext('renderMessages()',context);
  assert.match(panel,/href="https:\/\/example\.org\/\?x=1&amp;y=2"[\s\S]*href="https:\/\/example\.com\/wiki\/Foo\(bar\)"/);
  assert.match(panel,/target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(panel,/javascript:|example\.net|public\.example/);
  await vm.runInContext("onAction({dataset:{action:'jump-direct-message',id:'older'}})",context);
  assert.equal(vm.runInContext('state.directLinksLimit',context),0);
  assert.equal(vm.runInContext('state.directHistoryAnchor',context),'older');
});

test('private conversation name search normalizes names and works with the selected filter', () => {
  const handlers={};
  const context=appContext(handlers);
  vm.runInContext(`
    state.user={uid:'owner'};
    state.members=[{uid:'pin',name:'João da Silva'},{uid:'other',name:'Maria'}];
    state.threads=[
      {id:'owner_current',participants:['owner','current'],names:{current:'Joana'},createdAt:20},
      {id:'owner_pin',participants:['owner','pin'],createdAt:5},
      {id:'arch_owner',participants:['owner','arch'],names:{arch:'João Arquivado'}},
      {id:'other_owner',participants:['owner','other']}
    ];
    state.pinnedDirectThreads=['owner_pin'];
    state.archivedDirectThreads.set('arch_owner',0);
    state.latestInboundAt.set('owner_current',20);
  `,context);
  handlers.input({target:{id:'direct-thread-search',value:'JOA'}});
  const results=vm.runInContext('renderMessages()',context);
  assert.match(results,/data-id="pin"[\s\S]*data-id="current"/);
  assert.doesNotMatch(results,/data-id="arch"|data-id="other"/);
  const unread=vm.runInContext("state.directThreadFilter='unread';renderMessages()",context);
  assert.match(unread,/data-id="current"/);
  assert.doesNotMatch(unread,/data-id="pin"/);
  assert.match(vm.runInContext("state.directThreadFilter='archived';renderMessages()",context),/data-id="arch"/);
  handlers.input({target:{id:'direct-thread-search',value:'xyz'}});
  assert.match(vm.runInContext('renderMessages()',context),/Nenhuma conversa encontrada neste filtro/);
});

test('archived conversations return to the unread list when a newer message arrives', () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'owner'};
    state.threads=[{id:'owner_peer',participants:['owner','peer']}];
    state.privateReadAt.set('owner_peer',10);
    state.latestInboundAt.set('owner_peer',10);
    state.archivedDirectThreads.set('owner_peer',10);
  `,context);
  assert.doesNotMatch(vm.runInContext('renderMessages()',context),/data-action="open-dm"/);
  assert.match(vm.runInContext("state.directThreadFilter='archived';renderMessages()",context),/data-action="open-dm" data-id="peer"/);
  const empty=vm.runInContext("state.latestInboundAt.set('owner_peer',11);renderMessages()",context);
  assert.match(empty,/Nenhuma conversa arquivada/);
  const unread=vm.runInContext("state.directThreadFilter='unread';renderMessages()",context);
  assert.match(unread,/chat-unread[^>]+data-action="open-dm" data-id="peer"/);
});

test('a personal unread marker restores a read conversation until it is opened again', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'owner'};
    state.chatMode='direct';state.chatTarget={uid:'peer',name:'Lia'};
    state.threads=[{id:'owner_peer',participants:['owner','peer']}];
    state.directThreadFilter='unread';
    state.privateReadAt.set('owner_peer',10);
    state.latestInboundAt.set('owner_peer',10);
    render=()=>{};showToast=()=>{};
    firebase={
      doc:(_db,...parts)=>parts.join('/'),collection:()=>({}),onSnapshot:()=>()=>{},
      setDoc:async path=>{state.savedUnreadMarker=path;state.manualUnreadThreads.add('owner_peer');},
      runTransaction:async(_db,callback)=>callback({
        get:async()=>({exists:()=>true}),
        delete:path=>{state.deletedUnreadMarker=path;state.manualUnreadThreads.delete('owner_peer');}
      })
    };
  `,context);
  await vm.runInContext("onAction({dataset:{action:'mark-direct-unread'}})",context);
  assert.match(vm.runInContext('state.savedUnreadMarker',context),/members\/owner\/privateUnread\/owner_peer$/);
  assert.match(vm.runInContext('renderMessages()',context),/data-action="open-dm" data-id="peer"/);
  await vm.runInContext("startDirect('peer')",context);
  assert.equal(vm.runInContext('state.savedUnreadMarker===state.deletedUnreadMarker',context),true);
  assert.match(vm.runInContext('renderMessages()',context),/Nenhuma conversa não lida/);
});

test('unread conversation filter keeps unread pins first and leaves the active chat open after reading', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'owner'};
    state.chatMode='direct';state.chatTarget={uid:'pin',name:'Lia'};
    state.threads=[
      {id:'owner_read',participants:['owner','read'],createdAt:100},
      {id:'owner_unread',participants:['owner','unread'],createdAt:3},
      {id:'owner_pin',participants:['owner','pin'],createdAt:1}
    ];
    state.latestInboundAt.set('owner_unread',4);
    state.latestInboundAt.set('owner_pin',2);
    state.pinnedDirectThreads=['owner_pin','owner_read'];
  `,context);
  await vm.runInContext("onAction({dataset:{action:'filter-direct-threads',value:'unread'}})",context);
  const filtered=vm.runInContext('renderMessages()',context);
  assert.match(filtered,/data-value="unread" aria-pressed="true"/);
  assert.match(filtered,/data-action="open-dm" data-id="pin"[\s\S]*data-action="open-dm" data-id="unread"/);
  assert.doesNotMatch(filtered,/data-action="open-dm" data-id="read"/);
  const afterReading=vm.runInContext("state.privateReadAt.set('owner_pin',2);state.privateReadAt.set('owner_unread',4);renderMessages()",context);
  assert.doesNotMatch(afterReading,/data-action="open-dm"/);
  assert.match(afterReading,/Nenhuma conversa não lida/);
  assert.match(afterReading,/<strong>Lia<\/strong>/);
  await vm.runInContext("onAction({dataset:{action:'filter-direct-threads',value:'all'}})",context);
  assert.match(vm.runInContext('renderMessages()',context),/data-action="open-dm" data-id="read"/);
});

test('pinned private conversations appear before unread and recent conversations', () => {
  const context=appContext();
  const html=vm.runInContext(`
    state.user={uid:'owner'};
    state.chatMode='direct';state.chatTarget={uid:'pin',name:'Lia'};
    state.threads=[
      {id:'owner_recent',participants:['owner','recent'],createdAt:100},
      {id:'owner_unread',participants:['owner','unread'],createdAt:3},
      {id:'owner_pin',participants:['owner','pin'],createdAt:1}
    ];
    state.latestInboundAt.set('owner_unread',4);
    state.pinnedDirectThreads=['owner_pin'];
    renderMessages()
  `,context);
  assert.match(html,/data-id="pin"[\s\S]*data-id="unread"[\s\S]*data-id="recent"/);
  assert.match(html,/Desafixar conversa/);
});

test('private message drafts save text and the reply independently for each account and peer', async () => {
  const context=appContext();
  vm.runInContext(`
    const storage=new Map();
    localStorage.getItem=key=>storage.get(key);
    localStorage.setItem=(key,value)=>storage.set(key,value);
    localStorage.removeItem=key=>storage.delete(key);
    state.user={uid:'owner'};
    state.chatMode='direct';state.chatTarget={uid:'peer',name:'Lia'};
    state.directReply={id:'original'};
    saveCurrentPrivateMessageDraft('Texto <privado>');
  `,context);
  assert.equal(vm.runInContext('readPrivateMessageDraft(privateMessageDraftKey()).replyTo',context),'original');
  assert.match(vm.runInContext('renderMessages()',context),/value="Texto &lt;privado&gt;"/);
  assert.equal(vm.runInContext("readPrivateMessageDraft(privateMessageDraftKey('other'))",context),null);
  assert.equal(vm.runInContext("state.user={uid:'different'};readPrivateMessageDraft(privateMessageDraftKey())",context),null);
  vm.runInContext("state.user={uid:'owner'}",context);
  await vm.runInContext("onAction({dataset:{action:'cancel-direct-reply'}})",context);
  assert.equal(vm.runInContext('readPrivateMessageDraft(privateMessageDraftKey()).replyTo',context),'');
  assert.equal(vm.runInContext('readPrivateMessageDraft(privateMessageDraftKey()).message',context),'Texto <privado>');
  vm.runInContext("saveCurrentPrivateMessageDraft('')",context);
  assert.equal(vm.runInContext('readPrivateMessageDraft(privateMessageDraftKey())',context),null);
});

test('private replies quote messages from the same conversation and can be cancelled', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'owner'};
    state.chatMode='direct';state.chatTarget={uid:'peer',name:'Lia'};
    state.directMessages=[
      {id:'original',senderId:'peer',text:'Onde fica <o local>?',createdAt:1},
      {id:'answer',senderId:'owner',text:'Na praça',replyTo:'original',createdAt:2},
      {id:'missing',senderId:'owner',text:'Até logo',replyTo:'unknown',createdAt:3}
    ];
  `,context);
  await vm.runInContext("onAction({dataset:{action:'reply-direct-message',id:'original'}})",context);
  const html=vm.runInContext('renderMessages()',context);
  assert.match(html,/Respondendo a/);
  assert.match(html,/data-action="jump-direct-message" data-id="original".*Onde fica &lt;o local&gt;\?/);
  assert.doesNotMatch(html,/data-action="jump-direct-message" data-id="unknown"/);
  await vm.runInContext("onAction({dataset:{action:'cancel-direct-reply'}})",context);
  assert.doesNotMatch(vm.runInContext('renderMessages()',context),/Respondendo a/);
});

test('private chat search finds accented text outside the recent window and opens its message', () => {
  const context = appContext();
  vm.runInContext(`
    state.user={uid:'owner'};
    state.chatMode='direct';state.chatTarget={uid:'peer',name:'Lia'};
    state.directMessages=Array.from({length:220},(_,i)=>({
      id:'message-'+i,senderId:'owner',createdAt:i,text:i===12?'Endereço <principal>':'Outro assunto'
    }));
    state.messages=[{id:'public',text:'Endereço público',scope:'global'}];
  `,context);
  assert.ok(!vm.runInContext('renderMessages()',context).includes('id="direct-message-message-12"'));
  const results=vm.runInContext("state.directSearch={query:' ENDERECO ',limit:20};renderMessages()",context);
  assert.match(results,/1 mensagem encontrada/);
  assert.match(results,/data-id="message-12"/);
  assert.match(results,/Endereço &lt;principal&gt;/);
  assert.doesNotMatch(results,/Endereço público/);
  const opened=vm.runInContext("showDirectMessage('message-12');renderMessages()",context);
  assert.match(opened,/id="direct-message-message-12" tabindex="-1"/);
  assert.match(opened,/Ir para as mais recentes/);
  assert.doesNotMatch(vm.runInContext("state.chatMode='global';renderMessages()",context),/Buscar na conversa/);
});

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

test('long reply threads can be collapsed and a notice expands the correct thread before focusing', async () => {
  const context=appContext();
  let focused=false,scrolled=false;
  context.document.getElementById=id=>id==='post-comment-third'?{
    focus:()=>{focused=true;},scrollIntoView:()=>{scrolled=true;}
  }:null;
  vm.runInContext(`
    state.user={uid:'reader'};state.modal='comments';state.selectedPost='post';
    state.posts=[{id:'post',content:'Publicação'}];
    state.comments=[{id:'root',text:'Comentário original'},{id:'short',text:'Outro comentário'},
      {id:'first',parentId:'root',text:'Primeira resposta'},
      {id:'second',parentId:'root',text:'Segunda resposta'},
      {id:'third',parentId:'root',text:'Terceira resposta'},
      {id:'only',parentId:'short',text:'Resposta única'}];
    const docs=state.comments.map(item=>({id:item.id,data:()=>item}));
    firebase={collection:()=>null,onSnapshot:(_ref,callback)=>{callback({docs});return ()=>{};}};
  `,context);
  const markup=()=>vm.runInContext('renderModal()',context);
  assert.match(markup(),/aria-expanded="false">Ver 3 respostas/);
  assert.match(markup(),/Resposta única/);
  assert.doesNotMatch(markup(),/Terceira resposta/);
  const toggle=()=>vm.runInContext("onAction({dataset:{action:'toggle-comment-replies',id:'root'}})",context);
  await toggle();
  assert.match(markup(),/aria-expanded="true">Recolher respostas[\s\S]*Terceira resposta/);
  await toggle();
  assert.doesNotMatch(markup(),/Terceira resposta/);
  vm.runInContext("openComments('post','third')",context);
  assert.match(markup(),/Recolher respostas[\s\S]*Terceira resposta/);
  assert.equal(focused&&scrolled,true);
});

test('comment replies sit under their parent and open from the privacy-aware bell', async () => {
  const handlers={},context=appContext(handlers);
  context.FormData=function(){return [['text',' Uma resposta nova ']];};
  vm.runInContext(`
    state.user={uid:'reader'};state.modal='comments';state.selectedPost='post';
    state.posts=[{id:'post',userId:'owner',content:'Publicação'}];
    state.comments=[{id:'parent',userId:'author',userName:'Ana',text:'Comentário original'},
      {id:'later',userId:'other',text:'Outro comentário'},
      {id:'child',parentId:'parent',userId:'reader',text:'Resposta anterior'}];
    showToast=()=>{};state.writes=[];
    firebase={doc:(_db,...path)=>path.length?path.join('/'):{id:'new'},collection:()=>null,serverTimestamp:()=>123,
      writeBatch:()=>({set:(path,data)=>state.writes.push({path,data}),commit:async()=>{}})};
  `,context);
  const list=vm.runInContext('renderModal()',context);
  assert.match(list,/Comentário original[\s\S]*Resposta anterior[\s\S]*Outro comentário/);
  assert.doesNotMatch(list,/data-action="reply-to-comment" data-id="child"/);
  await vm.runInContext("onAction({dataset:{action:'reply-to-comment',id:'parent'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Respondendo a Ana/);
  await handlers.submit({target:{id:'comment-form',dataset:{draftKey:'comment:reader:post:parent'}},preventDefault(){}});
  assert.equal(vm.runInContext('state.writes[0].data.parentId',context),'parent');
  assert.match(vm.runInContext('state.writes[1].path',context),/\/author\/notifications\/comment-reply-post:new$/);
  vm.runInContext(`
    state.notifications=[{id:'notice',type:'comment-reply',actorId:'author',postId:'post',commentId:'child',createdAt:10}];
    openComments=(...args)=>{state.openedReply=args.join(':');};
  `,context);
  assert.match(vm.runInContext('renderNotifications()',context),/respondeu ao seu comentário/);
  await vm.runInContext("onAction({dataset:{action:'open-notification',id:'notice:10'}})",context);
  assert.equal(vm.runInContext('state.openedReply',context),'post:child');
});

test('the comment author can edit in place without changing the conversation order', async () => {
  const handlers={},context=appContext(handlers);
  context.FormData=function(){return [['text',' Corrigido ']];};
  vm.runInContext(`
    state.user={uid:'reader'};state.modal='comments';state.selectedPost='post';
    state.posts=[{id:'post',content:'Publicação'}];
    state.comments=[{id:'own',userId:'reader',text:'Original <texto>',createdAt:10},
      {id:'other',userId:'someone',text:'Outro comentário',createdAt:20}];
    showToast=()=>{};
    firebase={doc:(_db,...path)=>path.join('/'),serverTimestamp:()=>123,updateDoc:async(path,data)=>{state.written={path,data};}};
  `,context);
  await vm.runInContext("onAction({dataset:{action:'comment-options',id:'other'}})",context);
  assert.doesNotMatch(vm.runInContext('renderModal()',context),/data-action="edit-comment" data-id="other"/);
  await vm.runInContext("onAction({dataset:{action:'comment-options',id:'own'}})",context);
  await vm.runInContext("onAction({dataset:{action:'edit-comment',id:'own'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Original &lt;texto&gt;[\s\S]*Outro comentário/);
  await handlers.submit({target:{id:'edit-comment-form'},preventDefault(){}});
  assert.equal(vm.runInContext('JSON.stringify(state.written.data)',context),'{"text":"Corrigido","editedAt":123}');
  assert.match(vm.runInContext('state.written.path',context),/\/posts\/post\/comments\/own$/);
  assert.equal(vm.runInContext('state.commentEditor',context),null);
  assert.match(vm.runInContext('Object.assign(state.comments[0],state.written.data);renderModal()',context),/Corrigido[\s\S]*Editado[\s\S]*Outro comentário/);
});

test('only the author can open the edit menu and the form updates just the post text', async () => {
  const handlers={},context=appContext(handlers);
  context.FormData=function(){return [['content',' Texto atualizado ']];};
  vm.runInContext(`
    state.user={uid:'reader'};state.modal='comments';state.selectedPost='own';
    state.posts=[{id:'own',userId:'reader',content:'Texto <original>',likes:['one']},
      {id:'other',userId:'someone',content:'Outro post',likes:[]}];
    showToast=()=>{};
    firebase={doc:(_db,...path)=>path.join('/'),serverTimestamp:()=>123,updateDoc:async(path,data)=>{state.written={path,data};}};
  `,context);
  assert.match(vm.runInContext('postCard(state.posts[1])',context),/post-options/);
  await vm.runInContext("onAction({dataset:{action:'post-options',id:'other'}})",context);
  assert.doesNotMatch(vm.runInContext('renderModal()',context),/Editar publicação/);
  vm.runInContext("state.modal='comments'",context);
  assert.match(vm.runInContext('renderModal()',context),/Opções da publicação/);
  await vm.runInContext("onAction({dataset:{action:'post-options',id:'own'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Editar publicação/);
  await vm.runInContext("onAction({dataset:{action:'edit-post',id:'own'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Texto &lt;original&gt;/);
  await handlers.submit({target:{id:'edit-post-form'},preventDefault(){}});
  assert.equal(vm.runInContext('JSON.stringify(state.written.data)',context),'{"content":"Texto atualizado","editedAt":123}');
  assert.match(vm.runInContext('state.written.path',context),/\/posts\/own$/);
  assert.equal(vm.runInContext('state.modal',context),'comments');
  assert.match(vm.runInContext('state.posts[0].editedAt=123;postCard(state.posts[0])',context),/Editado[\s\S]*1 curtidas/);
});

test('followed posts watch only new comments, avoid duplicates and stop when unfollowed', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.posts=[{id:'post',userId:'owner',content:'Publicação'}];
    state.followedPosts.set('post',100);
    const contents=[{id:'new',userId:'owner',createdAt:120},{id:'mine',userId:'reader',createdAt:110}];
    firebase={collection:()=>null,where:(...args)=>args,orderBy:(...args)=>args,limit:value=>value,
      query:(_ref,...filters)=>filters,onSnapshot:(filters,callback)=>{
        state.filters=filters;callback({docs:contents.map(item=>({id:item.id,data:()=>item}))});
        return ()=>{state.unsubscribed=true;};
      }};
    watchFollowedPosts();
  `,context);
  assert.equal(vm.runInContext('JSON.stringify(state.filters[0])',context),'["createdAt",">",100]');
  assert.match(vm.runInContext('renderNotifications()',context),/comentou em uma publicação que você acompanha/);
  assert.equal(vm.runInContext("notificationItems().filter(item=>item.type==='followed-comment').length",context),1);
  vm.runInContext("openComments=(...args)=>{state.opened=args.join(':');}",context);
  await vm.runInContext("onAction({dataset:{action:'open-notification',id:'followed-comment:post:new'}})",context);
  assert.equal(vm.runInContext('state.opened',context),'post:new');
  vm.runInContext("state.notifications=[{id:'direct',type:'comment-reply',postId:'post',commentId:'new',actorId:'owner',createdAt:121}];state.notificationFilter='unread';",context);
  assert.doesNotMatch(vm.runInContext('renderNotifications()',context),/respondeu ao seu comentário|comentou em uma publicação/);
  vm.runInContext("state.notifications=[];state.followedPosts.clear();watchFollowedPosts()",context);
  assert.equal(vm.runInContext('state.unsubscribed',context),true);
  assert.equal(vm.runInContext("notificationItems().some(item=>item.type==='followed-comment')",context),false);
});

test('the followed tab in Saved shows new comments and lets the user open or unfollow a post', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='saved';
    state.posts=[{id:'followed',userId:'owner',content:'Texto acompanhado'},
      {id:'saved',userId:'owner',content:'Texto guardado'}];
    state.savedIds=['saved'];state.followedPosts.set('followed',100);state.followedPosts.set('missing',101);
    state.followedPostWatches.set('followed',{entries:[
      {id:'new',userId:'owner'},{id:'own',userId:'reader'},{id:'read',userId:'owner'}
    ]});
    state.notificationReads.add('followed-comment:followed:read');
    openComments=(...args)=>{state.openedFollowed=args.join(':');};
    showToast=()=>{};
    firebase={doc:(_db,...path)=>path.join('/'),deleteDoc:async path=>{state.deletedFollow=path;}};
  `,context);
  assert.match(vm.runInContext('renderSaved()',context),/Texto guardado/);
  await vm.runInContext("onAction({dataset:{action:'saved-view',value:'following'}})",context);
  const followed=vm.runInContext('renderSaved()',context);
  assert.match(followed,/Publicação indisponível[\s\S]*1 comentário novo[\s\S]*Texto acompanhado[\s\S]*Abrir conversa/);
  assert.doesNotMatch(followed,/Texto guardado/);
  await vm.runInContext("onAction({dataset:{action:'open-followed-conversation',id:'followed'}})",context);
  assert.equal(vm.runInContext('state.openedFollowed',context),'followed:new');
  assert.doesNotMatch(vm.runInContext('renderSaved()',context),/comentário novo/);
  await vm.runInContext("onAction({dataset:{action:'stop-followed-post',id:'missing'}})",context);
  assert.match(vm.runInContext('state.deletedFollow',context),/\/reader\/followedPosts\/missing$/);
});

test('followed posts can filter updates and mark only that conversation read', async () => {
  const context=appContext();
  context.document.querySelector=()=>null;
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='saved';state.savedView='following';
    state.posts=[{id:'new',content:'Publicação com atividade'},{id:'quiet',content:'Publicação tranquila'},
      {id:'other',content:'Outra publicação ativa'}];
    for(const id of ['new','quiet','other'])state.followedPosts.set(id,100);
    state.followedPostWatches.set('new',{entries:[{id:'one',userId:'owner',createdAt:110},{id:'two',userId:'owner',createdAt:120}]});
    state.followedPostWatches.set('other',{entries:[{id:'three',userId:'owner',createdAt:130}]});
  `,context);
  await vm.runInContext("onAction({dataset:{action:'followed-posts-filter',value:'unread'}})",context);
  assert.match(vm.runInContext('renderSaved()',context),/2 comentários novos/);
  assert.doesNotMatch(vm.runInContext('renderSaved()',context),/Publicação tranquila/);
  await vm.runInContext("onAction({dataset:{action:'read-followed-comments',id:'new'}})",context);
  assert.doesNotMatch(vm.runInContext('renderSaved()',context),/Publicação com atividade/);
  assert.match(vm.runInContext('renderSaved()',context),/Outra publicação ativa/);
  assert.equal(vm.runInContext("state.notificationReads.has('followed-comment:new:one')&&state.notificationReads.has('followed-comment:new:two')",context),true);
  assert.equal(vm.runInContext("state.notificationReads.has('followed-comment:other:three')",context),false);
  assert.equal(vm.runInContext("state.followedPosts.has('new')",context),true);
});

test('saved search matches text, author and community and combines with unread followed posts', async () => {
  const handlers={},context=appContext(handlers);
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='saved';
    state.groups=[{id:'group',name:'Fotografia Analógica'}];
    state.posts=[{id:'match',content:'Dicas de exposição',userName:'João',groupId:'group'},
      {id:'quiet',content:'Lentes antigas',userName:'João',groupId:'group'},
      {id:'other',content:'Trilha de montanha',userName:'Ana'}];
    state.savedIds=['match','other'];state.followedPosts.set('match',100);state.followedPosts.set('quiet',100);
    state.followedPostWatches.set('match',{entries:[{id:'reply',userId:'owner',createdAt:101}]});
  `,context);
  const search=value=>handlers.input({target:{id:'saved-search',value}});
  search('  JOAO   fotografia exposicao ');
  assert.match(vm.runInContext('renderSaved()',context),/Dicas de exposição/);
  assert.doesNotMatch(vm.runInContext('renderSaved()',context),/Trilha de montanha/);
  await vm.runInContext("onAction({dataset:{action:'saved-view',value:'following'}})",context);
  search('fotografia');
  assert.match(vm.runInContext('renderSaved()',context),/Lentes antigas/);
  await vm.runInContext("onAction({dataset:{action:'followed-posts-filter',value:'unread'}})",context);
  assert.doesNotMatch(vm.runInContext('renderSaved()',context),/Lentes antigas/);
  search('lentes');
  assert.match(vm.runInContext('renderSaved()',context),/Nenhuma publicação encontrada/);
  await vm.runInContext("onAction({dataset:{action:'clear-saved-search'}})",context);
  assert.match(vm.runInContext('renderSaved()',context),/Dicas de exposição/);
  assert.equal(vm.runInContext('state.followedPostsFilter',context),'unread');
});

test('saved collections filter the existing library and allow a post in multiple collections', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='saved';
    state.savedCollections=[{id:'photo',name:'Fotografia'},{id:'weekend',name:'Fim de semana'}];
    state.posts=[{id:'p',content:'Câmera analógica'},{id:'older',content:'Salvo antigo'}];
    state.savedIds=['p','older'];state.savedMemberships.set('p',['photo']);
    showToast=()=>{};
    firebase={doc:(_db,...path)=>path.join('/'),arrayUnion:id=>[id],updateDoc:async(path,data)=>{state.update={path,data};}};
  `,context);
  assert.match(vm.runInContext('renderSaved()',context),/Todos os salvos[\s\S]*Salvo antigo/);
  vm.runInContext("state.selectedSavedCollection='photo';state.savedSearch='camera'",context);
  assert.match(vm.runInContext('renderSaved()',context),/Câmera analógica/);
  assert.doesNotMatch(vm.runInContext('renderSaved()',context),/Salvo antigo/);
  await vm.runInContext("onAction({dataset:{action:'manage-saved-collections',id:'p'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/aria-pressed="true"[^>]*>Fotografia/);
  await vm.runInContext("onAction({dataset:{action:'toggle-saved-collection',id:'weekend'}})",context);
  assert.match(vm.runInContext('state.update.path',context),/\/reader\/saved\/p$/);
  assert.equal(vm.runInContext('state.update.data.collectionIds[0]',context),'weekend');
});

test('exports contain private notes and clean links for all saved posts or just the selected collection', async () => {
  const context=appContext();
  context.window.location={pathname:'/HobbyHub/',origin:'https://example.test',search:'?utm_source=test'};
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='saved';state.savedSearch='sem correspondência';
    state.savedCollections=[{id:'recipes',name:'Receitas'}];
    state.posts=[{id:'first',userName:'João'},{id:'other',userName:'Ana'}];
    state.savedIds=['first','other','missing'];state.savedMemberships.set('first',['recipes']);
    state.savedNotes.set('first','Pôr menos açúcar');state.savedNotes.set('missing','Minha nota antiga');
    state.downloads=[];downloadFile=(file,name,type)=>state.downloads.push({file,name,type});
  `,context);
  const download=()=>vm.runInContext("onAction({dataset:{action:'export-saved-posts'}})",context);
  await download();
  const all=vm.runInContext('state.downloads[0]',context);
  assert.equal(all.name,'hobbyhub-salvos.txt');
  assert.equal(all.type,'text/plain;charset=utf-8');
  assert.match(all.file,/#post=first\nAutor: João\nNota privada:\nPôr menos açúcar/);
  assert.match(all.file,/#post=missing[\s\S]*Minha nota antiga/);
  assert.doesNotMatch(all.file,/utm_source/);
  vm.runInContext("state.selectedSavedCollection='recipes'",context);
  await download();
  const selected=vm.runInContext('state.downloads[1]',context);
  assert.equal(selected.name,'hobbyhub-colecao.txt');
  assert.match(selected.file,/^Receitas[\s\S]*Pôr menos açúcar/);
  assert.doesNotMatch(selected.file,/#post=other|#post=missing/);
});

test('a saved note is searchable inside its collections and saves only on the private record', async () => {
  const handlers={},context=appContext(handlers);
  context.window.location={hash:''};
  context.FormData=function(){return [['note',' Testar no domingo ']];};
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='saved';
    const savedPost={id:'p',content:'Receita antiga'};
    state.posts=[savedPost];state.savedIds=['p'];
    state.savedCollections=[{id:'recipes',name:'Receitas'}];state.selectedSavedCollection='recipes';
    state.savedMemberships.set('p',['recipes']);state.savedNotes.set('p','Café <especial>');state.savedSearch='cafe';
    showToast=()=>{};
    firebase={doc:(_db,...path)=>path.join('/'),updateDoc:async(path,data)=>{state.noteWrite={path,data};}};
  `,context);
  assert.match(vm.runInContext('renderSaved()',context),/Receita antiga[\s\S]*Nota privada[\s\S]*Café &lt;especial&gt;/);
  assert.doesNotMatch(vm.runInContext('postCard(savedPost)',context),/especial/);
  await vm.runInContext("onAction({dataset:{action:'edit-saved-note',id:'p'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Café &lt;especial&gt;/);
  await handlers.submit({target:{id:'saved-note-form'},preventDefault(){}});
  assert.match(vm.runInContext('state.noteWrite.path',context),/\/reader\/saved\/p$/);
  assert.equal(vm.runInContext('JSON.stringify(state.noteWrite.data)',context),'{"note":"Testar no domingo"}');
});

test('bulk saved actions add or remove only the selected collection membership', async () => {
  const context=appContext();
  context.window.location={hash:''};
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='saved';
    state.savedCollections=[{id:'photo',name:'Fotografia'},{id:'other',name:'Outra coleção'}];
    state.posts=[{id:'p',content:'Publicação um'},{id:'q',content:'Publicação dois'}];
    state.savedIds=['p','q'];state.savedMemberships.set('p',['other']);state.savedMemberships.set('q',[]);
    showToast=()=>{};state.batches=[];
    firebase={doc:(_db,...path)=>path.at(-1),arrayUnion:id=>({add:id}),arrayRemove:id=>({remove:id}),
      writeBatch:()=>{const writes=[];return {update:(path,data)=>writes.push({path,data}),commit:async()=>{state.batches.push(writes);}}}};
  `,context);
  const action=(name,id='')=>vm.runInContext(`onAction({dataset:{action:${JSON.stringify(name)},id:${JSON.stringify(id)}}})`,context);
  await action('toggle-saved-selection');
  await action('select-saved-post','p');
  await action('select-saved-post','q');
  assert.match(vm.runInContext('renderSaved()',context),/2 selecionadas/);
  await action('choose-bulk-collection');
  assert.match(vm.runInContext('renderModal()',context),/Fotografia/);
  await action('add-selected-to-collection','photo');
  assert.equal(vm.runInContext('JSON.stringify(state.batches[0])',context),'[{"path":"p","data":{"collectionIds":{"add":"photo"}}},{"path":"q","data":{"collectionIds":{"add":"photo"}}}]');
  vm.runInContext("state.selectedSavedCollection='photo';state.savedMemberships.set('p',['photo','other']);state.savedMemberships.set('q',['photo'])",context);
  await action('toggle-saved-selection');
  await action('select-saved-post','p');
  await action('remove-selected-from-collection','photo');
  assert.equal(vm.runInContext('JSON.stringify(state.batches[1])',context),'[{"path":"p","data":{"collectionIds":{"remove":"photo"}}}]');
  assert.equal(vm.runInContext('state.savedIds.length',context),2);
});

test('renaming and deleting a collection preserve the saved posts and other collections', async () => {
  const handlers={},context=appContext(handlers);
  context.window.location={hash:''};
  context.FormData=function(){return [['name',' Fotografia nova ']];};
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='saved';state.selectedSavedCollection='photo';
    state.savedCollections=[{id:'photo',name:'Fotografia'},{id:'weekend',name:'Fim de semana'}];
    state.posts=[{id:'p',content:'Publicação salva'}];state.savedIds=['p'];
    state.savedMemberships.set('p',['photo','weekend']);
    showToast=()=>{};state.collectionWrites=[];
    firebase={doc:(_db,...path)=>path.join('/'),
      updateDoc:async(path,data)=>state.collectionWrites.push({path,data}),
      deleteDoc:async path=>state.collectionWrites.push({path})};
  `,context);
  await vm.runInContext("onAction({dataset:{action:'rename-saved-collection',id:'photo'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/value="Fotografia"/);
  await handlers.submit({target:{id:'rename-saved-collection-form'},preventDefault(){}});
  assert.equal(vm.runInContext('state.collectionWrites[0].data.name',context),'Fotografia nova');
  assert.equal(vm.runInContext('state.selectedSavedCollection',context),'photo');
  await vm.runInContext("onAction({dataset:{action:'delete-saved-collection',id:'photo'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/As publicações continuam em Todos os salvos/);
  assert.equal(vm.runInContext('state.collectionWrites.length',context),1);
  await vm.runInContext("onAction({dataset:{action:'confirm-delete-saved-collection',id:'photo'}})",context);
  assert.match(vm.runInContext('state.collectionWrites[1].path',context),/\/reader\/savedCollections\/photo$/);
  assert.equal(vm.runInContext('state.selectedSavedCollection',context),'');
  assert.match(vm.runInContext("state.selectedSavedCollection='weekend';renderSaved()",context),/Publicação salva/);
});

test('my comment filters combine type and community and find matches on older pages', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};
    state.groups=[{id:'photo',name:'Fotografia'},{id:'travel',name:'Viagens'}];
    state.posts=[{id:'p1',groupId:'travel'},{id:'p2',groupId:'photo'}];
    const doc=(id,postId,data)=>({id,ref:{path:postId+'/comments/'+id,parent:{parent:{id:postId,path:[...BASE,'posts',postId].join('/')}}},data:()=>({userId:'reader',...data})});
    const first=Array.from({length:30},(_,index)=>doc('recent'+index,'p1',{text:'Comentário recente'}));
    const second=[doc('old','p2',{parentId:'parent',text:'Resposta antiga na fotografia'})];
    state.pages=0;
    firebase={collectionGroup:()=>null,where:()=>0,orderBy:()=>0,limit:()=>0,startAfter:()=>0,query:()=>0,
      getDocs:async()=>({docs:state.pages++===0?first:second})};
  `,context);
  await vm.runInContext("onAction({dataset:{action:'my-comment-activity'}})",context);
  assert.equal(vm.runInContext('state.pages',context),1);
  await vm.runInContext("filterMyComments('replies','photo')",context);
  assert.equal(vm.runInContext('state.pages',context),2);
  assert.match(vm.runInContext('renderModal()',context),/value="photo" selected>Fotografia[\s\S]*Resposta antiga na fotografia/);
  assert.doesNotMatch(vm.runInContext('renderModal()',context),/Comentário recente/);
  await vm.runInContext("filterMyComments('comments','photo')",context);
  assert.match(vm.runInContext('renderModal()',context),/Nenhum comentário com esses filtros/);
});

test('my comments queries only the signed-in author and opens the exact reply', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.profile={name:'Leitora'};state.posts=[{id:'post',userName:'Outra pessoa'}];
    const parent={id:'post',path:[...BASE,'posts','post'].join('/')};
    const item={id:'item',ref:{parent:{parent},path:parent.path+'/comments/item'},
      data:()=>({userId:'reader',text:'Minha resposta <teste>',parentId:'root',createdAt:20})};
    firebase={collectionGroup:()=>null,where:(...args)=>args,orderBy:(...args)=>args,limit:size=>size,
      query:(_ref,...parts)=>{state.activityQuery=parts;return parts;},getDocs:async()=>({docs:[item]})};
    openComments=(...args)=>{state.openedActivity=args.join(':');};
  `,context);
  assert.match(vm.runInContext('renderProfile()',context),/Meus comentários/);
  await vm.runInContext("onAction({dataset:{action:'my-comment-activity'}})",context);
  assert.equal(vm.runInContext('JSON.stringify(state.activityQuery)',context),'[["userId","==","reader"],["createdAt","desc"],30]');
  assert.match(vm.runInContext('renderModal()',context),/Minha resposta &lt;teste&gt;[\s\S]*Outra pessoa/);
  await vm.runInContext("onAction({dataset:{action:'open-my-comment',id:state.myCommentActivity.entries[0].key}})",context);
  assert.equal(vm.runInContext('state.openedActivity',context),'post:item');
});

test('a copied comment link waits for login and opens the exact reply', async () => {
  const context=appContext();
  const copied=[];
  context.window.location={pathname:'/HobbyHub/',origin:'https://example.test',search:'?utm_source=test',hash:'#comment=post:reply'};
  context.navigator.clipboard={writeText:async url=>copied.push(url)};
  vm.runInContext(`
    state.posts=[{id:'post'}];state.comments=[{id:'reply'}];
    showToast=()=>{};
    openComments=(...args)=>{state.linkedComment=args.join(':');};
    openLinkedContent();
  `,context);
  assert.equal(vm.runInContext('state.linkedComment',context),undefined);
  vm.runInContext("state.user={uid:'reader'};openLinkedContent()",context);
  assert.equal(vm.runInContext('state.linkedComment',context),'post:reply');
  vm.runInContext("state.modal='comments';state.selectedPost='post'",context);
  await vm.runInContext("onAction({dataset:{action:'copy-comment-link',id:'reply'}})",context);
  assert.deepEqual(copied,['https://example.test/HobbyHub/#comment=post:reply']);
});

test('saved comment search matches its text, author and community without accents', async () => {
  const handlers={},context=appContext(handlers);
  vm.runInContext(`
    state.tab='saved';state.savedView='comments';
    state.groups=[{id:'coffee',name:'Café artesanal'}];
    state.posts=[{id:'post',groupId:'coffee'},{id:'other'}];
    state.savedComments.set('post:a',{postId:'post',commentId:'a'});
    state.savedComments.set('other:b',{postId:'other',commentId:'b'});
    state.savedCommentWatches.set('post:a',{comment:{text:'Moagem média',userName:'João'}});
    state.savedCommentWatches.set('other:b',{comment:{text:'Outra dica',userName:'Ana'}});
  `,context);
  handlers.input({target:{id:'saved-search',value:'CAFE joao media'}});
  const render=()=>vm.runInContext('renderSaved()',context);
  assert.match(render(),/Moagem média[\s\S]*Abrir comentário/);
  assert.doesNotMatch(render(),/Outra dica/);
  handlers.input({target:{id:'saved-search',value:'sem correspondência'}});
  assert.match(render(),/Nenhum comentário encontrado/);
  await vm.runInContext("onAction({dataset:{action:'clear-saved-search'}})",context);
  assert.match(render(),/Outra dica/);
});

test('saved comments can be kept privately and opened at their original position', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='saved';state.selectedPost='post';state.modal='comments';
    state.posts=[{id:'post',content:'Publicação'}];state.comments=[{id:'reply',parentId:'parent',userId:'another',userName:'Ana',text:'Dica de café'}];
    showToast=()=>{};
    firebase={doc:(_db,...path)=>path.join('/'),serverTimestamp:()=>99,
      setDoc:async(path,data)=>{state.savedWrite={path,data};},deleteDoc:async path=>{state.removed=path;}};
  `,context);
  await vm.runInContext("onAction({dataset:{action:'comment-options',id:'reply'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Salvar comentário/);
  await vm.runInContext("onAction({dataset:{action:'toggle-saved-comment',id:'reply'}})",context);
  assert.match(vm.runInContext('state.savedWrite.path',context),/\/reader\/savedComments\/post:reply$/);
  vm.runInContext("state.savedView='comments';state.savedComments.set('post:reply',state.savedWrite.data);state.savedCommentWatches.set('post:reply',{comment:state.comments[0]});openComments=(...args)=>{state.opened=args.join(':');}",context);
  assert.match(vm.runInContext('renderSaved()',context),/Ana[\s\S]*Dica de café[\s\S]*Abrir comentário/);
  await vm.runInContext("onAction({dataset:{action:'open-saved-comment',id:'post:reply'}})",context);
  assert.equal(vm.runInContext('state.opened',context),'post:reply');
  await vm.runInContext("onAction({dataset:{action:'remove-saved-comment',id:'post:reply'}})",context);
  assert.match(vm.runInContext('state.removed',context),/savedComments\/post:reply$/);
});

test('post drafts are scoped by account and destination and require a choice on reopening', async () => {
  const context=appContext(),stored=new Map();
  context.window.location={hash:''};
  context.localStorage={
    getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,value),removeItem:key=>stored.delete(key)
  };
  await vm.runInContext("state.user={uid:'reader'};state.profile={name:'Leitora'};onAction({dataset:{action:'compose'}})",context);
  const feed=vm.runInContext('postDraftKey()',context);
  vm.runInContext(`savePostDraft({dataset:{draftKey:postDraftKey()},elements:{content:{value:'Texto <privado>'},hobby:{value:'Arte'},format:{value:'highlight'}}});closeModal();`,context);
  await vm.runInContext("onAction({dataset:{action:'compose'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Continuar escrevendo[\s\S]*Descartar rascunho/);
  assert.doesNotMatch(vm.runInContext('renderModal()',context),/Texto privado|id="post-form"/);
  await vm.runInContext("onAction({dataset:{action:'continue-post-draft'}})",context);
  assert.equal(vm.runInContext('state.drafts.get(postDraftKey()).content',context),'Texto <privado>');
  assert.equal(vm.runInContext('state.drafts.get(postDraftKey()).format',context),'highlight');
  assert.equal(vm.runInContext("state.composingGroup='group';readPostDraft(postDraftKey())",context),null);
  assert.equal(vm.runInContext("state.user={uid:'other'};state.composingGroup=null;readPostDraft(postDraftKey())",context),null);
  await vm.runInContext("state.user={uid:'reader'};onAction({dataset:{action:'compose'}})",context);
  await vm.runInContext("onAction({dataset:{action:'discard-post-draft'}})",context);
  assert.equal(stored.has(feed),false);
  assert.match(vm.runInContext('renderModal()',context),/id="post-form"/);
});

test('event reminder preferences retain the default and can independently enable each day', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'guest'};state.notificationSettingsLoaded=true;state.modal='notification-settings';
    state.events=[
      {id:'same-day',title:'Encontro hoje',date:today(),time:'14:00',attendees:['guest']},
      {id:'next-day',title:'Encontro amanhã',date:tomorrow(),time:'15:00',attendees:['guest']},
      {id:'cancelled',title:'Cancelado',date:today(),attendees:['guest'],cancelled:true,createdBy:'host',scheduleChangedAt:{toMillis:()=>50}}
    ];
    firebase={doc:(_db,...path)=>path.join('/'),setDoc:async(ref,patch,options)=>{state.preferenceWrite={ref,patch,options};}};
    showToast=()=>{};
  `,context);
  const notices=()=>vm.runInContext("notificationItems().filter(item=>item.type==='event-reminder').map(item=>item.readKey).sort().join(',')",context);
  assert.equal(notices(),'event-reminder:next-day');
  assert.match(vm.runInContext('renderNotificationSettings()',context),/aria-pressed="true" data-action="set-event-reminders" data-value="eve"/);
  await vm.runInContext("onAction({dataset:{action:'set-event-reminders',value:'both'}})",context);
  assert.equal(vm.runInContext('state.preferenceWrite.ref.endsWith("/guest/notificationSettings/main")&&state.preferenceWrite.options.merge',context),true);
  assert.equal(vm.runInContext('state.preferenceWrite.patch.eventReminders',context),'both');
  vm.runInContext("state.notificationSettings.eventReminders='both'",context);
  assert.equal(notices(),'event-reminder-today:same-day,event-reminder:next-day');
  assert.match(vm.runInContext('renderNotifications()',context),/Hoje: Encontro hoje · às 14:00/);
  vm.runInContext("state.notificationSettings.eventReminders='day'",context);
  assert.equal(notices(),'event-reminder-today:same-day');
  vm.runInContext("state.notificationSettings.eventReminders='off'",context);
  assert.equal(notices(),'');
  assert.match(vm.runInContext('renderNotifications()',context),/Evento confirmado cancelado/);
  assert.match(vm.runInContext('renderTodayEvents()',context),/Encontro hoje/);
});

test('today on the home page orders confirmed events and shows their relevant shortcuts', () => {
  const context=appContext();
  const html=vm.runInContext(`
    state.user={uid:'guest'};
    const todayEvent={date:'2099-01-01',attendees:['guest']};
    state.events=[
      {...todayEvent,id:'remote',title:'Estudo online',time:'16:00',format:'online',revision:1},
      {...todayEvent,id:'park',title:'Encontro na praça',time:'13:00',location:'Praça Central'},
      {...todayEvent,id:'early',title:'Caminhada cedo',time:'07:00'},
      {...todayEvent,id:'cancelled',title:'Encontro cancelado',time:'12:00',cancelled:true},
      {...todayEvent,id:'waiting',title:'Sem confirmação',time:'12:00',attendees:[]},
      {...todayEvent,id:'tomorrow',title:'Outro dia',date:'2099-01-02'}
    ];
    state.homeEventRooms.set('remote',{revision:1,url:'https://meet.example.test/today'});
    renderTodayEvents(new Date(2099,0,1,9))
  `,context);
  assert.match(html,/Caminhada cedo[\s\S]*Encontro na praça<\/strong><span class="pill">Próximo encontro[\s\S]*Como chegar[\s\S]*Estudo online[\s\S]*https:\/\/meet\.example\.test\/today[^>]*>Entrar no encontro/);
  assert.doesNotMatch(html,/Encontro cancelado|Sem confirmação|Outro dia/);
  assert.doesNotMatch(vm.runInContext("state.events[0].revision=2;renderTodayEvents(new Date(2099,0,1,9))",context),/meet\.example/);
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

test('event format filters include legacy labels and room links require confirmation', () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'guest'};state.eventFilter='all';state.eventFormat='online';
    const online={id:'e',title:'Encontro virtual',format:'online',location:'Online',attendees:['guest']};
    state.events=[online,{id:'p',title:'Encontro no parque',format:'in-person',location:'Parque'},
      {id:'legacy',title:'Reunião antiga',location:'Google Meet'}];
    state.eventRoom={id:'e',url:'https://meet.example.test/room'};
  `,context);
  const agenda=vm.runInContext('renderEvents()',context);
  assert.match(agenda,/Encontro virtual[\s\S]*Reunião antiga/);
  assert.doesNotMatch(agenda,/Encontro no parque|https:\/\/meet\.example/);
  assert.match(vm.runInContext('renderEventRoom(online)',context),/href="https:\/\/meet\.example\.test\/room"[^>]*>Entrar no encontro/);
  assert.equal(vm.runInContext("online.attendees=[];renderEventRoom(online)",context),'');
  assert.equal(vm.runInContext("validEventRoomUrl('javascript:alert(1)')",context),false);
});

test('online event time zones preserve the same instant across local dates, conflicts and calendar exports', () => {
  const context=appContext();
  context.window.location={pathname:'/HobbyHub/',origin:'https://example.test',hostname:'example.test'};
  vm.runInContext(`
    state.user={uid:'guest'};
    const event={id:'brasilia',format:'online',title:'Conversa',date:'2026-11-25',time:'19:00',endTime:'20:00',timeZone:'America/Sao_Paulo'};
    const manaus={...event,id:'manaus',timeZone:'America/Manaus',time:'18:30',endTime:'19:00',attendees:['guest']};
    state.events=[event,manaus];
  `,context);
  assert.equal(vm.runInContext('new Date(eventTimeInstant(event)).toISOString()',context),'2026-11-25T22:00:00.000Z');
  assert.equal(vm.runInContext('conflictingEvents(event).map(item=>item.id).join()',context),'manaus');
  const file=vm.runInContext('calendarFile(event)',context);
  assert.match(file,/DTSTART:20261125T220000Z\r\nDTEND:20261125T230000Z/);
  const expected=new Date('2026-11-26T02:30:00Z');
  context.expected=expected;
  assert.equal(vm.runInContext(`viewerEventSchedule({...event,time:'23:30',endTime:''}).date`,context),vm.runInContext('localDateKey(expected)',context));
  assert.equal(vm.runInContext(`viewerEventSchedule({...event,time:'23:30',endTime:''}).time`,context),expected.toTimeString().slice(0,5));
});

test('dismissing and restoring an invitation only changes its personal inbox marker', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='events';state.eventFilter='invites';
    state.events=[{id:'walk',title:'Caminhada',date:'2099-05-07',time:'10:30'}];
    state.receivedEventInvites={limit:25,entries:[{id:'message',peer:'peer',thread:{id:'peer_reader'},invitation:{id:'walk'}}]};
    showToast=()=>{};
    firebase={doc:(_db,...parts)=>parts.join('/'),
      setDoc:async(path,data)=>{state.dismissWrite={path,data};state.dismissedEventInviteIds.add('peer_reader:message');},
      deleteDoc:async path=>{state.restoredPath=path;state.dismissedEventInviteIds.clear();}};
  `,context);
  assert.match(vm.runInContext('renderEvents()',context),/Dispensar convite/);
  await vm.runInContext("onAction({dataset:{action:'dismiss-event-invite',id:'message',value:'peer'}})",context);
  assert.match(vm.runInContext('state.dismissWrite.path',context),/members\/reader\/dismissedEventInvites\/peer_reader:message$/);
  assert.doesNotMatch(vm.runInContext('renderEvents()',context),/Caminhada/);
  await vm.runInContext("onAction({dataset:{action:'filter-dismissed-event-invites',value:'dismissed'}})",context);
  const dismissed=vm.runInContext('renderEvents()',context);
  assert.match(dismissed,/Caminhada[\s\S]*Restaurar convite/);
  assert.doesNotMatch(dismissed,/data-action="rsvp"/);
  await vm.runInContext("onAction({dataset:{action:'restore-event-invite',id:'message',value:'peer'}})",context);
  assert.equal(vm.runInContext('state.restoredPath===state.dismissWrite.path',context),true);
  assert.match(vm.runInContext('renderEvents()',context),/Nenhum convite dispensado/);
});

test('the event inbox lists only received invitations and puts upcoming unanswered events first', async () => {
  const handlers={};
  const context=appContext(handlers);
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='events';state.eventFilter='invites';
    state.threads=[{id:'peer_reader',participants:['reader','peer'],names:{peer:'Lia'}}];
    state.events=[
      {id:'done',title:'Confirmado',date:'2099-05-01',time:'12:00',attendees:['reader']},
      {id:'later',title:'Mais tarde',date:'2099-05-09',time:'12:00',attendees:[]},
      {id:'early',title:'Mais cedo',date:'2099-05-03',time:'12:00',attendees:[]},
      {id:'sent',title:'Meu convite',date:'2099-05-01',time:'12:00'}
    ];
    firebase={collection:(_db,...parts)=>parts.join('/'),orderBy:value=>value,startAt:value=>value,endBefore:value=>value,
      query:(path,...constraints)=>({path,constraints}),
      getDocs:async query=>{
        if(!query.path.endsWith('/peer_reader/messages')||query.constraints[1]!==eventChatPrefix||query.constraints[2]!=='Convite para evento:!')throw Error('Consulta incorreta');
        return {docs:state.events.map((event,index)=>({id:event.id+'-msg',
          data:()=>({senderId:event.id==='sent'?'reader':'peer',text:eventChatMessage(event),createdAt:100-index})}))};
      }};
  `,context);
  await vm.runInContext('loadEventInvitations()',context);
  const html=vm.runInContext('renderEvents()',context);
  assert.match(html,/Mais cedo[\s\S]*Mais tarde[\s\S]*Confirmado/);
  assert.match(html,/Enviado por Lia/);
  assert.match(html,/data-action="open-event-invitation-chat" data-id="early-msg" data-value="peer"/);
  assert.match(html,/data-action="rsvp" data-value="invitation" data-id="early"/);
  assert.doesNotMatch(html,/Meu convite/);
  handlers.input({target:{id:'received-event-invite-search',value:'MAIS CEDO'}});
  assert.match(vm.runInContext('renderEvents()',context),/Mais cedo/);
  assert.doesNotMatch(vm.runInContext('renderEvents()',context),/Mais tarde/);
  handlers.input({target:{id:'received-event-invite-search',value:'lia'}});
  await vm.runInContext("onAction({dataset:{action:'filter-event-invite-status',value:'confirmed'}})",context);
  assert.match(vm.runInContext('renderEvents()',context),/Presença confirmada/);
  assert.doesNotMatch(vm.runInContext('renderEvents()',context),/Mais cedo|Mais tarde/);
  vm.runInContext("state.events.find(event=>event.id==='later').waitlist=['reader']",context);
  await vm.runInContext("onAction({dataset:{action:'filter-event-invite-status',value:'waitlist'}})",context);
  assert.match(vm.runInContext('renderEvents()',context),/Mais tarde[\s\S]*Na lista de espera/);
  await vm.runInContext("onAction({dataset:{action:'event-filter',value:'sent-invites'}})",context);
  const sent=vm.runInContext('renderEvents()',context);
  assert.match(sent,/Enviado para Lia[\s\S]*Meu convite/);
  assert.match(sent,/data-action="open-event-invitation-chat" data-id="sent-msg" data-value="peer"/);
  assert.doesNotMatch(sent,/Mais cedo|Mais tarde|data-action="rsvp"/);
  handlers.input({target:{id:'sent-event-invite-search',value:'outra pessoa'}});
  assert.match(vm.runInContext('renderEvents()',context),/Nenhum convite encontrado/);
  handlers.input({target:{id:'sent-event-invite-search',value:'LIA'}});
  assert.match(vm.runInContext('renderEvents()',context),/Meu convite/);
});

test('shared events list private invitations in recent order with current statuses and source shortcuts', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.chatMode='direct';state.chatTarget={uid:'peer',name:'Lia'};
    state.events=[
      {id:'walk',title:'Caminhada',date:'2099-05-07',time:'10:30',attendees:['reader']},
      {id:'photo',title:'Fotografia',date:'2099-05-08',time:'09:00',waitlist:['reader']},
      {id:'music',title:'Música',date:'2099-05-09',time:'19:00',cancelled:true}
    ];
    state.directMessages=[
      {id:'older',text:eventChatMessage(state.events[0]),createdAt:1,senderId:'reader'},
      {id:'waiting',text:eventChatMessage(state.events[1]),createdAt:2,senderId:'peer'},
      {id:'cancelled',text:eventChatMessage(state.events[2]),createdAt:3,senderId:'peer'},
      {id:'removed',text:eventChatMessage(state.events[0]),createdAt:4,senderId:'reader',deletedAt:{}},
      {id:'plain',text:'Um comentário comum',createdAt:5,senderId:'peer'}
    ];
  `,context);
  await vm.runInContext("onAction({dataset:{action:'toggle-shared-direct-events'}})",context);
  const panel=vm.runInContext('renderMessages()',context);
  assert.match(panel,/Música[\s\S]*Cancelado[\s\S]*Fotografia[\s\S]*Na lista de espera[\s\S]*Caminhada[\s\S]*Presença confirmada/);
  assert.match(panel,/data-action="view-event" data-id="walk"/);
  assert.match(panel,/data-action="jump-direct-message" data-id="older"/);
  assert.doesNotMatch(panel,/Um comentário comum|data-id="removed"/);
  await vm.runInContext("onAction({dataset:{action:'jump-direct-message',id:'older'}})",context);
  assert.equal(vm.runInContext('state.directEventLimit',context),0);
  assert.equal(vm.runInContext('state.directHistoryAnchor',context),'older');
});

test('received event invitations offer confirmation or a waitlist without removing existing participation', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};
    state.events=[{id:'walk',title:'Caminhada',date:'2099-05-07',time:'10:30',attendees:[]}];
    const invite=eventChatMessage(state.events[0]);
    const card=()=>renderDirectMessageText(invite,true);
    firebase={doc:()=>({}),arrayUnion:uid=>uid,updateDoc:async()=>{state.events[0].attendees=['reader'];}};
    showToast=()=>{};
  `,context);
  assert.match(vm.runInContext('card()',context),/data-action="rsvp"[^>]*>Confirmar presença/);
  await vm.runInContext("onAction({dataset:{action:'rsvp',id:'walk',value:'invitation'}})",context);
  assert.match(vm.runInContext('card()',context),/Presença confirmada/);
  assert.doesNotMatch(vm.runInContext('card()',context),/data-action="rsvp"/);
  await vm.runInContext("onAction({dataset:{action:'rsvp',id:'walk',value:'invitation'}})",context);
  assert.match(vm.runInContext('card()',context),/Presença confirmada/);
  const full=vm.runInContext("Object.assign(state.events[0],{capacity:1,attendees:['other'],waitlist:[]});card()",context);
  assert.match(full,/Entrar na lista de espera/);
  assert.match(vm.runInContext("state.events[0].waitlist=['reader'];card()",context),/Na lista de espera/);
  assert.doesNotMatch(vm.runInContext("state.events[0].cancelled=true;card()",context),/data-action="rsvp"/);
});

test('event chat invitations show the event and use only eligible private conversations', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'owner'};
    state.events=[{id:'walk',title:'Caminhada <local>',date:'2099-05-07',time:'10:30',roomUrl:'https://private.example/join'}];
    state.selectedEvent='walk';state.modal='event-detail';
    state.members=[{uid:'peer',name:'Ana'},{uid:'restricted',name:'Contato bloqueado'}];
    state.threads=[
      {id:'owner_peer',participants:['owner','peer']},
      {id:'owner_restricted',participants:['owner','restricted']}
    ];
    state.blockedIds=['restricted'];
  `,context);
  await vm.runInContext("onAction({dataset:{action:'share-event-in-chat'}})",context);
  const modal=vm.runInContext('renderModal()',context);
  assert.match(modal,/event-chat-share-form/);
  assert.match(modal,/data-id="peer" aria-pressed="false"[^>]*>Ana/);
  assert.doesNotMatch(modal,/Contato bloqueado/);
  const card=vm.runInContext('renderDirectMessageText(eventChatMessage(state.events[0]))',context);
  assert.match(card,/Caminhada &lt;local&gt;/);
  assert.match(card,/10:30/);
  assert.match(card,/data-action="view-event" data-id="walk"/);
  assert.doesNotMatch(card,/private\.example/);
  const foreign=vm.runInContext('renderDirectMessageText("Convite para evento: Caminhada\\nhttps://foreign.example/#event=walk")',context);
  assert.doesNotMatch(foreign,/<a |<button/);
});

test('multiple event invitations retry only failed recipients with the same message identifier', async () => {
  const handlers={};
  const context=appContext(handlers);
  vm.runInContext(`
    state.user={uid:'owner'};
    state.events=[{id:'walk',title:'Caminhada'}];
    state.selectedEvent='walk';state.modal='event-detail';
    state.threads=[
      {id:'ana_owner',participants:['owner','ana'],names:{ana:'Ana'}},
      {id:'joao_owner',participants:['owner','joao'],names:{joao:'João'}}
    ];
    const writes=[];
    let allowed=false,sequence=0;
    firebase={collection:(_db,...path)=>path.join('/'),doc:path=>path+'/'+(++sequence),
      query:path=>path,orderBy:()=>null,startAt:()=>null,endBefore:()=>null,getDocsFromServer:async()=>({docs:[]}),
      setDoc:async target=>{writes.push(target);if(target.includes('joao_owner')&&!allowed)throw Error('denied');},
      getDoc:async()=>({data:()=>undefined})};
  `,context);
  await vm.runInContext("onAction({dataset:{action:'share-event-in-chat'}})",context);
  await vm.runInContext("onAction({dataset:{action:'select-event-chat-recipient',id:'ana'}})",context);
  handlers.input({target:{id:'event-chat-share-search',value:'JOAO'}});
  assert.doesNotMatch(vm.runInContext('renderModal()',context),/data-id="ana"/);
  assert.match(vm.runInContext('renderModal()',context),/1 selecionada/);
  await vm.runInContext("onAction({dataset:{action:'select-event-chat-recipient',id:'joao'}})",context);
  await vm.runInContext('sendEventChatInvites()',context);
  const partial=vm.runInContext('renderModal()',context);
  assert.match(partial,/Enviados para Ana/);
  assert.match(partial,/Envio pendente para João/);
  await vm.runInContext("allowed=true;onAction({dataset:{action:'retry-event-chat-share'}})",context);
  assert.equal(vm.runInContext('writes.length',context),3);
  assert.equal(vm.runInContext('writes[1]===writes[2]',context),true);
  assert.match(vm.runInContext('renderModal()',context),/Enviados para Ana, João/);
  const previous=vm.runInContext('renderModal()',context);
  assert.match(previous,/Já convidado/);
  assert.doesNotMatch(previous,/data-action="select-event-chat-recipient"/);
  await vm.runInContext("onAction({dataset:{action:'prepare-event-invite-resend',id:'ana'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Reenviar o convite para Ana\?/);
  assert.equal(vm.runInContext('writes.length',context),3);
  await vm.runInContext("onAction({dataset:{action:'confirm-event-invite-resend',id:'ana'}})",context);
  assert.equal(vm.runInContext('writes.length',context),4);
  assert.equal(vm.runInContext('writes[0]!==writes[3]',context),true);
});

test('Google Calendar prefills the confirmed event and keeps the private room URL in HobbyHub', () => {
  const context=appContext();
  context.window.location={pathname:'/HobbyHub/',origin:'https://example.test',hostname:'example.test'};
  vm.runInContext(`
    state.user={uid:'reader'};
    const event={id:'e',title:'Foto & vídeo',format:'online',date:'2099-05-07',time:'23:30',
      timeZone:'America/Sao_Paulo',roomUrl:'https://private.example/join',attendees:['reader']};
  `,context);
  const html=vm.runInContext('googleCalendarButton(event)',context);
  const url=new URL(html.match(/href="([^"]+)"/)[1].replaceAll('&amp;','&'));
  assert.equal(url.origin,'https://calendar.google.com');
  assert.equal(url.searchParams.get('action'),'TEMPLATE');
  assert.equal(url.searchParams.get('text'),'Foto & vídeo');
  assert.equal(url.searchParams.get('dates'),'20990508T023000Z/20990508T033000Z');
  assert.equal(url.searchParams.get('location'),'Online');
  assert.equal(url.searchParams.get('details'),'https://example.test/HobbyHub/#event=e');
  assert.doesNotMatch(html,/private\.example/);
  assert.equal(vm.runInContext('googleCalendarButton({...event,attendees:[]})',context),'');
  assert.equal(vm.runInContext('googleCalendarButton({...event,cancelled:true})',context),'');
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
          get:async path=>({exists:()=>!path.includes('/privateUnread/')&&${exists}}),
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
