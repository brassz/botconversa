# 🔄 Guia de Adaptação para Banco Existente

> **Para quem JÁ TEM as tabelas `loans` e `clients`**

---

## 🎯 Situação

Você **já tem** um banco de dados com:
- ✅ Tabela `loans` (empréstimos)
- ✅ Tabela `clients` (clientes)
- ✅ Campo `status` com valores: `overdue`, `due_today`, `active`

**Ótimo!** O bot pode usar sua estrutura existente.

---

## 📋 Checklist de Adaptação

### 1️⃣ Identificar Nomes dos Campos

Primeiro, descubra os nomes exatos das colunas:

```sql
-- Execute no Supabase SQL Editor (Banco Principal)

-- Ver estrutura da tabela loans
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'loans'
ORDER BY ordinal_position;

-- Ver estrutura da tabela clients
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clients'
ORDER BY ordinal_position;
```

### 2️⃣ Mapeamento de Campos

Anote os nomes dos campos:

#### Tabela `clients`

| Campo Esperado | Seu Campo | Exemplo |
|----------------|-----------|---------|
| id | ? | `id` |
| name | ? | `name` ou `nome` |
| phone | ? | `phone` ou `telefone` |
| email | ? | `email` |

#### Tabela `loans`

| Campo Esperado | Seu Campo | Exemplo |
|----------------|-----------|---------|
| id | ? | `id` |
| client_id | ? | `client_id` |
| amount | ? | `amount` ou `valor` |
| due_date | ? | `due_date` ou `data_vencimento` |
| status | ? | `status` |

### 3️⃣ Configurar Mapeamento no Código

Edite `src/services/clientService_adaptado.js`:

```javascript
const FIELD_MAPPING = {
  // Ajuste conforme SEU banco
  clientName: 'name',        // ou 'nome'
  clientPhone: 'phone',      // ou 'telefone'
  clientEmail: 'email',
  
  loanAmount: 'amount',      // ou 'valor'
  loanDueDate: 'due_date',   // ou 'data_vencimento'
  loanStatus: 'status',
  loanClientId: 'client_id'
};
```

### 4️⃣ Substituir Arquivos

**Substitua** os arquivos originais pelos adaptados:

```bash
# Backup dos originais
cp src/services/clientService.js src/services/clientService_original.js
cp src/services/logService.js src/services/logService_original.js

# Usar versões adaptadas
cp src/services/clientService_adaptado.js src/services/clientService.js
cp src/services/logService_adaptado.js src/services/logService.js
```

Ou simplesmente **renomeie** no Windows:
1. Delete `clientService.js`
2. Renomeie `clientService_adaptado.js` para `clientService.js`
3. Delete `logService.js`
4. Renomeie `logService_adaptado.js` para `logService.js`

### 5️⃣ Criar Tabela de Logs

Execute **APENAS no Banco do Bot** (não no principal):

```sql
-- Execute em: https://vpxdtrhqzxfllgjvrdrg.supabase.co

CREATE TABLE IF NOT EXISTS message_logs (
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
CREATE INDEX idx_logs_sent_at ON message_logs(sent_at);
```

### 6️⃣ Verificar Formato do Telefone

O telefone deve estar no formato: **5511999999999**

```sql
-- Verificar formato atual
SELECT id, phone FROM clients LIMIT 5;

-- Se estiver com caracteres especiais, normalizar:
UPDATE clients 
SET phone = REGEXP_REPLACE(phone, '[^0-9]', '', 'g')
WHERE phone IS NOT NULL;

-- Se não tiver código do país, adicionar:
UPDATE clients 
SET phone = '55' || phone
WHERE phone IS NOT NULL 
AND LENGTH(phone) < 13;
```

### 7️⃣ Criar Índices (Opcional mas Recomendado)

```sql
-- Execute no Banco Principal
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_due_date ON loans(due_date);
CREATE INDEX IF NOT EXISTS idx_loans_client_id ON loans(client_id);
```

---

## 🧪 Testar Queries

Antes de fazer deploy, teste se as queries funcionam:

### Teste 1: Empréstimos Atrasados

```sql
SELECT 
  l.id as loan_id,
  c.id as client_id,
  c.name as client_name,
  c.phone,
  l.amount,
  l.due_date,
  l.status
FROM loans l
INNER JOIN clients c ON l.client_id = c.id
WHERE l.status = 'overdue'
LIMIT 5;
```

Deve retornar empréstimos atrasados com dados dos clientes.

### Teste 2: Vencem Hoje

```sql
SELECT 
  l.id as loan_id,
  c.name as client_name,
  c.phone,
  l.amount,
  l.due_date
FROM loans l
INNER JOIN clients c ON l.client_id = c.id
WHERE l.status = 'due_today'
LIMIT 5;
```

### Teste 3: Contar por Status

