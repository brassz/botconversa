# 🗄️ Configuração do Banco de Dados - Passo a Passo

## ⚠️ ERRO: "relation message_logs does not exist"

**Causa**: A tabela ainda não foi criada no banco de dados.

**Solução**: Execute o script completo abaixo.

---

## 📋 Passo a Passo Completo

### 1️⃣ Acesse o Supabase BOT

1. Entre em: **https://vpxdtrhqzxfllgjvrdrg.supabase.co**
2. Faça login
3. No menu lateral, clique em: **SQL Editor**

### 2️⃣ Execute o Script Completo

Copie e cole este script no SQL Editor:

```sql
-- ============================================
-- SETUP COMPLETO: Criar tabela message_logs
-- ============================================

-- 1. Criar tabela de logs (se não existir)
CREATE TABLE IF NOT EXISTS message_logs (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER,
  client_id INTEGER NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('lembrete', 'vencimento_hoje', 'atraso')),
  message_content TEXT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- 2. Criar índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_logs_loan ON message_logs(loan_id);
CREATE INDEX IF NOT EXISTS idx_logs_client ON message_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_logs_sent_at ON message_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_logs_status ON message_logs(status);
CREATE INDEX IF NOT EXISTS idx_logs_message_type ON message_logs(message_type);

-- 3. Se a tabela já existir, adicionar coluna message_content (se não tiver)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'message_logs' AND column_name = 'message_content'
    ) THEN
        ALTER TABLE message_logs ADD COLUMN message_content TEXT;
    END IF;
END $$;

-- 4. Adicionar comentários para documentação
COMMENT ON TABLE message_logs IS 'Histórico de todas as mensagens enviadas pelo bot';
COMMENT ON COLUMN message_logs.message_content IS 'Conteúdo completo da mensagem enviada';

-- 5. Verificar a estrutura final
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'message_logs'
ORDER BY ordinal_position;
```

### 3️⃣ Clique em "RUN" (Executar)

Você deve ver uma mensagem de sucesso e uma tabela mostrando as colunas criadas:

```
column_name       | data_type | is_nullable | column_default
------------------+-----------+-------------+-------------------
id                | integer   | NO          | nextval(...)
loan_id           | integer   | YES         | NULL
client_id         | integer   | NO          | NULL
client_name       | varchar   | NO          | NULL
phone             | varchar   | NO          | NULL
message_type      | varchar   | NO          | NULL
message_content   | text      | YES         | NULL
status            | varchar   | NO          | NULL
error_message     | text      | YES         | NULL
sent_at           | timestamp | YES         | now()
```

### 4️⃣ Verificar se funcionou

Execute esta query de teste:

```sql
-- Testar se a tabela existe
SELECT COUNT(*) FROM message_logs;
```

Se retornar `0` (zero), está perfeito! ✅

---

## 🎯 O Que Este Script Faz

1. **Cria a tabela `message_logs`** com todos os campos necessários
2. **Cria índices** para consultas rápidas
3. **Adiciona a coluna `message_content`** (se já existir a tabela mas faltar a coluna)
4. **Adiciona comentários** para documentação
5. **Mostra a estrutura** final da tabela

---

## ✅ Próximos Passos

Depois de executar o script:

1. ✅ Tabela criada com sucesso
2. ✅ Reinicie o bot (se necessário)
3. ✅ Acesse: `http://localhost:3001`
4. ✅ Clique na aba "💬 Chat"
5. ✅ Veja as mensagens! 🎉

---

## 🐛 Troubleshooting

### Erro: "permission denied"
**Solução**: Verifique se está logado com o usuário correto no Supabase.

### Erro: "syntax error"
**Solução**: Certifique-se de copiar o script completo, sem cortar nenhuma parte.

### Tabela criada mas não aparece no painel
**Solução**: 
1. Verifique a URL do Supabase nas variáveis de ambiente
2. Reinicie o servidor
3. Limpe o cache do navegador (Ctrl+F5)

---

## 📊 Estrutura da Tabela

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL | ID único do log |
| `loan_id` | INTEGER | ID do empréstimo (opcional) |
| `client_id` | INTEGER | ID do cliente |
| `client_name` | VARCHAR | Nome do cliente |
| `phone` | VARCHAR | Telefone do cliente |
| `message_type` | VARCHAR | Tipo: lembrete, vencimento_hoje, atraso |
| `message_content` | TEXT | **NOVO!** Conteúdo da mensagem |
| `status` | VARCHAR | Status: sent, failed |
| `error_message` | TEXT | Mensagem de erro (se houver) |
| `sent_at` | TIMESTAMP | Data/hora do envio |

---

## 🎉 Pronto!

Depois de executar o script, a aba Chat funcionará perfeitamente! 🚀

Se tiver dúvidas, consulte os arquivos:
- 📖 `ATUALIZACAO-CHAT.md`
- 📖 `RESUMO-ALTERACOES.md`
- 📖 `LEIA-ME-CHAT.txt`

