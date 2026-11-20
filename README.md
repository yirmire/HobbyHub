# HobbyHub 2.0 — instruções de implantação

Versão atualizada da rede social existente, com visual responsivo, publicação com curtidas e comentários, feed global/local/seguindo, perfis, seguidores, grupos com entrada, saída e mural de publicações, eventos com confirmação de interesse, salvamentos, descoberta de hobbies e chats público e privado.

## Atualizações da versão 2.1 — autenticação e chat

- A tela de login inclui **Esqueci minha senha**, com envio de link pelo Firebase Authentication para o e-mail cadastrado.
- O início de uma conversa privada usa uma transação do Firestore para não sobrescrever um chat já existente e evitar conflito quando dois participantes iniciam ao mesmo tempo.
- Rode `node --check app.js` e `node --test tests/*.test.mjs` com Node.js 22. Um workflow do GitHub Actions também executa os testes em pull requests.
- Os testes automáticos não usam Firebase real: verifique login, envio de recuperação, permissões e conversas com duas contas reais antes de liberar ao público.
- O arquivo `firestore.rules` no repositório **não é publicado automaticamente** no Firebase Console. Valide as regras no emulador e publique pelo Console sem apagar permissões legítimas de outras aplicações.
