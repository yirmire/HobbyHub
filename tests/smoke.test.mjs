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

test('the compact event filter button counts only active facets and preserves them when folded', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};
    state.eventSearch='caminhada';state.eventHobby='Fotografia';state.eventCityFilter='mine';
  `,context);
  const closed=vm.runInContext('renderEvents()',context);
  assert.match(closed,/data-action="toggle-event-filters" aria-expanded="false"[^>]*>Filtros \(2\)/);
  assert.match(closed,/data-action="saved-event-searches"[^>]*>Minhas buscas/);
  await vm.runInContext("onAction({dataset:{action:'toggle-event-filters'}})",context);
  assert.match(vm.runInContext('renderEvents()',context),/event-extra-filters is-open/);
  await vm.runInContext("onAction({dataset:{action:'toggle-event-filters'}})",context);
  assert.match(vm.runInContext('renderEvents()',context),/Filtros \(2\)/);
  await vm.runInContext("onAction({dataset:{action:'clear-event-filters'}})",context);
  assert.doesNotMatch(vm.runInContext('renderEvents()',context),/Filtros \(2\)/);
});

test('saved search news counts matching events and sorts them from the next date', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.savedEventSearchesLoaded=true;
    state.savedEventSearches.set('photo',{id:'photo',name:'Fotografia',query:'',hobby:'Fotografia',
      community:'',format:'',city:'',alertSince:{toMillis:()=>100}});
    state.events=[
      {id:'late',title:'Encontro distante',hobby:'Fotografia',date:'2099-05-20',time:'10:00',createdAt:300},
      {id:'early',title:'Encontro próximo',hobby:'Fotografia',date:'2099-05-05',time:'11:00',createdAt:200},
      {id:'old',title:'Anúncio anterior',hobby:'Fotografia',date:'2099-05-01',time:'11:00',createdAt:99}
    ];
    state.modal='saved-event-searches';
  `,context);
  assert.match(vm.runInContext('renderModal()',context),/2 eventos novos/);
  await vm.runInContext("onAction({dataset:{action:'view-saved-event-search-news',id:'photo'}})",context);
  const news=vm.runInContext('renderModal()',context);
  assert.match(news,/Encontro próximo[\s\S]*Encontro distante/);
  assert.doesNotMatch(news,/Anúncio anterior/);
  assert.match(news,/data-action="view-event" data-id="early"/);
  await vm.runInContext("onAction({dataset:{action:'back-saved-event-search-news'}})",context);
  assert.equal(vm.runInContext('state.modal',context),'saved-event-searches');
  assert.match(vm.runInContext('renderNotifications()',context),/data-action="view-saved-event-search-news" data-id="photo"/);
  vm.runInContext(`
    const photo=state.savedEventSearches.get('photo');
    state.savedEventSearches.set('other',{...photo,id:'other',name:'Outra busca'});
    showToast=()=>{};
    firebase={doc:(_db,...segments)=>segments.join('/'),serverTimestamp:()=>({toMillis:()=>300}),
      updateDoc:async(path,fields)=>{state.reviewedSearchPath=path;Object.assign(photo,fields);}};
  `,context);
  await vm.runInContext("onAction({dataset:{action:'view-saved-event-search-news',id:'photo'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Marcar novidades como vistas/);
  await vm.runInContext("onAction({dataset:{action:'review-saved-event-search-news'}})",context);
  assert.match(vm.runInContext('renderModal()',context),/Nenhum evento novo nesta busca/);
  assert.match(vm.runInContext('state.reviewedSearchPath',context),/savedEventSearches\/photo$/);
  assert.equal(vm.runInContext("savedEventSearchNews(state.savedEventSearches.get('other')).length",context),2);
  vm.runInContext("state.events.push({...state.events[0],id:'new',title:'Publicado depois',createdAt:301})",context);
  assert.match(vm.runInContext('renderModal()',context),/Publicado depois/);
  assert.doesNotMatch(vm.runInContext('renderModal()',context),/Encontro próximo|Encontro distante/);
});

test('saved search alerts match the agenda filters and do not duplicate hobby alerts', () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};
    const search={name:'Fotos na praça',query:'praça',hobby:'Fotografia',community:'g',
      city:'city:petropolis',format:'in-person',alertSince:{toMillis:()=>100}};
    state.savedEventSearches=new Map([['one',search],['two',search]]);
    state.eventHobbyAlerts.set('Fotografia',{scope:'city',since:{toMillis:()=>100}});
    state.profile={location:'Petrópolis'};
    const event={date:'2099-05-01',time:'10:00',attendees:[],title:'Caminhada',location:'Praça',
      city:'Petrópolis',hobby:'Fotografia',groupId:'g',createdBy:'other',createdAt:200,format:'in-person'};
    state.events=[{...event,id:'match'},{...event,id:'older',createdAt:99},
      {...event,id:'other-city',city:'Santos'},{...event,id:'different-hobby',hobby:'Leitura'}];
  `,context);
  const matching="notificationItems().filter(item=>item.type==='event-hobby-alert')";
  assert.equal(vm.runInContext(matching+".map(item=>item.eventId).join(',')",context),'match');
  assert.equal(vm.runInContext(matching+'[0].searchName',context),'Fotos na praça');
  vm.runInContext('state.eventHobbyAlerts.clear();state.savedEventSearches.clear()',context);
  assert.equal(vm.runInContext(matching+'.length',context),0);
});

test('named event searches restore all saved filters and can be removed', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='events';state.modal='saved-event-searches';
    state.savedEventSearchesLoaded=true;
    state.savedEventSearches.set('photo',{id:'photo',name:'Fotografia <Petrópolis>',query:'caminhada',
      hobby:'Fotografia',community:'group',format:'in-person',city:'city:petropolis'});
    showToast=()=>{};
    firebase={doc:(_db,...parts)=>parts.join('/'),deleteDoc:async path=>{state.removedSearch=path;state.savedEventSearches.clear();}};
  `,context);
  assert.match(vm.runInContext('renderModal()',context),/Fotografia &lt;Petrópolis&gt;/);
  await vm.runInContext("onAction({dataset:{action:'apply-event-search',id:'photo'}})",context);
  assert.equal(vm.runInContext('Object.values(currentEventSearch()).join("|")',context),'caminhada|Fotografia|group|in-person|city:petropolis');
  assert.match(vm.runInContext('renderEvents()',context),/value="city:petropolis" selected/);
  await vm.runInContext("onAction({dataset:{action:'saved-event-searches'}})",context);
  await vm.runInContext("onAction({dataset:{action:'delete-event-search',id:'photo'}})",context);
  assert.match(vm.runInContext('state.removedSearch',context),/members\/reader\/savedEventSearches\/photo$/);
  assert.match(vm.runInContext('renderModal()',context),/Nenhuma busca salva/);
});

