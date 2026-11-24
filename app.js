/* HobbyHub 2.0 — frontend para GitHub Pages + Firebase.
   Credenciais Firebase abaixo são identificadores públicos do projeto, NÃO senhas.
   A segurança depende das regras em firestore.rules, publicadas no Console Firebase. */
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyD2evGU9oz4NvGIH4NllIfaVipFltt8f0Q',
  authDomain: 'hubbyhub-98c71.firebaseapp.com',
  projectId: 'hubbyhub-98c71',
  storageBucket: 'hubbyhub-98c71.firebasestorage.app',
  messagingSenderId: '97040838158',
  appId: '1:97040838158:web:47070af0ff42a9817fd65f'
};
const PROJECT = 'hubbyhub-98c71';
const BASE = ['artifacts', PROJECT, 'public', 'data'];
const TOPICS = [
  {name:'Fotografia',emoji:'📸',color:'pink'}, {name:'Música',emoji:'🎵',color:'orange'},
  {name:'Arte',emoji:'🎨',color:'pink'}, {name:'Games',emoji:'🎮',color:'green'},
  {name:'Tecnologia',emoji:'💻',color:'green'}, {name:'Leitura',emoji:'📚',color:'orange'},
  {name:'Gastronomia',emoji:'🍳',color:'orange'}, {name:'Esportes',emoji:'🏃',color:'green'},
  {name:'Viagens',emoji:'✈️',color:'pink'}, {name:'Natureza',emoji:'🌿',color:'green'},
  {name:'Bem-estar',emoji:'🧘',color:'pink'}, {name:'Outros',emoji:'✨',color:'pink'}
];
const ICONS = {
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-8h6v8"/>',
  compass:'<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.4 6-6 2.4 2.4-6z"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  chat:'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3H13a8.5 8.5 0 0 1 8 8z"/>',
  bookmark:'<path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  heart:'<path d="M20.8 4.6a5.6 5.6 0 0 0-7.9 0L12 5.5l-.9-.9a5.6 5.6 0 0 0-7.9 7.9L12 21l8.8-8.5a5.6 5.6 0 0 0 0-7.9z"/>',
  send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  map:'<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0"/><circle cx="12" cy="10" r="2.5"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  moon:'<path d="M20.9 13a9 9 0 0 1-9.9-9.9A9 9 0 1 0 20.9 13"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  arrow:'<path d="m5 12 14 0M13 6l6 6-6 6"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6M10 10v7M14 10v7"/>',
  spark:'<path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9zM20 19v4M18 21h4"/>',
  lock:'<rect x="4" y="11" width="16" height="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v5M12 8h.01"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>'
};
const icon = (name) => `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.spark}</svg>`;
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const norm = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
const emoji = (topic) => TOPICS.find((t) => t.name === topic)?.emoji || '✨';
const topicColor = (topic) => TOPICS.find((t) => t.name === topic)?.color || 'pink';
const short = (text,max=105) => { const str=String(text ?? ''); return str.length>max?`${str.slice(0,max).trim()}…`:str; };
const when = (value) => { const n=typeof value==='number'?value:0; if(!n)return 'Agora'; const d=Math.max(0,Date.now()-n); if(d<60000)return 'Agora'; if(d<3600000)return `${Math.floor(d/60000)} min`; if(d<86400000)return `${Math.floor(d/3600000)} h`; return new Date(n).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}); };
const dateLabel = (day) => {if(!day)return 'A combinar';const d=new Date(`${day}T12:00:00`);return Number.isNaN(d.getTime())? 'A combinar':d.toLocaleDateString('pt-BR',{day:'2-digit',month:'short'});};
const now = () => Date.now();
const state = {
  boot:true, initError:'', user:null, profile:null, members:[], posts:[], groups:[], events:[], messages:[],
  threads:[], directMessages:[], comments:[], savedIds:[], savedEventDates:new Map(), followingIds:[], blockedIds:[], receivedTestimonials:[], visibleTestimonials:[], sentTestimonial:null, testimonialStatus:'',
  tab:'home', feed:'all', topic:'Todos', groupView:'mine', groupHobby:'', groupCity:'', eventFilter:'upcoming', search:'', exploreCity:'', exploreHobby:'',
  exploreView:'people', postSearchHobby:'', postSearchGroup:'', postSearchLimit:20,
  eventSearch:'', eventHobby:'', eventCommunity:'', eventFormat:'', eventRoom:null, homeEventRooms:new Map(),
  eventAgendaView:'list', eventWeekOffset:0,
  chatMode:'community', chatTarget:null, selectedPost:null, postEditor:null, commentEditor:null, selectedGroup:null, composingGroup:null, viewUser:null,
  modal:null, modalReturnFocus:null, authMode:'login', busy:false, openingDirect:false, updatingFollow:false, updatingBlock:false, updatingGroup:false, alerts:[], quizMood:null,
  reportTarget:null,
  groupsLoaded:false,
  eventGroupId:null, eventTemplate:null, selectedEvent:null, eventsLoaded:false, eventConflict:null,
  eventReads:new Map(), eventReadsLoaded:false,
  personalHistory:{records:new Map(),loading:false,error:false},
  eventOfferTimer:null, eventReminderTimer:null, eventBulletins:new Map(), eventCheckins:null,
  eventFeedback:null, eventDiscussion:null, eventAnswerId:null,
  groupRoles:new Map(), moderationSelection:null,
  groupRemoval:null, moderationHistory:null,
  moderationQueue:null, groupPolls:null, pollDetail:null,
  pollWatches:new Map(), pollNoticeTimer:null,
  notifications:[], notificationSettings:{}, notificationSettingsLoaded:false, reportNotices:new Map(), reportNoticeUnsubs:new Map(), notificationReads:new Set(),
  mutedCommunityIds:new Set(), mutedCommunitiesLoaded:false,
  notificationFilter:'all', notificationReadSync:null, feedbackAdmin:false, feedbackAdminRole:null, productFeedbackQueue:null,
  myProductFeedback:null, selectedFeedbackId:null, feedbackSupplements:null,
  invitedGroupId:null, composingIntroduction:false, composingRecapId:null, pendingPostDraft:null, welcomePending:false, welcomeHobby:'',
  latestInboundAt:new Map(), privateReadAt:new Map(), inboundUnsubs:new Map(), pendingReads:new Set(),
  dark:localStorage.getItem('hobbyhub-theme')==='dark', pendingSignup:null,
  sessionUnsubs:[], messageUnsub:null, commentUnsub:null, drafts:new Map()
};
let firebase = null; let auth = null; let db = null; let toastTimer = null;
const root = () => document.getElementById('app');
const col = (...segments) => firebase.collection(db,...BASE,...segments);
const ref = (...segments) => firebase.doc(db,...BASE,...segments);
const memberRef = (uid) => ref('members',uid);
const legacyProfileRef = (uid) => firebase.doc(db,'artifacts',PROJECT,'users',uid,'profile','data');
const dmRef = (threadId) => firebase.doc(db,'artifacts',PROJECT,'dm_threads',threadId);
const directMessagesCol = (id) => firebase.collection(db,'artifacts',PROJECT,'dm_threads',id,'messages');
const threadId = (a,b) => [a,b].sort().join('_');
const me = () => state.user?.uid || '';
const myName = () => state.profile?.name || 'Pessoa do HobbyHub';
const myLocation = () => state.profile?.location || 'Brasil';
// A cidade pode ter um estado/UF depois de vírgula ou hífen.
const cityKey = (location) => norm(String(location ?? '').split(/\s+[-–]\s+|,/)[0]);
const locate = (location) => Boolean(cityKey(location)) && cityKey(location) === cityKey(myLocation());
const member = (uid) => state.members.find((p) => p.uid===uid);
const authorName = (record) => member(record.userId || record.senderId)?.name || record.userName || record.senderName || 'Pessoa da comunidade';
function showToast(message, error=false) {const n=document.getElementById('toast');n.textContent=message;n.className=`toast show ${error?'error':''}`;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{n.className='toast';},4000);}
function friendlyError(error) {
  const key = error?.code || '';
  const labels = {
    'auth/email-already-in-use':'Esse e-mail já possui uma conta.',
    'auth/invalid-email':'Digite um e-mail válido.',
    'auth/weak-password':'Sua senha precisa ser mais forte (mínimo de 6 caracteres).',
    'auth/invalid-credential':'E-mail ou senha incorretos.',
    'auth/too-many-requests':'Muitas tentativas. Aguarde antes de tentar novamente.',
    'auth/network-request-failed':'Sem conexão. Confira sua internet.',
    'permission-denied':'Acesso não permitido. Confira se as regras do Firestore foram publicadas.',
    'unavailable':'O serviço está indisponível ou você está offline.'
  };
  return labels[key] || `Não foi possível concluir. ${error?.message ? String(error.message).slice(0,100):'Tente novamente.'}`;
}
async function attempt(callback, pending='busy', permissionMessage) {
  if(state[pending])return;
  state[pending]=true;
  try {await callback();}
  catch(error) {console.error('HobbyHub:',error);showToast(error?.code==='permission-denied'&&permissionMessage?permissionMessage:friendlyError(error),true);}
  finally {state[pending]=false;render();}
}
function unsubscribeAll() {
 for(const unsub of state.sessionUnsubs.splice(0))try{unsub();}catch{}
 for(const unsubscribe of state.inboundUnsubs.values())unsubscribe();
 state.inboundUnsubs.clear();
 for(const unsubscribe of state.reportNoticeUnsubs.values())unsubscribe();
 state.reportNoticeUnsubs.clear();state.reportNotices.clear();
 for(const watch of state.pollWatches.values())watch.unsubscribe();
 state.pollWatches.clear();clearTimeout(state.pollNoticeTimer);clearTimeout(state.eventOfferTimer);clearTimeout(state.eventReminderTimer);
 for(const watch of state.eventBulletins.values())watch.unsubscribe();
 state.eventBulletins.clear();
 if(state.messageUnsub){state.messageUnsub();state.messageUnsub=null;}
 if(state.commentUnsub){state.commentUnsub();state.commentUnsub=null;}
}
function subscribe(reference, setter, label) {
  const unsub=firebase.onSnapshot(reference,(snap)=>{setter(snap);render();},(error)=>{console.error('HobbyHub listener:',label,error);state.alerts=[...new Set([...state.alerts,`Não foi possível carregar ${label}: ${friendlyError(error)}`])];render();});
  state.sessionUnsubs.push(unsub);
}
function watchLatestIncomingMessages() {
 const uid=me();
 const activeIds=new Set(state.threads.map(thread=>thread.id));
 for(const [id,unsubscribe] of state.inboundUnsubs){
   if(activeIds.has(id))continue;
   unsubscribe();
   state.inboundUnsubs.delete(id);
   state.latestInboundAt.delete(id);
 }
 for(const thread of state.threads){
   const peer=thread.participants?.find(id=>id!==uid);
   if(!peer||state.inboundUnsubs.has(thread.id))continue;
   const latest=firebase.query(directMessagesCol(thread.id),firebase.where('senderId','==',peer),firebase.orderBy('createdAt','desc'),firebase.limit(1));
   const unsubscribe=firebase.onSnapshot(latest,snapshot=>{
     if(me()!==uid)return;
     state.latestInboundAt.set(thread.id,snapshot.docs[0]?.data().createdAt||0);
     render();
   },error=>console.error('Indicador de mensagens:',error));
   state.inboundUnsubs.set(thread.id,unsubscribe);
 }
}
function unreadThread(id) {
 return (state.latestInboundAt.get(id)||0)>(state.privateReadAt.get(id)||0);
}
async function markOpenConversationRead() {
 const uid=me(),peer=state.chatTarget?.uid;
 if(!uid||!peer||state.chatMode!=='direct'||state.tab!=='messages'||state.modal||document.visibilityState!=='visible')return;
 const id=threadId(uid,peer);
 const lastReadAt=state.directMessages.reduce((latest,message)=>message.senderId!==uid?Math.max(latest,message.createdAt||0):latest,0);
 const pending=state.pendingReads;
 if(lastReadAt<=(state.privateReadAt.get(id)||0)||pending.has(id))return;
 pending.add(id);
 try {
   const marker=ref('members',uid,'privateReads',id);
   const saved=await firebase.runTransaction(db,async tx=>{
     const snapshot=await tx.get(marker);
     const previous=snapshot.data()?.lastReadAt||0;
     if(lastReadAt>previous)tx.set(marker,{lastReadAt});
     return Math.max(lastReadAt,previous);
   });
   if(me()!==uid||state.pendingReads!==pending)return;
   state.privateReadAt.set(id,Math.max(saved,state.privateReadAt.get(id)||0));
   render();
 }catch(error){
   console.error('Marcar conversa como lida:',error);
   return;
 }finally{
   pending.delete(id);
 }
 if(me()===uid&&state.pendingReads===pending)void markOpenConversationRead();
}
async function ensureMember(user) {
  const target=memberRef(user.uid);
  const snap=await firebase.getDoc(target);
  if(snap.exists())return {...snap.data(),uid:user.uid};
  let older=null;
  try {const prior=await firebase.getDoc(legacyProfileRef(user.uid));if(prior.exists())older=prior.data();}catch(error){console.warn('Não foi possível migrar o perfil antigo:',error?.code);}
  const pending=state.pendingSignup;
  const profile={
    uid:user.uid, name:String(pending?.name || older?.name || user.displayName || user.email?.split('@')[0] || 'Novo membro').slice(0,60),
    avatar:String(older?.avatar || '🌟').slice(0,8),location:String(pending?.location || older?.location || 'Brasil').slice(0,90),
    bio:String(pending?'Cheguei ao HobbyHub para descobrir novas paixões!':(older?.bio || 'Explorando novas paixões no HobbyHub!')).slice(0,300),
    hobbies:Array.isArray(older?.hobbies)?older.hobbies:[],joinedAt:now()
  };
  await firebase.setDoc(target,profile);
  state.pendingSignup=null;
  return profile;
}
function startSession() {
  const docs=(snapshot)=>snapshot.docs.map((d)=>({...d.data(),id:d.id}));
  subscribe(col('members'), (s)=>{state.members=docs(s);state.profile=state.members.find((p)=>p.uid===me()) || state.profile;},'membros');
  subscribe(col('posts'), (s)=>{
    state.posts=docs(s).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    queueMicrotask(openLinkedContent);
  },'publicações');
  subscribe(col('groups'), (s)=>{
    state.groups=docs(s).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    state.groupsLoaded=true;
    watchReportNotices();watchPollNotices();
    queueMicrotask(openLinkedContent);
  },'comunidades');
  subscribe(col('events'), (s)=>{
    state.events=docs(s).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));
    state.eventsLoaded=true;scheduleEventOffers();scheduleEventReminderRefresh();watchEventBulletins();void loadPersonalHistory();void loadEventRoom();loadHomeEventRooms();queueMicrotask(openLinkedContent);
  },'eventos');
  subscribe(col('messages'), (s)=>{state.messages=docs(s).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));},'chat da comunidade');
  subscribe(firebase.query(firebase.collection(db,'artifacts',PROJECT,'dm_threads'),firebase.where('participants','array-contains',me())),
    (s)=>{state.threads=docs(s).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));watchLatestIncomingMessages();},'conversas privadas');
  subscribe(col('members',me(),'privateReads'),snapshot=>{
    for(const doc of snapshot.docs)state.privateReadAt.set(doc.id,Math.max(doc.data().lastReadAt||0,state.privateReadAt.get(doc.id)||0));
  },'estado de leitura de mensagens');
  subscribe(col('members',me(),'saved'),(s)=>{state.savedIds=s.docs.map((d)=>d.id);},'itens salvos');
  subscribe(col('members',me(),'savedEvents'),snapshot=>{state.savedEventDates=new Map(snapshot.docs.map(doc=>[doc.id,doc.data().savedAt]));},'eventos salvos');
  subscribe(col('members',me(),'following'),(s)=>{state.followingIds=s.docs.map((d)=>d.id);},'pessoas seguidas');
  subscribe(col('members',me(),'blocked'),(s)=>{state.blockedIds=s.docs.map((d)=>d.id);},'pessoas bloqueadas');
  subscribe(col('members',me(),'moderation'),snapshot=>{
    state.groupRoles=new Map(snapshot.docs.map(doc=>[doc.id,doc.data().status]));
    watchReportNotices();
  },'convites de moderação');
  subscribe(firebase.query(col('members',me(),'notifications'),firebase.orderBy('createdAt','desc'),firebase.limit(50)),
    snapshot=>{state.notifications=docs(snapshot);},'notificações');
  subscribe(firebase.doc(db,'artifacts',PROJECT,'feedbackAdmins',me()),snapshot=>{
    state.feedbackAdminRole=snapshot.data()||null;
    updateFeedbackAdminAccess();
  },'acesso ao painel de feedback');
  subscribe(firebase.query(firebase.collection(db,'artifacts',PROJECT,'productFeedback'),firebase.where('authorId','==',me())),snapshot=>{
    state.myProductFeedback=docs(snapshot).sort((a,b)=>(b.createdAt?.toMillis()||0)-(a.createdAt?.toMillis()||0));
  },'seus feedbacks');
  const readSync=state.notificationReadSync;
  subscribe(ref('members',me(),'notificationReadState','main'),snapshot=>{
    if(state.notificationReadSync!==readSync)return;
    state.notificationReads=new Set(mergeNotificationReads(snapshot.data()?.keys,[...readSync.pending]));
  },'leitura dos avisos');
  void syncNotificationReads();
  subscribe(ref('members',me(),'notificationSettings','main'),snapshot=>{
    state.notificationSettings=snapshot.data()||{};state.notificationSettingsLoaded=true;
  },'preferências de notificações');
  subscribe(col('members',me(),'mutedCommunities'),snapshot=>{
    state.mutedCommunityIds=new Set(snapshot.docs.map(doc=>doc.id));state.mutedCommunitiesLoaded=true;
  },'comunidades silenciadas');
  subscribe(col('members',me(),'testimonials'),(s)=>{state.receivedTestimonials=docs(s);},'depoimentos');
  subscribe(col('members',me(),'eventReads'),snapshot=>{
    for(const doc of snapshot.docs){
      if(!doc.metadata.hasPendingWrites)state.eventReads.set(doc.id,Math.max(doc.data().revision||0,state.eventReads.get(doc.id)||0));
    }
    state.eventReadsLoaded=true;
  },'avisos de eventos');
}
async function init() {
  document.body.classList.toggle('dark',state.dark);
  render();
  try {
    const [appModule,authModule,storeModule]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js')
    ]);
    firebase={...appModule,...authModule,...storeModule};
    const app=firebase.initializeApp(FIREBASE_CONFIG);
    auth=firebase.getAuth(app);db=firebase.getFirestore(app);
    firebase.onAuthStateChanged(auth,async(user)=>{
      const justSignedUp=Boolean(user&&state.pendingSignup);
      unsubscribeAll();state.alerts=[];state.user=user;state.profile=null;
      state.posts=[];state.groups=[];state.events=[];state.members=[];state.messages=[];state.directMessages=[];
      state.threads=[];state.savedIds=[];state.savedEventDates.clear();state.followingIds=[];state.blockedIds=[];state.receivedTestimonials=[];state.visibleTestimonials=[];state.sentTestimonial=null;state.testimonialStatus='';state.selectedPost=null;state.postEditor=null;state.commentEditor=null;state.chatMode='community';state.chatTarget=null;state.modal=null;
      state.reportTarget=null;state.selectedGroup=null;state.groupsLoaded=false;state.modalReturnFocus=null;
      state.eventGroupId=null;state.eventTemplate=null;state.selectedEvent=null;state.eventsLoaded=false;state.eventConflict=null;
      state.eventFormat='';state.eventRoom=null;
      state.homeEventRooms.clear();
      state.exploreView='people';state.postSearchHobby='';state.postSearchGroup='';state.postSearchLimit=20;
      state.groupView='mine';state.groupHobby='';state.groupCity='';
      state.eventFilter='upcoming';state.eventSearch='';state.eventHobby='';state.eventCommunity='';
      state.eventAgendaView='list';state.eventWeekOffset=0;
      state.eventReads.clear();state.eventReadsLoaded=false;
      state.personalHistory={records:new Map(),loading:false,error:false};
      state.eventFeedback=null;state.eventDiscussion=null;state.eventAnswerId=null;state.eventCheckins=null;
      state.groupRoles.clear();state.moderationSelection=null;
      state.groupRemoval=null;state.moderationHistory=null;
      state.moderationQueue=null;state.notifications=[];state.notificationSettings={};state.notificationSettingsLoaded=false;state.groupPolls=null;state.pollDetail=null;
      state.mutedCommunityIds.clear();state.mutedCommunitiesLoaded=false;
      state.notificationFilter='all';state.feedbackAdmin=false;state.feedbackAdminRole=null;state.productFeedbackQueue=null;
      state.myProductFeedback=null;state.selectedFeedbackId=null;state.feedbackSupplements=null;
      state.notificationReadSync=user?{uid:user.uid,pending:new Set(readPendingNotifications(user.uid)),flushing:false}:null;
      state.notificationReads=new Set(state.notificationReadSync?.pending);
      state.invitedGroupId=null;state.composingIntroduction=false;state.composingRecapId=null;state.pendingPostDraft=null;state.welcomePending=justSignedUp;state.welcomeHobby='';
      state.latestInboundAt.clear();state.privateReadAt.clear();state.pendingReads=new Set();
      if(user){try{
        const profile=await ensureMember(user);
        if(me()!==user.uid)return;
        state.profile=profile;state.pendingSignup=null;startSession();
      }catch(error){console.error(error);state.alerts=[`Não foi possível abrir seu perfil: ${friendlyError(error)}`];}}
      state.boot=false;render();
    },(error)=>{state.boot=false;state.initError=friendlyError(error);render();});
  } catch(error) {console.error(error);state.boot=false;state.initError='Não foi possível conectar ao Firebase. Verifique sua internet e tente recarregar.';render();}
}
const nav = [
  ['home','Início','home'],['explore','Explorar','compass'],['groups','Comunidades','users'],
  ['events','Eventos','calendar'],['messages','Mensagens','chat'],['saved','Salvos','bookmark'],['profile','Meu perfil','user']
];
function brand() {return `<div class="brand"><span class="brand-symbol">✳</span><span>Hobby<small>Hub</small></span></div>`;}
function avatar(p,big=false) {return `<span class="avatar ${big?'big':''}" aria-hidden="true">${esc(p?.avatar || '🌟')}</span>`;}
function empty(ico,title,description,button='',action='compose') {return `<div class="card empty"><span class="empty-icon">${ico}</span><h3>${title}</h3><p>${description}</p>${button?`<button class="btn btn-soft btn-small" data-action="${esc(action)}">${esc(button)} ${icon('arrow')}</button>`:''}</div>`;}
function renderAuth() {
  const register=state.authMode==='register';
  const recovering=state.authMode==='reset';
  return `<div class="auth-shell"><section class="auth-visual">
    ${brand()}
    <div class="auth-text"><div class="eyebrow" style="color:#ffdc98">UMA COMUNIDADE PARA CHAMAR DE SUA</div>
    <h1>Encontre sua turma. <em>Viva suas paixões.</em></h1>
    <p>Fotografia, games, livros, música, natureza e tudo que faz seus olhos brilharem. Conheça pessoas que gostam do que você gosta.</p>
    <div class="pill" style="background:#ffffff24;color:white">✦ Uma rede feita para conexões reais</div></div>
    <div class="auth-decoration" aria-hidden="true"><div class="auth-bubble a"><span>📸</span> Fotógrafos</div><div class="auth-bubble b"><span>🎮</span> Gamers</div><div class="auth-bubble c"><span>📚</span> Leitores</div></div>
  </section><section class="auth-right"><div class="auth-box">
    <div class="eyebrow">BEM-VINDO AO HOBBYHUB</div>
    <h2>${recovering?'Recuperar acesso':register?'Crie seu espaço.':'Que bom ter você aqui!'}</h2>
    <p>${recovering?'Digite seu e-mail. Enviaremos um link para redefinir sua senha.':register?'Comece pelas coisas que te fazem feliz.':'Entre para reencontrar sua comunidade.'}</p>
    <form id="${recovering?'reset-form':'auth-form'}" data-draft="true" class="form-stack">
    ${register?`<div class="field"><label for="register-name">Seu nome</label><input class="input" id="register-name" name="name" maxlength="60" required autocomplete="name" placeholder="Como podemos chamar você?"></div>
    <div class="field"><label for="register-location">Sua cidade</label><input class="input" id="register-location" name="location" required maxlength="90" autocomplete="address-level2" placeholder="Ex.: Nova Friburgo"></div>`:''}
    <div class="field"><label for="auth-email">E-mail</label><input class="input" id="auth-email" type="email" name="email" required autocomplete="email" placeholder="seu@email.com"></div>
    ${recovering?'':`<div class="field"><label for="auth-password">Senha</label><input class="input" id="auth-password" name="password" type="password" minlength="6" required autocomplete="${register?'new-password':'current-password'}" placeholder="Mínimo de 6 caracteres"></div>`}
    <button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>${recovering?'Enviar link de recuperação':register?'Criar minha conta':'Entrar na comunidade'} ${icon('arrow')}</button>
    </form>
    ${!register&&!recovering?'<div class="auth-switch"><button data-action="forgot-password">Esqueci minha senha</button></div>':''}
    <div class="auth-switch">${recovering?'Lembrou da senha?':register?'Já tem uma conta?':'Ainda não faz parte?'} <button data-action="toggle-auth">${register||recovering?'Fazer login':'Cadastre-se grátis'}</button></div>
    <div class="auth-note">${icon('lock')} Seus dados são mantidos no Firebase. Nunca publique informações sensíveis em posts ou chats. A segurança depende das regras de acesso configuradas no projeto.</div>
    <div class="auth-switch"><button data-action="theme">${icon(state.dark?'sun':'moon')} ${state.dark?'Tema claro':'Tema escuro'}</button></div>
  </div></section></div>`;
}
function watchReportNotices() {
 const groups=state.groups.filter(canManageGroup);
 const activeIds=new Set(groups.map(group=>group.id));
 for(const [id,unsubscribe] of state.reportNoticeUnsubs){
   if(activeIds.has(id))continue;
   unsubscribe();state.reportNoticeUnsubs.delete(id);state.reportNotices.delete(id);
 }
 for(const {id} of groups){
   if(state.reportNoticeUnsubs.has(id))continue;
   const pending=firebase.query(col('groups',id,'reports'),firebase.where('status','==','pending'));
   const unsubscribe=firebase.onSnapshot(pending,snapshot=>{
     if(!state.reportNoticeUnsubs.has(id))return;
     state.reportNotices.set(id,snapshot.docs.map(doc=>({id:doc.id,createdAt:doc.data().createdAt})));
     render();
   },error=>{
     console.error('HobbyHub report notifications:',error);
     state.reportNoticeUnsubs.delete(id);state.reportNotices.delete(id);render();
   });
   state.reportNoticeUnsubs.set(id,unsubscribe);
 }
}
function watchPollNotices(){
 const uid=me(),joined=new Set(state.groups.filter(group=>group.members?.includes(uid)).map(group=>group.id));
 for(const [id,watch] of state.pollWatches){
   if(joined.has(id))continue;
   watch.unsubscribe();state.pollWatches.delete(id);
 }
 for(const id of joined){
   if(state.pollWatches.has(id))continue;
   const watch={polls:[],ballots:new Map()};
   state.pollWatches.set(id,watch);
   const recent=firebase.query(col('groups',id,'polls'),firebase.orderBy('createdAt','desc'),firebase.limit(12));
   watch.unsubscribe=firebase.onSnapshot(recent,snapshot=>{
     if(me()!==uid||state.pollWatches.get(id)!==watch)return;
     watch.polls=snapshot.docs.map(doc=>({...doc.data(),id:doc.id})).filter(poll=>poll.createdAt&&poll.endsAt);
     const active=new Set(watch.polls.map(poll=>poll.id));
     for(const key of watch.ballots.keys())if(!active.has(key))watch.ballots.delete(key);
     refreshPollNotices();render();
   },error=>{
     if(state.pollWatches.get(id)!==watch)return;
     console.error('HobbyHub poll notifications:',error);
     state.pollWatches.delete(id);refreshPollNotices();render();
   });
 }
 refreshPollNotices();
}
function refreshPollNotices(){
 clearTimeout(state.pollNoticeTimer);
 const uid=me(),moment=now();
 let next=Infinity;
 for(const [groupId,watch] of state.pollWatches){
   for(const poll of watch.polls){
     const deadline=poll.endsAt.toMillis();
     if(deadline>moment){next=Math.min(next,deadline);continue;}
     if(watch.ballots.has(poll.id))continue;
     watch.ballots.set(poll.id,null);
     const current=()=>me()===uid&&state.pollWatches.get(groupId)===watch&&watch.ballots.has(poll.id);
     firebase.getDocFromServer(ref('groups',groupId,'polls',poll.id,'votes',uid)).then(snapshot=>{
       if(!current())return;
       watch.ballots.set(poll.id,snapshot.exists());render();
     }).catch(error=>{
       if(!current())return;
       watch.ballots.delete(poll.id);
       console.error('HobbyHub poll ballot:',error);
     });
   }
 }
 if(Number.isFinite(next))state.pollNoticeTimer=setTimeout(()=>{refreshPollNotices();render();},Math.max(1,next-moment));
}
function notificationFields(type,postId='',commentId=''){
 return {type,actorId:me(),postId,commentId,createdAt:firebase.serverTimestamp()};
}
function notificationReadKey(uid){return 'hobbyhub-notification-reads:'+uid;}
function mergeNotificationReads(...lists){
 const keys=new Set(lists.flatMap(list=>Array.isArray(list)?list.filter(key=>typeof key==='string'&&key.length<=600):[]));
 const time=key=>Number(key.slice(key.lastIndexOf(':')+1))||0;
 return [...keys].sort((a,b)=>time(b)-time(a)).slice(0,500);
}
function readPendingNotifications(uid){
 try{return mergeNotificationReads(JSON.parse(localStorage.getItem(notificationReadKey(uid))||'[]'));}
 catch{return [];}
}
function persistPendingNotifications(sync){
 try{localStorage.setItem(notificationReadKey(sync.uid),JSON.stringify([...sync.pending]));}catch{}
}
async function syncNotificationReads(){
 const sync=state.notificationReadSync;
 if(!sync||sync.flushing||!sync.pending.size||me()!==sync.uid)return;
 const target=ref('members',sync.uid,'notificationReadState','main');
 sync.flushing=true;
 try{
   while(state.notificationReadSync===sync&&sync.pending.size){
     const pending=[...sync.pending];
     const merged=await firebase.runTransaction(db,async transaction=>{
       const remote=(await transaction.get(target)).data()?.keys;
       const keys=mergeNotificationReads(remote,pending);
       transaction.set(target,{keys});return keys;
     });
     if(state.notificationReadSync!==sync)return;
     const remaining=mergeNotificationReads(readPendingNotifications(sync.uid),[...sync.pending]).filter(key=>!pending.includes(key));
     sync.pending=new Set(remaining);
     persistPendingNotifications(sync);
     state.notificationReads=new Set(mergeNotificationReads([...state.notificationReads],merged,remaining));
     render();
   }
 }catch(error){console.error('HobbyHub notification read sync:',error);}
 finally{sync.flushing=false;}
}
const notificationCategories={
 polls:'Enquetes',
 bulletins:'Recados de eventos',
 savedEvents:'Mudanças em eventos salvos',
 interactions:'Seguidores, comentários e depoimentos'
};
const notificationCategoryByType=new Map([
 ['poll-open','polls'],['poll-result','polls'],['event-bulletin','bulletins'],
 ['saved-event-change','savedEvents'],['follow','interactions'],['comment','interactions'],['testimonial','interactions']
]);
const communityNoticeTypes=new Set(['poll-open','poll-result','event-bulletin','saved-event-change']);
const eventReminderOptions={eve:'Na véspera',day:'No dia',both:'Na véspera e no dia',off:'Desligados'};
function notificationItems(){
 const items=state.notifications.map(item=>({...item,key:item.id}));
 const date=new Date(),day=localDateKey(date),nextDay=tomorrow(date);
 const reminders=state.notificationSettings.eventReminders||'eve';
 const reminderTime=new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime();
 const latestNews=productNews[0];
 if(me()&&latestNews)items.push({
   type:'product-news',news:latestNews,key:'product-news:'+latestNews.id,createdAt:Date.parse(latestNews.date)
 });
 for(const item of state.myProductFeedback||[]){
   if(item.status==='resolved'&&item.reviewedAt)items.push({
     type:'feedback-resolved',feedbackId:item.id,key:'feedback-resolved:'+item.id,createdAt:item.reviewedAt,hasResolution:!!item.resolution
   });
   if(item.status==='in-review'&&item.resolutionChoice==='needs-help'&&item.reviewedAt)items.push({
     type:'feedback-resumed',feedbackId:item.id,key:'feedback-resumed:'+item.id,createdAt:item.reviewedAt
   });
 }
 for(const item of state.receivedTestimonials)items.push({type:'testimonial',actorId:item.id,key:'testimonial-'+item.id,createdAt:item.createdAt});
 for(const group of state.groups.filter(canManageGroup)){
   for(const item of state.reportNotices.get(group.id)||[])items.push({
     type:'report',groupId:group.id,key:'report-'+group.id+':'+item.id,createdAt:item.createdAt
   });
 }
 for(const event of state.events){
   const onDay=(reminders==='day'||reminders==='both')&&isConfirmedEventOn(event,day);
   const onEve=(reminders==='eve'||reminders==='both')&&isConfirmedEventOn(event,nextDay);
   if(onDay||onEve)items.push({
     type:'event-reminder',eventId:event.id,eventTitle:event.title,eventTime:viewerEventSchedule(event).time,
     onDay,key:(onDay?'event-reminder-today:':'event-reminder:')+event.id,createdAt:reminderTime
   });
   const savedAt=state.savedEventDates.get(event.id)?.toMillis?.();
   const changedAt=event.scheduleChangedAt?.toMillis?.();
   const confirmedCancellation=event.cancelled===true&&event.attendees?.includes(me())&&event.createdBy!==me();
   if(confirmedCancellation&&Number.isFinite(changedAt))items.push({
     type:'confirmed-event-cancellation',eventId:event.id,event,key:'confirmed-event-cancellation:'+event.id+':'+event.revision,createdAt:changedAt
   });
   else if(changedAt>savedAt&&event.createdBy!==me())items.push({
     type:'saved-event-change',eventId:event.id,groupId:event.groupId,event,key:'saved-event-change:'+event.id+':'+event.revision,createdAt:changedAt
   });
   if(canReadEventBulletins(event)&&event.createdBy!==me()){
     for(const item of state.eventBulletins.get(event.id)?.entries||[])items.push({
       type:'event-bulletin',eventId:event.id,groupId:event.groupId,bulletinId:item.id,key:'event-bulletin:'+event.id+':'+item.id,
       actorId:event.createdBy,createdAt:item.createdAt
     });
   }
   const deadline=eventSeatOffer(event);
   if(deadline&&(!event.groupId||pollMember(event.groupId)))items.push({
     type:'event-seat',eventId:event.id,key:'event-seat:'+event.id,createdAt:deadline-EVENT_OFFER_MS
   });
 }
 for(const [groupId,watch] of state.pollWatches){
   if(!pollMember(groupId))continue;
   for(const poll of watch.polls){
     const base={groupId,poll,actorId:poll.createdBy};
     if(!pollClosed(poll))items.push({...base,type:'poll-open',key:'poll-open:'+groupId+':'+poll.id,createdAt:poll.createdAt});
     else if(watch.ballots.get(poll.id))items.push({...base,type:'poll-result',key:'poll-result:'+groupId+':'+poll.id,createdAt:poll.endsAt});
   }
 }
 return items.filter(item=>!state.blockedIds.includes(item.actorId)
   && state.notificationSettings[notificationCategoryByType.get(item.type)]!==false
   && !(communityNoticeTypes.has(item.type)&&state.mutedCommunityIds.has(item.groupId)))
   .map(item=>{
     const time=typeof item.createdAt==='number'?item.createdAt:item.createdAt?.toMillis?.();
     return {...item,time,readKey:item.type==='event-reminder'?item.key:item.key+':'+time};
   }).filter(item=>Number.isFinite(item.time))
   .sort((a,b)=>b.time-a.time).slice(0,50);
}
function markNotificationsRead(items){
 const keys=items.map(item=>item.readKey);
 state.notificationReads=new Set(mergeNotificationReads([...state.notificationReads],keys));
 const sync=state.notificationReadSync;
 if(!sync||!keys.length)return;
 sync.pending=new Set(mergeNotificationReads(readPendingNotifications(sync.uid),[...sync.pending],keys));
 persistPendingNotifications(sync);
 void syncNotificationReads();
}
function notificationButton(mobile=false){
 const count=notificationItems().filter(item=>!state.notificationReads.has(item.readKey)).length;
 const badge=count?`<span class="unread-count" aria-hidden="true">${count}</span>`:'';
 return `<button class="${mobile?'circle-btn':'nav-btn'}" data-action="notifications" title="Notificações" aria-label="Notificações${count?', '+count+' não lidas':''}">${icon('bell')}${mobile?'':'<span>Notificações</span>'}${badge}</button>`;
}
function renderNotifications(){
 const items=notificationItems();
 const unread=items.filter(item=>!state.notificationReads.has(item.readKey));
 const filter=state.notificationFilter;
 const list=(filter==='unread'?unread:items).map(item=>{
   const isUnread=!state.notificationReads.has(item.readKey);
   const actor=member(item.actorId)?.name||'Alguém';
   const group=state.groups.find(group=>group.id===item.groupId);
   const message={
     follow:actor+' começou a seguir você.',
     comment:actor+' comentou na sua publicação.',
     testimonial:actor+' enviou um depoimento para você.',
     report:'Nova denúncia em '+(group?.name||'uma comunidade')+'.',
     'poll-open':'Nova enquete em '+group?.name+' · '+item.poll?.question,
     'poll-result':'Resultado da enquete em '+group?.name+' · '+item.poll?.question,
     'event-bulletin':'Recado do organizador · '+(state.events.find(event=>event.id===item.eventId)?.title||'Evento'),
     'event-seat':'Uma vaga está reservada para você · '+(state.events.find(event=>event.id===item.eventId)?.title||'Evento'),
     'event-reminder':(item.onDay?'Hoje: ':'Amanhã: ')+item.eventTitle+(item.eventTime?' · às '+item.eventTime:''),
     'saved-event-change':(item.event?.cancelled===true?'Evento salvo cancelado · ':'Seu evento salvo mudou · ')+item.event?.title,
     'confirmed-event-cancellation':'Evento confirmado cancelado · '+item.event?.title,
     'feedback-resolved':'Seu feedback foi resolvido',
     'feedback-resumed':'A equipe retomou a análise do seu feedback',
     'product-news':item.news?.title,
     'event-answer':'Sua pergunta foi respondida · '+(state.events.find(event=>event.id===item.eventId)?.title||'Evento')
   }[item.type];
   const label={follow:'Abrir perfil',comment:'Abrir comentários',testimonial:'Ver depoimentos',report:'Abrir denúncias','poll-open':'Abrir enquete','poll-result':'Ver resultado','event-answer':'Ver resposta','event-seat':'Ver vaga','event-reminder':'Ver evento','event-bulletin':'Ler recado','saved-event-change':'Ver evento','confirmed-event-cancellation':'Ver evento','feedback-resolved':item.hasResolution?'Ver resposta':'Ver feedback','feedback-resumed':'Ver feedback','product-news':'Ver novidades'}[item.type];
   const changes=item.event?eventChangeDescriptions(item.event).map(change=>`<li>${esc(change)}</li>`).join(''):'';
   const date=item.type==='product-news'?productNewsDate.format(item.time):when(item.time);
   return `<div class="card" style="padding:12px"><p>${isUnread?'<strong>Novo · </strong>':''}${esc(message)}</p>${changes?`<ul class="mini" style="padding-left:20px">${changes}</ul>`:''}<div class="toggle-row" style="flex-wrap:wrap"><small>${date}</small><button class="text-action" data-action="open-notification" data-id="${esc(item.readKey)}">${label}</button>
   ${isUnread?`<button class="text-action" data-action="read-notification" data-id="${esc(item.readKey)}" aria-label="Marcar como lida: ${esc(message)}">Marcar como lida</button>`:''}</div></div>`;
 }).join('');
 const options=[['all','Todas'],['unread','Não lidas']].map(([id,label])=>
   `<button id="notification-filter-${id}" class="filter ${filter===id?'active':''}" data-action="notification-filter" data-value="${id}" aria-pressed="${filter===id}">${label}</button>`).join('');
 const emptyMessage=filter==='unread'?'Nenhuma notificação não lida.':'Nenhuma notificação por enquanto.';
 return modalWrap('Notificações',`<div class="form-stack"><button class="text-action" data-action="notification-settings">Configurar avisos</button>
 <div class="filters" role="group" aria-label="Filtrar notificações">${options}</div>
 ${unread.length?'<button class="btn btn-outline btn-small" data-action="read-notifications">Marcar todas como lidas</button>':''}
 ${list||`<p class="tip">${emptyMessage}</p>`}</div>`);
}
function renderNotificationSettings(){
 const groupNames=new Map(state.groups.map(group=>[group.id,group.name]));
 const muted=[...state.mutedCommunityIds].map(id=>({id,name:String(groupNames.get(id)||'Comunidade indisponível')}));
 muted.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
 const communities=muted.map(({id,name})=>`<div class="card toggle-row" style="padding:12px;justify-content:space-between;flex-wrap:wrap">
 <span>${esc(name)}</span><button class="text-action" data-action="restore-community-notices" data-id="${esc(id)}"
 aria-label="Reativar avisos de ${esc(name)}" ${state.busy?'disabled':''}>Reativar avisos</button></div>`).join('');
 return modalWrap('Configurar avisos',`<div class="form-stack">
 ${state.notificationSettingsLoaded?'':'<p class="tip" role="status">Carregando preferências…</p>'}
 ${Object.entries(notificationCategories).map(([id,label])=>{
   const enabled=state.notificationSettings[id]!==false;
   return `<button class="btn btn-outline" role="switch" aria-checked="${enabled}" aria-label="${esc(label)}"
   data-action="toggle-notification-setting" data-id="${id}" ${state.notificationSettingsLoaded?'':'disabled'}>${esc(label)} · ${enabled?'Ligado':'Desligado'}</button>`;
 }).join('')}
 <section class="form-stack" aria-label="Lembretes de eventos"><h3>Lembretes de eventos</h3>
 <div class="filters" role="group" aria-label="Quando receber lembretes de eventos">${Object.entries(eventReminderOptions).map(([value,label])=>{
   const selected=(state.notificationSettings.eventReminders||'eve')===value;
   return `<button class="filter ${selected?'active':''}" aria-pressed="${selected}" data-action="set-event-reminders" data-value="${value}" ${!state.notificationSettingsLoaded||state.busy?'disabled':''}>${label}</button>`;
 }).join('')}</div></section>
 <p class="tip">Reservas de vaga e cancelamentos de eventos com presença confirmada sempre aparecem no sino.</p>
 <section class="form-stack" aria-label="Comunidades silenciadas"><h3>Comunidades silenciadas</h3>
 ${!state.mutedCommunitiesLoaded?'<p class="tip">Carregando comunidades…</p>':communities||'<p class="tip">Você ainda não silenciou nenhuma comunidade.</p>'}</section>
 <button class="text-action" data-action="notifications">Voltar aos avisos</button></div>`);
}
function unreadBadge(tab) {
 const count=tab==='messages'?state.threads.filter(thread=>unreadThread(thread.id)).length:0;
 return count?`<span class="unread-count"><span aria-hidden="true">${count>99?'99+':count}</span><span class="sr-only">${count} ${count===1?'conversa não lida':'conversas não lidas'}</span></span>`:'';
}
function renderSidebar() {
  return `<aside class="sidebar">${brand()}<nav class="nav-items" aria-label="Menu principal">${nav.map(([tab,title,ico])=>`<button class="nav-btn ${state.tab===tab?'active':''}" data-action="tab" data-tab="${tab}">${icon(ico)} <span>${title}</span>${unreadBadge(tab)}</button>`).join('')}${notificationButton()}</nav>
  <div class="sidebar-cta"><button class="btn btn-primary" data-action="compose">${icon('plus')} Nova publicação</button></div>
  <div class="sidebar-footer"><button data-action="theme">${icon(state.dark?'sun':'moon')} ${state.dark?'Tema claro':'Tema escuro'}</button><p>Feito para viver mais daquilo que você ama. ✨</p><small>HobbyHub © ${new Date().getFullYear()}</small></div></aside>`;
}
function renderBottomNav(){
  const items=[['home','Início','home'],['explore','Explorar','compass'],['events','Eventos','calendar'],['compose','','plus'],['groups','Grupos','users'],['messages','Chat','chat'],['profile','Perfil','user']];
  return `<nav class="bottom-nav" aria-label="Navegação móvel">${items.map(([tab,title,ico])=>`<button data-action="${tab==='compose'?'compose':'tab'}" ${tab!=='compose'?`data-tab="${tab}"`:'aria-label="Criar publicação"'} ${state.tab===tab?'aria-current="page"':''} class="${state.tab===tab?'active':''} ${tab==='compose'?'add-nav':''}">${icon(ico)}${title?`<span>${title}</span>`:''}${unreadBadge(tab)}</button>`).join('')}</nav>`;
}
function titleBar() {
 const titles={home:['Seu cantinho no mundo','Descubra algo novo hoje.'],explore:['Explorar interesses','Encontre pessoas e ideias para compartilhar.'],groups:['Suas comunidades','Um lugar para cada paixão.'],events:['Encontros & experiências','Da conversa para a vida real.'],messages:['Mensagens','Boas conexões começam com uma conversa.'],saved:['Seus favoritos','Tudo o que vale revisitar.'],profile:['Seu perfil','Sua história começa com o que você ama.']};
 const [title,sub]=titles[state.tab]||titles.home;
 return `<div class="page-head"><div><h1>${title}</h1><p>${sub}</p></div><div class="page-actions"><label class="head-search">${icon('search')}<input id="global-search" aria-label="Pesquisar" placeholder="Buscar no HobbyHub..." value="${esc(state.search)}" data-live-search="true"></label><button class="circle-btn" data-action="theme" aria-label="Alterar tema">${icon(state.dark?'sun':'moon')}</button></div></div>`;
}
function renderRight() {
 const people=state.members.filter(p=>p.uid!==me()&&!state.followingIds.includes(p.uid)).slice(0,3);
 const groups=state.groups.filter(g=>!(g.members||[]).includes(me())).slice(0,2);
 return `<aside class="rightbar"><div class="card right-card"><div class="right-title"><h3>Pessoas para conhecer</h3><button data-action="tab" data-tab="explore">Ver todas</button></div>
 ${people.length?people.map(p=>`<div class="suggestion">${avatar(p)}<div style="min-width:0;flex:1"><div class="label">${esc(short(p.name,18))}</div><div class="sublabel">${esc(short(p.location,22))}</div></div><button class="btn btn-soft btn-small" data-action="follow" data-id="${esc(p.uid)}">${icon('plus')}</button></div>`).join(''):'<p class="tip">Convide seus amigos para fazer parte da primeira turma.</p>'}</div>
 <div class="right-promo"><span class="eyebrow" style="color:#703d37">DESAFIO DA SEMANA</span><h3>Experimente algo novo.</h3><p>Descubra um hobby que combina com você.</p><button data-action="quiz">Fazer descoberta ${icon('arrow')}</button></div>
 <div class="card right-card"><div class="right-title"><h3>Comunidades em destaque</h3><button data-action="discover-groups">Explorar</button></div>
 ${groups.length?groups.map(g=>`<div class="suggestion"><span class="avatar">${emoji(g.hobby)}</span><div style="min-width:0;flex:1"><div class="label">${esc(short(g.name,23))}</div><div class="sublabel">${(g.members||[]).length} membros</div></div></div>`).join(''):'<p class="tip">As primeiras comunidades estão esperando criadores.</p>'}</div>
 </aside>`;
}
function eventChangeDescriptions(event) {
 if(event.cancelled===true)return ['O evento foi cancelado pelo organizador.'];
 const previous=event.previousSchedule;
 if(previous?.revision!==event.revision)return ['Confira as informações atualizadas do evento.'];
 const formatDate=value=>String(value||'').split('-').reverse().join('/');
 const changes=[];
 const oldSchedule=viewerEventSchedule({...previous,timeZone:previous.timeZone??event.timeZone,endTime:previous.endTime??event.endTime});
 const schedule=viewerEventSchedule(event);
 if(oldSchedule.date!==schedule.date)changes.push(`Data alterada de ${formatDate(oldSchedule.date)} para ${formatDate(schedule.date)}.`);
 if(oldSchedule.time!==schedule.time)changes.push(`Horário alterado de ${oldSchedule.time} para ${schedule.time}.`);
 if((previous.timeZone??event.timeZone??'')!==(event.timeZone||''))changes.push('Fuso horário do encontro atualizado.');
 if(oldSchedule.endTime!==schedule.endTime||oldSchedule.endDate!==schedule.endDate&&schedule.endTime){
   changes.push(schedule.endTime?`Novo horário de término: ${schedule.endTime}.`:'Horário de término removido.');
 }
 if(previous.location!==event.location)changes.push(`Local alterado de ${previous.location} para ${event.location}.`);
 return changes.length?changes:['Confira as informações atualizadas do evento.'];
}
function renderEventNotices() {
 if(!state.eventReadsLoaded)return '';
 const notices=state.events.filter(event=>viewerEventSchedule(event).date>=today()&&event.attendees?.includes(me())&&event.revision>(state.eventReads.get(event.id)||0));
 if(!notices.length)return '';
 return `<section class="card" style="padding:16px;margin-bottom:16px" aria-label="Avisos dos seus eventos"><h2 style="font-size:16px;margin:0 0 8px">Avisos dos seus eventos</h2>
 <div class="form-stack">${notices.slice(0,3).map(event=>`<div><strong>${event.cancelled===true?'Evento cancelado':'O evento mudou'} · ${esc(event.title)}</strong><p class="mini">${esc(eventChangeDescriptions(event)[0])}</p><button class="text-action" data-action="view-event-notice" data-id="${esc(event.id)}">Ver aviso</button></div>`).join('')}</div></section>`;
}
function renderLayout() {
 if(!state.profile)return `<div class="splash"><span class="splash-mark">✳</span><h1>HobbyHub</h1><p>Preparando seu perfil...</p>${state.alerts.length?`<div class="error-banner">${esc(state.alerts[0])}</div><button data-action="logout" class="btn btn-outline">Sair da conta</button>`:''}</div>`;
 const content={home:renderHome,explore:renderExplore,groups:renderGroups,events:renderEvents,messages:renderMessages,saved:renderSaved,profile:renderProfile};
 return `<div class="layout">${renderSidebar()}<div class="main-column"><div class="mobile-header">${brand()}<div class="toggle-row">${notificationButton(true)}<button data-action="tab" data-tab="saved" class="circle-btn" aria-label="Salvos">${icon('bookmark')}</button><button data-action="theme" class="circle-btn" aria-label="Alternar tema">${icon(state.dark?'sun':'moon')}</button></div></div>
 ${state.alerts.length?`<div class="error-banner">${icon('info')} <span>${esc(state.alerts[0])}</span></div>`:''}
 ${titleBar()}<label class="mobile-search">${icon('search')}<input id="mobile-search" aria-label="Pesquisar no HobbyHub" placeholder="Buscar pessoas, grupos e publicações..." value="${esc(state.search)}" data-live-search="true"></label>${renderEventNotices()}${(content[state.tab]||renderHome)()}</div>${renderRight()}</div>${renderBottomNav()}${renderModal()}`;
}
function topicButtons(selected,action='topic') {return `<div class="topics" aria-label="Interesses">${[{name:'Todos',emoji:'✨'},...TOPICS].map(t=>`<button data-action="${action}" data-topic="${esc(t.name)}" class="topic ${selected===t.name?'active':''}"><span>${t.emoji}</span> ${esc(t.name)}</button>`).join('')}</div>`;}
function recapEventButton(post){
 const event=state.events.find(item=>item.id===post.eventRecapId&&item.groupId===post.groupId);
 return event?`<button class="text-action" data-action="view-event" data-id="${esc(event.id)}">Ver encontro</button>`:'';
}
function eventRecapButton(event){
 const post=state.posts.find(item=>item.eventRecapId===event.id&&item.groupId===event.groupId);
 return post?`<button class="btn btn-outline btn-small" data-action="comments" data-id="${esc(post.id)}">Ler relato</button>`:'';
}
function postOptionsButton(post){
 return me()&&post.userId===me()?`<button class="post-action" data-action="post-options" data-id="${esc(post.id)}" aria-label="Opções da publicação" aria-haspopup="dialog">⋯</button>`:'';
}
function editedPostLabel(post){
 return post.editedAt?'<small class="muted">Editado</small>':'';
}
function postCard(post) {
 const liked=Array.isArray(post.likes)&&post.likes.includes(me()),saved=state.savedIds.includes(post.id);
 const owner=post.userId===me(),author=authorName(post);
 return `<article class="card post"><div class="post-head">${avatar({avatar:member(post.userId)?.avatar || post.userAvatar})}
 <div class="author"><button data-action="person" data-id="${esc(post.userId)}">${esc(author)}</button><small>${icon('map')} ${esc(post.location||'Comunidade')} · ${when(post.createdAt)}</small></div>
 <span class="post-category">${emoji(post.hobby)} ${esc(post.hobby||'Interesses')}</span></div>
 ${post.groupId?`<button class="pill" style="margin-top:14px" data-action="view-group" data-id="${esc(post.groupId)}">${icon('users')} ${esc(short(state.groups.find(g=>g.id===post.groupId)?.name||'Comunidade',34))}</button>`:''}
 <div class="post-copy">${esc(post.content)}</div>${editedPostLabel(post)}
 ${recapEventButton(post)}
 ${post.format==='highlight'?`<div class="post-visual"><span class="emoji">${emoji(post.hobby)}</span><div><small>Uma paixão, mil possibilidades</small><br><strong>Compartilhe o que faz você feliz.</strong></div></div>`:''}
 <div class="post-stats"><span>${Array.isArray(post.likes)?post.likes.length:0} curtidas</span><span>${esc(post.location||'HobbyHub')}</span></div>
 <div class="post-actions"><button class="post-action ${liked?'liked':''}" data-action="like" data-id="${esc(post.id)}" aria-label="${liked?'Descurtir':'Curtir'}">${icon('heart')} ${liked?'Curtido':'Curtir'}</button>
 <button class="post-action" data-action="comments" data-id="${esc(post.id)}">${icon('chat')} ${state.tab==='explore'?'Abrir publicação':'Comentar'}</button>
 <button class="post-action ${saved?'bookmarked':''}" data-action="save" data-id="${esc(post.id)}">${icon('bookmark')} ${saved?'Salvo':'Salvar'}</button>
 <button class="post-action" data-action="share-post" data-id="${esc(post.id)}" aria-label="Compartilhar publicação">${icon('send')} Compartilhar</button>
 ${owner?postOptionsButton(post):`<button class="post-action" data-action="report-post" data-id="${esc(post.id)}" aria-label="Denunciar publicação" title="Denunciar">${icon('info')}</button>`}</div></article>`;
}
function filteredPosts(posts=state.posts) {
 let found=[...posts];
 if(state.feed==='local'&&state.tab==='home')found=found.filter(p=>locate(p.location));
 if(state.feed==='following'&&state.tab==='home')found=found.filter(p=>state.followingIds.includes(p.userId));
 if(state.topic!=='Todos'&&state.tab==='home')found=found.filter(p=>p.hobby===state.topic);
 const q=norm(state.search);if(q)found=found.filter(p=>norm([p.content,p.hobby,p.location,authorName(p)].join(' ')).includes(q));
 return found.slice(0,120);
}
function isConfirmedEventOn(event,day){
 return Boolean(me()&&event.cancelled!==true&&event.attendees?.includes(me())&&viewerEventSchedule(event).date===day);
}
function conflictingEvents(event){
 if(!hasCalendarSchedule(event)||!me())return [];
 const start=eventTimeInstant(event),end=eventTimeInstant(event,eventEndTime(event));
 return state.events.filter(other=>{
   if(other.id===event.id||other.cancelled===true||!other.attendees?.includes(me())||!hasCalendarSchedule(other))return false;
   const otherStart=eventTimeInstant(other),otherEnd=eventTimeInstant(other,eventEndTime(other));
   return start===otherStart||(otherStart>start&&otherStart<end)||(start>otherStart&&start<otherEnd);
 });
}
function leaveEventConflict(){
 const conflict=state.eventConflict;
 state.eventConflict=null;
 if(conflict?.fromDetail)openModal('event-detail');
 else closeModal();
}
function renderEventReminders(day=tomorrow()) {
 const events=state.events.filter(event=>isConfirmedEventOn(event,day))
  .sort((a,b)=>eventScheduleKey(a).localeCompare(eventScheduleKey(b)));
 if(!events.length)return '';
 return `<section class="card" style="padding:16px;margin-bottom:16px" aria-label="Lembretes dos seus eventos">
   <h2 style="font-size:16px;margin:0 0 8px">Seus eventos de amanhã</h2>
   <div class="form-stack">${events.map(event=>`<div>
     <strong>${esc(event.title)}</strong>
     <p class="mini">${eventTimeLabel(event)?`Às ${esc(eventTimeLabel(event))} · `:''}${eventFormat(event)==='online'?'Online':esc(event.location||'Local a combinar')}</p>
     <button class="text-action" data-action="view-event" data-id="${esc(event.id)}">Abrir evento</button>
   </div>`).join('')}</div>
 </section>`;
}
function confirmedEventsToday(date=new Date()){
 const day=localDateKey(date);
 return state.events.filter(event=>isConfirmedEventOn(event,day))
   .sort((a,b)=>eventScheduleKey(a).localeCompare(eventScheduleKey(b)));
}
function renderTodayEvents(date=new Date()){
 const events=confirmedEventsToday(date);
 if(!events.length)return '';
 const time=date.toTimeString().slice(0,5);
 const next=events.find(event=>viewerEventSchedule(event).time>=time);
 return `<section class="card form-stack" style="padding:16px;margin-bottom:16px" aria-label="Seus eventos de hoje">
 <h2 style="font-size:16px;margin:0">Seus eventos de hoje</h2>
 ${events.map(event=>`<article class="card form-stack" style="padding:12px">
 <div class="toggle-row" style="flex-wrap:wrap"><strong>${esc(event.title)}</strong>${event===next?'<span class="pill">Próximo encontro</span>':''}</div>
 <p class="mini">${eventTimeLabel(event)?`Às ${esc(eventTimeLabel(event))} · `:''}${eventFormat(event)==='online'?'Online':esc(event.location||'Local a combinar')}</p>
 <div class="toggle-row" style="flex-wrap:wrap"><button class="text-action" data-action="view-event" data-id="${esc(event.id)}">Ver evento</button>
 ${eventDirectionsLink(event)}${renderHomeEventRoom(event)}</div>
 </article>`).join('')}</section>`;
}
function renderHome() {
 const feed=filteredPosts();
 return `${renderTodayEvents()}${renderEventReminders()}<section class="hero"><span class="hero-overline">✦ CONECTE-SE PELO QUE VOCÊ AMA</span><h2>O próximo grande encontro começa com um interesse em comum.</h2><p>Encontre pessoas da sua cidade ou de qualquer lugar com as mesmas paixões que você.</p><button class="btn btn-white btn-small" data-action="tab" data-tab="explore">Explorar a comunidade ${icon('arrow')}</button></section>
 <div class="section-head"><h2>Explore seus interesses</h2><button class="text-action" data-action="quiz">Me surpreenda ${icon('spark')}</button></div>
 ${topicButtons(state.topic)}
 <div class="card composer-bar">${avatar(state.profile)}<button class="composer-prompt" data-action="compose">Qual hobby fez seu dia melhor hoje?</button><button class="circle-btn" data-action="compose" aria-label="Publicar">${icon('plus')}</button></div>
 <div class="section-head"><h2>Da nossa comunidade</h2><span class="pill">${feed.length} publicações</span></div>
 <div class="feed-tabs">${[['all','Para você'],['local',`Na minha cidade`],['following','Seguindo']].map(([v,label])=>`<button class="feed-tab ${state.feed===v?'active':''}" data-action="feed" data-value="${v}">${label}</button>`).join('')}</div>
 ${feed.length?feed.map(postCard).join(''):empty('🌱','Uma boa história começa aqui',state.feed==='local'?'Ainda não há publicações com o nome da sua cidade. Você pode inaugurar essa conversa.':state.feed==='following'?'Siga pessoas pela aba Explorar para ver o que elas compartilham.':'Nenhuma publicação encontrada. Faça parte do começo dessa comunidade.',state.feed==='following'?'Encontrar pessoas':'Publicar agora',state.feed==='following'?'explore':'compose')}`;
}
function personCard(p) {
 const followed=state.followingIds.includes(p.uid);
 const shared=(p.hobbies||[]).find(h=>(state.profile?.hobbies||[]).some(mine=>norm(mine)===norm(h)));
 return `<article class="card person-card">${avatar(p)}<div class="person-data"><h3><button class="text-action" data-action="person" data-id="${esc(p.uid)}">${esc(p.name)}</button></h3><p>${icon('map')} ${esc(p.location || 'Brasil')}</p><p>${esc(short(p.bio||'Uma pessoa apaixonada por hobbies.',60))}</p>${shared?`<p>Também gosta de ${esc(shared)}</p>`:''}${locate(p.location)?'<p>Da sua cidade</p>':''}</div><div style="display:grid;gap:6px"><button class="btn btn-small ${followed?'btn-outline':'btn-soft'}" data-action="follow" data-id="${esc(p.uid)}">${followed?'Seguindo':'+ Seguir'}</button><button class="btn btn-small btn-ghost" data-action="open-dm" data-id="${esc(p.uid)}">${icon('chat')} Conversar</button></div></article>`;
}
function searchOptions(values,selected){
 return [...values].sort((a,b)=>a[1].localeCompare(b[1],'pt-BR'))
   .map(([key,label])=>`<option value="${esc(key)}" ${selected===key?'selected':''}>${esc(label)}</option>`).join('');
}
function searchPublications(query,hobby='',groupId=''){
 const words=norm(query).trim().split(/\s+/).filter(Boolean);
 const groupNames=new Map(state.groups.map(group=>[group.id,group.name]));
 return state.posts.filter(post=>{
   if((hobby&&norm(post.hobby)!==hobby)||(groupId&&post.groupId!==groupId))return false;
   if(!words.length)return true;
   const searchable=norm([post.content,post.hobby,authorName(post),groupNames.get(post.groupId)].join(' '));
   return words.every(word=>searchable.includes(word));
 });
}
function renderPublicationSearch(){
 const hobbies=new Map(state.posts.filter(post=>typeof post.hobby==='string'&&norm(post.hobby)).map(post=>[norm(post.hobby),post.hobby]));
 const groups=new Map(state.groups.map(group=>[group.id,String(group.name||'Comunidade')]));
 const posts=searchPublications(state.search,state.postSearchHobby,state.postSearchGroup);
 const shown=posts.slice(0,state.postSearchLimit);
 return `<div class="field-grid" style="margin-bottom:14px">
 <label class="field">Hobby<select class="select" id="post-search-hobby"><option value="">Todos os hobbies</option>${searchOptions(hobbies,state.postSearchHobby)}</select></label>
 <label class="field">Comunidade<select class="select" id="post-search-group"><option value="">Todas as comunidades e o feed geral</option>${searchOptions(groups,state.postSearchGroup)}</select></label>
 </div>
 <div class="section-head"><h2>Publicações</h2><span role="status" class="pill">${posts.length} ${posts.length===1?'resultado':'resultados'}</span></div>
 ${shown.length?shown.map(postCard).join(''):empty('🔎','Nenhuma publicação encontrada','Tente outras palavras ou ajuste os filtros.')}
 ${posts.length>shown.length?'<button id="post-search-more" class="btn btn-outline" data-action="more-post-results">Mostrar mais publicações</button>':''}`;
}
function renderExplore() {
 const q=norm(state.search).trim();
 const header=`<div class="feed-tabs" role="group" aria-label="O que explorar">
 ${[['people','Pessoas e comunidades'],['posts','Publicações']].map(([view,label])=>`<button id="explore-view-${view}" class="feed-tab ${state.exploreView===view?'active':''}" aria-pressed="${state.exploreView===view}" data-action="explore-view" data-value="${view}">${label}</button>`).join('')}
 </div><div class="card" style="padding:18px;margin-bottom:17px"><label class="field" for="explore-search"><span class="mini muted">${state.exploreView==='posts'?'Buscar publicações':'Pesquise pessoas, grupos, hobbies e publicações'}</span><input id="explore-search" type="search" class="input" placeholder="${state.exploreView==='posts'?'Ex.: fotografia analógica':'Ex.: fotografia, Nova Friburgo, livros...'}" data-live-search="true" value="${esc(state.search)}"></label></div>`;
 if(state.exploreView==='posts')return header+renderPublicationSearch();
 const candidates=state.members.filter(p=>p.uid&&p.uid!==me());
 const hobbies=new Map(candidates.flatMap(p=>(Array.isArray(p.hobbies)?p.hobbies:[]).filter(h=>typeof h==='string'&&norm(h)).map(h=>[norm(h),h])));
 const cities=new Map(candidates.filter(p=>typeof p.location==='string'&&cityKey(p.location)).map(p=>[cityKey(p.location),p.location]));
 const people=candidates.filter(p=>(!state.exploreCity||cityKey(p.location)===state.exploreCity)
  && (!state.exploreHobby||(p.hobbies||[]).some(h=>norm(h)===state.exploreHobby))
  && (!q||norm([p.name,p.location,p.bio,(p.hobbies||[]).join(' ')].join(' ')).includes(q)));
 const groups=state.groups.filter(g=>!q||norm([g.name,g.hobby,g.location,g.description].join(' ')).includes(q));
 const posts=q?searchPublications(q).slice(0,10):[];
 return `${header}
 <div class="section-head"><h2>Pessoas com interesses parecidos</h2><span class="pill">${people.length} perfis</span></div>
 <div class="field-grid" style="margin-bottom:14px"><label class="field">Hobby<select class="select" id="explore-hobby"><option value="">Todos os hobbies</option>${searchOptions(hobbies,state.exploreHobby)}</select></label><label class="field">Cidade<select class="select" id="explore-city"><option value="">Todas as cidades</option>${searchOptions(cities,state.exploreCity)}</select></label></div>
 ${people.length?`<div style="display:grid;gap:10px">${people.slice(0,20).map(personCard).join('')}</div>`:empty('👋','Sua turma está chegando','Ainda não encontramos perfis com essa busca. Compartilhe o HobbyHub com seus amigos.')}
 <div class="section-head"><h2>Comunidades para explorar</h2><button class="text-action" data-action="discover-groups">Ver todas</button></div>
 ${groups.length?`<div class="grid-two">${groups.slice(0,4).map(group=>groupCard(group)).join('')}</div>`:empty('🪴','Nenhum grupo encontrado','Crie uma comunidade para reunir pessoas com esse interesse.','Criar grupo','group')}
 ${q?`<div class="section-head"><h2>Publicações encontradas</h2><button class="text-action" data-action="explore-view" data-value="posts">Ver busca de publicações</button></div>${posts.length?posts.map(postCard).join(''):empty('🔎','Nenhuma publicação','Tente outra palavra-chave para encontrar mais conteúdo.')}`:''}`;
}
function groupCard(g, activity) {
 const joined=(g.members||[]).includes(me());
 return `<article class="card community-card"><div class="cover ${topicColor(g.hobby)}"><span>${emoji(g.hobby)}</span></div>
 <div><span class="eyebrow">${esc(g.hobby||'Comunidade')}</span><h3 style="margin:6px 0"><button data-action="view-group" data-id="${esc(g.id)}" style="font-weight:800;text-align:left">${esc(g.name)} ${icon('arrow')}</button></h3><p class="card-desc">${esc(g.description||'Um espaço para compartilhar esse interesse.')}</p></div>
 ${joined&&state.groupRoles.get(g.id)==='pending'?'<span class="pill">Convite para moderar</span>':''}
 ${activity?.post?`<div><small class="muted">Publicação mais recente</small><br><button class="text-action" data-action="comments" data-id="${esc(activity.post.id)}">${esc(short(activity.post.content,75))}</button></div>`:''}
 ${activity?.event?`<div><small class="muted">Próximo evento · ${dateLabel(activity.event.date)} ${esc(activity.event.time||'')}</small><br><button class="text-action" data-action="view-event" data-id="${esc(activity.event.id)}">${esc(activity.event.title)}</button></div>`:''}
 <div class="card-bottom"><span class="card-meta">${icon('users')} ${(g.members||[]).length} membros<br>${esc(g.location||'Online')}</span>
 <button class="btn btn-small ${joined?'btn-outline':'btn-primary'}" data-action="join-group" data-id="${esc(g.id)}">${joined?'Participando':'+ Participar'}</button></div></article>`;
}
function groupHighlights(groups, now=new Date()) {
 const activity=new Map(groups.map(group=>[group.id,{}]));
 for(const post of state.posts){
   const entry=activity.get(post.groupId);
   if(entry&&(!entry.post||(post.createdAt||0)>(entry.post.createdAt||0)))entry.post=post;
 }
 const moment=`${localDateKey(now)} ${now.toTimeString().slice(0,5)}`;
 for(const event of state.events){
   const entry=activity.get(event.groupId);
   const schedule=`${event.date||''} ${event.time||''}`;
   if(!entry||event.cancelled===true||schedule<moment)continue;
   if(!entry.event||schedule<`${entry.event.date} ${entry.event.time||''}`)entry.event=event;
 }
 return activity;
}
function renderGroups(){
 const discovering=state.groupView==='discover',query=norm(state.search);
 const groups=state.groups.filter(group=>Boolean(group.members?.includes(me()))!==discovering);
 const hobbies=[...new Set(groups.map(group=>group.hobby).filter(hobby=>typeof hobby==='string'&&hobby))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 const cities=new Map(groups.filter(group=>typeof group.location==='string'&&cityKey(group.location)).map(group=>[cityKey(group.location),group.location]));
 const hobby=hobbies.includes(state.groupHobby)?state.groupHobby:'';
 const city=cities.has(state.groupCity)?state.groupCity:'';
 const list=groups.filter(group=>(!query||norm([group.name,group.hobby,group.description,group.location].join(' ')).includes(query))
   && (!discovering||((!hobby||group.hobby===hobby)&&(!city||cityKey(group.location)===city))));
 const activity=discovering?null:groupHighlights(list);
 return `<div class="card" style="padding:25px;margin-bottom:19px;background:linear-gradient(115deg,var(--panel),var(--purple2));display:flex;align-items:center;justify-content:space-between;gap:18px"><div><div class="eyebrow">O PODER DE FAZER JUNTO</div><h2 style="font-size:21px;margin:8px 0">Seu hobby merece uma comunidade.</h2><p class="muted mini" style="margin:0">Crie um grupo, faça novas amizades e inspire outras pessoas.</p></div><button class="btn btn-primary btn-small" data-action="group">${icon('plus')} Criar grupo</button></div>
 <div class="filters"><button class="filter ${!discovering?'active':''}" data-action="group-view" data-value="mine" aria-pressed="${!discovering}">Minhas comunidades</button><button class="filter ${discovering?'active':''}" data-action="group-view" data-value="discover" aria-pressed="${discovering}">Descobrir</button></div>
 ${discovering?`<div class="card field-grid" style="padding:16px;margin-bottom:16px"><label class="field">Hobby<select class="select" id="group-hobby"><option value="">Todos os hobbies</option>${hobbies.map(hobby=>`<option value="${esc(hobby)}" ${state.groupHobby===hobby?'selected':''}>${esc(hobby)}</option>`).join('')}</select></label><label class="field">Cidade<select class="select" id="group-city"><option value="">Todas as cidades</option>${[...cities].sort((a,b)=>a[1].localeCompare(b[1],'pt-BR')).map(([key,label])=>`<option value="${esc(key)}" ${state.groupCity===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label></div>`:''}
 <div class="section-head"><h2>${discovering?'Descubra comunidades':'Seus grupos'}</h2><span class="pill">${list.length} ${list.length===1?'grupo':'grupos'}</span></div>
 ${list.length?`<div class="grid-two">${list.map(group=>groupCard(group,activity?.get(group.id))).join('')}</div>`:discovering?empty('🧩','Nenhuma comunidade encontrada','Ajuste os filtros ou crie uma comunidade.','Criar uma comunidade','group'):empty('🧩',query?'Nenhuma comunidade encontrada':'Encontre seu primeiro grupo',query?'Mude os termos da busca.':'Descubra comunidades para participar.','Descobrir comunidades','discover-groups')}`;
}
const EVENT_OFFER_MS=3600000;
function eventSeatOffer(event,uid=me()){
 const start=event.offerAt?.toMillis?.();
 return event.cancelled!==true&&viewerEventSchedule(event).date>=today()&&event.waitlist?.[0]===uid
   && Number.isFinite(start)&&now()<start+EVENT_OFFER_MS?start+EVENT_OFFER_MS:null;
}
function scheduleEventOffers(){
 clearTimeout(state.eventOfferTimer);
 const uid=me();
 const offers=state.events.filter(event=>event.cancelled!==true&&viewerEventSchedule(event).date>=today()&&event.waitlist?.includes(uid)&&event.offerAt);
 if(!offers.length)return;
 const deadline=Math.min(...offers.map(event=>event.offerAt.toMillis()+EVENT_OFFER_MS));
 state.eventOfferTimer=setTimeout(async()=>{
   if(me()!==uid)return;
   const expired=offers.filter(event=>event.offerAt.toMillis()+EVENT_OFFER_MS<=now());
   await Promise.allSettled(expired.map(event=>changeEventSeat(event.id,'expire',uid)));
   if(me()===uid)render();
 },Math.max(2000,deadline-now()+1200));
}
async function changeEventSeat(id,intent,uid,confirmedConflict=false){
 const target=ref('events',id);
 return firebase.runTransaction(db,async transaction=>{
   const current=(await transaction.get(target)).data();
   if(!current||current.cancelled===true||viewerEventSchedule(current).date<today()||me()!==uid)return '';
   let {attendees,waitlist,capacity,offerAt}=current;
   const head=waitlist[0];
   const expired=offerAt&&offerAt.toMillis()+EVENT_OFFER_MS<=now();
   const changes={};
   let status='';
   if(expired&&intent!=='leave'&&intent!=='leave-queue'){
     waitlist=waitlist.slice(1);status='expired';
   }else if(intent==='expire')return '';
   else if(intent==='leave'&&attendees.includes(uid)){
     attendees=attendees.filter(person=>person!==uid);status='left';
   }else if(intent==='leave-queue'&&waitlist.includes(uid)){
     waitlist=waitlist.filter(person=>person!==uid);status='left-queue';
   }else if(intent==='join'&&!attendees.includes(uid)){
     if(attendees.length<capacity&&(!head||head===uid)){
       if(!confirmedConflict&&conflictingEvents({...current,id}).length)return 'conflict';
       attendees=[...attendees,uid];waitlist=waitlist.filter(person=>person!==uid);status='confirmed';
     }else if(confirmedConflict){
       return 'unavailable';
     }else if(!waitlist.includes(uid)){
       if(waitlist.length>=100)throw new Error('A lista de espera está cheia.');
       waitlist=[...waitlist,uid];status='queued';
     }
   }
   if(!status)return '';
   changes.attendees=attendees;changes.waitlist=waitlist;
   changes.offerAt=attendees.length<capacity&&waitlist.length
     ?(offerAt&&waitlist[0]===head?offerAt:firebase.serverTimestamp()):null;
   transaction.update(target,changes);
   return status;
 });
}
function eventFormat(event){
 if(event.format==='online'||event.format==='in-person')return event.format;
 const label=norm(event.location);
 return !label||/^(?:(?:evento|encontro) )?(?:on[- ]?line|virtual|remot[oa]|a distancia)\b/.test(label)||
   /^(?:zoom|google meet|microsoft teams|discord)(?:$|\s*[:–—-])/.test(label)||/https?:\/\/|^www\./i.test(label)?'online':'in-person';
}
function eventFormatOptions(format){
 return [['in-person','Presencial'],['online','Online']].map(([value,label])=>
   `<option value="${value}" ${format===value?'selected':''}>${label}</option>`).join('');
}
const eventTimeZones={
 'America/Sao_Paulo':'Brasília',
 'America/Manaus':'Manaus',
 'America/Rio_Branco':'Rio Branco',
 'America/Noronha':'Fernando de Noronha',
 UTC:'UTC'
};
const eventZoneFormatters=new Map();
function defaultEventTimeZone(){
 const zone=Intl.DateTimeFormat().resolvedOptions().timeZone;
 return Object.hasOwn(eventTimeZones,zone)?zone:'America/Sao_Paulo';
}
function eventZoneToday(zone){
 return Object.hasOwn(eventTimeZones,zone)?new Intl.DateTimeFormat('sv-SE',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format():today();
}
function eventFormatFields(format,location,roomUrl='',timeZone=''){
 const online=format==='online';
 return `<label class="field">Formato<select class="select" name="format" required>${eventFormatOptions(format)}</select></label>
 <div data-format-field="in-person" ${online?'hidden':''}><label class="field">Local presencial<input class="input" name="location" maxlength="120" value="${esc(location)}" placeholder="Ex.: Praça central, Nova Friburgo" ${online?'disabled':'required'}></label></div>
 <div data-format-field="online" ${online?'':'hidden'}><label class="field">Fuso horário do evento<select class="select" name="timeZone" ${online?'required':'disabled'}>${Object.entries(eventTimeZones).map(([zone,label])=>`<option value="${zone}" ${(timeZone||defaultEventTimeZone())===zone?'selected':''}>${label}</option>`).join('')}</select></label><label class="field">Link da sala online<input class="input" type="url" name="roomUrl" maxlength="2048" placeholder="https://" value="${esc(roomUrl)}" ${online?'required':'disabled'}></label><p class="tip">O link da sala fica disponível para quem confirmar presença.</p></div>`;
}
function syncEventFormatFields(form){
 form.querySelectorAll('[data-format-field]').forEach(section=>{
   const active=section.dataset.formatField===form.elements.format.value;
   section.hidden=!active;
   section.querySelectorAll('input,select').forEach(input=>{input.disabled=!active;input.required=active;});
 });
 const zone=form.elements.format.value==='online'?form.elements.timeZone.value:'';
 form.elements.date.min=eventZoneToday(zone);
}
function validEventRoomUrl(value){
 if(!/^https:\/\/[^\s]+$/.test(value)||value.length>2048)return false;
 try{const url=new URL(value);return Boolean(url.hostname&&!url.username&&!url.password);}
 catch{return false;}
}
function canReadEventRoom(event,uid=me()){
 return Boolean(uid&&event?.format==='online'&&event.cancelled!==true&&
   (event.createdBy===uid||event.attendees?.includes(uid)));
}
async function getEventRoomUrl(id){
 const snapshot=await firebase.getDoc(ref('events',id,'private','room'));
 const url=snapshot.data()?.url||'';
 return validEventRoomUrl(url)?url:'';
}
function loadHomeEventRooms(){
 if(state.tab!=='home')return;
 const uid=me(),rooms=state.homeEventRooms;
 const events=confirmedEventsToday().filter(event=>canReadEventRoom(event,uid));
 const active=new Set(events.map(event=>event.id));
 for(const id of rooms.keys())if(!active.has(id))rooms.delete(id);
 for(const event of events){
   const current=rooms.get(event.id);
   if(current&&current.revision===event.revision)continue;
   const room={revision:event.revision,url:''};
   rooms.set(event.id,room);
   void getEventRoomUrl(event.id).then(url=>{
     if(me()!==uid||rooms.get(event.id)!==room)return;
     room.url=url;
     if(state.tab==='home')render();
   }).catch(()=>{if(rooms.get(event.id)===room)rooms.delete(event.id);});
 }
}
function renderHomeEventRoom(event){
 const room=state.homeEventRooms.get(event.id);
 return canReadEventRoom(event)&&room&&room.revision===event.revision?eventRoomLink(room.url):'';
}
async function loadEventRoom(force=false){
 const uid=me(),event=state.events.find(item=>item.id===state.selectedEvent);
 if(!['event-detail','event-edit'].includes(state.modal)||!canReadEventRoom(event,uid)){
   state.eventRoom=null;return;
 }
 if(!force&&state.eventRoom?.id===event.id&&state.eventRoom.revision===event.revision)return;
 const room={id:event.id,revision:event.revision,url:'',loading:true,error:false};
 state.eventRoom=room;render();
 try{
   const url=await getEventRoomUrl(event.id);
   if(state.eventRoom!==room||me()!==uid)return;
   room.url=url;
   if(state.modal==='event-edit'&&state.drafts.get('event-edit-form')?.roomUrl===''){
     state.drafts.get('event-edit-form').roomUrl=room.url;
     const input=document.querySelector('#event-edit-form [name="roomUrl"]');
     if(input&&!input.value)input.value=room.url;
   }
 }catch{room.error=true;}
 finally{
   room.loading=false;
   if(state.eventRoom===room&&state.selectedEvent===room.id&&['event-detail','event-edit'].includes(state.modal))render();
 }
}
function eventRoomLink(url){
 return url?`<a class="btn btn-primary btn-small" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Entrar no encontro</a>`:'';
}
function renderEventRoom(event){
 if(!canReadEventRoom(event)||!event.attendees?.includes(me()))return '';
 const room=state.eventRoom?.id===event.id?state.eventRoom:null;
 if(room?.url)return eventRoomLink(room.url);
 if(room?.error)return '<p class="tip">Não foi possível abrir o link da sala. <button class="text-action" data-action="retry-event-room">Tentar novamente</button></p>';
 return room?.loading?'<p class="tip">Carregando link da sala…</p>':'';
}
function eventDirectionsLink(event){
 const location=String(event.location??'').trim();
 const label=norm(location);
 if(event.cancelled===true||eventFormat(event)==='online'||!/[\p{L}\d]/u.test(location)||
   /^(?:(?:evento|encontro|local|endereco) )?(?:on[- ]?line|virtual|remot[oa]|a distancia|a combinar|a definir|a confirmar|nao informado|indefinido|em breve)\b/.test(label)||
   /^(?:zoom|google meet|microsoft teams|discord)(?:$|\s*[:–—-])/.test(label)||
   /https?:\/\/|^www\./i.test(location))return '';
 const url=new URL('https://www.google.com/maps/dir/');
 url.searchParams.set('api','1');
 url.searchParams.set('destination',location);
 return `<a class="text-action" href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">Como chegar</a>`;
}
function eventCard(event, inGroup=false, detail=false) {
 const attending=(event.attendees||[]).includes(me());
 const saved=state.savedEventDates.has(event.id);
 const schedule=viewerEventSchedule(event),future=schedule.date>=today();
 const limited=Number.isInteger(event.capacity),position=limited?event.waitlist.indexOf(me()):-1;
 const offer=limited?eventSeatOffer(event):null;
 const waiting=limited&&((event.attendees||[]).length>=event.capacity||event.waitlist.length>0);
 const group=state.groups.find(item=>item.id===event.groupId);
 const canJoin=!event.groupId||group?.members?.includes(me());
 return `<article class="card event-card"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><span class="event-day">${dateLabel(schedule.date)} ${esc(eventTimeLabel(event,schedule))}${event.timeZone?' (seu horário)':''}</span><span class="post-category">${emoji(event.hobby)} ${esc(event.hobby||'Outros')}</span></div>
 ${detail?'':`<h3><button class="text-action" data-action="view-event" data-id="${esc(event.id)}">${esc(event.title)}</button></h3>`}<p>${esc(detail?event.description:short(event.description||'Encontre pessoas com os mesmos interesses.',115))}</p>
 ${event.cancelled===true?'<p class="pill">Evento cancelado</p>':event.revision>0?'<p class="pill">Evento atualizado</p>':''}
 <div class="card-meta" style="flex-wrap:wrap">${icon('map')} ${eventFormat(event)==='online'?'Online':esc(event.location||'Local a combinar')} ${eventDirectionsLink(event)}</div>
 <button class="text-action" data-action="save-event" data-id="${esc(event.id)}" data-value="${saved?'remove':'save'}" aria-pressed="${saved}">${icon('bookmark')} ${saved?'Remover dos salvos':'Salvar evento'}</button>
 ${!detail&&event.cancelled!==true?`<button class="text-action" data-action="share-event" data-id="${esc(event.id)}">Compartilhar evento</button>`:''}
 ${detail?'':eventCalendarButton(event)}
 ${group&&!inGroup?`<button class="text-action" data-action="view-group" data-id="${esc(group.id)}">${esc(group.name)}</button>`:''}
 ${hasPersonalCheckin(event)?'<p class="pill">Presença registrada</p>':''}
 ${!detail&&feedbackAvailable(event)&&(canReviewEvent(event)||event.createdBy===me())?`<button class="text-action" data-action="view-event" data-id="${esc(event.id)}">${event.createdBy===me()?'Ver avaliações':'Avaliar encontro'}</button>`:''}
 <div class="card-bottom"><span class="card-meta">${icon('users')} ${(event.attendees||[]).length}${limited?' de '+event.capacity+' vagas ocupadas':' interessados'}</span>
 <button data-action="rsvp" data-id="${esc(event.id)}" class="btn btn-small ${attending?'btn-outline':'btn-primary'}" ${event.cancelled===true||(!attending&&(!future||(!canJoin&&position<0)))?'disabled':''}>${event.cancelled===true?'Cancelado':attending?'Confirmado ✓':!future?'Encerrado':offer&&canJoin?'Confirmar vaga':position>=0?'Sair da lista de espera':!canJoin?'Só para membros':limited?(waiting?'Entrar na lista de espera':'Confirmar presença'):event.groupId?'Confirmar presença':'Tenho interesse'}</button></div>
 ${offer&&canJoin?`<p class="tip">Sua vaga está reservada até ${esc(new Date(offer).toLocaleString('pt-BR'))}.</p><button class="text-action" data-action="release-event-seat" data-id="${esc(event.id)}" ${state.busy?'disabled':''}>Liberar vaga</button>`:position>=0&&future&&event.cancelled!==true?`<p class="tip">Você está na posição ${position+1} da lista de espera.</p>`:''}</article>`;
}
function canReadEventBulletins(event){
 return Boolean(me()&&(event.createdBy===me()||event.attendees?.includes(me())));
}
function watchEventBulletins(){
 const uid=me();
 const available=new Set(state.events.filter(canReadEventBulletins).map(event=>event.id));
 for(const [id,watch] of state.eventBulletins){
   if(available.has(id))continue;
   watch.unsubscribe();state.eventBulletins.delete(id);
 }
 for(const id of available){
   if(state.eventBulletins.has(id)&&!state.eventBulletins.get(id).error)continue;
   const watch={entries:null,error:''};
   state.eventBulletins.set(id,watch);
   const latest=firebase.query(col('events',id,'bulletins'),firebase.orderBy('createdAt','desc'),firebase.limit(10));
   watch.unsubscribe=firebase.onSnapshot(latest,snapshot=>{
     if(me()!==uid||state.eventBulletins.get(id)!==watch)return;
     watch.entries=snapshot.docs.map(doc=>({...doc.data(),id:doc.id}));render();
   },error=>{
     if(me()!==uid||state.eventBulletins.get(id)!==watch)return;
     watch.error='Não foi possível carregar os recados.';render();
     console.error('HobbyHub event bulletins:',error);
   });
 }
}
function renderEventBulletins(event){
 if(!canReadEventBulletins(event))return '';
 const watch=state.eventBulletins.get(event.id);
 const entries=watch?.entries;
 const items=entries?.map(item=>`<article class="card" id="event-bulletin-${esc(item.id)}" tabindex="-1" style="padding:12px">
 <small class="muted">${when(item.createdAt?.toMillis?.())}</small><p class="post-copy" style="margin:6px 0">${esc(item.text)}</p></article>`).join('');
 return `<section class="form-stack" style="margin:16px 0" aria-label="Recados do organizador">
 <h3>Recados do organizador</h3>
 ${watch?.error?`<p class="tip">${watch.error}</p>`:entries?items||'<p class="tip">Ainda não há recados para este evento.</p>':'<p class="tip">Carregando recados…</p>'}
 ${event.createdBy===me()&&event.cancelled!==true?`<form id="event-bulletin-form" data-draft="true" data-draft-key="${esc('event-bulletin:'+event.id)}" class="form-stack">
 <label class="field">Recado para os confirmados<textarea class="textarea" name="text" required minlength="3" maxlength="500"></textarea></label>
 <button class="btn btn-primary btn-small" type="submit" ${state.busy?'disabled':''}>Publicar recado</button></form>`:''}
 </section>`;
}
const eventCheckinDay=()=>new Date(now()-3*60*60*1000).toISOString().slice(0,10);
function canCheckInEvent(event){
 return Boolean(me()&&event?.createdBy===me()&&event.cancelled!==true&&event.date===eventCheckinDay());
}
async function loadEventCheckins(eventId){
 const uid=me(),data={eventId,present:null,error:''};
 state.eventCheckins=data;
 try{
   const result=await firebase.getDocs(col('events',eventId,'checkins'));
   data.present=new Set(result.docs.map(doc=>doc.id));
 }catch(error){data.error=friendlyError(error);}
 if(me()===uid&&state.eventCheckins===data&&state.modal==='event-detail'&&state.selectedEvent===eventId)render();
}
function canComposeEventRecap(event){
 return Boolean(me()&&event?.createdBy===me()&&event.groupId&&pollMember(event.groupId)&&feedbackAvailable(event));
}
function renderEventOrganizerPanel(event){
 if(!me()||event.createdBy!==me())return '';
 const attendees=[...new Set(event.attendees||[])];
 const limited=Number.isInteger(event.capacity);
 const active=event.cancelled!==true&&event.date>=today();
 const reserved=active&&limited&&eventSeatOffer(event,event.waitlist?.[0])?1:0;
 const free=limited?Math.max(0,event.capacity-attendees.length-reserved):0;
 const waiting=(event.waitlist?.length||0)-reserved;
 const checkins=state.eventCheckins?.eventId===event.id?state.eventCheckins:null;
 const present=checkins?.present;
 const finished=feedbackAvailable(event);
 const editable=Boolean(present)&&canCheckInEvent(event);
 const names=[...new Set([...attendees,...(present||[])])].map(uid=>({uid,name:member(uid)?.name||'Perfil indisponível'}))
   .sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
 return `<section class="card form-stack" style="padding:14px;margin:16px 0" aria-label="Painel do organizador">
 <h3>Painel do organizador</h3>
 ${finished?'<h4>Resumo pós-evento</h4>':''}
 <dl class="grid-two" style="margin:0">
 <div><dt>${finished?'Confirmações registradas':limited?'Vagas ocupadas':'Presenças confirmadas'}</dt><dd><strong>${attendees.length}${limited&&!finished?' de '+event.capacity:''}</strong></dd></div>
 ${finished?`<div><dt>Check-ins registrados</dt><dd><strong>${present?present.size:'—'}</strong></dd></div>`:''}
 ${active&&limited?`<div><dt>Vagas livres</dt><dd><strong>${free}</strong></dd></div>
 <div><dt>Reservas pendentes</dt><dd><strong>${reserved}</strong></dd></div>
 <div><dt>Pessoas aguardando na fila</dt><dd><strong>${waiting}</strong></dd></div>`:''}
 </dl>
 <h4>Participantes confirmados e check-in</h4>
 ${!finished||!present?`<p class="tip">${checkins?.error?esc(checkins.error):present?`${present.size} ${present.size===1?'pessoa presente':'pessoas presentes'}`:'Carregando check-ins…'}</p>`:''}
 ${!editable&&event.cancelled!==true&&event.date>eventCheckinDay()?'<p class="tip">O check-in fica disponível no dia do encontro.</p>':''}
 ${names.length?`<ul class="form-stack" style="padding-left:20px;margin:0">${names.map(({uid,name})=>{
   const checked=present?.has(uid),confirmed=attendees.includes(uid);
   return `<li><div class="toggle-row" style="flex-wrap:wrap"><span>${esc(name)}${uid===me()?' (organizador)':''}${checked?' <strong>· Presente</strong>':''}${confirmed?'':' · Confirmação retirada'}</span>
   ${editable&&(checked||confirmed)?`<button class="text-action" data-action="${checked?'undo-event-checkin':'record-event-checkin'}" data-id="${esc(uid)}" ${state.busy?'disabled':''}>${checked?'Desfazer check-in':'Marcar chegada'}</button>`:''}</div></li>`;
 }).join('')}</ul>`:'<p class="tip">Nenhuma presença confirmada.</p>'}
 ${finished?renderEventFeedback(event):''}
 ${canComposeEventRecap(event)?`<button class="btn btn-outline btn-small" data-action="compose-event-recap" data-id="${esc(event.id)}">Publicar relato do encontro</button>`:''}
 </section>`;
}
function historyKey(event){return `${event.id}:${event.date}:${event.revision||0}`;}
function hasPersonalCheckin(event){
 return Boolean(event&&state.personalHistory.records.get(historyKey(event)));
}
function canReviewEvent(event,uid=me()){
 return Boolean(uid&&(event?.attendees?.includes(uid)||(uid===me()&&hasPersonalCheckin(event))));
}
async function loadPersonalHistory(){
 const uid=me(),history=state.personalHistory;
 if(!uid||history.loading||state.eventFilter!=='history'||state.tab!=='events')return;
 const missing=state.events.filter(event=>feedbackAvailable(event)&&!history.records.has(historyKey(event))).reverse();
 if(!missing.length)return;
 history.loading=true;history.error=false;render();
 for(let offset=0;offset<missing.length;offset+=8){
   const results=await Promise.allSettled(missing.slice(offset,offset+8).map(async event=>{
     const record=await firebase.getDocFromServer(ref('events',event.id,'checkins',uid));
     return [historyKey(event),record.exists()];
   }));
   if(me()!==uid||state.personalHistory!==history)return;
   for(const result of results){
     if(result.status==='fulfilled')history.records.set(...result.value);
     else history.error=true;
   }
   if(state.tab==='events'&&state.eventFilter==='history')render();
   else break;
 }
 history.loading=false;
 if(state.tab==='events'&&state.eventFilter==='history')render();
}
function eventWeek(date,offset){
 const monday=new Date(date.getFullYear(),date.getMonth(),date.getDate()-(date.getDay()+6)%7+offset*7,12);
 return Array.from({length:7},(_,i)=>new Date(monday.getFullYear(),monday.getMonth(),monday.getDate()+i,12));
}
function exportableWeekEvents(days){
 const first=localDateKey(days[0]),last=localDateKey(days[6]);
 return state.events.filter(event=>{
   const {date}=viewerEventSchedule(event);
   return event.cancelled!==true&&event.attendees?.includes(me())&&date>=first&&date<=last&&hasCalendarSchedule(event);
 }).sort((a,b)=>eventScheduleKey(a).localeCompare(eventScheduleKey(b)));
}
function renderEventWeek(days,events){
 const sections=days.map(day=>{
   const entries=events.filter(event=>viewerEventSchedule(event).date===localDateKey(day));
   return entries.length?`<section class="form-stack"><h3>${day.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}</h3>
   <div class="grid-two">${entries.map(event=>{
     const conflict=isConfirmedEventOn(event,localDateKey(day))&&conflictingEvents(event).length;
     return `<div>${conflict?'<p class="tip">Conflito: outro encontro confirmado coincide com este horário.</p>':''}${eventCard(event)}</div>`;
   }).join('')}</div></section>`:'';
 }).join('');
 const label=day=>day.toLocaleDateString('pt-BR');
 return `<div class="form-stack"><div class="toggle-row" style="flex-wrap:wrap">
 <button id="event-week-previous" class="btn btn-outline btn-small" data-action="event-week" data-value="previous">Semana anterior</button>
 <strong role="status">${label(days[0])} a ${label(days[6])}</strong>
 <button id="event-week-next" class="btn btn-outline btn-small" data-action="event-week" data-value="next">Próxima semana</button>
 <button id="event-week-current" class="text-action" data-action="event-week" data-value="current">Semana atual</button></div>
 ${exportableWeekEvents(days).length?`<div><button class="btn btn-outline btn-small" data-action="export-event-week">Exportar semana</button>
 <p class="tip">O arquivo inclui os encontros confirmados da semana. Consulte o HobbyHub para ver alterações posteriores.</p></div>`:''}
 ${sections||'<p class="tip">Nenhum encontro confirmado nesta semana com os filtros atuais.</p>'}</div>`;
}
function renderEvents(now=new Date()) {
 const day=localDateKey(now);
 const time=now.toTimeString().slice(0,5);
 const eventFilter=state.eventFilter;
 const weekly=eventFilter==='mine'&&state.eventAgendaView==='week';
 const days=weekly?eventWeek(now,state.eventWeekOffset):[];
 const query=norm(state.eventSearch);
 const communities=new Map(state.groups.map(group=>[group.id,group]));
 const interests=new Set((state.profile?.hobbies||[]).map(hobby=>norm(hobby).trim()).filter(Boolean));
 const hobbies=[...new Set(state.events.map(event=>event.hobby).filter(hobby=>typeof hobby==='string'&&hobby))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 const eventGroups=[...new Set(state.events.map(event=>event.groupId))].map(id=>communities.get(id)).filter(Boolean)
   .sort((a,b)=>String(a.name).localeCompare(String(b.name),'pt-BR'));
 const filtering=Boolean(query||state.eventHobby||state.eventCommunity||state.eventFormat);
 const events=state.events.filter(event=>{
   const schedule=viewerEventSchedule(event);
   const group=communities.get(event.groupId);
   if(state.eventHobby&&event.hobby!==state.eventHobby)return false;
   if(state.eventCommunity&&event.groupId!==state.eventCommunity)return false;
   if(state.eventFormat&&eventFormat(event)!==state.eventFormat)return false;
   if(query&&!norm([event.title,event.description,event.location,group?.name,group?.location].join(' ')).includes(query))return false;
   if(eventFilter==='all')return true;
   if(eventFilter==='mine')return event.attendees?.includes(me())&&(!weekly||(schedule.date>=localDateKey(days[0])&&schedule.date<=localDateKey(days[6])));
   if(eventFilter==='saved')return state.savedEventDates.has(event.id);
   if(eventFilter==='history')return feedbackAvailable(event)&&canReviewEvent(event);
   if(eventFilter==='waitlist')return schedule.date>=day&&event.cancelled!==true&&event.waitlist?.includes(me());
   if(eventFilter==='past')return schedule.date&&schedule.date<day;
   if(eventFilter==='recommended')return event.cancelled!==true
     && (schedule.date>day||(schedule.date===day&&(!schedule.time||schedule.time>=time)))
     && (interests.has(norm(event.hobby).trim())||group?.members?.includes(me()));
   return schedule.date>=day;
 }).sort((a,b)=>{
   const order=eventScheduleKey(a).localeCompare(eventScheduleKey(b));
   return eventFilter==='past'||eventFilter==='history'?-order:order;
 });
 const emptyAgenda=filtering?empty('🗓️','Nenhum evento encontrado','Mude a busca ou ajuste os filtros.')
   :eventFilter==='recommended'?empty('🗓️','Nenhum encontro recomendado por enquanto','As sugestões aparecem quando há eventos dos seus hobbies ou das comunidades de que você participa.','Ver próximos eventos','upcoming-events')
   :eventFilter==='mine'?empty('🗓️','Você ainda não confirmou nenhum evento','Confira os próximos encontros para encontrar um evento de que queira participar.','Ver próximos eventos','upcoming-events')
   :eventFilter==='history'?empty('🗓️','Nenhum evento no seu histórico','Os encontros encerrados que você confirmou ou em que fez check-in aparecem por aqui.')
   :eventFilter==='saved'?empty('🔖','Você ainda não salvou nenhum evento','Salve um encontro para voltar aos detalhes mais tarde.','Ver próximos eventos','upcoming-events')
   :eventFilter==='waitlist'?empty('🗓️','Você não está em nenhuma lista de espera','Ao entrar na fila de um evento lotado, acompanhe sua posição por aqui.','Ver próximos eventos','upcoming-events')
   :empty('🗓️','Nada marcado ainda','Seja a primeira pessoa a transformar uma conversa em um encontro.','Criar evento','event');
 return `<div class="hero" style="min-height:200px;background:linear-gradient(115deg,#fe956e,#ed7099)"><span class="hero-overline">SAIA DO FEED, VIVA A EXPERIÊNCIA</span><h2>Conexões que saem da tela.</h2><p>Crie um encontro de leitura, uma caminhada ou uma sessão de games.</p><button class="btn btn-white btn-small" data-action="event">${icon('plus')} Criar evento</button></div>
 <div class="filters" role="group" aria-label="Agenda de eventos">${[['upcoming','Próximos'],['recommended','Para você'],['mine','Meus eventos'],['saved','Salvos'],['history','Histórico'],['waitlist','Lista de espera'],['past','Encerrados'],['all','Todos']].map(([id,title])=>`<button id="event-filter-${id}" class="filter ${eventFilter===id?'active':''}" aria-pressed="${eventFilter===id}" data-action="event-filter" data-value="${id}">${title}</button>`).join('')}</div>
 ${eventFilter==='mine'?`<div class="filters" role="group" aria-label="Visualização dos meus eventos">${[['list','Lista'],['week','Semana']].map(([id,label])=>`<button id="event-agenda-${id}" class="filter ${state.eventAgendaView===id?'active':''}" data-action="event-agenda-view" data-value="${id}" aria-pressed="${state.eventAgendaView===id}">${label}</button>`).join('')}</div>`:''}
 <div class="card form-stack" style="padding:16px;margin:0 0 16px">
 <label class="field">Buscar eventos<input type="search" class="input" id="event-search" placeholder="Nome, local ou cidade da comunidade" value="${esc(state.eventSearch)}"></label>
 <div class="field-grid"><label class="field">Hobby<select class="select" id="event-hobby"><option value="">Todos os hobbies</option>${hobbies.map(hobby=>`<option value="${esc(hobby)}" ${state.eventHobby===hobby?'selected':''}>${esc(hobby)}</option>`).join('')}</select></label>
 <label class="field">Comunidade<select class="select" id="event-community"><option value="">Todas as comunidades</option>${eventGroups.map(group=>`<option value="${esc(group.id)}" ${state.eventCommunity===group.id?'selected':''}>${esc(group.name)}</option>`).join('')}</select></label></div>
 <label class="field">Formato<select class="select" id="event-format-filter"><option value="">Todos os formatos</option>${eventFormatOptions(state.eventFormat)}</select></label>
 <div class="toggle-row"><span class="mini muted">${events.length} ${events.length===1?'evento encontrado':'eventos encontrados'}</span>${filtering?'<button type="button" class="text-action" data-action="clear-event-filters">Limpar filtros</button>':''}</div>
 </div>
 ${eventFilter==='history'&&state.personalHistory.loading?'<p class="tip" role="status">Conferindo seus registros de presença…</p>':''}
 ${eventFilter==='history'&&state.personalHistory.error?'<p class="tip">Alguns check-ins não puderam ser carregados. <button class="text-action" data-action="refresh-event-history">Tentar novamente</button></p>':''}
 ${weekly?renderEventWeek(days,events):events.length?`<div class="grid-two">${events.map(event=>eventCard(event)).join('')}</div>`:eventFilter==='history'&&state.personalHistory.loading?'':emptyAgenda}
 <p class="tip" style="margin-top:18px">Dica de segurança: combine encontros públicos, avise alguém de confiança e evite divulgar endereços residenciais na rede.</p>`;
}
function renderSaved() {
 const posts=state.posts.filter(p=>state.savedIds.includes(p.id));
 return `<div class="section-head"><h2>Publicações para guardar</h2><span class="pill">${posts.length} salvas</span></div>${posts.length?posts.map(postCard).join(''):empty('🔖','Sua coleção começa aqui','Salve publicações que inspiram seus hobbies. Elas aparecem neste espaço.','Explorar publicações','explore')}`;
}
function mediaUrl(value) {
 try {
   const url=new URL(value);
   return url.protocol==='https:'&&!url.username&&!url.password&&url.href.length<=1500?url.href:'';
 } catch {return '';}
}
function renderProfileMedia(profile) {
 const photo=mediaUrl(profile.photoUrl),video=mediaUrl(profile.videoUrl);
 if(!photo&&!video)return '';
 return `<div class="profile-media">${photo?`<img src="${esc(photo)}" alt="Foto compartilhada no perfil" loading="lazy" referrerpolicy="no-referrer">`:''}${video?`<video src="${esc(video)}" controls playsinline preload="none" aria-label="Vídeo compartilhado no perfil"></video><a href="${esc(video)}" target="_blank" rel="noopener noreferrer">Abrir vídeo</a>`:''}</div>`;
}
function blockButton(uid) {
 if(!uid||uid===me())return '';
 const blocked=state.blockedIds.includes(uid);
 return `<button class="btn btn-outline btn-small" data-action="${blocked?'unblock-member':'block-member'}" data-id="${esc(uid)}" ${state.updatingBlock?'disabled':''}>${blocked?'Desbloquear':'Bloquear'}</button>`;
}
function reportButton(type, id, label) {
 return `<button type="button" class="text-action" data-action="report-content" data-type="${type}" data-id="${esc(id)}" aria-label="Denunciar ${label}">Denunciar</button>`;
}
function renderTestimonials(entries, owner=false) {
 if(!entries.length)return '<p class="tip">Ainda não há depoimentos.</p>';
 return `<div class="comment-list">${[...entries].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).map(entry=>`
  <div class="comment"><div class="comment-body"><strong>${esc(member(entry.id)?.name||'Pessoa do HobbyHub')}</strong>
  <p>${esc(entry.text)}</p>
  ${entry.id===me()?'':reportButton('testimonial',entry.id,'depoimento')}
  ${owner?`<small>${entry.approved?'Visível no perfil':'Aguardando sua aprovação'}</small>
    <div class="toggle-row"><button class="text-action" data-action="testimonial-visibility" data-id="${esc(entry.id)}">${entry.approved?'Ocultar':'Aprovar'}</button>
    <button class="text-action" data-action="testimonial-remove" data-id="${esc(entry.id)}">Remover</button></div>`:''}
  </div></div>`).join('')}</div>`;
}
function renderProfile() {
 const p=state.profile,posts=state.posts.filter(post=>post.userId===me());
 const groupCount=state.groups.filter(g=>(g.members||[]).includes(me())).length;
 return `<div class="card" style="overflow:hidden"><div class="profile-cover"></div><div class="profile-info">${avatar(p,true)}<div class="profile-topline"><div><h2>${esc(p.name)}</h2><p style="margin-top:7px">${icon('map')} ${esc(p.location)}</p></div><div class="toggle-row"><button class="btn btn-outline btn-small" data-action="edit-profile">${icon('edit')} Editar</button><button class="circle-btn" data-action="logout" title="Sair da conta" aria-label="Sair">${icon('logout')}</button></div></div>
 <p>${esc(p.bio||'Um mundo de hobbies para descobrir.')}</p>
 ${renderProfileMedia(p)}
 ${(p.hobbies||[]).length?`<div class="interest-row">${p.hobbies.map(h=>`<span class="pill">${emoji(h)} ${esc(h)}</span>`).join('')}</div>`:''}
 <div class="profile-stats"><div><strong>${posts.length}</strong><small>publicações</small></div><div><strong>${groupCount}</strong><small>comunidades</small></div><div><strong>${state.followingIds.length}</strong><small>seguindo</small></div></div></div></div>
 <div class="section-head"><h2>Ajuda e feedback</h2><div class="toggle-row" style="flex-wrap:wrap"><button class="text-action" data-action="send-feedback">Enviar feedback</button><button class="text-action" data-action="my-product-feedback">Meus feedbacks</button><button class="text-action" data-action="product-news">Novidades</button>${state.feedbackAdmin?'<button class="text-action" data-action="product-feedback-admin">Painel de feedback</button>':hasFeedbackAdminRole()?'<button class="text-action" data-action="feedback-admin-verification">Ativar painel de feedback</button>':''}</div></div>
 <div class="section-head"><h2>Pessoas bloqueadas</h2></div>
 <div class="card" style="padding:16px">${state.blockedIds.length?state.blockedIds.map(uid=>`<div class="toggle-row"><span>${esc(member(uid)?.name||'Perfil indisponível')}</span>${blockButton(uid)}</div>`).join(''):'<p class="tip">Nenhuma pessoa bloqueada.</p>'}</div>
 <div class="section-head" id="received-testimonials"><h2>Depoimentos recebidos</h2></div>
 <div class="card" style="padding:16px">${renderTestimonials(state.receivedTestimonials,true)}</div>
 <div class="section-head"><h2>Suas publicações</h2><button class="text-action" data-action="compose">Publicar algo ${icon('plus')}</button></div>
 ${posts.length?posts.map(postCard).join(''):empty('🎨','Conte sua primeira história','O que você está aprendendo, criando ou descobrindo?','Criar publicação','compose')}`;
}
function renderMessages() {
 const community=state.chatMode!=='direct';
 const global=state.chatMode==='global';
 const messages=community?state.messages.filter(m=>global?m.scope==='global':m.scope!=='global'&&locate(m.location)):state.directMessages;
 const title=global?'Comunidade global':community?`Comunidade de ${myLocation()}`:(state.chatTarget?.name||'Escolha uma pessoa');
 const blocked=!community&&state.blockedIds.includes(state.chatTarget?.uid);
 const draftKey=`message-form:${me()}:${community?state.chatMode:`direct:${state.chatTarget?.uid}`}`;
 return `<div class="card chat-shell"><div class="chat-list"><h3>Conversas</h3>
 <button class="chat-contact ${global?'active':''}" data-action="chat-community" data-value="global"><span class="avatar">🌍</span><span>Comunidade global</span></button>
 <button class="chat-contact ${community&&!global?'active':''}" data-action="chat-community"><span class="avatar">📍</span><span>Comunidade local</span></button>
 ${[...state.threads].sort((a,b)=>Number(unreadThread(b.id))-Number(unreadThread(a.id))||(state.latestInboundAt.get(b.id)||b.createdAt||0)-(state.latestInboundAt.get(a.id)||a.createdAt||0)).map(t=>{
 const other=(t.participants||[]).find(id=>id!==me());if(!other)return '';
 const p=member(other),isActive=!community&&state.chatTarget?.uid===other;
 const unread=unreadThread(t.id);
 return `<button class="chat-contact ${isActive?'active':''} ${unread?'chat-unread':''}" data-action="open-dm" data-id="${esc(other)}">${avatar(p||{avatar:'💬'})}<span>${esc(short(p?.name||t.names?.[other]||'Pessoa',19))}</span>${unread?'<span class="unread-dot"><span class="sr-only">Não lida</span></span>':''}</button>`;
 }).join('')}
 <p class="tip" style="margin-top:25px;font-size:10px">Para começar uma nova conversa privada, encontre alguém em Explorar.</p>
 <button class="btn btn-soft btn-small" style="width:100%" data-action="tab" data-tab="explore">${icon('users')} Explorar</button></div>
 <div class="chat-panel"><div class="chat-panel-head">${avatar(community?{avatar:global?'🌍':'📍'}:member(state.chatTarget?.uid)||{avatar:'💬'})}<div><strong>${esc(title)}</strong><small>${global?'Para todos os membros do HobbyHub':community?'Mensagens públicas da sua cidade':'Somente participantes podem acessar esta conversa'}</small></div>${community?'':blockButton(state.chatTarget?.uid)}</div>
 <div id="chat-log" class="chat-log">${messages.length?messages.slice(-150).map(m=>`<div class="chat-row ${m.senderId===me()?'mine':''}"><div class="chat-bubble">${m.senderId!==me()&&community?`<small>${esc(m.senderName||member(m.senderId)?.name||'Pessoa')}</small>`:''}${esc(m.text)}<span style="display:block;text-align:right;font-size:9px;opacity:.65;margin-top:5px">${when(m.createdAt)}</span>${m.senderId!==me()&&m.id?reportButton(community?'communityMessage':'privateMessage',m.id,'mensagem'):''}</div></div>`).join(''):`<div class="chat-empty"><span class="emoji">${community?'👋':'💌'}</span>${community?'Dê um oi à sua comunidade!':'Comece com uma mensagem simpática.'}</div>`}</div>
 ${blocked?'<div class="chat-send"><p class="tip">Você bloqueou novas mensagens nesta conversa.</p></div>':community||state.chatTarget?`<form id="message-form" data-draft="true" data-draft-key="${esc(draftKey)}" class="chat-send"><input class="input" id="message-text" name="message" maxlength="1500" required placeholder="Escreva sua mensagem..."><button class="btn btn-primary" type="submit" aria-label="Enviar mensagem" ${state.busy?'disabled':''}>${icon('send')}</button></form>`:`<div class="chat-send"><button class="btn btn-soft" data-action="tab" data-tab="explore">Encontrar pessoas</button></div>`}</div></div>`;
}
function topicSelect(selected='Arte') {return `<select name="hobby" class="select" required>${TOPICS.map(t=>`<option value="${esc(t.name)}" ${selected===t.name?'selected':''}>${t.emoji} ${esc(t.name)}</option>`).join('')}</select>`;}
function modalWrap(title,content){
 const key=[state.modal,title,state.selectedPost,state.selectedGroup,state.selectedEvent,state.viewUser,state.pollDetail?.poll?.id].join('|');
 return `<div class="overlay" data-overlay="true"><section class="modal" data-view="${esc(key)}" role="dialog" aria-modal="true" aria-label="${esc(title)}" tabindex="-1"><header class="modal-head"><h2>${esc(title)}</h2><button class="circle-btn" data-action="close" aria-label="Fechar">${icon('x')}</button></header>${content}</section></div>`;
}
function suggestedWelcomeGroups() {
 const interests=new Set((state.profile?.hobbies||[]).map(norm));
 const chosen=norm(state.welcomeHobby);
 return state.groups.filter(group=>!(group.members||[]).includes(me())&&(!chosen||norm(group.hobby)===chosen))
  .map(group=>({group,local:locate(group.location),shared:interests.has(norm(group.hobby))}))
  .sort((a,b)=>(Number(b.shared)*2+Number(b.local))-(Number(a.shared)*2+Number(a.local))).slice(0,3);
}
function renderFirstVisit() {
 const suggestions=suggestedWelcomeGroups();
 const hobbies=[...new Set(state.groups.map(group=>group.hobby).filter(hobby=>typeof hobby==='string'&&hobby))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 return modalWrap('Boas-vindas ao HobbyHub',`<p>Encontre uma comunidade para praticar um hobby com outras pessoas.</p>
 <label class="field">Explorar por hobby<select class="select" id="welcome-hobby"><option value="">Todos os hobbies</option>${hobbies.map(hobby=>`<option value="${esc(hobby)}" ${state.welcomeHobby===hobby?'selected':''}>${esc(hobby)}</option>`).join('')}</select></label>
 <div class="form-stack" style="margin:14px 0">${suggestions.length?suggestions.map(({group,local,shared})=>`<article class="card" style="padding:12px"><button type="button" class="text-action" data-action="view-welcome-group" data-id="${esc(group.id)}">${esc(group.name)}</button><p class="mini muted" style="margin:4px 0">${esc(group.hobby)} · ${esc(group.location||'Online')}${local?' · Da sua cidade':''}${shared?' · Hobby em comum':''}</p></article>`).join(''):'<p class="tip">Ainda não há sugestões com esse filtro.</p>'}</div>
 <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="btn btn-outline" data-action="discover-groups">Ver comunidades</button><button type="button" class="btn btn-ghost" data-action="tab" data-tab="home">Pular e ir ao feed</button></div>`);
}
function feedbackAvailable(event) {
 const dateInBrasilia=eventCheckinDay();
 return event?.cancelled!==true&&/^\d{4}-\d{2}-\d{2}$/.test(event?.date)&&event.date<dateInBrasilia;
}
function canRepeatEvent(event) {
 return feedbackAvailable(event)&&event.createdBy===me()
  && (!event.groupId||state.groups.find(group=>group.id===event.groupId)?.members?.includes(me()));
}
function renderEventQuestions(event){
 const data=state.eventDiscussion?.eventId===event.id?state.eventDiscussion:null;
 const questions=data?.questions||[];
 const organizer=event.createdBy===me()&&event.cancelled!==true;
 const items=questions.map(question=>{
   const pinned=question.id===data.pinned;
   return `<article class="card" id="event-question-${esc(question.id)}" tabindex="-1" style="padding:12px">${pinned?'<p class="eyebrow">Resposta fixada</p>':''}
   <strong>${esc(member(question.authorId)?.name||'Membro do HobbyHub')}</strong>
   <p class="post-copy" style="margin:6px 0">${esc(question.question)}</p>
   ${question.answer?`<p class="mini muted">Resposta do organizador</p><p class="post-copy" style="margin:6px 0">${esc(question.answer)}</p>`:''}
   ${organizer&&state.eventAnswerId===question.id?`<form id="event-answer-form" data-draft="true" data-draft-key="${esc('event-answer:'+event.id+':'+question.id)}" class="form-stack">
   <label class="field">Resposta<textarea class="textarea" name="answer" required maxlength="600">${esc(question.answer)}</textarea></label>
   <button class="btn btn-primary btn-small" type="submit" ${state.busy?'disabled':''}>Salvar resposta</button></form>`:organizer?`<div class="toggle-row" style="flex-wrap:wrap">
   <button class="text-action" data-action="answer-event-question" data-id="${esc(question.id)}">${question.answer?'Editar resposta':'Responder'}</button>
   ${question.answer?`<button class="text-action" data-action="${pinned?'unpin-event-question':'pin-event-question'}" data-id="${esc(question.id)}">${pinned?'Desafixar resposta':'Fixar resposta'}</button>`:''}</div>`:''}</article>`;
 }).join('');
 return `<section class="form-stack" style="margin:18px 0" aria-label="Perguntas do evento">
 <div class="section-head"><h3>Perguntas e respostas</h3><button class="text-action" data-action="refresh-event-questions">Atualizar</button></div>
 ${data?.error?`<p class="tip">${esc(data.error)}</p>`:data?.loading||!data?'<p class="tip">Carregando perguntas…</p>':items||'<p class="tip">Ainda não há perguntas sobre este evento.</p>'}
 ${event.cancelled===true?'':`<form id="event-question-form" data-draft="true" data-draft-key="${esc('event-question:'+event.id)}" class="form-stack">
 <label class="field">Sua pergunta<textarea class="textarea" name="question" required minlength="3" maxlength="400"></textarea></label>
 <button class="btn btn-primary btn-small" type="submit" ${state.busy?'disabled':''}>Enviar pergunta</button></form>`}</section>`;
}
async function loadEventQuestions(eventId,questionId=''){
 const uid=me();
 const data={eventId,loading:true,questions:[],pinned:'',error:''};
 state.eventDiscussion=data;
 try{
   const [list,pin]=await Promise.all([
     firebase.getDocs(firebase.query(col('events',eventId,'questions'),firebase.orderBy('createdAt','desc'),firebase.limit(30))),
     firebase.getDoc(ref('events',eventId,'discussion','pinned'))
   ]);
   const questions=list.docs.map(doc=>({...doc.data(),id:doc.id}));
   data.pinned=pin.data()?.questionId||'';
   if(data.pinned){
     const index=questions.findIndex(item=>item.id===data.pinned);
     if(index>=0)questions.unshift(questions.splice(index,1)[0]);
     else{
       const featured=await firebase.getDoc(ref('events',eventId,'questions',data.pinned));
       if(featured.exists())questions.unshift({...featured.data(),id:featured.id});
     }
   }
   if(questionId&&!questions.some(item=>item.id===questionId)){
     const linked=await firebase.getDoc(ref('events',eventId,'questions',questionId));
     if(linked.exists())questions.push({...linked.data(),id:linked.id});
   }
   data.questions=questions;
 }catch(error){data.error=friendlyError(error);}
 finally{
   data.loading=false;
   if(me()===uid&&state.eventDiscussion===data&&state.modal==='event-detail'&&state.selectedEvent===eventId){
     render();
     if(questionId){
       const target=document.getElementById('event-question-'+questionId);
       if(target){target.focus({preventScroll:true});target.scrollIntoView({block:'center'});}
     }
   }
 }
}
function renderEventFeedback(event) {
 const organizer=event.createdBy===me(),eligible=canReviewEvent(event);
 if(!feedbackAvailable(event)||(!organizer&&!eligible))return '';
 const feedback=state.eventFeedback;
 if(feedback?.id!==event.id||feedback.loading)return '<p class="tip">Carregando avaliações…</p>';
 if(feedback.error)return `<p class="tip">${esc(feedback.error)}</p><button class="text-action" data-action="view-event" data-id="${esc(event.id)}">Tentar novamente</button>`;
 const mine=feedback.entries.find(entry=>entry.id===me());
 const present=feedback.entries.filter(entry=>entry.attended).length;
 const absent=feedback.entries.length-present;
 const comments=feedback.entries.filter(entry=>entry.comment);
 return `<section class="card" style="padding:16px;margin-top:16px" aria-label="Avaliação do encontro">
 <h3>Avaliação do encontro</h3>
 ${organizer?`<div><h4>Resumo privado</h4><p>${feedback.entries.length} ${feedback.entries.length===1?'resposta':'respostas'} · ${present} ${present===1?'declarou que compareceu':'declararam que compareceram'} · ${absent} ${absent===1?'declarou que não compareceu':'declararam que não compareceram'}</p>
 ${comments.length?`<ul style="padding-left:20px">${comments.map(entry=>`<li>${esc(entry.comment)}</li>`).join('')}</ul>`:''}</div>`:''}
 ${eligible?`<form id="event-feedback-form" data-draft="true" data-draft-key="${esc(`feedback:${me()}:${event.id}`)}" class="form-stack"><p class="tip">Suas respostas ficam disponíveis para você e para o organizador.</p>
 <label class="field">Você compareceu?<select name="attended" class="select" required><option value="">Selecione</option><option value="yes" ${mine?.attended===true?'selected':''}>Sim</option><option value="no" ${mine?.attended===false?'selected':''}>Não</option></select></label>
 <label class="field">O que podemos melhorar? (opcional)<textarea class="textarea" name="comment" maxlength="500">${esc(mine?.comment||'')}</textarea></label>
 <button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>${mine?'Atualizar avaliação':'Enviar avaliação'}</button></form>`:''}</section>`;
}
function canManageGroup(group) {
 return Boolean(group&&(group.createdBy===me()||(group.members?.includes(me())&&state.groupRoles.get(group.id)==='active')));
}
function renderGroupModeration(group) {
 const role=group.members?.includes(me())?state.groupRoles.get(group.id):null;
 const ownRole=role==='pending'?`<p>Você recebeu um convite para moderar esta comunidade.</p><div class="toggle-row"><button class="btn btn-primary btn-small" data-action="accept-group-role" data-id="${esc(group.id)}">Aceitar convite</button><button class="btn btn-ghost btn-small" data-action="leave-group-role" data-id="${esc(group.id)}">Recusar</button></div>`
  :role==='active'?`<p>Você pode fixar publicações e remover conteúdo desta comunidade.</p><button class="btn btn-outline btn-small" data-action="leave-group-role" data-id="${esc(group.id)}">Deixar a moderação</button>`:'';
 const selected=state.moderationSelection?.groupId===group.id?state.moderationSelection:null;
 const candidates=(group.members||[]).filter(uid=>uid!==me());
 const ownerControls=group.createdBy===me()?`<h3>Moderação</h3>${candidates.length?`
  <label class="field">Membro da comunidade<select id="moderation-member" class="select" data-group="${esc(group.id)}"><option value="">Selecione um membro</option>${candidates.map(uid=>`<option value="${esc(uid)}" ${selected?.targetId===uid?'selected':''}>${esc(member(uid)?.name||`Membro ${uid.slice(0,6)}`)}</option>`).join('')}</select></label>
  ${!selected?'':selected.loading?'<p class="mini">Consultando função…</p>':selected.error?`<p class="tip">${esc(selected.error)}</p>`:
  selected.status?`<p class="mini">${selected.status==='active'?'Moderador ativo':'Convite pendente'}</p><button class="btn btn-outline btn-small" data-action="revoke-group-role">Revogar função ou convite</button>`:
  '<button class="btn btn-primary btn-small" data-action="invite-group-role">Convidar para moderar</button>'}`
  :'<p class="tip">Quando outra pessoa entrar no grupo, você poderá convidá-la para moderar.</p>'}`:'';
 return ownRole||ownerControls?`<section class="card" style="padding:16px;margin:14px 0" aria-label="Moderação da comunidade">${ownerControls}${ownRole}
 ${canManageGroup(group)?`<div class="toggle-row" style="flex-wrap:wrap"><button class="text-action" data-action="group-report-queue" data-id="${esc(group.id)}">Denúncias</button><button class="text-action" data-action="moderation-history" data-id="${esc(group.id)}">Histórico de moderação</button></div>`:''}</section>`:'';
}
function renderGroupReportQueue(group) {
 if(!canManageGroup(group))return modalWrap('Denúncias indisponíveis','<p>Você não tem acesso às denúncias deste grupo.</p>');
 const queue=state.moderationQueue?.groupId===group.id?state.moderationQueue:null;
 const pending=queue?.entries?.filter(entry=>entry.status==='pending');
 return modalWrap('Denúncias da comunidade',`<div class="form-stack">
 ${queue?.error?`<p class="tip">${esc(queue.error)}</p>`:!pending?'<p>Carregando denúncias…</p>':pending.length?pending.map(entry=>`
   <article class="card" style="padding:12px"><strong>${entry.targetType==='comment'?'Comentário':'Publicação'}</strong>
   <p>${esc(entry.text)}</p><p class="mini">Motivo: ${esc(entry.reason)}</p>${entry.details?`<p class="mini">${esc(entry.details)}</p>`:''}
   <div class="toggle-row" style="flex-wrap:wrap"><button class="btn btn-outline btn-small" data-action="keep-group-report" data-id="${esc(entry.id)}">Manter conteúdo</button>
   <button class="btn btn-primary btn-small" data-action="remove-group-report" data-id="${esc(entry.id)}">Retirar com motivo</button></div></article>`).join(''):'<p class="tip">Nenhuma denúncia pendente nesta comunidade.</p>'}
 <button class="text-action" data-action="view-group" data-id="${esc(group.id)}">Voltar à comunidade</button></div>`);
}
function renderModerationHistory(group) {
 const history=state.moderationHistory;
 if(!canManageGroup(group))return modalWrap('Histórico indisponível','<p>Você não tem mais acesso ao histórico deste grupo.</p>');
 const entries=history?.groupId===group.id?history.entries:null;
 const list=history?.error?`<p class="tip">${esc(history.error)}</p>`:!entries?'<p>Carregando histórico…</p>':entries.length?entries.map(entry=>{
   const date=entry.removedAt?.toDate?.();
   const who=member(entry.removedBy)?.name||'Moderador da comunidade';
   const stamp=date?date.toLocaleString('pt-BR'):'';
   const isComment=Boolean(entry.commentId);
   const label=isComment?'Comentário':'Publicação';
   const stateLabel=entry.restoredAt?(isComment?'restaurado':'restaurada'):(isComment?'retirado':'retirada');
   const canRestore=group.createdBy===me()&&!entry.restoredAt;
   const postVisible=!isComment||state.posts.some(post=>post.id===entry.postId);
   return `<article class="card" style="padding:12px"><strong>${label} ${stateLabel}</strong>
   <p>${esc(short(isComment?entry.comment?.text:entry.post?.content,220))}</p><p class="mini">Motivo: ${esc(entry.reason)}</p>
   <p class="mini muted">${esc(who)}${stamp?` · ${esc(stamp)}`:''}</p>
   ${canRestore?(postVisible?`<button class="btn btn-outline btn-small" data-action="restore-group-post" data-id="${esc(entry.id)}">Restaurar ${label.toLowerCase()}</button>`:'<p class="tip">Restaure a publicação antes de restaurar este comentário.</p>'):''}</article>`;
 }).join(''):'<p class="tip">Nenhum conteúdo foi retirado pela moderação.</p>';
 return modalWrap('Histórico de moderação',`<div class="form-stack">${list}<button class="text-action" data-action="view-group" data-id="${esc(group.id)}">Voltar à comunidade</button></div>`);
}
const pollOptions=['a','b','c','d'];
const pollClosed=poll=>poll.endsAt.toMillis()<=now();
const pollDeadline=poll=>poll.endsAt.toDate().toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});
const pollMember=groupId=>state.groups.some(group=>group.id===groupId&&group.members?.includes(me()));
function renderGroupPolls(){
 const groupId=state.selectedGroup;
 if(!pollMember(groupId))return modalWrap('Enquetes','<p>Entre na comunidade para acompanhar as enquetes.</p>');
 const group=state.groups.find(item=>item.id===groupId);
 const data=state.groupPolls?.groupId===groupId?state.groupPolls:null;
 const entries=data?.entries;
 const list=entries?.map(poll=>`<div class="card" style="padding:13px">
 <button class="text-action" data-action="view-poll" data-id="${esc(poll.id)}">${esc(poll.question)}</button>
 <p class="mini muted">${pollClosed(poll)?'Encerrada':'Aberta até '+esc(pollDeadline(poll))}</p></div>`).join('');
 return modalWrap('Enquetes da comunidade',`<div class="form-stack">
 ${canManageGroup(group)?'<button class="btn btn-primary btn-small" data-action="create-poll">Criar enquete</button>':''}
 ${data?.error?`<p class="tip">${esc(data.error)}</p>`:entries?list||'<p class="tip">Ainda não há enquetes nesta comunidade.</p>':'<p class="tip">Carregando enquetes…</p>'}
 <button class="text-action" data-action="view-group" data-id="${esc(groupId)}">Voltar à comunidade</button></div>`);
}
function canDraftPollEvent(detail){
 if(!detail||detail.loading||!detail.totals||!pollClosed(detail.poll)||!pollMember(detail.groupId))return false;
 return canManageGroup(state.groups.find(group=>group.id===detail.groupId));
}
function pollEventTitle({poll,totals}){
 const options=pollOptions.filter(key=>poll.options[key]);
 const highest=Math.max(0,...options.map(key=>totals[key]));
 const winners=options.filter(key=>totals[key]===highest);
 return highest>0&&winners.length===1?poll.options[winners[0]]:'';
}
function renderPoll(){
 const detail=state.pollDetail;
 if(!detail||!pollMember(detail.groupId))return modalWrap('Enquete indisponível','<p>Entre na comunidade para acessar esta enquete.</p>');
 const {poll,choice,totals,error,loading}=detail;
 const closed=pollClosed(poll);
 const options=pollOptions.filter(key=>poll.options[key]);
 const total=totals?options.reduce((sum,key)=>sum+totals[key],0):0;
 const items=options.map(key=>`<div class="card" style="padding:13px">
 <strong>${esc(poll.options[key])}</strong>
 ${totals?`<p class="mini muted">${totals[key]} ${totals[key]===1?'voto':'votos'} · ${total?Math.round(100*totals[key]/total):0}%</p>`:''}
 ${closed?'':`<button class="btn btn-outline btn-small" data-action="vote-poll" data-id="${key}" ${choice===key||loading||state.busy?'disabled':''}>${choice===key?'Seu voto':choice?'Mudar para esta opção':'Votar nesta opção'}</button>`}</div>`).join('');
 return modalWrap(poll.question,`<div class="form-stack">
 <p class="mini muted">${closed?'Encerrada em':'Aberta até'} ${esc(pollDeadline(poll))}</p>
 ${items}
 ${canDraftPollEvent(detail)?'<button class="btn btn-primary btn-small" data-action="event-from-poll">Criar evento a partir da enquete</button>':''}
 ${error?`<p class="tip">${esc(error)}</p>`:loading?'<p class="tip">Carregando votação…</p>':totals?`<p class="mini muted">${total} ${total===1?'voto':'votos'}</p>`:'<p class="tip">Os resultados aparecem depois que você votar ou quando a enquete encerrar.</p>'}
 <div class="toggle-row"><button class="text-action" data-action="group-polls" data-id="${esc(detail.groupId)}">Voltar às enquetes</button>
 <button class="text-action" data-action="view-poll" data-id="${esc(poll.id)}">Atualizar</button></div></div>`);
}
async function loadGroupPolls(groupId){
 const data={groupId,entries:null,error:''};
 state.groupPolls=data;
 try{
   const list=firebase.query(col('groups',groupId,'polls'),firebase.orderBy('createdAt','desc'));
   const result=await firebase.getDocs(list);
   data.entries=result.docs.map(doc=>({...doc.data(),id:doc.id}));
 }catch(error){data.error=friendlyError(error);}
 if(state.groupPolls===data&&state.modal==='group-polls')render();
}
async function openPoll(groupId,poll){
 const detail={groupId,poll,choice:null,totals:null,loading:true,error:''};
 const uid=me(),path=['groups',groupId,'polls',poll.id];
 state.pollDetail=detail;
 openModal('poll-detail');
 try{
   const vote=await firebase.getDoc(ref(...path,'votes',uid));
   if(state.pollDetail!==detail||me()!==uid||!pollMember(groupId))return;
   detail.choice=vote.data()?.option||null;
   if(detail.choice||pollClosed(poll)){
     const tally=ref(...path,'totals','main');
     detail.totals=await firebase.runTransaction(db,async transaction=>(await transaction.get(tally)).data());
   }
 }catch(error){detail.error=friendlyError(error);}
 finally{
   detail.loading=false;
   if(state.pollDetail===detail&&state.modal==='poll-detail')render();
 }
}
function renderCommunityMute(groupId){
 if(!state.mutedCommunitiesLoaded)return '';
 const muted=state.mutedCommunityIds.has(groupId);
 return `<button class="btn btn-outline btn-small" data-action="toggle-community-notices" data-id="${esc(groupId)}"
 aria-label="${muted?'Reativar avisos':'Silenciar avisos'} desta comunidade">${icon('bell')} ${muted?'Reativar avisos':'Silenciar avisos'}</button>`;
}
const productFeedbackKinds={problem:'Problema',suggestion:'Sugestão'};
const productFeedbackStatuses={new:'Novo','in-review':'Em análise',resolved:'Resolvido'};
const feedbackResolutionChoices={helped:'Sim', 'needs-help':'Ainda preciso de ajuda'};
function renderMyProductFeedback(){
 const entries=state.myProductFeedback;
 return modalWrap('Meus feedbacks',`<div class="form-stack">${!entries?'<p class="tip">Carregando seus feedbacks…</p>':entries.length?entries.map(item=>`<article class="card" style="padding:12px">
 <div class="toggle-row"><strong>${productFeedbackKinds[item.category]||'Feedback'}</strong><span class="pill">${productFeedbackStatuses[item.status]||'Novo'}</span></div>
 <p class="post-copy" style="margin:6px 0">${esc(short(item.message,145))}</p>
 <button class="text-action" data-action="view-my-feedback" data-id="${esc(item.id)}">Ver feedback</button></article>`).join(''):'<p class="tip">Você ainda não enviou feedback.</p>'}</div>`);
}
function openMyProductFeedback(id){
 if(!state.myProductFeedback?.some(item=>item.id===id))return;
 state.selectedFeedbackId=id;
 openFeedbackSupplements(id,'my-feedback-detail');
}
function feedbackSupplementsRef(id){
 return firebase.collection(db,'artifacts',PROJECT,'productFeedback',id,'supplements');
}
function openFeedbackSupplements(id,modal){
 state.feedbackSupplements={id,modal,entries:[],last:null,more:true,loading:false,error:''};
 openModal(modal);
 if(firebase?.getDocs)void loadFeedbackSupplements();
}
async function loadFeedbackSupplements(){
 const detail=state.feedbackSupplements,uid=me();
 if(!detail||detail.loading||!detail.more||!uid||state.modal!==detail.modal)return;
 if(detail.modal==='feedback-admin-detail'&&!state.feedbackAdmin)return;
 detail.loading=true;detail.error='';render();
 try{
   const filters=[firebase.orderBy('createdAt','desc'),firebase.limit(20)];
   if(detail.last)filters.push(firebase.startAfter(detail.last));
   const result=await firebase.getDocs(firebase.query(feedbackSupplementsRef(detail.id),...filters));
   if(me()!==uid||state.feedbackSupplements!==detail)return;
   for(const doc of result.docs){
     if(!detail.entries.some(item=>item.id===doc.id))detail.entries.push({...doc.data(),id:doc.id});
   }
   detail.last=result.docs.at(-1)||detail.last;
   detail.more=result.docs.length===20;
 }catch(error){detail.error=friendlyError(error);}
 finally{
   detail.loading=false;
   if(state.feedbackSupplements===detail&&state.modal===detail.modal)render();
 }
}
function renderFeedbackSupplements(){
 const detail=state.feedbackSupplements;
 if(!detail)return '';
 return `<section class="form-stack" aria-label="Complementos"><strong>Complementos</strong>
 ${detail.entries.map(item=>`<article class="card" style="padding:12px"><small>${item.createdAt?esc(new Date(item.createdAt.toMillis()).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})):'Aguardando data de envio'}</small>
 <p class="post-copy" style="margin:4px 0 0">${esc(item.message)}</p></article>`).join('')}
 ${detail.error?`<p class="tip">${esc(detail.error)}</p>`:detail.loading?'<p class="tip">Carregando complementos…</p>':detail.entries.length?'':'<p class="tip">Nenhum complemento ainda.</p>'}
 ${detail.more&&!detail.loading?`<button class="text-action" data-action="load-feedback-supplements">${detail.error?'Tentar novamente':'Ver mais complementos'}</button>`:''}</section>`;
}
function hasFeedbackAdminRole(){
 return Boolean(state.feedbackAdminRole?.active===true&&state.user?.email&&state.user.email===state.feedbackAdminRole.email);
}
function updateFeedbackAdminAccess(){
 state.feedbackAdmin=hasFeedbackAdminRole()&&state.user.emailVerified===true;
 if(!state.feedbackAdmin)state.productFeedbackQueue=null;
}
async function loadProductFeedback(){
 const queue=state.productFeedbackQueue,uid=me();
 if(!queue||queue.loading||!state.feedbackAdmin||!queue.more)return;
 queue.loading=true;queue.error='';render();
 try{
   const filters=queue.category==='attention'
     ?[firebase.where('status','==','resolved'),firebase.where('resolutionChoice','==','needs-help')]
     :queue.category==='supplements'?[firebase.where('hasUnreadSupplements','==',true)]
     :[firebase.orderBy('createdAt','desc')];
   filters.push(firebase.limit(40));
   if(queue.last)filters.push(firebase.startAfter(queue.last));
   const entries=await firebase.getDocs(firebase.query(firebase.collection(db,'artifacts',PROJECT,'productFeedback'),...filters));
   if(me()!==uid||state.productFeedbackQueue!==queue)return;
   queue.entries.push(...entries.docs.map(doc=>({...doc.data(),id:doc.id})));
   queue.last=entries.docs.at(-1)||queue.last;
   queue.more=entries.docs.length===40;
 }catch(error){queue.error=friendlyError(error);}
 finally{
   queue.loading=false;
   if(state.productFeedbackQueue===queue&&state.modal==='product-feedback-admin')render();
 }
}
function resetProductFeedbackQueue(category=''){
 state.productFeedbackQueue={entries:[],category,last:null,more:true,loading:false,error:''};
}
function feedbackNeedsAttention(item){
 return item?.status==='resolved'&&item.resolutionChoice==='needs-help';
}
function renderFeedbackResolution(item){
 return item.resolution
   ?`<div><strong>Resposta da equipe</strong><p class="post-copy" style="margin:0">${esc(item.resolution)}</p></div>`:'';
}
function renderFeedbackResolutionChoice(item){
 const choice=Object.hasOwn(feedbackResolutionChoices,item.resolutionChoice)&&feedbackResolutionChoices[item.resolutionChoice];
 return choice?`<p class="tip">Resposta do autor: ${choice}</p>`:'';
}
async function answerFeedbackResolution(id,choice){
 await attempt(async()=>{
   const uid=me(),item=state.myProductFeedback?.find(entry=>entry.id===id);
   if(!uid||state.modal!=='my-feedback-detail'||state.selectedFeedbackId!==id||
      item?.status!=='resolved'||!item.resolution||item.resolutionChoice||
      !Object.hasOwn(feedbackResolutionChoices,choice))return;
   const target=firebase.doc(db,'artifacts',PROJECT,'productFeedback',id);
   await firebase.runTransaction(db,async transaction=>{
     const current=(await transaction.get(target)).data();
     if(current?.authorId!==uid||current.status!=='resolved'||current.resolutionChoice||
        !current.reviewedAt?.isEqual(item.reviewedAt)){
       throw new Error('O feedback foi atualizado. Confira o estado atual e tente novamente.');
     }
     transaction.update(target,{resolutionChoice:choice});
   });
   if(me()===uid)showToast('Sua resposta foi registrada.');
 });
}
function renderProductFeedbackAdmin(){
 if(!state.feedbackAdmin)return modalWrap('Painel de feedback','<p>Este painel é restrito à administração.</p>');
 const queue=state.productFeedbackQueue;
 const attention=queue?.category==='attention';
 const supplements=queue?.category==='supplements';
 const entries=queue?.entries.filter(item=>attention?feedbackNeedsAttention(item):supplements?item.hasUnreadSupplements===true:!queue.category||item.category===queue.category)||[];
 return modalWrap('Painel de feedback',`<div class="form-stack">
 <div class="filters" role="group" aria-label="Filtrar feedback">${[['','Todos'],['problem','Problemas'],['suggestion','Sugestões'],['attention','Precisa de atenção'],['supplements','Novos complementos']].map(([id,label])=>`<button class="filter ${queue?.category===id?'active':''}" data-action="product-feedback-category" data-value="${id}" aria-pressed="${queue?.category===id}">${label}</button>`).join('')}</div>
 ${attention||supplements?`<button class="text-action" data-action="refresh-feedback-queue" ${queue.loading||state.busy?'disabled':''}>Atualizar fila</button>`:''}
 ${entries.map(item=>`<article class="card form-stack" style="padding:14px">
 <div class="toggle-row"><strong>${productFeedbackKinds[item.category]||'Feedback'}</strong><small>${when(item.createdAt?.toMillis?.())}</small></div>
 <p class="post-copy" style="margin:0">${esc(item.message)}</p>
 ${renderFeedbackResolution(item)}
 ${renderFeedbackResolutionChoice(item)}
 <button class="text-action" data-action="view-admin-feedback-detail" data-id="${esc(item.id)}">Ver complementos</button>
 ${supplements?'':attention?`<button class="btn btn-primary btn-small" data-action="resume-feedback-review" data-id="${esc(item.id)}" ${state.busy?'disabled':''}>Retomar análise</button>`:queue.resolutionId===item.id&&item.status!=='resolved'?`<form id="product-feedback-resolution-form" data-draft="true" data-draft-key="feedback-resolution-${esc(item.id)}" class="form-stack">
 <label class="field">Resposta da equipe (opcional)<textarea class="input" id="feedback-resolution-text" name="resolution" maxlength="600" rows="3"></textarea></label>
 <button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>Marcar como resolvido</button>
 <button class="btn btn-outline" type="button" data-action="cancel-feedback-resolution" ${state.busy?'disabled':''}>Cancelar</button>
 </form>`:`<label class="field">Estado<select class="select" id="feedback-status-${esc(item.id)}" data-feedback-status="${esc(item.id)}" ${state.busy?'disabled':''}>
 ${Object.entries(productFeedbackStatuses).map(([id,label])=>`<option value="${id}" ${item.status===id?'selected':''}>${label}</option>`).join('')}
 </select></label>`}</article>`).join('')}
 ${queue?.error?`<p class="tip">${esc(queue.error)}</p>`:queue?.loading?'<p class="tip">Carregando feedback…</p>':entries.length?'':supplements?'<p class="tip">Nenhum complemento novo.</p>':attention?'<p class="tip">Nenhum feedback precisa de atenção nesta lista.</p>':'<p class="tip">Nenhum item para exibir.</p>'}
 ${queue?.more?`<button class="btn btn-outline btn-small" data-action="load-product-feedback" ${queue.loading?'disabled':''}>${queue.error?'Tentar novamente':'Carregar mais'}</button>`:''}</div>`);
}
async function markFeedbackSupplementsRead(){
 await attempt(async()=>{
   const queue=state.productFeedbackQueue,detail=state.feedbackSupplements,uid=me();
   if(!uid||!state.feedbackAdmin||state.modal!=='feedback-admin-detail'||!detail)return;
   const entry=queue?.entries.find(item=>item.id===detail.id);
   if(!entry?.hasUnreadSupplements||!detail.entries.some(item=>item.id===entry.lastSupplementId))return;
   const target=firebase.doc(db,'artifacts',PROJECT,'productFeedback',entry.id);
   const current=await firebase.runTransaction(db,async transaction=>{
     const item=(await transaction.get(target)).data();
     if(item?.hasUnreadSupplements&&item.lastSupplementId===entry.lastSupplementId){
       transaction.update(target,{hasUnreadSupplements:false});
       return {hasUnreadSupplements:false,lastSupplementId:item.lastSupplementId};
     }
     return {hasUnreadSupplements:item?.hasUnreadSupplements===true,lastSupplementId:item?.lastSupplementId};
   });
   if(me()!==uid||state.productFeedbackQueue!==queue||state.feedbackSupplements!==detail||state.modal!==detail.modal)return;
   Object.assign(entry,current);
   if(current.hasUnreadSupplements){
     openFeedbackSupplements(entry.id,detail.modal);
     showToast('Chegou outro complemento. Confira antes de marcar como lidos.');
   }else{
     showToast('Complementos marcados como lidos.');
   }
 });
}
async function resumeFeedbackReview(id){
 await attempt(async()=>{
   const queue=state.productFeedbackQueue,uid=me();
   if(!state.feedbackAdmin||state.modal!=='product-feedback-admin'||queue?.category!=='attention'||
      !feedbackNeedsAttention(queue.entries.find(item=>item.id===id)))return;
   const target=firebase.doc(db,'artifacts',PROJECT,'productFeedback',id);
   const resumed=await firebase.runTransaction(db,async transaction=>{
     if(!feedbackNeedsAttention((await transaction.get(target)).data()))return false;
     transaction.update(target,{status:'in-review',reviewedAt:firebase.serverTimestamp(),reviewedBy:uid});
     return true;
   });
   if(me()!==uid||state.productFeedbackQueue!==queue)return;
   queue.entries=queue.entries.filter(item=>item.id!==id);
   showToast(resumed?'Análise retomada.':'Este feedback já saiu da fila.');
 });
}
async function updateProductFeedbackStatus(id,status,resolution=''){
 await attempt(async()=>{
   const queue=state.productFeedbackQueue,uid=me();
   if(!state.feedbackAdmin||state.modal!=='product-feedback-admin'||!Object.hasOwn(productFeedbackStatuses,status))return;
   const entry=queue?.entries.find(item=>item.id===id);
   if(!entry||entry.status===status)return;
   if(resolution.length>600)throw new Error('A resposta pode ter até 600 caracteres.');
   await firebase.updateDoc(firebase.doc(db,'artifacts',PROJECT,'productFeedback',id),{
     status,reviewedAt:firebase.serverTimestamp(),reviewedBy:uid,
     ...(status==='resolved'?{resolution,resolutionChoice:''}:{})
   });
   if(me()!==uid||state.productFeedbackQueue!==queue)return;
   entry.status=status;
   if(status==='resolved'){
     entry.resolution=resolution;
     entry.resolutionChoice='';
     if(queue.resolutionId===id){
       const input=document.getElementById('feedback-resolution-text');
       if(input)input.value='';
       state.drafts.delete('feedback-resolution-'+id);
       queue.resolutionId=null;
     }
   }
   showToast('Estado do feedback atualizado.');
 });
}
// Add new entries first, with a unique ID for each update.
const productNews=[
 {id:'feedback-responses',date:'2026-11-23',title:'Respostas da equipe aos feedbacks',
  summary:'Ao resolver um feedback, a equipe pode deixar uma resposta privada. Se houver uma resposta, você pode abri-la pelo aviso no sino.',
  action:'my-product-feedback',label:'Abrir meus feedbacks'}
];
const productNewsDate=new Intl.DateTimeFormat('pt-BR',{dateStyle:'long',timeZone:'UTC'});
function renderProductNews(){
 return modalWrap('Novidades',`<div class="form-stack">${productNews.map(item=>`<article class="card form-stack" style="padding:14px">
 <time class="muted" datetime="${esc(item.date)}">${productNewsDate.format(new Date(item.date))}</time>
 <strong>${esc(item.title)}</strong><p class="post-copy" style="margin:0">${esc(item.summary)}</p>
 <button class="text-action" data-action="${esc(item.action)}">${esc(item.label)}</button>
 </article>`).join('')}</div>`);
}
function renderPostComment(comment,belongsToGroup,canModerate){
 const id=esc(comment.id),own=Boolean(me()&&comment.userId===me());
 const editor=own&&state.commentEditor?.id===comment.id?state.commentEditor:null;
 return `<div class="comment">${avatar({avatar:member(comment.userId)?.avatar||'💬'})}
 <div class="comment-body"><strong>${esc(member(comment.userId)?.name||comment.userName||'Pessoa')}</strong>
 ${editor?.editing?`<form id="edit-comment-form" data-draft="true" data-draft-key="edit-comment:${esc(state.selectedPost)}:${id}" class="form-stack">
 <label class="field">Texto do comentário<textarea id="edit-comment-text" class="textarea" name="text" required maxlength="800">${esc(comment.text)}</textarea></label>
 <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="text-action" data-action="close-comment-options">Cancelar</button>
 <button type="submit" class="btn btn-primary btn-small" ${state.busy?'disabled':''}>Salvar alterações</button></div></form>`:`<p>${esc(comment.text)}</p>`}
 <small>${when(comment.createdAt)}${comment.editedAt?' · Editado':''}</small>
 ${belongsToGroup&&!own?` <button class="text-action" data-action="report-group-comment" data-id="${id}">Denunciar comentário</button>`:''}
 ${editor&&!editor.editing?`<div class="toggle-row" style="flex-wrap:wrap">
 <button class="text-action" data-action="edit-comment" data-id="${id}">Editar comentário</button>
 <button class="text-action" data-action="${canModerate?'moderate-comment':'delete-comment'}" data-id="${id}">${canModerate?'Remover comentário com motivo':'Excluir comentário'}</button></div>`:''}</div>
 ${own?`<button class="post-action" data-action="comment-options" data-id="${id}" aria-label="Opções do comentário" aria-expanded="${Boolean(editor)}">⋯</button>`
 :canModerate?`<button data-action="moderate-comment" data-id="${id}" aria-label="Remover comentário com motivo">${icon('trash')}</button>`:''}
 </div>`;
}
function renderModal() {
 if(state.modal==='post-options'||state.modal==='edit-post'){
   const post=state.posts.find(item=>item.id===state.postEditor?.id&&item.userId===me());
   if(!post)return modalWrap('Publicação indisponível','<p>Esta publicação não está mais disponível.</p>');
   if(state.modal==='post-options')return modalWrap('Opções da publicação',`<div class="form-stack">
   <button class="btn btn-primary" data-action="edit-post" data-id="${esc(post.id)}">Editar publicação</button>
   <button class="btn btn-outline" data-action="delete-post" data-id="${esc(post.id)}">Excluir publicação</button>
   <button class="text-action" data-action="return-to-post">Voltar</button></div>`);
   return modalWrap('Editar publicação',`<form id="edit-post-form" data-draft="true" data-draft-key="edit-post:${esc(post.id)}" class="form-stack">
   <label class="field">Texto da publicação<textarea class="textarea" id="edit-post-content" name="content" required maxlength="2000">${esc(post.content)}</textarea></label>
   <div class="form-actions"><button class="btn btn-ghost" type="button" data-action="return-to-post">Cancelar</button>
   <button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>Salvar alterações</button></div></form>`);
 }
 if(state.modal==='event-conflict'){
   const event=state.events.find(item=>item.id===state.eventConflict?.id);
   const conflicts=event?conflictingEvents(event):[];
   const available=event&&event.cancelled!==true&&viewerEventSchedule(event).date>=today()&&!event.attendees?.includes(me());
   return modalWrap('Conflito de horário',`<div class="form-stack">
   ${conflicts.length?`<p>Você já confirmou presença em outro encontro no mesmo horário.</p>
   <ul>${conflicts.map(other=>`<li><button class="text-action" data-action="view-event" data-id="${esc(other.id)}">${esc(other.title)}</button></li>`).join('')}</ul>`:'<p>O horário ou a disponibilidade do encontro mudou.</p>'}
   <div class="toggle-row" style="flex-wrap:wrap"><button class="btn btn-outline" data-action="cancel-event-conflict">Voltar</button>
   ${available?`<button class="btn btn-primary" data-action="confirm-event-conflict" data-id="${esc(event.id)}" ${state.busy?'disabled':''}>${conflicts.length?'Confirmar mesmo assim':'Continuar confirmação'}</button>`:''}</div></div>`);
 }
 if(!state.modal)return '';
 if(state.modal==='product-news')return renderProductNews();
 if(state.modal==='my-product-feedback')return renderMyProductFeedback();
 if(state.modal==='feedback-admin-detail'){
   const item=state.feedbackAdmin&&state.productFeedbackQueue?.entries.find(entry=>entry.id===state.feedbackSupplements?.id);
   return modalWrap('Detalhes do feedback',item?`<div class="form-stack">
   <span class="pill">${productFeedbackStatuses[item.status]||'Novo'}</span>
   <p class="post-copy" style="margin:0">${esc(item.message)}</p>
   ${renderFeedbackResolution(item)}${renderFeedbackResolutionChoice(item)}${renderFeedbackSupplements()}
   ${item.hasUnreadSupplements&&state.feedbackSupplements.entries.some(entry=>entry.id===item.lastSupplementId)?`<button class="btn btn-primary btn-small" data-action="read-feedback-supplements" ${state.busy?'disabled':''}>Marcar complementos como lidos</button>`:''}
   <button class="text-action" data-action="back-feedback-admin">Voltar ao painel</button></div>`:'<p>Este feedback está indisponível.</p>');
 }
 if(state.modal==='my-feedback-detail'){
   const item=state.myProductFeedback?.find(entry=>entry.id===state.selectedFeedbackId);
   return modalWrap('Meu feedback',item?`<div class="form-stack"><div class="toggle-row"><strong>${productFeedbackKinds[item.category]||'Feedback'}</strong>
   <span class="pill">${productFeedbackStatuses[item.status]||'Novo'}</span></div><p class="post-copy" style="margin:0">${esc(item.message)}</p>
   ${renderFeedbackResolution(item)}
   ${renderFeedbackResolutionChoice(item)}
   ${renderFeedbackSupplements()}
   ${item.status==='in-review'?`<form class="form-stack" id="feedback-supplement-form" data-draft="true" data-draft-key="feedback-supplement-${esc(item.id)}">
   <label class="field">Complementar feedback<textarea class="input" name="message" rows="3" required minlength="3" maxlength="600"></textarea></label>
   <button class="btn btn-primary btn-small" type="submit" ${state.busy?'disabled':''}>Enviar complemento</button></form>`:''}
   ${item.status==='resolved'&&item.resolution&&!item.resolutionChoice?`<div class="form-stack"><strong>Isso resolveu?</strong>
   <div class="toggle-row" style="flex-wrap:wrap">${Object.entries(feedbackResolutionChoices).map(([choice,label])=>`<button class="btn btn-outline btn-small" data-action="answer-feedback-resolution" data-id="${esc(item.id)}" data-value="${choice}" ${state.busy?'disabled':''}>${label}</button>`).join('')}</div></div>`:''}
   <button class="text-action" data-action="my-product-feedback">Voltar aos meus feedbacks</button></div>`:'<p>Este feedback está indisponível.</p>');
 }
 if(state.modal==='product-feedback-admin')return renderProductFeedbackAdmin();
 if(state.modal==='feedback-admin-verification')return modalWrap('Ativar painel de feedback',`<div class="form-stack">
 <p>Confirme o e-mail da sua conta para abrir o painel administrativo. Depois de clicar no link do e-mail, volte aqui e toque em <strong>Já confirmei</strong>.</p>
 <button class="btn btn-primary" data-action="send-feedback-verification">Enviar e-mail de confirmação</button>
 <button class="btn btn-outline" data-action="refresh-feedback-verification">Já confirmei</button></div>`);
 if(state.modal==='product-feedback')return modalWrap('Enviar feedback',`<form id="product-feedback-form" data-draft="true" class="form-stack">
 <label class="field">Tipo de feedback<select class="select" name="category" required>
 <option value="">Selecione uma opção</option><option value="problem">Relatar um problema</option><option value="suggestion">Sugerir uma melhoria</option>
 </select></label>
 <label class="field">Sua mensagem<textarea class="textarea" name="message" required minlength="3" maxlength="600" placeholder="Conte o que aconteceu ou o que podemos melhorar."></textarea></label>
 <p class="tip">A mensagem vai para a administração do HobbyHub. Evite incluir senhas ou dados pessoais.</p>
 <div class="form-actions"><button class="btn btn-ghost" type="button" data-action="close">Cancelar</button>
 <button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>Enviar feedback</button></div></form>`);
 if(state.modal==='group-polls')return renderGroupPolls();
 if(state.modal==='poll-detail')return renderPoll();
 if(state.modal==='poll-create'){
   const group=state.groups.find(item=>item.id===state.selectedGroup);
   if(!pollMember(group?.id)||!canManageGroup(group))return modalWrap('Enquete indisponível','<p>A criação de enquetes é restrita ao criador e a moderadores ativos.</p>');
   return modalWrap('Criar enquete',`<form id="poll-form" data-draft="true" class="form-stack">
   <label class="field">Pergunta<input class="input" name="question" required minlength="3" maxlength="160"></label>
   ${pollOptions.map((key,index)=>`<label class="field">Opção ${index+1}${index>1?' (opcional)':''}<input class="input" name="${key}" maxlength="80" ${index<2?'required':''}></label>`).join('')}
   <label class="field">Encerrar em<select class="select" name="days"><option value="1">1 dia</option><option value="3">3 dias</option><option value="7">7 dias</option></select></label>
   <div class="form-actions"><button class="btn btn-ghost" type="button" data-action="group-polls" data-id="${esc(group.id)}">Voltar</button><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>Publicar enquete</button></div></form>`);
 }

 if(state.modal==='notifications')return renderNotifications();
 if(state.modal==='notification-settings')return renderNotificationSettings();
 if(state.modal==='first-visit')return renderFirstVisit();
 if(state.modal==='group-report-queue')return renderGroupReportQueue(state.groups.find(group=>group.id===state.selectedGroup));
 if(state.modal==='moderation-history')return renderModerationHistory(state.groups.find(group=>group.id===state.selectedGroup));
 if(state.modal==='moderate-post'){
   const target=state.groupRemoval;
   const group=state.groups.find(item=>item.id===target?.groupId);
   const post=state.posts.find(item=>item.id===target?.postId&&item.groupId===group?.id);
   const comment=target?.commentId?state.comments.find(item=>item.id===target.commentId):null;
   const isComment=Boolean(target?.commentId);
   const label=isComment?'comentário':'publicação';
   if((!target?.reportId&&(!post||(isComment&&!comment)))||!canManageGroup(group))return modalWrap('Remoção indisponível','<p>Este conteúdo não pode ser moderado agora.</p>');
   return modalWrap(`Remover ${label}`,`<form id="moderate-post-form" data-draft="true" class="form-stack">
   <p>${esc(short(target.reportId?target.preview:isComment?comment.text:post.content,220))}</p><label class="field">Motivo da remoção<textarea class="textarea" name="reason" required maxlength="300"></textarea></label>
   <p class="tip">${isComment?'O comentário ficará oculto. O criador pode restaurá-lo pelo histórico.':'A publicação e os comentários ficarão ocultos. O criador pode restaurá-los pelo histórico.'}</p>
   <div class="form-actions"><button class="btn btn-ghost" type="button" data-action="${target.reportId?'group-report-queue':isComment?'comments':'view-group'}" data-id="${esc(target.reportId?group.id:isComment?post.id:group.id)}">Voltar</button><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>Remover ${label}</button></div></form>`);
 }
 if(state.modal==='event-detail'){
   const event=state.events.find(item=>item.id===state.selectedEvent);
   if(!event)return modalWrap('Evento indisponível','<p>Este evento não está mais disponível.</p>');
   const group=state.groups.find(item=>item.id===event.groupId);
   const joined=group?.members?.includes(me());
   return modalWrap(event.title,`${eventCard(event,false,true)}
   ${event.revision>0?`<ul class="tip" style="padding-left:28px">${eventChangeDescriptions(event).map(change=>`<li>${esc(change)}</li>`).join('')}</ul>`:''}
   ${group&&!joined&&event.cancelled!==true&&event.date>=today()?`<div class="card" style="margin:12px 0;padding:12px"><p>Participe de ${esc(group.name)} para confirmar presença.</p><button class="btn btn-primary btn-small" data-action="join-group" data-id="${esc(group.id)}">Participar da comunidade</button></div>`:''}
   <div class="toggle-row" style="margin-top:14px;flex-wrap:wrap"><button class="btn btn-outline btn-small" data-action="copy-event-link" data-id="${esc(event.id)}">Copiar link do evento</button>${eventRecapButton(event)}${eventCalendarButton(event)}</div>
   ${renderEventRoom(event)}
   ${canExportEventCalendar(event)?'<p class="tip" style="margin-top:12px">Abra o arquivo .ics baixado para salvar o evento no seu calendário.</p>':''}
   ${canRepeatEvent(event)?`<button class="btn btn-primary btn-small" data-action="repeat-event" data-id="${esc(event.id)}">Repetir evento</button>`:''}
   ${event.createdBy===me()&&event.cancelled!==true?`<button class="btn btn-outline btn-small" data-action="edit-event" data-id="${esc(event.id)}">Editar evento</button><button class="btn btn-ghost btn-small" data-action="cancel-event" data-id="${esc(event.id)}">Cancelar evento</button>`:''}</div>
   ${event.cancelled===true||event.revision>0?'<p class="tip" style="margin-top:12px">Se você adicionou este evento a um calendário, atualize ou remova a cópia por lá.</p>':''}
   ${renderEventOrganizerPanel(event)}${renderEventBulletins(event)}${renderEventQuestions(event)}${event.createdBy!==me()?renderEventFeedback(event):''}`);
 }
 if(state.modal==='event-edit'){
   const event=state.events.find(item=>item.id===state.selectedEvent);
   if(!event||event.createdBy!==me()||event.cancelled===true)return modalWrap('Edição indisponível','<p>Este evento não pode ser editado.</p>');
   return modalWrap('Editar evento',`<form id="event-edit-form" data-draft="true" class="form-stack">
     <label class="field">Data<input class="input" type="date" name="date" required min="${today()}" value="${esc(event.date)}"></label>
     <label class="field">Horário de início<input class="input" type="time" name="time" required value="${esc(event.time)}"></label>
     <label class="field">Horário de término (opcional)<input class="input" type="time" name="endTime" value="${esc(event.endTime||'')}"></label>
     ${eventFormatFields(eventFormat(event),eventFormat(event)==='in-person'?event.location:'',state.eventRoom?.id===event.id?state.eventRoom.url:'',event.timeZone)}
     ${state.eventRoom?.id===event.id&&state.eventRoom.error?'<p class="tip">Não foi possível carregar o link da sala. <button type="button" class="text-action" data-action="retry-event-room">Tentar novamente</button></p>':''}
     <div class="form-actions"><button class="btn btn-ghost" type="button" data-action="view-event" data-id="${esc(event.id)}">Voltar</button><button class="btn btn-primary" type="submit" ${state.busy||state.eventRoom?.loading?'disabled':''}>Salvar alterações</button></div>
   </form>`);
 }
 if(state.modal==='compose'){
 const recap=state.events.find(event=>event.id===state.composingRecapId);
 const title=recap?'Relato do encontro':state.composingIntroduction?'Apresente-se à comunidade':state.composingGroup?'Publicar na comunidade':'Criar publicação';
 const key=postDraftKey();
 if(key&&state.pendingPostDraft===key)return modalWrap(title,`<div class="form-stack">
 <p>Você tem um rascunho salvo neste aparelho.</p>
 <button class="btn btn-primary" data-action="continue-post-draft">Continuar escrevendo</button>
 <button class="btn btn-outline" data-action="discard-post-draft">Descartar rascunho</button>
 </div>`);
 return modalWrap(title,`<form id="post-form" data-draft="true" ${key?`data-draft-key="${esc(key)}"`:''} class="form-stack"><div class="toggle-row">${avatar(state.profile)}<div><strong style="font-size:13px">${esc(myName())}</strong><div class="muted mini">Compartilhando com a comunidade</div></div></div>
 ${state.composingGroup?`<span class="pill">${icon('users')} ${esc(state.groups.find(g=>g.id===state.composingGroup)?.name||'Comunidade')}</span>`:''}
 ${recap?'<p class="tip">Conte como foi o encontro, compartilhe dicas ou sugira uma próxima edição.</p>':''}
 <div class="field"><label for="post-content">${state.composingIntroduction?'Como você quer se apresentar?':'O que você gostaria de compartilhar?'}</label><textarea id="post-content" class="textarea" name="content" required maxlength="2000" placeholder="${state.composingIntroduction?'Conte o que você gosta de fazer e o que gostaria de aprender com o grupo.':'Conte sua experiência, uma conquista, uma dúvida ou algo que fez você feliz...'}">${recap?esc(recap.title)+'\n\n':''}</textarea></div>
 <div class="field-grid"><div class="field"><label>Seu interesse</label>${topicSelect(state.composingGroup?state.groups.find(g=>g.id===state.composingGroup)?.hobby:(state.topic==='Todos'?'Arte':state.topic))}</div><div class="field"><label>Formato</label><select class="select" name="format"><option value="text">Post simples</option><option value="highlight">Post em destaque</option></select></div></div>
 <div class="tip">A publicação pode ser vista por outras pessoas cadastradas. Não compartilhe dados pessoais sensíveis.</div>
 ${key?'<p class="mini muted">Seu rascunho é salvo neste aparelho.</p>':''}
 <div class="form-actions"><button class="btn btn-ghost" type="button" data-action="close">Cancelar</button><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>${icon('send')} Publicar</button></div></form>`);
 }
 if(state.modal==='group-detail'){
 const group=state.groups.find(g=>g.id===state.selectedGroup);
 if(!group)return modalWrap('Comunidade indisponível','<p>Esta comunidade não está mais disponível.</p>');
 const joined=(group.members||[]).includes(me());
 const welcoming=state.invitedGroupId===group.id;
 const groupPosts=state.posts.filter(p=>p.groupId===group.id);
 const pinned=groupPosts.find(p=>p.id===group.pinnedPostId);
 const posts=groupPosts.filter(p=>p.id!==pinned?.id).slice(0,15);
 const events=state.events.filter(event=>event.groupId===group.id&&event.date>=today());
 const renderGroupPost=(post,isPinned=false)=>`<article class="card" style="padding:13px;margin-bottom:9px">${isPinned?'<p class="eyebrow">Publicação fixada</p>':''}
 <strong class="mini">${esc(authorName(post))}</strong> ${editedPostLabel(post)}<p class="mini" style="margin:8px 0">${esc(short(post.content,280))}</p>
 ${recapEventButton(post)}
 <div class="toggle-row" style="flex-wrap:wrap"><button class="btn btn-soft btn-small" data-action="comments" data-id="${esc(post.id)}">${icon('chat')} Responder</button>${postOptionsButton(post)}${joined&&post.userId!==me()?`<button class="text-action" data-action="report-post" data-id="${esc(post.id)}">Denunciar publicação</button>`:''}${canManageGroup(group)?`<button class="btn btn-outline btn-small" data-action="${isPinned?'unpin-group-post':'pin-group-post'}" data-id="${esc(post.id)}">${isPinned?'Desafixar':'Fixar no grupo'}</button><button class="text-action" data-action="moderate-post" data-id="${esc(post.id)}">Remover publicação</button>`:''}</div></article>`;
 return modalWrap(group.name,`<div class="cover ${topicColor(group.hobby)}" style="height:126px"><span>${emoji(group.hobby)}</span></div>
 <p class="eyebrow" style="margin:15px 0 8px">${esc(group.hobby)} · ${esc(group.location||'Online')}</p><p class="muted" style="font-size:13px">${esc(group.description||'Encontre pessoas que amam esse hobby.')}</p>
 ${welcoming?`<section class="card" style="padding:16px;margin:14px 0"><h3>${joined?'Faça sua primeira contribuição':'Participe desta comunidade'}</h3>
 <p class="mini muted">${joined?pinned?'Responda à publicação fixada ou se apresente ao grupo.':'Conte ao grupo o que você gosta de fazer e o que quer aprender.':'Entre para publicar, conversar sobre o hobby e conhecer quem já participa.'}</p>
 <div class="toggle-row" style="flex-wrap:wrap">${joined?`${pinned?`<button class="btn btn-primary btn-small" data-action="comments" data-id="${esc(pinned.id)}">Responder à publicação fixada</button>`:''}<button class="btn ${pinned?'btn-outline':'btn-primary'} btn-small" data-action="introduce-group" data-id="${esc(group.id)}">Se apresentar</button>`:`<button class="btn btn-primary btn-small" data-action="join-group" data-id="${esc(group.id)}">Participar</button>`}</div></section>`:''}
 <div class="toggle-row" style="margin:18px 0;flex-wrap:wrap"><span class="pill">${icon('users')} ${(group.members||[]).length} membros</span>${joined||!welcoming?`<button class="btn btn-small ${joined?'btn-outline':'btn-primary'}" data-action="join-group" data-id="${esc(group.id)}">${joined?'Sair do grupo':'+ Participar'}</button>`:''}<button class="btn btn-outline btn-small" data-action="copy-group-invite" data-id="${esc(group.id)}">Copiar convite</button>${joined?`<button class="btn btn-soft btn-small" data-action="group-post" data-id="${esc(group.id)}">${icon('plus')} Publicar</button>`:''}</div>
 ${pinned?renderGroupPost(pinned,true):''}
 ${joined?renderCommunityMute(group.id):''}
 ${renderGroupModeration(group)}
 ${joined?`<div class="section-head"><h2>Enquetes</h2><button class="text-action" data-action="group-polls" data-id="${esc(group.id)}">Ver enquetes</button></div>`:''}
 <div class="section-head"><h2>Próximos eventos</h2>${joined?`<button class="text-action" data-action="group-event" data-id="${esc(group.id)}">${icon('plus')} Criar evento</button>`:''}</div>
 ${events.length?events.map(event=>eventCard(event,true)).join(''):'<p class="tip">Nenhum encontro marcado ainda.</p>'}
 <div class="section-head"><h2>Conversas do grupo</h2><span class="pill">${posts.length} posts recentes</span></div>
 ${posts.length?posts.map(post=>renderGroupPost(post)).join(''):pinned?'':empty('💡','Uma conversa pode começar aqui',joined?'Compartilhe a primeira publicação da comunidade.':'Participe para trocar ideias com esta comunidade.',joined?'Publicar no grupo':'',joined?'group-post':'group')}
 `);
 }
 if(state.modal==='group')return modalWrap('Criar comunidade',`<form id="group-form" data-draft="true" class="form-stack"><div class="field"><label>Nome do grupo</label><input class="input" name="name" required minlength="3" maxlength="75" placeholder="Ex.: Fotógrafos da Serra"></div><div class="field"><label>Principal hobby</label>${topicSelect()}</div><div class="field"><label>Descrição</label><textarea class="textarea" name="description" maxlength="600" required placeholder="Que tipo de experiências vocês querem compartilhar?"></textarea></div><div class="field"><label>Cidade ou região</label><input class="input" name="location" maxlength="90" value="${esc(myLocation())}" required></div><div class="form-actions"><button class="btn btn-ghost" type="button" data-action="close">Cancelar</button><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>Criar grupo ${icon('arrow')}</button></div></form>`);
 if(state.modal==='event'){
 const eventGroup=state.groups.find(group=>group.id===state.eventGroupId);
 const template=state.eventTemplate;
 const fromPoll=template?.source==='poll';
 const guidance=fromPoll?(template.title?'Revise o título sugerido pela enquete e preencha os detalhes do encontro.':'A enquete terminou sem uma opção vencedora. Escolha um título e preencha os detalhes do encontro.')
   :template?'Escolha uma nova data e um horário. Os participantes confirmam presença novamente.':'';
 return modalWrap(template&&!fromPoll?'Nova edição do evento':eventGroup?`Evento em ${eventGroup.name}`:'Organizar encontro',`<form id="event-form" data-draft="true" class="form-stack">${guidance?`<p class="tip">${guidance}</p>`:''}<div class="field"><label>Título do evento</label><input class="input" name="title" maxlength="90" minlength="3" required placeholder="Ex.: Caminhada fotográfica na praça" value="${esc(template?.title)}"></div>
 <div class="field-grid"><div class="field"><label>Dia</label><input class="input" type="date" name="date" required min="${today()}"></div><label class="field">Horário de início<input class="input" name="time" type="time" required></label></div>
 <label class="field">Horário de término (opcional)<input class="input" name="endTime" type="time"></label>
 <div class="field"><label>Interesse</label>${topicSelect(template?.hobby||eventGroup?.hobby)}</div>
 ${eventFormatFields(template?eventFormat(template):'in-person',template&&eventFormat(template)==='in-person'?template.location:'','',template?.timeZone)}
 <label class="field">Número de vagas (opcional)<input class="input" type="number" name="capacity" min="2" max="200" step="1" value="${esc(template?.capacity)}" placeholder="Em branco para vagas ilimitadas"></label>
 <div class="field"><label>Descrição</label><textarea class="textarea" name="description" maxlength="800" required placeholder="O que vai acontecer e o que as pessoas precisam saber?">${esc(template?.description)}</textarea></div>
 <div class="tip">Por segurança, prefira locais públicos. O HobbyHub não verifica automaticamente a identidade de participantes.</div>
 <div class="form-actions"><button class="btn btn-ghost" type="button" data-action="close">Cancelar</button><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>Criar evento</button></div></form>`);
 }
 if(state.modal==='edit-profile'){
 const p=state.profile;
 return modalWrap('Editar perfil',`<form id="profile-form" data-draft="true" class="form-stack"><div class="field-grid"><div class="field"><label>Seu nome</label><input class="input" name="name" value="${esc(p.name)}" maxlength="60" required></div><div class="field"><label>Avatar (emoji)</label><input class="input" name="avatar" value="${esc(p.avatar)}" maxlength="8" required></div></div>
 <div class="field"><label>Sua cidade ou região</label><input class="input" name="location" value="${esc(p.location)}" maxlength="90" required></div><div class="field"><label>Um pouco sobre você</label><textarea class="textarea" name="bio" maxlength="300">${esc(p.bio)}</textarea></div>
 <div class="field"><label>Seus hobbies (separados por vírgula)</label><input class="input" name="hobbies" maxlength="240" value="${esc((p.hobbies||[]).join(', '))}" placeholder="Fotografia, Leitura, Games"></div>
 <label class="field">Link HTTPS da foto (opcional)<input class="input" type="url" name="photoUrl" maxlength="1500" value="${esc(p.photoUrl||'')}" placeholder="https://…/foto.jpg"></label>
 <label class="field">Link HTTPS do vídeo (opcional)<input class="input" type="url" name="videoUrl" maxlength="1500" value="${esc(p.videoUrl||'')}" placeholder="https://…/video.mp4"></label>
 <div class="form-actions"><button class="btn btn-ghost" type="button" data-action="close">Cancelar</button><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>Salvar alterações</button></div></form>`);
 }
 if(state.modal==='comments'){
 const post=state.posts.find(p=>p.id===state.selectedPost);
 if(!post)return modalWrap('Publicação indisponível','<p>Esta publicação não está disponível no momento.</p>');
 const canModerate=post?.groupId&&canManageGroup(state.groups.find(group=>group.id===post.groupId));
 const belongsToGroup=state.groups.find(group=>group.id===post.groupId)?.members?.includes(me());
 return modalWrap('Conversas sobre a publicação',`<div class="card" style="padding:15px;margin-bottom:19px"><div class="toggle-row"><strong style="font-size:12px">${esc(authorName(post))}</strong>${editedPostLabel(post)}${postOptionsButton(post)}</div><p class="post-copy" style="margin:8px 0 0">${esc(post.content)}</p>${recapEventButton(post)}</div>
 <div class="comment-list">${state.comments.length?state.comments.map(comment=>renderPostComment(comment,belongsToGroup,canModerate)).join(''):'<p class="tip">Ainda não há comentários. Comece a conversa!</p>'}</div>
 <form id="comment-form" data-draft="true" data-draft-key="${esc(`comment:${me()}:${state.selectedPost}`)}" class="form-stack"><div class="field"><textarea class="textarea" style="min-height:85px" name="text" required maxlength="800" placeholder="Escreva um comentário acolhedor..."></textarea></div><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>${icon('send')} Enviar comentário</button></form>`);
 }
 if(state.modal==='quiz'){
 const categories={creative:['Arte','Fotografia','Música'],curious:['Leitura','Tecnologia','Games'],social:['Gastronomia','Esportes','Viagens'],calm:['Natureza','Bem-estar','Fotografia']};
 const labels={creative:'Quero criar algo',curious:'Quero aprender',social:'Quero conhecer pessoas',calm:'Quero desacelerar'};
 const picks=categories[state.quizMood]||[];
 return modalWrap('Descubra um novo hobby',`<p class="muted" style="font-size:13px">Qual dessas experiências combina mais com o seu momento?</p>
 <div class="grid-two">${Object.keys(labels).map(k=>`<button class="topic ${state.quizMood===k?'active':''}" data-action="quiz-mood" data-value="${k}" style="white-space:normal;justify-content:center;min-height:73px">${esc(labels[k])}</button>`).join('')}</div>
 ${picks.length?`<div class="section-head"><h2>Que tal experimentar...</h2></div><div class="form-stack">${picks.map(k=>`<button class="card" style="padding:12px;display:flex;align-items:center;gap:14px;text-align:left" data-action="quiz-topic" data-topic="${esc(k)}"><span style="font-size:25px">${emoji(k)}</span><strong style="flex:1">${esc(k)}</strong>${icon('arrow')}</button>`).join('')}</div><p class="tip" style="margin-top:15px">Esta é uma sugestão exploratória, não uma avaliação psicológica nem uma recomendação gerada por IA.</p>`:''}`);
 }
 if(state.modal==='person'){
 const person=member(state.viewUser);
 if(!person)return modalWrap('Perfil não encontrado','<p class="tip">Não encontramos esse usuário entre os perfis disponíveis.</p>');
 const followed=state.followingIds.includes(person.uid);
 return modalWrap('Conhecer pessoa',`<div style="text-align:center">${avatar(person,true)}<h2 style="margin:12px 0 5px">${esc(person.name)}</h2><p class="mini muted">${icon('map')} ${esc(person.location||'Brasil')}</p><p class="muted">${esc(person.bio||'Apaixonado por novas experiências!')}</p>
 <div class="interest-row" style="justify-content:center">${(person.hobbies||[]).map(h=>`<span class="pill">${emoji(h)} ${esc(h)}</span>`).join('')}</div>
 ${renderProfileMedia(person)}
 <div class="toggle-row" style="margin-top:25px"><button class="btn ${followed?'btn-outline':'btn-soft'}" data-action="follow" data-id="${esc(person.uid)}">${followed?'Seguindo ✓':'+ Seguir'}</button><button class="btn btn-primary" data-action="open-dm" data-id="${esc(person.uid)}">${icon('chat')} Conversar</button>${blockButton(person.uid)}${reportButton('profile',person.uid,'perfil')}</div></div>
 <div class="section-head"><h2>Depoimentos</h2></div>
 ${state.testimonialStatus?`<p class="tip">${esc(state.testimonialStatus)}</p>`:renderTestimonials(state.visibleTestimonials)}
 ${state.sentTestimonial?`<div class="toggle-row"><small>${state.sentTestimonial.approved?'Seu depoimento está visível.':'Seu depoimento aguarda aprovação.'}</small><button class="text-action" data-action="testimonial-withdraw">Retirar depoimento</button></div>`:state.testimonialStatus?'':`
 <form id="testimonial-form" data-draft="true" class="form-stack"><label class="field">Escrever depoimento<textarea class="textarea" name="text" maxlength="600" required></textarea></label><p class="tip">A pessoa que recebe decide se o depoimento aparece no perfil.</p><button class="btn btn-primary" type="submit">Enviar depoimento</button></form>`}`);
 }
 if(state.modal==='report'&&state.reportTarget){
 const target=state.reportTarget;
 const label={post:'publicação',comment:'comentário',profile:'perfil',testimonial:'depoimento',communityMessage:'mensagem',privateMessage:'mensagem'}[target.targetType];
 return modalWrap(`Denunciar ${label}`,`<p class="tip">${target.groupId?'A denúncia será revisada pela moderação desta comunidade.':target.targetType==='privateMessage'?'A equipe de moderação receberá apenas a mensagem selecionada, o motivo e os detalhes que você incluir.':'A denúncia será revisada pela equipe de moderação.'}</p>
 ${target.targetText?`<blockquote class="card" style="padding:12px;margin:12px 0">${esc(short(target.targetText,280))}</blockquote>`:''}
 <form id="report-form" data-draft="true" class="form-stack"><label class="field">Motivo<select name="reason" class="select"><option>Spam</option><option>Assédio ou ofensa</option><option>Golpe ou fraude</option><option>Conteúdo impróprio</option><option>Outro</option></select></label><label class="field">Detalhes (opcional)<textarea class="textarea" name="details" maxlength="500" placeholder="Descreva o problema..."></textarea></label><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>Enviar denúncia</button></form>`);
 }
 return '';
}
function localDateKey(date) {
 return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function today(){return localDateKey(new Date());}
function tomorrow(date=new Date()){
 return localDateKey(new Date(date.getFullYear(),date.getMonth(),date.getDate()+1));
}
function scheduleEventReminderRefresh(){
 clearTimeout(state.eventReminderTimer);
 const uid=me();
 if(!uid)return;
 const date=new Date();
 const midnight=new Date(date.getFullYear(),date.getMonth(),date.getDate()+1);
 const time=date.toTimeString().slice(0,5);
 const next=confirmedEventsToday(date).map(viewerEventSchedule).find(schedule=>schedule.time>=time);
 let refresh=midnight.getTime();
 if(next){
   const [hour,minute]=next.time.split(':').map(Number);
   const minutesUntilNext=(hour-date.getHours())*60+minute-date.getMinutes();
   refresh=date.getTime()+(minutesUntilNext+1)*60000-date.getSeconds()*1000-date.getMilliseconds();
 }
 state.eventReminderTimer=setTimeout(()=>{
   if(me()!==uid)return;
   scheduleEventReminderRefresh();
   loadHomeEventRooms();
   render();
 },Math.min(refresh,midnight.getTime())-date.getTime());
}
function captureDrafts(){
 document.querySelectorAll('form[data-draft]').forEach(f=>{
   const values={};f.querySelectorAll('input[name],textarea[name],select[name]').forEach(el=>{values[el.name]=el.value;});
   state.drafts.set(f.dataset.draftKey||f.id,values);
 });
}
function postDraftKey(){
 const uid=me();
 if(!uid||state.composingIntroduction||state.composingRecapId)return '';
 const scope=state.composingGroup?'group:'+encodeURIComponent(state.composingGroup):'feed';
 return 'hobbyhub-post-draft:'+encodeURIComponent(uid)+':'+scope;
}
function readPostDraft(key){
 if(!key)return null;
 try{
   const draft=JSON.parse(localStorage.getItem(key)||'null');
   if(typeof draft?.content!=='string'||!draft.content.trim())return null;
   return {content:draft.content.slice(0,2000),hobby:typeof draft.hobby==='string'?draft.hobby:'',format:draft.format==='highlight'?'highlight':'text'};
 }catch{return null;}
}
function removePostDraft(key){
 try{localStorage.removeItem(key);}catch{}
}
function savePostDraft(form){
 const key=form.dataset.draftKey;
 if(state.modal!=='compose'||!key||key!==postDraftKey())return;
 const {content,hobby,format}=form.elements;
 try{
   if(!content.value.trim())removePostDraft(key);
   else localStorage.setItem(key,JSON.stringify({content:content.value,hobby:hobby.value,format:format.value}));
 }catch{}
}
function openPostComposer(){
 const key=postDraftKey();
 state.pendingPostDraft=readPostDraft(key)?key:null;
 openModal('compose');
}
function restoreDrafts(){
 document.querySelectorAll('form[data-draft]').forEach(f=>{
   const values=state.drafts.get(f.dataset.draftKey||f.id);
   if(values)f.querySelectorAll('input[name],textarea[name],select[name]').forEach(el=>{if(Object.hasOwn(values,el.name))el.value=values[el.name];});
   if(f.id==='event-form'||f.id==='event-edit-form')syncEventFormatFields(f);
 });
}
function clearSubmittedDraft(formId,key,field,value) {
 const current=document.getElementById(formId);
 if(current?.dataset.draftKey===key){
   const input=current.elements[field];
   if(input.value===value)input.value='';
 }
 if(state.drafts.get(key)?.[field]===value)state.drafts.delete(key);
}
function actionFocusKey(element){
 if(!element?.dataset?.action)return '';
 const {action,id,tab,value}=element.dataset;
 return JSON.stringify([action,id,tab,value,element.closest('nav')?.getAttribute('aria-label'),
   action==='view-event'?element.textContent.trim():'']);
}
function findActionFocus(container,key){
 return key&&[...container.querySelectorAll('[data-action]')].find(element=>
   actionFocusKey(element)===key&&!element.disabled&&element.getClientRects().length);
}
function handleDialogKey(event){
 if(event.isComposing||event.defaultPrevented||!state.modal)return;
 const dialog=document.querySelector('.modal');
 if(!dialog)return;
 if(event.key==='Escape'){event.preventDefault();closeModal();return;}
 if(event.key!=='Tab')return;
 const targets=[...dialog.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
   .filter(element=>element.tabIndex>=0&&!element.matches(':disabled')&&element.getClientRects().length);
 const current=targets.indexOf(document.activeElement);
 if(!targets.length||current<0||(event.shiftKey?current===0:current===targets.length-1)){
   event.preventDefault();
   (targets[event.shiftKey?targets.length-1:0]||dialog).focus();
 }
}
function render() {
 const container=root();if(!container)return;
 const active=document.activeElement;
 const focusId=active?.id||null;
 const actionKey=actionFocusKey(active);
 const formId=active?.form?.id,fieldName=active?.name,draftKey=active?.form?.dataset.draftKey;
 const previousModal=container.querySelector('.modal');
 const modalView=previousModal?.dataset.view,modalScroll=previousModal?.scrollTop;
 const cursor=active&&typeof active.selectionStart==='number'?{start:active.selectionStart,end:active.selectionEnd}:null;
 const chatLog=document.getElementById('chat-log');const wasNearBottom=chatLog?chatLog.scrollHeight-chatLog.scrollTop-chatLog.clientHeight<75:false;
 const chatScroll=chatLog?.scrollTop||0;const pageScroll=window.scrollY;
 captureDrafts();document.body.classList.toggle('dark',state.dark);
 container.innerHTML=state.boot?`<div class="splash"><span class="splash-mark">✳</span><h1>HobbyHub</h1><p>Conectando suas paixões...</p></div>`:
 state.initError?`<div class="splash"><span class="splash-mark">✳</span><h2>Não conseguimos conectar</h2><p>${esc(state.initError)}</p><button class="btn btn-primary" data-action="reload">Tentar novamente</button></div>`:
 !state.user?renderAuth():renderLayout();
 restoreDrafts();
 const nextModal=container.querySelector('.modal');
 const sameDialog=nextModal&&modalView===nextModal.dataset.view;
 if(nextModal){
   if(!previousModal)state.modalReturnFocus=state.modalReturnFocus||{id:focusId,key:actionKey};
   for(const child of container.children)if(child!==nextModal.parentElement)child.inert=true;
 }
 const nextForm=formId&&document.getElementById(formId);
 const field=focusId?document.getElementById(focusId):fieldName&&nextForm?.dataset.draftKey===draftKey?nextForm?.elements.namedItem(fieldName):null;
 let next=field;
 if(nextModal)next=sameDialog?(nextModal.contains(field)?field:findActionFocus(nextModal,actionKey)||nextModal):nextModal;
 else if(previousModal){
   const opener=state.modalReturnFocus;
   state.modalReturnFocus=null;
   next=(opener?.id&&document.getElementById(opener.id))||findActionFocus(container,opener?.key);
   if(!next){
     next=container.querySelector('h1');
     next?.setAttribute('tabindex','-1');
   }
 }else if(!next)next=findActionFocus(container,actionKey);
 if(next&&document.activeElement!==next){
   next.focus({preventScroll:true});
   if(cursor&&typeof next.setSelectionRange==='function')try{next.setSelectionRange(cursor.start,cursor.end);}catch{}
 }
 if(sameDialog)nextModal.scrollTop=modalScroll;
 const nextChat=document.getElementById('chat-log');if(nextChat)nextChat.scrollTop=wasNearBottom?nextChat.scrollHeight:chatScroll;
 window.scrollTo({top:pageScroll,behavior:'instant'});
}
function updateMobileViewport(){
 const viewport=window.visualViewport;
 if(!viewport)return;
 const root=document.documentElement;
 const inset=Math.max(0,window.innerHeight-viewport.height-viewport.offsetTop);
 const keyboard=Math.abs(viewport.scale-1)<0.01&&window.innerHeight-viewport.height>100;
 root.classList.toggle('keyboard-open',keyboard);
 if(keyboard){
   root.style.setProperty('--keyboard-inset',inset+'px');
   root.style.setProperty('--visible-top',viewport.offsetTop+'px');
   root.style.setProperty('--visible-height',viewport.height+'px');
 }
}
function clearContentLink(){
 if(/^#(?:post|group|event)=/.test(window.location.hash)){
   window.history.replaceState(null,'',window.location.pathname+window.location.search);
 }
}
function closeModal(){
 state.commentEditor=null;
 state.postEditor=null;
 state.pendingPostDraft=null;
 state.eventRoom=null;
 state.eventConflict=null;
 state.composingRecapId=null;
 clearContentLink();
 state.drafts.clear();state.modal=null;state.reportTarget=null;state.selectedPost=null;state.selectedGroup=null;state.composingGroup=null;state.composingIntroduction=false;state.viewUser=null;if(state.commentUnsub){state.commentUnsub();state.commentUnsub=null;}state.comments=[];render();void markOpenConversationRead();}
function openModal(name){state.drafts.clear();state.modal=name;render();}
function setTab(tab){
 clearContentLink();state.welcomePending=false;state.tab=tab;state.modal=null;state.drafts.clear();render();
 void markOpenConversationRead();
 if(tab==='events')void loadPersonalHistory();
 if(tab==='home')loadHomeEventRooms();
 window.scrollTo({top:0,behavior:'instant'});
}
function returnFromPostEditor(){
 const previous=state.postEditor?.previous;
 state.postEditor=null;
 if(previous){state.modal=previous;render();}
 else closeModal();
}
function changeTheme(){state.dark=!state.dark;localStorage.setItem('hobbyhub-theme',state.dark?'dark':'light');render();}
async function startDirect(uid){
 const sender=me();
 if(!sender||!uid||uid===sender)return;
 const p=member(uid);const id=threadId(sender,uid);
 const threadData={participants:[sender,uid].sort(),createdAt:now(),names:{[sender]:myName(),[uid]:p?.name||'Pessoa'}};
 await attempt(async()=>{
   // Transação evita que duas pessoas sobrescrevam a mesma conversa ao criá-la.
   await firebase.runTransaction(db,async(transaction)=>{
     const thread=await transaction.get(dmRef(id));
     if(!thread.exists()){
       transaction.set(dmRef(id),threadData);
     }
   });
   if(me()!==sender)return;
   if(state.messageUnsub)state.messageUnsub();
   state.chatMode='direct';state.chatTarget={uid,name:p?.name||'Pessoa da comunidade'};
   state.directMessages=[];state.tab='messages';state.modal=null;state.drafts.clear();
   state.messageUnsub=firebase.onSnapshot(directMessagesCol(id),(snap)=>{
     if(me()!==sender||state.chatTarget?.uid!==uid)return;
     state.directMessages=snap.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));render();
     void markOpenConversationRead();
   },(error)=>{state.alerts=[`Falha ao carregar conversa privada: ${friendlyError(error)}`];render();});
 },'openingDirect','Esta conversa privada não está disponível no momento.');
}
function contentLink(type,id) {
 const link=new URL(window.location.pathname,window.location.origin);
 link.hash=`${type}=${encodeURIComponent(id)}`;
 return link.href;
}
async function loadEventFeedback(event) {
 const uid=me(),organizer=event?.createdBy===uid;
 if(!feedbackAvailable(event)||(!organizer&&!canReviewEvent(event,uid)))return;
 const feedback={id:event.id,loading:true,entries:[],error:''};
 state.eventFeedback=feedback;render();
 try{
   const path=['events',event.id,'feedback'];
   if(organizer){
     const snapshot=await firebase.getDocs(col(...path));
     feedback.entries=snapshot.docs.map(doc=>({...doc.data(),id:doc.id}));
   }else{
     const snapshot=await firebase.getDoc(ref(...path,uid));
     if(snapshot.exists())feedback.entries=[{...snapshot.data(),id:uid}];
   }
 }catch(error){
   feedback.error=friendlyError(error);
 }finally{
   feedback.loading=false;
   if(me()===uid&&state.eventFeedback===feedback&&state.modal==='event-detail')render();
 }
}
function openEventDetail(id,questionId='') {
 state.eventConflict=null;
 state.eventRoom=null;
 state.selectedEvent=id;state.eventFeedback=null;state.eventDiscussion=null;state.eventAnswerId=null;state.eventCheckins=null;openModal('event-detail');
 if(me()&&state.events.some(event=>event.id===id&&event.createdBy===me()))void loadEventCheckins(id);
 if(state.events.some(event=>event.id===id))void loadEventQuestions(id,questionId);
 void loadEventFeedback(state.events.find(event=>event.id===id));
 void loadEventRoom();
}
async function loadModerationSelection(groupId,targetId) {
 const group=state.groups.find(item=>item.id===groupId);
 if(group?.createdBy!==me()||!targetId||targetId===me()||!group.members?.includes(targetId)){
   state.moderationSelection=null;render();return;
 }
 const selection={groupId,targetId,loading:true};
 state.moderationSelection=selection;render();
 try{
   const snapshot=await firebase.getDoc(ref('members',targetId,'moderation',groupId));
   selection.status=snapshot.data()?.status;
 }catch(error){
   selection.error=friendlyError(error);
 }finally{
   selection.loading=false;
   if(state.moderationSelection===selection)render();
 }
}
async function loadModerationHistory(groupId) {
 const uid=me();
 const history={groupId,entries:null,error:''};
 state.moderationHistory=history;render();
 try{
   const list=firebase.query(col('groups',groupId,'moderationLog'),firebase.orderBy('removedAt','desc'));
   const snapshot=await firebase.getDocs(list);
   history.entries=snapshot.docs.map(doc=>({...doc.data(),id:doc.id}));
 }catch(error){history.error=friendlyError(error);}
 if(me()===uid&&state.moderationHistory===history&&state.modal==='moderation-history')render();
}
async function loadGroupReportQueue(groupId) {
 const uid=me();
 const queue={groupId,entries:null,error:''};
 state.moderationQueue=queue;render();
 try{
   const list=firebase.query(col('groups',groupId,'reports'),firebase.orderBy('createdAt','desc'));
   const snapshot=await firebase.getDocs(list);
   queue.entries=snapshot.docs.map(doc=>({...doc.data(),id:doc.id}));
 }catch(error){queue.error=friendlyError(error);}
 if(me()===uid&&state.moderationQueue===queue&&state.modal==='group-report-queue')render();
}
function moderationTargetRefs(postId,commentId) {
 return commentId
   ? {content:ref('posts',postId,'comments',commentId),pointer:ref('posts',postId,'removedComments',commentId)}
   : {content:ref('posts',postId),pointer:ref('removedPosts',postId)};
}
function openLinkedContent() {
 const match=/^#(post|group|event)=([a-zA-Z0-9_-]{1,120})$/.exec(window.location.hash);
 if(!state.user||state.modal)return;
 if(!match){
   if(state.welcomePending&&state.groupsLoaded){state.welcomePending=false;openModal('first-visit');}
   return;
 }
 state.welcomePending=false;
 const [,type,id]=match;
 if(type==='post'&&state.posts.some(post=>post.id===id))openComments(id);
 if(type==='group'&&state.groupsLoaded){
   state.tab='groups';state.selectedGroup=id;state.invitedGroupId=id;openModal('group-detail');
 }
 if(type==='event'&&state.eventsLoaded){
   state.tab='events';openEventDetail(id);
 }
}
async function copyGroupInvite(id) {
 if(!state.groups.some(group=>group.id===id))return;
 await copyContentLink(contentLink('group',id),'Link de convite copiado!','Copie o link do convite:');
}
async function copyContentLink(link, confirmation, promptLabel) {
 if(navigator.clipboard?.writeText){
   try {await navigator.clipboard.writeText(link);showToast(confirmation);return;}
   catch(error){console.warn('Não foi possível copiar automaticamente:',error);}
 }
 window.prompt(promptLabel,link);
}
async function shareEvent(event){
 const url=contentLink('event',event.id);
 if(navigator.share){
   const date=/^\d{4}-\d{2}-\d{2}$/.test(event.date)?event.date.split('-').reverse().join('/'):'';
   const schedule=date?date+(event.time?' às '+event.time:'')+(eventTimeZones[event.timeZone]?' ('+eventTimeZones[event.timeZone]+')':''):'';
   const text=[event.title,schedule].filter(Boolean).join(' · ');
   try{await navigator.share({title:event.title,text,url});return;}
   catch(error){if(error?.name==='AbortError')return;}
 }
 await copyContentLink(url,'Link do evento copiado!','Copie o link do evento:');
}
function calendarFile(event,stamp=new Date()){
 return calendarEventsFile([event],stamp);
}
function calendarEventsFile(events, stamp=new Date()) {
 const escapeText=value=>String(value??'').replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/[,;]/g,character=>'\\'+character);
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//HobbyHub//Eventos//PT-BR',...events.flatMap(event=>{
   const link=contentLink('event',event.id);
   return ['BEGIN:VEVENT',
   `UID:${escapeText(event.id)}@${window.location.hostname}`,
   `DTSTAMP:${stamp.toISOString().replace(/[-:]|\.\d{3}/g,'')}`,
   `SEQUENCE:${Number.isSafeInteger(event.revision)&&event.revision>=0?event.revision:0}`,
   `DTSTART:${eventCalendarDateTime(event,event.time)}`,
   ...(eventEndTime(event)?[`DTEND:${eventCalendarDateTime(event,event.endTime)}`]:[]),
   `SUMMARY:${escapeText(event.title)}`,`LOCATION:${escapeText(eventFormat(event)==='online'?'Online':event.location)}`,
   `DESCRIPTION:${escapeText([event.description,link].filter(Boolean).join('\n'))}`,`URL:${link}`,'END:VEVENT'];
 }),'END:VCALENDAR'];
 const encoder=new TextEncoder();
 return lines.map(line=>{
   let folded='',bytes=0;
   for(const character of line){
     const size=encoder.encode(character).length;
     if(bytes+size>75){folded+='\r\n ';bytes=1;}
     folded+=character;bytes+=size;
   }
   return folded;
 }).join('\r\n')+'\r\n';
}
function isEventTime(time){
 return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time);
}
function eventEndTime(event){
 return isEventTime(event.time)&&isEventTime(event.endTime)&&event.endTime>event.time?event.endTime:'';
}
function eventTimeInstant(event,time=event.time){
 if(!isEventTime(time))return NaN;
 const input=`${event.date}T${time}:00`;
 if(!Object.hasOwn(eventTimeZones,event.timeZone))return Date.parse(input);
 const wallTime=Date.parse(input+'Z');
 if(!Number.isFinite(wallTime))return NaN;
 if(!eventZoneFormatters.has(event.timeZone)){
   eventZoneFormatters.set(event.timeZone,new Intl.DateTimeFormat('en-US',{timeZone:event.timeZone,timeZoneName:'longOffset'}));
 }
 const parts=eventZoneFormatters.get(event.timeZone);
 const offsetAt=instant=>{
   const name=parts.formatToParts(instant).find(part=>part.type==='timeZoneName')?.value;
   const offset=/^GMT([+-])(\d\d):(\d\d)$/.exec(name);
   return offset?(offset[1]==='-'?-1:1)*(Number(offset[2])*60+Number(offset[3]))*60000:0;
 };
 return wallTime-offsetAt(wallTime-offsetAt(wallTime));
}
function viewerEventSchedule(event){
 const finish=eventEndTime(event);
 const original={date:event.date,time:event.time||'',endTime:finish,endDate:event.date};
 if(!Object.hasOwn(eventTimeZones,event.timeZone)||!hasCalendarSchedule(event))return original;
 const start=new Date(eventTimeInstant(event));
 if(!Number.isFinite(start.getTime()))return original;
 const end=finish?new Date(eventTimeInstant(event,finish)):null;
 return {date:localDateKey(start),time:start.toTimeString().slice(0,5),endTime:end?end.toTimeString().slice(0,5):'',endDate:end?localDateKey(end):localDateKey(start)};
}
function eventScheduleKey(event){
 const {date,time}=viewerEventSchedule(event);
 return `${date||''} ${time||'24:00'}`;
}
function eventTimeLabel(event,schedule=viewerEventSchedule(event)){
 if(!schedule.endTime)return schedule.time;
 return `${schedule.time}–${schedule.endTime}${schedule.endDate!==schedule.date?` (${dateLabel(schedule.endDate)})`:''}`;
}
function eventCalendarDateTime(event,time){
 const instant=Object.hasOwn(eventTimeZones,event.timeZone)?eventTimeInstant(event,time):NaN;
 if(Number.isFinite(instant))return new Date(instant).toISOString().replace(/[-:]|\.\d{3}/g,'');
 return `${event.date.replace(/-/g,'')}T${time.replace(':','')}00`;
}
function validateEventEndTime(time,endTime){
 if(endTime&&!eventEndTime({time,endTime}))throw new Error('O término deve ser depois do início, no mesmo dia.');
}
function hasCalendarSchedule(event){
 return /^\d{4}-\d{2}-\d{2}$/.test(event.date)&&isEventTime(event.time);
}
function canExportEventCalendar(event){
 return Boolean(event&&me()&&event.cancelled!==true&&event.attendees?.includes(me())&&hasCalendarSchedule(event));
}
function eventCalendarButton(event){
 return canExportEventCalendar(event)?`<button class="btn btn-soft btn-small" data-action="event-calendar" data-id="${esc(event.id)}">${event.revision>0?'Baixar calendário atualizado':'Adicionar ao calendário'}</button>`:'';
}
function downloadEventCalendar(event) {
 if(!hasCalendarSchedule(event)){
   showToast('O evento precisa de uma data e um horário válidos.',true);return;
 }
 downloadCalendar(calendarFile(event),'evento-hobbyhub.ics');
}
function downloadCalendar(file,name){
 const url=URL.createObjectURL(new Blob([file],{type:'text/calendar;charset=utf-8'}));
 const link=document.createElement('a');
 link.href=url;link.download=name;
 document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function openComments(postId){
 if(!state.posts.some(p=>p.id===postId))return;
 state.commentEditor=null;
 if(state.commentUnsub)state.commentUnsub();
 state.selectedPost=postId;state.modal='comments';state.comments=[];
 state.commentUnsub=firebase.onSnapshot(col('posts',postId,'comments'),(snap)=>{
   state.comments=snap.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));render();
 },(error)=>{showToast(`Comentários: ${friendlyError(error)}`,true);});
 render();
}
function redirectToExplore(){setTab('explore');}
function openReport(type,id) {
 if(!id||!me())return;
 let target={targetType:type,targetId:id};
 if(type==='post'){
   const post=state.posts.find(item=>item.id===id);
   if(!post||post.userId===me())return;
   if(state.groups.find(group=>group.id===post.groupId)?.members?.includes(me())){
     target={targetType:'post',groupId:post.groupId,postId:post.id,commentId:'',targetText:post.content};
   }
 }else if(type==='comment'){
   const post=state.posts.find(item=>item.id===state.selectedPost);
   const comment=state.comments.find(item=>item.id===id);
   if(!post||!comment||comment.userId===me()||!state.groups.find(group=>group.id===post.groupId)?.members?.includes(me()))return;
   target={targetType:'comment',groupId:post.groupId,postId:post.id,commentId:id,targetText:comment.text};
 }else{
   let item;
   let parentId='';
   if(type==='profile'){
     const profile=member(id);
     if(profile)item={author:id,text:profile.name};
   }else if(type==='testimonial'){
     const owner=state.modal!=='person';
     parentId=owner?me():state.viewUser;
     const entry=(owner?state.receivedTestimonials:state.visibleTestimonials).find(record=>record.id===id);
     if(entry)item={author:entry.id,text:entry.text};
   }else if(type==='privateMessage'||type==='communityMessage'){
     const direct=type==='privateMessage';
     if(direct&&!state.chatTarget?.uid)return;
     if(direct)parentId=threadId(me(),state.chatTarget.uid);
     const message=(direct?state.directMessages:state.messages).find(record=>record.id===id);
     if(message)item={author:message.senderId,text:message.text};
   }
   if(!item?.author||item.author===me()||!item.text)return;
   target={...target,parentId,targetUserId:item.author,targetText:item.text,status:'pending'};
 }
 state.reportTarget=target;
 openModal('report');
}
async function loadPersonTestimonials(uid) {
 const author=me();
 try {
   const [published,mine]=await Promise.all([
     firebase.getDocs(firebase.query(col('members',uid,'testimonials'),firebase.where('approved','==',true))),
     firebase.getDoc(ref('members',uid,'testimonials',author))
   ]);
   if(me()!==author||state.modal!=='person'||state.viewUser!==uid)return;
   state.visibleTestimonials=published.docs.map(d=>({...d.data(),id:d.id}));
   state.sentTestimonial=mine.exists()?mine.data():null;
   state.testimonialStatus='';
 } catch(error) {
   if(me()!==author||state.modal!=='person'||state.viewUser!==uid)return;
   state.testimonialStatus=friendlyError(error);
 }
 render();
}
async function onAction(btn) {
 const action=btn.dataset.action;
 const id=btn.dataset.id;
 switch(action){
  case 'reload':window.location.reload();return;
  case 'toggle-auth':state.authMode=state.authMode==='login'?'register':'login';state.drafts.clear();render();return;
  case 'forgot-password':state.authMode='reset';state.drafts.clear();render();return;
  case 'theme':changeTheme();return;
  case 'tab':setTab(btn.dataset.tab);return;
  case 'explore':redirectToExplore();return;
  case 'feed':state.feed=btn.dataset.value;render();return;
  case 'topic':state.topic=btn.dataset.topic;render();return;
  case 'group-view':state.groupView=btn.dataset.value==='discover'?'discover':'mine';render();return;
  case 'discover-groups':state.groupView='discover';setTab('groups');return;
  case 'record-event-checkin':
  case 'undo-event-checkin':await attempt(async()=>{
    const event=state.events.find(item=>item.id===state.selectedEvent),uid=me();
    if(state.modal!=='event-detail'||!canCheckInEvent(event)||state.eventCheckins?.eventId!==event.id)return;
    const recording=action==='record-event-checkin';
    if(recording&&!event.attendees?.includes(id))return;
    const record=ref('events',event.id,'checkins',id);
    await firebase.runTransaction(db,async transaction=>{
      const exists=(await transaction.get(record)).exists();
      if(recording&&!exists)transaction.set(record,{checkedAt:firebase.serverTimestamp()});
      if(!recording&&exists)transaction.delete(record);
    });
    if(me()===uid&&state.selectedEvent===event.id&&state.modal==='event-detail')await loadEventCheckins(event.id);
  });return;
  case 'refresh-event-questions':
    if(state.modal==='event-detail')await loadEventQuestions(state.selectedEvent);
    return;
  case 'answer-event-question':{
    const event=state.events.find(item=>item.id===state.selectedEvent);
    if(state.modal==='event-detail'&&event?.createdBy===me()&&!event.cancelled&&state.eventDiscussion?.questions.some(item=>item.id===id)){
      state.eventAnswerId=id;render();
    }
    return;
  }
  case 'pin-event-question':
  case 'unpin-event-question':await attempt(async()=>{
    const event=state.events.find(item=>item.id===state.selectedEvent);
    if(state.modal!=='event-detail'||event?.createdBy!==me()||event.cancelled)return;
    if(!state.eventDiscussion?.questions.some(item=>item.id===id&&item.answer))return;
    const pin=ref('events',event.id,'discussion','pinned');
    const uid=me();
    if(action==='pin-event-question')await firebase.setDoc(pin,{questionId:id});
    else await firebase.runTransaction(db,async transaction=>{
      if((await transaction.get(pin)).data()?.questionId===id)transaction.delete(pin);
    });
    if(me()===uid&&state.selectedEvent===event.id&&state.modal==='event-detail')await loadEventQuestions(event.id);
  });return;
  case 'event-filter':state.eventFilter=btn.dataset.value;render();await loadPersonalHistory();return;
  case 'event-agenda-view':state.eventAgendaView=btn.dataset.value==='week'?'week':'list';render();return;
  case 'event-week':{
    const direction=btn.dataset.value;
    if(direction==='current')state.eventWeekOffset=0;
    if(direction==='previous')state.eventWeekOffset--;
    if(direction==='next')state.eventWeekOffset++;
    render();return;
  }
  case 'export-event-week':{
    if(state.tab!=='events'||state.eventFilter!=='mine'||state.eventAgendaView!=='week')return;
    const days=eventWeek(new Date(),state.eventWeekOffset),events=exportableWeekEvents(days);
    if(events.length)downloadCalendar(calendarEventsFile(events),`hobbyhub-semana-${localDateKey(days[0])}.ics`);
    return;
  }
  case 'refresh-event-history':await loadPersonalHistory();return;
  case 'upcoming-events':state.eventFilter='upcoming';render();return;
  case 'clear-event-filters':state.eventSearch='';state.eventHobby='';state.eventCommunity='';state.eventFormat='';render();return;
  case 'retry-event-room':await loadEventRoom(true);return;
  case 'compose':state.composingGroup=null;state.composingIntroduction=false;state.composingRecapId=null;openPostComposer();return;
  case 'continue-post-draft':
  case 'discard-post-draft':{
    const key=postDraftKey();
    if(!key||state.modal!=='compose'||state.pendingPostDraft!==key)return;
    const discard=btn.dataset.action==='discard-post-draft';
    if(discard)removePostDraft(key);
    else{
      const draft=readPostDraft(key);
      if(draft)state.drafts.set(key,draft);
    }
    state.pendingPostDraft=null;render();
    document.getElementById('post-content')?.focus();
    return;
  }
  case 'compose-event-recap':{
    const event=state.events.find(item=>item.id===id);
    if(state.modal!=='event-detail'||state.selectedEvent!==id||!canComposeEventRecap(event))return;
    state.composingGroup=event.groupId;state.composingIntroduction=false;state.composingRecapId=id;
    openModal('compose');return;
  }
  case 'group':openModal(action);return;
  case 'event':state.eventGroupId=null;state.eventTemplate=null;openModal('event');return;
  case 'view-event':openEventDetail(id);return;
  case 'repeat-event':{
    const event=state.events.find(item=>item.id===id);
    if(!canRepeatEvent(event))return;
    state.eventGroupId=event.groupId||null;state.eventTemplate=event;
    openModal('event');return;
  }
  case 'view-event-notice':{
    const event=state.events.find(item=>item.id===id);
    const uid=me();
    if(!event?.attendees?.includes(uid))return;
    openEventDetail(id);
    try {
      if(event.revision>(state.eventReads.get(id)||0)){
        await firebase.setDoc(ref('members',uid,'eventReads',id),{revision:event.revision});
        if(me()===uid){
          state.eventReads.set(id,Math.max(event.revision,state.eventReads.get(id)||0));
          render();
        }
      }
    } catch(error){console.error('Salvar aviso visto:',error);}
    return;
  }
  case 'edit-event':{
    const event=state.events.find(item=>item.id===id);
    if(event?.createdBy===me()&&event.cancelled!==true){state.selectedEvent=id;openModal('event-edit');void loadEventRoom();}
    return;
  }
  case 'cancel-event':await attempt(async()=>{
    const event=state.events.find(item=>item.id===id);
    if(!event||event.createdBy!==me()||event.cancelled===true||!confirm('Cancelar este evento? Quem abrir o convite verá o aviso de cancelamento.'))return;
    await firebase.updateDoc(ref('events',id),{cancelled:true,revision:firebase.increment(1),scheduleChangedAt:firebase.serverTimestamp()});
    showToast('Evento cancelado.');
  });return;
  case 'copy-event-link':
    if(state.events.some(event=>event.id===id))await copyContentLink(contentLink('event',id),'Link do evento copiado!','Copie o link do evento:');
    return;
  case 'share-event':{
    const event=state.events.find(item=>item.id===id);
    if(event&&event.cancelled!==true)await shareEvent(event);
    return;
  }
  case 'event-calendar':{
    const event=state.events.find(item=>item.id===id);
    if(canExportEventCalendar(event))downloadEventCalendar(event);
    return;
  }
  case 'group-event':{
    const group=state.groups.find(item=>item.id===id);
    if(!group?.members?.includes(me()))return;
    state.eventGroupId=id;state.eventTemplate=null;openModal('event');return;
  }
  case 'group-polls':{
    if(!pollMember(id))return;
    state.selectedGroup=id;
    openModal('group-polls');
    await loadGroupPolls(id);return;
  }
  case 'create-poll':{
    const group=state.groups.find(item=>item.id===state.selectedGroup);
    if(pollMember(group?.id)&&canManageGroup(group))openModal('poll-create');
    return;
  }
  case 'view-poll':{
    const groupId=state.selectedGroup;
    const listed=state.groupPolls?.groupId===groupId&&state.groupPolls.entries?.find(item=>item.id===id);
    const detail=state.pollDetail;
    const poll=listed||(detail?.groupId===groupId&&detail.poll.id===id?detail.poll:null);
    if(poll&&pollMember(groupId))await openPoll(groupId,poll);
    return;
  }
  case 'event-from-poll':{
    const detail=state.pollDetail;
    if(state.modal!=='poll-detail'||!canDraftPollEvent(detail))return;
    state.eventGroupId=detail.groupId;
    state.eventTemplate={source:'poll',title:pollEventTitle(detail)};
    openModal('event');return;
  }
  case 'vote-poll':await attempt(async()=>{
    const detail=state.pollDetail;
    if(!detail||detail.loading||!pollOptions.includes(id))return;
    const {groupId,poll}=detail;
    if(!pollMember(groupId))return;
    if(pollClosed(poll)){await openPoll(groupId,poll);showToast('Esta enquete já encerrou.');return;}
    if(!poll.options[id])return;
    const uid=me(),path=['groups',groupId,'polls',poll.id];
    const ballot=ref(...path,'votes',uid),totals=ref(...path,'totals','main');
    await firebase.runTransaction(db,async transaction=>{
      const previous=(await transaction.get(ballot)).data()?.option;
      if(previous===id)return;
      const changes={[id]:firebase.increment(1)};
      if(previous)changes[previous]=firebase.increment(-1);
      transaction.set(ballot,{option:id});
      transaction.update(totals,changes);
    });
    if(me()===uid&&state.pollDetail===detail&&state.modal==='poll-detail')await openPoll(groupId,poll);
    if(me()===uid)showToast('Voto registrado!');
  });return;
  case 'view-group':state.selectedGroup=id;openModal('group-detail');return;
  case 'moderation-history':{
    const group=state.groups.find(item=>item.id===id);
    if(!canManageGroup(group))return;
    state.selectedGroup=id;state.moderationHistory=null;openModal('moderation-history');
    await loadModerationHistory(id);return;
  }
  case 'group-report-queue':{
    const group=state.groups.find(item=>item.id===id);
    if(!canManageGroup(group))return;
    state.selectedGroup=id;state.moderationQueue=null;openModal('group-report-queue');
    await loadGroupReportQueue(id);return;
  }
  case 'keep-group-report':
  case 'remove-group-report':await attempt(async()=>{
    const queue=state.moderationQueue,uid=me();
    const group=state.groups.find(item=>item.id===state.selectedGroup);
    const report=queue?.groupId===group?.id?queue?.entries?.find(item=>item.id===id&&item.status==='pending'):null;
    if(!canManageGroup(group)||!report)return;
    if(action==='remove-group-report'){
      state.groupRemoval={groupId:group.id,postId:report.postId,commentId:report.commentId,reportId:id,preview:report.text};
      openModal('moderate-post');return;
    }
    const reportRef=ref('groups',group.id,'reports',id);
    const status=await firebase.runTransaction(db,async transaction=>{
      if((await transaction.get(reportRef)).data()?.status!=='pending')throw new Error('Esta denúncia já foi revisada.');
      const post=(await transaction.get(ref('posts',report.postId))).data();
      const visible=post?.groupId===group.id
        && (!report.commentId||(await transaction.get(ref('posts',report.postId,'comments',report.commentId))).exists());
      const status=visible?'kept':'unavailable';
      transaction.update(reportRef,{status,reviewedBy:uid,reviewedAt:firebase.serverTimestamp(),moderationId:''});
      return status;
    });
    if(me()!==uid)return;
    if(state.modal==='group-report-queue'&&state.selectedGroup===group.id)await loadGroupReportQueue(group.id);
    showToast(status==='kept'?'Denúncia revisada. Conteúdo mantido.':'Conteúdo indisponível. Denúncia encerrada.');
  });return;
  case 'moderate-post':
  case 'moderate-comment':{
    const commentId=action==='moderate-comment'?id:null;
    const post=state.posts.find(item=>item.id===(commentId?state.selectedPost:id));
    const group=state.groups.find(item=>item.id===post?.groupId);
    if(!post||!canManageGroup(group)||(commentId&&!state.comments.some(comment=>comment.id===commentId)))return;
    state.groupRemoval={groupId:group.id,postId:post.id,commentId};openModal('moderate-post');return;
  }
  case 'restore-group-post':await attempt(async()=>{
    const uid=me(),groupId=state.selectedGroup;
    if(state.groups.find(group=>group.id===groupId)?.createdBy!==uid)return;
    const entryRef=ref('groups',groupId,'moderationLog',id);
    const isComment=await firebase.runTransaction(db,async transaction=>{
      const entry=(await transaction.get(entryRef)).data();
      if(!entry||entry.restoredAt)throw new Error('Este conteúdo já foi restaurado ou está indisponível.');
      if(entry.commentId&&!(await transaction.get(ref('posts',entry.postId))).exists())throw new Error('Restaure a publicação antes deste comentário.');
      const {content,pointer}=moderationTargetRefs(entry.postId,entry.commentId);
      transaction.set(content,entry.commentId?entry.comment:entry.post);
      transaction.delete(pointer);
      transaction.update(entryRef,{restoredBy:uid,restoredAt:firebase.serverTimestamp()});
      return Boolean(entry.commentId);
    });
    if(me()!==uid)return;
    if(state.modal==='moderation-history'&&state.selectedGroup===groupId)await loadModerationHistory(groupId);
    showToast(isComment?'Comentário restaurado.':'Publicação restaurada com os comentários.');
  });return;
  case 'invite-group-role':
  case 'revoke-group-role':await attempt(async()=>{
    const selection=state.moderationSelection;
    const group=state.groups.find(item=>item.id===selection?.groupId);
    if(!selection||selection.loading||group?.createdBy!==me()||state.selectedGroup!==group.id)return;
    const target=ref('members',selection.targetId,'moderation',group.id);
    if(action==='invite-group-role'){
      if(selection.status||!group.members?.includes(selection.targetId))return;
      await firebase.setDoc(target,{status:'pending'});
      showToast('Convite para moderar enviado.');
    }else{
      if(!selection.status)return;
      await firebase.deleteDoc(target);
      showToast('Função ou convite revogado.');
    }
    if(state.moderationSelection===selection)await loadModerationSelection(group.id,selection.targetId);
  });return;
  case 'accept-group-role':
  case 'leave-group-role':await attempt(async()=>{
    const status=state.groupRoles.get(id);
    const target=ref('members',me(),'moderation',id);
    if(action==='accept-group-role'){
      if(status!=='pending')return;
      await firebase.updateDoc(target,{status:'active'});
      showToast('Convite aceito. Você agora é moderador.');
    }else{
      if(!status)return;
      await firebase.deleteDoc(target);
      showToast(status==='pending'?'Convite recusado.':'Você deixou a moderação.');
    }
  });return;
  case 'view-welcome-group':
    if(!state.groups.some(group=>group.id===id))return;
    state.tab='groups';state.selectedGroup=id;state.invitedGroupId=id;openModal('group-detail');return;
  case 'copy-group-invite':await copyGroupInvite(id);return;
  case 'restore-community-notices':
  case 'toggle-community-notices':await attempt(async()=>{
    const uid=me();
    if(!uid||!state.mutedCommunitiesLoaded)return;
    const muted=state.mutedCommunityIds.has(id);
    if(action==='restore-community-notices'){
      if(state.modal!=='notification-settings'||!muted)return;
    }else if(!pollMember(id))return;
    const target=ref('members',uid,'mutedCommunities',id);
    await firebase.runTransaction(db,async transaction=>{
      const exists=(await transaction.get(target)).exists();
      if(muted&&exists)transaction.delete(target);
      if(!muted&&!exists)transaction.set(target,{mutedAt:firebase.serverTimestamp()});
    });
    if(me()===uid)showToast(muted?'Avisos da comunidade reativados.':'Enquetes, recados e mudanças de eventos salvos desta comunidade foram silenciados.');
  });return;
  case 'pin-group-post':
  case 'unpin-group-post':await attempt(async()=>{
    const group=state.groups.find(g=>g.id===state.selectedGroup);
    if(!canManageGroup(group))return;
    const groupRef=ref('groups',group.id);
    if(action==='pin-group-post'){
      if(!state.posts.some(post=>post.id===id&&post.groupId===group.id))return;
      await firebase.updateDoc(groupRef,{pinnedPostId:id});
      showToast('Publicação fixada na comunidade.');
    }else{
      await firebase.runTransaction(db,async tx=>{
        const current=await tx.get(groupRef);
        if(current.data()?.pinnedPostId===id)tx.update(groupRef,{pinnedPostId:''});
      });
    }
  });return;
  case 'group-post':
  case 'introduce-group':{
    const group=state.groups.find(g=>g.id===(id||state.selectedGroup));
    if(!group||!(group.members||[]).includes(me()))return;
    state.composingGroup=group.id;state.composingIntroduction=action==='introduce-group';state.composingRecapId=null;openPostComposer();return;
  }
  case 'notifications':openModal('notifications');return;
  case 'notification-settings':openModal('notification-settings');return;
  case 'set-event-reminders':await attempt(async()=>{
    const uid=me(),value=btn.dataset.value;
    if(!uid||!state.notificationSettingsLoaded||state.modal!=='notification-settings'||
       !Object.hasOwn(eventReminderOptions,value)||(state.notificationSettings.eventReminders||'eve')===value)return;
    await firebase.setDoc(ref('members',uid,'notificationSettings','main'),{eventReminders:value},{merge:true});
    if(me()===uid)showToast('Preferência salva.');
  });return;
  case 'toggle-notification-setting':await attempt(async()=>{
    const uid=me();
    if(!uid||!state.notificationSettingsLoaded||state.modal!=='notification-settings'||!Object.hasOwn(notificationCategories,id))return;
    const updated={[id]:state.notificationSettings[id]===false};
    await firebase.setDoc(ref('members',uid,'notificationSettings','main'),updated,{merge:true});
    if(me()===uid)showToast('Preferência salva.');
  });return;
  case 'notification-filter':state.notificationFilter=btn.dataset.value==='unread'?'unread':'all';render();return;
  case 'read-notification':{
    const item=notificationItems().find(notice=>notice.readKey===id);
    if(!item)return;
    markNotificationsRead([item]);render();
    const dialog=document.querySelector('.modal');
    const target=state.notificationFilter==='unread'?dialog?.querySelector('[data-action="read-notification"]'):
      [...(dialog?.querySelectorAll('[data-action="open-notification"]')||[])].find(button=>button.dataset.id===id);
    (target||document.getElementById('notification-filter-'+state.notificationFilter))?.focus();
    return;
  }
  case 'read-notifications':
    markNotificationsRead(notificationItems());render();
    document.getElementById('notification-filter-'+state.notificationFilter)?.focus();return;
  case 'open-notification':{
    const notice=notificationItems().find(item=>item.readKey===id);
    if(!notice)return;
    if(notice.type==='event-answer'&&!state.eventsLoaded){showToast('Aguarde a agenda carregar para abrir a resposta.');return;}
    markNotificationsRead([notice]);
    if(notice.type==='product-news'){openModal('product-news');return;}
    if(notice.type==='feedback-resolved'||notice.type==='feedback-resumed'){openMyProductFeedback(notice.feedbackId);return;}
    if(notice.type==='event-bulletin'){
      openEventDetail(notice.eventId);
      const item=document.getElementById('event-bulletin-'+notice.bulletinId);
      if(item){item.focus({preventScroll:true});item.scrollIntoView({block:'center'});}
      return;
    }
    if(['event-seat','event-reminder','saved-event-change','confirmed-event-cancellation'].includes(notice.type)){openEventDetail(notice.eventId);return;}
    if(notice.type==='event-answer'){
      openEventDetail(notice.eventId,notice.questionId);return;
    }
    if(notice.type==='poll-open'||notice.type==='poll-result'){
      state.selectedGroup=notice.groupId;
      await openPoll(notice.groupId,notice.poll);return;
    }
    if(notice.type==='report'){
      state.selectedGroup=notice.groupId;state.moderationQueue=null;openModal('group-report-queue');
      await loadGroupReportQueue(notice.groupId);return;
    }
    if(notice.type==='testimonial'){
      setTab('profile');document.getElementById('received-testimonials')?.scrollIntoView();return;
    }
    if(notice.type==='comment'&&state.posts.some(post=>post.id===notice.postId)){openComments(notice.postId);return;}
    if(notice.type==='follow'&&member(notice.actorId)){
      state.viewUser=notice.actorId;state.visibleTestimonials=[];state.sentTestimonial=null;state.testimonialStatus='Carregando depoimentos…';
      openModal('person');await loadPersonTestimonials(notice.actorId);return;
    }
    render();showToast('Este conteúdo está indisponível.');return;
  }
  case 'close':closeModal();return;
  case 'edit-profile':openModal('edit-profile');return;
  case 'product-feedback-admin':{
    if(!state.feedbackAdmin)return;
    resetProductFeedbackQueue();
    openModal('product-feedback-admin');await loadProductFeedback();return;
  }
  case 'product-news':if(me())openModal('product-news');return;
  case 'my-product-feedback':if(me())openModal('my-product-feedback');return;
  case 'view-my-feedback':openMyProductFeedback(id);return;
  case 'view-admin-feedback-detail':
    if(state.feedbackAdmin&&state.modal==='product-feedback-admin'&&state.productFeedbackQueue?.entries.some(item=>item.id===id)){
      openFeedbackSupplements(id,'feedback-admin-detail');
    }
    return;
  case 'back-feedback-admin':
    if(state.feedbackAdmin&&state.modal==='feedback-admin-detail')openModal('product-feedback-admin');
    return;
  case 'load-feedback-supplements':await loadFeedbackSupplements();return;
  case 'answer-feedback-resolution':await answerFeedbackResolution(id,btn.dataset.value);return;
  case 'feedback-admin-verification':if(hasFeedbackAdminRole())openModal('feedback-admin-verification');return;
  case 'send-feedback-verification':await attempt(async()=>{
    if(!hasFeedbackAdminRole()||state.feedbackAdmin)return;
    await firebase.sendEmailVerification(auth.currentUser);
    showToast('E-mail de confirmação enviado.');
  });return;
  case 'refresh-feedback-verification':await attempt(async()=>{
    if(!hasFeedbackAdminRole())return;
    const user=auth.currentUser;
    await user.reload();
    await user.getIdToken(true);
    if(me()!==user.uid)return;
    updateFeedbackAdminAccess();
    if(state.feedbackAdmin){
      resetProductFeedbackQueue();
      openModal('product-feedback-admin');await loadProductFeedback();
    }else showToast('Confirme o e-mail pelo link recebido e tente novamente.');
  });return;
  case 'cancel-feedback-resolution':{
    const queue=state.productFeedbackQueue;
    if(state.modal!=='product-feedback-admin'||!queue?.resolutionId||state.busy)return;
    const id=queue.resolutionId;
    queue.resolutionId=null;
    render();
    state.drafts.delete('feedback-resolution-'+id);
    document.getElementById('feedback-status-'+id)?.focus();
    return;
  }
  case 'product-feedback-category':{
    const queue=state.productFeedbackQueue,category=btn.dataset.value;
    if(!state.feedbackAdmin||state.modal!=='product-feedback-admin'||!queue||state.busy||
       !['','problem','suggestion','attention','supplements'].includes(category)||category===queue.category)return;
    if(['attention','supplements'].some(filter=>filter===category||filter===queue.category)){
      resetProductFeedbackQueue(category);await loadProductFeedback();return;
    }
    queue.category=category;render();return;
  }
  case 'refresh-feedback-queue':
    if(state.feedbackAdmin&&state.modal==='product-feedback-admin'&&['attention','supplements'].includes(state.productFeedbackQueue?.category)&&
       !state.productFeedbackQueue.loading&&!state.busy){
      resetProductFeedbackQueue(state.productFeedbackQueue.category);await loadProductFeedback();
    }
    return;
  case 'resume-feedback-review':await resumeFeedbackReview(id);return;
  case 'read-feedback-supplements':await markFeedbackSupplementsRead();return;
  case 'load-product-feedback':await loadProductFeedback();return;
  case 'send-feedback':if(me())openModal('product-feedback');return;
  case 'quiz':state.quizMood=null;openModal('quiz');return;
  case 'quiz-mood':state.quizMood=btn.dataset.value;render();return;
  case 'explore-view':state.exploreView=btn.dataset.value==='posts'?'posts':'people';render();return;
  case 'more-post-results':state.postSearchLimit+=20;render();return;
  case 'quiz-topic':{const value=btn.dataset.topic;closeModal();state.exploreView='people';state.search=value;setTab('explore');return;}
  case 'person':{
    if(id===me()){setTab('profile');return;}
    if(!id||!me())return;
    state.viewUser=id;state.visibleTestimonials=[];state.sentTestimonial=null;state.testimonialStatus='Carregando depoimentos…';
    openModal('person');await loadPersonTestimonials(id);return;
  }
  case 'testimonial-visibility':await attempt(async()=>{
    const entry=state.receivedTestimonials.find(item=>item.id===id);
    if(!entry)return;
    await firebase.updateDoc(ref('members',me(),'testimonials',id),{approved:!entry.approved});
  });return;
  case 'testimonial-remove':await attempt(async()=>{
    if(!confirm('Remover este depoimento do seu perfil?'))return;
    await firebase.deleteDoc(ref('members',me(),'testimonials',id));
  });return;
  case 'testimonial-withdraw':await attempt(async()=>{
    const recipient=state.viewUser;
    if(!recipient||!confirm('Retirar o depoimento enviado?'))return;
    await firebase.deleteDoc(ref('members',recipient,'testimonials',me()));
    await loadPersonTestimonials(recipient);
  });return;
  case 'open-dm':await startDirect(id);return;
  case 'block-member':
  case 'unblock-member':await attempt(async()=>{
    const uid=me();
    if(!uid||!id||id===uid)return;
    const target=ref('members',uid,'blocked',id);
    if(action==='unblock-member'){
      await firebase.deleteDoc(target);
      showToast('Pessoa desbloqueada.');
    }else if(confirm('Bloquear novas mensagens privadas entre vocês? O histórico será preservado.')){
      await firebase.setDoc(target,{createdAt:now()});
      showToast('Pessoa bloqueada.');
    }
  },'updatingBlock');return;
  case 'chat-community':state.chatMode=btn.dataset.value==='global'?'global':'community';state.chatTarget=null;if(state.messageUnsub){state.messageUnsub();state.messageUnsub=null;}state.directMessages=[];render();return;
  case 'comments':openComments(id);return;
  case 'share-post':{
    if(!state.posts.some(post=>post.id===id))return;
    const link=contentLink('post',id);
    try{
      if(navigator.share) await navigator.share({title:'Publicação no HobbyHub',url:link});
      else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(link);showToast('Link da publicação copiado!');}
      else window.prompt('Copie o link da publicação:',link);
    }catch(error){if(error?.name!=='AbortError'){console.error(error);showToast('Não foi possível compartilhar esta publicação.',true);}}
    return;
  }
  case 'logout':await attempt(async()=>{unsubscribeAll();await firebase.signOut(auth);showToast('Você saiu da sua conta. Até logo!');});return;
  case 'follow':await attempt(async()=>{
    if(!id||id===me())return;
    const target=ref('members',me(),'following',id);
    if(state.followingIds.includes(id)){await firebase.deleteDoc(target);showToast('Você deixou de seguir esta pessoa.');}
    else{
      const batch=firebase.writeBatch(db);
      batch.set(target,{createdAt:now()});
      batch.set(ref('members',id,'notifications',`follow-${me()}`),notificationFields('follow'));
      await batch.commit();showToast('Agora você está seguindo esta pessoa!');
    }
  },'updatingFollow');return;
  case 'save-event':await attempt(async()=>{
    const uid=me(),intent=btn.dataset.value;
    if(!uid||!state.events.some(event=>event.id===id)||!['save','remove'].includes(intent))return;
    const target=ref('members',uid,'savedEvents',id);
    await firebase.runTransaction(db,async transaction=>{
      const saved=(await transaction.get(target)).exists();
      if(intent==='save'&&!saved)transaction.set(target,{savedAt:firebase.serverTimestamp()});
      if(intent==='remove'&&saved)transaction.delete(target);
    });
    if(me()===uid)showToast(intent==='save'?'Evento salvo.':'Evento removido dos salvos.');
  });return;
  case 'save':await attempt(async()=>{
    const target=ref('members',me(),'saved',id);
    if(state.savedIds.includes(id)){await firebase.deleteDoc(target);showToast('Removido dos seus salvos.');}
    else{await firebase.setDoc(target,{savedAt:now()});showToast('Publicação salva!');}
  });return;
  case 'like':await attempt(async()=>{
    const post=state.posts.find(p=>p.id===id);if(!post)return;
    const liked=(post.likes||[]).includes(me());
    await firebase.updateDoc(ref('posts',id),{likes:liked?firebase.arrayRemove(me()):firebase.arrayUnion(me())});
  });return;
  case 'join-group':await attempt(async()=>{
    const group=state.groups.find(g=>g.id===id);if(!group)return;
    const uid=me(),joined=group.members?.includes(uid),target=ref('groups',id);
    if(joined){
      const batch=firebase.writeBatch(db);
      batch.update(target,{members:firebase.arrayRemove(uid)});
      batch.delete(ref('members',uid,'moderation',id));
      await batch.commit();
    }else await firebase.updateDoc(target,{members:firebase.arrayUnion(uid)});
    if(me()===uid)watchPollNotices();
    showToast(joined?'Você saiu da comunidade.':'Bem-vindo à comunidade!');
  },'updatingGroup');return;
  case 'release-event-seat':await attempt(async()=>{
    const event=state.events.find(item=>item.id===id),uid=me();
    if(!event||!eventSeatOffer(event,uid))return;
    const status=await changeEventSeat(id,'leave-queue',uid);
    if(me()===uid&&status==='left-queue')showToast('Vaga liberada. Você saiu da lista de espera.');
  });return;
  case 'cancel-event-conflict':
    if(state.modal==='event-conflict')leaveEventConflict();
    return;
  case 'confirm-event-conflict':
  case 'rsvp':await attempt(async()=>{
    const override=btn.dataset.action==='confirm-event-conflict';
    if(override&&(state.modal!=='event-conflict'||state.eventConflict?.id!==id))return;
    const event=state.events.find(e=>e.id===id);if(!event)return;
    if(event.cancelled===true)return;
    const attending=(event.attendees||[]).includes(me());
    if(override&&attending){leaveEventConflict();return;}
    if(!attending&&(viewerEventSchedule(event).date<today()||(event.groupId&&!pollMember(event.groupId)&&!event.waitlist?.includes(me()))))return;
    const uid=me(),limited=Number.isInteger(event.capacity),queued=event.waitlist?.includes(uid),offered=eventSeatOffer(event);
    if(!uid)return;
    const eligible=!event.groupId||pollMember(event.groupId);
    const intent=attending?'leave':queued&&(!offered||!eligible)?'leave-queue':'join';
    const willConfirm=intent==='join'&&(!limited||
      ((event.attendees||[]).length<event.capacity&&(!event.waitlist.length||offered)));
    if(!override&&willConfirm&&conflictingEvents(event).length){
      state.eventConflict={id,fromDetail:state.modal==='event-detail'};
      openModal('event-conflict');return;
    }
    if(override){
      leaveEventConflict();
      if(!willConfirm){showToast('A vaga não está mais disponível. Confira a lista de espera.');return;}
    }
    if(limited){
      const status=await changeEventSeat(id,intent,uid,override);
      if(me()!==uid)return;
      if(status==='conflict'){
        state.eventConflict={id,fromDetail:state.modal==='event-detail'};
        openModal('event-conflict');return;
      }
      const messages={left:'Participação removida.',confirmed:'Presença confirmada!',queued:'Você entrou na lista de espera.',
        'left-queue':'Você saiu da lista de espera.',expired:'A lista de espera foi atualizada. Confira a disponibilidade.',
        unavailable:'A vaga não está mais disponível. Confira a lista de espera.'};
      if(messages[status]){watchEventBulletins();showToast(messages[status]);}
      return;
    }
    await firebase.updateDoc(ref('events',id),{attendees:attending?firebase.arrayRemove(me()):firebase.arrayUnion(me())});
    watchEventBulletins();
    showToast(attending?'Participação removida.':event.groupId?'Presença confirmada!':'Sua participação foi marcada como interesse!');
  });return;
  case 'post-options':{
    if(!me()||!state.posts.some(post=>post.id===id&&post.userId===me()))return;
    state.postEditor={id,previous:['comments','group-detail'].includes(state.modal)?state.modal:null};
    state.modal='post-options';render();return;
  }
  case 'edit-post':
    if(state.modal!=='post-options'||state.postEditor?.id!==id||!state.posts.some(post=>post.id===id&&post.userId===me()))return;
    state.drafts.delete('edit-post:'+id);
    state.modal='edit-post';render();document.getElementById('edit-post-content')?.focus();return;
  case 'return-to-post':
    if(['post-options','edit-post'].includes(state.modal))returnFromPostEditor();
    return;
  case 'delete-post':if(!state.posts.some(post=>post.id===id&&post.userId===me())||!confirm('Excluir esta publicação definitivamente?'))return;
    await attempt(async()=>{
      await firebase.deleteDoc(ref('posts',id));
      if(state.modal==='post-options'&&state.postEditor?.id===id){
        if(state.postEditor.previous==='comments')closeModal();else returnFromPostEditor();
      }
      showToast('Publicação excluída.');
    });return;
  case 'comment-options':
    if(state.modal!=='comments'||state.busy||!me()||!state.comments.some(item=>item.id===id&&item.userId===me()))return;
    state.commentEditor=state.commentEditor?.id===id?null:{id,editing:false};
    render();return;
  case 'edit-comment':
    if(state.modal!=='comments'||state.busy||state.commentEditor?.id!==id||!state.comments.some(item=>item.id===id&&item.userId===me()))return;
    state.drafts.delete('edit-comment:'+state.selectedPost+':'+id);
    state.commentEditor.editing=true;
    render();document.getElementById('edit-comment-text')?.focus();return;
  case 'close-comment-options':
    if(state.modal==='comments'&&!state.busy){state.commentEditor=null;render();}
    return;
  case 'delete-comment':if(state.modal!=='comments'||!state.comments.some(item=>item.id===id&&item.userId===me())||!confirm('Excluir este comentário?'))return;
    await attempt(async()=>{await firebase.deleteDoc(ref('posts',state.selectedPost,'comments',id));showToast('Comentário excluído.');});return;
  case 'report-post':openReport('post',id);return;
  case 'report-group-comment':openReport('comment',id);return;
  case 'report-content':openReport(btn.dataset.type,id);return;
  default:return;
 }
}
document.addEventListener('click',async(event)=>{
 const button=event.target.closest('[data-action]');if(button){event.preventDefault();await onAction(button);return;}
 if(event.target.matches('[data-overlay="true"]'))closeModal();
});
document.addEventListener('keydown',handleDialogKey);
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='visible')void syncNotificationReads();
 if(document.visibilityState==='visible'&&state.user){watchPollNotices();watchEventBulletins();scheduleEventOffers();scheduleEventReminderRefresh();loadHomeEventRooms();void loadPersonalHistory();render();}
 void markOpenConversationRead();
});
document.addEventListener('change',(event)=>{
 if(event.target.form?.id==='post-form')savePostDraft(event.target.form);
 if(['format','timeZone'].includes(event.target.name)&&['event-form','event-edit-form'].includes(event.target.form?.id)){
   syncEventFormatFields(event.target.form);return;
 }
 if(event.target.dataset?.feedbackStatus){
   const id=event.target.dataset.feedbackStatus,status=event.target.value,queue=state.productFeedbackQueue;
   if(status==='resolved'&&state.feedbackAdmin&&state.modal==='product-feedback-admin'&&queue?.entries.some(item=>item.id===id&&item.status!==status)){
     queue.resolutionId=id;
     render();
     document.getElementById('feedback-resolution-text')?.focus();
   }else{
     void updateProductFeedbackStatus(id,status);
   }
   return;
 }
 if(event.target.id==='moderation-member'){
   void loadModerationSelection(event.target.dataset.group,event.target.value);return;
 }
 if(event.target.id==='explore-hobby')state.exploreHobby=event.target.value;
 else if(event.target.id==='explore-city')state.exploreCity=event.target.value;
 else if(event.target.id==='post-search-hobby'){state.postSearchHobby=event.target.value;state.postSearchLimit=20;}
 else if(event.target.id==='post-search-group'){state.postSearchGroup=event.target.value;state.postSearchLimit=20;}
 else if(event.target.id==='welcome-hobby')state.welcomeHobby=event.target.value;
 else if(event.target.id==='event-hobby')state.eventHobby=event.target.value;
 else if(event.target.id==='event-community')state.eventCommunity=event.target.value;
 else if(event.target.id==='event-format-filter')state.eventFormat=event.target.value;
 else if(event.target.id==='group-hobby')state.groupHobby=event.target.value;
 else if(event.target.id==='group-city')state.groupCity=event.target.value;
 else return;
 render();
});
window.addEventListener('hashchange',openLinkedContent);
window.addEventListener('online',()=>void syncNotificationReads());
window.visualViewport?.addEventListener('resize',updateMobileViewport);
window.visualViewport?.addEventListener('scroll',updateMobileViewport);
document.addEventListener('input',(event)=>{
 if(event.target.form?.id==='post-form')savePostDraft(event.target.form);
 if(event.target.id==='event-search'){state.eventSearch=event.target.value;render();return;}
 if(event.target.matches('[data-live-search="true"]')){state.search=event.target.value;state.postSearchLimit=20;render();}
});
document.addEventListener('submit',async(event)=>{
 const form=event.target;
 if(!form.id)return;
 event.preventDefault();
 const data=Object.fromEntries(new FormData(form));
 const val=(key)=>String(data[key]||'').trim();
 switch(form.id){
  case 'reset-form':await attempt(async()=>{
    await firebase.sendPasswordResetEmail(auth,val('email'));
    state.authMode='login';state.drafts.clear();
    showToast('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.');
  });return;
  case 'auth-form':await attempt(async()=>{
    const email=val('email'),password=String(data.password||'');
    if(state.authMode==='login')await firebase.signInWithEmailAndPassword(auth,email,password);
    else{
      const name=val('name'),location=val('location');if(name.length<2||!location)throw new Error('Informe seu nome e sua cidade.');
      state.pendingSignup={name,location};
      try {await firebase.createUserWithEmailAndPassword(auth,email,password);}
      catch(error){state.pendingSignup=null;throw error;}
      showToast('Conta criada! Seja bem-vindo ao HobbyHub.');
    }
  });return;
  case 'edit-comment-form':await attempt(async()=>{
    const editor=state.commentEditor,postId=state.selectedPost,uid=me(),text=val('text');
    const comment=state.comments.find(item=>item.id===editor?.id&&item.userId===uid);
    if(!uid||!postId||!comment||state.modal!=='comments'||!editor.editing||!text||text.length>800)return;
    if(text!==comment.text){
      await firebase.updateDoc(ref('posts',postId,'comments',comment.id),{text,editedAt:firebase.serverTimestamp()});
      if(me()!==uid)return;
      showToast('Comentário atualizado.');
    }
    if(state.commentEditor===editor&&state.selectedPost===postId)state.commentEditor=null;
  });return;
  case 'edit-post-form':await attempt(async()=>{
    const editor=state.postEditor,uid=me(),content=val('content');
    const post=state.posts.find(item=>item.id===editor?.id&&item.userId===uid);
    if(!uid||!post||state.modal!=='edit-post'||!content||content.length>2000)return;
    if(content!==post.content){
      await firebase.updateDoc(ref('posts',post.id),{content,editedAt:firebase.serverTimestamp()});
      if(me()!==uid)return;
      showToast('Publicação atualizada.');
    }
    if(state.postEditor===editor&&state.modal==='edit-post')returnFromPostEditor();
  });return;
  case 'post-form':await attempt(async()=>{
    const content=val('content');if(!content||content.length>2000)return;
    const uid=me(),key=postDraftKey(),originalDraft=readPostDraft(key);
    const groupId=state.composingGroup,eventRecapId=state.composingRecapId;
    if(eventRecapId){
      const event=state.events.find(item=>item.id===eventRecapId);
      if(!canComposeEventRecap(event)||event.groupId!==groupId)throw new Error('Este encontro não está mais disponível para publicar um relato.');
    }
    await firebase.addDoc(col('posts'),{userId:me(),userName:myName(),userAvatar:state.profile.avatar,location:myLocation(),hobby:val('hobby'),content,format:val('format'),likes:[],createdAt:now(),...(groupId?{groupId}:{}),...(eventRecapId?{eventRecapId}:{})});
    const saved=readPostDraft(key);
    if(key&&originalDraft?.content===data.content&&JSON.stringify(saved)===JSON.stringify(originalDraft))removePostDraft(key);
    if(me()!==uid)return;
    if(groupId===state.invitedGroupId)state.invitedGroupId=null;
    closeModal();setTab(groupId?'groups':'home');
    if(groupId){state.selectedGroup=groupId;openModal('group-detail');}
    showToast('Sua publicação está no ar!');
  });return;
  case 'group-form':await attempt(async()=>{
    const name=val('name');if(name.length<3)return;
    await firebase.addDoc(col('groups'),{name,hobby:val('hobby'),description:val('description'),location:val('location'),createdBy:me(),members:[me()],createdAt:now()});
    closeModal();state.groupView='mine';setTab('groups');showToast('Comunidade criada com sucesso!');
  });return;
  case 'event-form':await attempt(async()=>{
    const groupId=state.eventGroupId;
    const fromPoll=state.eventTemplate?.source==='poll';
    if(fromPoll&&(!canDraftPollEvent(state.pollDetail)||state.pollDetail.groupId!==groupId))throw new Error('A criação por enquete exige permissão de moderação na comunidade.');
    const uid=me(),isRepeat=Boolean(state.eventTemplate&&!fromPoll);
    const limit=val('capacity'),capacity=Number(limit);
    if(limit&&(!Number.isInteger(capacity)||capacity<2||capacity>200))throw new Error('Escolha entre 2 e 200 vagas.');
    const time=val('time'),endTime=val('endTime'),format=val('format')||'in-person',roomUrl=val('roomUrl');
    const timeZone=format==='online'?(val('timeZone')||defaultEventTimeZone()):'';
    if(timeZone&&!Object.hasOwn(eventTimeZones,timeZone))throw new Error('Escolha um fuso horário válido.');
    if(val('date')<eventZoneToday(timeZone))throw new Error('A data deve ser hoje ou no futuro.');
    const location=format==='online'?'Online':val('location');
    if(format==='online'&&!validEventRoomUrl(roomUrl))throw new Error('Informe um link HTTPS válido para a sala.');
    if(!location)throw new Error('Informe o local do encontro.');
    validateEventEndTime(time,endTime);
    const fields={...(limit?{capacity,waitlist:[],offerAt:null}:{}),title:val('title'),date:val('date'),time,...(endTime?{endTime}:{}),...(timeZone?{timeZone}:{}),hobby:val('hobby'),format,location,description:val('description'),createdBy:uid,attendees:[uid],createdAt:now(),...(groupId?{groupId}:{})};
    let created;
    if(format==='online'){
      if(fields.description.includes(roomUrl))throw new Error('Use apenas o campo privado para o link da sala.');
      created=firebase.doc(col('events'));
      const batch=firebase.writeBatch(db);
      batch.set(created,fields);
      batch.set(ref('events',created.id,'private','room'),{url:roomUrl,ownerId:uid});
      await batch.commit();
    }else{
      created=await firebase.addDoc(col('events'),fields);
    }
    if(me()!==uid)return;
    state.eventTemplate=null;
    closeModal();setTab(groupId?'groups':'events');
    if(isRepeat)openEventDetail(created.id);
    else if(groupId){state.selectedGroup=groupId;openModal('group-detail');}
    showToast(isRepeat?'Nova edição criada! Copie o novo convite.':'Evento criado! Convide sua comunidade.');
  });return;
  case 'event-edit-form':await attempt(async()=>{
    const event=state.events.find(item=>item.id===state.selectedEvent);
    if(!event||event.createdBy!==me()||event.cancelled===true)return;
    const date=val('date'),time=val('time'),endTime=val('endTime'),format=val('format')||eventFormat(event),roomUrl=val('roomUrl');
    const timeZone=format==='online'?(val('timeZone')||defaultEventTimeZone()):'';
    if(timeZone&&!Object.hasOwn(eventTimeZones,timeZone))throw new Error('Escolha um fuso horário válido.');
    const location=format==='online'?'Online':val('location');
    if(date<eventZoneToday(timeZone)||!time||!location)throw new Error('Informe data, horário e local válidos.');
    if(format==='online'&&!validEventRoomUrl(roomUrl))throw new Error('Informe um link HTTPS válido para a sala.');
    validateEventEndTime(time,endTime);
    const target=ref('events',event.id);
    const changed=await firebase.runTransaction(db,async transaction=>{
      const latest=(await transaction.get(target)).data();
      if(!latest||latest.cancelled===true)throw new Error('Este evento já foi cancelado ou removido.');
      const roomRef=ref('events',event.id,'private','room');
      const previousRoom=latest.format==='online'?(await transaction.get(roomRef)).data()?.url:'';
      if(format==='online'&&latest.description?.includes(roomUrl))throw new Error('Escolha um link que não esteja na descrição pública do evento.');
      if(date===latest.date&&time===latest.time&&endTime===(latest.endTime||'')&&timeZone===(latest.timeZone||'')&&location===latest.location&&format===latest.format&&
         (format!=='online'||previousRoom===roomUrl))return false;
      const revision=(latest.revision||0)+1;
      const previousLocation=format==='online'&&/https?:\/\/|www\./i.test(latest.location)?'Online':latest.location;
      const previousSchedule={date:latest.date,time:latest.time,endTime:latest.endTime||'',timeZone:latest.timeZone||'',location:previousLocation,revision};
      transaction.update(target,{date,time,endTime,timeZone,format,location,previousSchedule,revision,scheduleChangedAt:firebase.serverTimestamp()});
      if(format==='online')transaction.set(roomRef,{url:roomUrl,ownerId:latest.createdBy});
      else if(latest.format==='online')transaction.delete(roomRef);
      return true;
    });
    if(state.modal==='event-edit'&&state.selectedEvent===event.id)openEventDetail(event.id);
    showToast(changed?'Evento atualizado.':'Nenhuma alteração no evento.');
  });return;
  case 'event-bulletin-form':await attempt(async()=>{
    const event=state.events.find(item=>item.id===state.selectedEvent),uid=me();
    const text=val('text');
    if(!uid||event?.createdBy!==uid||event.cancelled||state.modal!=='event-detail'||text.length<3||text.length>500)return;
    await firebase.addDoc(col('events',event.id,'bulletins'),{text,createdAt:firebase.serverTimestamp()});
    if(me()===uid&&state.selectedEvent===event.id&&state.modal==='event-detail'){
      clearSubmittedDraft(form.id,form.dataset.draftKey,'text',data.text);
      watchEventBulletins();showToast('Recado publicado para quem confirmou presença.');
    }
  });return;
  case 'event-question-form':
  case 'event-answer-form':await attempt(async()=>{
    const event=state.events.find(item=>item.id===state.selectedEvent),uid=me();
    if(!event||event.cancelled||!uid||state.modal!=='event-detail')return;
    const answering=form.id==='event-answer-form';
    const field=answering?'answer':'question';
    const content=val(field);
    if(answering){
      const questionId=state.eventAnswerId;
      if(event.createdBy!==uid||!content||!state.eventDiscussion?.questions.some(item=>item.id===questionId))return;
      const questionRef=ref('events',event.id,'questions',questionId);
      await firebase.runTransaction(db,async transaction=>{
        const question=(await transaction.get(questionRef)).data();
        if(!question)throw new Error('Esta pergunta está indisponível.');
        transaction.update(questionRef,{answer:content,answeredAt:firebase.serverTimestamp()});
        if(!question.answer&&question.authorId!==uid){
          const notice=ref('members',question.authorId,'notifications',`event-answer-${event.id}:${questionId}`);
          transaction.set(notice,{type:'event-answer',actorId:uid,eventId:event.id,questionId,createdAt:firebase.serverTimestamp()});
        }
      });
      if(state.eventAnswerId===questionId)state.eventAnswerId=null;
    }else{
      if(content.length<3)return;
      await firebase.addDoc(col('events',event.id,'questions'),{authorId:uid,question:content,createdAt:firebase.serverTimestamp()});
    }
    if(me()===uid&&state.selectedEvent===event.id&&state.modal==='event-detail'){
      clearSubmittedDraft(form.id,form.dataset.draftKey,field,data[field]);
      await loadEventQuestions(event.id);
      showToast(answering?'Resposta publicada.':'Pergunta enviada.');
    }
  });return;
  case 'event-feedback-form':await attempt(async()=>{
    const event=state.events.find(item=>item.id===state.selectedEvent);
    const uid=me(),answer=val('attended'),comment=val('comment');
    if(!feedbackAvailable(event)||!canReviewEvent(event,uid)||!['yes','no'].includes(answer)||comment.length>500)return;
    await firebase.setDoc(ref('events',event.id,'feedback',uid),{
      attended:answer==='yes',comment,updatedAt:firebase.serverTimestamp()
    });
    if(me()===uid&&state.modal==='event-detail'&&state.selectedEvent===event.id)await loadEventFeedback(event);
    showToast('Avaliação salva.');
  });return;
  case 'poll-form':await attempt(async()=>{
    const group=state.groups.find(item=>item.id===state.selectedGroup);
    if(!pollMember(group?.id)||!canManageGroup(group))return;
    const question=val('question'),days=Number(val('days'));
    const choices=pollOptions.map(val).filter(Boolean);
    if(question.length<3||choices.length<2||!([1,3,7].includes(days)))throw new Error('Informe uma pergunta e pelo menos duas opções.');
    if(new Set(choices.map(norm)).size!==choices.length)throw new Error('Escreva opções diferentes entre si.');
    const options=Object.fromEntries(pollOptions.map((key,index)=>[key,choices[index]||'']));
    const poll=firebase.doc(col('groups',group.id,'polls')),uid=me();
    const batch=firebase.writeBatch(db);
    batch.set(poll,{question,options,createdBy:uid,createdAt:firebase.serverTimestamp(),endsAt:firebase.Timestamp.fromMillis(now()+days*86400000)});
    batch.set(ref('groups',group.id,'polls',poll.id,'totals','main'),{a:0,b:0,c:0,d:0});
    await batch.commit();
    if(me()===uid&&state.selectedGroup===group.id&&state.modal==='poll-create'){
      openModal('group-polls');await loadGroupPolls(group.id);
    }
    if(me()===uid)showToast('Enquete publicada!');
  });return;
  case 'moderate-post-form':await attempt(async()=>{
    const uid=me(),target=state.groupRemoval,reason=val('reason');
    if(!target||!reason||reason.length>300||!canManageGroup(state.groups.find(group=>group.id===target.groupId)))return;
    const postRef=ref('posts',target.postId),entryRef=firebase.doc(col('groups',target.groupId,'moderationLog'));
    const {content,pointer}=moderationTargetRefs(target.postId,target.commentId);
    await firebase.runTransaction(db,async transaction=>{
      const post=(await transaction.get(postRef)).data();
      if(!post||post.groupId!==target.groupId)throw new Error('Esta publicação já está indisponível.');
      const snapshot=target.commentId?(await transaction.get(content)).data():post;
      if(!snapshot)throw new Error('Este comentário já está indisponível.');
      const reportRef=target.reportId?ref('groups',target.groupId,'reports',target.reportId):null;
      if(reportRef&&(await transaction.get(reportRef)).data()?.status!=='pending')throw new Error('Esta denúncia já foi revisada.');
      transaction.set(entryRef,{postId:target.postId,...(target.commentId?{commentId:target.commentId,comment:snapshot}:{post}),reason,removedBy:uid,removedAt:firebase.serverTimestamp()});
      transaction.set(pointer,{groupId:target.groupId,entryId:entryRef.id});
      transaction.delete(content);
      if(reportRef)transaction.update(reportRef,{status:'removed',reviewedBy:uid,reviewedAt:firebase.serverTimestamp(),moderationId:entryRef.id});
    });
    if(me()!==uid)return;
    if(state.groupRemoval===target&&state.modal==='moderate-post'){
      state.groupRemoval=null;state.selectedGroup=target.groupId;
      if(target.reportId){openModal('group-report-queue');await loadGroupReportQueue(target.groupId);}
      else if(target.commentId)openComments(target.postId);
      else openModal('group-detail');
    }
    showToast(target.commentId?'Comentário retirado. O registro está no histórico de moderação.':'Publicação retirada. O registro está no histórico de moderação.');
  });return;
  case 'profile-form':await attempt(async()=>{
    const name=val('name'),location=val('location'),avatarValue=val('avatar');
    if(!name||!location||!avatarValue)throw new Error('Nome, localidade e avatar são obrigatórios.');
    const hobbies=[...new Set(val('hobbies').split(',').map(s=>s.trim()).filter(Boolean))].slice(0,10);
    const photoUrl=mediaUrl(val('photoUrl')),videoUrl=mediaUrl(val('videoUrl'));
    if((val('photoUrl')&&!photoUrl)||(val('videoUrl')&&!videoUrl))throw new Error('Use um link HTTPS válido para a foto ou o vídeo.');
    await firebase.updateDoc(memberRef(me()),{name,location,avatar:avatarValue,bio:val('bio'),hobbies,photoUrl,videoUrl});
    closeModal();showToast('Perfil atualizado!');
  });return;
  case 'testimonial-form':await attempt(async()=>{
    const recipient=state.viewUser,text=val('text');
    if(!recipient||recipient===me()||!text)return;
    await firebase.setDoc(ref('members',recipient,'testimonials',me()),{text,createdAt:now(),approved:false});
    await loadPersonTestimonials(recipient);
    showToast('Depoimento enviado para aprovação.');
  });return;
  case 'comment-form':await attempt(async()=>{
    const text=val('text'),postId=state.selectedPost;
    if(!text||!postId)return;
    const comment=firebase.doc(col('posts',postId,'comments'));
    const owner=state.posts.find(post=>post.id===postId)?.userId;
    const batch=firebase.writeBatch(db);
    batch.set(comment,{userId:me(),userName:myName(),text,createdAt:now()});
    if(owner&&owner!==me())batch.set(ref('members',owner,'notifications',`comment-${postId}:${comment.id}`),notificationFields('comment',postId,comment.id));
    await batch.commit();
    const group=state.groups.find(item=>item.id===state.invitedGroupId);
    if(group?.pinnedPostId===postId)state.invitedGroupId=null;
    clearSubmittedDraft(form.id,form.dataset.draftKey,'text',data.text);
    showToast('Comentário publicado!');
  });return;
  case 'message-form':await attempt(async()=>{
    const text=val('message');if(!text)return;
    const key=form.dataset.draftKey;
    const payload={senderId:me(),senderName:myName(),text,createdAt:now()};
    if(state.chatMode==='direct'){
      if(!state.chatTarget?.uid||state.blockedIds.includes(state.chatTarget.uid))return;
      await firebase.addDoc(firebase.collection(db,'artifacts',PROJECT,'dm_threads',threadId(me(),state.chatTarget.uid),'messages'),payload);
    }else{
      await firebase.addDoc(col('messages'),{...payload,location:myLocation(),scope:state.chatMode==='global'?'global':'local'});
    }
    clearSubmittedDraft(form.id,key,'message',data.message);
    if(me()===payload.senderId)showToast('Mensagem enviada.');
  },'busy',state.chatMode==='direct'?'Não foi possível enviar uma mensagem nesta conversa.':undefined);return;
  case 'feedback-supplement-form':await attempt(async()=>{
    const detail=state.feedbackSupplements,uid=me(),message=val('message');
    if(!uid||state.modal!=='my-feedback-detail'||detail?.id!==state.selectedFeedbackId||
       !state.myProductFeedback?.some(item=>item.id===detail.id&&item.status==='in-review'))return;
    if(message.length<3||message.length>600)throw new Error('Escreva um complemento de 3 a 600 caracteres.');
    const saved=firebase.doc(feedbackSupplementsRef(detail.id));
    const feedback=firebase.doc(db,'artifacts',PROJECT,'productFeedback',detail.id);
    const batch=firebase.writeBatch(db);
    batch.set(saved,{message,createdAt:firebase.serverTimestamp()});
    batch.update(feedback,{hasUnreadSupplements:true,lastSupplementId:saved.id});
    await batch.commit();
    if(me()!==uid||state.feedbackSupplements!==detail||state.modal!==detail.modal)return;
    if(!detail.entries.some(item=>item.id===saved.id)){
      detail.entries.unshift({id:saved.id,message,createdAt:{toMillis:()=>Date.now()}});
    }
    clearSubmittedDraft(form.id,form.dataset.draftKey,'message',data.message);
    showToast('Complemento enviado.');
  });return;
  case 'product-feedback-resolution-form':
    await updateProductFeedbackStatus(state.productFeedbackQueue?.resolutionId,'resolved',val('resolution'));return;
  case 'product-feedback-form':await attempt(async()=>{
    const uid=me(),category=val('category'),message=val('message');
    if(!uid||state.modal!=='product-feedback'||!['problem','suggestion'].includes(category))return;
    if(message.length<3||message.length>600)throw new Error('Escreva uma mensagem de 3 a 600 caracteres.');
    await firebase.addDoc(firebase.collection(db,'artifacts',PROJECT,'productFeedback'),{
      authorId:uid,category,message,createdAt:firebase.serverTimestamp(),status:'new'
    });
    if(me()===uid&&state.modal==='product-feedback'){closeModal();showToast('Feedback enviado à administração.');}
  });return;
  case 'report-form':await attempt(async()=>{
    const target=state.reportTarget;
    if(!target||!me())return;
    const fields={reporterId:me(),reason:val('reason'),details:val('details')};
    if(target.groupId)await firebase.addDoc(col('groups',target.groupId,'reports'),{
      ...fields,targetType:target.targetType,postId:target.postId,commentId:target.commentId,
      text:target.targetText,createdAt:firebase.serverTimestamp(),status:'pending'
    });
    else await firebase.addDoc(col('reports'),{...target,...fields,createdAt:now()});
    if(state.modal==='report'&&state.reportTarget===target)closeModal();
    showToast('Denúncia registrada para análise.');
  });return;
  default:return;
 }
});
if ('serviceWorker' in navigator) {window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(error=>console.warn('Service Worker:',error)));}
init();
