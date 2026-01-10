# 💻 Rodar Sistema Localmente (Windows)

## ✅ Vantagens de Rodar Local

- ✅ **Grátis** (sem custos mensais)
- ✅ **Funciona 100%** (já testado e funcionando)
- ✅ **Controle total** (você gerencia tudo)
- ✅ **Mais rápido** (sem latência de servidor)

## ⚠️ Desvantagens

- ⚠️ Precisa manter o PC ligado
- ⚠️ Só funciona na sua rede local (ou precisa configurar DNS dinâmico)

---

## 🚀 Como Configurar

### **1. Criar Arquivo `.env`**

Crie um arquivo `.env` na raiz do projeto com:

```env
# Banco de dados principal
SUPABASE_URL=https://mhtxyxizfnxupwmilith.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1odHh5eGl6Zm54dXB3bWlsaXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzIzMDYsImV4cCI6MjA3MTcwODMwNn0.s1Y9kk2Va5EMcwAEGQmhTxo70Zv0o9oR6vrJixwEkWI

# Banco de dados do bot
BOT_SUPABASE_URL=https://vpxdtrhqzxfllgjvrdrg.supabase.co
BOT_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweGR0cmhxenhmbGxnanZyZHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODg1MjIsImV4cCI6MjA4MzU2NDUyMn0.VZQ5ESbA3d7U7oJmioXTF7suoJUPLLvZUzZqXPfMYMQ

# Configurações
PORT=3001
NODE_ENV=production
```

---

### **2. Criar Script de Inicialização**

**`iniciar-bot.bat`** (Windows):

```batch
@echo off
title Sistema de Notificações WhatsApp
color 0A

echo ========================================
echo   Sistema de Notificações WhatsApp
echo ========================================
echo.
echo Iniciando servidor...
echo.

cd /d "%~dp0"
npm start

pause
```

**Uso:** Dê duplo clique em `iniciar-bot.bat`

---

### **3. Configurar para Iniciar com o Windows** (Opcional)

Se quiser que o bot inicie automaticamente ao ligar o PC:

1. Pressione **Win + R**
2. Digite: `shell:startup`
3. Copie o arquivo `iniciar-bot.bat` para essa pasta

Pronto! O bot vai iniciar sempre que você ligar o PC.

---

### **4. Manter Rodando em Background**

**Opção A: PM2 (Recomendado)**

```powershell
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar o bot
pm2 start src/index.js --name "whatsapp-bot"

# Ver status
pm2 status

# Ver logs
pm2 logs whatsapp-bot

# Parar
pm2 stop whatsapp-bot

# Reiniciar
pm2 restart whatsapp-bot

# Configurar para iniciar com Windows
pm2 startup
pm2 save
```

**Opção B: NSSM (Service)**

1. Baixe: https://nssm.cc/download
2. Extraia e abra PowerShell como Admin
3. Execute:

```powershell
cd "C:\caminho\para\nssm\win64"
.\nssm install WhatsAppBot "C:\Program Files\nodejs\node.exe" "C:\Users\USER\botconversa\src\index.js"
.\nssm start WhatsAppBot
```

Agora o bot roda como **serviço do Windows**!

---

## 📱 Acessar de Outros Dispositivos

Se quiser acessar o bot de outros dispositivos na mesma rede:

1. Descubra seu IP local:
```powershell
ipconfig
```

2. Procure por "IPv4 Address", algo como: `192.168.1.100`

3. Acesse de outros dispositivos:
```
http://192.168.1.100:3001/api/status
```

---

## 🌐 Expor para Internet (ngrok)

Se quiser acessar de qualquer lugar:

```powershell
# Instalar ngrok
winget install ngrok

# Expor porta 3001
ngrok http 3001
```

Você receberá uma URL tipo: `https://abc123.ngrok.io`

---

## 🔒 Adicionar Senha nos Endpoints (Segurança)

Vou criar um middleware de autenticação simples para você:

**`src/middleware/auth.js`:**

```javascript
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = process.env.API_TOKEN || 'sua-senha-secreta';
  
  if (!authHeader || authHeader !== `Bearer ${token}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  
  next();
}
```

**No `.env`:**
```env
API_TOKEN=minha-senha-super-secreta-123
```

**Usar nos endpoints:**

```javascript
import { requireAuth } from '../middleware/auth.js';

// Proteger endpoint
router.post('/api/cobrancas/processar', requireAuth, async (req, res) => {
  // ...
});
```

**Chamar com senha:**
```javascript
fetch('http://localhost:3001/api/cobrancas/processar', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer minha-senha-super-secreta-123'
  }
});
```

---

## 📊 Monitoramento

**Ver logs em tempo real:**

```powershell
# Com PM2
pm2 logs whatsapp-bot

# Sem PM2, no PowerShell onde o bot está rodando
# Os logs aparecem automaticamente
```

**Criar dashboard web:**

Instale PM2 Plus (grátis):
```powershell
pm2 plus
```

Você terá um dashboard online para monitorar o bot!

---

## 🆘 Troubleshooting

### Bot para quando fecho o terminal

**Solução:** Use PM2 ou NSSM (veja seção 4)

### Porta 3001 já em uso

**Solução:**
```powershell
# Descobrir processo usando a porta
netstat -ano | findstr :3001

# Matar processo (substitua PID)
taskkill /PID 12345 /F
```

### Bot não inicia automaticamente

**Solução:** 
- Com PM2: Execute `pm2 startup` e `pm2 save`
- Com NSSM: Verifique se o serviço está configurado corretamente

---

## ✅ Próximos Passos

1. ✅ Criar arquivo `.env`
2. ✅ Criar script `iniciar-bot.bat`
3. ✅ Testar iniciando manualmente
4. ✅ Instalar PM2 para rodar em background
5. ✅ (Opcional) Configurar para iniciar com Windows
6. ✅ (Opcional) Adicionar autenticação

---

## 💡 Dica

Se você vai rodar **localmente em produção**, recomendo:

1. ✅ Usar PM2 para gerenciar o processo
2. ✅ Adicionar autenticação nos endpoints
3. ✅ Configurar firewall para bloquear acesso externo à porta 3001
4. ✅ Fazer backup da pasta `tokens/` periodicamente (sessão WhatsApp)

---

**Quer que eu crie os arquivos necessários para você agora?**