test('the city filter prefers an explicit event city and still finds legacy venues', () => {
  const handlers={};
  const context=appContext(handlers);
  vm.runInContext(`
    state.user={uid:'reader'};state.profile={location:'São Paulo, SP'};
    const schedule={date:'2099-05-01',time:'10:00',attendees:[]};
    state.events=[
      {...schedule,id:'explicit',title:'No parque',city:'São Paulo',location:'Parque'},
      {...schedule,id:'legacy',title:'Na biblioteca',location:'Biblioteca, São Paulo'},
      {...schedule,id:'different',title:'Outra cidade',city:'Santos',hobby:'Fotografia',location:'Espaço São Paulo'},
      {...schedule,id:'different-hobby',title:'Encontro de leitura',city:'Santos',hobby:'Leitura',location:'Biblioteca'},
      {...schedule,id:'remote',title:'Sessão online',format:'online',location:'Online'}
    ];
  `,context);
  handlers.change({target:{id:'event-city-filter',value:'mine'}});
  const agenda=vm.runInContext('renderEvents()',context);
  assert.match(agenda,/No parque/);
  assert.match(agenda,/Na biblioteca/);
  assert.match(agenda,/Parque, São Paulo/);
  assert.doesNotMatch(agenda,/Outra cidade|Sessão online/);
  assert.match(agenda,/value="city:santos"[^>]*>Santos/);
  handlers.change({target:{id:'event-city-filter',value:'city:santos'}});
  handlers.change({target:{id:'event-hobby',value:'Fotografia'}});
  const selected=vm.runInContext('renderEvents()',context);
  assert.match(selected,/Outra cidade/);
  assert.doesNotMatch(selected,/No parque|Na biblioteca|Encontro de leitura|Sessão online/);
  assert.equal(vm.runInContext("eventMatchesProfileCity(state.events[2],{location:'São Paulo'})",context),false);
  assert.match(vm.runInContext("eventFormatFields('in-person','Parque','','','São Paulo')",context),/name="city".*value="São Paulo"/);
});

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

test('the upcoming agenda groups filtered events by day and sorts each group by time', () => {
  const context=appContext();
  const html=vm.runInContext(`
    state.eventHobby='Fotografia';
    state.events=[
      {id:'later',title:'À tarde',hobby:'Fotografia',date:'2026-11-25',time:'16:00'},
      {id:'before',title:'De manhã',hobby:'Fotografia',date:'2026-11-25',time:'09:00'},
      {id:'tomorrow',title:'Passeio de amanhã',hobby:'Fotografia',date:'2026-11-26',time:'11:00'},
      {id:'later-day',title:'Passeio de sábado',hobby:'Fotografia',date:'2026-11-28',time:'11:00'},
      {id:'other',title:'Outro hobby',hobby:'Leitura',date:'2026-11-25',time:'08:00'}
    ];
    renderEvents(new Date(2026,10,25,12))
  `,context);
  assert.match(html,/>Hoje<\/h2>[\s\S]*De manhã[\s\S]*À tarde[\s\S]*>Amanhã<\/h2>[\s\S]*Passeio de amanhã[\s\S]*Sábado, 28 de novembro[\s\S]*Passeio de sábado/);
  assert.doesNotMatch(html,/Outro hobby/);
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

test('media preview loads on request, clears on edits and reports unavailable media', async () => {
  const handlers={},context=appContext(handlers);
  vm.runInContext(`
    const preview={innerHTML:'',replaceChildren(){this.innerHTML='';}};
    const status={textContent:''};
    const form={elements:{photoUrl:{value:''},videoUrl:{value:''},photoDescription:{value:'Lua "cheia" <brilhante>'},videoDescription:{value:'Como observar a Lua'}},
      querySelector:selector=>selector==='[data-media-preview]'?preview:status};
    const button={dataset:{action:'preview-shared-media'},form};
  `,context);
  const action=()=>vm.runInContext('onAction(button)',context);
  await action();
  assert.match(vm.runInContext('status.textContent',context),/Adicione o link/);
  vm.runInContext("form.elements.photoUrl.value='http://example.test/photo.jpg'",context);
  await action();
  assert.match(vm.runInContext('status.textContent',context),/HTTPS/);
  vm.runInContext(`
    form.elements.photoUrl.value='https://example.test/photo.jpg';
    form.elements.videoUrl.value='https://example.test/video.mp4';
  `,context);
  await action();
  const html=vm.runInContext('preview.innerHTML',context);
  assert.match(html,/<img[^>]*loading="eager"/);
  assert.match(html,/<video[^>]*preload="metadata"/);
  assert.match(html,/alt="Lua &quot;cheia&quot; &lt;brilhante&gt;"/);
  assert.match(html,/Resumo do vídeo: Como observar a Lua/);
  handlers.input({target:{name:'photoDescription',matches:()=>false,form:vm.runInContext('form',context)}});
  assert.equal(vm.runInContext('preview.innerHTML',context),'');
  assert.equal(vm.runInContext('status.textContent',context),'');
  const notice={hidden:true};
  let removed=false;
  handlers.error({target:{matches:()=>true,tagName:'IMG',nextElementSibling:notice,remove(){removed=true;}}});
  assert.equal(notice.hidden,false);
  assert.match(notice.textContent,/A foto não carregou/);
  assert.equal(removed,true);
});

test('video captions require a video and load a bounded WebVTT file without credentials', async () => {
  const context=appContext();
  const render=fields=>vm.runInContext(`renderSharedMedia(${JSON.stringify(fields)},'na publicação',true)`,context);
  const videoUrl='https://example.test/video.mp4',captionsUrl='https://example.test/legendas.vtt';
  assert.match(render({videoUrl,captionsUrl}),/data-action="load-video-captions"[^>]*>Testar legendas/);
  assert.doesNotMatch(render({videoUrl,captionsUrl:'http://example.test/legendas.vtt'}),/load-video-captions/);
  assert.equal(vm.runInContext(`readSharedMediaFields(name=>({captionsUrl:${JSON.stringify(captionsUrl)}}[name]||'')).captionsUrl`,context),'');
  const vtt='WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nUma demonstração\n';
  let body=vtt;
  context.TextDecoder=TextDecoder;
  context.AbortSignal=AbortSignal;
  context.fetch=async (url,options)=>{
    assert.equal(url,captionsUrl);
    assert.equal(options.mode,'cors');
    assert.equal(options.credentials,'omit');
    return new Response(body);
  };
  const load=()=>vm.runInContext(`readVideoCaptions(${JSON.stringify(captionsUrl)})`,context);
  assert.equal(await load(),vtt);
  body='<html>Arquivo indisponível</html>';
  await assert.rejects(load(),/Arquivo de legendas inválido/);
  body='WEBVTT\n'+ 'x'.repeat(256*1024);
  await assert.rejects(load(),/muito grande/);
});

test('weekly unanswered filter updates after the member replies and reopens the list', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};
    state.groups=['art','books'].map(id=>({id,name:id,members:['reader'],weeklyQuestionPostId:id+'-post'}));
    state.posts=state.groups.map(group=>({id:group.weeklyQuestionPostId,groupId:group.id}));
    const answered=new Set(['books-post']);
    firebase={collection:(_db,...path)=>path,query:path=>path.at(-2),where:()=>{},limit:()=>{},
      getDocsFromServer:async id=>({empty:!answered.has(id)})};
    render=()=>{};
  `,context);
  const action=(name,value)=>vm.runInContext(`onAction({dataset:${JSON.stringify({action:name,value})}})`,context);
  const list=()=>vm.runInContext('renderModal()',context);
  await action('open-all-weekly-questions');
  await action('set-weekly-answer-filter','answered');
  assert.match(list(),/data-id="books-post"/);
  assert.doesNotMatch(list(),/data-id="art-post"/);
  await action('set-weekly-answer-filter','unanswered');
  assert.match(list(),/data-id="art-post"/);
  assert.doesNotMatch(list(),/data-id="books-post"/);
  vm.runInContext("answered.add('art-post');state.modal='comments'",context);
  await action('open-all-weekly-questions');
  assert.match(list(),/Nenhuma pergunta por responder/);
  await action('set-weekly-answer-filter','answered');
  assert.match(list(),/data-id="art-post"/);
  assert.match(list(),/data-id="books-post"/);
  await action('set-weekly-answer-filter','all');
  assert.match(list(),/data-id="art-post"/);
});

test('home weekly questions prioritize pinned groups and link to the same conversations', async () => {
  const context=appContext();
  const html=vm.runInContext(`
    state.user={uid:'reader'};
    state.groups=['normal','favorite','second','fourth','outside'].map(id=>({id,name:id,weeklyQuestionPostId:id+'-post',members:id==='outside'?[]:['reader']}));
    state.posts=state.groups.map((group,i)=>({id:group.weeklyQuestionPostId,groupId:group.id,content:'Pergunta '+group.id,createdAt:i+1}));
    state.pinnedGroupIds.add('favorite');
    renderGroupNews(true);
  `,context);
  const questions=html.match(/aria-label="Perguntas da semana"[\s\S]*?<\/section>/)?.[0]||'';
  assert.match(questions,/data-id="favorite-post"[\s\S]*data-id="fourth-post"[\s\S]*data-id="second-post"/);
  assert.doesNotMatch(questions,/normal-post|outside-post/);
  assert.match(questions,/data-action="open-all-weekly-questions"/);
  vm.runInContext('render=()=>{}',context);
  await vm.runInContext("onAction({dataset:{action:'open-all-weekly-questions'}})",context);
  const all=vm.runInContext('renderModal()',context);
  assert.match(all,/data-id="favorite-post"[\s\S]*data-id="fourth-post"[\s\S]*data-id="second-post"[\s\S]*data-id="normal-post"/);
  assert.doesNotMatch(all,/outside-post/);
});

test('weekly question notices show only the current question for joined unmuted groups', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};
    const group={id:'art',name:'Arte',members:['reader'],weeklyQuestionPostId:'old',weeklyQuestionChangedAt:{toMillis:()=>20}};
    state.groups=[group,{id:'other',name:'Outro',members:[],weeklyQuestionPostId:'outside'}];
    state.posts=[{id:'old',groupId:'art',createdAt:10},{id:'new',groupId:'art',createdAt:11},{id:'outside',groupId:'other',createdAt:12}];
    openComments=id=>{state.selectedPost=id;};
  `,context);
  const notices=()=>vm.runInContext("notificationItems().filter(item=>item.type==='weekly-question')",context);
  assert.equal(notices().length,1);
  assert.match(vm.runInContext('renderNotifications()',context),/Nova pergunta da semana em Arte/);
  await vm.runInContext("onAction({dataset:{action:'open-notification',id:'weekly-question:art:old:20'}})",context);
  assert.equal(vm.runInContext('state.selectedPost',context),'old');
  vm.runInContext("group.weeklyQuestionPostId='new';group.weeklyQuestionChangedAt={toMillis:()=>30}",context);
  assert.equal(notices()[0].readKey,'weekly-question:art:new:30');
  vm.runInContext("state.mutedCommunityIds.add('art')",context);
  assert.equal(notices().length,0);
});

