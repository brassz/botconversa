# ⚡ START - Comece AGORA em 3 Passos

> **Para quem quer configurar o bot o mais rápido possível**

---

## 🎯 Passo 1: Supabase (2 minutos)

### Banco 1 - Clientes

1. Acesse: https://mhtxyxizfnxupwmilith.supabase.co
2. Vá em: **SQL Editor**
3. Cole e execute:

```sql
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  valor DECIMAL(10, 2) NOT NULL,
  data_vencimento DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'due_today', 'overdue')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_clientes_vencimento ON clientes(data_vencimento);

-- Dados de teste
INSERT INTO clientes (nome, telefone, valor, data_vencimento, status) VALUES
('João Silva', '5511999999999', 99.90, CURRENT_DATE + INTERVAL '1 day', 'active'),
('Maria Santos', '5511988888888', 149.90, CURRENT_DATE, 'due_today'),
('Pedro Costa', '5511977777777', 79.90, CURRENT_DATE - INTERVAL '2 days', 'overdue');
```

### Banco 2 - Logs

1. Acesse: https://vpxdtrhqzxfllgjvrdrg.supabase.co
2. Vá em: **SQL Editor**
3. Cole e execute:

```sql
CREATE TABLE message_logs (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logs_client ON message_logs(client_id);
CREATE INDEX idx_logs_sent_at ON message_logs(sent_at);
```

---

## 🚀 Passo 2: Render (2 minutos)

### A) Subir Código

```bash
git init
git add .
git commit -m "Bot cobrança WhatsApp"
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

### B) Criar Serviço

1. Acesse: https://dashboard.render.com
2. Clique: **New +** → **Web Service**
3. Conecte GitHub → Selecione repositório
4. Configure:
   - **Name:** `bot-cobranca-whatsapp`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### C) Variáveis de Ambiente

Clique em **Advanced** e adicione:

```
SUPABASE_URL
https://mhtxyxizfnxupwmilith.supabase.co

SUPABASE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1odHh5eGl6Zm54dXB3bWlsaXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzIzMDYsImV4cCI6MjA3MTcwODMwNn0.s1Y9kk2Va5EMcwAEGQmhTxo70Zv0o9oR6vrJixwEkWI

BOT_SUPABASE_URL
https://vpxdtrhqzxfllgjvrdrg.supabase.co

BOT_SUPABASE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweGR0cmhxenhmbGxnanZyZHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODg1MjIsImV4cCI6MjA4MzU2NDUyMn0.VZQ5ESbA3d7U7oJmioXTF7suoJUPLLvZUzZqXPfMYMQ

NODE_ENV
production

PORT
3000

HORA_ENVIO_LEMBRETES
09:00

HORA_ENVIO_VENCIMENTO
09:00

HORA_ENVIO_ATRASO
10:00
```

### D) Deploy

Clique: **Create Web Service**

Aguarde 3-5 minutos...

---

## 📱 Passo 3: WhatsApp (1 minuto)

1. **Aguarde deploy** completar (veja status: Live ✅)

2. **Acesse:** `https://seu-app.onrender.com/api/qr`

3. **No celular:**
   - Abra WhatsApp
   - Menu (⋮) → **Dispositivos Vinculados**
   - **Vincular um dispositivo**
   - Escaneie o QR Code

4. **Confirme:** `https://seu-app.onrender.com/api/status`
   - Deve mostrar: `"connected": true`

---

## ✅ PRONTO!

Seu bot está funcionando! 🎉

---

## 🧪 Testar Agora

### 1. Ver Status
```bash
curl https://seu-app.onrender.com/api/status
```

### 2. Ver Clientes
```bash
curl https://seu-app.onrender.com/api/clientes/all
```

### 3. Enviar Teste
```bash
curl -X POST https://seu-app.onrender.com/api/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "SEU_NUMERO_COMPLETO", "message": "🤖 Teste do bot!"}'
```

### 4. Processar Cobranças
```bash
curl -X POST https://seu-app.onrender.com/api/cobrancas/processar
```

---

## 📊 O Bot Vai:

- ✅ **09:00** - Enviar lembretes (vence amanhã)
- ✅ **09:00** - Notificar vencimentos (vence hoje)
- ✅ **10:00** - Cobrar atrasados

**Automaticamente todos os dias!**

---

## ⚙️ Seu Sistema Deve:

Atualizar o status dos clientes baseado na data de vencimento:

```sql
-- Execute isso diariamente no seu sistema
UPDATE clientes SET status = 'overdue' WHERE data_vencimento < CURRENT_DATE;
UPDATE clientes SET status = 'due_today' WHERE data_vencimento = CURRENT_DATE;
UPDATE clientes SET status = 'active' WHERE data_vencimento = CURRENT_DATE + INTERVAL '1 day';
```

---

## 🔧 Personalizar

### Alterar Mensagens

Edite: `src/config/constants.js`

```javascript
export const MENSAGENS = {
  LEMBRETE: (nome, valor, dataVencimento) => 
    `Sua mensagem aqui...`,
  // ...
};
```

### Alterar Horários

No Render → Environment Variables:

```
HORA_ENVIO_LEMBRETES=08:00
HORA_ENVIO_VENCIMENTO=10:00
HORA_ENVIO_ATRASO=14:00
```

**Depois:** Manual Deploy → Deploy latest commit

---

## 📚 Documentação Completa

Agora que está funcionando, explore:

- **[README.md](README.md)** - Documentação completa
- **[USAGE.md](USAGE.md)** - Como usar a API
- **[FAQ.md](FAQ.md)** - Perguntas frequentes
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Resolver problemas

---

## 🆘 Problemas?

### WhatsApp não conecta
- Aguarde 1-2 minutos após deploy
- Recarregue `/api/qr`
- Verifique logs no Render

### Mensagens não enviam
- Confirme formato telefone: `5511999999999`
- Verifique `/api/status` → `connected: true`
- Veja histórico: `/api/historico`

### Tabelas não encontradas
- Execute os SQLs novamente no Supabase
- Confirme que executou nos bancos corretos

---

## 💡 Dica: Manter Ativo (Free Tier)

Render Free desliga após 15min sem uso.

**Solução:** Use UptimeRobot (grátis)

1. Cadastre em: https://uptimerobot.com
2. Add Monitor → HTTP(s)
3. URL: `https://seu-app.onrender.com/api/`
4. Interval: 5 minutes

Pronto! Bot ficará ativo 24/7

---

## 🎉 Parabéns!

Seu bot está no ar e cobrando automaticamente!

**Custo total:** $7/mês (ou $0 com Free Tier + UptimeRobot)

---

**Próximos passos:**

1. ✅ Bot funcionando
2. 📊 Integrar com seu sistema
3. 📱 Monitorar envios
4. 💰 Lucrar! 🚀

---

<p align="center">
  <strong>Dúvidas? Consulte FAQ.md ou TROUBLESHOOTING.md</strong>
</p>

