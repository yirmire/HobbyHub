# HobbyHub 2.0 — instruções de implantação

Versão atualizada da rede social existente, com visual responsivo, publicação com curtidas e comentários, feed global/local/seguindo, perfis, seguidores, grupos com entrada, saída e mural de publicações, eventos com confirmação de interesse, salvamentos, descoberta de hobbies e chats público e privado.

## Atualizações da versão 2.1 — autenticação e chat

- A tela de login inclui **Esqueci minha senha**, com envio de link pelo Firebase Authentication para o e-mail cadastrado.
- O início de uma conversa privada usa uma transação do Firestore para não sobrescrever um chat já existente e evitar conflito quando dois participantes iniciam ao mesmo tempo.
- Rode `node --check app.js` e `node --test tests/*.test.mjs` com Node.js 22. Um workflow do GitHub Actions também executa os testes em pull requests.
- Os testes automáticos não usam Firebase real: verifique login, envio de recuperação, permissões e conversas com duas contas reais antes de liberar ao público.
- O arquivo `firestore.rules` no repositório **não é publicado automaticamente** no Firebase Console. Valide as regras no emulador e publique pelo Console sem apagar permissões legítimas de outras aplicações.

## Fila privada de denúncias

No Console do Firebase, abra o Firestore do projeto `hubbyhub-98c71` e navegue até `artifacts / hubbyhub-98c71 / public / data / reports`. A fila exige uma conta com permissões administrativas no projeto.

1. Filtre por `status == pending` para revisar denúncias de perfis, depoimentos e mensagens. Denúncias de publicações anteriores a esse fluxo podem não ter campo de status.
2. Revise o tipo, o motivo e os detalhes. Para mensagens privadas, use apenas o texto da mensagem selecionada que consta em `targetText`.
3. Depois de concluir a análise, defina `status` como `reviewed`. A decisão deve considerar as regras da comunidade.