test('a group can replace its weekly question without removing earlier conversations', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'owner'};state.selectedGroup='art';state.modal='group-detail';
    const group={id:'art',name:'Arte',hobby:'Arte',createdBy:'owner',members:['owner'],weeklyQuestionPostId:'earlier'};
    state.groups=[group];state.posts=[
      {id:'new',groupId:'art',content:'Qual projeto você está fazendo?',likes:[]},
      {id:'earlier',groupId:'art',content:'Qual técnica você prefere?',likes:[]}
    ];
    const archived=[];
    firebase={doc:(_db,...path)=>path.join('/'),serverTimestamp:()=>null,runTransaction:async (_db,work)=>work({
      get:async()=>({data:()=>group}),set:(path,entry)=>archived.push([path,entry]),update:(_,change)=>Object.assign(group,change)
    })};
    render=()=>{};showToast=()=>{};
  `,context);
  const render=()=>vm.runInContext('renderModal()',context);
  assert.match(render(),/aria-label="Pergunta da semana"[\s\S]*data-action="comments" data-id="earlier"/);
  await vm.runInContext("onAction({dataset:{action:'set-weekly-question',id:'new'}})",context);
  const html=render();
  assert.match(html,/aria-label="Pergunta da semana"[\s\S]*data-action="comments" data-id="new"/);
  assert.match(html,/Conversas do grupo[\s\S]*Qual técnica você prefere/);
  assert.match(vm.runInContext('archived[0][0]',context),/weeklyQuestionHistory\/earlier$/);
  vm.runInContext("state.weeklyQuestionHistory={groupId:'art',entries:[{postId:'earlier',highlightedAt:{toMillis:()=>1609502400000}},{postId:'new'}]}",context);
  const history=vm.runInContext('renderWeeklyQuestionHistory()',context);
  assert.match(history,/Qual técnica você prefere[\s\S]*Destacada em[\s\S]*data-id="earlier"/);
  assert.doesNotMatch(history,/Qual projeto você está fazendo/);
  vm.runInContext("state.user={uid:'member'};group.members.push('member')",context);
  assert.doesNotMatch(render(),/set-weekly-question|clear-weekly-question/);
});

test('group welcome notices combine reactions and link to the original presentation', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.blockedIds=['hidden'];
    const post={id:'intro',groupId:'art',groupIntroduction:true,userId:'reader',createdAt:10,welcomesChangedAt:{toMillis:()=>20},
      welcomedBy:['first','second','hidden']};
    state.posts=[post,{...post,id:'other',userId:'other'}];
    openComments=id=>{state.selectedPost=id;};
  `,context);
  const summary=()=>vm.runInContext("notificationItems().filter(item=>item.type==='group-welcome')",context);
  assert.equal(summary().length,1);
  assert.equal(summary()[0].count,2);
  assert.match(vm.runInContext('renderNotifications()',context),/2 pessoas deram boas-vindas à sua apresentação/);
  await vm.runInContext("onAction({dataset:{action:'open-notification',id:'group-welcome:intro:20'}})",context);
  assert.equal(vm.runInContext('state.selectedPost',context),'intro');
  assert.equal(vm.runInContext("state.notificationReads.has('group-welcome:intro:20')",context),true);
  vm.runInContext("post.welcomesChangedAt={toMillis:()=>30};post.welcomedBy.push('third')",context);
  assert.equal(summary()[0].readKey,'group-welcome:intro:30');
  vm.runInContext("state.notificationSettings.interactions=false",context);
  assert.equal(summary().length,0);
});

test('group welcome toggles only for another member’s introduction', async () => {
  const handlers={},context=appContext(handlers);
  vm.runInContext(`
    state.user={uid:'reader'};
    const post={id:'intro',groupId:'art',groupIntroduction:true,userId:'author'};
    state.posts=[post];const group={id:'art',members:['reader','author']};state.groups=[group];
    const writes=[];
    firebase={doc:(_db,...path)=>path.join('/'),arrayUnion:id=>['add',id],arrayRemove:id=>['remove',id],serverTimestamp:()=>null,
      updateDoc:async(path,change)=>writes.push([path,change.welcomedBy])};
    render=()=>{};
  `,context);
  const controls=()=>vm.runInContext('groupWelcomeControls(post)',context);
  const toggle=()=>vm.runInContext("onAction({dataset:{action:'toggle-group-welcome',id:'intro'}})",context);
  assert.match(controls(),/aria-pressed="false"[^>]*>Dar boas-vindas/);
  await toggle();
  vm.runInContext("post.welcomedBy=['reader']",context);
  assert.match(controls(),/aria-pressed="true"[^>]*>Desfazer boas-vindas/);
  assert.match(controls(),/1 pessoa deu boas-vindas/);
  await toggle();
  vm.runInContext("state.user={uid:'author'}",context);
  assert.doesNotMatch(controls(),/toggle-group-welcome/);
  await toggle();
  assert.equal(vm.runInContext("JSON.stringify(writes.map(write=>write[1]))",context),'[["add","reader"],["remove","reader"]]');
  handlers.toggle({target:{dataset:{groupIntroductions:'art'},isConnected:true,open:true}});
  assert.equal(vm.runInContext('state.openGroupIntroductions',context),'art');
});

