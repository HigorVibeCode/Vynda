# Vynda

App de desenvolvimento pessoal gamificado com Expo, TypeScript e Supabase.

## Stack

- Expo + React Native + Expo Router
- TypeScript
- Supabase Auth/Postgres/Realtime
- Zustand
- React Native Reanimated + react-native-svg

## Setup

1. Copie `.env.example` para `.env`.
2. Preencha as variaveis do Supabase (o Expo carrega principalmente `EXPO_PUBLIC_*`):
   - `EXPO_PUBLIC_SUPABASE_URL` — mesma URL do projeto (equivalente a `NEXT_PUBLIC_SUPABASE_URL` no Next).
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` — chave **anon** legada (JWT) ou chave **publishable** (`sb_publishable_...`) do painel novo; equivale a `NEXT_PUBLIC_SUPABASE_ANON_KEY` ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Crie as tabelas no Supabase (elas **nao** aparecem sozinhas; e preciso rodar o SQL):
   - Dashboard do projeto: **SQL Editor** > **New query**
   - Abra o arquivo `supabase/schema.sql` do repositorio, copie o conteudo todo e cole no editor
   - Clique em **Run** (ou `Ctrl+Enter`)
   - Depois confira em **Table Editor** se existem as tabelas `profiles`, `pillars` e `goals`
4. Inicie o projeto:

```bash
npm install
npm run start
```

### Modo sem login (temporario)

- Em `src/lib/bypass-auth.ts`, `bypassAuth = true` abre direto o **Brain Map** sem login e o root **nao** fica preso no spinner do bootstrap.
- Para **voltar ao login**, mude para `bypassAuth = false` e reinicie o Metro com `npm start -- --clear`.

## Rotas

- `/(auth)/login`: login (email/senha + Google)
- `/(auth)/register`: cadastro
- `/(auth)/forgot-password`: recuperacao de senha
- `/(app)`: Brain Map principal
- `/(app)/stats`: estatisticas gerais

## Implementado nesta base inicial

- Autenticacao Supabase com sessao persistente e refresh automatico
- Protecao de rotas autenticadas com Expo Router
- Brain Map com cerebro central em SVG, 11 pilares e conexoes
- Estado visual do cerebro por `brainHealth`
- Bottom sheet de pilar com metas, XP e toggle ativo/inativo
- Regras iniciais de XP global, nivel e streak

