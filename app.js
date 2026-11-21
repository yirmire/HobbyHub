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
  threads:[], directMessages:[], comments:[], savedIds:[], followingIds:[], blockedIds:[], receivedTestimonials:[], visibleTestimonials:[], sentTestimonial:null, testimonialStatus:'',
  tab:'home', feed:'all', topic:'Todos', groupTopic:'Todos', eventFilter:'upcoming', search:'', exploreCity:'', exploreHobby:'',
  chatMode:'community', chatTarget:null, selectedPost:null, selectedGroup:null, composingGroup:null, viewUser:null,
  modal:null, authMode:'login', busy:false, openingDirect:false, updatingFollow:false, updatingBlock:false, updatingGroup:false, alerts:[], quizMood:null,
  reportTarget:null,
  groupsLoaded:false,
  eventGroupId:null, selectedEvent:null, eventsLoaded:false,
  invitedGroupId:null, composingIntroduction:false, welcomePending:false, welcomeHobby:'',
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
    queueMicrotask(openLinkedContent);
  },'comunidades');
  subscribe(col('events'), (s)=>{
    state.events=docs(s).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));
    state.eventsLoaded=true;queueMicrotask(openLinkedContent);
  },'eventos');
  subscribe(col('messages'), (s)=>{state.messages=docs(s).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));},'chat da comunidade');
  subscribe(firebase.query(firebase.collection(db,'artifacts',PROJECT,'dm_threads'),firebase.where('participants','array-contains',me())),
    (s)=>{state.threads=docs(s).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));watchLatestIncomingMessages();},'conversas privadas');
  subscribe(col('members',me(),'privateReads'),snapshot=>{
    for(const doc of snapshot.docs)state.privateReadAt.set(doc.id,Math.max(doc.data().lastReadAt||0,state.privateReadAt.get(doc.id)||0));
  },'estado de leitura de mensagens');
  subscribe(col('members',me(),'saved'),(s)=>{state.savedIds=s.docs.map((d)=>d.id);},'itens salvos');
  subscribe(col('members',me(),'following'),(s)=>{state.followingIds=s.docs.map((d)=>d.id);},'pessoas seguidas');
  subscribe(col('members',me(),'blocked'),(s)=>{state.blockedIds=s.docs.map((d)=>d.id);},'pessoas bloqueadas');
  subscribe(col('members',me(),'testimonials'),(s)=>{state.receivedTestimonials=docs(s);},'depoimentos');
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
      state.threads=[];state.savedIds=[];state.followingIds=[];state.blockedIds=[];state.receivedTestimonials=[];state.visibleTestimonials=[];state.sentTestimonial=null;state.testimonialStatus='';state.selectedPost=null;state.chatMode='community';state.chatTarget=null;state.modal=null;
      state.reportTarget=null;state.selectedGroup=null;state.groupsLoaded=false;
      state.eventGroupId=null;state.selectedEvent=null;state.eventsLoaded=false;
      state.invitedGroupId=null;state.composingIntroduction=false;state.welcomePending=justSignedUp;state.welcomeHobby='';
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
function unreadBadge(tab) {
 const count=tab==='messages'?state.threads.filter(thread=>unreadThread(thread.id)).length:0;
 return count?`<span class="unread-count"><span aria-hidden="true">${count>99?'99+':count}</span><span class="sr-only">${count} ${count===1?'conversa não lida':'conversas não lidas'}</span></span>`:'';
}
function renderSidebar() {
  return `<aside class="sidebar">${brand()}<nav class="nav-items" aria-label="Menu principal">${nav.map(([tab,title,ico])=>`<button class="nav-btn ${state.tab===tab?'active':''}" data-action="tab" data-tab="${tab}">${icon(ico)} <span>${title}</span>${unreadBadge(tab)}</button>`).join('')}</nav>
  <div class="sidebar-cta"><button class="btn btn-primary" data-action="compose">${icon('plus')} Nova publicação</button></div>
  <div class="sidebar-footer"><button data-action="theme">${icon(state.dark?'sun':'moon')} ${state.dark?'Tema claro':'Tema escuro'}</button><p>Feito para viver mais daquilo que você ama. ✨</p><small>HobbyHub © ${new Date().getFullYear()}</small></div></aside>`;
}
function renderBottomNav(){
  const items=[['home','Início','home'],['explore','Explorar','compass'],['compose','','plus'],['groups','Grupos','users'],['messages','Chat','chat'],['profile','Perfil','user']];
  return `<nav class="bottom-nav" aria-label="Navegação móvel">${items.map(([tab,title,ico])=>`<button data-action="${tab==='compose'?'compose':'tab'}" ${tab!=='compose'?`data-tab="${tab}"`:'aria-label="Criar publicação"'} class="${state.tab===tab?'active':''} ${tab==='compose'?'add-nav':''}">${icon(ico)}${title?`<span>${title}</span>`:''}${unreadBadge(tab)}</button>`).join('')}</nav>`;
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
 <div class="card right-card"><div class="right-title"><h3>Comunidades em destaque</h3><button data-action="tab" data-tab="groups">Explorar</button></div>
 ${groups.length?groups.map(g=>`<div class="suggestion"><span class="avatar">${emoji(g.hobby)}</span><div style="min-width:0;flex:1"><div class="label">${esc(short(g.name,23))}</div><div class="sublabel">${(g.members||[]).length} membros</div></div></div>`).join(''):'<p class="tip">As primeiras comunidades estão esperando criadores.</p>'}</div>
 </aside>`;
}
function renderLayout() {
 if(!state.profile)return `<div class="splash"><span class="splash-mark">✳</span><h1>HobbyHub</h1><p>Preparando seu perfil...</p>${state.alerts.length?`<div class="error-banner">${esc(state.alerts[0])}</div><button data-action="logout" class="btn btn-outline">Sair da conta</button>`:''}</div>`;
 const content={home:renderHome,explore:renderExplore,groups:renderGroups,events:renderEvents,messages:renderMessages,saved:renderSaved,profile:renderProfile};
 return `<div class="layout">${renderSidebar()}<div class="main-column"><div class="mobile-header">${brand()}<div class="toggle-row"><button data-action="tab" data-tab="saved" class="circle-btn" aria-label="Salvos">${icon('bookmark')}</button><button data-action="theme" class="circle-btn" aria-label="Alternar tema">${icon(state.dark?'sun':'moon')}</button></div></div>
 ${state.alerts.length?`<div class="error-banner">${icon('info')} <span>${esc(state.alerts[0])}</span></div>`:''}
 ${titleBar()}<label class="mobile-search">${icon('search')}<input aria-label="Pesquisar no HobbyHub" placeholder="Buscar pessoas, grupos e publicações..." value="${esc(state.search)}" data-live-search="true"></label>${(content[state.tab]||renderHome)()}</div>${renderRight()}</div>${renderBottomNav()}${renderModal()}`;
}
function topicButtons(selected,action='topic') {return `<div class="topics" aria-label="Interesses">${[{name:'Todos',emoji:'✨'},...TOPICS].map(t=>`<button data-action="${action}" data-topic="${esc(t.name)}" class="topic ${selected===t.name?'active':''}"><span>${t.emoji}</span> ${esc(t.name)}</button>`).join('')}</div>`;}
function postCard(post) {
 const liked=Array.isArray(post.likes)&&post.likes.includes(me()),saved=state.savedIds.includes(post.id);
 const owner=post.userId===me(),author=authorName(post);
 return `<article class="card post"><div class="post-head">${avatar({avatar:member(post.userId)?.avatar || post.userAvatar})}
 <div class="author"><button data-action="person" data-id="${esc(post.userId)}">${esc(author)}</button><small>${icon('map')} ${esc(post.location||'Comunidade')} · ${when(post.createdAt)}</small></div>
 <span class="post-category">${emoji(post.hobby)} ${esc(post.hobby||'Interesses')}</span></div>
 ${post.groupId?`<button class="pill" style="margin-top:14px" data-action="view-group" data-id="${esc(post.groupId)}">${icon('users')} ${esc(short(state.groups.find(g=>g.id===post.groupId)?.name||'Comunidade',34))}</button>`:''}
 <div class="post-copy">${esc(post.content)}</div>
 ${post.format==='highlight'?`<div class="post-visual"><span class="emoji">${emoji(post.hobby)}</span><div><small>Uma paixão, mil possibilidades</small><br><strong>Compartilhe o que faz você feliz.</strong></div></div>`:''}
 <div class="post-stats"><span>${Array.isArray(post.likes)?post.likes.length:0} curtidas</span><span>${esc(post.location||'HobbyHub')}</span></div>
 <div class="post-actions"><button class="post-action ${liked?'liked':''}" data-action="like" data-id="${esc(post.id)}" aria-label="${liked?'Descurtir':'Curtir'}">${icon('heart')} ${liked?'Curtido':'Curtir'}</button>
 <button class="post-action" data-action="comments" data-id="${esc(post.id)}">${icon('chat')} Comentar</button>
 <button class="post-action ${saved?'bookmarked':''}" data-action="save" data-id="${esc(post.id)}">${icon('bookmark')} ${saved?'Salvo':'Salvar'}</button>
 <button class="post-action" data-action="share-post" data-id="${esc(post.id)}" aria-label="Compartilhar publicação">${icon('send')} Compartilhar</button>
 ${owner?`<button class="post-action" data-action="delete-post" data-id="${esc(post.id)}" aria-label="Excluir publicação">${icon('trash')}</button>`:`<button class="post-action" data-action="report-post" data-id="${esc(post.id)}" aria-label="Denunciar publicação" title="Denunciar">${icon('info')}</button>`}</div></article>`;
}
function filteredPosts(posts=state.posts) {
 let found=[...posts];
 if(state.feed==='local'&&state.tab==='home')found=found.filter(p=>locate(p.location));
 if(state.feed==='following'&&state.tab==='home')found=found.filter(p=>state.followingIds.includes(p.userId));
 if(state.topic!=='Todos'&&state.tab==='home')found=found.filter(p=>p.hobby===state.topic);
 const q=norm(state.search);if(q)found=found.filter(p=>norm([p.content,p.hobby,p.location,authorName(p)].join(' ')).includes(q));
 return found.slice(0,120);
}
function renderHome() {
 const feed=filteredPosts();
 return `<section class="hero"><span class="hero-overline">✦ CONECTE-SE PELO QUE VOCÊ AMA</span><h2>O próximo grande encontro começa com um interesse em comum.</h2><p>Encontre pessoas da sua cidade ou de qualquer lugar com as mesmas paixões que você.</p><button class="btn btn-white btn-small" data-action="tab" data-tab="explore">Explorar a comunidade ${icon('arrow')}</button></section>
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
function renderExplore() {
 const q=norm(state.search);
 const candidates=state.members.filter(p=>p.uid&&p.uid!==me());
 const hobbies=new Map(candidates.flatMap(p=>(Array.isArray(p.hobbies)?p.hobbies:[]).filter(h=>typeof h==='string'&&norm(h)).map(h=>[norm(h),h])));
 const cities=new Map(candidates.filter(p=>typeof p.location==='string'&&cityKey(p.location)).map(p=>[cityKey(p.location),p.location]));
 const options=(values,selected)=>[...values].sort((a,b)=>a[1].localeCompare(b[1],'pt-BR')).map(([key,label])=>`<option value="${esc(key)}" ${selected===key?'selected':''}>${esc(label)}</option>`).join('');
 const people=candidates.filter(p=>(!state.exploreCity||cityKey(p.location)===state.exploreCity)
  && (!state.exploreHobby||(p.hobbies||[]).some(h=>norm(h)===state.exploreHobby))
  && (!q||norm([p.name,p.location,p.bio,(p.hobbies||[]).join(' ')].join(' ')).includes(q)));
 const groups=state.groups.filter(g=>!q||norm([g.name,g.hobby,g.location,g.description].join(' ')).includes(q));
 const posts=state.posts.filter(p=>q&&norm([p.content,p.hobby,authorName(p)].join(' ')).includes(q)).slice(0,10);
 return `<div class="card" style="padding:18px;margin-bottom:17px"><label class="field" for="explore-search"><span class="mini muted">Pesquise pessoas, grupos, hobbies e publicações</span><input id="explore-search" class="input" placeholder="Ex.: fotografia, Nova Friburgo, livros..." data-live-search="true" value="${esc(state.search)}"></label></div>
 <div class="section-head"><h2>Pessoas com interesses parecidos</h2><span class="pill">${people.length} perfis</span></div>
 <div class="field-grid" style="margin-bottom:14px"><label class="field">Hobby<select class="select" id="explore-hobby"><option value="">Todos os hobbies</option>${options(hobbies,state.exploreHobby)}</select></label><label class="field">Cidade<select class="select" id="explore-city"><option value="">Todas as cidades</option>${options(cities,state.exploreCity)}</select></label></div>
 ${people.length?`<div style="display:grid;gap:10px">${people.slice(0,20).map(personCard).join('')}</div>`:empty('👋','Sua turma está chegando','Ainda não encontramos perfis com essa busca. Compartilhe o HobbyHub com seus amigos.')}
 <div class="section-head"><h2>Comunidades para explorar</h2><button class="text-action" data-action="tab" data-tab="groups">Ver todas</button></div>
 ${groups.length?`<div class="grid-two">${groups.slice(0,4).map(groupCard).join('')}</div>`:empty('🪴','Nenhum grupo encontrado','Crie uma comunidade para reunir pessoas com esse interesse.','Criar grupo','group')}
 ${q?`<div class="section-head"><h2>Publicações encontradas</h2></div>${posts.length?posts.map(postCard).join(''):empty('🔎','Nenhuma publicação','Tente outra palavra-chave para encontrar mais conteúdo.')}`:''}`;
}
function groupCard(g) {
 const joined=(g.members||[]).includes(me());
 return `<article class="card community-card"><div class="cover ${topicColor(g.hobby)}"><span>${emoji(g.hobby)}</span></div>
 <div><span class="eyebrow">${esc(g.hobby||'Comunidade')}</span><h3 style="margin:6px 0"><button data-action="view-group" data-id="${esc(g.id)}" style="font-weight:800;text-align:left">${esc(g.name)} ${icon('arrow')}</button></h3><p class="card-desc">${esc(g.description||'Um espaço para compartilhar esse interesse.')}</p></div>
 <div class="card-bottom"><span class="card-meta">${icon('users')} ${(g.members||[]).length} membros<br>${esc(g.location||'Online')}</span>
 <button class="btn btn-small ${joined?'btn-outline':'btn-primary'}" data-action="join-group" data-id="${esc(g.id)}">${joined?'Participando':'+ Participar'}</button></div></article>`;
}
function renderGroups(){
 const list=state.groups.filter(g=>state.groupTopic==='Todos'||g.hobby===state.groupTopic).filter(g=>!state.search||norm([g.name,g.hobby,g.description,g.location].join(' ')).includes(norm(state.search)));
 return `<div class="card" style="padding:25px;margin-bottom:19px;background:linear-gradient(115deg,var(--panel),var(--purple2));display:flex;align-items:center;justify-content:space-between;gap:18px"><div><div class="eyebrow">O PODER DE FAZER JUNTO</div><h2 style="font-size:21px;margin:8px 0">Seu hobby merece uma comunidade.</h2><p class="muted mini" style="margin:0">Crie um grupo, faça novas amizades e inspire outras pessoas.</p></div><button class="btn btn-primary btn-small" data-action="group">${icon('plus')} Criar grupo</button></div>
 ${topicButtons(state.groupTopic,'group-topic')}
 <div class="section-head"><h2>Descubra comunidades</h2><span class="pill">${list.length} grupos</span></div>
 ${list.length?`<div class="grid-two">${list.map(groupCard).join('')}</div>`:empty('🧩','A comunidade começa com você','Nenhum grupo encontrado por aqui. Que tal criar o primeiro?','Criar uma comunidade','group')}`;
}
function eventCard(event, inGroup=false, detail=false) {
 const attending=(event.attendees||[]).includes(me());
 const future=event.date>=today();
 const group=state.groups.find(item=>item.id===event.groupId);
 const canJoin=!event.groupId||group?.members?.includes(me());
 return `<article class="card event-card"><div style="display:flex;justify-content:space-between;gap:10px"><span class="event-day">${dateLabel(event.date)} ${esc(event.time||'')}</span><span class="post-category">${emoji(event.hobby)} ${esc(event.hobby||'Outros')}</span></div>
 ${detail?'':`<h3><button class="text-action" data-action="view-event" data-id="${esc(event.id)}">${esc(event.title)}</button></h3>`}<p>${esc(detail?event.description:short(event.description||'Encontre pessoas com os mesmos interesses.',115))}</p>
 <div class="card-meta">${icon('map')} ${esc(event.location||'Online')}</div>
 ${group&&!inGroup?`<button class="text-action" data-action="view-group" data-id="${esc(group.id)}">${esc(group.name)}</button>`:''}
 <div class="card-bottom"><span class="card-meta">${icon('users')} ${(event.attendees||[]).length} interessados</span>
 <button data-action="rsvp" data-id="${esc(event.id)}" class="btn btn-small ${attending?'btn-outline':'btn-primary'}" ${!attending&&(!future||!canJoin)?'disabled':''}>${attending?'Confirmado ✓':!future?'Encerrado':!canJoin?'Só para membros':event.groupId?'Confirmar presença':'Tenho interesse'}</button></div></article>`;
}
function renderEvents() {
 const day=today();
 const events=state.events.filter(e=>state.eventFilter==='all'||(state.eventFilter==='mine'?(e.attendees||[]).includes(me()):(e.date||'')>=day));
 return `<div class="hero" style="min-height:200px;background:linear-gradient(115deg,#fe956e,#ed7099)"><span class="hero-overline">SAIA DO FEED, VIVA A EXPERIÊNCIA</span><h2>Conexões que saem da tela.</h2><p>Crie um encontro de leitura, uma caminhada ou uma sessão de games.</p><button class="btn btn-white btn-small" data-action="event">${icon('plus')} Criar evento</button></div>
 <div class="filters">${[['upcoming','Próximos'],['mine','Tenho interesse'],['all','Todos']].map(([id,title])=>`<button class="filter ${state.eventFilter===id?'active':''}" data-action="event-filter" data-value="${id}">${title}</button>`).join('')}</div>
 ${events.length?`<div class="grid-two">${events.map(event=>eventCard(event)).join('')}</div>`:empty('🗓️','Nada marcado ainda','Seja a primeira pessoa a transformar uma conversa em um encontro.','Criar evento','event')}
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
 <div class="section-head"><h2>Pessoas bloqueadas</h2></div>
 <div class="card" style="padding:16px">${state.blockedIds.length?state.blockedIds.map(uid=>`<div class="toggle-row"><span>${esc(member(uid)?.name||'Perfil indisponível')}</span>${blockButton(uid)}</div>`).join(''):'<p class="tip">Nenhuma pessoa bloqueada.</p>'}</div>
 <div class="section-head"><h2>Depoimentos recebidos</h2></div>
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
function modalWrap(title,content){return `<div class="overlay" data-overlay="true"><section class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header class="modal-head"><h2>${esc(title)}</h2><button class="circle-btn" data-action="close" aria-label="Fechar">${icon('x')}</button></header>${content}</section></div>`;}
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
 <div class="toggle-row" style="flex-wrap:wrap"><button type="button" class="btn btn-outline" data-action="tab" data-tab="groups">Ver comunidades</button><button type="button" class="btn btn-ghost" data-action="tab" data-tab="home">Pular e ir ao feed</button></div>`);
}
function renderModal() {
 if(!state.modal)return '';
 if(state.modal==='first-visit')return renderFirstVisit();
 if(state.modal==='event-detail'){
   const event=state.events.find(item=>item.id===state.selectedEvent);
   if(!event)return modalWrap('Evento indisponível','<p>Este evento não está mais disponível.</p>');
   const group=state.groups.find(item=>item.id===event.groupId);
   const joined=group?.members?.includes(me());
   return modalWrap(event.title,`${eventCard(event,false,true)}
   ${group&&!joined&&event.date>=today()?`<div class="card" style="margin:12px 0;padding:12px"><p>Participe de ${esc(group.name)} para confirmar presença.</p><button class="btn btn-primary btn-small" data-action="join-group" data-id="${esc(group.id)}">Participar da comunidade</button></div>`:''}
   <div class="toggle-row" style="margin-top:14px;flex-wrap:wrap"><button class="btn btn-outline btn-small" data-action="copy-event-link" data-id="${esc(event.id)}">Copiar link do evento</button>${(event.attendees||[]).includes(me())?`<button class="btn btn-soft btn-small" data-action="event-calendar" data-id="${esc(event.id)}">Adicionar ao calendário</button>`:''}</div>`);
 }
 if(state.modal==='compose')return modalWrap(state.composingIntroduction?'Apresente-se à comunidade':state.composingGroup?'Publicar na comunidade':'Criar publicação',`<form id="post-form" data-draft="true" class="form-stack"><div class="toggle-row">${avatar(state.profile)}<div><strong style="font-size:13px">${esc(myName())}</strong><div class="muted mini">Compartilhando com a comunidade</div></div></div>
 ${state.composingGroup?`<span class="pill">${icon('users')} ${esc(state.groups.find(g=>g.id===state.composingGroup)?.name||'Comunidade')}</span>`:''}
 <div class="field"><label for="post-content">${state.composingIntroduction?'Como você quer se apresentar?':'O que você gostaria de compartilhar?'}</label><textarea id="post-content" class="textarea" name="content" required maxlength="2000" placeholder="${state.composingIntroduction?'Conte o que você gosta de fazer e o que gostaria de aprender com o grupo.':'Conte sua experiência, uma conquista, uma dúvida ou algo que fez você feliz...'}"></textarea></div>
 <div class="field-grid"><div class="field"><label>Seu interesse</label>${topicSelect(state.composingGroup?state.groups.find(g=>g.id===state.composingGroup)?.hobby:(state.topic==='Todos'?'Arte':state.topic))}</div><div class="field"><label>Formato</label><select class="select" name="format"><option value="text">Post simples</option><option value="highlight">Post em destaque</option></select></div></div>
 <div class="tip">A publicação pode ser vista por outras pessoas cadastradas. Não compartilhe dados pessoais sensíveis.</div>
 <div class="form-actions"><button class="btn btn-ghost" type="button" data-action="close">Cancelar</button><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>${icon('send')} Publicar</button></div></form>`);
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
 <strong class="mini">${esc(authorName(post))}</strong><p class="mini" style="margin:8px 0">${esc(short(post.content,280))}</p>
 <div class="toggle-row"><button class="btn btn-soft btn-small" data-action="comments" data-id="${esc(post.id)}">${icon('chat')} Responder</button>${group.createdBy===me()?`<button class="btn btn-outline btn-small" data-action="${isPinned?'unpin-group-post':'pin-group-post'}" data-id="${esc(post.id)}">${isPinned?'Desafixar':'Fixar no grupo'}</button>`:''}</div></article>`;
 return modalWrap(group.name,`<div class="cover ${topicColor(group.hobby)}" style="height:126px"><span>${emoji(group.hobby)}</span></div>
 <p class="eyebrow" style="margin:15px 0 8px">${esc(group.hobby)} · ${esc(group.location||'Online')}</p><p class="muted" style="font-size:13px">${esc(group.description||'Encontre pessoas que amam esse hobby.')}</p>
 ${welcoming?`<section class="card" style="padding:16px;margin:14px 0"><h3>${joined?'Faça sua primeira contribuição':'Participe desta comunidade'}</h3>
 <p class="mini muted">${joined?pinned?'Responda à publicação fixada ou se apresente ao grupo.':'Conte ao grupo o que você gosta de fazer e o que quer aprender.':'Entre para publicar, conversar sobre o hobby e conhecer quem já participa.'}</p>
 <div class="toggle-row" style="flex-wrap:wrap">${joined?`${pinned?`<button class="btn btn-primary btn-small" data-action="comments" data-id="${esc(pinned.id)}">Responder à publicação fixada</button>`:''}<button class="btn ${pinned?'btn-outline':'btn-primary'} btn-small" data-action="introduce-group" data-id="${esc(group.id)}">Se apresentar</button>`:`<button class="btn btn-primary btn-small" data-action="join-group" data-id="${esc(group.id)}">Participar</button>`}</div></section>`:''}
 <div class="toggle-row" style="margin:18px 0;flex-wrap:wrap"><span class="pill">${icon('users')} ${(group.members||[]).length} membros</span>${joined||!welcoming?`<button class="btn btn-small ${joined?'btn-outline':'btn-primary'}" data-action="join-group" data-id="${esc(group.id)}">${joined?'Sair do grupo':'+ Participar'}</button>`:''}<button class="btn btn-outline btn-small" data-action="copy-group-invite" data-id="${esc(group.id)}">Copiar convite</button>${joined?`<button class="btn btn-soft btn-small" data-action="group-post" data-id="${esc(group.id)}">${icon('plus')} Publicar</button>`:''}</div>
 ${pinned?renderGroupPost(pinned,true):''}
 <div class="section-head"><h2>Próximos eventos</h2>${joined?`<button class="text-action" data-action="group-event" data-id="${esc(group.id)}">${icon('plus')} Criar evento</button>`:''}</div>
 ${events.length?events.map(event=>eventCard(event,true)).join(''):'<p class="tip">Nenhum encontro marcado ainda.</p>'}
 <div class="section-head"><h2>Conversas do grupo</h2><span class="pill">${posts.length} posts recentes</span></div>
 ${posts.length?posts.map(post=>renderGroupPost(post)).join(''):pinned?'':empty('💡','Uma conversa pode começar aqui',joined?'Compartilhe a primeira publicação da comunidade.':'Participe para trocar ideias com esta comunidade.',joined?'Publicar no grupo':'',joined?'group-post':'group')}
 `);
 }
 if(state.modal==='group')return modalWrap('Criar comunidade',`<form id="group-form" data-draft="true" class="form-stack"><div class="field"><label>Nome do grupo</label><input class="input" name="name" required minlength="3" maxlength="75" placeholder="Ex.: Fotógrafos da Serra"></div><div class="field"><label>Principal hobby</label>${topicSelect()}</div><div class="field"><label>Descrição</label><textarea class="textarea" name="description" maxlength="600" required placeholder="Que tipo de experiências vocês querem compartilhar?"></textarea></div><div class="field"><label>Cidade ou região</label><input class="input" name="location" maxlength="90" value="${esc(myLocation())}" required></div><div class="form-actions"><button class="btn btn-ghost" type="button" data-action="close">Cancelar</button><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>Criar grupo ${icon('arrow')}</button></div></form>`);
 if(state.modal==='event'){
 const eventGroup=state.groups.find(group=>group.id===state.eventGroupId);
 return modalWrap(eventGroup?`Evento em ${eventGroup.name}`:'Organizar encontro',`<form id="event-form" data-draft="true" class="form-stack"><div class="field"><label>Título do evento</label><input class="input" name="title" maxlength="90" minlength="3" required placeholder="Ex.: Caminhada fotográfica na praça"></div>
 <div class="field-grid"><div class="field"><label>Dia</label><input class="input" type="date" name="date" required min="${today()}"></div><div class="field"><label>Horário</label><input class="input" name="time" type="time" required></div></div>
 <div class="field"><label>Interesse</label>${topicSelect(eventGroup?.hobby)}</div><div class="field"><label>Local (espaço público ou online)</label><input class="input" name="location" maxlength="120" required placeholder="Ex.: Praça central, Nova Friburgo"></div>
 <div class="field"><label>Descrição</label><textarea class="textarea" name="description" maxlength="800" required placeholder="O que vai acontecer e o que as pessoas precisam saber?"></textarea></div>
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
 return modalWrap('Conversas sobre a publicação',`${post?`<div class="card" style="padding:15px;margin-bottom:19px"><strong style="font-size:12px">${esc(authorName(post))}</strong><p class="mini" style="margin:8px 0 0">${esc(short(post.content,220))}</p></div>`:''}
 <div class="comment-list">${state.comments.length?state.comments.map(c=>`<div class="comment">${avatar({avatar:member(c.userId)?.avatar||'💬'})}<div class="comment-body"><strong>${esc(member(c.userId)?.name||c.userName||'Pessoa')}</strong><p>${esc(c.text)}</p><small>${when(c.createdAt)}</small></div>${c.userId===me()?`<button data-action="delete-comment" data-id="${esc(c.id)}" aria-label="Excluir comentário">${icon('trash')}</button>`:''}</div>`).join(''):'<p class="tip">Ainda não há comentários. Comece a conversa!</p>'}</div>
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
 const label={post:'publicação',profile:'perfil',testimonial:'depoimento',communityMessage:'mensagem',privateMessage:'mensagem'}[target.targetType];
 return modalWrap(`Denunciar ${label}`,`<p class="tip">${target.targetType==='privateMessage'?'A equipe de moderação receberá apenas a mensagem selecionada, o motivo e os detalhes que você incluir.':'A denúncia será revisada pela equipe de moderação.'}</p>
 ${target.targetText?`<blockquote class="card" style="padding:12px;margin:12px 0">${esc(short(target.targetText,280))}</blockquote>`:''}
 <form id="report-form" data-draft="true" class="form-stack"><label class="field">Motivo<select name="reason" class="select"><option>Spam</option><option>Assédio ou ofensa</option><option>Golpe ou fraude</option><option>Conteúdo impróprio</option><option>Outro</option></select></label><label class="field">Detalhes (opcional)<textarea class="textarea" name="details" maxlength="500" placeholder="Descreva o problema..."></textarea></label><button class="btn btn-primary" type="submit" ${state.busy?'disabled':''}>Enviar denúncia</button></form>`);
 }
 return '';
}
function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function captureDrafts(){
 document.querySelectorAll('form[data-draft]').forEach(f=>{
   const values={};f.querySelectorAll('input[name],textarea[name],select[name]').forEach(el=>{values[el.name]=el.value;});
   state.drafts.set(f.dataset.draftKey||f.id,values);
 });
}
function restoreDrafts(){
 document.querySelectorAll('form[data-draft]').forEach(f=>{
   const values=state.drafts.get(f.dataset.draftKey||f.id);if(!values)return;
   f.querySelectorAll('input[name],textarea[name],select[name]').forEach(el=>{if(Object.hasOwn(values,el.name))el.value=values[el.name];});
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
function render() {
 const container=root();if(!container)return;
 const active=document.activeElement;
 const focusId=active?.id||null;
 const cursor=active&&typeof active.selectionStart==='number'?{start:active.selectionStart,end:active.selectionEnd}:null;
 const chatLog=document.getElementById('chat-log');const wasNearBottom=chatLog?chatLog.scrollHeight-chatLog.scrollTop-chatLog.clientHeight<75:false;
 const chatScroll=chatLog?.scrollTop||0;const pageScroll=window.scrollY;
 captureDrafts();document.body.classList.toggle('dark',state.dark);
 container.innerHTML=state.boot?`<div class="splash"><span class="splash-mark">✳</span><h1>HobbyHub</h1><p>Conectando suas paixões...</p></div>`:
 state.initError?`<div class="splash"><span class="splash-mark">✳</span><h2>Não conseguimos conectar</h2><p>${esc(state.initError)}</p><button class="btn btn-primary" data-action="reload">Tentar novamente</button></div>`:
 !state.user?renderAuth():renderLayout();
 restoreDrafts();
 if(focusId){const next=document.getElementById(focusId);if(next&&document.activeElement!==next){next.focus({preventScroll:true});if(cursor&&typeof next.setSelectionRange==='function')try{next.setSelectionRange(cursor.start,cursor.end);}catch{}}}
 const nextChat=document.getElementById('chat-log');if(nextChat)nextChat.scrollTop=wasNearBottom?nextChat.scrollHeight:chatScroll;
 window.scrollTo({top:pageScroll,behavior:'instant'});
}
function clearContentLink(){
 if(/^#(?:post|group|event)=/.test(window.location.hash)){
   window.history.replaceState(null,'',window.location.pathname+window.location.search);
 }
}
function closeModal(){
 clearContentLink();
 document.querySelector('.overlay')?.remove();state.drafts.clear();state.modal=null;state.reportTarget=null;state.selectedPost=null;state.selectedGroup=null;state.composingGroup=null;state.composingIntroduction=false;state.viewUser=null;if(state.commentUnsub){state.commentUnsub();state.commentUnsub=null;}state.comments=[];render();void markOpenConversationRead();}
function openModal(name){state.drafts.clear();state.modal=name;render();}
function setTab(tab){clearContentLink();state.welcomePending=false;state.tab=tab;state.modal=null;state.drafts.clear();render();void markOpenConversationRead();window.scrollTo({top:0,behavior:'instant'});}
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
   state.tab='events';state.selectedEvent=id;openModal('event-detail');
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
function calendarFile(event, stamp=new Date()) {
 const escapeText=value=>String(value??'').replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/[,;]/g,character=>'\\'+character);
 const link=contentLink('event',event.id);
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//HobbyHub//Eventos//PT-BR','BEGIN:VEVENT',
   `UID:${escapeText(event.id)}@${window.location.hostname}`,
   `DTSTAMP:${stamp.toISOString().replace(/[-:]|\.\d{3}/g,'')}`,
   `DTSTART:${event.date.replace(/-/g,'')}T${event.time.replace(':','')}00`,
   `SUMMARY:${escapeText(event.title)}`,`LOCATION:${escapeText(event.location)}`,
   `DESCRIPTION:${escapeText([event.description,link].filter(Boolean).join('\n'))}`,`URL:${link}`,'END:VEVENT','END:VCALENDAR'];
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
function downloadEventCalendar(event) {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(event.date)||!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(event.time)){
   showToast('O evento precisa de uma data e um horário válidos.',true);return;
 }
 const url=URL.createObjectURL(new Blob([calendarFile(event)],{type:'text/calendar;charset=utf-8'}));
 const link=document.createElement('a');
 link.href=url;link.download='evento-hobbyhub.ics';
 document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function openComments(postId){
 if(!state.posts.some(p=>p.id===postId))return;
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
  case 'group-topic':state.groupTopic=btn.dataset.topic;render();return;
  case 'event-filter':state.eventFilter=btn.dataset.value;render();return;
  case 'compose':state.composingGroup=null;state.composingIntroduction=false;openModal('compose');return;
  case 'group':openModal(action);return;
  case 'event':state.eventGroupId=null;openModal('event');return;
  case 'view-event':state.selectedEvent=id;openModal('event-detail');return;
  case 'copy-event-link':
    if(state.events.some(event=>event.id===id))await copyContentLink(contentLink('event',id),'Link do evento copiado!','Copie o link do evento:');
    return;
  case 'event-calendar':{
    const event=state.events.find(item=>item.id===id);
    if(event?.attendees?.includes(me()))downloadEventCalendar(event);
    return;
  }
  case 'group-event':{
    const group=state.groups.find(item=>item.id===id);
    if(!group?.members?.includes(me()))return;
    state.eventGroupId=id;openModal('event');return;
  }
  case 'view-group':state.selectedGroup=id;openModal('group-detail');return;
  case 'view-welcome-group':
    if(!state.groups.some(group=>group.id===id))return;
    state.tab='groups';state.selectedGroup=id;state.invitedGroupId=id;openModal('group-detail');return;
  case 'copy-group-invite':await copyGroupInvite(id);return;
  case 'pin-group-post':
  case 'unpin-group-post':await attempt(async()=>{
    const group=state.groups.find(g=>g.id===state.selectedGroup);
    if(!group||group.createdBy!==me())return;
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
    state.composingGroup=group.id;state.composingIntroduction=action==='introduce-group';openModal('compose');return;
  }
  case 'close':closeModal();return;
  case 'edit-profile':openModal('edit-profile');return;
  case 'quiz':state.quizMood=null;openModal('quiz');return;
  case 'quiz-mood':state.quizMood=btn.dataset.value;render();return;
  case 'quiz-topic':{const value=btn.dataset.topic;closeModal();state.search=value;setTab('explore');return;}
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
    else{await firebase.setDoc(target,{createdAt:now()});showToast('Agora você está seguindo esta pessoa!');}
  },'updatingFollow');return;
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
    const joined=(group.members||[]).includes(me());
    await firebase.updateDoc(ref('groups',id),{members:joined?firebase.arrayRemove(me()):firebase.arrayUnion(me())});
    showToast(joined?'Você saiu da comunidade.':'Bem-vindo à comunidade!');
  },'updatingGroup');return;
  case 'rsvp':await attempt(async()=>{
    const event=state.events.find(e=>e.id===id);if(!event)return;
    const attending=(event.attendees||[]).includes(me());
    if(!attending&&(event.date<today()||(event.groupId&&!state.groups.find(group=>group.id===event.groupId)?.members?.includes(me()))))return;
    await firebase.updateDoc(ref('events',id),{attendees:attending?firebase.arrayRemove(me()):firebase.arrayUnion(me())});
    showToast(attending?'Participação removida.':event.groupId?'Presença confirmada!':'Sua participação foi marcada como interesse!');
  });return;
  case 'delete-post':if(!confirm('Excluir esta publicação definitivamente?'))return;
    await attempt(async()=>{await firebase.deleteDoc(ref('posts',id));showToast('Publicação excluída.');});return;
  case 'delete-comment':if(!confirm('Excluir este comentário?'))return;
    await attempt(async()=>{await firebase.deleteDoc(ref('posts',state.selectedPost,'comments',id));showToast('Comentário excluído.');});return;
  case 'report-post':openReport('post',id);return;
  case 'report-content':openReport(btn.dataset.type,id);return;
  default:return;
 }
}
document.addEventListener('click',async(event)=>{
 const button=event.target.closest('[data-action]');if(button){event.preventDefault();await onAction(button);return;}
 if(event.target.matches('[data-overlay="true"]'))closeModal();
});
document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&state.modal)closeModal();});
document.addEventListener('visibilitychange',()=>void markOpenConversationRead());
document.addEventListener('change',(event)=>{
 if(event.target.id==='explore-hobby')state.exploreHobby=event.target.value;
 else if(event.target.id==='explore-city')state.exploreCity=event.target.value;
 else if(event.target.id==='welcome-hobby')state.welcomeHobby=event.target.value;
 else return;
 render();
});
window.addEventListener('hashchange',openLinkedContent);
document.addEventListener('input',(event)=>{
 if(event.target.matches('[data-live-search="true"]')){state.search=event.target.value;render();}
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
  case 'post-form':await attempt(async()=>{
    const content=val('content');if(!content||content.length>2000)return;
    const groupId=state.composingGroup;
    await firebase.addDoc(col('posts'),{userId:me(),userName:myName(),userAvatar:state.profile.avatar,location:myLocation(),hobby:val('hobby'),content,format:val('format'),likes:[],createdAt:now(),...(groupId?{groupId}:{})});
    if(groupId===state.invitedGroupId)state.invitedGroupId=null;
    closeModal();setTab(groupId?'groups':'home');
    if(groupId){state.selectedGroup=groupId;openModal('group-detail');}
    showToast('Sua publicação está no ar!');
  });return;
  case 'group-form':await attempt(async()=>{
    const name=val('name');if(name.length<3)return;
    await firebase.addDoc(col('groups'),{name,hobby:val('hobby'),description:val('description'),location:val('location'),createdBy:me(),members:[me()],createdAt:now()});
    closeModal();setTab('groups');showToast('Comunidade criada com sucesso!');
  });return;
  case 'event-form':await attempt(async()=>{
    if(val('date')<today())throw new Error('A data deve ser hoje ou no futuro.');
    const groupId=state.eventGroupId;
    await firebase.addDoc(col('events'),{title:val('title'),date:val('date'),time:val('time'),hobby:val('hobby'),location:val('location'),description:val('description'),createdBy:me(),attendees:[me()],createdAt:now(),...(groupId?{groupId}:{})});
    closeModal();setTab(groupId?'groups':'events');
    if(groupId){state.selectedGroup=groupId;openModal('group-detail');}
    showToast('Evento criado! Convide sua comunidade.');
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
    await firebase.addDoc(col('posts',postId,'comments'),{userId:me(),userName:myName(),text,createdAt:now()});
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
  },'busy',state.chatMode==='direct'?'Não foi possível enviar uma mensagem nesta conversa.':undefined);return;
  case 'report-form':await attempt(async()=>{
    const target=state.reportTarget;
    if(!target||!me())return;
    await firebase.addDoc(col('reports'),{...target,reporterId:me(),reason:val('reason'),details:val('details'),createdAt:now()});
    if(state.modal==='report'&&state.reportTarget===target)closeModal();
    showToast('Denúncia registrada para análise.');
  });return;
  default:return;
 }
});
if ('serviceWorker' in navigator) {window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(error=>console.warn('Service Worker:',error)));}
init();