test('group introduction posts appear in both presentations and the conversation list', () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.selectedGroup='art';state.modal='group-detail';
    state.groups=[{id:'art',name:'Arte',hobby:'Arte',members:['reader']}];
    state.posts=[
      {id:'intro',groupId:'art',content:'Gosto de aquarela',groupIntroduction:true,likes:[]},
      {id:'normal',groupId:'art',content:'Próxima oficina',likes:[]},
      {id:'outside',groupId:'other',content:'Apresentação externa',groupIntroduction:true,likes:[]}
    ];
  `,context);
  const html=vm.runInContext('renderModal()',context);
  const section=html.match(/<details[\s\S]*?<\/details>/)?.[0]||'';
  assert.match(section,/Apresentações \(1\)[\s\S]*Gosto de aquarela[\s\S]*data-id="intro"/);
  assert.doesNotMatch(section,/Próxima oficina|Apresentação externa/);
  assert.match(html,/Conversas do grupo[\s\S]*Apresentação[\s\S]*Gosto de aquarela/);
});

test('new group members can choose the introduction or skip straight to conversations', async () => {
  const context=appContext();
  const focused=[];
  context.document.getElementById=id=>({focus:()=>focused.push(id)});
  vm.runInContext(`
    state.user={uid:'reader'};
    const group={id:'art',name:'Arte',hobby:'Arte',members:['reader']};
    state.groups=[group];state.selectedGroup='art';state.groupFirstStepsId='art';state.modal='group-detail';
    render=()=>{};
  `,context);
  const invoke=action=>vm.runInContext(`onAction({dataset:{action:'${action}',id:'art'}})`,context);
  assert.match(vm.runInContext('renderModal()',context),/Apresentar-me[\s\S]*Ver as conversas/);
  await invoke('introduce-group');
  assert.match(vm.runInContext('renderModal()',context),/O que você gosta de fazer\?[\s\S]*O que gostaria de aprender com o grupo\?/);
  assert.match(vm.runInContext('renderModal()',context),/aria-describedby="group-introduction-prompts"/);
  vm.runInContext("state.modal='group-detail'",context);
  await invoke('browse-group-conversations');
  assert.deepEqual(focused,['group-conversations']);
  assert.equal(vm.runInContext('state.groupFirstStepsId',context),null);
  assert.doesNotMatch(vm.runInContext('renderModal()',context),/Primeiros passos no grupo/);
});

test('first visit saves the chosen hobby and carries the selection into discovery', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.profile={hobbies:['Leitura']};
    state.modal='first-visit';state.welcomeHobby='Arte';
    state.groups=[{id:'art',name:'Ateliê',hobby:'Arte',members:[]}];
    state.savedDiscoveryGroupsLoaded=true;
    const writes=[];
    firebase={doc:(_db,...path)=>path.join('/'),runTransaction:async (_db,work)=>work({
      get:async()=>({data:()=>state.profile}),update:(path,change)=>writes.push([path,change])
    })};render=()=>{};showToast=()=>{};
  `,context);
  const invoke=(action,id)=>vm.runInContext(`onAction({dataset:${JSON.stringify({action,id})}})`,context);
  await invoke('save-welcome-hobby');
  assert.equal(vm.runInContext('JSON.stringify(writes[0][1])',context),'{"hobbies":["Leitura","Arte"]}');
  vm.runInContext("state.profile.hobbies.push('Arte')",context);
  await invoke('save-welcome-hobby');
  assert.equal(vm.runInContext('writes.length',context),1);
  await invoke('view-welcome-group','art');
  assert.match(vm.runInContext('renderModal()',context),/Guardar grupo[\s\S]*Voltar às boas-vindas/);
  await invoke('back-first-visit');
  assert.equal(vm.runInContext('state.welcomeHobby',context),'Arte');
  await invoke('welcome-discover-groups');
  assert.equal(vm.runInContext("state.tab+' '+state.groupView+' '+state.groupHobby",context),'groups discover Arte');
});

test('saved group discovery keeps the bookmark before and after joining', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.tab='groups';state.groupView='discover';
    state.savedDiscoveryGroupsLoaded=true;
    const group={id:'art',name:'Arte',hobby:'Arte',members:['owner']};
    state.groups=[group,{id:'other',name:'Outro grupo',members:[]}];
    state.selectedGroup='art';state.modal='group-preview';
    const writes=[];
    firebase={doc:(_db,...path)=>path.join('/'),setDoc:async path=>writes.push(['save',path]),
      deleteDoc:async path=>writes.push(['delete',path])};render=()=>{};showToast=()=>{};
  `,context);
  assert.match(vm.runInContext('renderModal()',context),/Guardar grupo/);
  const toggle=()=>vm.runInContext("onAction({dataset:{action:'toggle-saved-discovery-group',id:'art'}})",context);
  await toggle();
  assert.match(vm.runInContext("writes[0].join(' ')",context),/save .*members\/reader\/savedDiscoveryGroups\/art$/);
  vm.runInContext("state.savedDiscoveryGroupIds.add('art');group.members.push('reader')",context);
  await vm.runInContext("onAction({dataset:{action:'toggle-saved-discovery-filter'}})",context);
  const list=vm.runInContext('renderGroups()',context);
  assert.match(list,/data-id="art"/);
  assert.doesNotMatch(list,/data-id="other"/);
  assert.match(vm.runInContext('renderModal()',context),/Remover dos grupos guardados/);
  await toggle();
  assert.equal(vm.runInContext('writes[1][0]',context),'delete');
});

test('group preview shows the latest post and the earliest upcoming event before joining', () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};
    const group={id:'art',name:'Arte',description:'Oficinas de pintura',hobby:'Arte',members:['owner']};
    state.groups=[group];state.selectedGroup='art';state.modal='group-preview';
    state.posts=[
      {id:'old',groupId:'art',createdAt:1,content:'Post anterior'},
      {id:'new',groupId:'art',createdAt:2,content:'Oficina de aquarela'}
    ];
    state.events=[
      {id:'later',groupId:'art',title:'Evento posterior',date:'2099-06-02',time:'09:00'},
      {id:'cancelled',groupId:'art',title:'Cancelado',cancelled:true,date:'2099-05-01',time:'09:00'},
      {id:'next',groupId:'art',title:'Prática de desenho',date:'2099-06-01',time:'09:00'}
    ];
  `,context);
  const html=vm.runInContext('renderModal()',context);
  assert.match(html,/Oficinas de pintura[\s\S]*data-action="join-group"[\s\S]*Oficina de aquarela/);
  assert.match(html,/data-action="view-event" data-id="next">Prática de desenho/);
  assert.doesNotMatch(html,/Post anterior|Cancelado|Evento posterior|Conversas do grupo/);
  vm.runInContext("group.members.push('reader')",context);
  assert.match(vm.runInContext('renderModal()',context),/Conversas do grupo/);
});

