# HobbyHub 2.0 — instruções de implantação

Versão atualizada da rede social existente, com visual responsivo, publicação com curtidas e comentários, feed global/local/seguindo, perfis, seguidores, grupos com entrada, saída e mural de publicações, eventos com confirmação de interesse, salvamentos, descoberta de hobbies e chats público e privado.

## O que foi preservado

- Firebase Authentication e identificadores públicos do projeto `hubbyhub-98c71`.
- Publicações, comunidades e chat comunitário existentes nas coleções antigas em `artifacts/hubbyhub-98c71/public/data/...`.
- Perfis anteriores são migrados automaticamente para a coleção `members` após login, se o usuário tiver permissão de leitura no documento antigo.
- O uso de GitHub Pages sem servidor próprio; autenticação e dados ficam no Firebase.

## Publicar no GitHub Pages

1. Faça uma cópia de segurança do atual `index.html` do repositório [yirmire/HobbyHub](https://github.com/yirmire/HobbyHub).
2. No GitHub, abra o repositório e carregue **todos** estes arquivos na raiz: `index.html`, `styles.css`, `app.js`, `favicon.svg`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `sw.js`, `firestore.rules` e `README.md`.
3. Confirme que **Settings → Pages** usa a branch `main` e a pasta `/ (root)`.
4. O endereço permanece `https://yirmire.github.io/HobbyHub/`.
5. Verifique se `https://yirmire.github.io` está em **Firebase Console → Authentication → Settings → Authorized domains**. Adicione-o se necessário. Habilite **Email/Password** em Sign-in method.
6. **Passo obrigatório:** no Firebase Console do projeto `hubbyhub-98c71`, abra **Firestore Database → Rules** e publique o conteúdo do arquivo `firestore.rules`. **Não basta fazer upload das regras ao GitHub**. Antes, compare com qualquer regra existente utilizada por outros aplicativos do mesmo projeto — publicar substitui as regras anteriores.
7. Faça testes de cadastro, autenticação, publicação, comentários, entrada em grupos, RSVP, conversa privada entre dois usuários e acesso negado de uma terceira conta. Use os emuladores/testador de regras do Firebase antes de abrir ao público.

## Segurança e limitações

- Os identificadores de configuração do Firebase no `app.js` são públicos por definição; **não são credenciais administrativas**. Nunca publique chaves de serviço ou segredos.
- O `firestore.rules` é uma proposta de endurecimento que **não foi validada contra o Firestore real**. É necessário publicar, testar e ajustar os conjuntos de regras existentes com cuidado.
- Conversas antigas em `public/data/private_messages` **não são migradas**: aquele esquema antigo não separa adequadamente o acesso a mensagens privadas. Restrinja a leitura imediatamente no Firebase e avalie exclusão segura após política de retenção/consentimento.
- A coleção nova de DMs usa `dm_threads/<id>/messages`, com regras baseadas nos participantes. Não é criptografia ponta a ponta.
- Postagens, perfis com cidade, grupos e chat público são acessíveis a qualquer usuário autenticado; use só localização aproximada.
- Denúncias são registradas, mas não existe fila de moderação automatizada, painéis administrativos, recuperação de conta, bloqueio de usuários, notificações push nem verificação de identidade.
- Para lançamento comercial: acrescentar política de privacidade/LGPD, exclusão e exportação de conta, política de moderação e canais de atendimento.
- Autenticação e Firestore dependem da internet e da configuração do projeto Firebase. Ícones do site são embutidos, mas as fontes e módulos Firebase são carregados externamente.
- É um **web app instalável** via manifest e service worker em navegadores compatíveis. O service worker salva apenas a interface pública; as funções sociais e o login ainda exigem conexão. Não é APK Android nativo.
- As publicações e mensagens são apenas texto; upload de imagens requer Firebase Storage, políticas de tamanho/tipo, regras e moderação apropriadas.

## Rodar localmente

Com Node.js: `npx serve .` ou com Python: `python -m http.server 8080` e abra `http://localhost:8080`. Não abra o HTML com `file://`. Se autenticação local falhar, cadastre `localhost` em Authorized domains do Firebase.

## Checagens de aceitação

- [ ] Conta existente consegue entrar e ver dados antigos
- [ ] Novo usuário cadastra nome e cidade
- [ ] Comentários e curtidas aparecem em duas contas
- [ ] Perfil antigo é migrado e atualizado
- [ ] Usuários entram e saem de grupos e RSVP funciona
- [ ] Busca encontra nomes/categorias com acentos ou letras diferentes
- [ ] DMs funcionam entre duas contas; terceira não consegue ler
- [ ] Uma conta não altera perfil/post de outra
- [ ] Desktop, Android, Safari mobile e modo escuro
- [ ] Abertura de denúncias no Console Firebase

## Próximas evoluções recomendadas

1. Painel administrativo e moderação para denúncias, bloqueios e exclusões.
2. Armazenamento de fotos/vídeos moderado, com compressão e proteção contra abuso.
3. Feed por afinidades, sem inventar recomendações como sendo IA.
4. Notificações e eventos integrados ao calendário.
5. PWA com suporte offline e push; depois aplicativo Android/iOS com Capacitor ou React Native.