```sql
SELECT 
  status,
  COUNT(*) as total,
  SUM(amount) as valor_total
FROM loans
GROUP BY status;
```

---

## 🚀 Deploy com Banco Adaptado

Depois de adaptar, siga o deploy normal:

### 1. Push para GitHub

```bash
git add .
git commit -m "Adaptado para tabelas loans e clients existentes"
git push origin main
```

### 2. Configure Render

Mesmas variáveis de ambiente do `START.md`

### 3. Teste os Endpoints

```bash
# Ver empréstimos atrasados
curl https://seu-app.onrender.com/api/clientes/overdue

# Ver que vencem hoje
curl https://seu-app.onrender.com/api/clientes/due_today

# Ver ativos (vencem amanhã)
curl https://seu-app.onrender.com/api/clientes/active
```

---

## 🎯 Diferenças do Código Original

### Alterações Principais:

1. **clientService.js**
   - Busca de `loans` com JOIN em `clients`
   - Campo configurável via `FIELD_MAPPING`
   - Retorna `loan_id` e `client_id`

2. **logService.js**
   - Registra `loan_id` nos logs
   - Busca histórico por `loan_id` ou `client_id`
   - Verifica duplicação por `loan_id`

3. **Banco de Dados**
   - Não cria tabela `clientes`
   - Usa `loans` + `clients` existentes
   - Apenas cria `message_logs` no banco do bot

---

## 📊 Exemplo Completo

### Sua Estrutura Atual:

```sql
-- Tabela clients
id | name         | phone         | email
---|--------------|---------------|------------------
1  | João Silva   | 5511999999999 | joao@email.com
2  | Maria Santos | 5511988888888 | maria@email.com

-- Tabela loans
id | client_id | amount  | due_date   | status
---|-----------|---------|------------|----------
1  | 1         | 1000.00 | 2026-01-10 | active
2  | 2         | 2000.00 | 2026-01-09 | due_today
3  | 1         | 1500.00 | 2026-01-05 | overdue
```

### O Bot Vai Buscar:

```javascript
// Para overdue
{
  loan_id: 3,
  client_id: 1,
  nome: 'João Silva',
  telefone: '5511999999999',
  valor: 1500.00,
  data_vencimento: '2026-01-05',
  status: 'overdue'
}
```

### E Enviar:

```
Olá João Silva! ⚠️

Identificamos que seu empréstimo no valor de R$ 1.500,00 
está em atraso desde 05/01/2026 (4 dia(s)).

Para evitar a suspensão do serviço, por favor regularize 
seu pagamento o mais breve possível.

Se já realizou o pagamento, desconsidere esta mensagem.

Estamos à disposição para ajudar! 📞
```

---

## ✅ Checklist Final

Antes de fazer deploy, confirme:

- [ ] Identifiquei os nomes dos campos do meu banco
- [ ] Configurei `FIELD_MAPPING` corretamente
- [ ] Substituí `clientService.js` e `logService.js`
- [ ] Criei tabela `message_logs` no banco do bot
- [ ] Verifiquei formato dos telefones (5511999999999)
- [ ] Testei queries no Supabase SQL Editor
- [ ] Status está como: 'overdue', 'due_today', 'active'
- [ ] Criei índices nas tabelas (opcional)

---

## 🆘 Problemas Comuns

### "relation loans does not exist"
- Você está executando no banco errado
- Use o banco PRINCIPAL: https://mhtxyxizfnxupwmilith.supabase.co

### "column name does not exist"
- Os nomes dos campos estão diferentes
- Ajuste `FIELD_MAPPING` no código

### "No rows returned"
- Não há empréstimos com esses status
- Verifique: `SELECT * FROM loans WHERE status IN ('overdue','due_today','active')`

### Mensagens não enviam
- Verifique formato do telefone
- Confirme que o JOIN retorna dados
- Teste a query manualmente no SQL Editor

---

## 💡 Dica: Testar Localmente Primeiro

```bash
# Instalar dependências
npm install

# Configurar .env
cp .env.example .env
# Edite .env com suas credenciais

# Rodar localmente
npm start

# Testar endpoint
curl http://localhost:3000/api/clientes/all
```

Se funcionar localmente, funcionará no Render!

---

## 📚 Próximos Passos

1. ✅ Adapte o código (este guia)
2. 🧪 Teste localmente
3. 🚀 Faça deploy no Render (`START.md`)
4. 📱 Conecte WhatsApp
5. 🎉 Bot funcionando!

---

**Dúvidas específicas sobre adaptação?**

Consulte:
- `database/schema_adaptado.sql` - Queries de exemplo
- `src/services/clientService_adaptado.js` - Código adaptado
- `FAQ.md` - Perguntas gerais
- `TROUBLESHOOTING.md` - Resolver problemas

---

**Sua estrutura é melhor que a original!** 

Manter `loans` e `clients` separados é mais normalizado e profissional. 👍