test('community discovery orders by the latest available post after applying filters', () => {
  const handlers={},context=appContext(handlers);
  vm.runInContext(`
    state.tab='groups';state.groupView='discover';state.user={uid:'reader'};
    state.groupMyInterests=true;state.profile={hobbies:['Arte']};
    state.groupCity=cityKey('Curitiba');
    const group=(id,hobby='Arte',location='Curitiba')=>({id,name:id,hobby,location,members:[]});
    state.groups=[group('old'),group('empty'),group('new'),group('far','Arte','Recife'),group('unrelated','Leitura')];
    const post=(groupId,date,userId='author')=>({groupId,createdAt:Date.parse(date),userId});
    state.posts=[post('old','2020-01-01T12:00:00Z'),post('new','2021-02-02T12:00:00Z'),
      post('old','2022-03-03T12:00:00Z','blocked'),post('far','2023-04-04T12:00:00Z')];
    state.blockedIds=['blocked'];render=()=>{};
  `,context);
  handlers.change({target:{id:'group-discovery-order',value:'active'}});
  const html=vm.runInContext('renderGroups()',context);
  assert.match(html,/data-id="new"[\s\S]*data-id="old"[\s\S]*data-id="empty"/);
  assert.match(html,/Última publicação: <time datetime="2021-02-02">/);
  assert.match(html,/Sem publicações disponíveis/);
  assert.doesNotMatch(html,/data-id="(?:far|unrelated)"/);
});

test('discovering communities by profile interests also respects the city', async () => {
  const context=appContext();
  vm.runInContext(`
    state.tab='groups';state.groupView='discover';state.user={uid:'reader'};
    state.profile={hobbies:['Fotografia analógica']};
    state.groups=[
      {id:'local',name:'Fotógrafos da cidade',hobby:'Fotografia analogica',location:'Curitiba',members:[]},
      {id:'far',name:'Fotógrafos de fora',hobby:'Fotografia analógica',location:'Recife',members:[]},
      {id:'other',name:'Leitoras da cidade',hobby:'Leitura',location:'Curitiba',members:[]}
    ];
    state.groupCity=cityKey('Curitiba');render=()=>{};
  `,context);
  const toggle=()=>vm.runInContext("onAction({dataset:{action:'toggle-group-my-interests'}})",context);
  await toggle();
  const list=()=>vm.runInContext('renderGroups()',context);
  assert.match(list(),/data-action="toggle-group-my-interests" aria-pressed="true"/);
  assert.match(list(),/data-id="local"/);
  assert.doesNotMatch(list(),/data-id="(?:far|other)"/);
  vm.runInContext("state.profile.hobbies=[]",context);
  assert.match(list(),/Adicione seus interesses[\s\S]*Editar perfil/);
  await toggle();
  assert.match(list(),/data-id="other"/);
});

test('pinned groups appear first in both views and only joined groups can be pinned', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.pinnedGroupsLoaded=true;
    state.groups=[
      {id:'art',name:'Arte',members:['reader']},
      {id:'books',name:'Livros',members:['reader']},
      {id:'other',name:'Outro',members:['visitor']}
    ];
    state.pinnedGroupIds.add('books');
    const writes=[];
    firebase={doc:(_db,...path)=>path.join('/'),
      setDoc:async(path,data)=>writes.push([path,data]),
      deleteDoc:async path=>writes.push([path])};
    render=()=>{};showToast=()=>{};
  `,context);
  assert.match(vm.runInContext('renderGroups()',context),/data-action="view-group" data-id="books"[\s\S]*data-action="view-group" data-id="art"/);
  assert.match(vm.runInContext('renderGroupNews()',context),/<option value="books" >Livros<\/option>[\s\S]*<option value="art" >Arte<\/option>/);
  assert.match(vm.runInContext("groupCard(state.groups[1])",context),/Desafixar grupo/);
  assert.doesNotMatch(vm.runInContext("groupCard(state.groups[2])",context),/toggle-pinned-group/);
  for(const id of ['books','art','other']){
    await vm.runInContext(`onAction({dataset:{action:'toggle-pinned-group',id:'${id}'}})`,context);
  }
  const writes=JSON.parse(vm.runInContext('JSON.stringify(writes)',context));
  assert.equal(writes.length,2);
  assert.match(writes[0][0],/members\/reader\/pinnedGroups\/books$/);
  assert.equal(writes[0].length,1);
  assert.match(writes[1][0],/members\/reader\/pinnedGroups\/art$/);
  assert.deepEqual(writes[1][1],{});
});

test('group news counts unseen posts and only advances the selected group marker', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};
    state.groupNewsReadsLoaded=true;
    state.groupNewsReads.set('art',10);
    state.blockedIds=['blocked'];
    state.groups=[{id:'art',name:'Arte',members:['reader']},{id:'books',name:'Livros',members:['reader']}];
    state.posts=[
      {createdAt:10,groupId:'art',userId:'author'},{createdAt:21,groupId:'art',userId:'author'},
      {createdAt:22,groupId:'art',userId:'author'},{createdAt:30,groupId:'art',userId:'reader'},
      {createdAt:40,groupId:'art',userId:'blocked'},{createdAt:35,groupId:'books',userId:'author'}
    ];
    const writes=[];
    let remote=50;
    firebase={doc:(_db,...path)=>path.join('/'),runTransaction:async (_db,work)=>work({
      get:async()=>({data:()=>({seenThrough:remote})}),set:(path,data)=>writes.push({path,data})
    })};
    render=()=>{};showToast=()=>{};
  `,context);
  assert.match(vm.runInContext('renderGroups()',context),/2 novas publicações/);
  assert.match(vm.runInContext('renderGroupNews()',context),/Arte \(2 novas\)/);
  const mark=()=>vm.runInContext("onAction({dataset:{action:'mark-group-news',id:'art'}})",context);
  await mark();
  assert.equal(vm.runInContext('writes.length',context),0);
  vm.runInContext('remote=10',context);
  await mark();
  assert.match(vm.runInContext('writes[0].path',context),/members\/reader\/groupNewsReads\/art$/);
  assert.equal(vm.runInContext('writes[0].data.seenThrough',context),22);
  vm.runInContext("state.groupNewsReads.set('art',22);state.groupNewsGroup='art'",context);
  const html=vm.runInContext('renderGroupNews()',context);
  assert.doesNotMatch(html,/data-action="mark-group-news"/);
  assert.match(html,/Livros \(1 nova\)/);
});

test('bulk reading status marks only selected unread saved posts', async () => {
  const context=appContext();
  vm.runInContext(`
    state.tab='saved';state.user={uid:'reader'};state.savedReadingOnly=true;
    state.savedIds=['first','second','already','other'];state.readSavedPosts.add('already');
    state.savedSelection=new Set(['first','second','already','removed']);
    const writes=[];
    firebase={doc:(_db,...path)=>path.join('/'),writeBatch:()=>({
      update:(path,change)=>writes.push([path.split('/').at(-1),change]),commit:async()=>{}
    })};
    render=()=>{};showToast=()=>{};
  `,context);
  assert.match(vm.runInContext('renderSaved()',context),/Marcar selecionadas como lidas \(2\)/);
  await vm.runInContext("onAction({dataset:{action:'mark-selected-saved-read'}})",context);
  assert.equal(vm.runInContext('JSON.stringify(writes)',context),'[["first",{"read":true}],["second",{"read":true}]]');
  assert.equal(vm.runInContext('state.savedSelection',context),null);
});

