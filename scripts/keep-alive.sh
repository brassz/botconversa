#!/bin/bash

# Script para manter o bot ativo (importante para Render Free Tier)
# O Render desliga o serviço após 15 minutos sem requisições
# Este script faz ping a cada 10 minutos

BOT_URL="${1:-https://seu-app.onrender.com}"

if [ -z "$1" ]; then
  echo "⚠️ URL não fornecida, usando padrão: $BOT_URL"
  echo "Uso: ./keep-alive.sh https://seu-app.onrender.com"
  echo ""
fi

echo "🔄 Iniciando Keep-Alive para $BOT_URL"
echo "Pressione Ctrl+C para parar"
echo ""

while true; do
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  
  # Fazer requisição
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BOT_URL/api/")
  
  if [ "$HTTP_CODE" -eq 200 ]; then
    echo "[$TIMESTAMP] ✅ Ping OK (HTTP $HTTP_CODE)"
  else
    echo "[$TIMESTAMP] ⚠️ Ping FALHOU (HTTP $HTTP_CODE)"
  fi
  
  # Aguardar 10 minutos (600 segundos)
  sleep 600
done

