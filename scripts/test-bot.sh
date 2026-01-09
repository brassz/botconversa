#!/bin/bash

# Script de teste do bot de cobrança
# Uso: ./scripts/test-bot.sh https://seu-app.onrender.com

if [ -z "$1" ]; then
  echo "❌ Erro: URL não fornecida"
  echo "Uso: ./test-bot.sh https://seu-app.onrender.com"
  exit 1
fi

BOT_URL="$1/api"

echo "🧪 Testando Bot de Cobrança WhatsApp"
echo "URL: $BOT_URL"
echo ""

# Teste 1: Health Check
echo "1️⃣ Health Check..."
curl -s "$BOT_URL/" | jq '.'
echo ""

# Teste 2: Status do WhatsApp
echo "2️⃣ Status da Conexão WhatsApp..."
curl -s "$BOT_URL/status" | jq '.'
echo ""

# Teste 3: Listar clientes ativos
echo "3️⃣ Clientes Ativos (vencem amanhã)..."
curl -s "$BOT_URL/clientes/active" | jq '.count'
echo ""

# Teste 4: Clientes que vencem hoje
echo "4️⃣ Clientes com Vencimento Hoje..."
curl -s "$BOT_URL/clientes/due_today" | jq '.count'
echo ""

# Teste 5: Clientes atrasados
echo "5️⃣ Clientes Atrasados..."
curl -s "$BOT_URL/clientes/overdue" | jq '.count'
echo ""

# Teste 6: Histórico recente
echo "6️⃣ Últimas 5 Mensagens..."
curl -s "$BOT_URL/historico?limit=5" | jq '.historico[] | {cliente: .client_name, tipo: .message_type, status: .status}'
echo ""

echo "✅ Testes concluídos!"

