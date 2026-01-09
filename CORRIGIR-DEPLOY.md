# 🔧 Corrigir Erro de Deploy no Render

## ❌ Erros Identificados:

1. **Node.js 18 deprecated** → Atualizado para Node.js 20
2. **supabaseUrl is required** → Variáveis de ambiente não configuradas

---

## ✅ Correções Aplicadas:

### 1. Node.js atualizado para v20
- `package.json` → `"node": ">=20.0.0"`
- `.nvmrc` → `20`

### 2. Validação melhorada
- `src/config/supabase.js` agora mostra quais variáveis estão faltando

---

## 🚀 Como Corrigir AGORA:

### Passo 1: Fazer Push das Correções

```bash
git add .
git commit -m "fix: atualizar para Node.js 20 e melhorar validação env vars"
git push origin main
```

O Render fará redeploy automático.

### Passo 2: VERIFICAR Variáveis de Ambiente no Render

**ESTE É O PROBLEMA PRINCIPAL!**

1. Acesse: https://dashboard.render.com
2. Clique no seu serviço `bot-cobranca-whatsapp`
3. Vá em: **Environment**
4. **VERIFIQUE** se TODAS estas variáveis estão lá:

```
SUPABASE_URL
SUPABASE_KEY
BOT_SUPABASE_URL
BOT_SUPABASE_KEY
NODE_ENV
PORT
HORA_ENVIO_LEMBRETES
HORA_ENVIO_VENCIMENTO
HORA_ENVIO_ATRASO
```

### Passo 3: Adicionar/Corrigir Variáveis

Se alguma estiver faltando, adicione:

#### A) Clique em "Add Environment Variable"

#### B) Adicione UMA POR VEZ:

**Variável 1:**
```
Key: SUPABASE_URL
Value: https://mhtxyxizfnxupwmilith.supabase.co
```

**Variável 2:**
```
Key: SUPABASE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1odHh5eGl6Zm54dXB3bWlsaXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzIzMDYsImV4cCI6MjA3MTcwODMwNn0.s1Y9kk2Va5EMcwAEGQmhTxo70Zv0o9oR6vrJixwEkWI
```

**Variável 3:**
```
Key: BOT_SUPABASE_URL
Value: https://vpxdtrhqzxfllgjvrdrg.supabase.co
```

**Variável 4:**
```
Key: BOT_SUPABASE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweGR0cmhxenhmbGxnanZyZHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODg1MjIsImV4cCI6MjA4MzU2NDUyMn0.VZQ5ESbA3d7U7oJmioXTF7suoJUPLLvZUzZqXPfMYMQ
```

**Variável 5:**
```
Key: NODE_ENV
Value: production
```

**Variável 6:**
```
Key: PORT
Value: 3000
```

**Variável 7:**
```
Key: HORA_ENVIO_LEMBRETES
Value: 09:00
```

**Variável 8:**
```
Key: HORA_ENVIO_VENCIMENTO
Value: 09:00
```

**Variável 9:**
```
Key: HORA_ENVIO_ATRASO
Value: 10:00
```

#### C) Clique em "Save Changes"

### Passo 4: Fazer Redeploy Manual

1. Vá em: **Manual Deploy**
2. Clique: **Deploy latest commit**
3. Aguarde o build completar

---

## 🔍 Verificar se Funcionou

### 1. Ver Logs em Tempo Real

No Render Dashboard:
- Clique em **Logs**
- Procure por: `✅ Conexões Supabase configuradas com sucesso!`

### 2. Testar o Serviço

```bash
# Substitua pela sua URL
curl https://seu-app.onrender.com/api/
```

Deve retornar:
```json
{
  "status": "online",
  "message": "Bot de Cobrança WhatsApp - Render"
}
```

---

## ⚠️ Problemas Comuns

### Erro: "Node.js v18.20.8"

**Solução:**
- Confirme que fez push das alterações
- Redeploy manual no Render
- Aguarde build completar (3-5 min)

### Erro: "supabaseUrl is required"

**Solução:**
- As variáveis de ambiente não foram adicionadas
- Vá em Environment no Render
- Adicione TODAS as 9 variáveis
- Redeploy manual

### Erro: "Environment variable not found"

**Solução:**
- Nome da variável está errado (é case-sensitive)
- Use EXATAMENTE: `SUPABASE_URL` (não `supabase_url`)
- Sem espaços extras antes/depois

### Deploy fica em loop

**Solução:**
- Verifique se não há erros nos logs
- Confirme que TODAS as variáveis estão corretas
- Teste cada URL manualmente no navegador

---

## ✅ Checklist Final

Antes de redeploy, confirme:

- [ ] Push das correções feito (Node.js 20)
- [ ] Variável `SUPABASE_URL` adicionada
- [ ] Variável `SUPABASE_KEY` adicionada
- [ ] Variável `BOT_SUPABASE_URL` adicionada
- [ ] Variável `BOT_SUPABASE_KEY` adicionada
- [ ] Variável `NODE_ENV` adicionada
- [ ] Variável `PORT` adicionada
- [ ] Variáveis de horário adicionadas (3 variáveis)
- [ ] Clicou em "Save Changes"
- [ ] Fez redeploy manual

---

## 🎯 Resumo do Processo:

```
1. git push (código corrigido)
   ↓
2. Adicionar variáveis no Render
   ↓
3. Redeploy manual
   ↓
4. Ver logs → "✅ Conexões Supabase configuradas"
   ↓
5. Testar: curl /api/
   ↓
6. ✅ Funcionando!
```

---

## 📸 Visual do Render

### Como deve estar em Environment:

```
Environment Variables

SUPABASE_URL                 https://mhtxyxizfnxupwmilith...
SUPABASE_KEY                 eyJhbGciOiJIUzI1NiIsInR5cCI...
BOT_SUPABASE_URL             https://vpxdtrhqzxfllgjvrdrg...
BOT_SUPABASE_KEY             eyJhbGciOiJIUzI1NiIsInR5cCI...
NODE_ENV                     production
PORT                         3000
HORA_ENVIO_LEMBRETES         09:00
HORA_ENVIO_VENCIMENTO        09:00
HORA_ENVIO_ATRASO            10:00

[Save Changes]
```

---

## 🆘 Ainda com Problemas?

### Debug Avançado:

1. **Ver logs detalhados:**
   ```
   Render Dashboard → Logs → Expand All
   ```

2. **Testar variáveis:**
   Adicione temporariamente no `src/index.js`:
   ```javascript
   console.log('ENV Check:', {
     hasSupabaseUrl: !!process.env.SUPABASE_URL,
     hasSupabaseKey: !!process.env.SUPABASE_KEY,
     hasBotUrl: !!process.env.BOT_SUPABASE_URL,
     hasBotKey: !!process.env.BOT_SUPABASE_KEY
   });
   ```

3. **Verificar se o Render leu as variáveis:**
   - Logs devem mostrar: `"hasSupabaseUrl": true`
   - Se mostrar `false`, variáveis não foram salvas

---

## 💡 Dica: Copiar e Colar

Para evitar erros de digitação:

1. Abra `CREDENTIALS.txt`
2. Copie as URLs e Keys EXATAMENTE
3. Cole no Render (Ctrl+V)
4. Não digite manualmente

---

## ✅ Depois de Funcionar:

1. Teste o status: `/api/status`
2. Obtenha QR Code: `/api/qr`
3. Escaneie com WhatsApp
4. Pronto! 🎉

---

**Esta correção resolve 99% dos problemas de deploy no Render!**

Se seguir todos os passos, seu bot estará funcionando em 5-10 minutos! 🚀

