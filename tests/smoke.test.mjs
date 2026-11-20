import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Tests the UI and chat creation logic without real Firebase credentials.
function appContext(handlers = {}) {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8')
    .replace(/\binit\(\);\s*$/, '');
  const context = vm.createContext({
    console, Date, setTimeout, clearTimeout, navigator: {},
    localStorage: { getItem: () => null, setItem: () => {} },
    window: { addEventListener: () => {}, scrollTo: () => {}, scrollY: 0 },
    document: { addEventListener: (event, handler) => { handlers[event] = handler; }, getElementById: () => null }
  });
  vm.runInContext(source, context, {filename: 'app.js', timeout: 1500});
  return context;
}

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
