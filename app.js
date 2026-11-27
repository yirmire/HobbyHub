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
  threads:[], directMessages:[], comments:[], savedIds:[], savedEventDates:new Map(), followingIds:[], followedPosts:new Map(), followedPostWatches:new Map(), blockedIds:[], receivedTestimonials:[], visibleTestimonials:[], sentTestimonial:null, testimonialStatus:'',
  tab:'home', feed:'all', topic:'Todos', groupView:'mine', groupNewsLimit:20, groupNewsGroup:'', groupNewsUnseenOnly:false, groupNewsSearch:'', groupHobby:'', groupMyInterests:false, savedDiscoveryOnly:false, groupDiscoveryOrder:'default', groupCity:'', eventFilter:'upcoming', receivedEventInvites:null, sentEventInvites:null, dismissedEventInviteIds:new Set(), showDismissedEventInvites:false, search:'', exploreCity:'', exploreHobby:'',
  savedView:'saved', savedReadingOnly:false, readSavedPosts:new Set(), savedPostOrder:'recent', savedPostDates:new Map(), savedGroup:'', savedSearch:'', followedPostsFilter:'all',
  savedCollections:[], savedMemberships:new Map(), selectedSavedCollection:'', collectionPostId:null, editingSavedCollectionId:null,
  savedSelection:null,
  savedNotes:new Map(), savedNotePostId:null,
  savedComments:new Map(), savedCommentWatches:new Map(),
  myCommentActivity:null,
  exploreView:'people', postSearchHobby:'', postSearchGroup:'', postSearchLimit:20,
  eventSearch:'', eventHobby:'', eventCommunity:'', eventFormat:'', eventCityFilter:'', eventFiltersOpen:false, savedEventSearches:new Map(), savedEventSearchesLoaded:false, eventRoom:null, homeEventRooms:new Map(),
  eventAgendaView:'list', eventWeekOffset:0,
  chatMode:'community', chatTarget:null, communityReply:null, communityHistoryAnchor:null, communitySearch:null, communitySavedPanel:null, communitySavedCloud:null, communitySavedMigration:null, communityReadSync:null, mobileChatOpen:false, mobileChatOptions:false, directMessageMenu:null, mobileChatListScroll:0, directSearch:null, directLinksLimit:0, directEventLimit:0, allSavedDirect:null, directSavedLimit:0, directSavedIds:null, directSavedUnsub:null, directHistoryAnchor:null, directReply:null, eventChatShares:new Map(), directMessageEditor:null, directReactionPicker:null, selectedPost:null, postEditor:null, commentEditor:null, commentReplyId:null, expandedCommentReplies:new Set(), selectedGroup:null, composingGroup:null, viewUser:null,
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
  notifications:[], notificationSettings:{}, notificationSettingsLoaded:false, eventHobbyAlerts:new Map(), eventHobbyAlertsLoaded:false, reportNotices:new Map(), reportNoticeUnsubs:new Map(), notificationReads:new Set(),
  mutedCommunityIds:new Set(), mutedCommunitiesLoaded:false,
  pinnedGroupIds:new Set(), pinnedGroupsLoaded:false, changingPinnedGroup:false,
  savedDiscoveryGroupIds:new Set(), savedDiscoveryGroupsLoaded:false, changingSavedDiscoveryGroup:false,
  groupNewsReads:new Map(), groupNewsReadsLoaded:false, markingGroupNews:false,
  notificationFilter:'all', notificationReadSync:null, feedbackAdmin:false, feedbackAdminRole:null, productFeedbackQueue:null,
  myProductFeedback:null, selectedFeedbackId:null, feedbackSupplements:null,
  invitedGroupId:null, groupFirstStepsId:null, openGroupIntroductions:null, changingGroupWelcome:false, weeklyQuestionHistory:null, weeklyAnswerFilter:'all', weeklyAnswers:null, composingIntroduction:false, composingRecapId:null, pendingPostDraft:null, welcomePending:false, welcomeHobby:'',
  pinnedDirectThreads:[], directThreadFilter:'all', directThreadSearch:'', manualUnreadThreads:new Set(), mutedDirectThreads:new Map(), directMuteMenu:null, directMuteTimer:null, archivedDirectThreads:new Map(), latestInboundAt:new Map(), privateReadAt:new Map(), inboundUnsubs:new Map(), pendingReads:new Set(),
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
 state.savedEventSearchNews=null;
 state.receivedEventInvites=null;state.sentEventInvites=null;state.dismissedEventInviteIds.clear();state.showDismissedEventInvites=false;
 if(['invites','sent-invites'].includes(state.eventFilter))state.eventFilter='upcoming';
 state.eventChatShares.clear();
 state.mobileChatOpen=false;state.mobileChatOptions=false;state.directMessageMenu=null;state.mobileChatListScroll=0;
 state.directMessageEditor=null;state.communityReply=null;state.communityHistoryAnchor=null;state.communitySearch=null;state.communitySavedPanel=null;
 state.communitySavedCloud=null;state.communitySavedMigration=null;
 clearTimeout(state.communityReadSync?.timer);state.communityReadSync=null;
 closeAllSavedDirectMessages();
 stopDirectSavedMessages();
 for(const unsub of state.sessionUnsubs.splice(0))try{unsub();}catch{}
 for(const unsubscribe of state.inboundUnsubs.values())unsubscribe();
 state.inboundUnsubs.clear();
 for(const unsubscribe of state.reportNoticeUnsubs.values())unsubscribe();
 state.reportNoticeUnsubs.clear();state.reportNotices.clear();
 for(const watch of state.pollWatches.values())watch.unsubscribe();
 state.pollWatches.clear();clearTimeout(state.pollNoticeTimer);clearTimeout(state.eventOfferTimer);clearTimeout(state.eventReminderTimer);
 for(const watch of state.eventBulletins.values())watch.unsubscribe();
 state.eventBulletins.clear();
 for(const watch of state.followedPostWatches.values())watch.unsubscribe();
 state.followedPostWatches.clear();state.followedPosts.clear();
 for(const watch of state.savedCommentWatches.values())watch.unsubscribe();
 state.savedCommentWatches.clear();state.savedComments.clear();
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
function isArchivedDirectThread(id){
 return state.archivedDirectThreads.has(id)&&
   (state.latestInboundAt.get(id)||0)<=state.archivedDirectThreads.get(id);
}
function showCommunityChat(mode,open=false){
 if(open&&isMobileChatLayout()&&!state.mobileChatOpen)state.mobileChatListScroll=window.scrollY;
 state.mobileChatOpen=open;state.mobileChatOptions=false;state.directMessageMenu=null;
 state.directMuteMenu=null;
 stopDirectSavedMessages();
 if(state.chatMode!==mode)state.communityReply=null;
 state.communityHistoryAnchor=null;state.communitySearch=null;state.communitySavedPanel=null;
 state.chatMode=mode;state.chatTarget=null;
 state.directSearch=null;state.directLinksLimit=0;state.directEventLimit=0;state.directHistoryAnchor=null;state.directReply=null;state.directReactionPicker=null;
 if(state.messageUnsub){state.messageUnsub();state.messageUnsub=null;}
 state.directMessages=[];
 render();
 if(open)focusMobileChat();
}
async function toggleArchivedDirectThread(){
 const uid=me(),peer=state.chatTarget?.uid;
 if(!uid||!peer||state.chatMode!=='direct')return;
 const id=threadId(uid,peer);
 if(!state.threads.some(thread=>thread.id===id))return;
 const archived=isArchivedDirectThread(id);
 const lastInboundAt=state.directMessages.reduce((latest,message)=>
   message.senderId!==uid?Math.max(latest,message.createdAt||0):latest,state.latestInboundAt.get(id)||0);
 await attempt(async()=>{
   const marker=ref('members',uid,'privateArchive',id);
   if(archived)await firebase.deleteDoc(marker);
   else await firebase.setDoc(marker,{lastInboundAt:Math.ceil(lastInboundAt)});
   if(me()!==uid)return;
   if(state.chatMode==='direct'&&state.chatTarget?.uid===peer){
     if(archived)state.directThreadFilter='all';
     else showCommunityChat('community');
   }
   showToast(archived?'Conversa desarquivada.':'Conversa arquivada.');
 },'changingDirectArchive');
}
const directMuteDurations=new Map([['1h',3600000],['8h',28800000],['manual',0]]);
function directThreadMuted(id,at=now()){
 const until=state.mutedDirectThreads.get(id);
 return until===0||until>at;
}
function scheduleDirectMuteRefresh(){
 clearTimeout(state.directMuteTimer);
 const at=now();
 let expires=Infinity;
 for(const until of state.mutedDirectThreads.values()){
   if(until>at)expires=Math.min(expires,until);
 }
 if(Number.isFinite(expires))state.directMuteTimer=setTimeout(()=>{
   scheduleDirectMuteRefresh();
   render();
 },expires-at);
}
async function toggleMutedDirectThread(duration){
 const uid=me(),peer=state.chatTarget?.uid;
 if(!uid||!peer||state.chatMode!=='direct')return;
 const id=threadId(uid,peer);
 if(!state.threads.some(thread=>thread.id===id))return;
 const muted=directThreadMuted(id);
 if(!muted&&!duration){
   state.directMuteMenu=state.directMuteMenu===id?null:id;
   render();
   return;
 }
 if(duration&&(!directMuteDurations.has(duration)||state.directMuteMenu!==id||muted))return;
 await attempt(async()=>{
   const marker=ref('members',uid,'privateMuted',id);
   if(muted)await firebase.deleteDoc(marker);
   else{
     const ms=directMuteDurations.get(duration);
     await firebase.setDoc(marker,{muted:true,...(ms?{until:now()+ms}:{})});
   }
   if(me()===uid){
     if(state.directMuteMenu===id)state.directMuteMenu=null;
     showToast(muted?'Contador da conversa reativado.':'Conversa silenciada.');
   }
 },'changingDirectMute');
}
function unreadThread(id) {
 return state.manualUnreadThreads.has(id)||(state.latestInboundAt.get(id)||0)>(state.privateReadAt.get(id)||0);
}
async function markDirectThreadUnread(){
 const uid=me(),peer=state.chatTarget?.uid;
 if(!uid||!peer||state.chatMode!=='direct')return;
 const id=threadId(uid,peer);
 if(!state.threads.some(thread=>thread.id===id))return;
 await attempt(async()=>{
   await firebase.setDoc(ref('members',uid,'privateUnread',id),{unread:true});
   if(me()===uid)showToast('Conversa marcada como não lida.');
 },'markingDirectUnread');
}
function isMobileChatLayout(){
 return window.matchMedia?.('(max-width: 850px)').matches===true;
}
function focusMobileChat(){
 if(!isMobileChatLayout())return;
 window.scrollTo({top:0,behavior:'instant'});
 document.getElementById('mobile-chat-back')?.focus({preventScroll:true});
}
async function markOpenConversationRead() {
 const uid=me(),peer=state.chatTarget?.uid;
 if(!uid||!peer||state.chatMode!=='direct'||state.tab!=='messages'||state.modal||state.allSavedDirect||(isMobileChatLayout()&&!state.mobileChatOpen)||document.visibilityState!=='visible')return;
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
  const uid=me();
  subscribe(col('members',uid,'communitySaved'),snapshot=>{
    if(me()===uid)state.communitySavedCloud={uid,markers:new Map(snapshot.docs.map(marker=>[marker.id,marker.data().saved]))};
  },'mensagens salvas das comunidades');
  void migrateCommunitySaved(uid);
  watchCommunityReading(uid);
  const docs=(snapshot)=>snapshot.docs.map((d)=>({...d.data(),id:d.id}));
  subscribe(col('members'), (s)=>{state.members=docs(s);state.profile=state.members.find((p)=>p.uid===me()) || state.profile;},'membros');
  subscribe(col('posts'), (s)=>{
    state.posts=docs(s).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    void refreshWeeklyAnswers();
    watchFollowedPosts();
    watchSavedComments();
    queueMicrotask(openLinkedContent);
  },'publicações');
  subscribe(col('groups'), (s)=>{
    state.groups=docs(s).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    void refreshWeeklyAnswers();
    state.groupsLoaded=true;
    watchReportNotices();watchPollNotices();
    queueMicrotask(openLinkedContent);
  },'comunidades');
  subscribe(col('events'), (s)=>{
    state.events=docs(s).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));
    state.eventsLoaded=true;scheduleEventOffers();scheduleEventReminderRefresh();watchEventBulletins();void loadPersonalHistory();void loadEventRoom();loadHomeEventRooms();queueMicrotask(openLinkedContent);
  },'eventos');
  subscribe(col('messages'), (s)=>{state.messages=docs(s).sort((a,b)=>compareCommunityPositions(communityMessagePosition(a),communityMessagePosition(b)));},'chat da comunidade');
  subscribe(firebase.query(firebase.collection(db,'artifacts',PROJECT,'dm_threads'),firebase.where('participants','array-contains',me())),
    (s)=>{
      const previous=state.threads.map(thread=>thread.id).sort().join(',');
      state.threads=docs(s).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
      watchLatestIncomingMessages();
      if(state.tab==='events'&&['invites','sent-invites'].includes(state.eventFilter)&&previous!==state.threads.map(thread=>thread.id).sort().join(','))void loadEventInvitations();
    },'conversas privadas');
  subscribe(ref('members',me(),'chatPreferences','pinned'),snapshot=>{
    state.pinnedDirectThreads=pinnedDirectThreads(snapshot);
  },'conversas fixadas');
  subscribe(col('members',me(),'privateArchive'),snapshot=>{
    state.archivedDirectThreads=new Map(snapshot.docs.map(doc=>[doc.id,doc.data().lastInboundAt]));
  },'conversas arquivadas');
  subscribe(col('members',me(),'dismissedEventInvites'),snapshot=>{
    state.dismissedEventInviteIds=new Set(snapshot.docs.map(doc=>doc.id));
  },'convites dispensados');
  subscribe(col('members',me(),'privateMuted'),snapshot=>{
    state.mutedDirectThreads=new Map(snapshot.docs.map(doc=>[doc.id,doc.data().until??0]));
    scheduleDirectMuteRefresh();
  },'conversas silenciadas');
  subscribe(col('members',me(),'privateUnread'),snapshot=>{
    state.manualUnreadThreads=new Set(snapshot.docs.map(doc=>doc.id));
  },'conversas marcadas como não lidas');
  subscribe(col('members',me(),'privateReads'),snapshot=>{
    for(const doc of snapshot.docs)state.privateReadAt.set(doc.id,Math.max(doc.data().lastReadAt||0,state.privateReadAt.get(doc.id)||0));
  },'estado de leitura de mensagens');
  subscribe(col('members',me(),'saved'),snapshot=>{
    state.savedIds=snapshot.docs.map(doc=>doc.id);
    state.readSavedPosts=new Set(snapshot.docs.filter(doc=>doc.data().read===true).map(doc=>doc.id));
    state.savedPostDates=new Map(snapshot.docs.map(doc=>{
      const date=doc.data().savedAt;
      return [doc.id,typeof date==='number'?date:date?.toMillis?.()];
    }));
    for(const id of state.savedSelection||[]){
      if(!state.savedIds.includes(id))state.savedSelection.delete(id);
    }
    state.savedMemberships=new Map(snapshot.docs.map(doc=>{
      const ids=doc.data().collectionIds;
      return [doc.id,Array.isArray(ids)?ids:[]];
    }));
    state.savedNotes=new Map(snapshot.docs.map(doc=>[doc.id,doc.data().note]).filter(([,note])=>typeof note==='string'&&note));
  },'itens salvos');
  subscribe(col('members',me(),'savedCollections'),snapshot=>{
    state.savedCollections=docs(snapshot).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
    if(!state.savedCollections.some(item=>item.id===state.selectedSavedCollection))state.selectedSavedCollection='';
  },'coleções salvas');
  subscribe(col('members',me(),'savedComments'),snapshot=>{
    state.savedComments=new Map(snapshot.docs.map(doc=>[doc.id,doc.data()]));
    watchSavedComments();
  },'comentários salvos');
  subscribe(col('members',me(),'followedPosts'),snapshot=>{
    state.followedPosts=new Map(snapshot.docs.map(doc=>[doc.id,doc.data().followedAt?.toMillis?.()]));
    watchFollowedPosts();
  },'publicações acompanhadas');
  subscribe(col('members',me(),'savedEvents'),snapshot=>{state.savedEventDates=new Map(snapshot.docs.map(doc=>[doc.id,doc.data().savedAt]));},'eventos salvos');
  subscribe(col('members',me(),'following'),(s)=>{state.followingIds=s.docs.map((d)=>d.id);},'pessoas seguidas');
  subscribe(col('members',me(),'blocked'),snapshot=>{
    state.blockedIds=snapshot.docs.map(doc=>doc.id);
    void refreshWeeklyAnswers();
  },'pessoas bloqueadas');
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
  subscribe(col('members',me(),'savedEventSearches'),snapshot=>{
    state.savedEventSearches=new Map(docs(snapshot).map(search=>[search.id,search]));
    state.savedEventSearchesLoaded=true;
  },'buscas salvas de eventos');
  subscribe(col('members',me(),'eventHobbyAlerts'),snapshot=>{
    state.eventHobbyAlerts=new Map(snapshot.docs.map(doc=>[doc.id,doc.data()]));state.eventHobbyAlertsLoaded=true;
  },'alertas por hobby');
  subscribe(ref('members',me(),'notificationSettings','main'),snapshot=>{
    state.notificationSettings=snapshot.data()||{};state.notificationSettingsLoaded=true;
  },'preferências de notificações');
  subscribe(col('members',me(),'mutedCommunities'),snapshot=>{
    state.mutedCommunityIds=new Set(snapshot.docs.map(doc=>doc.id));state.mutedCommunitiesLoaded=true;
  },'comunidades silenciadas');
  subscribe(col('members',me(),'pinnedGroups'),snapshot=>{
    state.pinnedGroupIds=new Set(snapshot.docs.map(doc=>doc.id));
    state.pinnedGroupsLoaded=true;
  },'grupos fixados');
  subscribe(col('members',me(),'savedDiscoveryGroups'),snapshot=>{
    state.savedDiscoveryGroupIds=new Set(snapshot.docs.map(doc=>doc.id));
    state.savedDiscoveryGroupsLoaded=true;
  },'grupos guardados');
  subscribe(col('members',me(),'groupNewsReads'),snapshot=>{
    state.groupNewsReads=new Map(snapshot.docs.map(doc=>[doc.id,doc.data().seenThrough]));
    state.groupNewsReadsLoaded=true;
  },'novidades vistas dos grupos');
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
      state.directSearch=null;state.directLinksLimit=0;state.directEventLimit=0;state.directHistoryAnchor=null;state.directReply=null;state.directReactionPicker=null;
      state.threads=[];state.savedIds=[];state.savedEventDates.clear();state.followingIds=[];state.blockedIds=[];state.receivedTestimonials=[];state.visibleTestimonials=[];state.sentTestimonial=null;state.testimonialStatus='';state.selectedPost=null;state.postEditor=null;state.commentEditor=null;state.commentReplyId=null;state.chatMode='community';state.chatTarget=null;state.modal=null;
      state.expandedCommentReplies.clear();
      state.savedView='saved';state.savedGroup='';state.savedPostOrder='recent';state.savedPostDates.clear();
      state.savedReadingOnly=false;state.readSavedPosts.clear();state.localDraftToDiscard=null;
      state.savedSearch='';
      state.savedCollections=[];state.savedMemberships.clear();state.selectedSavedCollection='';state.collectionPostId=null;
      state.editingSavedCollectionId=null;
      state.savedSelection=null;
      state.savedNotes.clear();state.savedNotePostId=null;
      state.myCommentActivity=null;
      state.followedPostsFilter='all';
      state.reportTarget=null;state.selectedGroup=null;state.groupsLoaded=false;state.modalReturnFocus=null;
      state.eventGroupId=null;state.eventTemplate=null;state.selectedEvent=null;state.eventsLoaded=false;state.eventConflict=null;
      state.eventFormat='';state.eventCityFilter='';state.eventFiltersOpen=false;state.savedEventSearches.clear();state.savedEventSearchesLoaded=false;state.eventRoom=null;
      state.homeEventRooms.clear();
      state.exploreView='people';state.postSearchHobby='';state.postSearchGroup='';state.postSearchLimit=20;
      state.groupView='mine';state.groupNewsLimit=20;state.groupNewsGroup='';state.groupNewsUnseenOnly=false;state.groupNewsSearch='';state.groupHobby='';state.groupMyInterests=false;state.groupDiscoveryOrder='default';state.groupCity='';
      state.eventFilter='upcoming';state.eventSearch='';state.eventHobby='';state.eventCommunity='';
      state.eventAgendaView='list';state.eventWeekOffset=0;
      state.eventReads.clear();state.eventReadsLoaded=false;
      state.personalHistory={records:new Map(),loading:false,error:false};
      state.eventFeedback=null;state.eventDiscussion=null;state.eventAnswerId=null;state.eventCheckins=null;
      state.groupRoles.clear();state.moderationSelection=null;
      state.groupRemoval=null;state.moderationHistory=null;
      state.moderationQueue=null;state.notifications=[];state.notificationSettings={};state.notificationSettingsLoaded=false;state.eventHobbyAlerts.clear();state.eventHobbyAlertsLoaded=false;state.groupPolls=null;state.pollDetail=null;
      state.mutedCommunityIds.clear();state.mutedCommunitiesLoaded=false;
      state.pinnedGroupIds.clear();state.pinnedGroupsLoaded=false;state.changingPinnedGroup=false;
      state.savedDiscoveryGroupIds.clear();state.savedDiscoveryGroupsLoaded=false;state.changingSavedDiscoveryGroup=false;state.savedDiscoveryOnly=false;
      state.groupNewsReads.clear();state.groupNewsReadsLoaded=false;state.markingGroupNews=false;
      state.notificationFilter='all';state.feedbackAdmin=false;state.feedbackAdminRole=null;state.productFeedbackQueue=null;
      state.myProductFeedback=null;state.selectedFeedbackId=null;state.feedbackSupplements=null;
      state.notificationReadSync=user?{uid:user.uid,pending:new Set(readPendingNotifications(user.uid)),flushing:false}:null;
      state.notificationReads=new Set(state.notificationReadSync?.pending);
      state.invitedGroupId=null;state.groupFirstStepsId=null;state.openGroupIntroductions=null;state.changingGroupWelcome=false;state.composingIntroduction=false;state.composingRecapId=null;state.pendingPostDraft=null;state.welcomePending=justSignedUp;state.welcomeHobby='';
      state.weeklyQuestionHistory=null;
      state.weeklyAnswerFilter='all';state.weeklyAnswers=null;
      state.pinnedDirectThreads=[];state.directThreadFilter='all';state.directThreadSearch='';state.manualUnreadThreads.clear();state.mutedDirectThreads.clear();state.directMuteMenu=null;clearTimeout(state.directMuteTimer);state.archivedDirectThreads.clear();state.latestInboundAt.clear();state.privateReadAt.clear();state.pendingReads=new Set();
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
 ['saved-event-change','savedEvents'],['follow','interactions'],['comment','interactions'],['comment-reply','interactions'],['testimonial','interactions'],['group-welcome','interactions']
]);
const communityNoticeTypes=new Set(['event-hobby-alert','poll-open','poll-result','event-bulletin','saved-event-change','weekly-question']);
function watchFollowedPosts(){
 const uid=me(),available=new Set(state.posts.map(post=>post.id));
 const watches=state.followedPostWatches;
 for(const [id,watch] of watches){
   if(!available.has(id)||state.followedPosts.get(id)!==watch.since){
     watch.unsubscribe();watches.delete(id);
   }
 }
 if(!uid)return;
 for(const [id,since] of state.followedPosts){
   if(!available.has(id)||!Number.isFinite(since)||watches.has(id))continue;
   const list=firebase.query(col('posts',id,'comments'),firebase.where('createdAt','>',since),
     firebase.orderBy('createdAt','desc'),firebase.limit(50));
   const watch={since,entries:[],unsubscribe:()=>{}};
   watches.set(id,watch);
   watch.unsubscribe=firebase.onSnapshot(list,snapshot=>{
     if(me()!==uid||watches.get(id)!==watch)return;
     watch.entries=snapshot.docs.map(doc=>({...doc.data(),id:doc.id}));
     render();
   },()=>{
     if(watches.get(id)!==watch)return;
     watch.entries=[];render();
   });
 }
}
function savedCommentKey(postId,commentId){
 return postId+':'+commentId;
}
function watchSavedComments(){
 const watches=state.savedCommentWatches,uid=me();
 const posts=new Set(state.posts.map(post=>post.id));
 for(const [key,watch] of watches){
   if(!posts.has(state.savedComments.get(key)?.postId)){watch.unsubscribe();watches.delete(key);}
 }
 if(!uid)return;
 for(const [key,{postId,commentId}] of state.savedComments){
   if(watches.has(key)||!posts.has(postId)||typeof commentId!=='string')continue;
   const watch={loading:true,comment:null,unsubscribe:()=>{}};
   watches.set(key,watch);
   const finish=comment=>{
     if(me()!==uid||watches.get(key)!==watch)return;
     watch.loading=false;watch.comment=comment;render();
   };
   watch.unsubscribe=firebase.onSnapshot(ref('posts',postId,'comments',commentId),snapshot=>finish(snapshot.data()),()=>finish(null));
 }
}
function followedCommentReadKey(postId,commentId){
 return 'followed-comment:'+postId+':'+commentId;
}
function isNotificationRead(item){
 return state.notificationReads.has(item.readKey)||
   (['comment','comment-reply'].includes(item.type)&&state.notificationReads.has(followedCommentReadKey(item.postId,item.commentId)));
}
const eventReminderOptions={eve:'Na véspera',day:'No dia',both:'Na véspera e no dia',off:'Desligados'};
const eventHobbyAlertScopes={city:'Presenciais na minha cidade',online:'Online',both:'Online e na minha cidade'};
function eventMatchesCity(event,city,group){
 if(eventFormat(event)==='online'||!city||city==='brasil')return false;
 if(typeof event.city==='string'&&event.city.trim())return cityKey(event.city)===city;
 return cityKey(group?.location)===city||String(event.location||'').split(/[,;\n]/).some(part=>cityKey(part)===city);
}
function eventMatchesProfileCity(event,group=state.groups.find(item=>item.id===event.groupId)){
 return eventMatchesCity(event,cityKey(myLocation()),group);
}
function eventLocationWithCity(event){
 const location=String(event.location||'').trim(),city=String(event.city||'').trim();
 if(!city||norm(location).includes(norm(city)))return location;
 return [location,city].filter(Boolean).join(', ');
}
function matchesHobbyEventAlert(event,alert){
 if(!alert)return false;
 if(eventFormat(event)==='online')return alert.scope==='online'||alert.scope==='both';
 if(alert.scope!=='city'&&alert.scope!=='both')return false;
 return eventMatchesProfileCity(event);
}
function renderEventHobbyAlerts(){
 const choices=[...state.eventHobbyAlerts].sort(([a],[b])=>a.localeCompare(b,'pt-BR'));
 return modalWrap('Alertas por hobby',`<form id="event-hobby-alert-form" data-draft="true" class="form-stack">
 <p>Receba avisos no sino sobre novos encontros dos hobbies que escolher.</p>
 <label class="field">Hobby${topicSelect()}</label>
 <label class="field">Quais encontros<select class="select" name="scope" required>
 ${Object.entries(eventHobbyAlertScopes).map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}
 </select></label>
 <p class="mini muted">Cidade do perfil: ${esc(myLocation())}. O aviso usa a cidade do evento ou, em eventos sem esse campo, a cidade do local ou da comunidade.</p>
 <button type="submit" class="btn btn-primary" ${!state.eventHobbyAlertsLoaded||state.busy?'disabled':''}>Salvar alerta</button>
 ${state.eventHobbyAlertsLoaded&&!choices.length?'<p class="mini muted">Nenhum alerta configurado.</p>':''}
 ${choices.map(([hobby,alert])=>`<div class="card toggle-row" style="padding:10px;flex-wrap:wrap;justify-content:space-between">
 <div><strong>${esc(hobby)}</strong><p class="mini muted">${esc(eventHobbyAlertScopes[alert.scope])}</p></div>
 <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="btn btn-outline btn-small" data-action="edit-event-hobby-alert" data-id="${esc(hobby)}">Editar</button>
 <button type="button" class="btn btn-outline btn-small" data-action="remove-event-hobby-alert" data-id="${esc(hobby)}" ${state.busy?'disabled':''}>Desligar</button></div></div>`).join('')}
 </form>`);
}
function notificationItems(){
 const items=state.notifications.map(item=>({...item,key:item.id}));
 const uid=me();
 if(uid&&state.notificationSettings.interactions!==false){
   const blocked=new Set(state.blockedIds);
   for(const post of state.posts){
     if(post.userId!==uid||post.groupIntroduction!==true||!Array.isArray(post.welcomedBy))continue;
     const count=post.welcomedBy.filter(id=>id!==uid&&!blocked.has(id)).length;
     if(count)items.push({type:'group-welcome',postId:post.id,groupId:post.groupId,count,
       key:'group-welcome:'+post.id,createdAt:post.welcomesChangedAt||post.createdAt});
   }
 }
 if(uid){
   const groups=state.groups.filter(group=>group.weeklyQuestionPostId&&group.members?.includes(uid)&&!state.mutedCommunityIds.has(group.id));
   if(groups.length){
     const posts=new Map(state.posts.map(post=>[post.id,post]));
     for(const group of groups){
       const post=posts.get(group.weeklyQuestionPostId);
       if(post?.groupId!==group.id)continue;
       items.push({type:'weekly-question',groupId:group.id,postId:post.id,actorId:post.userId,
         key:'weekly-question:'+group.id+':'+post.id,createdAt:group.weeklyQuestionChangedAt||post.createdAt});
     }
   }
 }
 const directComments=new Set(state.notificationSettings.interactions===false?[]:state.notifications
   .filter(item=>item.type==='comment'||item.type==='comment-reply').map(item=>followedCommentReadKey(item.postId,item.commentId)));
 for(const [postId,watch] of state.followedPostWatches){
   for(const comment of watch.entries){
     const key=followedCommentReadKey(postId,comment.id);
     if(comment.userId===me()||directComments.has(key))continue;
     items.push({type:'followed-comment',postId,commentId:comment.id,actorId:comment.userId,createdAt:comment.createdAt,key});
   }
 }
 const date=new Date(),day=localDateKey(date),nextDay=tomorrow(date);
 const savedSearchAlerts=[...state.savedEventSearches.values()].filter(search=>search.alertSince).map(savedSearchAlert);
 for(const event of state.events){
   const alert=state.eventHobbyAlerts.get(event.hobby);
   const since=alert?.since?.toMillis?.();
   if(!alert&&!savedSearchAlerts.length)continue;
   const created=newEventAlertTime(event,day);
   if(!Number.isFinite(created))continue;
   const group=state.groups.find(item=>item.id===event.groupId);
   const search=savedSearchAlerts.find(item=>matchesSavedSearchAlert(event,item,created,group));
   if(!search&&!(Number.isFinite(since)&&created>=since&&matchesHobbyEventAlert(event,alert)))continue;
   items.push({type:'event-hobby-alert',eventId:event.id,eventTitle:event.title,actorId:event.createdBy,
     groupId:event.groupId,createdAt:created,key:'event-hobby-alert:'+event.id,searchName:search?.name,searchId:search?.id});
 }
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
     return {...item,time,readKey:['event-reminder','followed-comment'].includes(item.type)?item.key:item.key+':'+time};
   }).filter(item=>Number.isFinite(item.time))
   .sort((a,b)=>b.time-a.time).slice(0,50);
}
function markNotificationsRead(items){
 const keys=items.flatMap(item=>['comment','comment-reply'].includes(item.type)&&state.followedPosts.has(item.postId)?
   [item.readKey,followedCommentReadKey(item.postId,item.commentId)]:[item.readKey]);
 state.notificationReads=new Set(mergeNotificationReads([...state.notificationReads],keys));
 const sync=state.notificationReadSync;
 if(!sync||!keys.length)return;
 sync.pending=new Set(mergeNotificationReads(readPendingNotifications(sync.uid),[...sync.pending],keys));
 persistPendingNotifications(sync);
 void syncNotificationReads();
}
function notificationButton(mobile=false){
 const count=notificationItems().filter(item=>!isNotificationRead(item)).length;
 const badge=count?`<span class="unread-count" aria-hidden="true">${count}</span>`:'';
 return `<button class="${mobile?'circle-btn':'nav-btn'}" data-action="notifications" title="Notificações" aria-label="Notificações${count?', '+count+' não lidas':''}">${icon('bell')}${mobile?'':'<span>Notificações</span>'}${badge}</button>`;
}
function renderNotifications(){
 const items=notificationItems();
 const unread=items.filter(item=>!isNotificationRead(item));
 const filter=state.notificationFilter;
 const list=(filter==='unread'?unread:items).map(item=>{
   const isUnread=!isNotificationRead(item);
   const actor=member(item.actorId)?.name||'Alguém';
   const group=state.groups.find(group=>group.id===item.groupId);
   const message={
     follow:actor+' começou a seguir você.',
     comment:actor+' comentou na sua publicação.',
     'comment-reply':actor+' respondeu ao seu comentário.',
     'followed-comment':actor+' comentou em uma publicação que você acompanha.',
     testimonial:actor+' enviou um depoimento para você.',
     'group-welcome':(item.count===1?'1 pessoa deu':item.count+' pessoas deram')+' boas-vindas à sua apresentação.',
     'weekly-question':'Nova pergunta da semana em '+(group?.name||'uma comunidade')+'.',
     report:'Nova denúncia em '+(group?.name||'uma comunidade')+'.',
     'poll-open':'Nova enquete em '+group?.name+' · '+item.poll?.question,
     'poll-result':'Resultado da enquete em '+group?.name+' · '+item.poll?.question,
     'event-bulletin':'Recado do organizador · '+(state.events.find(event=>event.id===item.eventId)?.title||'Evento'),
     'event-seat':'Uma vaga está reservada para você · '+(state.events.find(event=>event.id===item.eventId)?.title||'Evento'),
     'event-hobby-alert':item.searchName?'Novo evento em '+item.searchName+' · '+item.eventTitle:'Novo encontro · '+item.eventTitle,
     'event-reminder':(item.onDay?'Hoje: ':'Amanhã: ')+item.eventTitle+(item.eventTime?' · às '+item.eventTime:''),
     'saved-event-change':(item.event?.cancelled===true?'Evento salvo cancelado · ':'Seu evento salvo mudou · ')+item.event?.title,
     'confirmed-event-cancellation':'Evento confirmado cancelado · '+item.event?.title,
     'feedback-resolved':'Seu feedback foi resolvido',
     'feedback-resumed':'A equipe retomou a análise do seu feedback',
     'product-news':item.news?.title,
     'event-answer':'Sua pergunta foi respondida · '+(state.events.find(event=>event.id===item.eventId)?.title||'Evento')
   }[item.type];
   const label={follow:'Abrir perfil',comment:'Abrir comentários','comment-reply':'Ver resposta','followed-comment':'Ver comentário',testimonial:'Ver depoimentos','group-welcome':'Abrir apresentação','weekly-question':'Abrir conversa',report:'Abrir denúncias','poll-open':'Abrir enquete','poll-result':'Ver resultado','event-answer':'Ver resposta','event-seat':'Ver vaga','event-reminder':'Ver evento','event-hobby-alert':'Ver evento','event-bulletin':'Ler recado','saved-event-change':'Ver evento','confirmed-event-cancellation':'Ver evento','feedback-resolved':item.hasResolution?'Ver resposta':'Ver feedback','feedback-resumed':'Ver feedback','product-news':'Ver novidades'}[item.type];
   const changes=item.event?eventChangeDescriptions(item.event).map(change=>`<li>${esc(change)}</li>`).join(''):'';
   const date=item.type==='product-news'?productNewsDate.format(item.time):when(item.time);
   return `<div class="card" style="padding:12px"><p>${isUnread?'<strong>Novo · </strong>':''}${esc(message)}</p>${changes?`<ul class="mini" style="padding-left:20px">${changes}</ul>`:''}<div class="toggle-row" style="flex-wrap:wrap"><small>${date}</small><button class="text-action" data-action="open-notification" data-id="${esc(item.readKey)}">${label}</button>
   ${item.searchId?`<button type="button" class="text-action" data-action="view-saved-event-search-news" data-id="${esc(item.searchId)}">Ver novidades</button>`:''}
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
 const count=tab==='messages'?state.threads.filter(thread=>!directThreadMuted(thread.id)&&unreadThread(thread.id)).length:0;
 return count?`<span class="unread-count"><span aria-hidden="true">${count>99?'99+':count}</span><span class="sr-only">${count} ${count===1?'conversa não lida':'conversas não lidas'}</span></span>`:'';
}
function groupNewsNavCount(){
 const unread=groupUnreadNews();
 return state.groups.reduce((count,group)=>count+(group.members?.includes(me())?(unread.get(group.id)?.count||0):0),0);
}
function navWithGroupNews(tab,button,count){
 if(tab!=='groups'||!count)return button;
 return `<div class="nav-group-slot">${button}<button type="button" class="group-news-shortcut unread-count" data-action="open-unseen-group-news" aria-label="Abrir ${count} ${count===1?'publicação não vista':'publicações não vistas'} dos meus grupos">${count>99?'99+':count}</button></div>`;
}
function renderSidebar(groupNewsCount) {
  return `<aside class="sidebar">${brand()}<nav class="nav-items" aria-label="Menu principal">${nav.map(([tab,title,ico])=>navWithGroupNews(tab,`<button class="nav-btn ${state.tab===tab?'active':''}" data-action="tab" data-tab="${tab}">${icon(ico)} <span>${title}</span>${unreadBadge(tab)}</button>`,groupNewsCount)).join('')}${notificationButton()}</nav>
  <div class="sidebar-cta"><button class="btn btn-primary" data-action="compose">${icon('plus')} Nova publicação</button></div>
  <div class="sidebar-footer"><button data-action="theme">${icon(state.dark?'sun':'moon')} ${state.dark?'Tema claro':'Tema escuro'}</button><p>Feito para viver mais daquilo que você ama. ✨</p><small>HobbyHub © ${new Date().getFullYear()}</small></div></aside>`;
}
function renderBottomNav(groupNewsCount){
  const items=[['home','Início','home'],['explore','Explorar','compass'],['events','Eventos','calendar'],['compose','','plus'],['groups','Grupos','users'],['messages','Chat','chat'],['profile','Perfil','user']];
  return `<nav class="bottom-nav" aria-label="Navegação móvel">${items.map(([tab,title,ico])=>navWithGroupNews(tab,`<button data-action="${tab==='compose'?'compose':'tab'}" ${tab!=='compose'?`data-tab="${tab}"`:'aria-label="Criar publicação"'} ${state.tab===tab?'aria-current="page"':''} class="${state.tab===tab?'active':''} ${tab==='compose'?'add-nav':''}">${icon(ico)}${title?`<span>${title}</span>`:''}${unreadBadge(tab)}</button>`,groupNewsCount)).join('')}</nav>`;
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
 if(Object.hasOwn(previous,'city')&&previous.city!==(event.city||''))changes.push(event.city?'Cidade atualizada para '+event.city+'.':'Cidade removida do evento.');
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
 const groupNewsCount=groupNewsNavCount();
 return `<div class="layout ${state.tab==='events'?'event-agenda-layout':''} ${state.tab==='messages'&&state.mobileChatOpen&&!state.allSavedDirect?'mobile-chat-detail':''}">${renderSidebar(groupNewsCount)}<div class="main-column"><div class="mobile-header">${brand()}<div class="toggle-row">${notificationButton(true)}<button data-action="tab" data-tab="saved" class="circle-btn" aria-label="Salvos">${icon('bookmark')}</button><button data-action="theme" class="circle-btn" aria-label="Alternar tema">${icon(state.dark?'sun':'moon')}</button></div></div>
 ${state.alerts.length?`<div class="error-banner">${icon('info')} <span>${esc(state.alerts[0])}</span></div>`:''}
 ${titleBar()}<label class="mobile-search">${icon('search')}<input id="mobile-search" aria-label="Pesquisar no HobbyHub" placeholder="Buscar pessoas, grupos e publicações..." value="${esc(state.search)}" data-live-search="true"></label>${renderEventNotices()}${(content[state.tab]||renderHome)()}</div>${renderRight()}</div>${renderBottomNav(groupNewsCount)}${renderModal()}`;
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
 return me()?`<button class="post-action" data-action="post-options" data-id="${esc(post.id)}" aria-label="Opções da publicação" aria-haspopup="dialog">⋯</button>`:'';
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
 ${post.content?`<div class="post-copy">${esc(post.content)}</div>`:''}${renderSharedMedia(post,'na publicação')}${editedPostLabel(post)}
 ${recapEventButton(post)}
 ${post.format==='highlight'?`<div class="post-visual"><span class="emoji">${emoji(post.hobby)}</span><div><small>Uma paixão, mil possibilidades</small><br><strong>Compartilhe o que faz você feliz.</strong></div></div>`:''}
 <div class="post-stats"><span>${Array.isArray(post.likes)?post.likes.length:0} curtidas</span><span>${esc(post.location||'HobbyHub')}</span></div>
 <div class="post-actions"><button class="post-action ${liked?'liked':''}" data-action="like" data-id="${esc(post.id)}" aria-label="${liked?'Descurtir':'Curtir'}">${icon('heart')} ${liked?'Curtido':'Curtir'}</button>
 <button class="post-action" data-action="comments" data-id="${esc(post.id)}">${icon('chat')} ${state.tab==='explore'?'Abrir publicação':'Comentar'}</button>
 <button class="post-action ${saved?'bookmarked':''}" data-action="save" data-id="${esc(post.id)}">${icon('bookmark')} ${saved?'Salvo':'Salvar'}</button>
 <button class="post-action" data-action="share-post" data-id="${esc(post.id)}" aria-label="Compartilhar publicação">${icon('send')} Compartilhar</button>
 ${postOptionsButton(post)}${owner?'':`<button class="post-action" data-action="report-post" data-id="${esc(post.id)}" aria-label="Denunciar publicação" title="Denunciar">${icon('info')}</button>`}</div></article>`;
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
     <p class="mini">${eventTimeLabel(event)?`Às ${esc(eventTimeLabel(event))} · `:''}${eventFormat(event)==='online'?'Online':esc(eventLocationWithCity(event)||'Local a combinar')}</p>
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
 ${renderGroupNews(true)}
 <div class="section-head"><h2>Da nossa comunidade</h2><span class="pill">${feed.length} publicações</span></div>
 <div class="feed-tabs">${[['all','Para você'],['local',`Na minha cidade`],['following','Seguindo']].map(([v,label])=>`<button class="feed-tab ${state.feed===v?'active':''}" data-action="feed" data-value="${v}">${label}</button>`).join('')}</div>
 ${feed.length?feed.map(postCard).join(''):empty('🌱','Uma boa história começa aqui',state.feed==='local'?'Ainda não há publicações com o nome da sua cidade. Você pode inaugurar essa conversa.':state.feed==='following'?'Siga pessoas pela aba Explorar para ver o que elas compartilham.':'Nenhuma publicação encontrada. Faça parte do começo dessa comunidade.',state.feed==='following'?'Encontrar pessoas':'Publicar agora',state.feed==='following'?'explore':'compose')}`;
}
function personCard(p) {
 const followed=state.followingIds.includes(p.uid);
 const shared=(p.hobbies||[]).find(h=>(state.profile?.hobbies||[]).some(mine=>norm(mine)===norm(h)));
 return `<article class="card person-card">${avatar(p)}<div class="person-data"><h3><button class="text-action" data-action="person" data-id="${esc(p.uid)}">${esc(p.name)}</button></h3><p>${icon('map')} ${esc(p.location || 'Brasil')}</p><p>${esc(short(p.bio||'Uma pessoa apaixonada por hobbies.',60))}</p>${shared?`<p>Também gosta de ${esc(shared)}</p>`:''}${locate(p.location)?'<p>Da sua cidade</p>':''}</div><div style="display:grid;gap:6px"><button class="btn btn-small ${followed?'btn-outline':'btn-soft'}" data-action="follow" data-id="${esc(p.uid)}">${followed?'Seguindo':'+ Seguir'}</button><button class="btn btn-small btn-ghost" data-action="open-dm" data-id="${esc(p.uid)}">${icon('chat')} Conversar</button></div></article>`;
}
function searchOptions(values,selected,priority){
 return [...values].sort((a,b)=>(priority?.(a[0],b[0])||0)||a[1].localeCompare(b[1],'pt-BR'))
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
function comparePinnedGroups(first,second){
 return Number(state.pinnedGroupIds.has(second))-Number(state.pinnedGroupIds.has(first));
}
function isUnseenGroupPost(post,uid,blocked,currentTime){
 return state.groupNewsReadsLoaded&&post.groupId&&post.userId!==uid&&!blocked.has(post.userId)
   &&Number.isFinite(post.createdAt)&&post.createdAt<=currentTime
   &&post.createdAt>(state.groupNewsReads.get(post.groupId)||0);
}
function groupUnreadNews(){
 const unread=new Map();
 if(!state.groupNewsReadsLoaded)return unread;
 const uid=me(),blocked=new Set(state.blockedIds),currentTime=now();
 for(const post of state.posts){
   if(!isUnseenGroupPost(post,uid,blocked,currentTime))continue;
   const entry=unread.get(post.groupId)||{count:0,latest:0};
   entry.count++;
   entry.latest=Math.max(entry.latest,post.createdAt);
   unread.set(post.groupId,entry);
 }
 return unread;
}
function groupNewsReadControls(group,count){
 if(!count)return '';
 return `<div class="toggle-row" style="flex-wrap:wrap"><span class="pill">${count} ${count===1?'nova publicação':'novas publicações'}</span>
 <button type="button" class="text-action" data-action="mark-group-news" data-id="${esc(group.id)}" aria-label="Marcar novidades de ${esc(group.name)} como vistas" ${state.markingGroupNews?'disabled':''}>Marcar como vistas</button></div>`;
}
function groupCard(g, activity,unreadCount=0,lastPublished){
 const joined=(g.members||[]).includes(me());
 const pinAction=state.pinnedGroupIds.has(g.id)?'Desafixar':'Fixar';
 return `<article class="card community-card"><div class="cover ${topicColor(g.hobby)}"><span>${emoji(g.hobby)}</span></div>
 <div><span class="eyebrow">${esc(g.hobby||'Comunidade')}</span><h3 style="margin:6px 0"><button data-action="view-group" data-id="${esc(g.id)}" ${lastPublished!==undefined?`data-preview="true" aria-label="Ver prévia de ${esc(g.name)}"`:''} style="font-weight:800;text-align:left">${esc(g.name)} ${icon('arrow')}</button></h3><p class="card-desc">${esc(g.description||'Um espaço para compartilhar esse interesse.')}</p></div>
 ${joined&&state.groupRoles.get(g.id)==='pending'?'<span class="pill">Convite para moderar</span>':''}
 ${joined&&state.pinnedGroupsLoaded?`<button type="button" class="text-action" data-action="toggle-pinned-group" data-id="${esc(g.id)}" aria-label="${pinAction} ${esc(g.name)}" ${state.changingPinnedGroup?'disabled':''}>${pinAction} grupo</button>`:''}
 ${joined?groupNewsReadControls(g,unreadCount):''}
 ${lastPublished===undefined?'':`<p class="mini muted">${lastPublished?`Última publicação: <time datetime="${localDateKey(new Date(lastPublished))}">${new Date(lastPublished).toLocaleDateString('pt-BR')}</time>`:'Sem publicações disponíveis'}</p>`}
 ${activity?.post?`<div><small class="muted">Publicação mais recente</small><br><button class="text-action" data-action="comments" data-id="${esc(activity.post.id)}">${esc(short(activity.post.content,75))}</button></div>`:''}
 ${activity?.event?`<div><small class="muted">Próximo evento · ${dateLabel(activity.event.date)} ${esc(activity.event.time||'')}</small><br><button class="text-action" data-action="view-event" data-id="${esc(activity.event.id)}">${esc(activity.event.title)}</button></div>`:''}
 <div class="card-bottom"><span class="card-meta">${icon('users')} ${(g.members||[]).length} membros<br>${esc(g.location||'Online')}</span>
 <button class="btn btn-small ${joined?'btn-outline':'btn-primary'}" data-action="join-group" data-id="${esc(g.id)}">${joined?'Participando':'+ Participar'}</button></div></article>`;
}
function latestDiscoverableGroupPosts(groupIds){
 const latest=new Map(),blocked=new Set(state.blockedIds),current=now();
 for(const post of state.posts){
   const date=post.createdAt;
   if(groupIds.has(post.groupId)&&!blocked.has(post.userId)&&Number.isFinite(date)&&date<=current&&date>(latest.get(post.groupId)?.createdAt||0))latest.set(post.groupId,post);
 }
 return latest;
}
function saveDiscoveryGroupButton(group){
 if(!state.savedDiscoveryGroupsLoaded)return '';
 const saved=state.savedDiscoveryGroupIds.has(group.id);
 return `<button type="button" class="btn btn-outline btn-small" data-action="toggle-saved-discovery-group" data-id="${esc(group.id)}" ${state.changingSavedDiscoveryGroup?'disabled':''}>${saved?'Remover dos grupos guardados':'Guardar grupo'}</button>`;
}
function renderGroupPreview(group,date=new Date()){
 const post=latestDiscoverableGroupPosts(new Set([group.id])).get(group.id);
 const current=`${localDateKey(date)} ${date.toTimeString().slice(0,5)}`;
 const next=state.events.filter(event=>event.groupId===group.id&&!event.cancelled&&event.date&&eventScheduleKey(event)>=current)
   .sort((a,b)=>eventScheduleKey(a).localeCompare(eventScheduleKey(b)))[0];
 const schedule=next?viewerEventSchedule(next):null;
 const summary=post?.content?.trim()||[post?.photoUrl?'Foto':'',post?.videoUrl?'Vídeo':''].filter(Boolean).join(' e ')||'Publicação na comunidade';
 return modalWrap(group.name,`<div class="form-stack">
   <p class="eyebrow">${esc(group.hobby)} · ${esc(group.location||'Online')}</p>
   <p class="post-copy">${esc(group.description||'Encontre pessoas que amam esse hobby.')}</p>
   <div class="toggle-row" style="flex-wrap:wrap"><span class="pill">${icon('users')} ${(group.members||[]).length} membros</span>
   <button type="button" class="btn btn-primary btn-small" data-action="join-group" data-id="${esc(group.id)}" ${state.updatingGroup?'disabled':''}>Participar</button>${saveDiscoveryGroupButton(group)}</div>
   <section class="card" style="padding:14px"><h3>Última publicação</h3>
   ${post?`<p class="post-copy">${esc(short(summary,240))}</p>`:'<p class="mini muted">Sem publicações disponíveis.</p>'}</section>
   <section class="card" style="padding:14px"><h3>Próximo evento</h3>
   ${next?`<button type="button" class="text-action" data-action="view-event" data-id="${esc(next.id)}">${esc(next.title)}</button><p class="mini muted">${dateLabel(schedule.date)} ${esc(eventTimeLabel(next,schedule))}</p>`:'<p class="mini muted">Nenhum encontro marcado ainda.</p>'}</section>
   ${state.invitedGroupId===group.id?'<div><button type="button" class="text-action" data-action="back-first-visit">Voltar às boas-vindas</button></div>':''}
 </div>`);
}
function canWelcomeGroupPost(post){
 const uid=me();
 return Boolean(uid&&post.groupIntroduction===true&&post.userId!==uid&&!state.blockedIds.includes(post.userId)
   &&state.groups.some(group=>group.id===post.groupId&&group.members?.includes(uid)));
}
function groupWelcomeControls(post){
 if(post.groupIntroduction!==true)return '';
 const welcomes=Array.isArray(post.welcomedBy)?post.welcomedBy:[];
 const count=welcomes.length,welcomed=welcomes.includes(me());
 return `<div class="toggle-row" style="flex-wrap:wrap;margin:8px 0">
 ${canWelcomeGroupPost(post)?`<button type="button" class="btn btn-outline btn-small" data-action="toggle-group-welcome" data-id="${esc(post.id)}" aria-pressed="${welcomed}" ${state.changingGroupWelcome?'disabled':''}>${welcomed?'Desfazer boas-vindas':'Dar boas-vindas 👋'}</button>`:''}
 <span class="mini muted">${count} ${count===1?'pessoa deu boas-vindas':'pessoas deram boas-vindas'}</span></div>`;
}
async function changeWeeklyQuestion(groupId,postId,clear=false){
 const groupRef=ref('groups',groupId);
 await firebase.runTransaction(db,async transaction=>{
   const group=(await transaction.get(groupRef)).data();
   const previous=group?.weeklyQuestionPostId;
   if(!group||(clear?previous!==postId:previous===postId))return;
   if(previous)transaction.set(ref('groups',groupId,'weeklyQuestionHistory',previous),{
     highlightedAt:group.weeklyQuestionChangedAt||null
   });
   transaction.update(groupRef,clear?{weeklyQuestionPostId:''}:{
     weeklyQuestionPostId:postId,weeklyQuestionChangedAt:firebase.serverTimestamp()
   });
 });
}
async function openWeeklyQuestionHistory(id){
 const group=state.groups.find(item=>item.id===id);
 if(!group||(!group.members?.includes(me())&&!canManageGroup(group)))return;
 const history={groupId:id,entries:null,error:false};
 state.weeklyQuestionHistory=history;
 state.selectedGroup=id;
 openModal('weekly-question-history');
 try{
   const snapshot=await firebase.getDocs(col('groups',id,'weeklyQuestionHistory'));
   history.entries=snapshot.docs.map(doc=>({...doc.data(),postId:doc.id}));
 }catch(error){
   history.error=true;
   console.error('HobbyHub: histórico de perguntas',error);
 }
 if(state.modal==='weekly-question-history'&&state.weeklyQuestionHistory===history)render();
}
function renderWeeklyQuestionHistory(){
 const history=state.weeklyQuestionHistory;
 const group=state.groups.find(item=>item.id===history?.groupId);
 if(!group)return modalWrap('Histórico de perguntas','<p>Esta comunidade não está mais disponível.</p>');
 const posts=new Map(state.posts.filter(post=>post.groupId===group.id&&!state.blockedIds.includes(post.userId)).map(post=>[post.id,post]));
 const entries=(history.entries||[]).filter(entry=>entry.postId!==group.weeklyQuestionPostId&&posts.has(entry.postId))
   .sort((a,b)=>(b.highlightedAt?.toMillis?.()||0)-(a.highlightedAt?.toMillis?.()||0));
 let content='<p class="tip">Ainda não há perguntas anteriores disponíveis.</p>';
 if(history.error)content=`<p class="tip" role="status">Não foi possível carregar o histórico.</p><button type="button" class="text-action" data-action="open-weekly-question-history" data-id="${esc(group.id)}">Tentar novamente</button>`;
 else if(!history.entries)content='<p class="tip" role="status">Carregando perguntas anteriores…</p>';
 else if(entries.length)content=entries.map(entry=>{
   const post=posts.get(entry.postId),date=entry.highlightedAt?.toMillis?.();
   return `<article class="card" style="padding:12px"><p class="post-copy">${esc(short(post.content?.trim()||'Abra a publicação para ver a pergunta.',240))}</p>
   <p class="mini muted">${Number.isFinite(date)?'Destacada em '+new Date(date).toLocaleDateString('pt-BR'):'Data do destaque indisponível'}</p>
   <button type="button" class="text-action" data-action="comments" data-id="${esc(post.id)}">Abrir conversa</button></article>`;
 }).join('');
 return modalWrap('Histórico de perguntas',`<div class="form-stack"><div><button type="button" class="text-action" data-action="view-group" data-id="${esc(group.id)}">Voltar ao grupo</button></div>${content}</div>`);
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
const favoriteGroupNews='favorites/all';
function groupNewsFilter(groups,compact){
 const filter=state.groupNewsGroup;
 return !compact&&(filter===favoriteGroupNews||groups.has(filter))?filter:'';
}
function groupNewsMatches(groupId,filter){
 return !filter||(filter===favoriteGroupNews?state.pinnedGroupIds.has(groupId):filter===groupId);
}
function groupNewsListReads(groups,filter,unread){
 return [...unread].filter(([id])=>groups.has(id)&&groupNewsMatches(id,filter));
}
async function markGroupNewsSeen(uid,entries){
 // Each group write checks membership in Firestore rules. Keep batches below the rules access limit.
 for(let start=0;start<entries.length&&me()===uid;start+=10){
   const batch=entries.slice(start,start+10).map(([id,entry])=>({
     target:ref('members',uid,'groupNewsReads',id),latest:entry.latest
   }));
   await firebase.runTransaction(db,async transaction=>{
     const current=await Promise.all(batch.map(item=>transaction.get(item.target)));
     batch.forEach(({target,latest},index)=>{
       if(latest>(current[index].data()?.seenThrough||0))transaction.set(target,{seenThrough:latest});
     });
   });
 }
}
function activeWeeklyQuestions(groups,blocked){
 const questions=groups.filter(group=>group.weeklyQuestionPostId);
 if(!questions.length)return [];
 const posts=new Map(state.posts.map(post=>[post.id,post]));
 return questions.flatMap(group=>{
   const post=posts.get(group.weeklyQuestionPostId);
   if(!post||post.groupId!==group.id||blocked.has(post.userId))return [];
   return [{group,post,time:group.weeklyQuestionChangedAt?.toMillis?.()||post.createdAt||0}];
 }).sort((a,b)=>comparePinnedGroups(a.group.id,b.group.id)||b.time-a.time);
}
function myActiveWeeklyQuestions(){
 return activeWeeklyQuestions(state.groups.filter(group=>group.members?.includes(me())),new Set(state.blockedIds));
}
async function refreshWeeklyAnswers(force=false){
 const uid=me();
 if(!uid||state.modal!=='all-weekly-questions'||!['unanswered','answered'].includes(state.weeklyAnswerFilter))return;
 const ids=myActiveWeeklyQuestions().map(({post})=>post.id).sort(),key=JSON.stringify(ids);
 if(!force&&state.weeklyAnswers?.key===key)return;
 const result={key,unanswered:null,error:false};
 state.weeklyAnswers=result;
 try{
   const checks=await Promise.all(ids.map(async id=>{
     const query=firebase.query(col('posts',id,'comments'),firebase.where('userId','==',uid),firebase.limit(1));
     return (await firebase.getDocsFromServer(query)).empty?id:null;
   }));
   result.unanswered=new Set(checks.filter(Boolean));
 }catch(error){
   result.error=true;
   console.error('HobbyHub: respostas às perguntas da semana',error);
 }
 if(me()===uid&&state.modal==='all-weekly-questions'&&state.weeklyAnswers===result)render();
}
function renderWeeklyQuestionCards(entries,showFollow=false){
 return entries.map(({group,post})=>`<article class="card" style="padding:12px;min-width:0;overflow-wrap:anywhere">
 <strong class="mini">${esc(group.name)}</strong>
 <p class="post-copy">${esc(short(post.content?.trim()||'Abra a publicação para ver a pergunta.',140))}</p>
 <button type="button" class="text-action" data-action="comments" data-id="${esc(post.id)}" aria-label="Abrir conversa da pergunta da semana em ${esc(group.name)}">Abrir conversa</button>
 ${showFollow?`<button type="button" class="text-action" data-action="toggle-followed-weekly-question" data-id="${esc(post.id)}" ${state.busy?'disabled':''}>${state.followedPosts.has(post.id)?'Parar de acompanhar':'Acompanhar conversa'}</button>`:''}
 </article>`).join('');
}
function renderHomeWeeklyQuestions(groups,blocked){
 const entries=activeWeeklyQuestions(groups,blocked);
 if(!entries.length)return '';
 return `<section class="form-stack" aria-label="Perguntas da semana">
 <div class="toggle-row" style="justify-content:space-between;flex-wrap:wrap">
 <h3 style="font-size:14px;margin:0">Perguntas da semana</h3>
 <button type="button" class="text-action" data-action="open-all-weekly-questions">Ver todas as perguntas da semana</button></div>
 ${renderWeeklyQuestionCards(entries.slice(0,3))}</section>`;
}
function renderGroupNews(compact=false){
 const groups=new Map(state.groups.filter(group=>group.members?.includes(me())).map(group=>[group.id,group]));
 const filter=groupNewsFilter(groups,compact);
 const favoritesOnly=filter===favoriteGroupNews;
 const unseenOnly=!compact&&state.groupNewsUnseenOnly;
 const query=compact?'':norm(state.groupNewsSearch);
 const selected=favoritesOnly?'':filter;
 const blocked=new Set(state.blockedIds),uid=me(),currentTime=now();
 const posts=state.posts.filter(post=>groups.has(post.groupId)&&groupNewsMatches(post.groupId,filter)&&!blocked.has(post.userId)
   &&(!unseenOnly||isUnseenGroupPost(post,uid,blocked,currentTime))
   &&(!query||[post.content,authorName(post),groups.get(post.groupId).name].some(value=>norm(value).includes(query))))
   .sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
 const weeklyQuestions=compact?renderHomeWeeklyQuestions([...groups.values()],blocked):'';
 if(compact&&!posts.length&&!weeklyQuestions)return '';
 const limit=compact?3:state.groupNewsLimit;
 const unread=compact?null:groupUnreadNews();
 const unreadCount=compact?0:groupNewsListReads(groups,filter,unread).reduce((sum,[,entry])=>sum+entry.count,0);
 let emptyMessage=selected?'Ainda não há publicações para mostrar neste grupo.':'As publicações das comunidades de que você participa vão aparecer aqui.';
 if(favoritesOnly&&!posts.length){
   const hasFavorites=[...groups.keys()].some(id=>state.pinnedGroupIds.has(id));
   if(!state.pinnedGroupsLoaded)emptyMessage='Carregando seus grupos favoritos…';
   else if(hasFavorites)emptyMessage=unseenOnly?'Nenhuma publicação não vista nos seus favoritos.':'Ainda não há publicações nos seus grupos favoritos.';
   else emptyMessage='Para ver novidades aqui, fixe um grupo em Minhas comunidades.';
 }
 if(unseenOnly&&!posts.length){
   if(!state.groupNewsReadsLoaded)emptyMessage='Carregando as novidades não vistas…';
   else if(!favoritesOnly)emptyMessage=selected?'Nenhuma publicação não vista neste grupo.':'Nenhuma publicação não vista nos seus grupos.';
 }
 if(query&&!posts.length&&(!unseenOnly||state.groupNewsReadsLoaded))emptyMessage='Nenhuma publicação corresponde à busca e aos filtros atuais.';
 return `<section class="card form-stack" style="padding:16px;margin-bottom:16px" aria-label="Novidades dos meus grupos">
 <div class="toggle-row" style="justify-content:space-between;flex-wrap:wrap"><h2 style="font-size:16px;margin:0">Novidades dos meus grupos</h2>
 ${compact?'<button type="button" class="text-action" data-action="open-group-news">Ver todas</button>':''}</div>
 ${!compact&&(groups.size||favoritesOnly)?`<label class="field" for="group-news-group">Por grupo<select class="select" id="group-news-group">
 <option value="">Todos os meus grupos</option><option value="${favoriteGroupNews}" ${favoritesOnly?'selected':''}>Só favoritos</option>${searchOptions(new Map([...groups].map(([id,group])=>{
   const count=unread.get(id)?.count;
   return [id,count?`${group.name} (${count} ${count===1?'nova':'novas'})`:group.name];
 })),selected,comparePinnedGroups)}</select></label>`:''}
 ${!compact&&groups.size?`<div><button type="button" class="filter ${unseenOnly?'active':''}" data-action="toggle-group-news-unseen" aria-pressed="${unseenOnly}">Só não vistas</button></div>`:''}
 ${!compact&&groups.size?`<label class="field" for="group-news-search">Buscar nas novidades<input id="group-news-search" class="input" type="search" maxlength="200" placeholder="Texto, autor ou grupo" value="${esc(state.groupNewsSearch)}"></label>`:''}
 ${unreadCount&&query?'<p class="mini muted">Limpe a busca para marcar a lista como vista.</p>':''}
 ${unreadCount&&!query?`<div><button type="button" class="btn btn-outline btn-small" data-action="mark-group-news-list" aria-label="Marcar lista como vista, ${unreadCount} ${unreadCount===1?'publicação':'publicações'}" ${state.markingGroupNews?'disabled':''}>Marcar lista como vista (${unreadCount})</button></div>`:''}
 ${weeklyQuestions}
 ${posts.length?posts.slice(0,limit).map(post=>{
   const group=groups.get(post.groupId),author=authorName(post);
   const saved=state.savedIds.includes(post.id);
   const summary=post.content?.trim()||[post.photoUrl?'Foto':'',post.videoUrl?'Vídeo':''].filter(Boolean).join(' e ')||'Publicação na comunidade';
   return `<article class="card" style="padding:12px;min-width:0;overflow-wrap:anywhere">
     <button type="button" class="text-action" data-action="view-group" data-id="${esc(group.id)}">${esc(group.name)}</button>
     <p class="muted mini">${esc(author)}</p>
     <p class="post-copy">${esc(short(summary,140))}</p>
     <button type="button" class="text-action" data-action="comments" data-id="${esc(post.id)}" aria-label="Abrir conversa de ${esc(author)} em ${esc(group.name)}">Abrir conversa</button>
     ${!compact?`<button type="button" class="text-action" data-action="save" data-id="${esc(post.id)}" aria-label="${saved?'Remover dos salvos':'Salvar para ler depois'} a publicação de ${esc(author)} em ${esc(group.name)}">${saved?'Remover dos salvos':'Salvar para ler depois'}</button>`:''}
   </article>`;
 }).join(''):`<p class="tip" role="status">${emptyMessage}</p>`}
 ${!compact&&posts.length>limit?'<button type="button" class="btn btn-outline btn-small" data-action="more-group-news">Ver mais publicações</button>':''}
 </section>`;
}
function renderGroups(){
 const header=`<div class="card" style="padding:25px;margin-bottom:19px;background:linear-gradient(115deg,var(--panel),var(--purple2));display:flex;align-items:center;justify-content:space-between;gap:18px"><div><div class="eyebrow">O PODER DE FAZER JUNTO</div><h2 style="font-size:21px;margin:8px 0">Seu hobby merece uma comunidade.</h2><p class="muted mini" style="margin:0">Crie um grupo, faça novas amizades e inspire outras pessoas.</p></div><button class="btn btn-primary btn-small" data-action="group">${icon('plus')} Criar grupo</button></div>
 <div class="filters">${[['mine','Minhas comunidades'],['discover','Descobrir'],['news','Novidades']].map(([view,label])=>`<button class="filter ${state.groupView===view?'active':''}" data-action="group-view" data-value="${view}" aria-pressed="${state.groupView===view}">${label}</button>`).join('')}</div>`;
 if(state.groupView==='news')return header+renderGroupNews();
 const discovering=state.groupView==='discover',query=norm(state.search);
 const savedOnly=discovering&&state.savedDiscoveryOnly;
 const groups=state.groups.filter(group=>savedOnly?state.savedDiscoveryGroupIds.has(group.id):Boolean(group.members?.includes(me()))!==discovering);
 const hobbies=[...new Set(groups.map(group=>group.hobby).filter(hobby=>typeof hobby==='string'&&hobby))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 const cities=new Map(groups.filter(group=>typeof group.location==='string'&&cityKey(group.location)).map(group=>[cityKey(group.location),group.location]));
 const hobby=hobbies.includes(state.groupHobby)?state.groupHobby:'';
 const city=cities.has(state.groupCity)?state.groupCity:'';
 const myHobbies=new Set((state.profile?.hobbies||[]).map(norm).filter(Boolean));
 const myInterests=discovering&&state.groupMyInterests;
 const list=groups.filter(group=>(!query||norm([group.name,group.hobby,group.description,group.location].join(' ')).includes(query))
   && (!discovering||((!hobby||group.hobby===hobby)&&(!city||cityKey(group.location)===city)&&(!myInterests||myHobbies.has(norm(group.hobby))))));
 if(!discovering)list.sort((a,b)=>comparePinnedGroups(a.id,b.id));
 const latest=discovering?latestDiscoverableGroupPosts(new Set(list.map(group=>group.id))):null;
 if(discovering){
   if(state.groupDiscoveryOrder==='active')list.sort((a,b)=>(latest.get(b.id)?.createdAt||0)-(latest.get(a.id)?.createdAt||0));
 }
 const activity=discovering?null:groupHighlights(list);
 const unread=discovering?null:groupUnreadNews();
 const discoveryEmpty=myInterests&&!myHobbies.size
   ?empty('🧩','Adicione seus interesses','Escolha seus hobbies no perfil para encontrar grupos relacionados.','Editar perfil','edit-profile')
   :savedOnly
     ?'<p class="tip" role="status">'+(!state.savedDiscoveryGroupsLoaded?'Carregando grupos guardados…':groups.length?'Nenhum grupo guardado corresponde aos filtros.':'Guarde um grupo na prévia para reencontrá-lo aqui.')+'</p>'
     :empty('🧩','Nenhuma comunidade encontrada','Ajuste os filtros ou crie uma comunidade.','Criar uma comunidade','group');
 return header+` ${discovering?`<div class="card field-grid" style="padding:16px;margin-bottom:16px"><label class="field">Hobby<select class="select" id="group-hobby"><option value="">Todos os hobbies</option>${hobbies.map(hobby=>`<option value="${esc(hobby)}" ${state.groupHobby===hobby?'selected':''}>${esc(hobby)}</option>`).join('')}</select></label><label class="field">Cidade<select class="select" id="group-city"><option value="">Todas as cidades</option>${[...cities].sort((a,b)=>a[1].localeCompare(b[1],'pt-BR')).map(([key,label])=>`<option value="${esc(key)}" ${state.groupCity===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label></div>`:''}
 ${discovering?`<div class="filters"><button type="button" class="filter ${myInterests?'active':''}" data-action="toggle-group-my-interests" aria-pressed="${myInterests}">Meus interesses</button>
 <button type="button" class="filter ${savedOnly?'active':''}" data-action="toggle-saved-discovery-filter" aria-pressed="${savedOnly}">Grupos guardados</button>
 <label class="field">Ordenar grupos<select class="select" id="group-discovery-order"><option value="default" ${state.groupDiscoveryOrder==='default'?'selected':''}>Ordem padrão</option><option value="active" ${state.groupDiscoveryOrder==='active'?'selected':''}>Mais ativos recentemente</option></select></label></div>`:''}
 <div class="section-head"><h2>${discovering?'Descubra comunidades':'Seus grupos'}</h2><span class="pill">${list.length} ${list.length===1?'grupo':'grupos'}</span></div>
 ${list.length?`<div class="grid-two">${list.map(group=>groupCard(group,activity?.get(group.id),unread?.get(group.id)?.count,discovering?latest.get(group.id)?.createdAt||null:undefined)).join('')}</div>`:discovering?discoveryEmpty:empty('🧩',query?'Nenhuma comunidade encontrada':'Encontre seu primeiro grupo',query?'Mude os termos da busca.':'Descubra comunidades para participar.','Descobrir comunidades','discover-groups')}`;
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
function eventFormatFields(format,location,roomUrl='',timeZone='',city=''){
 const online=format==='online';
 return `<label class="field">Formato<select class="select" name="format" required>${eventFormatOptions(format)}</select></label>
 <div data-format-field="in-person" ${online?'hidden':''}><label class="field">Local presencial<input class="input" name="location" maxlength="120" value="${esc(location)}" placeholder="Ex.: Praça central" ${online?'disabled':'required'}></label><label class="field">Cidade (opcional)<input class="input" name="city" maxlength="90" value="${esc(city)}" placeholder="Ex.: Nova Friburgo, RJ" ${online?'disabled':''}></label></div>
 <div data-format-field="online" ${online?'':'hidden'}><label class="field">Fuso horário do evento<select class="select" name="timeZone" ${online?'required':'disabled'}>${Object.entries(eventTimeZones).map(([zone,label])=>`<option value="${zone}" ${(timeZone||defaultEventTimeZone())===zone?'selected':''}>${label}</option>`).join('')}</select></label><label class="field">Link da sala online<input class="input" type="url" name="roomUrl" maxlength="2048" placeholder="https://" value="${esc(roomUrl)}" ${online?'required':'disabled'}></label><p class="tip">O link da sala fica disponível para quem confirmar presença.</p></div>`;
}
function syncEventFormatFields(form){
 form.querySelectorAll('[data-format-field]').forEach(section=>{
   const active=section.dataset.formatField===form.elements.format.value;
   section.hidden=!active;
   section.querySelectorAll('input,select').forEach(input=>{input.disabled=!active;input.required=active&&input.name!=='city';});
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
 url.searchParams.set('destination',eventLocationWithCity(event));
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
 <div class="card-meta" style="flex-wrap:wrap">${icon('map')} ${eventFormat(event)==='online'?'Online':esc(eventLocationWithCity(event)||'Local a combinar')} ${eventDirectionsLink(event)}</div>
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
function renderUpcomingEventsByDay(events,date){
 const todayKey=localDateKey(date),tomorrowKey=tomorrow(date);
 const days=new Map();
 for(const event of events){
   const key=viewerEventSchedule(event).date;
   if(!days.has(key))days.set(key,[]);
   days.get(key).push(event);
 }
 return `<div class="form-stack">${[...days].map(([day,entries])=>{
   const weekday=new Date(day+'T12:00:00');
   const fullDate=Number.isFinite(weekday.getTime())?weekday.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'}):'Data a combinar';
   const title=day===todayKey?'Hoje':day===tomorrowKey?'Amanhã':fullDate.charAt(0).toUpperCase()+fullDate.slice(1);
   return `<section class="form-stack" aria-labelledby="upcoming-day-${esc(day)}">
   <h2 id="upcoming-day-${esc(day)}" style="font-size:16px;margin:0">${esc(title)}</h2>
   <div class="grid-two">${entries.map(event=>eventCard(event)).join('')}</div>
   </section>`;
 }).join('')}</div>`;
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
async function loadEventInvitations(sent=state.eventFilter==='sent-invites'){
 const uid=me();
 if(!uid)return;
 const key=sent?'sentEventInvites':'receivedEventInvites';
 const previous=state[key];
 const inbox={entries:[],limit:25,loading:true,partial:false,query:previous?.query||'',status:previous?.status||'all'};
 state[key]=inbox;
 render();
 const active=()=>me()===uid&&state[key]===inbox;
 const threads=state.threads.filter(thread=>thread.participants?.includes(uid));
 for(let index=0;index<threads.length&&active();index+=6){
   await Promise.all(threads.slice(index,index+6).map(async thread=>{
     const peer=thread.participants.find(id=>id!==uid);
     if(!peer||thread.id!==threadId(uid,peer))return;
     try{
       const snapshot=await firebase.getDocs(eventInvitationMessageQuery(thread.id));
       if(!active())return;
       for(const doc of snapshot.docs){
         const message=doc.data();
         const invitation=message.senderId===(sent?uid:peer)&&!message.deletedAt&&directEventInvitation(message.text);
         if(invitation)inbox.entries.push({invitation,peer,thread,id:doc.id,createdAt:message.createdAt});
       }
     }catch{inbox.partial=true;}
   }));
 }
 if(!active())return;
 inbox.loading=false;
 render();
}
function receivedInviteMarkerId(entry){
 return entry.thread.id+':'+entry.id;
}
async function updateDismissedEventInvite(id,peer,dismiss){
 const uid=me(),inbox=state.receivedEventInvites;
 if(!uid||state.tab!=='events'||state.eventFilter!=='invites'||!inbox)return;
 const entry=inbox.entries.find(item=>item.id===id&&item.peer===peer);
 if(!entry)return;
 const markerId=receivedInviteMarkerId(entry);
 if(state.dismissedEventInviteIds.has(markerId)===dismiss)return;
 await attempt(async()=>{
   const marker=ref('members',uid,'dismissedEventInvites',markerId);
   if(dismiss)await firebase.setDoc(marker,{threadId:entry.thread.id,messageId:id});
   else await firebase.deleteDoc(marker);
   if(me()===uid)showToast(dismiss?'Convite dispensado.':'Convite restaurado.');
 },'updatingDismissedEventInvite');
}
const eventInviteStatusFilters=[['all','Todos'],['pending','Sem resposta'],['confirmed','Confirmados'],['waitlist','Lista de espera']];
function renderReceivedEventInvitations(){
 const inbox=state.receivedEventInvites;
 if(!inbox||inbox.loading)return '<p class="tip" role="status">Carregando convites recebidos…</p>';
 const uid=me(),day=today(),events=new Map(state.events.map(event=>[event.id,event]));
 const dismissed=state.showDismissedEventInvites;
 const query=norm(inbox.query),statusFilter=inbox.status||'all';
 const entries=inbox.entries.filter(entry=>state.dismissedEventInviteIds.has(receivedInviteMarkerId(entry))===dismissed).map(entry=>{
   const event=events.get(entry.invitation.id);
   const schedule=event&&viewerEventSchedule(event);
   const pending=Boolean(event&&!event.cancelled&&schedule.date>=day&&
     !event.attendees?.includes(uid)&&!event.waitlist?.includes(uid));
   const status=pending?'pending':!event||event.cancelled?'other':event.attendees?.includes(uid)?'confirmed':
     schedule.date>=day&&event.waitlist?.includes(uid)?'waitlist':'other';
   const sender=member(entry.peer)?.name||entry.thread.names?.[entry.peer]||'Pessoa';
   return {...entry,event,pending,status,sender,date:schedule?.date||'',time:schedule?.time||''};
 }).filter(entry=>(statusFilter==='all'||entry.status===statusFilter)&&(!query||
   norm(entry.event?.title||entry.invitation.title).includes(query)||norm(entry.sender).includes(query)))
 .sort((a,b)=>Number(b.pending)-Number(a.pending)||
   (a.pending?(a.date+a.time).localeCompare(b.date+b.time):0)||(b.createdAt||0)-(a.createdAt||0));
 return `<section class="form-stack" aria-label="Convites recebidos">
 <div class="toggle-row" style="flex-wrap:wrap" role="group" aria-label="Mostrar convites">
 <button type="button" class="btn btn-small ${dismissed?'btn-outline':'btn-soft'}" data-action="filter-dismissed-event-invites" data-value="active" aria-pressed="${!dismissed}">Recebidos</button>
 <button type="button" class="btn btn-small ${dismissed?'btn-soft':'btn-outline'}" data-action="filter-dismissed-event-invites" data-value="dismissed" aria-pressed="${dismissed}">Dispensados</button>
 <button type="button" class="btn btn-outline btn-small" data-action="refresh-event-invitations">Atualizar convites</button>
 </div>
 <label class="field">Buscar convites<input id="received-event-invite-search" class="input" type="search" maxlength="100" placeholder="Nome do evento ou de quem enviou" value="${esc(inbox.query||'')}"></label>
 <div class="filters" role="group" aria-label="Situação do convite">${eventInviteStatusFilters.map(([value,label])=>`<button type="button" class="filter ${statusFilter===value?'active':''}" data-action="filter-event-invite-status" data-value="${value}" aria-pressed="${statusFilter===value}">${label}</button>`).join('')}</div>
 ${inbox.partial?'<p class="tip" role="status">Algumas conversas não puderam ser consultadas.</p>':''}
 ${!entries.length&&!inbox.partial?`<p class="tip" role="status">${query||statusFilter!=='all'?'Nenhum convite encontrado.':dismissed?'Nenhum convite dispensado.':'Nenhum convite recebido pelo chat.'}</p>`:''}
 ${entries.slice(0,inbox.limit).map(entry=>`<article class="card form-stack" style="padding:14px;overflow-wrap:anywhere">
 <p class="mini muted">Enviado por ${esc(entry.sender)}</p>
 ${renderEventInvitation(entry.invitation,entry.event,!dismissed,true)}
 <button type="button" class="btn btn-outline btn-small" data-action="open-event-invitation-chat" data-id="${esc(entry.id)}" data-value="${esc(entry.peer)}">Abrir conversa original</button>
 <button type="button" class="btn btn-outline btn-small" data-action="${dismissed?'restore-event-invite':'dismiss-event-invite'}" data-id="${esc(entry.id)}" data-value="${esc(entry.peer)}" ${state.updatingDismissedEventInvite?'disabled':''}>${dismissed?'Restaurar convite':'Dispensar convite'}</button>
 </article>`).join('')}
 ${entries.length>inbox.limit?'<button type="button" class="btn btn-soft" data-action="more-event-invitations">Ver mais convites</button>':''}
 </section>`;
}
function renderSentEventInvitations(){
 const outbox=state.sentEventInvites;
 if(!outbox||outbox.loading)return '<p class="tip" role="status">Carregando convites enviados…</p>';
 const events=new Map(state.events.map(event=>[event.id,event])),query=norm(outbox.query);
 const entries=outbox.entries.map(entry=>({...entry,event:events.get(entry.invitation.id),
   recipient:member(entry.peer)?.name||entry.thread.names?.[entry.peer]||'Pessoa'
 })).filter(entry=>!query||norm(entry.event?.title||entry.invitation.title).includes(query)||norm(entry.recipient).includes(query))
 .sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
 return `<section class="form-stack" aria-label="Convites enviados">
 <label class="field">Buscar convites<input id="sent-event-invite-search" class="input" type="search" maxlength="100" placeholder="Nome do evento ou da pessoa convidada" value="${esc(outbox.query)}"></label>
 <div><button type="button" class="btn btn-outline btn-small" data-action="refresh-event-invitations">Atualizar convites</button></div>
 ${outbox.partial?'<p class="tip" role="status">Algumas conversas não puderam ser consultadas.</p>':''}
 ${!entries.length&&!outbox.partial?`<p class="tip" role="status">${query?'Nenhum convite encontrado.':'Nenhum convite enviado pelo chat.'}</p>`:''}
 ${entries.slice(0,outbox.limit).map(entry=>`<article class="card form-stack" style="padding:14px;overflow-wrap:anywhere">
 <p class="mini muted">Enviado para ${esc(entry.recipient)}${entry.createdAt?' · '+esc(new Date(entry.createdAt).toLocaleString('pt-BR')):''}</p>
 ${renderEventInvitation(entry.invitation,entry.event)}
 <button type="button" class="btn btn-outline btn-small" data-action="open-event-invitation-chat" data-id="${esc(entry.id)}" data-value="${esc(entry.peer)}">Abrir conversa original</button>
 </article>`).join('')}
 ${entries.length>outbox.limit?'<button type="button" class="btn btn-soft" data-action="more-event-invitations">Ver mais convites</button>':''}
 </section>`;
}
function activeEventInvitationList(){
 return state.eventFilter==='sent-invites'?state.sentEventInvites:state.eventFilter==='invites'?state.receivedEventInvites:null;
}
function currentEventSearch(){
 return {query:state.eventSearch.trim(),hobby:state.eventHobby,community:state.eventCommunity,
   format:state.eventFormat,city:state.eventCityFilter};
}
function eventMatchesSearch(event,search,group){
 if(search.hobby&&event.hobby!==search.hobby)return false;
 if(search.community&&event.groupId!==search.community)return false;
 if(search.format&&eventFormat(event)!==search.format)return false;
 const city=search.city==='mine'?cityKey(myLocation()):search.city.slice(5);
 if(search.city&&!eventMatchesCity(event,city,group))return false;
 return !search.query||norm([event.title,event.description,event.location,event.city,group?.name,group?.location].join(' ')).includes(search.query);
}
function newEventAlertTime(event,day){
 if(event.cancelled||event.createdBy===me()||event.attendees?.includes(me())||
    state.blockedIds.includes(event.createdBy)||state.mutedCommunityIds.has(event.groupId)||
    viewerEventSchedule(event).date<day)return NaN;
 return typeof event.createdAt==='number'?event.createdAt:event.createdAt?.toMillis?.();
}
function savedSearchAlert(search){
 return {...search,query:norm(search.query),since:search.alertSince.toMillis(),
   reviewedAt:search.reviewedAt?.toMillis?.()??-Infinity};
}
function matchesSavedSearchAlert(event,search,created,group){
 return created>=search.since&&created>search.reviewedAt&&eventMatchesSearch(event,search,group);
}
function savedEventSearchNews(search){
 if(!search?.alertSince)return [];
 const alert=savedSearchAlert(search),day=today();
 return state.events.filter(event=>matchesSavedSearchAlert(event,alert,newEventAlertTime(event,day),
   state.groups.find(group=>group.id===event.groupId)));
}
function renderSavedEventSearchNews(){
 const panel=state.savedEventSearchNews;
 const search=state.savedEventSearches.get(panel?.id);
 const events=savedEventSearchNews(search).sort((a,b)=>eventScheduleKey(a).localeCompare(eventScheduleKey(b)));
 return modalWrap('Novidades da busca',`<div class="form-stack">
 <button type="button" class="text-action" data-action="back-saved-event-search-news">${panel?.previous==='notifications'?'Voltar às notificações':'Voltar a Minhas buscas'}</button>
 ${search?`<h3>${esc(search.name)}</h3>`:''}
 ${events.length?`<button type="button" class="btn btn-outline btn-small" data-action="review-saved-event-search-news" ${state.busy?'disabled':''}>Marcar novidades como vistas</button>`:''}
 ${!events.length?'<p class="tip" role="status">Nenhum evento novo nesta busca.</p>':''}
 ${events.slice(0,panel?.limit||25).map(event=>`<article class="card form-stack" style="padding:12px">
 <strong>${esc(event.title)}</strong>
 <p class="mini muted">${esc(dateLabel(viewerEventSchedule(event).date))} ${esc(eventTimeLabel(event))}</p>
 <button type="button" class="btn btn-soft btn-small" data-action="view-event" data-id="${esc(event.id)}">Ver evento</button>
 </article>`).join('')}
 ${events.length>(panel?.limit||25)?'<button type="button" class="btn btn-outline" data-action="more-saved-event-search-news">Ver mais eventos</button>':''}
 </div>`);
}
function renderSavedEventSearches(){
 const entries=[...state.savedEventSearches.values()].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
 const canSave=Object.values(currentEventSearch()).some(Boolean);
 return modalWrap('Minhas buscas',`<div class="form-stack">
 ${!state.savedEventSearchesLoaded?'<p class="tip" role="status">Carregando buscas salvas…</p>':`
 ${entries.map(entry=>{
 const count=savedEventSearchNews(entry).length;
 return `<div class="card toggle-row" style="padding:10px;flex-wrap:wrap;justify-content:space-between">
 <button type="button" class="btn btn-soft btn-small" data-action="apply-event-search" data-id="${esc(entry.id)}">${esc(entry.name)}</button>
 <button type="button" class="btn btn-outline btn-small" data-action="toggle-event-search-alert" data-id="${esc(entry.id)}" aria-pressed="${Boolean(entry.alertSince)}" ${state.busy?'disabled':''}>${entry.alertSince?'Aviso ligado':'Avisar sobre novos eventos'}</button>
 <button type="button" class="btn btn-outline btn-small" data-action="delete-event-search" data-id="${esc(entry.id)}" aria-label="Remover busca ${esc(entry.name)}" ${state.busy?'disabled':''}>Remover</button>
 ${entry.alertSince?`<div class="toggle-row" style="flex-wrap:wrap"><small>${count} ${count===1?'evento novo':'eventos novos'}</small>
 <button type="button" class="text-action" data-action="view-saved-event-search-news" data-id="${esc(entry.id)}">Ver novidades</button></div>`:''}
 </div>`;
 }).join('')}
 ${!entries.length?'<p class="mini muted">Nenhuma busca salva.</p>':''}`}
 ${canSave?`<form id="save-event-search-form" class="form-stack" data-draft="true" data-draft-key="save-event-search-form">
 <label class="field">Nome para a busca atual<input class="input" name="name" maxlength="60" required placeholder="Ex.: Fotografia em Petrópolis"></label>
 <button type="submit" class="btn btn-primary" ${state.busy||!state.savedEventSearchesLoaded?'disabled':''}>Salvar busca atual</button>
 </form>`:'<p class="mini muted">Selecione filtros na agenda para salvar uma busca.</p>'}
 </div>`);
}
function renderEvents(now=new Date()) {
 const day=localDateKey(now);
 const time=now.toTimeString().slice(0,5);
 const eventFilter=state.eventFilter;
 const filters=`<div class="filters event-agenda-tabs" id="event-agenda-tabs" role="group" aria-label="Agenda de eventos">${[['upcoming','Próximos'],['invites','Convites recebidos'],['sent-invites','Convites enviados'],['recommended','Para você'],['mine','Meus eventos'],['saved','Salvos'],['history','Histórico'],['waitlist','Lista de espera'],['past','Encerrados'],['all','Todos']].map(([id,title])=>`<button id="event-filter-${id}" class="filter ${eventFilter===id?'active':''}" aria-pressed="${eventFilter===id}" data-action="event-filter" data-value="${id}">${title}</button>`).join('')}</div>`;
 const alerts=`<div class="toggle-row event-agenda-actions">
 <button type="button" class="btn btn-primary btn-small event-mobile-create" data-action="event">${icon('plus')} Criar evento</button>
 <button type="button" class="btn btn-outline btn-small" data-action="event-hobby-alerts">Alertas por hobby</button></div>`;
 if(eventFilter==='invites')return filters+alerts+renderReceivedEventInvitations();
 if(eventFilter==='sent-invites')return filters+alerts+renderSentEventInvitations();
 const weekly=eventFilter==='mine'&&state.eventAgendaView==='week';
 const days=weekly?eventWeek(now,state.eventWeekOffset):[];
 const query=norm(state.eventSearch);
 const communities=new Map(state.groups.map(group=>[group.id,group]));
 const interests=new Set((state.profile?.hobbies||[]).map(hobby=>norm(hobby).trim()).filter(Boolean));
 const hobbies=[...new Set(state.events.map(event=>event.hobby).filter(hobby=>typeof hobby==='string'&&hobby))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 const eventGroups=[...new Set(state.events.map(event=>event.groupId))].map(id=>communities.get(id)).filter(Boolean)
   .sort((a,b)=>String(a.name).localeCompare(String(b.name),'pt-BR'));
 const cityFilter=state.eventCityFilter;
 const search={...currentEventSearch(),query};
 const city=cityFilter==='mine'?cityKey(myLocation()):cityFilter.slice(5);
 const cityOptions=new Map();
 for(const event of state.events){
   if(eventFormat(event)==='online')continue;
   const label=String(event.city||communities.get(event.groupId)?.location||'').trim();
   const key=cityKey(label);
   if(!key||['brasil','online','a combinar','a definir'].includes(key))continue;
   if(!cityOptions.has(key)||event.city)cityOptions.set(key,label);
 }
 const sortedCities=[...cityOptions].sort((a,b)=>a[1].localeCompare(b[1],'pt-BR'));
 const filterCount=[state.eventHobby,state.eventCommunity,state.eventFormat,cityFilter].filter(Boolean).length;
 const filtering=Boolean(query||filterCount);
 const events=state.events.filter(event=>{
   const schedule=viewerEventSchedule(event);
   const group=communities.get(event.groupId);
   if(!eventMatchesSearch(event,search,group))return false;
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
 return `<div class="hero event-agenda-hero" style="min-height:200px;background:linear-gradient(115deg,#fe956e,#ed7099)"><span class="hero-overline">SAIA DO FEED, VIVA A EXPERIÊNCIA</span><h2>Conexões que saem da tela.</h2><p>Crie um encontro de leitura, uma caminhada ou uma sessão de games.</p><button class="btn btn-white btn-small" data-action="event">${icon('plus')} Criar evento</button></div>
 ${filters}${alerts}
 ${eventFilter==='mine'?`<div class="filters" role="group" aria-label="Visualização dos meus eventos">${[['list','Lista'],['week','Semana']].map(([id,label])=>`<button id="event-agenda-${id}" class="filter ${state.eventAgendaView===id?'active':''}" data-action="event-agenda-view" data-value="${id}" aria-pressed="${state.eventAgendaView===id}">${label}</button>`).join('')}</div>`:''}
 <div class="card form-stack event-agenda-search">
 <label class="field">Buscar eventos<input type="search" class="input" id="event-search" maxlength="150" placeholder="Nome, local ou cidade da comunidade" value="${esc(state.eventSearch)}"></label>
 <div class="toggle-row event-agenda-actions">
 <button type="button" class="btn btn-outline btn-small" data-action="saved-event-searches">Minhas buscas</button>
 <button type="button" class="btn btn-outline btn-small event-mobile-filter-toggle" data-action="toggle-event-filters" aria-expanded="${state.eventFiltersOpen}" aria-controls="event-extra-filters">Filtros${filterCount?' ('+filterCount+')':''}</button>
 </div>
 <div id="event-extra-filters" class="form-stack event-extra-filters ${state.eventFiltersOpen?'is-open':''}">
 <div class="field-grid"><label class="field">Hobby<select class="select" id="event-hobby"><option value="">Todos os hobbies</option>${state.eventHobby&&!hobbies.includes(state.eventHobby)?`<option value="${esc(state.eventHobby)}" selected>${esc(state.eventHobby)}</option>`:''}${hobbies.map(hobby=>`<option value="${esc(hobby)}" ${state.eventHobby===hobby?'selected':''}>${esc(hobby)}</option>`).join('')}</select></label>
 <label class="field">Comunidade<select class="select" id="event-community"><option value="">Todas as comunidades</option>${state.eventCommunity&&!eventGroups.some(group=>group.id===state.eventCommunity)?`<option value="${esc(state.eventCommunity)}" selected>${esc(communities.get(state.eventCommunity)?.name||'Comunidade indisponível')}</option>`:''}${eventGroups.map(group=>`<option value="${esc(group.id)}" ${state.eventCommunity===group.id?'selected':''}>${esc(group.name)}</option>`).join('')}</select></label></div>
 <label class="field">Formato<select class="select" id="event-format-filter"><option value="">Todos os formatos</option>${eventFormatOptions(state.eventFormat)}</select></label>
 <label class="field">Cidade<select id="event-city-filter" class="select">
 <option value="">Todas as cidades</option><option value="mine" ${cityFilter==='mine'?'selected':''}>Minha cidade</option>
 ${cityFilter.startsWith('city:')&&!cityOptions.has(city)?`<option value="${esc(cityFilter)}" selected>${esc(city)}</option>`:''}
 ${sortedCities.map(([key,label])=>`<option value="city:${esc(key)}" ${cityFilter==='city:'+key?'selected':''}>${esc(label)}</option>`).join('')}
 </select></label>
 </div>
 <div class="toggle-row"><span class="mini muted">${events.length} ${events.length===1?'evento encontrado':'eventos encontrados'}</span>${filtering?'<button type="button" class="text-action" data-action="clear-event-filters">Limpar filtros</button>':''}</div>
 </div>
 ${eventFilter==='history'&&state.personalHistory.loading?'<p class="tip" role="status">Conferindo seus registros de presença…</p>':''}
 ${eventFilter==='history'&&state.personalHistory.error?'<p class="tip">Alguns check-ins não puderam ser carregados. <button class="text-action" data-action="refresh-event-history">Tentar novamente</button></p>':''}
 ${weekly?renderEventWeek(days,events):events.length?(eventFilter==='upcoming'?renderUpcomingEventsByDay(events,now):`<div class="grid-two">${events.map(event=>eventCard(event)).join('')}</div>`):eventFilter==='history'&&state.personalHistory.loading?'':emptyAgenda}
 <p class="tip" style="margin-top:18px">Dica de segurança: combine encontros públicos, avise alguém de confiança e evite divulgar endereços residenciais na rede.</p>`;
}
function unreadFollowedComments(postId){
 const watch=state.followedPostWatches.get(postId);
 if(!watch)return [];
 const directReads=new Set(state.notifications.filter(item=>item.postId===postId&&
   ['comment','comment-reply'].includes(item.type)&&state.notificationReads.has(item.id+':'+
     (typeof item.createdAt==='number'?item.createdAt:item.createdAt?.toMillis?.()))).map(item=>item.commentId));
 return watch.entries.filter(comment=>comment.userId!==me()&&!state.blockedIds.includes(comment.userId)&&
   !state.notificationReads.has(followedCommentReadKey(postId,comment.id))&&!directReads.has(comment.id));
}
function savedPostMatches(post,query,includeNote=false){
 if(!query)return true;
 if(!post)return false;
 const community=state.groups.find(group=>group.id===post.groupId);
 const text=norm(post.content),author=norm(authorName(post)),group=norm(community?.name);
 const note=includeNote?norm(state.savedNotes.get(post.id)):'';
 return query.split(' ').every(term=>text.includes(term)||author.includes(term)||group.includes(term)||note.includes(term));
}
function renderFollowedPosts(query){
 const posts=new Map(state.posts.map(post=>[post.id,post]));
 const entries=[...state.followedPosts].sort((a,b)=>(b[1]||0)-(a[1]||0)).map(([id])=>{
   const post=posts.get(id);
   return {id,post,unread:post?unreadFollowedComments(id).length:0};
 });
 const filter=state.followedPostsFilter;
 const filters=`<div class="filters" role="group" aria-label="Filtrar publicações acompanhadas">${[['all','Todas'],['unread','Com novidades']].map(([value,label])=>
   `<button class="filter ${filter===value?'active':''}" data-action="followed-posts-filter" data-value="${value}" aria-pressed="${filter===value}">${label}</button>`).join('')}</div>`;
 if(!entries.length)return filters+empty('🔔','Você ainda não acompanha publicações','Use o menu de uma publicação para acompanhar novos comentários.','Explorar publicações','explore');
 const visible=entries.filter(entry=>(filter!=='unread'||entry.unread>0)&&savedPostMatches(entry.post,query));
 if(!visible.length&&query)return filters+'<p class="tip" role="status">Nenhuma publicação encontrada com esta busca.</p>';
 if(!visible.length)return filters+'<p class="tip">Nenhuma publicação com comentários novos.</p>';
 return filters+`<div class="form-stack">${visible.map(({id,post,unread})=>{
   return `<article class="card form-stack" style="padding:16px">
   <div class="toggle-row" style="flex-wrap:wrap"><strong>${post?esc(authorName(post)):'Publicação indisponível'}</strong>
   ${unread?`<span class="pill">${unread} ${unread===1?'comentário novo':'comentários novos'}</span>`:''}</div>
   ${post?`<p class="post-copy" style="margin:0">${esc(short(post.content,220))}</p>`:''}
   <div class="toggle-row" style="flex-wrap:wrap">
   ${post?`<button class="btn btn-outline btn-small" data-action="open-followed-conversation" data-id="${esc(id)}">Abrir conversa</button>`:''}
   ${unread?`<button class="text-action" data-action="read-followed-comments" data-id="${esc(id)}">Marcar comentários como lidos</button>`:''}
   <button class="text-action" data-action="stop-followed-post" data-id="${esc(id)}" ${state.busy?'disabled':''}>Parar de acompanhar</button></div>
   </article>`;
 }).join('')}</div>`;
}
function renderSavedComments(query){
 const entries=[...state.savedComments].sort((a,b)=>(b[1].savedAt?.toMillis?.()||0)-(a[1].savedAt?.toMillis?.()||0));
 if(!entries.length)return '<p class="tip">Você ainda não salvou comentários. Use o menu ⋯ de um comentário para guardá-lo.</p>';
 const posts=new Map(state.posts.map(post=>[post.id,post])),groups=new Map(state.groups.map(group=>[group.id,group.name]));
 const visible=query?entries.filter(([key,{postId}])=>{
   const comment=state.savedCommentWatches.get(key)?.comment;
   if(!comment)return false;
   const fields=[comment.text,authorName(comment),groups.get(posts.get(postId)?.groupId)].map(norm);
   return query.split(' ').every(term=>fields.some(field=>field.includes(term)));
 }):entries;
 if(!visible.length)return [...state.savedCommentWatches.values()].some(watch=>watch.loading)
   ?'<p class="tip" role="status">Carregando comentários…</p>'
   :'<p class="tip" role="status">Nenhum comentário encontrado com esta busca.</p>';
 return `<div class="form-stack">${visible.map(([key,{postId}])=>{
   const watch=state.savedCommentWatches.get(key),comment=watch?.comment;
   return `<article class="card form-stack" style="padding:16px">
   ${comment?`<strong>${esc(authorName(comment))}</strong><p class="post-copy" style="margin:0">${esc(short(comment.text,240))}</p>`
   :`<p class="tip">${watch?.loading?'Carregando comentário…':'Comentário indisponível.'}</p>`}
   <div class="toggle-row" style="flex-wrap:wrap">
   ${comment&&state.posts.some(post=>post.id===postId)?`<button class="btn btn-outline btn-small" data-action="open-saved-comment" data-id="${esc(key)}">Abrir comentário</button>`:''}
   <button class="text-action" data-action="remove-saved-comment" data-id="${esc(key)}" ${state.busy?'disabled':''}>Remover dos salvos</button></div></article>`;
 }).join('')}</div>`;
}
function myPostDrafts(){
 const uid=me();
 if(!uid)return [];
 const prefix=postDraftPrefix(uid);
 try{
   const drafts=[];
   for(let index=0;index<localStorage.length;index++){
     const key=localStorage.key(index);
     if(!key?.startsWith(prefix))continue;
     const scope=key.slice(prefix.length),match=/^(intro|group):([^:]+)$/.exec(scope);
     if(scope!=='feed'&&!match)continue;
     let groupId='';
     try{groupId=match?decodeURIComponent(match[2]):'';}catch{continue;}
     const draft=readPostDraft(key);
     if(!draft)continue;
     const group=state.groups.find(item=>item.id===groupId);
     drafts.push({key,draft,groupId,introduction:match?.[1]==='intro',name:group?.name||(groupId?'Grupo indisponível':'Feed'),
       available:!groupId||Boolean(group?.members?.includes(uid))});
   }
   return drafts.sort((a,b)=>(b.draft.updatedAt||0)-(a.draft.updatedAt||0)||a.name.localeCompare(b.name,'pt-BR'));
 }catch{return [];}
}
function renderMyPostDrafts(){
 const drafts=myPostDrafts();
 return `<section class="form-stack" aria-label="Meus rascunhos">
 <p class="mini muted">Rascunhos guardados neste aparelho.</p>
 ${drafts.map(({key,draft,introduction,name,available})=>`<article class="card" style="padding:14px;overflow-wrap:anywhere">
 <strong>${esc(name)}</strong><p class="mini muted">${introduction?'Apresentação':'Publicação'}</p>
 <p class="post-copy">${esc(short(draft.content.trim()||'Rascunho com mídia',160))}</p>
 ${draft.updatedAt?`<p class="mini muted">Última edição: <time datetime="${new Date(draft.updatedAt).toISOString()}">${new Date(draft.updatedAt).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}</time></p>`:''}
 ${!available?'<p class="mini muted">Este grupo está indisponível para publicar.</p>':''}
 <div class="toggle-row" style="flex-wrap:wrap">${available?`<button type="button" class="btn btn-primary btn-small" data-action="resume-local-post-draft" data-id="${esc(key)}">Continuar</button>`:''}
 <button type="button" class="text-action" data-action="discard-local-post-draft" data-id="${esc(key)}">Descartar</button></div></article>`).join('')||'<p class="tip">Você ainda não tem rascunhos neste aparelho.</p>'}</section>`;
}
function renderSaved() {
 const query=norm(state.savedSearch);
 const filters=`<div class="filters" role="group" aria-label="Tipo de item salvo">${[['saved','Salvos'],['following','Acompanhando'],['comments','Comentários'],['drafts','Meus rascunhos']].map(([view,label])=>
   `<button class="filter ${state.savedView===view?'active':''}" data-action="saved-view" data-value="${view}" aria-pressed="${state.savedView===view}">${label}</button>`).join('')}</div>`;
 const search=`<div class="form-stack" style="margin-bottom:16px"><label class="field">${state.savedView==='comments'?'Buscar comentários':'Buscar publicações'}<input class="input" id="saved-search" type="search" placeholder="${state.savedView==='saved'?'Texto, autor, comunidade ou nota':'Texto, autor ou comunidade'}" value="${esc(state.savedSearch)}"></label>
 ${query?'<button class="text-action" data-action="clear-saved-search">Limpar busca</button>':''}</div>`;
 if(state.savedView==='drafts')return filters+renderMyPostDrafts();
 if(state.savedView==='following')return filters+search+renderFollowedPosts(query);
 if(state.savedView==='comments')return filters+search+renderSavedComments(query);
 const selected=state.selectedSavedCollection;
 const collection=state.savedCollections.find(item=>item.id===selected);
 const selection=state.savedSelection;
 const collectionIds=savedPostIdsForCollection(collection?.id);
 const savedIds=savedPostIdsForCollection();
 const savedGroupIds=new Set(state.posts.filter(post=>savedIds.has(post.id)&&post.groupId).map(post=>post.groupId));
 const savedGroups=new Map(state.groups.filter(group=>savedGroupIds.has(group.id)).map(group=>[group.id,group.name]));
 const groupId=savedGroups.has(state.savedGroup)?state.savedGroup:'';
 const groupFilter=savedGroups.size?`<label class="field" style="margin-top:12px">Por grupo<select class="select" id="saved-group-filter">
 <option value="">Todos os grupos</option>${searchOptions(savedGroups,groupId)}</select></label>`:'';
 const collections=`<div class="toggle-row" style="flex-wrap:wrap"><label class="field">Coleção<select class="select" id="saved-collection-filter">
 <option value="">Todos os salvos</option>${state.savedCollections.map(item=>`<option value="${esc(item.id)}" ${item.id===selected?'selected':''}>${esc(item.name)}</option>`).join('')}
 </select></label><button class="btn btn-outline btn-small" data-action="create-saved-collection">Nova coleção</button>
 ${collection?`<button class="text-action" data-action="rename-saved-collection" data-id="${esc(collection.id)}">Renomear</button>
 <button class="text-action" data-action="delete-saved-collection" data-id="${esc(collection.id)}">Excluir coleção</button>`:''}
 ${collectionIds.size&&!selection?`<button class="text-action" data-action="export-saved-posts">${collection?'Exportar coleção e notas':'Exportar salvos e notas'}</button>`:''}</div>`;
 const posts=state.posts.filter(post=>collectionIds.has(post.id)&&(!groupId||post.groupId===groupId)
   &&(!state.savedReadingOnly||!state.readSavedPosts.has(post.id)));
 const results=posts.filter(post=>savedPostMatches(post,query,true)).sort((a,b)=>{
   const first=state.savedPostDates.get(a.id),second=state.savedPostDates.get(b.id);
   if(!Number.isFinite(first))return Number.isFinite(second)?1:0;
   if(!Number.isFinite(second))return -1;
   return state.savedPostOrder==='oldest'?first-second:second-first;
 });
 const ordering=`<label class="field" style="margin-top:12px">Ordenar por data em que salvou<select class="select" id="saved-post-order">
 <option value="recent" ${state.savedPostOrder==='recent'?'selected':''}>Salvas recentemente</option>
 <option value="oldest" ${state.savedPostOrder==='oldest'?'selected':''}>Salvas há mais tempo</option></select></label>`;
 const unreadSelected=selection?unreadSavedSelection(selection).length:0;
 const selectionControls=selection?`<div class="toggle-row" style="flex-wrap:wrap;margin-bottom:16px">
 <span role="status">${selection.size} ${selection.size===1?'selecionada':'selecionadas'}</span>
 <button class="btn btn-primary btn-small" data-action="choose-bulk-collection" ${!selection.size||state.busy?'disabled':''}>Adicionar à coleção</button>
 <button type="button" class="btn btn-outline btn-small" data-action="mark-selected-saved-read" ${!unreadSelected||state.busy?'disabled':''}>Marcar selecionadas como lidas (${unreadSelected})</button>
 ${collection?`<button class="btn btn-outline btn-small" data-action="remove-selected-from-collection" data-id="${esc(collection.id)}" ${!selection.size||state.busy?'disabled':''}>Retirar desta coleção</button>`:''}</div>`:'';
 const readingFilter=savedIds.size?`<div class="filters" style="margin-top:12px"><button type="button" class="filter ${state.savedReadingOnly?'active':''}" data-action="toggle-saved-reading-filter" aria-pressed="${state.savedReadingOnly}">Para ler</button></div>`:'';
 return filters+search+collections+groupFilter+(savedIds.size?ordering:'')+readingFilter+`<div class="section-head"><h2>${collection?esc(collection.name):'Publicações para guardar'}</h2><div class="toggle-row" style="flex-wrap:wrap"><span class="pill">${posts.length} salvas</span>
 ${posts.length||selection?`<button class="text-action" data-action="toggle-saved-selection" ${state.busy?'disabled':''}>${selection?'Cancelar seleção':'Selecionar'}</button>`:''}</div></div>${selectionControls}
 ${results.length?results.map(post=>`<div class="form-stack" style="margin-bottom:16px">${selection?`<button class="btn btn-outline btn-small" data-action="select-saved-post" data-id="${esc(post.id)}" aria-pressed="${selection.has(post.id)}" ${state.busy?'disabled':''}>${selection.has(post.id)?'Selecionada ✓':'Selecionar publicação'}</button>`:''}${postCard(post)}
 ${selection?'':renderSavedPostActions(post)}</div>`).join(''):query?'<p class="tip" role="status">Nenhuma publicação encontrada com esta busca.</p>':state.savedReadingOnly?'<p class="tip" role="status">Nenhuma publicação para ler com os filtros atuais.</p>':groupId?'<p class="tip" role="status">Nenhuma publicação salva deste grupo nesta lista.</p>':collection?'<p class="tip">Esta coleção ainda está vazia. Use Organizar em coleções em Todos os salvos para adicionar publicações.</p>':empty('🔖','Sua coleção começa aqui','Salve publicações que inspiram seus hobbies. Elas aparecem neste espaço.','Explorar publicações','explore')}`;
}
function savedPostIdsForCollection(collectionId){
 return new Set(state.savedIds.filter(id=>!collectionId||state.savedMemberships.get(id)?.includes(collectionId)));
}
function savedPostsExport(collection){
 const ids=savedPostIdsForCollection(collection?.id);
 const posts=new Map(state.posts.map(post=>[post.id,post]));
 const orderedIds=[...state.posts.filter(post=>ids.has(post.id)).map(post=>post.id),
   ...[...ids].filter(id=>!posts.has(id))];
 const lines=[collection?collection.name:'Todos os salvos','HobbyHub · Exportação de salvos e notas'];
 for(const id of orderedIds){
   const post=posts.get(id),note=state.savedNotes.get(id);
   lines.push('',`Publicação: ${contentLink('post',id)}`,`Autor: ${post?authorName(post):'Publicação indisponível'}`);
   if(note)lines.push('Nota privada:',note);
 }
 return lines.join('\n')+'\n';
}
function renderSavedPostActions(post){
 const note=state.savedNotes.get(post.id),id=esc(post.id);
 const read=state.readSavedPosts.has(post.id);
 return `${note?`<aside class="card" style="padding:12px"><strong>Nota privada</strong><p class="post-copy" style="margin:4px 0 0">${esc(note)}</p></aside>`:''}
 <div class="toggle-row" style="flex-wrap:wrap"><button class="text-action" data-action="manage-saved-collections" data-id="${id}">Organizar em coleções</button>
 <button class="text-action" data-action="edit-saved-note" data-id="${id}">${note?'Editar nota privada':'Adicionar nota privada'}</button>
 ${read?'<span class="pill">Lida</span>':''}<button type="button" class="text-action" data-action="toggle-saved-reading-status" data-id="${id}" ${state.busy?'disabled':''}>${read?'Marcar para ler':'Marcar como lida'}</button></div>`;
}
function unreadSavedSelection(selection){
 return [...selection].filter(id=>state.savedIds.includes(id)&&!state.readSavedPosts.has(id));
}
async function markSelectedSavedRead(){
 await attempt(async()=>{
   const uid=me(),selection=state.savedSelection;
   if(!uid||!selection?.size||state.tab!=='saved'||state.savedView!=='saved')return;
   const ids=unreadSavedSelection(selection);
   if(!ids.length)return;
   for(let offset=0;offset<ids.length;offset+=450){
     if(me()!==uid||state.savedSelection!==selection)return;
     const chunk=ids.slice(offset,offset+450),batch=firebase.writeBatch(db);
     for(const id of chunk)batch.update(ref('members',uid,'saved',id),{read:true});
     await batch.commit();
     for(const id of chunk)selection.delete(id);
   }
   if(me()!==uid||state.savedSelection!==selection)return;
   state.savedSelection=null;
   showToast(ids.length===1?'Publicação marcada como lida.':'Publicações marcadas como lidas.');
 });
}
async function updateSavedSelection(collectionId,remove){
 await attempt(async()=>{
   const uid=me(),selection=state.savedSelection;
   if(!uid||!selection?.size||state.tab!=='saved'||state.savedView!=='saved'||
      !state.savedCollections.some(item=>item.id===collectionId))return;
   if(remove?state.selectedSavedCollection!==collectionId||state.modal:state.modal!=='bulk-saved-collection')return;
   const ids=[...selection].filter(id=>state.savedIds.includes(id));
   const change=remove?firebase.arrayRemove(collectionId):firebase.arrayUnion(collectionId);
   for(let offset=0;offset<ids.length;offset+=450){
     if(me()!==uid||state.savedSelection!==selection)return;
     const chunk=ids.slice(offset,offset+450),batch=firebase.writeBatch(db);
     for(const id of chunk)batch.update(ref('members',uid,'saved',id),{collectionIds:change});
     await batch.commit();
     for(const id of chunk)selection.delete(id);
   }
   if(me()!==uid||state.savedSelection!==selection)return;
   state.savedSelection=null;
   if(state.modal==='bulk-saved-collection')closeModal();
   showToast(remove?'Publicações retiradas da coleção.':'Publicações adicionadas à coleção.');
 });
}
function mediaUrl(value) {
 try {
   const url=new URL(value);
   return url.protocol==='https:'&&!url.username&&!url.password&&url.href.length<=1500?url.href:'';
 } catch {return '';}
}
const sharedMediaFieldsLimits={photoUrl:1500,videoUrl:1500,photoDescription:300,videoDescription:800,captionsUrl:1500};
const maxCaptionBytes=256*1024;
const pendingCaptionTracks=new WeakMap();

function renderSharedMedia(entry,context,preview=false){
 const photo=mediaUrl(entry.photoUrl),video=mediaUrl(entry.videoUrl);
 const captions=mediaUrl(entry.captionsUrl);
 if(!photo&&!video)return '';
 const photoDescription=(typeof entry.photoDescription==='string'&&entry.photoDescription.trim())||'Foto compartilhada '+context;
 return `<div class="profile-media">${photo?`<img src="${esc(photo)}" alt="${esc(photoDescription)}" loading="${preview?'eager':'lazy'}" referrerpolicy="no-referrer" data-shared-media><p class="tip" data-media-error role="status" hidden></p>`:''}
 ${photo&&preview&&entry.photoDescription?`<p class="post-copy">Descrição da foto: ${esc(photoDescription)}</p>`:''}
 ${video?`<div role="group" aria-label="Vídeo compartilhado ${context}" data-video-panel><video src="${esc(video)}" controls playsinline preload="${preview?'metadata':'none'}" aria-label="Reproduzir vídeo" data-shared-media></video><p class="tip" data-media-error role="status" hidden></p>
 ${entry.videoDescription?`<p class="post-copy">Resumo do vídeo: ${esc(entry.videoDescription)}</p>`:''}
 ${captions?`<button class="btn btn-outline btn-small" type="button" data-action="load-video-captions" data-url="${esc(captions)}">${preview?'Testar legendas':'Ativar legendas'}</button><p class="mini muted" data-caption-status role="status"></p>
 <button class="btn btn-outline btn-small" type="button" data-action="toggle-video-transcript" data-url="${esc(captions)}" aria-expanded="false">Ler transcrição</button>
 <p class="mini muted" data-transcript-status role="status"></p><div data-video-transcript hidden></div>`:''}
 <a href="${esc(video)}" target="_blank" rel="noopener noreferrer">Abrir vídeo</a></div>`:''}</div>`;
}
function renderProfileMedia(profile){
 return renderSharedMedia(profile,'no perfil');
}
function sharedMediaFields(entry={}){
 return `<label class="field">Link HTTPS da foto (opcional)<input class="input" type="url" name="photoUrl" maxlength="1500" value="${esc(entry.photoUrl||'')}" placeholder="https://…/foto.jpg"></label>
 <label class="field">Descrição da foto (opcional)<input class="input" name="photoDescription" maxlength="${sharedMediaFieldsLimits.photoDescription}" value="${esc(entry.photoDescription||'')}" placeholder="Descreva o que aparece para quem usa leitor de tela"></label>
 <label class="field">Link HTTPS do vídeo (opcional)<input class="input" type="url" name="videoUrl" maxlength="1500" value="${esc(entry.videoUrl||'')}" placeholder="https://…/video.mp4"></label>
 <label class="field">Resumo do vídeo (opcional)<textarea class="textarea" name="videoDescription" rows="2" maxlength="${sharedMediaFieldsLimits.videoDescription}" placeholder="Resuma o que aparece ou é dito">${esc(entry.videoDescription||'')}</textarea></label>
 <label class="field">Link das legendas do vídeo (opcional)<input class="input" type="url" name="captionsUrl" maxlength="${sharedMediaFieldsLimits.captionsUrl}" value="${esc(entry.captionsUrl||'')}" placeholder="https://…/legendas.vtt"><small class="muted">Use um link HTTPS direto para um arquivo .vtt que permita acesso pelo HobbyHub. Confira em Testar legendas na prévia.</small></label>
 <div><button class="btn btn-outline btn-small" type="button" data-action="preview-shared-media">Prévia de fotos e vídeos</button>
 <p class="mini muted" data-media-preview-status role="status"></p><div data-media-preview></div></div>`;
}
function previewSharedMedia(form){
 const status=form.querySelector('[data-media-preview-status]');
 const preview=form.querySelector('[data-media-preview]');
 preview.replaceChildren();
 try {
   const media=readSharedMediaFields(name=>form.elements[name]?.value.trim()||'');
   if(!media.photoUrl&&!media.videoUrl){
     status.textContent='Adicione o link de uma foto ou de um vídeo para ver a prévia.';
     return;
   }
   status.textContent='Prévia da mídia';
   preview.innerHTML=renderSharedMedia(media,'na prévia',true);
 } catch(error) {
   status.textContent=error.message;
 }
}
function readSharedMediaFields(value){
 const photoUrl=mediaUrl(value('photoUrl')),videoUrl=mediaUrl(value('videoUrl'));
 if((value('photoUrl')&&!photoUrl)||(value('videoUrl')&&!videoUrl))throw new Error('Use um link HTTPS válido para a foto ou o vídeo.');
 const photoDescription=photoUrl?value('photoDescription'):'',videoDescription=videoUrl?value('videoDescription'):'';
 const captionsUrl=videoUrl?mediaUrl(value('captionsUrl')):'';
 if(videoUrl&&value('captionsUrl')&&!captionsUrl)throw new Error('Use um link HTTPS válido para as legendas do vídeo.');
 if(photoDescription.length>sharedMediaFieldsLimits.photoDescription||videoDescription.length>sharedMediaFieldsLimits.videoDescription)throw new Error('A descrição da foto aceita até 300 caracteres e o resumo do vídeo até 800.');
 return {photoUrl,videoUrl,photoDescription,videoDescription,captionsUrl};
}
async function readVideoCaptions(url){
 const response=await fetch(url,{mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(10000)});
 if(!response.ok||!response.body)throw new Error('Erro ao buscar legendas.');
 const reader=response.body.getReader(),decoder=new TextDecoder('utf-8',{fatal:true});
 let text='',size=0;
 try{
   while(true){
     const {done,value}=await reader.read();
     if(done)break;
     size+=value.byteLength;
     if(size>maxCaptionBytes)throw new Error('Arquivo de legendas muito grande.');
     text+=decoder.decode(value,{stream:true});
   }
   text+=decoder.decode();
 } finally {
   void reader.cancel().catch(()=>{});
 }
 if(!/^WEBVTT(?:[ \t][^\r\n]*)?(?:\r\n|[\r\n])/.test(text))throw new Error('Arquivo de legendas inválido.');
 return text;
}
async function attachCaptionTrack(video,url){
 let track,source;
 try{
   const captions=await readVideoCaptions(url);
   if(!video.isConnected)throw new Error('Player fechado.');
   source=URL.createObjectURL(new Blob([captions],{type:'text/vtt'}));
   track=document.createElement('track');
   track.kind='captions';
   track.label='Legendas';
   track.src=source;
   await new Promise((resolve,reject)=>{
     const timeout=setTimeout(reject,5000);
     track.addEventListener('load',()=>{clearTimeout(timeout);resolve();},{once:true});
     track.addEventListener('error',()=>{clearTimeout(timeout);reject();},{once:true});
     video.append(track);
     track.track.mode='hidden';
   });
   if(!track.track.cues?.length)throw new Error('Nenhuma legenda encontrada.');
   return track.track;
 } catch(error) {
   track?.remove();
   throw error;
 } finally {
   if(source)URL.revokeObjectURL(source);
 }
}
async function videoCaptionTrack(video,url){
 const pending=pendingCaptionTracks.get(video);
 if(pending)return pending;
 const loaded=video.querySelector('track')?.track;
 if(loaded){
   if(loaded.mode==='disabled')loaded.mode='hidden';
   return loaded;
 }
 const request=attachCaptionTrack(video,url);
 pendingCaptionTracks.set(video,request);
 try{return await request;}
 finally{pendingCaptionTracks.delete(video);}
}
async function loadVideoCaptions(button){
 const panel=button.parentElement,status=panel.querySelector('[data-caption-status]');
 const video=panel.querySelector('video');
 if(!video||video.error){
   status.textContent='Use um link de vídeo que carregue para testar as legendas.';
   return;
 }
 button.disabled=true;
 status.textContent='Carregando legendas…';
 try{
   const track=await videoCaptionTrack(video,button.dataset.url);
   track.mode='showing';
   status.textContent='Legendas ativadas. Use os controles do vídeo para desativá-las.';
 } catch {
   status.textContent='As legendas não carregaram. Confira se o link dá acesso direto a um arquivo .vtt de até 256 KB.';
 } finally {
   button.disabled=false;
 }
}
function transcriptTime(time){
 const seconds=Math.floor(time);
 const minutes=Math.floor(seconds/60);
 const tail=[minutes%60,seconds%60].map(value=>String(value).padStart(2,'0')).join(':');
 return minutes>=60?Math.floor(minutes/60)+':'+tail:tail;
}
function renderVideoTranscript(cues,canSeek){
 const lines=Array.from(cues||[],cue=>{
   const text=cue.getCueAsHTML().textContent.trim();
   if(!text||!Number.isFinite(cue.startTime)||cue.startTime<0)return '';
   const timestamp=transcriptTime(cue.startTime);
   const marker=canSeek
     ?`<button class="text-action" type="button" data-action="seek-video-transcript" data-time="${cue.startTime}" aria-label="Ir para ${timestamp} no vídeo">${timestamp}</button>`
     :`<span class="muted">${timestamp}</span>`;
   return `<li>${marker} <span class="post-copy">${esc(text)}</span></li>`;
 }).filter(Boolean);
 return lines.length?`<ol aria-label="Transcrição do vídeo">${lines.join('')}</ol>`:'';
}
async function toggleVideoTranscript(button){
 const panel=button.parentElement,transcript=panel.querySelector('[data-video-transcript]');
 const status=panel.querySelector('[data-transcript-status]'),video=panel.querySelector('video');
 if(!transcript.hidden){
   transcript.hidden=true;
   button.textContent='Ler transcrição';
   button.setAttribute('aria-expanded','false');
   status.textContent='';
   return;
 }
 button.disabled=true;
 status.textContent='Carregando a transcrição…';
 try{
   const track=await videoCaptionTrack(video,button.dataset.url);
   const html=renderVideoTranscript(track.cues,!video.error);
   if(!html)throw new Error('Nenhum trecho de texto encontrado.');
   transcript.innerHTML=html;
   transcript.hidden=false;
   button.textContent='Ocultar transcrição';
   button.setAttribute('aria-expanded','true');
   status.textContent='Transcrição disponível.';
 } catch {
   status.textContent='A transcrição não carregou. Confira o link do arquivo de legendas.';
 } finally {
   button.disabled=false;
 }
}
function seekVideoTranscript(button){
 const panel=button.closest('[data-video-panel]');
 const video=panel.querySelector('video'),time=Number(button.dataset.time);
 if(!video||video.error||!Number.isFinite(time)||time<0){
   panel.querySelector('[data-transcript-status]').textContent='O vídeo está indisponível para ir a este trecho.';
   return;
 }
 video.currentTime=time;
 video.focus();
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
 <div class="section-head"><h2>Suas publicações</h2><div class="toggle-row" style="flex-wrap:wrap">
 <button class="text-action" data-action="my-comment-activity">Meus comentários</button>
 <button class="text-action" data-action="compose">Publicar algo ${icon('plus')}</button></div></div>
 ${posts.length?posts.map(postCard).join(''):empty('🎨','Conte sua primeira história','O que você está aprendendo, criando ou descobrindo?','Criar publicação','compose')}`;
}
function directSearchResults(messages,query){
 const term=norm(query);
 return term?messages.filter(message=>!message.deletedAt&&norm(message.text).includes(term)).reverse():[];
}
function communityMessageAuthor(message){
 return message.senderName||member(message.senderId)?.name||'Pessoa';
}
function communitySearchResults(messages,query){
 const term=norm(query);
 return term?messages.filter(message=>message.id&&!message.deletedAt&&
   (norm(message.text).includes(term)||norm(communityMessageAuthor(message)).includes(term))).reverse():[];
}
function renderChatSearch(query,count,community=false){
 const input=community?'community-search':'direct-search';
 return `<div class="form-stack" style="padding:12px">
 <label for="${input}">Buscar na conversa</label>
 <input id="${input}" class="input" ${community?'type="search" placeholder="Palavra ou nome"':''} value="${esc(query)}" maxlength="150" autocomplete="off">
 <p class="mini muted" role="status">${norm(query)?(count?`${count} ${count===1?'mensagem encontrada':'mensagens encontradas'}`:'Nenhuma mensagem encontrada.'):community?'Digite uma palavra ou nome.':'Digite uma palavra ou frase.'}</p>
 </div>`;
}
function stopDirectSavedMessages(){
 state.directSavedUnsub?.();
 state.directSavedUnsub=null;
 state.directSavedIds=null;
 state.directSavedLimit=0;
}
async function toggleSavedDirectMessage(id){
 const uid=me(),peer=state.chatTarget?.uid,saved=state.directSavedIds;
 if(!uid||!peer||!saved||state.chatMode!=='direct'||!state.directMessages.some(message=>message.id===id))return;
 const removing=saved.has(id);
 await attempt(async()=>{
   const marker=ref('members',uid,'privateSaved',threadId(uid,peer),'messages',id);
   if(removing)await firebase.deleteDoc(marker);
   else await firebase.setDoc(marker,{saved:true});
 },'changingDirectSaved');
}
function renderDirectSavedMessages(messages){
 if(!state.directSavedIds)return '<p class="mini muted" role="status">Carregando mensagens salvas…</p>';
 const saved=messages.filter(message=>!message.deletedAt&&state.directSavedIds.has(message.id)).reverse();
 if(!saved.length)return '<p class="mini muted" role="status">Nenhuma mensagem salva nesta conversa.</p>';
 return `${saved.slice(0,state.directSavedLimit).map(message=>`<div class="card" style="padding:10px;overflow-wrap:anywhere">
 <p>${esc(message.text)}</p><p class="mini muted">${when(message.createdAt)}</p>
 <div class="toggle-row" style="flex-wrap:wrap">
 <button type="button" class="btn btn-soft btn-small" data-action="jump-direct-message" data-id="${esc(message.id)}">Ir à mensagem</button>
 <button type="button" class="btn btn-outline btn-small" data-action="toggle-direct-saved-message" data-id="${esc(message.id)}" ${state.changingDirectSaved?'disabled':''}>Remover dos salvos</button>
 </div></div>`).join('')}
 ${saved.length>state.directSavedLimit?'<button type="button" class="btn btn-soft" data-action="more-direct-saved-messages">Ver mais mensagens salvas</button>':''}`;
}
function directMessageLinks(messages){
 const links=[];
 for(let index=messages.length-1;index>=0;index--){
   const message=messages[index];
   if(message.deletedAt)continue;
   for(const [candidate] of String(message.text||'').matchAll(/https?:\/\/[^\s<>"'`]+/gi)){
     let address=candidate.replace(/[.,!?;:…]+$/u,'');
     for(const [opening,closing] of [['(',')'],['[',']'],['{','}']]){
       const opened=address.split(opening).length-1;
       let closed=address.split(closing).length-1;
       while(closed>opened&&address.endsWith(closing)){
         address=address.slice(0,-1);
         closed--;
       }
     }
     try{
       const url=new URL(address);
       if(!['https:','http:'].includes(url.protocol)||url.username||url.password)continue;
       links.push({url,message});
     }catch{}
   }
 }
 return links;
}
function renderDirectLinks(messages,limit){
 const links=directMessageLinks(messages);
 if(!links.length)return '<p class="mini muted" role="status">Nenhum link compartilhado nesta conversa.</p>';
 return `${links.slice(0,limit).map(({url,message})=>`<div class="card" style="padding:10px;overflow-wrap:anywhere">
 <strong>${esc(url.hostname)}</strong>
 <p class="mini muted">${esc(url.href)}</p>
 <p class="mini muted">${message.senderId===me()?'Enviado':'Recebido'} · ${when(message.createdAt)}</p>
 <div class="toggle-row" style="flex-wrap:wrap">
 <a class="btn btn-soft btn-small" href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">Abrir link</a>
 <button type="button" class="btn btn-outline btn-small" data-action="jump-direct-message" data-id="${esc(message.id)}">Ir à mensagem</button>
 </div></div>`).join('')}
 ${links.length>limit?'<button type="button" class="btn btn-soft" data-action="more-direct-links">Ver mais links</button>':''}`;
}
function renderChatSearchMatches(results,limit,community=false){
 const channel=community?'community':'direct';
 return `${results.slice(0,limit).map(message=>`<button class="btn btn-outline" style="display:block;text-align:left;white-space:normal;overflow-wrap:anywhere" data-action="jump-${channel}-message" data-id="${esc(message.id)}">${community?`<strong style="display:block">${esc(communityMessageAuthor(message))}</strong>`:''}${esc(short(message.text,180))}<small style="display:block">${when(message.createdAt)}</small></button>`).join('')}
 ${results.length>limit?`<button class="btn btn-soft" data-action="more-${channel}-matches">Ver mais resultados</button>`:''}`;
}
function showDirectMessage(id){
 state.directEventLimit=0;
 state.directSavedLimit=0;
 if(!state.directMessages.some(message=>message.id===id))return;
 state.directSearch=null;
 state.directLinksLimit=0;
 state.directHistoryAnchor=id;
 render();
 const row=document.getElementById('direct-message-'+id);
 row?.focus({preventScroll:true});
 row?.scrollIntoView({block:'nearest'});
}
const directReactionOptions=new Map([['👍','Gostei'],['❤️','Amei'],['😂','Engraçado'],['😮','Surpresa'],['🙌','Celebração']]);
function chatMessageMenuScope(){
 return state.chatMode==='direct'?state.chatTarget?.uid&&'direct:'+state.chatTarget.uid:state.chatMode;
}
function communityChannelKey(mode=state.chatMode){
 const channel=mode==='global'?'global':['local',cityKey(myLocation())];
 return JSON.stringify([me(),channel]);
}
function communityReadingKey(mode=state.chatMode){
 return COMMUNITY_READING_PREFIX+communityChannelKey(mode);
}
function communitySavedKey(){
 return COMMUNITY_SAVED_PREFIX+communityChannelKey();
}
const COMMUNITY_SAVED_PREFIX='hobbyhub-community-saved:';
function parseLegacyCommunitySaved(raw){
 const ids=JSON.parse(raw);
 return Array.isArray(ids)?ids.filter(id=>typeof id==='string'&&id.length>0&&id.length<=150&&!id.includes('/')):[];
}
function readCommunitySaved(){
 let local=[];
 try{local=parseLegacyCommunitySaved(localStorage.getItem(communitySavedKey()));}catch{}
 const saved=new Set(local);
 const cloud=state.communitySavedCloud;
 if(!cloud||cloud.uid!==me())return saved;
 for(const [id,active] of cloud.markers){
   if(active)saved.add(id);
   else saved.delete(id);
 }
 return saved;
}
async function migrateCommunitySaved(uid){
 if(!uid||state.communitySavedMigration)return;
 const migration={uid};
 state.communitySavedMigration=migration;
 try{
   const entries=[];
   for(let i=0;i<localStorage.length;i++){
     const key=localStorage.key(i);
     if(!key?.startsWith(COMMUNITY_SAVED_PREFIX))continue;
     try{
       const [owner]=JSON.parse(key.slice(COMMUNITY_SAVED_PREFIX.length));
       if(owner!==uid)continue;
       const raw=localStorage.getItem(key);
       entries.push({key,raw,ids:new Set(parseLegacyCommunitySaved(raw))});
     }catch{}
   }
   for(const {key,raw,ids} of entries){
     for(const id of ids){
       if(me()!==uid||state.communitySavedMigration!==migration)return;
       const marker=ref('members',uid,'communitySaved',id);
       await firebase.runTransaction(db,async transaction=>{
         if(!(await transaction.get(marker)).exists())transaction.set(marker,{saved:true});
       });
     }
     if(me()!==uid||state.communitySavedMigration!==migration)return;
     if(localStorage.getItem(key)===raw)localStorage.removeItem(key);
   }
 }catch(error){console.warn('HobbyHub: mensagens salvas aguardando sincronização.',error);}
 finally{
   if(state.communitySavedMigration===migration){state.communitySavedMigration=null;if(state.tab==='messages')render();}
 }
}
function communitySaveButton(id,saved){
 return `<button type="button" class="btn btn-soft btn-small" data-action="toggle-community-saved-message" data-id="${esc(id)}" aria-pressed="${saved}">${saved?'Remover dos salvos':'Salvar mensagem'}</button>`;
}
function renderCommunitySavedMessages(messages,savedIds){
 const saved=messages.filter(message=>savedIds.has(message.id)).reverse();
 return `<h3 id="community-saved-title" tabindex="-1">Mensagens salvas</h3>${saved.length?
   saved.map(message=>`<div class="community-saved-row">${renderChatSearchMatches([message],1,true)}${communitySaveButton(message.id,true)}</div>`).join(''):
   '<p class="mini muted">Você ainda não tem mensagens salvas neste chat.</p>'}`;
}
const COMMUNITY_READING_PREFIX='hobbyhub-community-read:';
function readLocalCommunityPosition(key){
 try{
   const position=JSON.parse(localStorage.getItem(key));
   if(Number.isSafeInteger(position?.time)&&position.time>=0&&typeof position.id==='string'&&position.id.length>0&&position.id.length<=150)return position;
 }catch{}
 return null;
}
function communityReadingDocument(key,uid){
 if(!key?.startsWith(COMMUNITY_READING_PREFIX))return null;
 try{
   const [owner,channel]=JSON.parse(key.slice(COMMUNITY_READING_PREFIX.length));
   if(owner===uid&&(channel==='global'||(Array.isArray(channel)&&channel[0]==='local'&&typeof channel[1]==='string'))){
     const id=encodeURIComponent(JSON.stringify(channel));
     if(id.length<=1200)return id;
   }
 }catch{}
 return null;
}
function readCommunityPosition(key){
 const local=readLocalCommunityPosition(key);
 const sync=state.communityReadSync;
 const remote=sync&&sync.uid===me()?sync.positions.get(communityReadingDocument(key,sync.uid)):null;
 return !remote||(local&&compareCommunityPositions(local,remote)>=0)?local:remote;
}
function watchCommunityReading(uid){
 const sync={uid,positions:new Map(),ready:false,timer:null};
 state.communityReadSync=sync;
 const unsub=firebase.onSnapshot(col('members',uid,'communityReading'),{includeMetadataChanges:true},snapshot=>{
   if(state.communityReadSync!==sync||snapshot.metadata.fromCache)return;
   const first=!sync.ready;
   sync.positions=new Map(snapshot.docs.map(doc=>[doc.id,doc.data()]));
   sync.ready=true;
   if(first)scheduleCommunityReadingSync();
   if(state.tab==='messages')render();
 },error=>{
   if(state.communityReadSync!==sync)return;
   console.warn('HobbyHub: ponto de leitura sem sincronização.',error);
   sync.ready=true;
   if(state.tab==='messages')render();
 });
 state.sessionUnsubs.push(unsub);
}
function scheduleCommunityReadingSync(){
 const sync=state.communityReadSync;
 if(!sync?.ready)return;
 clearTimeout(sync.timer);
 sync.timer=setTimeout(()=>void flushCommunityReading(sync),800);
}
async function flushCommunityReading(sync){
 if(state.communityReadSync!==sync||me()!==sync.uid)return;
 try{
   for(let i=0;i<localStorage.length;i++){
     const key=localStorage.key(i);
     const channel=communityReadingDocument(key,sync.uid);
     if(!channel)continue;
     const position=readLocalCommunityPosition(key);
     const remote=sync.positions.get(channel);
     if(!position||(remote&&compareCommunityPositions(position,remote)<=0))continue;
     if(state.communityReadSync!==sync||me()!==sync.uid)return;
     const marker=ref('members',sync.uid,'communityReading',channel);
     await firebase.runTransaction(db,async transaction=>{
       const latest=await transaction.get(marker);
       if(!latest.exists()||compareCommunityPositions(position,latest.data())>0)transaction.set(marker,position);
     });
   }
 }catch(error){console.warn('HobbyHub: ponto de leitura aguardando sincronização.',error);}
}
function compareCommunityPositions(a,b){
 return a.time-b.time||(a.id===b.id?0:a.id>b.id?1:-1);
}
function communityMessagePosition(message){
 return {id:message.id,time:Number(message.createdAt)||0};
}
function firstUnreadCommunityMessage(messages,key){
 const position=readCommunityPosition(key);
 return position&&messages.find(message=>message.id&&message.senderId!==me()&&
   compareCommunityPositions(communityMessagePosition(message),position)>0);
}
function renderCommunityContact(mode,label,emoji){
 const unread=firstUnreadCommunityMessage(chatMessages(mode),communityReadingKey(mode));
 return `<button class="chat-contact ${state.chatMode===mode?'active':''}" data-action="chat-community"${mode==='global'?' data-value="global"':''}>${avatar({avatar:emoji})}<span class="community-contact-label">${label}</span><span id="community-unread-${mode}" class="unread-dot" ${unread?'':'hidden'}><span class="sr-only">Novas mensagens</span></span></button>`;
}
function rememberCommunityReading(log){
 const key=log.dataset.communityReading;
 if(!key||!log.clientHeight||state.modal||document.visibilityState!=='visible'||state.communityReadSync?.ready===false)return;
 const bounds=log.getBoundingClientRect();
 const visible=[...log.querySelectorAll('[data-community-message]')].findLast(row=>{
   const bottom=row.getBoundingClientRect().bottom;
   return bottom>bounds.top&&bottom<=bounds.bottom+1;
 });
 if(!visible)return;
 const position={id:visible.dataset.communityMessage,time:Number(visible.dataset.communityTime)};
 const previous=readCommunityPosition(key);
 if(previous&&compareCommunityPositions(position,previous)<=0)return;
 try{localStorage.setItem(key,JSON.stringify(position));}catch{return;}
 scheduleCommunityReadingSync();
 if(state.chatMode==='direct'||communityReadingKey()!==key)return;
 const indicator=document.getElementById('community-unread-'+state.chatMode);
 if(indicator)indicator.hidden=!firstUnreadCommunityMessage(chatMessages(),key);
}
function restoreChatScroll(previous,next,scroll,nearBottom){
 const search=next.dataset.communitySearch;
 if(search){next.scrollTop=previous?.dataset.communitySearch===search?scroll:0;return;}
 const key=next.dataset.communityReading;
 if(!key){
   next.scrollTop=nearBottom?next.scrollHeight:scroll;
   return;
 }
 if(!next.clientHeight)return;
 next.addEventListener('scroll',()=>rememberCommunityReading(next),{passive:true});
 if(previous?.dataset.communitySearch===key&&state.communityHistoryAnchor?.key===key)return;
 const sameChat=previous?.dataset.communityReading===key&&previous.dataset.communityReadingReady===next.dataset.communityReadingReady&&
   previous.querySelector('[data-community-message]');
 if(sameChat)next.scrollTop=nearBottom?next.scrollHeight:scroll;
 else{
   const marker=next.querySelector('#community-new-messages');
   next.scrollTop=marker?marker.getBoundingClientRect().top-next.getBoundingClientRect().top+next.scrollTop:next.scrollHeight;
 }
 rememberCommunityReading(next);
}
function chatMessages(mode=state.chatMode){
 if(mode==='direct')return state.directMessages;
 return state.messages.filter(m=>mode==='global'?m.scope==='global':m.scope!=='global'&&locate(m.location));
}
function renderMessageMenu(m,actions){
 if(!m.id)return '';
 const open=state.directMessageMenu?.scope===chatMessageMenuScope()&&state.directMessageMenu?.id===m.id;
 return `<div class="direct-message-menu">
 <button type="button" class="direct-message-menu-toggle" data-action="toggle-direct-message-menu" data-id="${esc(m.id)}" aria-label="Opções da mensagem" aria-expanded="${open}">⋯</button>
 <div class="direct-message-actions ${open?'is-open':''}">
 ${m.id?`<button type="button" class="btn btn-soft btn-small" data-action="copy-direct-message" data-id="${esc(m.id)}">Copiar</button>`:''}
 ${actions}</div></div>`;
}
function renderDirectMessageMenu(m,blocked){
 return renderMessageMenu(m,`${!blocked&&canEditDirectMessage(m)?`<button type="button" class="btn btn-soft btn-small" data-action="edit-direct-message" data-id="${esc(m.id)}">Editar</button><button type="button" class="btn btn-soft btn-small" data-action="delete-direct-message" data-id="${esc(m.id)}">Apagar para todos</button>`:''}${!blocked&&m.id?`<button type="button" class="btn btn-soft btn-small" data-action="reply-direct-message" data-id="${esc(m.id)}">Responder</button>`:''}${m.id&&state.directSavedIds?`<button type="button" class="btn btn-soft btn-small" aria-pressed="${state.directSavedIds.has(m.id)}" data-action="toggle-direct-saved-message" data-id="${esc(m.id)}" ${state.changingDirectSaved?'disabled':''}>${state.directSavedIds.has(m.id)?'Remover dos salvos':'Salvar mensagem'}</button>`:''}${m.id?renderDirectReactions(m,blocked):''}${m.senderId!==me()&&m.id?reportButton('privateMessage',m.id,'mensagem'):''}`);
}
function renderDirectReactions(message,blocked){
 const mine=message.reactions?.[me()];
 const peer=message.reactions?.[state.chatTarget?.uid];
 const open=!blocked&&state.directReactionPicker===message.id;
 const buttons=[...directReactionOptions].map(([emoji,label])=>{
   const count=Number(mine===emoji)+Number(peer===emoji);
   if(!open&&!count)return '';
   const caption=mine===emoji?'Remover reação '+label:label;
   return blocked?`<span aria-label="${label}">${emoji} ${count}</span>`:`<button type="button" class="btn btn-soft btn-small" aria-pressed="${mine===emoji}" aria-label="${caption}${count?' ('+count+')':''}" data-action="set-direct-reaction" data-id="${esc(message.id)}" data-value="${emoji}" ${state.changingDirectReaction?'disabled':''}>${emoji}${count?' '+count:''}</button>`;
 }).join('');
 return `<div class="toggle-row" style="flex-wrap:wrap">${buttons}${blocked?'':`<button type="button" class="btn btn-soft btn-small" aria-expanded="${open}" data-action="toggle-direct-reaction" data-id="${esc(message.id)}">${open?'Fechar':'Reagir'}</button>`}</div>`;
}
async function setDirectReaction(id,emoji){
 const uid=me(),peer=state.chatTarget?.uid;
 if(!uid||!peer||state.chatMode!=='direct'||state.blockedIds.includes(peer)||!directReactionOptions.has(emoji)||!state.directMessages.some(message=>message.id===id))return;
 await attempt(async()=>{
   const message=firebase.doc(directMessagesCol(threadId(uid,peer)),id);
   await firebase.runTransaction(db,async transaction=>{
     const current=await transaction.get(message);
     if(!current.exists())return;
     const remove=current.data().reactions?.[uid]===emoji;
     transaction.update(message,new firebase.FieldPath('reactions',uid),remove?firebase.deleteField():emoji);
   });
   if(me()===uid&&state.chatTarget?.uid===peer&&state.directReactionPicker===id)state.directReactionPicker=null;
 },'changingDirectReaction','Não foi possível alterar a reação nesta conversa.');
}
const eventChatPrefix='Convite para evento: ';
function eventChatMessage(event){
 const title=String(event.title||'Evento').replace(/\s+/g,' ').trim();
 return eventChatPrefix+title+'\n'+contentLink('event',event.id);
}
function eventInvitationRsvp(event,schedule){
 const uid=me();
 if(!uid||event.cancelled||schedule.date<today())return '';
 if(event.attendees?.includes(uid))return '<span class="pill">Presença confirmada</span>';
 const eligible=!event.groupId||pollMember(event.groupId);
 const queued=event.waitlist?.includes(uid);
 const offered=eligible&&queued&&eventSeatOffer(event);
 if(queued&&!offered)return '<span class="pill">Na lista de espera</span>';
 if(!eligible)return '';
 const waiting=Number.isInteger(event.capacity)&&
   ((event.attendees||[]).length>=event.capacity||event.waitlist?.length);
 const label=offered?'Confirmar vaga':waiting?'Entrar na lista de espera':'Confirmar presença';
 return `<button type="button" class="btn btn-primary btn-small" data-action="rsvp" data-value="invitation" data-id="${esc(event.id)}" ${state.busy?'disabled':''}>${label}</button>`;
}
function directEventInvitation(text){
 if(typeof text!=='string'||!text.startsWith(eventChatPrefix))return null;
 const [title,address,...extra]=text.split('\n');
 if(!address||extra.length)return null;
 try{
   const link=new URL(address);
   if(!link.hash.startsWith('#event='))return null;
   const id=decodeURIComponent(link.hash.slice(7));
   if(!id||link.href!==contentLink('event',id))return null;
   return {id,title:title.slice(eventChatPrefix.length),url:link.href};
 }catch{return null;}
}
function renderEventInvitation(invitation,event,received=false,listed=false){
 const schedule=event&&viewerEventSchedule(event);
 const uid=me();
 const status=!listed?'':!event?'Evento indisponível':event.cancelled?'Cancelado':
   event.attendees?.includes(uid)?'Presença confirmada':schedule.date<today()?'Encerrado':
   eventSeatOffer(event)?'Vaga reservada':event.waitlist?.includes(uid)?'Na lista de espera':'Sem confirmação';
 return `<div class="form-stack">
 <strong>${esc(event?.title||invitation.title)}</strong>
 ${schedule?`<span>${esc(!listed&&event.cancelled?'Evento cancelado':[dateLabel(schedule.date),schedule.time].filter(Boolean).join(' · '))}</span>`:''}
 ${(received&&event?eventInvitationRsvp(event,schedule):'')||(listed?`<span class="pill">${status}</span>`:'')}
 ${event?`<button type="button" class="btn btn-soft btn-small" data-action="view-event" data-id="${esc(invitation.id)}">Ver evento</button>`:`<a class="btn btn-soft btn-small" href="${esc(invitation.url)}">Ver evento</a>`}
 </div>`;
}
function renderDirectMessageText(text,received=false){
 const invitation=directEventInvitation(text);
 if(!invitation)return esc(text);
 return renderEventInvitation(invitation,state.events.find(item=>item.id===invitation.id),received);
}
function renderSharedDirectEvents(messages,limit){
 const events=new Map(state.events.map(event=>[event.id,event]));
 const invitations=messages.flatMap(message=>{
   const invitation=!message.deletedAt&&directEventInvitation(message.text);
   return invitation?[{invitation,message}]:[];
 }).reverse();
 if(!invitations.length)return '<p class="mini muted" role="status">Nenhum evento compartilhado nesta conversa.</p>';
 return `${invitations.slice(0,limit).map(({invitation,message})=>`<article class="card form-stack" style="padding:12px;overflow-wrap:anywhere">
 ${renderEventInvitation(invitation,events.get(invitation.id),false,true)}
 <div class="toggle-row" style="flex-wrap:wrap">
 <span class="mini muted">${message.senderId===me()?'Enviado':'Recebido'} · ${when(message.createdAt)}</span>
 <button type="button" class="btn btn-outline btn-small" data-action="jump-direct-message" data-id="${esc(message.id)}">Ir à mensagem</button>
 </div></article>`).join('')}
 ${invitations.length>limit?'<button type="button" class="btn btn-soft" data-action="more-shared-direct-events">Ver mais eventos</button>':''}`;
}
function eventChatRecipients(){
 const uid=me();
 return state.threads.filter(thread=>thread.participants?.includes(uid)).flatMap(thread=>{
   const peer=thread.participants.find(id=>id!==uid);
   if(!peer||state.blockedIds.includes(peer)||thread.id!==threadId(uid,peer))return [];
   return [{peer,thread:thread.id,name:member(peer)?.name||thread.names?.[peer]||'Pessoa'}];
 }).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
}
function eventInvitationMessageQuery(thread){
 // O limite exclusivo avança o espaço final do prefixo, incluindo títulos com qualquer caractere.
 return firebase.query(directMessagesCol(thread),firebase.orderBy('text'),
   firebase.startAt(eventChatPrefix),firebase.endBefore(eventChatPrefix.trimEnd()+'!'));
}
async function lastSentEventInvitation(thread,uid,eventId){
 const snapshot=await firebase.getDocsFromServer(eventInvitationMessageQuery(thread));
 let latest=null;
 for(const doc of snapshot.docs){
   const message=doc.data();
   if(message.senderId===uid&&!message.deletedAt&&directEventInvitation(message.text)?.id===eventId){
     latest=Math.max(latest??0,message.createdAt||0);
   }
 }
 return latest;
}
async function loadEventChatShareHistory(){
 const uid=me(),id=state.selectedEvent,panel=state.eventChatShares.get(id);
 if(!uid||!panel||panel.loading||panel.sending)return;
 const recipients=eventChatRecipients();
 panel.loading=true;panel.unknown.clear();
 render();
 const active=()=>me()===uid&&state.eventChatShares.get(id)===panel;
 for(let offset=0;offset<recipients.length&&active();offset+=6){
   await Promise.all(recipients.slice(offset,offset+6).map(async item=>{
     try{
       const latest=await lastSentEventInvitation(item.thread,uid,id);
       if(latest===null)panel.previous.delete(item.peer);
       else{panel.previous.set(item.peer,latest);panel.selected.delete(item.peer);}
     }catch{panel.unknown.add(item.peer);}
   }));
 }
 panel.loading=false;
 if(active()&&state.modal==='event-chat-share'&&state.selectedEvent===id)render();
}
function renderEventChatRecipient(item,panel){
 if(panel.previous.has(item.peer)){
   const previous=panel.previous.get(item.peer);
   return `<div class="card form-stack" style="padding:10px">
   <strong>${esc(item.name)}</strong><p class="mini muted">Já convidado${previous?' · '+esc(new Date(previous).toLocaleString('pt-BR')):''}</p>
   ${panel.deliveries.get(item.peer)?.status==='failed'?'':`<button type="button" class="btn btn-outline btn-small" data-action="prepare-event-invite-resend" data-id="${esc(item.peer)}" ${panel.sending||panel.loading||panel.unknown.has(item.peer)?'disabled':''}>Reenviar convite</button>`}
   </div>`;
 }
 return `<button type="button" class="btn ${panel.selected.has(item.peer)?'btn-soft':'btn-outline'}" data-action="select-event-chat-recipient" data-id="${esc(item.peer)}" aria-pressed="${panel.selected.has(item.peer)}" ${panel.sending||panel.loading||panel.unknown.has(item.peer)?'disabled':''}>${esc(item.name)}</button>`;
}
function renderEventChatShare(){
 const event=state.events.find(item=>item.id===state.selectedEvent);
 const panel=state.eventChatShares.get(state.selectedEvent);
 if(!event||event.cancelled||!panel)return modalWrap('Compartilhar no chat','<p>Este evento não está disponível.</p>');
 const recipients=eventChatRecipients();
 const back=`<button type="button" class="btn btn-outline" data-action="view-event" data-id="${esc(event.id)}">Voltar ao evento</button>`;
 if(!recipients.length&&!panel.deliveries.size)return modalWrap('Compartilhar no chat',`<div class="form-stack"><p>Abra uma conversa privada com a pessoa antes de enviar o convite.</p>${back}</div>`);
 const term=norm(panel.query);
 const options=recipients.filter(item=>(!panel.deliveries.has(item.peer)||panel.previous.has(item.peer))&&(!term||norm(item.name).includes(term)));
 const confirming=recipients.find(item=>item.peer===panel.confirmResend);
 const sent=[...panel.deliveries.values()].filter(item=>item.status==='sent');
 const failed=[...panel.deliveries.values()].filter(item=>item.status==='failed');
 return modalWrap('Compartilhar no chat',`<form id="event-chat-share-form" class="form-stack">
 <p>${esc(event.title)}</p>
 <label class="field">Buscar conversa pelo nome<input type="search" id="event-chat-share-search" class="input" value="${esc(panel.query)}" maxlength="100" autocomplete="off"></label>
 <div class="form-stack" role="group" aria-label="Conversas privadas" style="max-height:35vh;overflow:auto;padding:4px">
 ${panel.loading?'<p class="mini muted" role="status">Conferindo convites anteriores…</p>':''}
 ${options.map(item=>renderEventChatRecipient(item,panel)).join('')}
 ${panel.unknown.size&&!panel.loading?'<p class="tip">Alguns envios anteriores não puderam ser conferidos. <button type="button" class="text-action" data-action="reload-event-invite-history">Tentar novamente</button></p>':''}
 ${!options.length?'<p class="mini muted">Nenhuma conversa disponível neste filtro.</p>':''}
 </div>
 ${confirming?`<div class="card form-stack" style="padding:10px">
 <p>Reenviar o convite para ${esc(confirming.name)}?</p>
 <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="btn btn-outline btn-small" data-action="cancel-event-invite-resend">Cancelar</button>
 <button type="button" class="btn btn-primary btn-small" data-action="confirm-event-invite-resend" data-id="${esc(confirming.peer)}">Confirmar reenvio</button></div></div>`:''}
 <div role="status">
 <p class="mini muted">${panel.sending?'Enviando convites…':`${panel.selected.size} selecionada${panel.selected.size===1?'':'s'}`}</p>
 ${sent.length?`<p class="mini">Enviados para ${esc(sent.map(item=>item.name).join(', '))}.</p>`:''}
 ${failed.length?`<p class="mini">Envio pendente para ${esc(failed.map(item=>item.name).join(', '))}.</p>`:''}
 </div>
 <div class="toggle-row" style="flex-wrap:wrap">${back}
 ${failed.length?`<button type="button" class="btn btn-outline" data-action="retry-event-chat-share" ${panel.sending?'disabled':''}>Tentar pendentes novamente</button>`:''}
 <button type="submit" class="btn btn-primary" ${panel.sending||panel.loading||!panel.selected.size?'disabled':''}>Enviar convite</button></div></form>`);
}
async function sendEventChatInvites(retry=false,resendPeer=''){
 const uid=me(),id=state.selectedEvent,panel=state.eventChatShares.get(id);
 const event=state.events.find(item=>item.id===id);
 if(!uid||state.modal!=='event-chat-share'||!event||event.cancelled||!panel||panel.sending||panel.loading)return;
 const recipients=new Map(eventChatRecipients().map(item=>[item.peer,item]));
 const recipient=resendPeer&&recipients.get(resendPeer);
 if(resendPeer&&(!recipient||panel.confirmResend!==resendPeer||!panel.previous.has(resendPeer)||panel.unknown.has(resendPeer)))return;
 const selected=recipient?[{...recipient,resend:true}]:retry?[...panel.deliveries.values()].filter(item=>item.status==='failed'):[...panel.selected]
   .filter(peer=>!panel.previous.has(peer)&&!panel.unknown.has(peer)).map(peer=>recipients.get(peer)).filter(Boolean);
 panel.confirmResend=null;
 if(!selected.length)return;
 const text=eventChatMessage(event);
 if(text.length>1500){showToast('O convite é longo demais para enviar no chat.',true);return;}
 panel.sending=true;
 const active=()=>me()===uid&&state.eventChatShares.get(id)===panel;
 for(const item of selected){
   panel.selected.delete(item.peer);
   item.status='sending';
   panel.deliveries.set(item.peer,item);
 }
 render();
 try{
   for(let offset=0;offset<selected.length&&active();offset+=5){
     await Promise.all(selected.slice(offset,offset+5).map(async item=>{
       try{
         if(!recipients.has(item.peer))throw new Error('Conversa indisponível');
         if(!item.resend){
           const latest=await lastSentEventInvitation(item.thread,uid,id);
           if(latest!==null){
             panel.previous.set(item.peer,latest);
             item.status='sent';
             return;
           }
         }
         item.target??=firebase.doc(directMessagesCol(item.thread));
         item.payload??={senderId:uid,senderName:myName(),text,createdAt:now()};
         try{await firebase.setDoc(item.target,item.payload);}
         catch(error){
           const snapshot=await firebase.getDoc(item.target);
           const saved=snapshot.data();
           if(saved?.senderId!==uid||saved.text!==item.payload.text)throw error;
         }
         panel.previous.set(item.peer,item.payload.createdAt);
         item.status='sent';
       }catch{item.status='failed';}
     }));
     if(active()&&state.modal==='event-chat-share'&&state.selectedEvent===id)render();
   }
 }finally{
   panel.sending=false;
   if(active()&&state.modal==='event-chat-share'&&state.selectedEvent===id)render();
 }
}
function directQuote(message,community=false){
 const author=message?.senderId===me()?'Você':community?
   message?.senderName||member(message?.senderId)?.name||'Pessoa':state.chatTarget?.name||'Participante';
 return message?`<button type="button" class="btn btn-soft btn-small" style="display:block;text-align:left;white-space:normal;overflow-wrap:anywhere" data-action="jump-${community?'community':'direct'}-message" data-id="${esc(message.id)}"><strong>${esc(author)}</strong><br>${esc(message.deletedAt?'Mensagem apagada':short(message.text,120))}</button>`:'';
}
const MAX_PINNED_DIRECT_THREADS=3;
function pinnedDirectThreads(snapshot){
 return snapshot.exists()?snapshot.data().threadIds:[];
}
async function togglePinnedDirectThread(){
 const uid=me(),peer=state.chatTarget?.uid;
 if(!uid||!peer||state.chatMode!=='direct')return;
 const id=threadId(uid,peer);
 if(!state.threads.some(thread=>thread.id===id))return;
 await attempt(async()=>{
   const preference=ref('members',uid,'chatPreferences','pinned');
   const pinned=await firebase.runTransaction(db,async transaction=>{
     const ids=pinnedDirectThreads(await transaction.get(preference));
     if(!ids.includes(id)&&ids.length>=MAX_PINNED_DIRECT_THREADS)return null;
     const next=ids.includes(id)?ids.filter(item=>item!==id):[...ids,id];
     transaction.set(preference,{threadIds:next});
     return next.includes(id);
   });
   if(me()===uid)showToast(pinned===null?'Você pode fixar até três conversas.':pinned?'Conversa fixada.':'Conversa desafixada.');
 },'changingPinnedDirectThread');
}
function compareDirectThreads(a,b){
 const pinned=state.pinnedDirectThreads;
 const pinA=pinned.indexOf(a.id),pinB=pinned.indexOf(b.id);
 if(pinA>=0||pinB>=0)return (pinA<0?Infinity:pinA)-(pinB<0?Infinity:pinB);
 return Number(unreadThread(b.id))-Number(unreadThread(a.id))||
   (state.latestInboundAt.get(b.id)||b.createdAt||0)-(state.latestInboundAt.get(a.id)||a.createdAt||0);
}
function closeAllSavedDirectMessages(){
 const panel=state.allSavedDirect;
 state.allSavedDirect=null;
 for(const unsubscribe of panel?.unsubs||[])unsubscribe();
}
async function openAllSavedDirectMessages(){
 const uid=me();
 if(!uid)return;
 closeAllSavedDirectMessages();
 const panel={entries:[],query:'',limit:25,loading:true,partial:false,unsubs:[]};
 state.allSavedDirect=panel;
 render();
 const threads=state.threads.flatMap(thread=>{
   const peer=thread.participants?.find(id=>id!==uid);
   return peer?[{thread,peer}]:[];
 });
 const active=()=>me()===uid&&state.allSavedDirect===panel;
 const markers=[];
 for(let offset=0;offset<threads.length&&active();offset+=8){
   await Promise.all(threads.slice(offset,offset+8).map(async({thread,peer})=>{
     try{
       const snapshot=await firebase.getDocs(col('members',uid,'privateSaved',thread.id,'messages'));
       const name=member(peer)?.name||thread.names?.[peer]||'Pessoa';
       for(const doc of snapshot.docs)markers.push({threadId:thread.id,peer,name,id:doc.id});
     }catch{panel.partial=true;}
   }));
 }
 for(let offset=0;offset<markers.length&&active();offset+=8){
   await Promise.all(markers.slice(offset,offset+8).map(async marker=>{
     try{
       const source=firebase.doc(directMessagesCol(marker.threadId),marker.id);
       const snapshot=await firebase.getDoc(source);
       const message=snapshot.data();
       if(!active()||!message||message.deletedAt)return;
       const entry={...marker,text:message.text,createdAt:message.createdAt};
       panel.entries.push(entry);
       panel.unsubs.push(firebase.onSnapshot(source,update=>{
         if(!active())return;
         const current=update.data();
         if(!current||current.deletedAt)panel.entries=panel.entries.filter(item=>item!==entry);
         else if(entry.text===current.text)return;
         else entry.text=current.text;
         render();
       },()=>{
         if(!active())return;
         panel.entries=panel.entries.filter(item=>item!==entry);
         panel.partial=true;
         render();
       }));
     }catch{panel.partial=true;}
   }));
 }
 if(!active())return;
 panel.entries.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)||a.id.localeCompare(b.id));
 panel.loading=false;
 render();
}
function renderAllSavedDirectMessages(panel){
 const term=norm(panel.query);
 const results=panel.entries.filter(entry=>!term||norm(entry.name).includes(term)||norm(entry.text).includes(term));
 return `<section class="card form-stack" style="padding:16px" aria-labelledby="all-saved-direct-title">
 <div class="toggle-row" style="flex-wrap:wrap;justify-content:space-between">
 <h2 id="all-saved-direct-title">Mensagens salvas</h2>
 <button type="button" class="btn btn-outline btn-small" data-action="close-all-saved-direct">Voltar às conversas</button>
 </div>
 <label class="sr-only" for="all-saved-direct-search">Buscar por nome ou palavra</label>
 <input id="all-saved-direct-search" type="search" class="input" value="${esc(panel.query)}" maxlength="150" placeholder="Buscar por nome ou palavra">
 ${panel.loading?'<p class="mini muted" role="status">Carregando mensagens salvas…</p>':`
 ${panel.partial?'<p class="tip" role="status">Algumas mensagens salvas não puderam ser carregadas. <button type="button" class="text-action" data-action="open-all-saved-direct">Tentar novamente</button></p>':''}
 ${!results.length&&!panel.partial?`<p class="mini muted" role="status">${term?'Nenhuma mensagem encontrada.':'Nenhuma mensagem privada salva.'}</p>`:''}
 ${results.slice(0,panel.limit).map(entry=>`<article class="card" style="padding:12px;overflow-wrap:anywhere">
 <strong>${esc(entry.name)}</strong>
 <p>${esc(short(entry.text,180))}</p><p class="mini muted">${when(entry.createdAt)}</p>
 <button type="button" class="btn btn-soft btn-small" data-action="open-all-saved-direct-message" data-id="${esc(entry.id)}" data-value="${esc(entry.peer)}" ${state.openingDirect?'disabled':''}>Ir à mensagem</button>
 </article>`).join('')}
 ${results.length>panel.limit?'<button type="button" class="btn btn-outline" data-action="more-all-saved-direct">Ver mais mensagens</button>':''}`}
 </section>`;
}
const directMessageEditWindow=15*60*1000;
function canEditDirectMessage(message,at=now()){
 return Boolean(message&&!message.deletedAt&&message.senderId===me()&&Number.isFinite(message.createdAt)&&
   message.createdAt<=at&&at<message.createdAt+directMessageEditWindow);
}
function renderMessages() {
 if(state.allSavedDirect)return renderAllSavedDirectMessages(state.allSavedDirect);
 const community=state.chatMode!=='direct';
 const global=state.chatMode==='global';
 const messages=chatMessages();
 const readingKey=community?communityReadingKey():'';
 const historyAnchor=community?(state.communityHistoryAnchor?.key===readingKey?state.communityHistoryAnchor.id:null):state.directHistoryAnchor;
 const anchor=messages.findIndex(message=>message.id===historyAnchor);
 const end=anchor<0?messages.length:Math.min(messages.length,Math.max(150,anchor+75));
 const start=Math.max(0,end-150);
 const visibleMessages=messages.slice(start,end);
 const previousLog=community?document.getElementById('chat-log'):null;
 const readingReady=state.communityReadSync?.ready!==false;
 const previousMarker=previousLog?.clientHeight&&previousLog.dataset.communityReading===readingKey&&previousLog.dataset.communityReadingReady===String(readingReady)?
   previousLog.querySelector('#community-new-messages')?.nextElementSibling?.dataset.communityMessage:null;
 const unread=community?(visibleMessages.find(message=>previousMarker&&message.id===previousMarker)||
   firstUnreadCommunityMessage(visibleMessages,readingKey)):null;
 const communitySearch=community&&state.communitySearch?.key===readingKey?state.communitySearch:null;
 const showingCommunitySaved=community&&state.communitySavedPanel===readingKey;
 const communitySaved=community?readCommunitySaved():null;
 const searching=community?communitySearch:state.chatTarget&&state.directSearch;
 const showingSaved=!community&&state.chatTarget&&state.directSavedLimit>0;
 const showingEvents=!community&&state.chatTarget&&state.directEventLimit>0;
 const showingLinks=!community&&state.chatTarget&&state.directLinksLimit>0;
 const matches=searching?(community?communitySearchResults(messages,searching.query):directSearchResults(messages,searching.query)):[];
 const title=global?'Comunidade global':community?`Comunidade de ${myLocation()}`:(state.chatTarget?.name||'Escolha uma pessoa');
 const blocked=!community&&state.blockedIds.includes(state.chatTarget?.uid);
 const activeThread=!community&&state.chatTarget?threadId(me(),state.chatTarget.uid):null;
 const originals=new Map(messages.map(message=>[message.id,message]));
 const reply=community?(state.communityReply?.key===readingKey?state.communityReply:null):state.directReply;
 const replying=blocked?null:originals.get(reply?.id);
 const savedDraft=community?null:readPrivateMessageDraft(privateMessageDraftKey());
 const draftKey=`message-form:${me()}:${community?state.chatMode:`direct:${state.chatTarget?.uid}`}`;
 const unreadOnly=state.directThreadFilter==='unread';
 const archiveOnly=state.directThreadFilter==='archived';
 const query=norm(state.directThreadSearch);
 const threads=state.threads.filter(thread=>isArchivedDirectThread(thread.id)===archiveOnly&&
   (!unreadOnly||unreadThread(thread.id))).sort(compareDirectThreads).flatMap(thread=>{
     const peer=thread.participants?.find(id=>id!==me());
     if(!peer)return [];
     const profile=member(peer);
     const name=profile?.name||thread.names?.[peer]||'Pessoa';
     return !query||norm(name).includes(query)?[{thread,peer,profile,name}]:[];
   });
 return `<div class="card chat-shell ${state.mobileChatOpen?'mobile-chat-open':''}">
 <div class="chat-list-search">
 <label class="sr-only" for="direct-thread-search">Buscar conversas pelo nome</label>
 <input class="input" style="width:100%" id="direct-thread-search" type="search" maxlength="100" autocomplete="off" placeholder="Buscar conversas pelo nome" value="${esc(state.directThreadSearch)}">
 <button type="button" class="btn btn-soft btn-small" style="margin-top:8px" data-action="open-all-saved-direct">Mensagens salvas</button>
 </div>
 <div class="chat-list"><h3 id="mobile-chat-list-title" tabindex="-1">Conversas</h3>
 <div class="toggle-row" style="flex-wrap:wrap;margin:8px 0" role="group" aria-label="Filtrar conversas privadas">
 <button class="btn ${unreadOnly||archiveOnly?'btn-outline':'btn-soft'} btn-small" data-action="filter-direct-threads" data-value="all" aria-pressed="${!unreadOnly&&!archiveOnly}">Todas</button>
 <button class="btn ${unreadOnly?'btn-soft':'btn-outline'} btn-small" data-action="filter-direct-threads" data-value="unread" aria-pressed="${unreadOnly}">Não lidas</button>
 <button class="btn ${archiveOnly?'btn-soft':'btn-outline'} btn-small" data-action="filter-direct-threads" data-value="archived" aria-pressed="${archiveOnly}">Arquivadas</button>
 </div>
 ${renderCommunityContact('global','Comunidade global','🌍')}
 ${renderCommunityContact('community','Comunidade local','📍')}
 ${query&&!threads.length?'<p class="mini muted" role="status">Nenhuma conversa encontrada neste filtro.</p>':''}
 ${!query&&archiveOnly&&!threads.length?'<p class="tip" role="status">Nenhuma conversa arquivada.</p>':''}
 ${!query&&unreadOnly&&!threads.length?'<p class="tip" role="status">Nenhuma conversa não lida.</p>':''}
 ${threads.map(({thread:t,peer:other,profile:p,name})=>{
 const isActive=!community&&state.chatTarget?.uid===other;
 const unread=unreadThread(t.id);
 return `<button class="chat-contact ${isActive?'active':''} ${unread?'chat-unread':''}" data-action="open-dm" data-id="${esc(other)}">${avatar(p||{avatar:'💬'})}<span>${state.pinnedDirectThreads.includes(t.id)?'<span aria-hidden="true">📌 </span><span class="sr-only">Fixada. </span>':''}${esc(short(name,19))}${directThreadMuted(t.id)?'<span aria-hidden="true"> 🔕</span><span class="sr-only"> Silenciada.</span>':''}</span>${unread?'<span class="unread-dot"><span class="sr-only">Não lida</span></span>':''}</button>`;
 }).join('')}
 <p class="tip" style="margin-top:25px;font-size:10px">Para começar uma nova conversa privada, encontre alguém em Explorar.</p>
 <button class="btn btn-soft btn-small" style="width:100%" data-action="tab" data-tab="explore">${icon('users')} Explorar</button></div>
 <div class="chat-panel ${community?'':'private-chat-panel'}"><div class="chat-panel-head"><div class="chat-mobile-navigation">
 <button type="button" class="circle-btn" aria-label="Voltar às conversas" id="mobile-chat-back" data-action="back-mobile-chats">‹</button>
</div>${avatar(community?{avatar:global?'🌍':'📍'}:member(state.chatTarget?.uid)||{avatar:'💬'})}<div><strong>${esc(title)}</strong><small>${global?'Para todos os membros do HobbyHub':community?'Mensagens públicas da sua cidade':'Somente participantes podem acessar esta conversa'}</small></div> ${community?`<button type="button" class="circle-btn" id="toggle-community-search" aria-label="${communitySearch?'Fechar busca':'Buscar na conversa'}" aria-expanded="${Boolean(communitySearch)}" aria-controls="chat-log" data-action="toggle-community-search">${icon('search')}</button><button type="button" class="circle-btn" id="toggle-community-saved" aria-label="${showingCommunitySaved?'Fechar mensagens salvas':'Mensagens salvas'}" aria-expanded="${showingCommunitySaved}" aria-controls="chat-log" data-action="toggle-community-saved">${icon('bookmark')}</button>`:''}${!community&&state.chatTarget?`<button type="button" class="circle-btn" aria-label="Opções da conversa" aria-expanded="${state.mobileChatOptions}" aria-controls="mobile-chat-options" data-action="toggle-mobile-chat-options">⋯</button>`:''}
 </div>
 ${!community&&state.chatTarget?`<div id="mobile-chat-options" class="chat-options ${state.mobileChatOptions?'is-open':''}" role="group" aria-label="Opções da conversa"><div class="chat-tools">
 <button class="btn btn-soft btn-small" data-action="toggle-direct-search" aria-expanded="${Boolean(searching)}">${searching?'Fechar busca':'Buscar na conversa'}</button>
 <button class="btn btn-soft btn-small" data-action="toggle-direct-links" aria-expanded="${Boolean(showingLinks)}">${showingLinks?'Fechar links':'Links compartilhados'}</button>
 <button type="button" class="btn btn-soft btn-small" data-action="toggle-shared-direct-events" aria-expanded="${Boolean(showingEvents)}">${showingEvents?'Fechar eventos':'Eventos compartilhados'}</button>
 <button class="btn btn-soft btn-small" data-action="toggle-direct-saved-panel" aria-expanded="${Boolean(showingSaved)}">${showingSaved?'Fechar salvas':'Mensagens salvas'}</button>
 </div>
 ${blockButton(state.chatTarget?.uid)}
 ${state.threads.some(thread=>thread.id===activeThread)?`<button class="btn btn-soft btn-small" data-action="toggle-pinned-direct-thread" ${state.changingPinnedDirectThread?'disabled':''}>${state.pinnedDirectThreads.includes(activeThread)?'Desafixar conversa':'Fixar conversa'}</button>`:''}
 ${state.threads.some(thread=>thread.id===activeThread)&&!isArchivedDirectThread(activeThread)&&!state.manualUnreadThreads.has(activeThread)?`<button class="btn btn-soft btn-small" data-action="mark-direct-unread" ${state.markingDirectUnread?'disabled':''}>Marcar como não lida</button>`:''}
 ${state.threads.some(thread=>thread.id===activeThread)?`<button class="btn btn-soft btn-small" data-action="toggle-direct-archive" ${state.changingDirectArchive?'disabled':''}>${isArchivedDirectThread(activeThread)?'Desarquivar conversa':'Arquivar conversa'}</button>`:''}
 ${state.threads.some(thread=>thread.id===activeThread)?`<button class="btn btn-soft btn-small" data-action="toggle-direct-mute" aria-expanded="${state.directMuteMenu===activeThread}" ${state.changingDirectMute?'disabled':''}>${directThreadMuted(activeThread)?'Reativar contador':'Silenciar conversa'}</button>`:''}
 ${activeThread&&state.directMuteMenu===activeThread&&!directThreadMuted(activeThread)?`<div class="toggle-row" style="flex-wrap:wrap" role="group" aria-label="Duração do silenciamento">
 ${[['1h','1 hora'],['8h','8 horas'],['manual','Até reativar manualmente']].map(([value,label])=>`<button type="button" class="btn btn-outline btn-small" data-action="set-direct-mute-duration" data-value="${value}" ${state.changingDirectMute?'disabled':''}>${label}</button>`).join('')}
 </div>`:''}
 </div>`:''}
 ${searching?renderChatSearch(searching.query,matches.length,community):''}
 <div id="chat-log" class="chat-log" ${community?`data-community-${communitySearch||showingCommunitySaved?'search':'reading'}="${esc(readingKey)}" data-community-reading-ready="${readingReady}"`:''}>${showingCommunitySaved?renderCommunitySavedMessages(messages,communitySaved):showingEvents?renderSharedDirectEvents(messages,state.directEventLimit):showingSaved?renderDirectSavedMessages(messages):showingLinks?renderDirectLinks(messages,state.directLinksLimit):searching?renderChatSearchMatches(matches,searching.limit,community):`
 ${!community&&start>0?`<button class="btn btn-soft" data-action="jump-direct-message" data-id="${esc(messages[Math.max(0,start-75)].id)}">Ver mensagens anteriores</button>`:''}
 ${messages.length?visibleMessages.map(m=>`${unread===m?'<div id="community-new-messages" class="community-new-messages">Novas mensagens</div>':''}<div ${community?`id="community-message-${esc(m.id)}" tabindex="-1" data-community-message="${esc(m.id)}" data-community-time="${communityMessagePosition(m).time}"`:`id="direct-message-${esc(m.id)}" tabindex="-1"`} class="chat-row ${m.senderId===me()?'mine':''}"><div class="chat-bubble">${!community&&m.deletedAt?'<em>Mensagem apagada</em>':`${m.senderId!==me()&&community?`<small>${esc(communityMessageAuthor(m))}</small>`:''}${typeof m.replyTo==='string'&&m.replyTo&&m.replyTo!==m.id?(directQuote(originals.get(m.replyTo),community)||(community?'<small>Mensagem original indisponível</small>':'')):''}${community?esc(m.text):renderDirectMessageText(m.text,m.senderId!==me())}<span style="display:block;text-align:right;font-size:9px;opacity:.65;margin-top:5px">${when(m.createdAt)}${!community&&m.editedAt?' · Editada':''}</span>${community?renderMessageMenu(m,`<button type="button" class="btn btn-soft btn-small" data-action="reply-community-message" data-id="${esc(m.id)}">Responder</button>${communitySaveButton(m.id,communitySaved.has(m.id))}${m.senderId!==me()?reportButton('communityMessage',m.id,'mensagem'):''}`):renderDirectMessageMenu(m,blocked)}`}</div></div>`).join(''):`<div class="chat-empty"><span class="emoji">${community?'👋':'💌'}</span>${community?'Dê um oi à sua comunidade!':'Comece com uma mensagem simpática.'}</div>`}
 ${!community&&end<messages.length?`<button class="btn btn-soft" data-action="jump-direct-message" data-id="${esc(messages[Math.min(messages.length-1,end+10)].id)}">Ver mensagens seguintes</button><button class="btn btn-soft" data-action="latest-direct-messages">Ir para as mais recentes</button>`:''}`}</div>
 ${community&&!communitySearch&&!showingCommunitySaved&&messages.length?`<div class="community-chat-navigation"><button type="button" class="btn btn-soft btn-small" data-action="latest-community-messages" aria-controls="chat-log">Ir para o fim ↓</button></div>`:''}
 ${replying?`<div class="chat-send" style="flex-wrap:wrap;align-items:center"><span class="mini muted">Respondendo a</span>${directQuote(replying,community)}<button type="button" class="btn btn-soft btn-small" data-action="cancel-${community?'community':'direct'}-reply">Cancelar resposta</button></div>`:''}
 ${blocked?'<div class="chat-send"><p class="tip">Você bloqueou novas mensagens nesta conversa.</p></div>':community||state.chatTarget?`<form id="message-form" data-draft="true" data-draft-key="${esc(draftKey)}" class="chat-send"><input class="input" id="message-text" name="message" value="${esc(savedDraft?.message||'')}" maxlength="1500" required placeholder="Escreva sua mensagem..."><button class="btn btn-primary" type="submit" aria-label="Enviar mensagem" ${state.busy?'disabled':''}>${icon('send')}</button></form>`:`<div class="chat-send"><button class="btn btn-soft" data-action="tab" data-tab="explore">Encontrar pessoas</button></div>`}</div></div>`;
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
 const chosen=state.welcomeHobby,added=chosen&&state.profile?.hobbies?.some(hobby=>norm(hobby)===norm(chosen));
 return modalWrap('Boas-vindas ao HobbyHub',`<p>Escolha um hobby para encontrar comunidades. Você também pode adicioná-lo ao seu perfil.</p>
 <label class="field">Explorar por hobby<select class="select" id="welcome-hobby"><option value="">Todos os hobbies</option>${hobbies.map(hobby=>`<option value="${esc(hobby)}" ${state.welcomeHobby===hobby?'selected':''}>${esc(hobby)}</option>`).join('')}</select></label>
 ${chosen?added?'<p class="mini muted" role="status">Este hobby está no seu perfil.</p>':`<div style="margin-top:10px"><button type="button" class="btn btn-outline btn-small" data-action="save-welcome-hobby" ${state.busy?'disabled':''}>Adicionar hobby ao perfil</button></div>`:''}
 <div class="form-stack" style="margin:14px 0">${suggestions.length?suggestions.map(({group,local,shared})=>`<article class="card" style="padding:12px"><button type="button" class="text-action" data-action="view-welcome-group" data-id="${esc(group.id)}">${esc(group.name)}</button><p class="mini muted" style="margin:4px 0">${esc(group.hobby)} · ${esc(group.location||'Online')}${local?' · Da sua cidade':''}${shared?' · Hobby em comum':''}</p></article>`).join(''):'<p class="tip">Ainda não há sugestões com esse filtro.</p>'}</div>
 <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="btn btn-primary" data-action="welcome-discover-groups">Ver comunidades</button><button type="button" class="btn btn-ghost" data-action="tab" data-tab="home">Pular e ir ao feed</button></div>`);
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
 const editor=state.commentEditor?.id===comment.id?state.commentEditor:null;
 const saved=state.savedComments.has(savedCommentKey(state.selectedPost,comment.id));
 return `<div class="comment" id="post-comment-${id}" tabindex="-1">${avatar({avatar:member(comment.userId)?.avatar||'💬'})}
 <div class="comment-body"><strong>${esc(member(comment.userId)?.name||comment.userName||'Pessoa')}</strong>
 ${own&&editor?.editing?`<form id="edit-comment-form" data-draft="true" data-draft-key="edit-comment:${esc(state.selectedPost)}:${id}" class="form-stack">
 <label class="field">Texto do comentário<textarea id="edit-comment-text" class="textarea" name="text" required maxlength="800">${esc(comment.text)}</textarea></label>
 <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="text-action" data-action="close-comment-options">Cancelar</button>
 <button type="submit" class="btn btn-primary btn-small" ${state.busy?'disabled':''}>Salvar alterações</button></div></form>`:`<p>${esc(comment.text)}</p>`}
 <small>${when(comment.createdAt)}${comment.editedAt?' · Editado':''}</small>
 ${!comment.parentId?` <button class="text-action" data-action="reply-to-comment" data-id="${id}">Responder</button>`:''}
 ${belongsToGroup&&!own?` <button class="text-action" data-action="report-group-comment" data-id="${id}">Denunciar comentário</button>`:''}
 ${editor&&!editor.editing?`<div class="toggle-row" style="flex-wrap:wrap">
 <button class="text-action" data-action="toggle-saved-comment" data-id="${id}" ${state.busy?'disabled':''}>${saved?'Remover dos salvos':'Salvar comentário'}</button>
 <button class="text-action" data-action="copy-comment-link" data-id="${id}">Copiar link do comentário</button>
 ${own?`<button class="text-action" data-action="edit-comment" data-id="${id}">Editar comentário</button>`:''}
 ${own?`<button class="text-action" data-action="${canModerate?'moderate-comment':'delete-comment'}" data-id="${id}">${canModerate?'Remover comentário com motivo':'Excluir comentário'}</button>`:''}</div>`:''}</div>
 ${me()?`<button class="post-action" data-action="comment-options" data-id="${id}" aria-label="Opções do comentário" aria-expanded="${Boolean(editor)}">⋯</button>`:''}
 ${!own&&canModerate?`<button data-action="moderate-comment" data-id="${id}" aria-label="Remover comentário com motivo">${icon('trash')}</button>`:''}
 </div>`;
}
function renderCommentThreads(belongsToGroup,canModerate){
 const byParent=new Map(),roots=new Set(state.comments.filter(item=>!item.parentId).map(item=>item.id));
 for(const comment of state.comments){
   if(!comment.parentId)continue;
   if(!byParent.has(comment.parentId))byParent.set(comment.parentId,[]);
   byParent.get(comment.parentId).push(comment);
 }
 const replies=parent=>{
   const entries=byParent.get(parent),canCollapse=entries.length>=3;
   const expanded=!canCollapse||state.expandedCommentReplies.has(parent);
   const regionId='comment-replies-'+esc(parent);
   return `${canCollapse?`<button class="text-action" data-action="toggle-comment-replies" data-id="${esc(parent)}" aria-controls="${regionId}" aria-expanded="${expanded}">${expanded?'Recolher respostas':`Ver ${entries.length} respostas`}</button>`:''}
   <div id="${regionId}" style="margin-left:16px;border-left:1px solid var(--line);padding-left:10px" aria-label="Respostas" ${expanded?'':'hidden'}>
   ${expanded?entries.map(item=>renderPostComment(item,belongsToGroup,canModerate)).join(''):''}</div>`;
 };
 return state.comments.map(comment=>{
   if(!comment.parentId)return renderPostComment(comment,belongsToGroup,canModerate)+(byParent.has(comment.id)?replies(comment.id):'');
   if(!roots.has(comment.parentId)&&byParent.get(comment.parentId)[0]===comment)return '<p class="tip">Comentário original indisponível.</p>'+replies(comment.parentId);
   return '';
 }).join('');
}
async function loadMyCommentActivity(){
 const uid=me(),activity=state.myCommentActivity;
 if(!uid||!activity||state.modal!=='my-comment-activity'||activity.loading||!activity.more)return;
 activity.loading=true;activity.error='';render();
 const filtered=activity.type!=='all'||Boolean(activity.groupId);
 const previousMatches=filtered?matchingMyComments(activity).length:0;
 try{
   for(let page=0;page<5&&activity.more;page++){
     const filters=[firebase.where('userId','==',uid),firebase.orderBy('createdAt','desc'),firebase.limit(30)];
     if(activity.last)filters.push(firebase.startAfter(activity.last));
     const result=await firebase.getDocs(firebase.query(firebase.collectionGroup(db,'comments'),...filters));
     if(me()!==uid||state.myCommentActivity!==activity||state.modal!=='my-comment-activity')return;
     for(const doc of result.docs){
       const post=doc.ref.parent.parent;
       if(post?.path!==[...BASE,'posts',post?.id].join('/'))continue;
       activity.entries.push({...doc.data(),postId:post.id,commentId:doc.id,key:doc.ref.path});
     }
     activity.last=result.docs.at(-1)||activity.last;
     activity.more=result.docs.length===30;
     if(!filtered||matchingMyComments(activity).length>previousMatches)break;
   }
 }catch(error){activity.error=friendlyError(error);}
 finally{
   activity.loading=false;
   if(state.myCommentActivity===activity&&state.modal==='my-comment-activity')render();
 }
}
function matchingMyComments(activity,posts=new Map(state.posts.map(post=>[post.id,post]))){
 return activity?.entries.filter(item=>{
   const post=posts.get(item.postId);
   return post&&(!activity.groupId||post.groupId===activity.groupId)&&
     (activity.type==='all'||(activity.type==='replies'?Boolean(item.parentId):!item.parentId));
 })||[];
}
async function filterMyComments(type,groupId){
 const activity=state.myCommentActivity;
 if(state.modal!=='my-comment-activity'||!activity||activity.loading)return;
 activity.type=type;activity.groupId=groupId;
 if(activity.more&&!matchingMyComments(activity).length)await loadMyCommentActivity();
 else render();
}
function renderMyCommentActivity(){
 const activity=state.myCommentActivity,posts=new Map(state.posts.map(post=>[post.id,post]));
 const entries=matchingMyComments(activity,posts);
 const communities=[...state.groups].sort((a,b)=>String(a.name).localeCompare(String(b.name),'pt-BR'));
 const filtered=activity&&(activity.type!=='all'||activity.groupId);
 return modalWrap('Meus comentários',`<div class="form-stack">
 <div class="filters" role="group" aria-label="Tipo de comentário">${[['all','Todos'],['comments','Comentários'],['replies','Respostas']].map(([type,label])=>
   `<button class="filter ${activity?.type===type?'active':''}" data-action="my-comment-type" data-value="${type}" aria-pressed="${activity?.type===type}" ${activity?.loading?'disabled':''}>${label}</button>`).join('')}</div>
 <label class="field">Comunidade<select class="select" id="my-comment-community" ${activity?.loading?'disabled':''}><option value="">Todas as comunidades</option>
 ${communities.map(group=>`<option value="${esc(group.id)}" ${activity?.groupId===group.id?'selected':''}>${esc(group.name)}</option>`).join('')}</select></label>
 ${entries.map(item=>`<article class="card form-stack" style="padding:14px">
 <div class="toggle-row" style="flex-wrap:wrap"><strong>${item.parentId?'Resposta':'Comentário'}</strong><small>${when(item.createdAt)}</small></div>
 <p class="post-copy" style="margin:0">${esc(short(item.text,240))}</p>
 <small>Em uma publicação de ${esc(authorName(posts.get(item.postId)))}</small>
 <button class="text-action" data-action="open-my-comment" data-id="${esc(item.key)}">Abrir comentário</button></article>`).join('')}
 ${activity?.error?`<p class="tip" role="status">${esc(activity.error)}</p>`:activity?.loading?'<p class="tip" role="status">Carregando comentários…</p>':!entries.length?
   `<p class="tip">${filtered?(activity.more?'Nenhum resultado nas páginas carregadas.':'Nenhum comentário com esses filtros.'):'Nenhum comentário para exibir.'}</p>`:''}
 ${activity?.more&&!activity.loading?`<button class="btn btn-outline btn-small" data-action="load-my-comments">${activity.error?'Tentar novamente':'Carregar mais'}</button>`:''}</div>`);
}
function renderModal() {
 if(state.modal==='saved-event-search-news')return renderSavedEventSearchNews();
 if(state.modal==='saved-event-searches')return renderSavedEventSearches();
 if(state.modal==='event-hobby-alerts')return renderEventHobbyAlerts();
 if(state.modal==='event-chat-share')return renderEventChatShare();
 if(state.modal==='delete-direct-message'){
   const message=state.directMessages.find(item=>item.id===state.directMessageEditor?.id);
   if(!canEditDirectMessage(message))return modalWrap('Apagar para todos','<p>Esta mensagem já foi apagada ou o prazo terminou.</p>');
   return modalWrap('Apagar para todos',`<form id="delete-direct-message-form" class="form-stack">
   <p>O texto será apagado da conversa para os dois participantes.</p>
   <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="btn btn-outline" data-action="close">Cancelar</button>
   <button type="submit" class="btn btn-primary" ${state.busy?'disabled':''}>Apagar para todos</button></div>
   </form>`);
 }

 if(state.modal==='edit-direct-message'){
   const editor=state.directMessageEditor;
   const message=state.directMessages.find(item=>item.id===editor?.id);
   if(!canEditDirectMessage(message))return modalWrap('Editar mensagem','<p>O prazo para editar esta mensagem terminou.</p>');
   return modalWrap('Editar mensagem',`<form id="edit-direct-message-form" data-draft="true" class="form-stack">
   <label class="field">Mensagem<textarea class="textarea" name="text" rows="4" maxlength="1500" required>${esc(editor.text)}</textarea></label>
   <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="btn btn-outline" data-action="close">Cancelar</button>
   <button type="submit" class="btn btn-primary" ${state.busy?'disabled':''}>Salvar edição</button></div>
   </form>`);
 }

 if(state.modal==='my-comment-activity')return renderMyCommentActivity();
 if(state.modal==='edit-saved-note'){
   const id=state.savedNotePostId;
   if(!state.savedIds.includes(id))return modalWrap('Nota privada','<p>Esta publicação não está mais em Salvos.</p>');
   const note=state.savedNotes.get(id)||'';
   return modalWrap('Nota privada',`<form id="saved-note-form" data-draft="true" data-draft-key="saved-note:${esc(id)}" class="form-stack">
   <label class="field">Sua nota<textarea class="textarea" name="note" rows="4" maxlength="500">${esc(note)}</textarea></label>
   <p class="tip">Só você pode ver esta nota.${note?' Para apagar, deixe o campo vazio e salve.':''}</p>
   <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="btn btn-outline" data-action="close">Cancelar</button>
   <button type="submit" class="btn btn-primary" ${state.busy?'disabled':''}>Salvar nota</button></div></form>`);
 }
 if(state.modal==='bulk-saved-collection')return modalWrap('Adicionar à coleção',`<div class="form-stack">
 <p>${state.savedSelection?.size||0} selecionadas</p>
 ${state.savedCollections.map(item=>`<button class="btn btn-outline" data-action="add-selected-to-collection" data-id="${esc(item.id)}" ${state.busy?'disabled':''}>${esc(item.name)}</button>`).join('')}
 ${state.savedCollections.length?'':'<p>Crie uma coleção para organizar as publicações selecionadas.</p><button class="btn btn-primary" data-action="create-saved-collection">Nova coleção</button>'}
 </div>`);
 if(state.modal==='rename-saved-collection'||state.modal==='delete-saved-collection'){
   const collection=state.savedCollections.find(item=>item.id===state.editingSavedCollectionId);
   if(!collection)return modalWrap('Coleção indisponível','<p>Esta coleção não está mais disponível.</p>');
   if(state.modal==='rename-saved-collection')return modalWrap('Renomear coleção',`<form id="rename-saved-collection-form" data-draft="true" class="form-stack">
   <label class="field">Nome da coleção<input class="input" name="name" required maxlength="60" value="${esc(collection.name)}"></label>
   <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="btn btn-outline" data-action="close">Cancelar</button>
   <button type="submit" class="btn btn-primary" ${state.busy?'disabled':''}>Salvar nome</button></div></form>`);
   return modalWrap('Excluir coleção',`<div class="form-stack">
   <p>Excluir <strong>${esc(collection.name)}</strong>? As publicações continuam em Todos os salvos e nas outras coleções.</p>
   <div class="toggle-row" style="flex-wrap:wrap"><button class="btn btn-outline" data-action="close">Cancelar</button>
   <button class="btn btn-primary" data-action="confirm-delete-saved-collection" data-id="${esc(collection.id)}" ${state.busy?'disabled':''}>Excluir coleção</button></div></div>`);
 }
 if(state.modal==='create-saved-collection')return modalWrap('Nova coleção',`<form id="saved-collection-form" data-draft="true" class="form-stack">
 <label class="field">Nome da coleção<input class="input" name="name" required maxlength="60"></label>
 <button type="submit" class="btn btn-primary" ${state.busy?'disabled':''}>Criar coleção</button></form>`);
 if(state.modal==='manage-saved-collections'){
   const post=state.posts.find(item=>item.id===state.collectionPostId&&state.savedIds.includes(item.id));
   const selected=state.savedMemberships.get(state.collectionPostId)||[];
   return modalWrap('Organizar em coleções',post?`<div class="form-stack"><p>${esc(short(post.content,120))}</p>
   ${state.savedCollections.map(item=>`<button class="btn btn-outline" data-action="toggle-saved-collection" data-id="${esc(item.id)}"
    aria-pressed="${selected.includes(item.id)}" ${state.busy?'disabled':''}>${esc(item.name)}${selected.includes(item.id)?' ✓':''}</button>`).join('')}
   ${state.savedCollections.length?'':'<p>Crie sua primeira coleção para organizar esta publicação.</p>'}
   <button class="text-action" data-action="create-saved-collection">Nova coleção</button></div>`:'<p>Esta publicação não está disponível em Salvos.</p>');
 }
 if(state.modal==='post-options'||state.modal==='edit-post'){
   const post=state.posts.find(item=>item.id===state.postEditor?.id);
   if(!post)return modalWrap('Publicação indisponível','<p>Esta publicação não está mais disponível.</p>');
   if(state.modal==='post-options')return modalWrap('Opções da publicação',`<div class="form-stack">
   <button class="btn btn-outline" data-action="toggle-followed-post" data-id="${esc(post.id)}" ${state.busy?'disabled':''}>${state.followedPosts.has(post.id)?'Parar de acompanhar':'Acompanhar publicação'}</button>
   ${post.userId===me()?`<button class="btn btn-primary" data-action="edit-post" data-id="${esc(post.id)}">Editar publicação</button>
   <button class="btn btn-outline" data-action="delete-post" data-id="${esc(post.id)}">Excluir publicação</button>`:''}
   <button class="text-action" data-action="return-to-post">Voltar</button></div>`);
   if(post.userId!==me())return modalWrap('Publicação indisponível','<p>Esta publicação não está mais disponível.</p>');
   return modalWrap('Editar publicação',`<form id="edit-post-form" data-draft="true" data-draft-key="edit-post:${esc(post.id)}" class="form-stack">
   <label class="field">Texto da publicação<textarea class="textarea" id="edit-post-content" name="content" maxlength="2000">${esc(post.content)}</textarea></label>
   ${sharedMediaFields(post)}
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
   <div class="toggle-row" style="margin-top:14px;flex-wrap:wrap"><button class="btn btn-outline btn-small" data-action="copy-event-link" data-id="${esc(event.id)}">Copiar link do evento</button>${!event.cancelled?'<button type="button" class="btn btn-outline btn-small" data-action="share-event-in-chat">Compartilhar no chat</button>':''}${eventRecapButton(event)}${eventCalendarButton(event)}${googleCalendarButton(event)}</div>
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
     ${eventFormatFields(eventFormat(event),eventFormat(event)==='in-person'?event.location:'',state.eventRoom?.id===event.id?state.eventRoom.url:'',event.timeZone,event.city)}
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
 <button class="btn btn-primary" data-action="continue-post-draft">${state.composingIntroduction?'Continuar apresentação':'Continuar escrevendo'}</button>
 <button class="btn btn-outline" data-action="discard-post-draft">Descartar rascunho</button>
 </div>`);
 return modalWrap(title,`<form id="post-form" data-draft="true" ${key?`data-draft-key="${esc(key)}"`:''} class="form-stack"><div class="toggle-row">${avatar(state.profile)}<div><strong style="font-size:13px">${esc(myName())}</strong><div class="muted mini">Compartilhando com a comunidade</div></div></div>
 ${state.composingGroup?`<span class="pill">${icon('users')} ${esc(state.groups.find(g=>g.id===state.composingGroup)?.name||'Comunidade')}</span>`:''}
 ${recap?'<p class="tip">Conte como foi o encontro, compartilhe dicas ou sugira uma próxima edição.</p>':''}
 ${state.composingIntroduction?'<ul class="mini muted" id="group-introduction-prompts"><li>O que você gosta de fazer?</li><li>O que gostaria de aprender com o grupo?</li></ul>':''}
 <div class="field"><label for="post-content">${state.composingIntroduction?'Como você quer se apresentar?':'O que você gostaria de compartilhar?'}</label><textarea id="post-content" class="textarea" name="content" maxlength="2000" ${state.composingIntroduction?'aria-describedby="group-introduction-prompts"':''} placeholder="${state.composingIntroduction?'Escreva sua apresentação':'Conte sua experiência, uma conquista, uma dúvida ou algo que fez você feliz...'}">${recap?esc(recap.title)+'\n\n':''}</textarea></div>
 ${sharedMediaFields()}
 <p class="mini muted">Inclua texto, uma foto ou um vídeo. Use links diretos para os arquivos.</p>
 <div class="field-grid"><div class="field"><label>Seu interesse</label>${topicSelect(state.composingGroup?state.groups.find(g=>g.id===state.composingGroup)?.hobby:(state.topic==='Todos'?'Arte':state.topic))}</div><div class="field"><label>Formato</label><select class="select" name="format"><option value="text">Post simples</option><option value="highlight">Post em destaque</option></select></div></div>
 <div class="tip">A publicação pode ser vista por outras pessoas cadastradas. Não compartilhe dados pessoais sensíveis.</div>
 ${key?'<p class="mini muted">Seu rascunho é salvo neste aparelho.</p>':''}
 <div class="form-actions"><button class="btn btn-ghost" type="button" data-action="close">Cancelar</button><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>${icon('send')} Publicar</button></div></form>`);
 }
 if(state.modal==='all-weekly-questions'){
   const filter=state.weeklyAnswerFilter||'all',result=state.weeklyAnswers;
   const entries=myActiveWeeklyQuestions();
   let content=renderWeeklyQuestionCards(entries,true)||'<p class="tip">Seus grupos ainda não têm perguntas em destaque.</p>';
   if(filter!=='all'){
     if(result?.error)content='<p class="tip" role="status">Não foi possível verificar suas respostas.</p><button type="button" class="text-action" data-action="retry-weekly-answers">Tentar novamente</button>';
     else if(!result?.unanswered)content='<p class="tip" role="status">Verificando suas respostas…</p>';
     else{
       const unanswered=filter==='unanswered';
       const matches=entries.filter(({post})=>result.unanswered.has(post.id)===unanswered);
       content=renderWeeklyQuestionCards(matches,true)||`<p class="tip" role="status">${unanswered?'Nenhuma pergunta por responder.':'Você ainda não respondeu às perguntas em destaque.'}</p>`;
     }
   }
   return modalWrap('Perguntas da semana',`<div class="form-stack">
   <div class="filters" role="group" aria-label="Filtrar perguntas por resposta">${[['all','Todas'],['unanswered','Ainda não respondi'],['answered','Já respondi']].map(([value,label])=>
   `<button type="button" class="filter ${filter===value?'active':''}" data-action="set-weekly-answer-filter" data-value="${value}" aria-pressed="${filter===value}">${label}</button>`).join('')}</div>
   ${content}</div>`);
 }
 if(state.modal==='discard-local-post-draft')return modalWrap('Descartar rascunho?',`<div class="form-stack"><p>O texto guardado neste aparelho será apagado.</p><div class="form-actions"><button type="button" class="btn btn-ghost" data-action="close">Cancelar</button><button type="button" class="btn btn-primary" data-action="confirm-discard-local-post-draft">Descartar rascunho</button></div></div>`);
 if(state.modal==='weekly-question-history')return renderWeeklyQuestionHistory();
 if(state.modal==='group-detail'||state.modal==='group-preview'){
 const group=state.groups.find(g=>g.id===state.selectedGroup);
 if(!group)return modalWrap('Comunidade indisponível','<p>Esta comunidade não está mais disponível.</p>');
 const joined=(group.members||[]).includes(me());
 if(state.modal==='group-preview'&&!joined)return renderGroupPreview(group);
 const welcoming=state.invitedGroupId===group.id;
 const firstSteps=joined&&(welcoming||state.groupFirstStepsId===group.id);
 const introductionDraft=joined&&readPostDraft(introductionDraftKey(group.id));
 const groupPosts=state.posts.filter(p=>p.groupId===group.id);
 const introductions=joined?groupPosts.filter(post=>post.groupIntroduction===true&&!state.blockedIds.includes(post.userId)):[];
 const pinned=groupPosts.find(p=>p.id===group.pinnedPostId);
 const weeklyQuestion=groupPosts.find(post=>post.id===group.weeklyQuestionPostId&&!state.blockedIds.includes(post.userId));
 const canManage=canManageGroup(group);
 const posts=groupPosts.filter(p=>p.id!==pinned?.id).slice(0,15);
 const events=state.events.filter(event=>event.groupId===group.id&&event.date>=today());
 const renderGroupPost=(post,isPinned=false)=>`<article class="card" style="padding:13px;margin-bottom:9px">${isPinned?'<p class="eyebrow">Publicação fixada</p>':''}
 ${post.groupIntroduction===true?'<p class="eyebrow">Apresentação</p>':''}
 <strong class="mini">${esc(authorName(post))}</strong> ${editedPostLabel(post)}${post.content?`<p class="mini" style="margin:8px 0">${esc(short(post.content,280))}</p>`:''}
 ${renderSharedMedia(post,'na publicação')}
 ${recapEventButton(post)}
 ${groupWelcomeControls(post)}
 ${canManage&&post.id!==group.weeklyQuestionPostId?`<button type="button" class="text-action" data-action="set-weekly-question" data-id="${esc(post.id)}">Destacar como pergunta da semana</button>`:''}
 <div class="toggle-row" style="flex-wrap:wrap"><button class="btn btn-soft btn-small" data-action="comments" data-id="${esc(post.id)}">${icon('chat')} Responder</button>${postOptionsButton(post)}${joined&&post.userId!==me()?`<button class="text-action" data-action="report-post" data-id="${esc(post.id)}">Denunciar publicação</button>`:''}${canManageGroup(group)?`<button class="btn btn-outline btn-small" data-action="${isPinned?'unpin-group-post':'pin-group-post'}" data-id="${esc(post.id)}">${isPinned?'Desafixar':'Fixar no grupo'}</button><button class="text-action" data-action="moderate-post" data-id="${esc(post.id)}">Remover publicação</button>`:''}</div></article>`;
 return modalWrap(group.name,`<div class="cover ${topicColor(group.hobby)}" style="height:126px"><span>${emoji(group.hobby)}</span></div>
 <p class="eyebrow" style="margin:15px 0 8px">${esc(group.hobby)} · ${esc(group.location||'Online')}</p><p class="muted" style="font-size:13px">${esc(group.description||'Encontre pessoas que amam esse hobby.')}</p>
 ${firstSteps?`<section class="card" style="padding:16px;margin:14px 0"><h3>Primeiros passos no grupo</h3>
 <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="btn btn-primary btn-small" data-action="introduce-group" data-id="${esc(group.id)}">${introductionDraft?'Continuar apresentação':'Apresentar-me'}</button>
 <button type="button" class="btn btn-outline btn-small" data-action="browse-group-conversations" data-id="${esc(group.id)}">Ver as conversas</button>
 ${pinned&&welcoming?`<button type="button" class="text-action" data-action="comments" data-id="${esc(pinned.id)}">Responder à publicação fixada</button>`:''}</div></section>`:''}
 ${introductionDraft&&!firstSteps?`<div style="margin:12px 0"><button type="button" class="btn btn-outline btn-small" data-action="introduce-group" data-id="${esc(group.id)}">Continuar apresentação</button></div>`:''}
 ${welcoming&&!joined?`<section class="card" style="padding:16px;margin:14px 0"><h3>Participe desta comunidade</h3>
 <p class="mini muted">Entre para publicar, conversar sobre o hobby e conhecer quem já participa.</p>
 <button class="btn btn-primary btn-small" data-action="join-group" data-id="${esc(group.id)}">Participar</button></section>`:''}
 <div class="toggle-row" style="margin:18px 0;flex-wrap:wrap"><span class="pill">${icon('users')} ${(group.members||[]).length} membros</span>${joined||!welcoming?`<button class="btn btn-small ${joined?'btn-outline':'btn-primary'}" data-action="join-group" data-id="${esc(group.id)}">${joined?'Sair do grupo':'+ Participar'}</button>`:''}<button class="btn btn-outline btn-small" data-action="copy-group-invite" data-id="${esc(group.id)}">Copiar convite</button>${joined?`<button class="btn btn-soft btn-small" data-action="group-post" data-id="${esc(group.id)}">${icon('plus')} Publicar</button>`:''}</div>
 ${joined&&state.savedDiscoveryGroupIds.has(group.id)?saveDiscoveryGroupButton(group):''}
 ${pinned?renderGroupPost(pinned,true):''}
 ${joined?renderCommunityMute(group.id):''}
 ${renderGroupModeration(group)}
 ${joined?`<div class="section-head"><h2>Enquetes</h2><button class="text-action" data-action="group-polls" data-id="${esc(group.id)}">Ver enquetes</button></div>`:''}
 <div class="section-head"><h2>Próximos eventos</h2>${joined?`<button class="text-action" data-action="group-event" data-id="${esc(group.id)}">${icon('plus')} Criar evento</button>`:''}</div>
 ${events.length?events.map(event=>eventCard(event,true)).join(''):'<p class="tip">Nenhum encontro marcado ainda.</p>'}
 ${joined?`<details class="card" data-group-introductions="${esc(group.id)}" style="padding:14px;margin:16px 0" ${state.openGroupIntroductions===group.id?'open':''}><summary style="cursor:pointer;font-weight:800">Apresentações (${introductions.length})</summary>
 <div class="form-stack" style="margin-top:12px">${introductions.length?introductions.map(post=>`<article class="card" style="padding:12px">
 <strong>${esc(authorName(post))}</strong>
 <p class="post-copy">${esc(short(post.content?.trim()||'Apresentação com foto ou vídeo',200))}</p>
 <button type="button" class="text-action" data-action="comments" data-id="${esc(post.id)}" aria-label="Abrir apresentação de ${esc(authorName(post))}">Abrir apresentação</button>
 ${groupWelcomeControls(post)}
 </article>`).join(''):'<p class="mini muted">Ainda não há apresentações neste grupo.</p>'}</div></details>`:''}
 ${weeklyQuestion?`<section class="card form-stack" aria-label="Pergunta da semana" style="padding:14px;margin:16px 0">
 <h2 style="margin:0;font-size:16px">Pergunta da semana</h2>
 <p class="post-copy">${esc(short(weeklyQuestion.content?.trim()||'Abra a publicação para ver a pergunta.',240))}</p>
 <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="btn btn-primary btn-small" data-action="comments" data-id="${esc(weeklyQuestion.id)}">Abrir conversa</button>
 ${canManage?`<button type="button" class="text-action" data-action="clear-weekly-question" data-id="${esc(weeklyQuestion.id)}">Retirar destaque</button>`:''}</div></section>`:''}
 ${joined||canManage?`<div style="margin:12px 0"><button type="button" class="text-action" data-action="open-weekly-question-history" data-id="${esc(group.id)}">Histórico de perguntas da semana</button></div>`:''}
 <div class="section-head"><h2 id="group-conversations" tabindex="-1">Conversas do grupo</h2><span class="pill">${posts.length} posts recentes</span></div>
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
 ${eventFormatFields(template?eventFormat(template):'in-person',template&&eventFormat(template)==='in-person'?template.location:'','',template?.timeZone,template?.city)}
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
 ${sharedMediaFields(p)}
 <div class="form-actions"><button class="btn btn-ghost" type="button" data-action="close">Cancelar</button><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>Salvar alterações</button></div></form>`);
 }
 if(state.modal==='comments'){
 const post=state.posts.find(p=>p.id===state.selectedPost);
 if(!post)return modalWrap('Publicação indisponível','<p>Esta publicação não está disponível no momento.</p>');
 const canModerate=post?.groupId&&canManageGroup(state.groups.find(group=>group.id===post.groupId));
 const belongsToGroup=state.groups.find(group=>group.id===post.groupId)?.members?.includes(me());
 const parent=state.comments.find(item=>item.id===state.commentReplyId&&!item.parentId);
 return modalWrap('Conversas sobre a publicação',`<div class="card" style="padding:15px;margin-bottom:19px"><div class="toggle-row"><strong style="font-size:12px">${esc(authorName(post))}</strong>${editedPostLabel(post)}${postOptionsButton(post)}</div><p class="post-copy" style="margin:8px 0 0">${esc(post.content)}</p>${renderSharedMedia(post,'na publicação')}${recapEventButton(post)}${groupWelcomeControls(post)}</div>
 <div class="comment-list">${state.comments.length?renderCommentThreads(belongsToGroup,canModerate):'<p class="tip">Ainda não há comentários. Comece a conversa!</p>'}</div>
 <form id="comment-form" data-draft="true" data-draft-key="${esc(`comment:${me()}:${state.selectedPost}:${state.commentReplyId||''}`)}" class="form-stack">
 ${state.commentReplyId?`<div class="toggle-row" style="flex-wrap:wrap"><strong>${parent?`Respondendo a ${esc(member(parent.userId)?.name||parent.userName||'Pessoa')}`:'Comentário original indisponível'}</strong>
 <button class="text-action" type="button" data-action="cancel-comment-reply" ${state.busy?'disabled':''}>Cancelar resposta</button></div>`:''}
 <label class="field">${parent?'Sua resposta':'Seu comentário'}<textarea id="comment-text" class="textarea" style="min-height:85px" name="text" required maxlength="800" placeholder="Escreva um comentário acolhedor..."></textarea></label>
 <button class="btn btn-primary" type="submit" ${state.busy||(state.commentReplyId&&!parent)?'disabled':''}>${icon('send')} ${parent?'Enviar resposta':'Enviar comentário'}</button></form>`);
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
function privateMessageDraftKey(peer=state.chatTarget?.uid){
 const uid=me();
 return uid&&peer?'hobbyhub-dm-draft:'+encodeURIComponent(uid)+':'+encodeURIComponent(peer):'';
}
function readPrivateMessageDraft(key){
 if(!key)return null;
 try{
   const draft=JSON.parse(localStorage.getItem(key)||'null');
   if(!draft)return null;
   const message=typeof draft.message==='string'?draft.message.slice(0,1500):'';
   const replyTo=typeof draft.replyTo==='string'?draft.replyTo:'';
   return {message,replyTo};
 }catch{return null;}
}
function savePrivateMessageDraft(key,message,replyTo){
 if(!key)return;
 try{
   if(message||replyTo)localStorage.setItem(key,JSON.stringify({message,replyTo}));
   else localStorage.removeItem(key);
 }catch{}
}
function saveCurrentPrivateMessageDraft(message=document.getElementById('message-text')?.value){
 if(state.chatMode!=='direct')return;
 const key=privateMessageDraftKey();
 savePrivateMessageDraft(key,message??readPrivateMessageDraft(key)?.message??'',state.directReply?.id||'');
}
function postDraftPrefix(uid){
 return 'hobbyhub-post-draft:'+encodeURIComponent(uid)+':';
}
function introductionDraftKey(groupId){
 const uid=me();
 return uid&&groupId?postDraftPrefix(uid)+'intro:'+encodeURIComponent(groupId):'';
}
function postDraftKey(){
 const uid=me();
 if(!uid||state.composingRecapId)return '';
 if(state.composingIntroduction)return introductionDraftKey(state.composingGroup);
 const scope=state.composingGroup?'group:'+encodeURIComponent(state.composingGroup):'feed';
 return postDraftPrefix(uid)+scope;
}
function postDraftMedia(value){
 return Object.fromEntries(Object.entries(sharedMediaFieldsLimits).map(([name,limit])=>[name,String(value(name)||'').slice(0,limit)]));
}
function readPostDraft(key){
 if(!key)return null;
 try{
   const draft=JSON.parse(localStorage.getItem(key)||'null');
   if(typeof draft?.content!=='string')return null;
   const media=postDraftMedia(name=>draft[name]);
   if(!draft.content.trim()&&!Object.values(media).some(Boolean))return null;
   const updatedAt=Number.isFinite(draft.updatedAt)&&draft.updatedAt>0&&draft.updatedAt<=8640000000000000?draft.updatedAt:null;
   return {content:draft.content.slice(0,2000),hobby:typeof draft.hobby==='string'?draft.hobby:'',format:draft.format==='highlight'?'highlight':'text',...media,updatedAt};
 }catch{return null;}
}
function removePostDraft(key){
 try{localStorage.removeItem(key);}catch{}
}
function savePostDraft(form){
 const key=form.dataset.draftKey;
 if(state.modal!=='compose'||!key||key!==postDraftKey())return;
 const {content,hobby,format}=form.elements;
 const media=postDraftMedia(name=>form.elements[name]?.value);
 try{
   if(!content.value.trim()&&!Object.values(media).some(Boolean)){
     removePostDraft(key);return;
   }
   const {updatedAt,...previous}=readPostDraft(key)||{};
   const next={content:content.value,hobby:hobby.value,format:format.value,...media};
   if(JSON.stringify(previous)!==JSON.stringify(next))localStorage.setItem(key,JSON.stringify({...next,updatedAt:now()}));
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
 if(event.isComposing||event.defaultPrevented)return;
 if(!state.modal){
   if(event.key==='Escape'&&state.tab==='messages'&&state.chatMode!=='direct'&&(state.communitySearch?.key===communityReadingKey()||state.communitySavedPanel===communityReadingKey())){
     event.preventDefault();
     const button=state.communitySavedPanel?'toggle-community-saved':'toggle-community-search';
     state.communitySearch=null;state.communitySavedPanel=null;render();document.getElementById(button)?.focus();return;
   }
   if(event.key==='Escape'&&state.tab==='messages'&&(state.directMessageMenu||state.mobileChatOptions)){
     event.preventDefault();
     const target=state.directMessageMenu?'toggle-direct-message-menu':'toggle-mobile-chat-options';
     const id=state.directMessageMenu?.id;
     state.directMessageMenu=null;state.directReactionPicker=null;state.mobileChatOptions=false;state.directMuteMenu=null;
     render();
     [...document.querySelectorAll(`[data-action="${target}"]`)].find(button=>!id||button.dataset.id===id)?.focus();
   }
   return;
 }
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
 const eventTabsScroll=document.getElementById('event-agenda-tabs')?.scrollLeft||0;
 const chatLog=document.getElementById('chat-log');
 const wasNearBottom=chatLog?chatLog.scrollHeight-chatLog.scrollTop-chatLog.clientHeight<(chatLog.dataset.communityReading?4:75):false;
 const wasVisible=Boolean(chatLog?.clientHeight);
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
 const eventTabs=document.getElementById('event-agenda-tabs');if(eventTabs)eventTabs.scrollLeft=eventTabsScroll;
 const nextChat=document.getElementById('chat-log');if(nextChat)restoreChatScroll(wasVisible?chatLog:null,nextChat,chatScroll,wasNearBottom);
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
 if(/^#(?:post|group|event|comment)=/.test(window.location.hash)){
   window.history.replaceState(null,'',window.location.pathname+window.location.search);
 }
}
function closeModal(){
 state.localDraftToDiscard=null;
 state.savedEventSearchNews=null;
 state.directMessageEditor=null;
 state.myCommentActivity=null;
 state.savedNotePostId=null;
 state.editingSavedCollectionId=null;
 state.collectionPostId=null;
 state.commentEditor=null;
 state.commentReplyId=null;
 state.expandedCommentReplies.clear();
 state.postEditor=null;
 state.pendingPostDraft=null;
 state.eventRoom=null;
 state.eventConflict=null;
 state.composingRecapId=null;
 clearContentLink();
 state.drafts.clear();state.modal=null;state.reportTarget=null;state.selectedPost=null;state.selectedGroup=null;state.composingGroup=null;state.composingIntroduction=false;state.viewUser=null;if(state.commentUnsub){state.commentUnsub();state.commentUnsub=null;}state.comments=[];render();void markOpenConversationRead();}
function openModal(name){state.drafts.clear();state.modal=name;render();}
function setTab(tab){
 if(tab!=='messages'){state.communitySearch=null;state.communitySavedPanel=null;state.mobileChatOpen=false;state.mobileChatOptions=false;state.directMessageMenu=null;state.mobileChatListScroll=0;closeAllSavedDirectMessages();state.directSavedLimit=0;state.directSearch=null;state.directLinksLimit=0;state.directEventLimit=0;state.directReactionPicker=null;}
 if(tab!=='saved')state.savedSelection=null;
 clearContentLink();state.welcomePending=false;state.tab=tab;state.modal=null;state.drafts.clear();render();
 void markOpenConversationRead();
 if(tab==='events'){
   if(['invites','sent-invites'].includes(state.eventFilter))void loadEventInvitations();
   else void loadPersonalHistory();
 }
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
async function startDirect(uid,messageId=''){
 const focusOnOpen=!messageId;
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
     }else{
       const marker=ref('members',sender,'privateUnread',id);
       if((await transaction.get(marker)).exists())transaction.delete(marker);
     }
   });
   if(me()!==sender)return;
   stopDirectSavedMessages();
   if(state.messageUnsub)state.messageUnsub();
   closeAllSavedDirectMessages();state.directMuteMenu=null;
   if(isMobileChatLayout()&&state.tab==='messages'&&!state.mobileChatOpen)state.mobileChatListScroll=window.scrollY;
   state.mobileChatOpen=true;state.mobileChatOptions=false;state.directMessageMenu=null;
   state.chatMode='direct';state.chatTarget={uid,name:p?.name||'Pessoa da comunidade'};
   state.directSearch=null;state.directLinksLimit=0;state.directEventLimit=0;state.directHistoryAnchor=null;state.directReply=null;state.directReactionPicker=null;
   const replyTo=readPrivateMessageDraft(privateMessageDraftKey(uid))?.replyTo;
   if(replyTo)state.directReply={id:replyTo};
   state.directMessages=[];state.tab='messages';state.modal=null;state.drafts.clear();
   state.directSavedUnsub=firebase.onSnapshot(col('members',sender,'privateSaved',id,'messages'),snapshot=>{
     if(me()!==sender||state.chatTarget?.uid!==uid)return;
     state.directSavedIds=new Set(snapshot.docs.map(doc=>doc.id));
     render();
   },error=>{
     if(me()!==sender||state.chatTarget?.uid!==uid)return;
     state.alerts=[...new Set([...state.alerts,'Não foi possível carregar as mensagens salvas.'])];render();
   });
   state.messageUnsub=firebase.onSnapshot(directMessagesCol(id),(snap)=>{
     if(me()!==sender||state.chatTarget?.uid!==uid)return;
     state.directMessages=snap.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
     if(messageId&&state.tab==='messages'&&!state.allSavedDirect&&state.directMessages.some(message=>message.id===messageId)){
       showDirectMessage(messageId);
       messageId='';
     }else render();
     void markOpenConversationRead();
   },(error)=>{state.alerts=[`Falha ao carregar conversa privada: ${friendlyError(error)}`];render();});
 },'openingDirect','Esta conversa privada não está disponível no momento.');
 if(state.tab==='messages'&&state.mobileChatOpen&&state.chatTarget?.uid===uid&&focusOnOpen)focusMobileChat();
}
function contentLink(type,id,commentId='') {
 const link=new URL(window.location.pathname,window.location.origin);
 link.hash=`${type}=${encodeURIComponent(id)}${commentId?':'+encodeURIComponent(commentId):''}`;
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
function openLinkedContent(event) {
 const comment=/^#comment=([a-zA-Z0-9_-]{1,120}):([a-zA-Z0-9_-]{1,120})$/.exec(window.location.hash);
 if(!state.user||state.modal&&!(comment&&event?.type==='hashchange'))return;
 if(comment){
   state.welcomePending=false;
   if(state.posts.some(post=>post.id===comment[1]))openComments(comment[1],comment[2]);
   return;
 }
 const match=/^#(post|group|event)=([a-zA-Z0-9_-]{1,120})$/.exec(window.location.hash);
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
   `SUMMARY:${escapeText(event.title)}`,`LOCATION:${escapeText(eventFormat(event)==='online'?'Online':eventLocationWithCity(event))}`,
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
function googleCalendarButton(event){
 if(!canExportEventCalendar(event))return '';
 const start=eventTimeInstant(event);
 const end=eventEndTime(event)?eventTimeInstant(event,event.endTime):start+3600000;
 if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return '';
 const date=instant=>new Date(instant).toISOString().replace(/[-:]|\.\d{3}/g,'');
 const link=new URL('https://calendar.google.com/calendar/render');
 link.search=new URLSearchParams({
   action:'TEMPLATE',
   text:event.title,
   dates:`${date(start)}/${date(end)}`,
   details:contentLink('event',event.id),
   location:eventFormat(event)==='online'?'Online':eventLocationWithCity(event)
 }).toString();
 return `<a class="btn btn-outline btn-small" href="${esc(link.href)}" target="_blank" rel="noopener noreferrer">Adicionar ao Google Agenda</a>`;
}
function downloadEventCalendar(event) {
 if(!hasCalendarSchedule(event)){
   showToast('O evento precisa de uma data e um horário válidos.',true);return;
 }
 downloadCalendar(calendarFile(event),'evento-hobbyhub.ics');
}
function downloadCalendar(file,name){
 downloadFile(file,name,'text/calendar;charset=utf-8');
}
function downloadFile(content,name,type){
 const url=URL.createObjectURL(new Blob([content],{type}));
 const link=document.createElement('a');
 link.href=url;link.download=name;
 document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function openComments(postId,focusCommentId=''){
 if(!state.posts.some(p=>p.id===postId))return;
 state.commentEditor=null;
 state.commentReplyId=null;
 state.expandedCommentReplies.clear();
 if(state.commentUnsub)state.commentUnsub();
 state.selectedPost=postId;state.modal='comments';state.comments=[];
 state.commentUnsub=firebase.onSnapshot(col('posts',postId,'comments'),(snap)=>{
   if(state.selectedPost!==postId)return;
   state.comments=snap.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
   const focused=focusCommentId&&state.modal==='comments'?state.comments.find(item=>item.id===focusCommentId):null;
   if(focused?.parentId)state.expandedCommentReplies.add(focused.parentId);
   render();
   if(focused){
     const target=document.getElementById('post-comment-'+focusCommentId);
     if(target){target.focus({preventScroll:true});target.scrollIntoView({block:'center'});focusCommentId='';}
   }
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
  case 'preview-shared-media':previewSharedMedia(btn.form);return;
  case 'load-video-captions':await loadVideoCaptions(btn);return;
  case 'toggle-video-transcript':await toggleVideoTranscript(btn);return;
  case 'seek-video-transcript':seekVideoTranscript(btn);return;
  case 'reload':window.location.reload();return;
  case 'toggle-auth':state.authMode=state.authMode==='login'?'register':'login';state.drafts.clear();render();return;
  case 'forgot-password':state.authMode='reset';state.drafts.clear();render();return;
  case 'theme':changeTheme();return;
  case 'tab':setTab(btn.dataset.tab);return;
  case 'explore':redirectToExplore();return;
  case 'feed':state.feed=btn.dataset.value;render();return;
  case 'topic':state.topic=btn.dataset.topic;render();return;
  case 'group-view':state.groupView=['discover','news'].includes(btn.dataset.value)?btn.dataset.value:'mine';state.groupNewsLimit=20;render();return;
  case 'open-group-news':
  case 'open-unseen-group-news':state.groupView='news';state.groupNewsLimit=20;state.groupNewsGroup='';state.groupNewsSearch='';state.groupNewsUnseenOnly=action==='open-unseen-group-news';setTab('groups');return;
  case 'toggle-group-news-unseen':state.groupNewsUnseenOnly=!state.groupNewsUnseenOnly;state.groupNewsLimit=20;render();return;
  case 'mark-group-news':await attempt(async()=>{
    const uid=me();
    if(!uid||!state.groups.some(group=>group.id===id&&group.members?.includes(uid)))return;
    const entry=groupUnreadNews().get(id);
    if(!entry)return;
    await markGroupNewsSeen(uid,[[id,entry]]);
    if(me()===uid)showToast('Novidades marcadas como vistas.');
  },'markingGroupNews');return;
  case 'mark-group-news-list':await attempt(async()=>{
    const uid=me();
    if(!uid||state.tab!=='groups'||state.groupView!=='news'||norm(state.groupNewsSearch))return;
    const groups=new Map(state.groups.filter(group=>group.members?.includes(uid)).map(group=>[group.id,group]));
    const entries=groupNewsListReads(groups,groupNewsFilter(groups,false),groupUnreadNews());
    if(!entries.length)return;
    await markGroupNewsSeen(uid,entries);
    if(me()===uid)showToast('Lista marcada como vista.');
  },'markingGroupNews');return;
  case 'toggle-pinned-group':await attempt(async()=>{
    const uid=me();
    if(!uid||!state.pinnedGroupsLoaded||!state.groups.some(group=>group.id===id&&group.members?.includes(uid)))return;
    const target=ref('members',uid,'pinnedGroups',id);
    const pinned=state.pinnedGroupIds.has(id);
    if(pinned)await firebase.deleteDoc(target);
    else await firebase.setDoc(target,{});
    if(me()===uid)showToast(pinned?'Grupo desafixado.':'Grupo fixado.');
  },'changingPinnedGroup');return;
  case 'more-group-news':state.groupNewsLimit+=20;render();return;
  case 'toggle-group-my-interests':if(state.tab==='groups'&&state.groupView==='discover'){state.groupMyInterests=!state.groupMyInterests;render();}return;
  case 'toggle-saved-discovery-filter':if(state.tab==='groups'&&state.groupView==='discover'){state.savedDiscoveryOnly=!state.savedDiscoveryOnly;render();}return;
  case 'toggle-saved-discovery-group':await attempt(async()=>{
    const uid=me();
    if(!uid||!state.savedDiscoveryGroupsLoaded||!state.groups.some(group=>group.id===id))return;
    const target=ref('members',uid,'savedDiscoveryGroups',id),saved=state.savedDiscoveryGroupIds.has(id);
    if(saved)await firebase.deleteDoc(target);
    else await firebase.setDoc(target,{});
    if(me()===uid)showToast(saved?'Grupo removido dos guardados.':'Grupo guardado para conhecer depois.');
  },'changingSavedDiscoveryGroup');return;
  case 'discover-groups':state.groupView='discover';setTab('groups');return;
  case 'welcome-discover-groups':
    if(state.modal==='first-visit'){
      state.groupHobby=state.welcomeHobby;state.groupMyInterests=false;state.savedDiscoveryOnly=false;
      state.groupView='discover';setTab('groups');
    }
    return;
  case 'save-welcome-hobby':await attempt(async()=>{
    const uid=me(),hobby=state.welcomeHobby;
    if(!uid||state.modal!=='first-visit'||!hobby||!state.groups.some(group=>group.hobby===hobby))return;
    const target=memberRef(uid);
    await firebase.runTransaction(db,async transaction=>{
      const profile=(await transaction.get(target)).data();
      if(!profile)throw new Error('O perfil ainda está carregando. Tente novamente.');
      const hobbies=Array.isArray(profile.hobbies)?profile.hobbies:[];
      if(hobbies.some(item=>norm(item)===norm(hobby)))return;
      if(hobbies.length>=10)throw new Error('Seu perfil já tem 10 hobbies. Edite o perfil para trocar um deles.');
      transaction.update(target,{hobbies:[...hobbies,hobby]});
    });
    if(me()===uid)showToast('Hobby adicionado ao seu perfil.');
  });return;
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
  case 'filter-dismissed-event-invites':
    state.showDismissedEventInvites=btn.dataset.value==='dismissed';
    if(state.receivedEventInvites)state.receivedEventInvites.limit=25;
    render();
    return;
  case 'filter-event-invite-status':
    if(state.receivedEventInvites&&eventInviteStatusFilters.some(([value])=>value===btn.dataset.value)){
      state.receivedEventInvites.status=btn.dataset.value;
      state.receivedEventInvites.limit=25;
      render();
    }
    return;
  case 'dismiss-event-invite':await updateDismissedEventInvite(id,btn.dataset.value,true);return;
  case 'restore-event-invite':await updateDismissedEventInvite(id,btn.dataset.value,false);return;
  case 'refresh-event-invitations':
    if(state.tab==='events'&&['invites','sent-invites'].includes(state.eventFilter))await loadEventInvitations();
    return;
  case 'more-event-invitations':
    {const list=activeEventInvitationList();if(list){list.limit+=25;render();}}
    return;
  case 'open-event-invitation-chat':
    if(activeEventInvitationList()?.entries.some(entry=>entry.peer===btn.dataset.value&&entry.id===id))await startDirect(btn.dataset.value,id);
    return;
  case 'event-filter':
    state.eventFilter=btn.dataset.value;
    if(['invites','sent-invites'].includes(state.eventFilter))await loadEventInvitations();
    else{render();await loadPersonalHistory();}
    return;
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
  case 'saved-event-searches':openModal('saved-event-searches');return;
  case 'view-saved-event-search-news':
    if(!['saved-event-searches','notifications'].includes(state.modal)||!state.savedEventSearches.get(id)?.alertSince)return;
    state.savedEventSearchNews={id,previous:state.modal,limit:25};
    openModal('saved-event-search-news');
    return;
  case 'back-saved-event-search-news':
    if(state.modal==='saved-event-search-news'){
      const previous=state.savedEventSearchNews?.previous||'saved-event-searches';
      state.savedEventSearchNews=null;
      openModal(previous);
    }
    return;
  case 'more-saved-event-search-news':
    if(state.modal==='saved-event-search-news'&&state.savedEventSearchNews){state.savedEventSearchNews.limit+=25;render();}
    return;
  case 'review-saved-event-search-news':await attempt(async()=>{
    const uid=me(),panel=state.savedEventSearchNews;
    const search=state.savedEventSearches.get(panel?.id);
    if(!uid||state.modal!=='saved-event-search-news'||!search?.alertSince||!savedEventSearchNews(search).length)return;
    await firebase.updateDoc(ref('members',uid,'savedEventSearches',panel.id),{reviewedAt:firebase.serverTimestamp()});
    if(me()===uid)showToast('Novidades marcadas como vistas.');
  });return;
  case 'apply-event-search':{
    const entry=state.savedEventSearches.get(id);
    if(state.modal!=='saved-event-searches'||!entry)return;
    state.eventSearch=entry.query;state.eventHobby=entry.hobby;state.eventCommunity=entry.community;
    state.eventFormat=entry.format;state.eventCityFilter=entry.city;
    closeModal();
    return;
  }
  case 'toggle-event-search-alert':await attempt(async()=>{
    const uid=me(),entry=state.savedEventSearches.get(id);
    if(!uid||state.modal!=='saved-event-searches'||!entry)return;
    await firebase.updateDoc(ref('members',uid,'savedEventSearches',id),{
      alertSince:entry.alertSince?firebase.deleteField():firebase.serverTimestamp()
    });
    if(me()===uid)showToast(entry.alertSince?'Aviso desligado.':'Aviso ativado.');
  });return;
  case 'delete-event-search':await attempt(async()=>{
    const uid=me();
    if(!uid||state.modal!=='saved-event-searches'||!state.savedEventSearches.has(id))return;
    await firebase.deleteDoc(ref('members',uid,'savedEventSearches',id));
    if(me()===uid)showToast('Busca removida.');
  });return;
  case 'clear-event-filters':state.eventSearch='';state.eventHobby='';state.eventCommunity='';state.eventFormat='';state.eventCityFilter='';render();return;
  case 'toggle-event-filters':
    state.eventFiltersOpen=!state.eventFiltersOpen;
    render();
    return;
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
  case 'share-event-in-chat':
    if(state.modal==='event-detail'&&state.events.some(event=>event.id===state.selectedEvent&&!event.cancelled)){
      if(!state.eventChatShares.has(state.selectedEvent)){
        state.eventChatShares.set(state.selectedEvent,{query:'',selected:new Set(),deliveries:new Map(),previous:new Map(),unknown:new Set(),sending:false,loading:false,confirmResend:null});
      }
      openModal('event-chat-share');
      await loadEventChatShareHistory();
    }
    return;
  case 'select-event-chat-recipient':{
    const panel=state.eventChatShares.get(state.selectedEvent);
    if(state.modal!=='event-chat-share'||!panel||panel.sending||panel.loading||panel.previous.has(id)||panel.unknown.has(id)||panel.deliveries.has(id)||!eventChatRecipients().some(item=>item.peer===id))return;
    if(panel.selected.has(id))panel.selected.delete(id);
    else panel.selected.add(id);
    render();
    return;
  }
  case 'reload-event-invite-history':await loadEventChatShareHistory();return;
  case 'prepare-event-invite-resend':{
    const panel=state.eventChatShares.get(state.selectedEvent);
    if(state.modal!=='event-chat-share'||!panel||panel.sending||panel.loading||!panel.previous.has(id)||panel.unknown.has(id))return;
    panel.confirmResend=id;render();return;
  }
  case 'cancel-event-invite-resend':{
    const panel=state.eventChatShares.get(state.selectedEvent);
    if(panel){panel.confirmResend=null;render();}
    return;
  }
  case 'confirm-event-invite-resend':await sendEventChatInvites(false,id);return;
  case 'retry-event-chat-share':await sendEventChatInvites(true);return;
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
  case 'view-group':state.selectedGroup=id;openModal(btn.dataset.preview==='true'?'group-preview':'group-detail');return;
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
    state.tab='groups';state.selectedGroup=id;state.invitedGroupId=id;openModal('group-preview');return;
  case 'back-first-visit':
    if(state.modal==='group-preview'&&state.selectedGroup===state.invitedGroupId){
      state.invitedGroupId=null;state.selectedGroup=null;openModal('first-visit');
    }
    return;
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
    if(me()===uid)showToast(muted?'Avisos da comunidade reativados.':'Avisos de enquetes, perguntas da semana, recados e mudanças de eventos salvos foram silenciados.');
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
  case 'open-weekly-question-history':await openWeeklyQuestionHistory(id);return;
  case 'open-all-weekly-questions':
    if(me()){state.weeklyAnswers=null;openModal('all-weekly-questions');await refreshWeeklyAnswers();}
    return;
  case 'set-weekly-answer-filter':
    if(state.modal==='all-weekly-questions'&&['all','unanswered','answered'].includes(btn.dataset.value)){
      if(state.weeklyAnswerFilter===btn.dataset.value)return;
      state.weeklyAnswerFilter=btn.dataset.value;state.weeklyAnswers=null;render();
      await refreshWeeklyAnswers();
    }
    return;
  case 'retry-weekly-answers':state.weeklyAnswers=null;render();await refreshWeeklyAnswers(true);return;
  case 'set-weekly-question':
  case 'clear-weekly-question':await attempt(async()=>{
    const group=state.groups.find(item=>item.id===state.selectedGroup),clear=action==='clear-weekly-question';
    if(!canManageGroup(group)||(!clear&&!state.posts.some(post=>post.id===id&&post.groupId===group.id)))return;
    await changeWeeklyQuestion(group.id,id,clear);
    showToast(clear?'Destaque retirado.':'Pergunta da semana destacada.');
  });return;
  case 'group-post':
  case 'introduce-group':{
    const group=state.groups.find(g=>g.id===(id||state.selectedGroup));
    if(!group||!(group.members||[]).includes(me()))return;
    state.composingGroup=group.id;state.composingIntroduction=action==='introduce-group';state.composingRecapId=null;openPostComposer();return;
  }
  case 'browse-group-conversations':
    if(state.selectedGroup!==id||!['group-detail','group-preview'].includes(state.modal))return;
    if(state.groupFirstStepsId===id)state.groupFirstStepsId=null;
    if(state.invitedGroupId===id)state.invitedGroupId=null;
    render();
    document.getElementById('group-conversations')?.focus();
    return;
  case 'toggle-group-welcome':await attempt(async()=>{
    const post=state.posts.find(item=>item.id===id);
    if(!post||!canWelcomeGroupPost(post))return;
    const uid=me(),welcomed=Array.isArray(post.welcomedBy)&&post.welcomedBy.includes(uid);
    await firebase.updateDoc(ref('posts',id),welcomed?{welcomedBy:firebase.arrayRemove(uid)}
      :{welcomedBy:firebase.arrayUnion(uid),welcomesChangedAt:firebase.serverTimestamp()});
  },'changingGroupWelcome');return;
  case 'notifications':openModal('notifications');return;
  case 'notification-settings':openModal('notification-settings');return;
  case 'event-hobby-alerts':openModal('event-hobby-alerts');return;
  case 'edit-event-hobby-alert':{
    const form=document.getElementById('event-hobby-alert-form'),alert=state.eventHobbyAlerts.get(id);
    if(form&&alert){
      form.elements.hobby.value=id;
      form.elements.scope.value=alert.scope;
      form.elements.scope.focus();
    }
    return;
  }
  case 'remove-event-hobby-alert':await attempt(async()=>{
    const uid=me();
    if(!uid||state.modal!=='event-hobby-alerts'||!state.eventHobbyAlerts.has(id))return;
    await firebase.deleteDoc(ref('members',uid,'eventHobbyAlerts',id));
    if(me()===uid)showToast('Alerta desligado.');
  });return;
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
    if(['event-seat','event-reminder','event-hobby-alert','saved-event-change','confirmed-event-cancellation'].includes(notice.type)){openEventDetail(notice.eventId);return;}
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
    if(['comment','comment-reply','followed-comment','group-welcome'].includes(notice.type)&&state.posts.some(post=>post.id===notice.postId)){
      openComments(notice.postId,['comment','group-welcome'].includes(notice.type)?'':notice.commentId);return;
    }
    if(notice.type==='weekly-question'&&state.posts.some(post=>post.id===notice.postId)){
      openComments(notice.postId);return;
    }
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
  case 'open-all-saved-direct':await openAllSavedDirectMessages();return;
  case 'close-all-saved-direct':
    closeAllSavedDirectMessages();render();
    document.querySelector('[data-action="open-all-saved-direct"]')?.focus();
    return;
  case 'more-all-saved-direct':
    if(state.allSavedDirect){state.allSavedDirect.limit+=25;render();}
    return;
  case 'open-all-saved-direct-message':
    if(state.allSavedDirect?.entries.some(entry=>entry.id===id&&entry.peer===btn.dataset.value))await startDirect(btn.dataset.value,id);
    return;
  case 'open-dm':await startDirect(id);return;
  case 'filter-direct-threads':
    state.directThreadFilter=['unread','archived'].includes(btn.dataset.value)?btn.dataset.value:'all';
    render();
    return;
  case 'toggle-direct-mute':await toggleMutedDirectThread();return;
  case 'set-direct-mute-duration':await toggleMutedDirectThread(btn.dataset.value);return;
  case 'toggle-direct-archive':await toggleArchivedDirectThread();return;
  case 'mark-direct-unread':await markDirectThreadUnread();return;
  case 'toggle-pinned-direct-thread':await togglePinnedDirectThread();return;
  case 'toggle-direct-search':
    state.mobileChatOptions=false;
    state.directEventLimit=0;
    state.directSavedLimit=0;
    state.directLinksLimit=0;
    state.directSearch=state.directSearch?null:{query:'',limit:20};
    render();
    document.getElementById('direct-search')?.focus();
    return;
  case 'toggle-direct-links':
    state.mobileChatOptions=false;
    state.directEventLimit=0;
    state.directSavedLimit=0;
    if(state.chatMode!=='direct'||!state.chatTarget)return;
    state.directSearch=null;
    state.directLinksLimit=state.directLinksLimit?0:25;
    render();
    if(state.directLinksLimit){const log=document.getElementById('chat-log');if(log)log.scrollTop=0;}
    return;
  case 'toggle-direct-saved-message':await toggleSavedDirectMessage(id);return;
  case 'toggle-direct-saved-panel':{
    if(state.chatMode!=='direct'||!state.chatTarget)return;
    state.mobileChatOptions=false;
    state.directSearch=null;state.directLinksLimit=0;state.directEventLimit=0;
    state.directSavedLimit=state.directSavedLimit?0:25;
    render();
    const log=document.getElementById('chat-log');if(log&&state.directSavedLimit)log.scrollTop=0;
    return;
  }
  case 'more-direct-saved-messages':{
    if(!state.directSavedLimit)return;
    const scroll=document.getElementById('chat-log')?.scrollTop||0;
    state.directSavedLimit+=25;
    render();
    const log=document.getElementById('chat-log');if(log)log.scrollTop=scroll;
    return;
  }
  case 'toggle-shared-direct-events':{
    if(state.chatMode!=='direct'||!state.chatTarget)return;
    state.mobileChatOptions=false;
    state.directSearch=null;state.directSavedLimit=0;state.directLinksLimit=0;
    state.directEventLimit=state.directEventLimit?0:25;
    render();
    const log=document.getElementById('chat-log');if(log&&state.directEventLimit)log.scrollTop=0;
    return;
  }
  case 'more-shared-direct-events':{
    if(!state.directEventLimit)return;
    const scroll=document.getElementById('chat-log')?.scrollTop||0;
    state.directEventLimit+=25;
    render();
    const log=document.getElementById('chat-log');if(log)log.scrollTop=scroll;
    return;
  }
  case 'more-direct-links':{
    if(!state.directLinksLimit)return;
    const scroll=document.getElementById('chat-log')?.scrollTop||0;
    state.directLinksLimit+=25;
    render();
    const log=document.getElementById('chat-log');if(log)log.scrollTop=scroll;
    return;
  }
  case 'more-direct-matches':
    if(state.directSearch){state.directSearch.limit+=20;render();}
    return;
  case 'jump-direct-message':showDirectMessage(id);return;
  case 'toggle-direct-reaction':
    if(state.chatMode!=='direct'||!state.chatTarget||state.blockedIds.includes(state.chatTarget.uid)||!state.directMessages.some(message=>message.id===id))return;
    state.directReactionPicker=state.directReactionPicker===id?null:id;
    render();
    return;
  case 'set-direct-reaction':await setDirectReaction(id,btn.dataset.value);return;
  case 'delete-direct-message':
  case 'edit-direct-message':{
    if(state.chatMode!=='direct'||!state.chatTarget||state.blockedIds.includes(state.chatTarget.uid))return;
    const message=state.directMessages.find(item=>item.id===id);
    if(!canEditDirectMessage(message)){showToast('O prazo para editar esta mensagem terminou.',true);return;}
    state.directMessageEditor={id,peer:state.chatTarget.uid,text:message.text};
    openModal(btn.dataset.action);
    return;
  }
  case 'reply-direct-message':
    if(state.chatMode!=='direct'||!state.chatTarget||state.blockedIds.includes(state.chatTarget.uid)||!state.directMessages.some(message=>message.id===id))return;
    state.directReply={id};state.directMessageMenu=null;state.directReactionPicker=null;
    saveCurrentPrivateMessageDraft();
    render();
    document.getElementById('message-text')?.focus();
    return;
  case 'cancel-direct-reply':
    state.directReply=null;
    saveCurrentPrivateMessageDraft();
    render();
    document.getElementById('message-text')?.focus();
    return;
  case 'latest-direct-messages':
    state.directHistoryAnchor=null;
    render();
    document.getElementById('chat-log')?.lastElementChild?.scrollIntoView({block:'nearest'});
    return;
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
  case 'back-mobile-chats':
    state.communitySearch=null;state.communitySavedPanel=null;
    state.mobileChatOpen=false;state.mobileChatOptions=false;state.directMessageMenu=null;state.directMuteMenu=null;
    render();
    document.getElementById('mobile-chat-list-title')?.focus({preventScroll:true});
    window.scrollTo({top:state.mobileChatListScroll,behavior:'instant'});
    return;
  case 'toggle-mobile-chat-options':
    state.mobileChatOptions=!state.mobileChatOptions;
    state.directMessageMenu=null;
    if(!state.mobileChatOptions)state.directMuteMenu=null;
    render();
    return;
  case 'toggle-direct-message-menu':{
    const scope=chatMessageMenuScope();
    if(!scope||!chatMessages().some(message=>message.id===id&&!message.deletedAt))return;
    const open=state.directMessageMenu?.scope===scope&&state.directMessageMenu?.id===id;
    state.mobileChatOptions=false;state.directMuteMenu=null;state.directReactionPicker=null;
    state.directMessageMenu=open?null:{scope,id};render();return;
  }
  case 'copy-direct-message':{
    if(!chatMessageMenuScope())return;
    const message=chatMessages().find(item=>item.id===id&&!item.deletedAt);
    if(message&&typeof message.text==='string')await copyContentLink(message.text,'Mensagem copiada.','Copie a mensagem:');
    return;
  }
  case 'reply-community-message':
  case 'cancel-community-reply':
    if(state.chatMode==='direct')return;
    if(action==='reply-community-message'&&(!id||!chatMessages().some(message=>message.id===id)))return;
    state.communityReply=action==='cancel-community-reply'?null:{key:communityReadingKey(),id};
    state.directMessageMenu=null;
    render();
    document.getElementById('message-text')?.focus();
    return;
  case 'toggle-community-search':{
    if(state.chatMode==='direct')return;
    const key=communityReadingKey();
    state.communitySavedPanel=null;
    state.communitySearch=state.communitySearch?.key===key?null:{key,query:'',limit:20};
    state.directMessageMenu=null;
    render();
    document.getElementById(state.communitySearch?'community-search':'toggle-community-search')?.focus();
    return;
  }
  case 'toggle-community-saved':{
    if(state.chatMode==='direct')return;
    const key=communityReadingKey();
    state.communitySearch=null;
    state.communitySavedPanel=state.communitySavedPanel===key?null:key;
    state.directMessageMenu=null;
    render();
    document.getElementById(state.communitySavedPanel?'community-saved-title':'toggle-community-saved')?.focus();
    return;
  }
  case 'toggle-community-saved-message':{
    if(!me()||state.chatMode==='direct'||!id||!chatMessages().some(message=>message.id===id))return;
    const uid=me(),saved=!readCommunitySaved().has(id);
    await attempt(async()=>{
      await firebase.setDoc(ref('members',uid,'communitySaved',id),{saved});
      if(me()===uid)showToast(saved?'Mensagem salva.':'Mensagem removida dos salvos.');
    },'changingCommunitySaved','Não foi possível sincronizar esta mensagem salva.');
    return;
  }
  case 'more-community-matches':
    if(state.chatMode!=='direct'&&state.communitySearch?.key===communityReadingKey()){
      state.communitySearch.limit+=20;render();
    }
    return;
  case 'jump-community-message':{
    if(state.chatMode==='direct'||!id||!chatMessages().some(message=>message.id===id))return;
    const targetId='community-message-'+id;
    if(state.communitySearch||state.communitySavedPanel||!document.getElementById(targetId)){
      state.communitySearch=null;state.communitySavedPanel=null;
      state.communityHistoryAnchor={key:communityReadingKey(),id};
      render();
    }
    const target=document.getElementById(targetId);
    target?.focus({preventScroll:true});
    target?.scrollIntoView({block:'nearest'});
    return;
  }
  case 'latest-community-messages':{
    if(state.communityHistoryAnchor){state.communityHistoryAnchor=null;render();}
    const log=document.getElementById('chat-log');
    if(log?.dataset.communityReading){log.scrollTop=log.scrollHeight;rememberCommunityReading(log);}
    return;
  }
  case 'chat-community':showCommunityChat(btn.dataset.value==='global'?'global':'community',true);return;
  case 'comments':openComments(id);return;
  case 'my-comment-activity':
    if(me()){
      state.myCommentActivity={entries:[],last:null,more:true,loading:false,error:'',type:'all',groupId:''};
      openModal('my-comment-activity');await loadMyCommentActivity();
    }
    return;
  case 'load-my-comments':await loadMyCommentActivity();return;
  case 'my-comment-type':
    if(['all','comments','replies'].includes(btn.dataset.value))await filterMyComments(btn.dataset.value,state.myCommentActivity?.groupId||'');
    return;
  case 'open-my-comment':{
    if(!me()||state.modal!=='my-comment-activity')return;
    const item=state.myCommentActivity?.entries.find(entry=>entry.key===id&&entry.userId===me());
    if(item)openComments(item.postId,item.commentId);
    return;
  }
  case 'toggle-comment-replies':
    if(state.modal==='comments'&&state.comments.filter(comment=>comment.parentId===id).length>=3){
      if(!state.expandedCommentReplies.delete(id))state.expandedCommentReplies.add(id);
      render();
    }
    return;
  case 'reply-to-comment':
    if(state.modal==='comments'&&!state.busy&&me()&&state.comments.some(item=>item.id===id&&!item.parentId)){
      state.commentReplyId=id;render();document.getElementById('comment-text')?.focus();
    }
    return;
  case 'cancel-comment-reply':
    if(state.modal==='comments'&&!state.busy){
      state.commentReplyId=null;render();document.getElementById('comment-text')?.focus();
    }
    return;
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
    const uid=me();if(!uid)return;
    const joined=group.members?.includes(uid),target=ref('groups',id);
    const origin={tab:state.tab,modal:state.modal,group:state.selectedGroup};
    if(joined){
      const batch=firebase.writeBatch(db);
      batch.update(target,{members:firebase.arrayRemove(uid)});
      batch.delete(ref('members',uid,'moderation',id));
      await batch.commit();
    }else await firebase.updateDoc(target,{members:firebase.arrayUnion(uid)});
    if(me()!==uid)return;
    watchPollNotices();
    if(joined&&state.groupFirstStepsId===id)state.groupFirstStepsId=null;
    if(!joined&&state.tab===origin.tab&&state.modal===origin.modal&&state.selectedGroup===origin.group){
      state.groupFirstStepsId=id;state.tab='groups';state.selectedGroup=id;openModal('group-detail');
    }
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
    const invitation=btn.dataset.value==='invitation';
    if(invitation&&(!eligible||attending||(queued&&!offered)))return;
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
    showToast(attending?'Participação removida.':event.groupId||invitation?'Presença confirmada!':'Sua participação foi marcada como interesse!');
  });return;
  case 'post-options':{
    if(!me()||!state.posts.some(post=>post.id===id))return;
    state.postEditor={id,previous:['comments','group-detail'].includes(state.modal)?state.modal:null};
    state.modal='post-options';render();return;
  }
  case 'saved-view':
    if(state.tab==='saved'&&['saved','following','comments','drafts'].includes(btn.dataset.value)){
      if(state.savedView!==btn.dataset.value)state.savedSelection=null;
      state.savedView=btn.dataset.value;render();
    }
    return;
  case 'resume-local-post-draft':{
    if(state.tab!=='saved'||state.savedView!=='drafts')return;
    const item=myPostDrafts().find(draft=>draft.key===id&&draft.available);
    if(!item)return;
    state.composingGroup=item.groupId||null;state.composingIntroduction=item.introduction;state.composingRecapId=null;
    state.pendingPostDraft=null;state.drafts.clear();state.drafts.set(item.key,item.draft);
    state.modal='compose';render();document.getElementById('post-content')?.focus();
    return;
  }
  case 'discard-local-post-draft':
    if(state.tab==='saved'&&state.savedView==='drafts'&&myPostDrafts().some(draft=>draft.key===id)){
      state.localDraftToDiscard=id;openModal('discard-local-post-draft');
    }
    return;
  case 'confirm-discard-local-post-draft':
    if(state.modal==='discard-local-post-draft'&&myPostDrafts().some(draft=>draft.key===state.localDraftToDiscard)){
      removePostDraft(state.localDraftToDiscard);state.localDraftToDiscard=null;closeModal();
    }
    return;
  case 'toggle-saved-reading-filter':
    if(state.tab==='saved'&&state.savedView==='saved'){
      state.savedReadingOnly=!state.savedReadingOnly;state.savedSelection=null;render();
    }
    return;
  case 'toggle-saved-reading-status':await attempt(async()=>{
    const uid=me();
    if(!uid||state.tab!=='saved'||state.savedView!=='saved'||!state.savedIds.includes(id))return;
    const read=!state.readSavedPosts.has(id);
    await firebase.updateDoc(ref('members',uid,'saved',id),{read});
    if(me()===uid)showToast(read?'Publicação marcada como lida.':'Publicação marcada para ler.');
  });return;
  case 'open-saved-comment':{
    const saved=state.savedComments.get(id);
    if(state.tab==='saved'&&state.savedView==='comments'&&saved&&state.savedCommentWatches.get(id)?.comment){
      openComments(saved.postId,saved.commentId);
    }
    return;
  }
  case 'remove-saved-comment':
  case 'toggle-saved-comment':await attempt(async()=>{
    const uid=me(),fromSaved=btn.dataset.action==='remove-saved-comment';
    if(!uid)return;
    const postId=state.selectedPost,key=fromSaved?id:savedCommentKey(postId,id);
    const saved=state.savedComments.has(key);
    if(fromSaved?state.tab!=='saved'||state.savedView!=='comments'||!saved:
       state.modal!=='comments'||!postId||!state.comments.some(comment=>comment.id===id))return;
    const target=ref('members',uid,'savedComments',key);
    if(saved)await firebase.deleteDoc(target);
    else await firebase.setDoc(target,{postId,commentId:id,savedAt:firebase.serverTimestamp()});
    if(me()===uid)showToast(saved?'Comentário removido dos salvos.':'Comentário salvo.');
  });return;
  case 'export-saved-posts':{
    if(!me()||state.tab!=='saved'||state.savedView!=='saved'||state.savedSelection)return;
    const collection=state.savedCollections.find(item=>item.id===state.selectedSavedCollection);
    if(!savedPostIdsForCollection(collection?.id).size)return;
    downloadFile(savedPostsExport(collection),collection?'hobbyhub-colecao.txt':'hobbyhub-salvos.txt','text/plain;charset=utf-8');
    return;
  }
  case 'edit-saved-note':
    if(me()&&state.tab==='saved'&&state.savedView==='saved'&&state.savedIds.includes(id)){
      state.savedNotePostId=id;openModal('edit-saved-note');
    }
    return;
  case 'toggle-saved-selection':
    if(state.tab==='saved'&&state.savedView==='saved'&&!state.busy){
      state.savedSelection=state.savedSelection?null:new Set();render();
    }
    return;
  case 'select-saved-post':
    if(state.tab==='saved'&&state.savedView==='saved'&&state.savedSelection&&!state.busy&&state.savedIds.includes(id)&&
       (!state.selectedSavedCollection||state.savedMemberships.get(id)?.includes(state.selectedSavedCollection))){
      if(!state.savedSelection.delete(id))state.savedSelection.add(id);
      render();
    }
    return;
  case 'choose-bulk-collection':
    if(state.tab==='saved'&&state.savedView==='saved'&&state.savedSelection?.size&&!state.busy)openModal('bulk-saved-collection');
    return;
  case 'add-selected-to-collection':await updateSavedSelection(id,false);return;
  case 'mark-selected-saved-read':await markSelectedSavedRead();return;
  case 'remove-selected-from-collection':await updateSavedSelection(id,true);return;
  case 'manage-saved-collections':
    if(state.tab==='saved'&&state.savedView==='saved'&&state.savedIds.includes(id)){
      state.collectionPostId=id;openModal('manage-saved-collections');
    }
    return;
  case 'create-saved-collection':
    if(state.tab==='saved'&&state.savedView==='saved'){
      if(state.modal!=='manage-saved-collections')state.collectionPostId=null;
      openModal('create-saved-collection');
    }
    return;
  case 'rename-saved-collection':
  case 'delete-saved-collection':
    if(me()&&state.tab==='saved'&&state.savedView==='saved'&&state.selectedSavedCollection===id&&state.savedCollections.some(item=>item.id===id)){
      state.editingSavedCollectionId=id;openModal(btn.dataset.action);
    }
    return;
  case 'confirm-delete-saved-collection':await attempt(async()=>{
    const uid=me();
    if(!uid||state.modal!=='delete-saved-collection'||state.editingSavedCollectionId!==id||
       !state.savedCollections.some(item=>item.id===id))return;
    await firebase.deleteDoc(ref('members',uid,'savedCollections',id));
    if(me()!==uid)return;
    if(state.selectedSavedCollection===id)state.selectedSavedCollection='';
    if(state.editingSavedCollectionId===id&&state.modal==='delete-saved-collection')closeModal();
    showToast('Coleção excluída.');
  });return;
  case 'toggle-saved-collection':await attempt(async()=>{
    const uid=me(),postId=state.collectionPostId;
    if(!uid||state.modal!=='manage-saved-collections'||!state.savedIds.includes(postId)||
       !state.savedCollections.some(item=>item.id===id))return;
    const selected=state.savedMemberships.get(postId)?.includes(id);
    await firebase.updateDoc(ref('members',uid,'saved',postId),{
      collectionIds:selected?firebase.arrayRemove(id):firebase.arrayUnion(id)
    });
    if(me()===uid)showToast(selected?'Publicação retirada da coleção.':'Publicação adicionada à coleção.');
  });return;
  case 'clear-saved-search':
    if(state.tab==='saved'){
      state.savedSearch='';render();document.getElementById('saved-search')?.focus();
    }
    return;
  case 'followed-posts-filter':
    if(state.tab==='saved'&&state.savedView==='following'&&['all','unread'].includes(btn.dataset.value)){
      state.followedPostsFilter=btn.dataset.value;render();
    }
    return;
  case 'read-followed-comments':{
    if(state.tab!=='saved'||state.savedView!=='following'||!state.followedPosts.has(id))return;
    const unread=unreadFollowedComments(id);
    if(!unread.length)return;
    markNotificationsRead(unread.map(comment=>({type:'followed-comment',readKey:followedCommentReadKey(id,comment.id)})));
    render();
    document.querySelector('[data-action="followed-posts-filter"][aria-pressed="true"]')?.focus();
    return;
  }
  case 'open-followed-conversation':{
    if(!state.followedPosts.has(id)||!state.posts.some(post=>post.id===id))return;
    const newest=unreadFollowedComments(id)[0];
    if(newest)markNotificationsRead([{type:'followed-comment',readKey:followedCommentReadKey(id,newest.id)}]);
    openComments(id,newest?.id);return;
  }
  case 'stop-followed-post':
  case 'toggle-followed-weekly-question':
  case 'toggle-followed-post':await attempt(async()=>{
    const uid=me();
    const following=state.followedPosts.has(id),stop=btn.dataset.action==='stop-followed-post';
    if(!uid)return;
    if(stop){
      if(state.tab!=='saved'||state.savedView!=='following'||!following)return;
    }else if(action==='toggle-followed-weekly-question'){
      if(state.modal!=='all-weekly-questions'||!myActiveWeeklyQuestions().some(({post})=>post.id===id))return;
    }else if(state.modal!=='post-options'||state.postEditor?.id!==id||!state.posts.some(post=>post.id===id))return;
    const target=ref('members',uid,'followedPosts',id);
    if(following)await firebase.deleteDoc(target);
    else await firebase.setDoc(target,{followedAt:firebase.serverTimestamp()});
    if(me()===uid)showToast(following?'Você parou de acompanhar a publicação.':'Você está acompanhando a publicação.');
  });return;
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
    if(state.modal!=='comments'||state.busy||!me()||!state.comments.some(item=>item.id===id))return;
    state.commentEditor=state.commentEditor?.id===id?null:{id,editing:false};
    render();return;
  case 'copy-comment-link':
    if(me()&&state.modal==='comments'&&state.selectedPost&&state.comments.some(comment=>comment.id===id)){
      await copyContentLink(contentLink('comment',state.selectedPost,id),'Link do comentário copiado!','Copie o link do comentário:');
    }
    return;
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
document.addEventListener('toggle',event=>{
 const section=event.target,id=section.dataset?.groupIntroductions;
 if(id&&section.isConnected)state.openGroupIntroductions=section.open?id:null;
},true);
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='visible')void syncNotificationReads();
 if(document.visibilityState==='visible'&&state.user){watchPollNotices();watchEventBulletins();scheduleEventOffers();scheduleEventReminderRefresh();loadHomeEventRooms();void loadPersonalHistory();render();}
 void markOpenConversationRead();
});
document.addEventListener('change',(event)=>{
 if(event.target.id==='my-comment-community'){
   void filterMyComments(state.myCommentActivity?.type||'all',event.target.value);return;
 }
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
 else if(event.target.id==='event-city-filter')state.eventCityFilter=event.target.value;
 else if(event.target.id==='saved-post-order')state.savedPostOrder=event.target.value==='oldest'?'oldest':'recent';
 else if(event.target.id==='saved-group-filter'){
   state.savedGroup=event.target.value;
   state.savedSelection=null;
 }
 else if(event.target.id==='saved-collection-filter'){
   state.selectedSavedCollection=event.target.value;state.savedSelection=null;
 }
 else if(event.target.id==='group-hobby')state.groupHobby=event.target.value;
 else if(event.target.id==='group-city')state.groupCity=event.target.value;
 else if(event.target.id==='group-discovery-order')state.groupDiscoveryOrder=event.target.value==='active'?'active':'default';
 else if(event.target.id==='group-news-group'){state.groupNewsGroup=event.target.value;state.groupNewsLimit=20;}
 else return;
 render();
});
window.addEventListener('hashchange',openLinkedContent);
window.addEventListener('online',()=>{void syncNotificationReads();void migrateCommunitySaved(me());scheduleCommunityReadingSync();});
window.visualViewport?.addEventListener('resize',updateMobileViewport);
window.visualViewport?.addEventListener('scroll',updateMobileViewport);
document.addEventListener('error',(event)=>{
 const media=event.target;
 if(!media.matches?.('[data-shared-media]'))return;
 const status=media.nextElementSibling;
 status.textContent=media.tagName==='IMG'
   ?'A foto não carregou. Confira se o link abre a imagem diretamente.'
   :'O vídeo não carregou. Confira se o link abre o arquivo de vídeo diretamente.';
 status.hidden=false;
 if(media.tagName==='VIDEO'&&media.parentElement.querySelector('[data-video-transcript]'))media.style.display='none';
 else media.remove();
},true);

document.addEventListener('input',(event)=>{
 if(Object.hasOwn(sharedMediaFieldsLimits,event.target.name)){
   const form=event.target.form;
   form?.querySelector('[data-media-preview]')?.replaceChildren();
   const status=form?.querySelector('[data-media-preview-status]');
   if(status)status.textContent='';
 }
 if(event.target.id==='sent-event-invite-search'&&state.sentEventInvites){
   state.sentEventInvites.query=event.target.value;
   state.sentEventInvites.limit=25;
   render();
   return;
 }
 if(event.target.id==='received-event-invite-search'&&state.receivedEventInvites){
   state.receivedEventInvites.query=event.target.value;
   state.receivedEventInvites.limit=25;
   render();
   return;
 }
 if(event.target.id==='event-chat-share-search'){
   const panel=state.eventChatShares.get(state.selectedEvent);
   if(state.modal==='event-chat-share'&&panel){panel.query=event.target.value;render();}
   return;
 }
 if(event.target.id==='all-saved-direct-search'&&state.allSavedDirect){
   state.allSavedDirect.query=event.target.value;state.allSavedDirect.limit=25;render();return;
 }
 if(event.target.id==='direct-thread-search'){state.directThreadSearch=event.target.value;render();return;}
 if(event.target.id==='message-text'){saveCurrentPrivateMessageDraft(event.target.value);return;}
 if(event.target.id==='community-search'&&state.chatMode!=='direct'&&state.communitySearch?.key===communityReadingKey()){
   state.communitySearch.query=event.target.value;
   state.communitySearch.limit=20;
   render();
   const log=document.getElementById('chat-log');if(log)log.scrollTop=0;
   return;
 }
 if(event.target.id==='direct-search'&&state.directSearch){
   state.directSearch.query=event.target.value;
   state.directSearch.limit=20;
   render();
   const log=document.getElementById('chat-log');if(log)log.scrollTop=0;
   return;
 }
 if(event.target.form?.id==='post-form')savePostDraft(event.target.form);
 if(event.target.id==='event-search'){state.eventSearch=event.target.value;render();return;}
 if(event.target.id==='saved-search'){state.savedSearch=event.target.value;render();return;}
 if(event.target.id==='group-news-search'){state.groupNewsSearch=event.target.value;state.groupNewsLimit=20;render();return;}
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
    if(!uid||!post||state.modal!=='edit-post'||content.length>2000)return;
    const media=readSharedMediaFields(val);
    if(!content&&!media.photoUrl&&!media.videoUrl)throw new Error('Inclua texto, uma foto ou um vídeo.');
    const updates={};
    if(content!==post.content)updates.content=content;
    for(const [key,value] of Object.entries(media))if(value!==(post[key]||''))updates[key]=value;
    if(Object.keys(updates).length){
      await firebase.updateDoc(ref('posts',post.id),{...updates,editedAt:firebase.serverTimestamp()});
      if(me()!==uid)return;
      showToast('Publicação atualizada.');
    }
    if(state.postEditor===editor&&state.modal==='edit-post')returnFromPostEditor();
  });return;
  case 'post-form':await attempt(async()=>{
    const content=val('content'),media=readSharedMediaFields(val);
    if(content.length>2000)return;
    if(!content&&!media.photoUrl&&!media.videoUrl)throw new Error('Inclua texto, uma foto ou um vídeo.');
    const uid=me(),key=postDraftKey(),originalDraft=readPostDraft(key);
    const groupId=state.composingGroup,eventRecapId=state.composingRecapId,introduction=state.composingIntroduction;
    if(eventRecapId){
      const event=state.events.find(item=>item.id===eventRecapId);
      if(!canComposeEventRecap(event)||event.groupId!==groupId)throw new Error('Este encontro não está mais disponível para publicar um relato.');
    }
    const mediaFields=Object.fromEntries(Object.entries(media).filter(([,value])=>value));
    await firebase.addDoc(col('posts'),{userId:me(),userName:myName(),userAvatar:state.profile.avatar,location:myLocation(),hobby:val('hobby'),content,...mediaFields,format:val('format'),likes:[],createdAt:now(),...(groupId?{groupId}:{}),...(eventRecapId?{eventRecapId}:{}),...(groupId&&introduction?{groupIntroduction:true}:{})});
    const saved=readPostDraft(key);
    if(key&&originalDraft?.content===data.content&&Object.keys(media).every(name=>originalDraft[name]===(data[name]||''))&&JSON.stringify(saved)===JSON.stringify(originalDraft))removePostDraft(key);
    if(me()!==uid)return;
    if(groupId===state.invitedGroupId)state.invitedGroupId=null;
    if(groupId===state.groupFirstStepsId&&introduction)state.groupFirstStepsId=null;
    closeModal();setTab(groupId?'groups':'home');
    if(groupId){state.selectedGroup=groupId;openModal('group-detail');}
    showToast('Sua publicação está no ar!');
  });return;
  case 'saved-note-form':await attempt(async()=>{
    const uid=me(),id=state.savedNotePostId,note=val('note');
    if(!uid||state.modal!=='edit-saved-note'||!state.savedIds.includes(id)||note.length>500)return;
    if(note!==(state.savedNotes.get(id)||'')){
      await firebase.updateDoc(ref('members',uid,'saved',id),{note});
      if(me()!==uid)return;
      showToast(note?'Nota salva.':'Nota apagada.');
    }
    if(state.savedNotePostId===id&&state.modal==='edit-saved-note')closeModal();
  });return;
  case 'rename-saved-collection-form':await attempt(async()=>{
    const uid=me(),id=state.editingSavedCollectionId,name=val('name');
    const collection=state.savedCollections.find(item=>item.id===id);
    if(!uid||state.modal!=='rename-saved-collection'||!collection||!name||name.length>60)return;
    if(name!==collection.name){
      await firebase.updateDoc(ref('members',uid,'savedCollections',id),{name});
      if(me()!==uid)return;
      showToast('Coleção renomeada.');
    }
    if(state.editingSavedCollectionId===id&&state.modal==='rename-saved-collection')closeModal();
  });return;
  case 'saved-collection-form':await attempt(async()=>{
    const uid=me(),name=val('name'),postId=state.collectionPostId;
    if(!uid||state.modal!=='create-saved-collection'||!name||name.length>60)return;
    await firebase.addDoc(col('members',uid,'savedCollections'),{name,createdAt:firebase.serverTimestamp()});
    if(me()===uid&&state.modal==='create-saved-collection'){
      if(state.savedSelection?.size)openModal('bulk-saved-collection');
      else if(postId&&state.savedIds.includes(postId))openModal('manage-saved-collections');
      else closeModal();
      showToast('Coleção criada.');
    }
  });return;
  case 'group-form':await attempt(async()=>{
    const name=val('name');if(name.length<3)return;
    await firebase.addDoc(col('groups'),{name,hobby:val('hobby'),description:val('description'),location:val('location'),createdBy:me(),members:[me()],createdAt:now()});
    closeModal();state.groupView='mine';setTab('groups');showToast('Comunidade criada com sucesso!');
  });return;
  case 'save-event-search-form':await attempt(async()=>{
    const uid=me(),name=val('name'),search=currentEventSearch();
    if(!uid||state.modal!=='saved-event-searches'||!state.savedEventSearchesLoaded||!name||name.length>60||!Object.values(search).some(Boolean))return;
    await firebase.addDoc(col('members',uid,'savedEventSearches'),{name,...search});
    if(me()!==uid)return;
    clearSubmittedDraft(form.id,form.id,'name',data.name);
    showToast('Busca salva.');
  });return;
  case 'event-hobby-alert-form':await attempt(async()=>{
    const uid=me(),hobby=val('hobby'),scope=val('scope');
    if(!uid||state.modal!=='event-hobby-alerts'||!state.eventHobbyAlertsLoaded||
       !TOPICS.some(topic=>topic.name===hobby)||!Object.hasOwn(eventHobbyAlertScopes,scope))return;
    if(state.eventHobbyAlerts.get(hobby)?.scope===scope)return;
    await firebase.setDoc(ref('members',uid,'eventHobbyAlerts',hobby),{scope,since:firebase.serverTimestamp()});
    if(me()===uid)showToast('Alerta salvo.');
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
    const city=format==='online'?'':val('city');
    if(format==='online'&&!validEventRoomUrl(roomUrl))throw new Error('Informe um link HTTPS válido para a sala.');
    if(!location)throw new Error('Informe o local do encontro.');
    validateEventEndTime(time,endTime);
    const fields={...(limit?{capacity,waitlist:[],offerAt:null}:{}),title:val('title'),date:val('date'),time,...(endTime?{endTime}:{}),...(timeZone?{timeZone}:{}),hobby:val('hobby'),format,location,...(city?{city}:{}),description:val('description'),createdBy:uid,attendees:[uid],createdAt:now(),...(groupId?{groupId}:{})};
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
    const city=format==='online'?'':val('city');
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
      const cityChanged=city!==(latest.city||'');
      if(!cityChanged&&date===latest.date&&time===latest.time&&endTime===(latest.endTime||'')&&timeZone===(latest.timeZone||'')&&location===latest.location&&format===latest.format&&
         (format!=='online'||previousRoom===roomUrl))return false;
      const revision=(latest.revision||0)+1;
      const previousLocation=format==='online'&&/https?:\/\/|www\./i.test(latest.location)?'Online':latest.location;
      const previousSchedule={date:latest.date,time:latest.time,endTime:latest.endTime||'',timeZone:latest.timeZone||'',location:previousLocation,revision,...(cityChanged?{city:latest.city||''}:{})};
      transaction.update(target,{date,time,endTime,timeZone,format,location,...(cityChanged?{city}:{}),previousSchedule,revision,scheduleChangedAt:firebase.serverTimestamp()});
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
    const media=readSharedMediaFields(val);
    await firebase.updateDoc(memberRef(me()),{name,location,avatar:avatarValue,bio:val('bio'),hobbies,...media});
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
    const text=val('text'),postId=state.selectedPost,uid=me(),parentId=state.commentReplyId;
    if(!uid||!text||text.length>800||!postId||state.modal!=='comments')return;
    const parent=parentId&&state.comments.find(item=>item.id===parentId&&!item.parentId);
    if(parentId&&!parent)throw new Error('Este comentário não está mais disponível.');
    const comment=firebase.doc(col('posts',postId,'comments'));
    const owner=parent?parent.userId:state.posts.find(post=>post.id===postId)?.userId;
    const type=parent?'comment-reply':'comment';
    const batch=firebase.writeBatch(db);
    batch.set(comment,{userId:uid,userName:myName(),text,createdAt:now(),...(parent?{parentId}:{})});
    if(owner&&owner!==uid)batch.set(ref('members',owner,'notifications',`${type}-${postId}:${comment.id}`),notificationFields(type,postId,comment.id));
    await batch.commit();
    if(me()!==uid)return;
    const group=state.groups.find(item=>item.id===state.invitedGroupId);
    if(group?.pinnedPostId===postId)state.invitedGroupId=null;
    clearSubmittedDraft(form.id,form.dataset.draftKey,'text',data.text);
    if(state.selectedPost===postId&&state.modal==='comments'){
      if(parentId)state.expandedCommentReplies.add(parentId);
      if(state.commentReplyId===parentId)state.commentReplyId=null;
    }
    showToast(parent?'Resposta publicada!':'Comentário publicado!');
  });return;
  case 'delete-direct-message-form':await attempt(async()=>{
    const editor=state.directMessageEditor,uid=me();
    if(!editor||state.modal!=='delete-direct-message'||state.chatMode!=='direct'||state.chatTarget?.uid!==editor.peer)return;
    const target=firebase.doc(directMessagesCol(threadId(uid,editor.peer)),editor.id);
    await firebase.runTransaction(db,async transaction=>{
      const message=(await transaction.get(target)).data();
      if(message?.deletedAt)return;
      if(!canEditDirectMessage(message))throw new Error('O prazo para apagar esta mensagem terminou.');
      transaction.update(target,{text:'',deletedAt:firebase.serverTimestamp()});
    });
    if(me()!==uid)return;
    if(state.directMessageEditor===editor&&state.modal==='delete-direct-message')closeModal();
    showToast('Mensagem apagada para todos.');
  },'busy','Não foi possível apagar esta mensagem.');return;
  case 'edit-direct-message-form':await attempt(async()=>{
    const editor=state.directMessageEditor,uid=me(),text=val('text');
    if(!editor||state.modal!=='edit-direct-message'||state.chatMode!=='direct'||state.chatTarget?.uid!==editor.peer||!text||text.length>1500)return;
    if(text!==editor.text){
      const target=firebase.doc(directMessagesCol(threadId(uid,editor.peer)),editor.id);
      await firebase.runTransaction(db,async transaction=>{
        const current=await transaction.get(target);
        const message=current.data();
        if(!canEditDirectMessage(message))throw new Error('O prazo para editar esta mensagem terminou.');
        if(message.text!==editor.text)throw new Error('A mensagem mudou em outro dispositivo. Feche a edição e abra novamente.');
        transaction.update(target,{text,editedAt:firebase.serverTimestamp()});
      });
      if(me()===uid)showToast('Mensagem editada.');
    }
    if(me()===uid&&state.directMessageEditor===editor&&state.modal==='edit-direct-message')closeModal();
  },'busy','Não foi possível editar esta mensagem.');return;
  case 'event-chat-share-form':await sendEventChatInvites();return;
  case 'message-form':await attempt(async()=>{
    const text=val('message');if(!text)return;
    const key=form.dataset.draftKey;
    const payload={senderId:me(),senderName:myName(),text,createdAt:now()};
    if(state.chatMode==='direct'){
      if(!state.chatTarget?.uid||state.blockedIds.includes(state.chatTarget.uid))return;
      const peer=state.chatTarget.uid,draftStorageKey=privateMessageDraftKey(peer);
      const replyTo=state.directReply?.id||'';
      if(replyTo)payload.replyTo=replyTo;
      savePrivateMessageDraft(draftStorageKey,data.message,replyTo);
      await firebase.addDoc(directMessagesCol(threadId(payload.senderId,peer)),payload);
      const saved=readPrivateMessageDraft(draftStorageKey);
      if(!saved||(saved.message===data.message&&saved.replyTo===replyTo)){
        savePrivateMessageDraft(draftStorageKey,'','');
        if(me()===payload.senderId&&state.chatMode==='direct'&&state.chatTarget?.uid===peer&&(state.directReply?.id||'')===replyTo){
          const current=document.getElementById(form.id);
          if(!current||current.dataset.draftKey!==key||current.elements.message.value===data.message)state.directReply=null;
        }
        clearSubmittedDraft(form.id,key,'message',data.message);
      }
    }else{
      const reply=state.communityReply;
      if(reply?.key===communityReadingKey()&&chatMessages().some(message=>message.id===reply.id))payload.replyTo=reply.id;
      await firebase.addDoc(col('messages'),{...payload,location:myLocation(),scope:state.chatMode==='global'?'global':'local'});
      if(state.communityReply===reply)state.communityReply=null;
      clearSubmittedDraft(form.id,key,'message',data.message);
    }
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
