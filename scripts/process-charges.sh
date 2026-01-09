#!/bin/bash

# Script para processar cobranças manualmente
# Uso: ./scripts/process-charges.sh https://seu-app.onrender.com [tipo]
# Tipos: all, lembretes, vencimento-hoje, atrasadas

BOT_URL="${1:-http://localhost:3000}/api"
TYPE="${2:-all}"

echo "🤖 Processando Cobranças"
echo "URL: $BOT_URL"
echo "Tipo: $TYPE"
echo ""

case $TYPE in
  all)
    echo "📊 Processando TODAS as cobranças..."
    curl -X POST "$BOT_URL/cobrancas/processar" | jq '.'
    ;;
  lembretes)
    echo "🔔 Enviando lembretes (vence amanhã)..."
    curl -X POST "$BOT_URL/cobrancas/lembretes" | jq '.'
    ;;
  vencimento-hoje)
    echo "⏰ Enviando notificações de vencimento hoje..."
    curl -X POST "$BOT_URL/cobrancas/vencimento-hoje" | jq '.'
    ;;
  atrasadas)
    echo "⚠️ Enviando cobranças atrasadas..."
    curl -X POST "$BOT_URL/cobrancas/atrasadas" | jq '.'
    ;;
  *)
    echo "❌ Tipo inválido: $TYPE"
    echo "Tipos válidos: all, lembretes, vencimento-hoje, atrasadas"
    exit 1
    ;;
esac

echo ""
echo "✅ Processamento concluído!"

