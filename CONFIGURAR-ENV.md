# 🔑 Configurar Variáveis de Ambiente

## ❌ Erro Atual

```
❌ Variáveis de ambiente faltando: SUPABASE_URL, SUPABASE_KEY, BOT_SUPABASE_URL, BOT_SUPABASE_KEY
```

**Causa**: O arquivo `.env` não existe ou está incompleto.

---

## ✅ Solução Rápida

### 1️⃣ Criar o arquivo `.env`

No **PowerShell**, execute:

```powershell
Copy-Item .env.example .env
```

**OU** crie manualmente:
- Clique com botão direito na pasta do projeto
- Novo → Arquivo de texto
- Nomeie como: `.env` (com o ponto na frente!)

---

### 2️⃣ Pegar as Chaves do Supabase

#### 🗄️ **Banco PRINCIPAL** (Clientes e Empréstimos)

1. Acesse: **https://mhtxyxizfnxupwmilith.supabase.co**
2. Faça login
3. Vá em: **Settings** (engrenagem) → **API**
4. Copie o valor de: **`anon` `public`** (Project API keys)
5. Cole no arquivo `.env` em `SUPABASE_KEY`

#### 💬 **Banco BOT** (Logs e Chat)

1. Acesse: **https://vpxdtrhqzxfllgjvrdrg.supabase.co**
2. Faça login
3. Vá em: **Settings** → **API**
4. Copie o valor de: **`anon` `public`**
5. Cole no arquivo `.env` em `BOT_SUPABASE_KEY`

---

### 3️⃣ Editar o arquivo `.env`

Abra o arquivo `.env` e preencha:

```env
# Banco PRINCIPAL (Clientes e Empréstimos)
SUPABASE_URL=https://mhtxyxizfnxupwmilith.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS... (sua chave aqui)

# Banco BOT (Logs e Chat)
BOT_SUPABASE_URL=https://vpxdtrhqzxfllgjvrdrg.supabase.co
BOT_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS... (sua chave aqui)

# Porta (opcional)
PORT=3001
```

---

### 4️⃣ Salvar e Testar

1. **Salve** o arquivo `.env`
2. No PowerShell, execute:

```powershell
npm start
```

3. Se tudo estiver correto, você verá:

```
✅ Conexões Supabase configuradas com sucesso!
🚀 Iniciando Sistema de Notificações WhatsApp...
✅ Servidor rodando na porta 3001
```

---

## 📋 Exemplo de `.env` Completo

```env
# Banco PRINCIPAL
SUPABASE_URL=https://mhtxyxizfnxupwmilith.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1odHh5eGl6Zm54dXB3bWlsaXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUyNzg2NDMsImV4cCI6MjAyMDg1NDY0M30.exemplo

# Banco BOT
BOT_SUPABASE_URL=https://vpxdtrhqzxfllgjvrdrg.supabase.co
BOT_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweGR0cmhxenhmbGxnanZyZHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUyNzg2NDMsImV4cCI6MjAyMDg1NDY0M30.exemplo

PORT=3001
```

---

## 🔍 Como Encontrar a Chave no Supabase

### Visual (Passo a Passo):

```
1. Abra o Supabase
   ↓
2. Clique em "Settings" (⚙️)
   ↓
3. Clique em "API"
   ↓
4. Role até "Project API keys"
   ↓
5. Veja a tabela:
   ┌──────────────────────────────────────┐
   │ Name       │ Token                   │
   ├────────────┼─────────────────────────┤
   │ anon       │ eyJhbGci... ← COPIE ESTE│
   │ public     │                          │
   ├────────────┼─────────────────────────┤
   │ service_role│ eyJhbGci... (NÃO USE)  │
   └──────────────────────────────────────┘
   ↓
6. Clique no ícone de "copiar" 📋
   ↓
7. Cole no arquivo .env
```

---

## ⚠️ IMPORTANTE

❌ **NÃO USE** a chave `service_role` (é perigosa!)  
✅ **USE** a chave `anon` ou `public`

❌ **NÃO COMPARTILHE** o arquivo `.env` (está no .gitignore)  
✅ **COMPARTILHE** apenas o `.env.example`

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'dotenv'"

```powershell
npm install dotenv
```

### Erro: "Invalid API key"

Verifique se:
1. Copiou a chave completa (sem espaços)
2. Está usando a chave `anon` (não `service_role`)
3. O Supabase está ativo (não pausado)

### Erro: "File .env not found"

No PowerShell:

```powershell
# Verificar se o arquivo existe
Test-Path .env

# Se retornar False, crie:
New-Item -Path .env -ItemType File
```

---

## ✅ Checklist

- [ ] Arquivo `.env` criado
- [ ] Chave do banco PRINCIPAL copiada
- [ ] Chave do banco BOT copiada
- [ ] Arquivo `.env` salvo
- [ ] Comando `npm start` executado
- [ ] Servidor iniciou sem erros

---

## 🚀 Após Configurar

Depois que o `.env` estiver correto:

1. ✅ Execute: `npm start`
2. ✅ Acesse: `http://localhost:3001`
3. ✅ Clique na aba "💬 Chat"
4. ✅ Teste a funcionalidade!

---

**Qualquer dúvida, me chame!** 🔑