test('saved reading status updates only the saved record and filters unread posts', async () => {
  const context=appContext();
  vm.runInContext(`
    state.tab='saved';state.user={uid:'reader'};
    state.savedIds=['first','second'];
    state.savedCollections=[{id:'kit',name:'Kit'}];state.selectedSavedCollection='kit';
    state.savedMemberships.set('first',['kit']);state.savedMemberships.set('second',['kit']);
    state.posts=[{id:'first',content:'Pintura a óleo',likes:[]},{id:'second',content:'Outra pintura',likes:[]}];
    const writes=[];
    firebase={doc:(_db,...path)=>path.join('/'),updateDoc:async(path,change)=>writes.push([path,change])};
    render=()=>{};showToast=()=>{};
  `,context);
  const invoke=(action,id)=>vm.runInContext(`onAction({dataset:${JSON.stringify({action,id})}})`,context);
  await invoke('toggle-saved-reading-status','first');
  const writes=JSON.parse(vm.runInContext('JSON.stringify(writes)',context));
  assert.match(writes[0][0],/members\/reader\/saved\/first$/);
  assert.deepEqual(writes[0][1],{read:true});
  vm.runInContext("state.readSavedPosts.add('first')",context);
  const list=()=>vm.runInContext('renderSaved()',context);
  assert.match(list(),/Marcar para ler/);
  await invoke('toggle-saved-reading-filter');
  assert.doesNotMatch(list(),/Pintura a óleo/);
  assert.match(list(),/Outra pintura/);
  await invoke('toggle-saved-reading-filter');
  assert.match(list(),/Pintura a óleo/);
  await invoke('toggle-saved-reading-status','first');
  assert.equal(vm.runInContext('writes[1][1].read',context),false);
});

test('saved posts sort by save date in either direction and leave undated posts last', () => {
  const handlers={},context=appContext(handlers);
  vm.runInContext(`
    state.tab='saved';state.user={uid:'reader'};state.savedGroup='art';state.savedSearch='dica';
    state.groups=[{id:'art',name:'Arte'}];
    state.savedIds=['a','b','c','other'];
    state.savedPostDates=new Map([['a',20],['b',10],['other',30]]);
    state.posts=['b','c','a','other'].map((id,index)=>({id,groupId:id==='other'?'other':'art',
      content:'Dica '+id,userId:'author',likes:[],createdAt:100-index}));
    render=()=>{};
  `,context);
  assert.match(vm.runInContext('renderSaved()',context),/Dica a[\s\S]*Dica b[\s\S]*Dica c/);
  handlers.change({target:{id:'saved-post-order',value:'oldest'}});
  const oldest=vm.runInContext('renderSaved()',context);
  assert.match(oldest,/Dica b[\s\S]*Dica a[\s\S]*Dica c/);
  assert.doesNotMatch(oldest,/Dica other/);
});

test('saved group filter composes with the collection and text search', () => {
  const handlers={},context=appContext(handlers);
  vm.runInContext(`
    state.tab='saved';state.user={uid:'reader'};
    state.groups=[{id:'art',name:'Arte'},{id:'books',name:'Leitura'},{id:'unused',name:'Sem salvos'}];
    state.savedIds=['first','second','third','global'];
    state.savedCollections=[{id:'collection',name:'Favoritos'}];
    state.savedMemberships.set('first',['collection']);state.savedMemberships.set('second',['collection']);
    state.selectedSavedCollection='collection';state.savedSelection=new Set(['second']);
    const post=(id,groupId,content)=>({id,groupId,content,likes:[],userId:'author'});
    state.posts=[post('first','art','Dica de pintura'),post('second','books','Dica de leitura'),
      post('third','art','Fora da coleção'),post('global',null,'Publicação global')];
    render=()=>{};
  `,context);
  const list=()=>vm.runInContext('renderSaved()',context);
  handlers.change({target:{id:'saved-group-filter',value:'art'}});
  assert.equal(vm.runInContext('state.savedSelection',context),null);
  assert.match(list(),/<option value="art" selected>Arte<\/option>/);
  assert.doesNotMatch(list(),/Sem salvos|Dica de leitura|Fora da coleção|Publicação global/);
  assert.match(list(),/Dica de pintura/);
  vm.runInContext("state.savedSearch='leitura'",context);
  assert.match(list(),/Nenhuma publicação encontrada com esta busca/);
  handlers.change({target:{id:'saved-group-filter',value:''}});
  assert.match(list(),/Dica de leitura/);
});

test('a saved group news post stays in saved posts when marked as seen', () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.groupNewsReadsLoaded=true;
    state.groups=[{id:'art',name:'Arte',members:['reader']}];
    state.posts=[{id:'work',groupId:'art',content:'Trabalho novo',createdAt:15,userId:'author',likes:[]}];
    state.groupNewsUnseenOnly=true;
  `,context);
  assert.match(vm.runInContext('renderGroupNews()',context),/data-action="save" data-id="work"[^>]*>Salvar para ler depois/);
  vm.runInContext("state.savedIds=['work']",context);
  assert.match(vm.runInContext('renderGroupNews()',context),/data-action="save" data-id="work"[^>]*>Remover dos salvos/);
  vm.runInContext("state.groupNewsReads.set('art',15)",context);
  assert.doesNotMatch(vm.runInContext('renderGroupNews()',context),/data-id="work"/);
  assert.match(vm.runInContext('renderSaved()',context),/Trabalho novo/);
});

test('searching group news matches text, author or group and composes with the existing filters', async () => {
  const handlers={},context=appContext(handlers);
  vm.runInContext(`
    state.user={uid:'reader'};state.groupNewsReadsLoaded=true;state.tab='groups';state.groupView='news';
    state.groups=[{id:'art',name:'Fotografia analógica',members:['reader']},{id:'books',name:'Leitura',members:['reader']}];
    state.pinnedGroupIds.add('art');
    state.groupNewsReads.set('art',10);
    state.posts=[
      {id:'text',groupId:'art',content:'Uma trilha à noite',userId:'one',userName:'Joana',createdAt:11},
      {id:'author',groupId:'art',content:'Olhe o céu',userId:'two',userName:'Trília Lopes',createdAt:12},
      {id:'other',groupId:'books',content:'Outra trilha',userId:'three',createdAt:13},
      {id:'seen',groupId:'art',content:'Uma trilha antiga',userId:'three',createdAt:10}
    ];
    render=()=>{};
  `,context);
  const search=value=>handlers.input({target:{id:'group-news-search',value,matches:()=>false}});
  const render=()=>vm.runInContext('renderGroupNews()',context);
  search('TRILHA  A noite');
  assert.match(render(),/data-id="text"/);
  assert.doesNotMatch(render(),/data-id="(?:other|seen|author)"/);
  search('trilia lopes');
  assert.match(render(),/data-id="author"/);
  search('fotografia analogica');
  assert.match(render(),/data-id="text"/);
  assert.doesNotMatch(render(),/data-id="other"/);
  vm.runInContext("state.groupNewsGroup='favorites/all';state.groupNewsUnseenOnly=true",context);
  search('trilha');
  assert.match(render(),/data-id="text"/);
  assert.doesNotMatch(render(),/data-id="(?:other|seen)"|data-action="mark-group-news-list"/);
  assert.match(render(),/Limpe a busca/);
  assert.match(vm.runInContext('renderGroupNews(true)',context),/data-id="other"/);
  search('sem resultados');
  assert.match(render(),/Nenhuma publicação corresponde à busca/);
  search('');
  assert.match(render(),/data-action="mark-group-news-list"/);
});

test('marking the news list captures only the current scope and preserves newer posts', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.groupNewsReadsLoaded=true;state.tab='groups';state.groupView='news';
    state.groups=['art','books','photo'].map(id=>({id,name:id,members:['reader']}));
    state.pinnedGroupIds=new Set(['art','books']);state.groupNewsGroup='favorites/all';
    state.posts=[
      {id:'a',groupId:'art',createdAt:15,userId:'author'},{id:'b',groupId:'books',createdAt:16,userId:'author'},
      {id:'p',groupId:'photo',createdAt:17,userId:'author'}
    ];
    const writes=[];
    firebase={doc:(_db,...path)=>path.at(-1),runTransaction:async (_db,work)=>{
      state.posts.push({id:'new',groupId:'art',createdAt:30,userId:'author'});
      await work({get:async()=>({data:()=>undefined}),set:(id,data)=>writes.push([id,data.seenThrough])});
    }};
    render=()=>{};showToast=()=>{};
  `,context);
  assert.match(vm.runInContext('renderGroupNews()',context),/Marcar lista como vista \(2\)/);
  await vm.runInContext("onAction({dataset:{action:'mark-group-news-list'}})",context);
  assert.equal(vm.runInContext('JSON.stringify(writes)',context),'[["art",15],["books",16]]');
  vm.runInContext("state.groupNewsReads=new Map(writes);state.groupNewsUnseenOnly=true",context);
  assert.match(vm.runInContext('renderGroupNews()',context),/Marcar lista como vista \(1\)/);
  assert.equal(vm.runInContext("groupUnreadNews().get('photo').count",context),1);
});

