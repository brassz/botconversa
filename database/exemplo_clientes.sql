-- ============================================
-- DADOS DE EXEMPLO PARA TESTE
-- Execute no banco PRINCIPAL (clientes)
-- ============================================

-- Limpar tabela (cuidado em produção!)
-- TRUNCATE TABLE clientes RESTART IDENTITY CASCADE;

-- Inserir clientes de exemplo
INSERT INTO clientes (nome, telefone, email, valor, data_vencimento, status) VALUES
-- Cliente que vence amanhã (lembrete)
('João Silva', '5511999999999', 'joao@email.com', 99.90, CURRENT_DATE + INTERVAL '1 day', 'active'),

-- Cliente que vence hoje
('Maria Santos', '5511988888888', 'maria@email.com', 149.90, CURRENT_DATE, 'due_today'),

-- Clientes atrasados
('Pedro Oliveira', '5511977777777', 'pedro@email.com', 79.90, CURRENT_DATE - INTERVAL '2 days', 'overdue'),
('Ana Costa', '5511966666666', 'ana@email.com', 199.90, CURRENT_DATE - INTERVAL '5 days', 'overdue'),
('Carlos Souza', '5511955555555', 'carlos@email.com', 129.90, CURRENT_DATE - INTERVAL '10 days', 'overdue'),

-- Mais clientes ativos (para teste em massa)
('Fernanda Lima', '5511944444444', 'fernanda@email.com', 89.90, CURRENT_DATE + INTERVAL '1 day', 'active'),
('Ricardo Alves', '5511933333333', 'ricardo@email.com', 159.90, CURRENT_DATE + INTERVAL '1 day', 'active');

-- Verificar dados inseridos
SELECT 
  id,
  nome,
  telefone,
  valor,
  data_vencimento,
  status,
  CASE 
    WHEN status = 'overdue' THEN CURRENT_DATE - data_vencimento
    ELSE 0
  END as dias_atraso
FROM clientes
ORDER BY status DESC, data_vencimento;

-- Contar por status
SELECT 
  status,
  COUNT(*) as total,
  SUM(valor) as valor_total
FROM clientes
GROUP BY status;

