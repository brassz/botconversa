#!/bin/bash

# Script para enviar mensagem via bot
# Uso: ./scripts/send-message.sh https://seu-app.onrender.com 5511999999999 "Sua mensagem"

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo "❌ Erro: Parâmetros insuficientes"
  echo "Uso: ./send-message.sh <URL_BOT> <TELEFONE> <MENSAGEM>"
  echo "Exemplo: ./send-message.sh https://bot.onrender.com 5511999999999 'Olá!'"
  exit 1
fi

BOT_URL="$1/api"
PHONE="$2"
MESSAGE="$3"

echo "📱 Enviando mensagem via WhatsApp Bot"
echo "Para: $PHONE"
echo "Mensagem: $MESSAGE"
echo ""

curl -X POST "$BOT_URL/send" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"$PHONE\", \"message\": \"$MESSAGE\"}" \
  | jq '.'

echo ""
echo "✅ Comando executado!"