test('group navigation badge counts unread posts from joined groups and opens the unseen list', async () => {
  const context=appContext();
  vm.runInContext(`
    state.user={uid:'reader'};state.groupNewsReadsLoaded=true;
    state.groups=[{id:'one',members:['reader']},{id:'two',members:['reader']},{id:'left',members:[]}];
    state.groupNewsReads.set('one',10);
    state.posts=[
      {groupId:'one',createdAt:15,userId:'author'},{groupId:'two',createdAt:16,userId:'author'},
      {groupId:'left',createdAt:17,userId:'author'},{groupId:'one',createdAt:10,userId:'author'},
      {groupId:'one',createdAt:18,userId:'reader'}
    ];
    state.groupNewsGroup='favorites/all';
    render=()=>{};
  `,context);
  assert.equal(vm.runInContext('groupNewsNavCount()',context),2);
  for(const render of ['renderSidebar','renderBottomNav']){
    const html=vm.runInContext(`${render}(groupNewsNavCount())`,context);
    assert.match(html,/data-action="tab" data-tab="groups"/);
    assert.match(html,/data-action="open-unseen-group-news" aria-label="Abrir 2 publicações não vistas dos meus grupos">2/);
    assert.doesNotMatch(vm.runInContext(`${render}(0)`,context),/open-unseen-group-news/);
  }
  assert.match(vm.runInContext('renderBottomNav(120)',context),/>99\+<\/button>/);
  await vm.runInContext("onAction({dataset:{action:'open-unseen-group-news'}})",context);
  assert.equal(vm.runInContext("state.tab+' '+state.groupView",context),'groups news');
  assert.equal(vm.runInContext('state.groupNewsUnseenOnly',context),true);
  assert.equal(vm.runInContext('state.groupNewsGroup',context),'');
});

test('unseen group news combines with favorites and individual groups using the read marker', async () => {
  const handlers={},context=appContext(handlers);
  vm.runInContext(`
    state.user={uid:'reader'};
    state.groupNewsReadsLoaded=true;state.pinnedGroupsLoaded=true;
    state.groupNewsReads.set('art',15);
    state.pinnedGroupIds.add('art');
    state.groups=[{id:'art',name:'Arte',members:['reader']},{id:'books',name:'Livros',members:['reader']}];
    state.posts=[
      {id:'seen',content:'Vista',groupId:'art',createdAt:15,userId:'author'},
      {id:'new-art',content:'Arte nova',groupId:'art',createdAt:21,userId:'author'},
      {id:'new-books',content:'Livro novo',groupId:'books',createdAt:22,userId:'author'},
      {id:'mine',content:'Minha',groupId:'art',createdAt:23,userId:'reader'}
    ];
    state.groupNewsLimit=40;
    render=()=>{};
  `,context);
  const action=name=>vm.runInContext(`onAction({dataset:{action:'${name}'}})`,context);
  const list=()=>vm.runInContext('renderGroupNews()',context);
  await action('toggle-group-news-unseen');
  assert.equal(vm.runInContext('state.groupNewsLimit',context),20);
  assert.match(list(),/data-action="toggle-group-news-unseen" aria-pressed="true"/);
  assert.match(list(),/data-id="new-books"[\s\S]*data-id="new-art"/);
  assert.doesNotMatch(list(),/data-id="(?:seen|mine)"/);
  handlers.change({target:{id:'group-news-group',value:'favorites/all'}});
  assert.match(list(),/data-id="new-art"/);
  assert.doesNotMatch(list(),/data-id="new-books"/);
  handlers.change({target:{id:'group-news-group',value:'books'}});
  assert.match(list(),/data-id="new-books"/);
  assert.doesNotMatch(list(),/data-id="new-art"/);
  vm.runInContext("state.groupNewsReads.set('books',22)",context);
  assert.match(list(),/Nenhuma publicação não vista neste grupo/);
  assert.match(vm.runInContext('renderGroupNews(true)',context),/data-id="mine"/);
  await action('open-group-news');
  assert.match(list(),/data-action="toggle-group-news-unseen" aria-pressed="false"/);
  assert.match(list(),/data-id="seen"/);
});

test('group news can show just favorites without filtering the home preview', async () => {
  const handlers={},context=appContext(handlers);
  vm.runInContext(`
    state.user={uid:'reader'};
    state.pinnedGroupsLoaded=true;
    state.groups=[
      {id:'art',name:'Arte',members:['reader']},
      {id:'books',name:'Leitura',members:['reader']},
      {id:'photo',name:'Fotografia',members:['reader']},
      {id:'left',name:'Outro grupo',members:[]}
    ];
    state.pinnedGroupIds=new Set(['books','photo','left']);
    state.posts=[
      {id:'recent',groupId:'photo',content:'Recent',createdAt:2},
      {id:'other',groupId:'art',content:'Other',createdAt:4},
      {id:'older',groupId:'books',content:'Older',createdAt:1},
      {id:'former',groupId:'left',content:'Former',createdAt:8}
    ];
    state.groupNewsLimit=40;
    render=()=>{};
  `,context);
  handlers.change({target:{id:'group-news-group',value:'favorites/all'}});
  const favorites=vm.runInContext('renderGroupNews()',context);
  assert.match(favorites,/<option value="favorites\/all" selected>Só favoritos<\/option>/);
  assert.match(favorites,/data-id="recent"[\s\S]*data-id="older"/);
  assert.doesNotMatch(favorites,/data-id="(?:other|former)"/);
  assert.equal(vm.runInContext('state.groupNewsLimit',context),20);
  assert.match(vm.runInContext('renderGroupNews(true)',context),/data-id="other"/);
  vm.runInContext("state.posts=state.posts.filter(post=>post.groupId==='art')",context);
  assert.match(vm.runInContext('renderGroupNews()',context),/Ainda não há publicações nos seus grupos favoritos/);
  vm.runInContext("state.pinnedGroupIds=new Set(['left'])",context);
  assert.match(vm.runInContext('renderGroupNews()',context),/fixe um grupo em Minhas comunidades/);
});

