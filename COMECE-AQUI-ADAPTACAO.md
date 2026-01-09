# ⚡ COMECE AQUI - Adaptação Rápida

> **Você JÁ TEM as tabelas `loans` e `clients`? Perfeito! Siga estes passos:**

---

## 🎯 3 Passos Rápidos

### Passo 1: Configure os Nomes dos Campos (2 min)

Descubra os nomes exatos das suas colunas:

```sql
-- Execute no Supabase (Banco Principal)
-- https://mhtxyxizfnxupwmilith.supabase.co

SELECT column_name FROM information_schema.columns 
WHERE table_name = 'clients';

SELECT column_name FROM information_schema.columns 
WHERE table_name = 'loans';
```

**Abra:** `src/services/clientService_adaptado.js`

**Edite a linha 19:**

```javascript
const FIELD_MAPPING = {
  // AJUSTE AQUI conforme seu banco ⬇️
  
  clientName: 'name',        // ou 'nome' se for português
  clientPhone: 'phone',      // ou 'telefone'
  clientEmail: 'email',
  
  loanAmount: 'amount',      // ou 'valor'
  loanDueDate: 'due_date',   // ou 'data_vencimento'
  loanStatus: 'status',
  loanClientId: 'client_id'
};
```

**Exemplo se seu banco for em português:**

```javascript
const FIELD_MAPPING = {
  clientName: 'nome',
  clientPhone: 'telefone',
  clientEmail: 'email',
  
  loanAmount: 'valor',
  loanDueDate: 'data_vencimento',
  loanStatus: 'status',
  loanClientId: 'client_id'
};
```

---

### Passo 2: Substituir Arquivos (1 min)

**No Windows Explorer:**

1. Vá na pasta: `src/services/`

2. **Delete:**
   - `clientService.js`
   - `logService.js`

3. **Renomeie:**
   - `clientService_adaptado.js` → `clientService.js`
   - `logService_adaptado.js` → `logService.js`

**Ou via comando:**

```bash
cd src/services
del clientService.js
del logService.js
ren clientService_adaptado.js clientService.js
ren logService_adaptado.js logService.js
```

---

### Passo 3: Criar Tabela de Logs (1 min)

Execute **APENAS no Banco do Bot:**

```sql
-- https://vpxdtrhqzxfllgjvrdrg.supabase.co

CREATE TABLE message_logs (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER NOT NULL,
  client_id INTEGER NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logs_loan ON message_logs(loan_id);
CREATE INDEX idx_logs_client ON message_logs(client_id);
```

---

## ✅ Pronto para Deploy!

Agora siga o **START.md** normalmente:

1. Push para GitHub
2. Deploy no Render
3. Conectar WhatsApp
4. ✅ Funcionando!

---

## 🧪 Testar Antes do Deploy

```bash
# Instalar e rodar localmente
npm install
npm start

# Testar endpoint (em outro terminal)
curl http://localhost:3000/api/clientes/overdue
```

Deve retornar seus empréstimos atrasados!

---

## ⚠️ Requisitos Importantes

### 1. Formato do Telefone

Deve ser: **5511999999999** (código país + DDD + número)

```sql
-- Verificar
SELECT phone FROM clients LIMIT 5;

-- Se tiver símbolos, limpar:
UPDATE clients 
SET phone = REGEXP_REPLACE(phone, '[^0-9]', '', 'g');

-- Se faltar código do país (55):
UPDATE clients 
SET phone = '55' || phone
WHERE LENGTH(phone) < 13;
```

### 2. Status dos Empréstimos

Valores aceitos (case-sensitive):
- `'active'` - Vence amanhã
- `'due_today'` - Vence hoje
- `'overdue'` - Atrasado

```sql
-- Verificar
SELECT DISTINCT status FROM loans;

-- Deve retornar exatamente: active, due_today, overdue
```

### 3. Seu Sistema DEVE Atualizar Status

O bot apenas **LÊ** os dados. Seu sistema deve **ATUALIZAR** o status:

```sql
-- Execute isso diariamente no SEU sistema
UPDATE loans SET status = 'overdue' 
WHERE due_date < CURRENT_DATE AND status != 'overdue';

UPDATE loans SET status = 'due_today' 
WHERE due_date = CURRENT_DATE AND status != 'due_today';

UPDATE loans SET status = 'active' 
WHERE due_date = CURRENT_DATE + INTERVAL '1 day' AND status != 'active';
```

---

## 🔍 Teste Completo

### 1. Verificar Estrutura

```sql
-- Deve retornar empréstimos com clientes
SELECT 
  l.id as loan_id,
  c.name as cliente,
  c.phone,
  l.amount as valor,
  l.due_date as vencimento,
  l.status
FROM loans l
INNER JOIN clients c ON l.client_id = c.id
WHERE l.status IN ('overdue', 'due_today', 'active')
LIMIT 5;
```

Se retornar dados, está pronto! ✅

### 2. Testar API Localmente

```bash
# Terminal 1: Rodar bot
npm start

# Terminal 2: Testar endpoints
curl http://localhost:3000/api/clientes/overdue
curl http://localhost:3000/api/clientes/due_today
curl http://localhost:3000/api/clientes/active
```

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

- **[ADAPTACAO.md](ADAPTACAO.md)** - Guia completo de adaptação
- **[database/schema_adaptado.sql](database/schema_adaptado.sql)** - Queries de exemplo
- **[START.md](START.md)** - Deploy rápido

---

## 🆘 Problemas?

### "Column does not exist"
→ Ajuste `FIELD_MAPPING` com os nomes corretos

### "No rows returned"
→ Verifique se há dados: `SELECT * FROM loans WHERE status = 'overdue'`

### "Join error"
→ Confirme que `loans.client_id` referencia `clients.id`

---

## 🎯 Checklist Rápido

Antes de fazer deploy:

- [ ] Configurei `FIELD_MAPPING` correto
- [ ] Substituí os arquivos
- [ ] Criei tabela `message_logs` no banco do bot
- [ ] Telefones no formato: 5511999999999
- [ ] Status são: 'overdue', 'due_today', 'active'
- [ ] Testei query SQL no Supabase
- [ ] Testei localmente (opcional)

---

## 🚀 Próximo Passo

**Tudo configurado?** Vá para **[START.md](START.md)** e faça o deploy!

---

**Sua estrutura (loans + clients) é melhor que a original!** 👍

Ela é mais normalizada e profissional. O bot vai funcionar perfeitamente! 🎉

