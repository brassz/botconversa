# 🚂 Deploy no Railway - Sistema de Notificações WhatsApp

## Por que Railway em vez de Render?

✅ Suporta Puppeteer/Chrome nativamente  
✅ Mais memória e CPU  
✅ Ambiente persistente (sessão WhatsApp não se perde)  
✅ Melhor para bots WhatsApp  
✅ Deploy automático via GitHub  

---

## 📋 Passo a Passo

### **1. Criar Conta no Railway**

1. Acesse: https://railway.app
2. Clique em **"Start a New Project"**
3. Faça login com GitHub

---

### **2. Preparar o Projeto**

Certifique-se de ter estes arquivos no seu repositório:

**`package.json`** (já está configurado ✅)

**`.nvmrc`** (já está configurado ✅)

**`railway.json`** (vou criar agora)

---

### **3. Criar `railway.json`**

Este arquivo configura o Railway para instalar o Chrome corretamente:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx puppeteer browsers install chrome"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

---

### **4. Configurar Variáveis de Ambiente**

No Railway, vá em **Variables** e adicione:

```bash
# Banco de dados principal (seu sistema)
SUPABASE_URL=https://mhtxyxizfnxupwmilith.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1odHh5eGl6Zm54dXB3bWlsaXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzIzMDYsImV4cCI6MjA3MTcwODMwNn0.s1Y9kk2Va5EMcwAEGQmhTxo70Zv0o9oR6vrJixwEkWI

# Banco de dados do bot
BOT_SUPABASE_URL=https://vpxdtrhqzxfllgjvrdrg.supabase.co
BOT_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweGR0cmhxenhmbGxnanZyZHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODg1MjIsImV4cCI6MjA4MzU2NDUyMn0.VZQ5ESbA3d7U7oJmioXTF7suoJUPLLvZUzZqXPfMYMQ

# Ambiente
NODE_ENV=production
PORT=3000
```

---

### **5. Fazer Deploy**

1. No Railway, clique em **"Deploy from GitHub repo"**
2. Selecione o repositório `botconversa`
3. Aguarde o deploy (5-10 minutos na primeira vez)
4. O Railway vai gerar uma URL tipo: `https://seu-projeto.railway.app`

---

### **6. Conectar WhatsApp**

Após o deploy, acesse:

```
https://seu-projeto.railway.app/api/qr
```

Escaneie o QR Code e pronto! 🎉

---

## 💰 Custos

- **Plano Trial**: $5 grátis (suficiente para testar)
- **Plano Hobby**: ~$5-10/mês (para produção)

---

## 🔧 Comandos Úteis

**Ver logs:**
```bash
railway logs
```

**Reiniciar serviço:**
```bash
railway restart
```

---

## 📱 URL do Seu Bot

Depois do deploy, você terá uma URL pública tipo:

```
https://seu-bot.railway.app
```

E os endpoints serão:

```
https://seu-bot.railway.app/api/status
https://seu-bot.railway.app/api/qr
https://seu-bot.railway.app/api/cobrancas/processar
```

---

## 🐛 Troubleshooting

### Erro de Chrome não encontrado

Se ainda assim der erro, adicione ao `package.json`:

```json
"scripts": {
  "postinstall": "npx puppeteer browsers install chrome"
}
```

### Sessão WhatsApp se perde

O Railway tem volumes persistentes. Configure no painel:

1. Vá em **Settings** → **Volumes**
2. Monte o volume em: `/app/tokens`

---

## ✅ Próximos Passos

1. ✅ Criar conta no Railway
2. ✅ Fazer push do código para GitHub
3. ✅ Conectar repositório no Railway
4. ✅ Configurar variáveis de ambiente
5. ✅ Fazer deploy
6. ✅ Escanear QR Code
7. ✅ Testar endpoints

---

## 🆘 Precisa de Ajuda?

Me avise se encontrar algum erro durante o deploy!