test('group news lists the newest posts from joined groups and opens the full list', async () => {
  const handlers={},context=appContext(handlers);
  vm.runInContext(`
    state.user={uid:'reader'};
    state.profile={name:'Leitora',hobbies:[]};
    state.groups=[
      {id:'photo',name:'Fotografia <local>',members:['reader']},
      {id:'books',name:'Leitura',members:['reader']},
      {id:'other',name:'Outro grupo',members:['visitor']}
    ];
    state.blockedIds=['blocked'];
    const entry=(id,groupId,createdAt,userId='author')=>({id,groupId,createdAt,userId,content:id});
    state.posts=[
      entry('old','photo',1),entry('next','photo',20),entry('third','books',15),entry('global',null,100),
      {...entry('media','books',30),content:'',photoUrl:'https://example.test/photo.jpg'},
      entry('unjoined','other',99),entry('blocked-post','photo',98,'blocked')
    ];
    render=()=>{};
  `,context);
  const home=vm.runInContext('renderGroupNews(true)',context);
  assert.match(home,/data-id="media"[\s\S]*data-id="next"[\s\S]*data-id="third"/);
  assert.match(home,/Fotografia &lt;local&gt;/);
  assert.match(home,/>Foto<\/p>/);
  assert.doesNotMatch(home,/data-id="(?:old|unjoined|global|blocked-post)"/);
  assert.match(home,/data-action="open-group-news">Ver todas/);
  await vm.runInContext("onAction({dataset:{action:'open-group-news'}})",context);
  assert.equal(vm.runInContext("state.tab+' '+state.groupView",context),'groups news');
  const full=vm.runInContext('renderGroups()',context);
  assert.match(full,/data-value="news" aria-pressed="true"/);
  assert.match(full,/data-action="comments" data-id="old"/);
  assert.match(full,/Por grupo<select class="select" id="group-news-group"/);
  assert.doesNotMatch(full,/<option value="other"/);
  handlers.change({target:{id:'group-news-group',value:'books'}});
  const filtered=vm.runInContext('renderGroupNews()',context);
  assert.match(filtered,/<option value="books" selected>Leitura<\/option>/);
  assert.match(filtered,/data-id="media"[\s\S]*data-id="third"/);
  assert.doesNotMatch(filtered,/data-id="(?:next|old)"/);
  assert.match(vm.runInContext('renderGroupNews(true)',context),/data-id="next"/);
  vm.runInContext("state.posts=state.posts.filter(post=>post.groupId!=='books')",context);
  assert.match(vm.runInContext('renderGroupNews()',context),/Ainda não há publicações para mostrar neste grupo/);
  await vm.runInContext("onAction({dataset:{action:'open-group-news'}})",context);
  assert.equal(vm.runInContext('state.groupNewsGroup',context),'');
  vm.runInContext("state.posts=Array.from({length:21},(_,i)=>entry('post-'+i,'photo',i))",context);
  assert.match(vm.runInContext('renderGroupNews()',context),/more-group-news/);
  await vm.runInContext("onAction({dataset:{action:'more-group-news'}})",context);
  assert.match(vm.runInContext('renderGroupNews()',context),/data-id="post-0"/);
  assert.doesNotMatch(vm.runInContext('renderGroupNews()',context),/more-group-news/);
  vm.runInContext("state.groups=[]",context);
  assert.equal(vm.runInContext('renderGroupNews(true)',context),'');
});

test('video transcript reads the caption track without playing, and timestamps seek the player', async () => {
  const context=appContext();
  vm.runInContext(`
    const cues=[
      {startTime:5.25,getCueAsHTML:()=>({textContent:'Primeiro trecho <exemplo>'})},
      {startTime:3661,getCueAsHTML:()=>({textContent:'Último trecho'})}
    ];
    const track={mode:'disabled',cues};
    const video={paused:true,currentTime:0,querySelector:()=>({track}),focus(){this.focused=true;}};
    const transcript={hidden:true};
    const status={textContent:''};
    const panel={querySelector:selector=>({'[data-video-transcript]':transcript,'[data-transcript-status]':status,video}[selector])};
    const toggle={parentElement:panel,dataset:{},setAttribute(_name,value){this.expanded=value;}};
    const marker={closest:()=>panel,dataset:{time:'5.25'}};
  `,context);
  await vm.runInContext('toggleVideoTranscript(toggle)',context);
  const html=vm.runInContext('transcript.innerHTML',context);
  assert.match(html,/data-time="5.25" aria-label="Ir para 00:05 no vídeo"/);
  assert.match(html,/Primeiro trecho &lt;exemplo&gt;/);
  assert.match(html,/1:01:01/);
  assert.equal(vm.runInContext('toggle.expanded',context),'true');
  assert.equal(vm.runInContext('track.mode',context),'hidden');
  vm.runInContext('seekVideoTranscript(marker)',context);
  assert.equal(vm.runInContext('video.currentTime',context),5.25);
  assert.equal(vm.runInContext('video.paused && video.focused',context),true);
  await vm.runInContext('toggleVideoTranscript(toggle)',context);
  assert.equal(vm.runInContext('transcript.hidden',context),true);
  assert.equal(vm.runInContext('toggle.expanded',context),'false');
  vm.runInContext('video.error=true',context);
  await vm.runInContext('toggleVideoTranscript(toggle)',context);
  assert.doesNotMatch(vm.runInContext('transcript.innerHTML',context),/seek-video-transcript/);
});

test('shared media renders direct HTTPS images and videos and survives a media-only draft', () => {
  const context=appContext(),stored=new Map();
  context.localStorage={getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,value)};
  const html=vm.runInContext(`
    state.user={uid:'reader'};state.modal='compose';
    const media={photoUrl:'https://example.test/photo.jpg',videoUrl:'https://example.test/video.mp4'};
    savePostDraft({dataset:{draftKey:postDraftKey()},elements:{
      content:{value:''},hobby:{value:'Arte'},format:{value:''},photoUrl:{value:media.photoUrl},videoUrl:{value:media.videoUrl},
      photoDescription:{value:'Lua crescente'},videoDescription:{value:'Como localizar a Lua'},
      captionsUrl:{value:'https://example.test/legendas.vtt'}
    }});
    renderProfileMedia(media)+renderSharedMedia(readPostDraft(postDraftKey()),'na publicação');
  `,context);
  assert.equal((html.match(/<img src="https:\/\/example\.test\/photo\.jpg"/g)||[]).length,2);
  assert.equal((html.match(/<video src="https:\/\/example\.test\/video\.mp4" controls playsinline/g)||[]).length,2);
  assert.match(html,/alt="Lua crescente"/);
  assert.match(html,/Resumo do vídeo: Como localizar a Lua/);
  assert.match(html,/data-url="https:\/\/example\.test\/legendas\.vtt"/);
  assert.equal(vm.runInContext("renderSharedMedia({photoUrl:'https://user:pass@example.test/photo.jpg',videoUrl:'javascript:alert(1)'},'na publicação')",context),'');
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
