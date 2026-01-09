-- ============================================
-- ADAPTAÇÃO PARA BANCO EXISTENTE
-- Use este arquivo se você JÁ TEM as tabelas loans e clients
-- ============================================

-- ============================================
-- BANCO DE DADOS PRINCIPAL (Sistema Existente)
-- URL: https://mhtxyxizfnxupwmilith.supabase.co
-- ============================================

-- ⚠️ NÃO PRECISA CRIAR TABELAS!
-- Você já tem:
-- - loans (empréstimos com status)
-- - clients (clientes)

-- Apenas certifique-se que sua tabela loans tenha estes campos:
-- id, client_id, amount/valor, due_date/data_vencimento, status

-- Verificar estrutura da tabela loans
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'loans';

-- Verificar estrutura da tabela clients
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clients';

-- Criar índices para melhor performance (se ainda não existirem)
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_due_date ON loans(due_date);
CREATE INDEX IF NOT EXISTS idx_loans_client_id ON loans(client_id);

-- ============================================
-- BANCO DE DADOS DO BOT (Logs e Configurações)
-- URL: https://vpxdtrhqzxfllgjvrdrg.supabase.co
-- ============================================

-- Tabela de logs de mensagens enviadas
CREATE TABLE IF NOT EXISTS message_logs (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER NOT NULL,
  client_id INTEGER NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('lembrete', 'vencimento_hoje', 'atraso')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_logs_loan ON message_logs(loan_id);
CREATE INDEX IF NOT EXISTS idx_logs_client ON message_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_logs_sent_at ON message_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_logs_status ON message_logs(status);
CREATE INDEX IF NOT EXISTS idx_logs_message_type ON message_logs(message_type);

-- Tabela de configurações do bot
CREATE TABLE IF NOT EXISTS bot_config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO bot_config (key, value, description) VALUES
  ('bot_status', 'active', 'Status do bot: active, paused, maintenance'),
  ('max_retries', '3', 'Número máximo de tentativas de reenvio'),
  ('delay_between_messages', '3000', 'Delay entre mensagens em ms')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- QUERIES DE EXEMPLO PARA SEU BANCO
-- ============================================

-- Ver todos os empréstimos atrasados com dados do cliente
SELECT 
  l.id as loan_id,
  c.id as client_id,
  c.name as client_name,
  c.phone as client_phone,
  c.email as client_email,
  l.amount,
  l.due_date,
  l.status,
  CURRENT_DATE - l.due_date as dias_atraso
FROM loans l
INNER JOIN clients c ON l.client_id = c.id
WHERE l.status = 'overdue'
ORDER BY l.due_date;

-- Ver empréstimos que vencem hoje
SELECT 
  l.id as loan_id,
  c.id as client_id,
  c.name as client_name,
  c.phone as client_phone,
  l.amount,
  l.due_date,
  l.status
FROM loans l
INNER JOIN clients c ON l.client_id = c.id
WHERE l.status = 'due_today'
ORDER BY l.due_date;

-- Ver empréstimos ativos (vencem amanhã)
SELECT 
  l.id as loan_id,
  c.id as client_id,
  c.name as client_name,
  c.phone as client_phone,
  l.amount,
  l.due_date,
  l.status
FROM loans l
INNER JOIN clients c ON l.client_id = c.id
WHERE l.status = 'active'
ORDER BY l.due_date;

-- Contar por status
SELECT 
  status,
  COUNT(*) as total,
  SUM(amount) as valor_total
FROM loans
GROUP BY status;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

-- 1. Ajuste os nomes dos campos conforme sua tabela:
--    - Se sua coluna é 'valor' ao invés de 'amount', ajuste nas queries
--    - Se é 'data_vencimento' ao invés de 'due_date', ajuste
--    - Se é 'nome' ao invés de 'name', ajuste
--    - Se é 'telefone' ao invés de 'phone', ajuste

-- 2. Formato do telefone deve ser: 5511999999999
--    Se estiver diferente, precisará normalizar:
--    
--    UPDATE clients 
--    SET phone = REGEXP_REPLACE(phone, '[^0-9]', '', 'g')
--    WHERE phone IS NOT NULL;

-- 3. Status deve ser exatamente: 'active', 'due_today', 'overdue'
--    (case-sensitive)

-- 4. Seu sistema deve continuar atualizando os status dos loans
--    O bot apenas LÊ os dados, não altera

