# 🔧 Solucionando Erro 405 - WhatsApp

## ❌ O Problema:

**Erro 405** indica que o WhatsApp está **rejeitando a conexão** do bot.

Causas comuns:
1. **Rate Limiting** - Muitas tentativas de conexão
2. **IP Bloqueado** - Servidor do Render pode estar em lista negra temporária
3. **Sessão Corrompida** - Dados de autenticação inválidos
4. **Problemas de Rede** - Firewall ou conectividade

---

## ✅ Correções Aplicadas:

### 1. Retry Logic Inteligente
- Máximo 5 tentativas
- Delay de 10 segundos entre tentativas
- Limpa sessão corrompida após 3 tentativas com erro 405

### 2. Timeouts Aumentados
```javascript
defaultQueryTimeoutMs: 60000,  // 60 segundos
connectTimeoutMs: 60000,
keepAliveIntervalMs: 30000,
```

### 3. Logs Detalhados
- Mostra código do erro
- Mostra mensagem completa
- Conta tentativas de reconexão

---

## 🚀 O Que Fazer AGORA:

### Opção 1: Aguardar o Deploy e Tentar Novamente (RECOMENDADO)

1. **Aguarde o deploy completar** (3-5 min)
   - Commit: `c030763`

2. **O bot vai tentar automaticamente:**
   - Tentativa 1 → Aguarda 10s
   - Tentativa 2 → Aguarda 10s
   - Tentativa 3 → **Limpa sessão** → Aguarda 10s
   - Tentativa 4 → Aguarda 10s
   - Tentativa 5 → Para

3. **Verifique os logs:**
   ```
   🔌 Estabelecendo conexão com WhatsApp...
   🔄 Conectando ao WhatsApp...
   📱 QR Code gerado! Acesse /api/qr para escanear
   ```

4. **Se gerar QR Code:**
   - Acesse `/api/qr`
   - Escaneie rapidamente
   - Pronto!

### Opção 2: Reiniciar o Serviço no Render

Se após 5 tentativas não funcionar:

1. **Render Dashboard**
2. **Manual Deploy**
3. **Deploy latest commit**
4. Aguardar novo deploy
5. Tentar novamente

### Opção 3: Aguardar 30-60 Minutos

O erro 405 pode ser **rate limiting temporário**.

- WhatsApp bloqueia IPs que tentam conectar muitas vezes
- Aguardar 30-60 minutos resolve automaticamente
- Depois reinicie o serviço

---

## 📊 Entendendo o Erro 405:

| Situação | Significado | Solução |
|----------|-------------|---------|
| **Primeira tentativa 405** | Rate limit ou problema de rede | Aguardar e tentar novamente |
| **Múltiplos 405** | IP do Render pode estar bloqueado | Aguardar 30-60 min |
| **405 após limpar sessão** | Problema mais sério | Trocar IP (redeploy) ou aguardar |

---

## 🔍 Verificar Logs no Render:

### Logs Bons (funcionando):
```
🔌 Estabelecendo conexão com WhatsApp...
🔄 Conectando ao WhatsApp...
📱 QR Code gerado! Acesse /api/qr para escanear
📋 Tamanho do QR: 234
```

### Logs com Problema:
```
❌ Conexão fechada (código: 405, mensagem: Method Not Allowed)
🔄 Tentativa 1/5 - Reconectando em 10s...
❌ Conexão fechada (código: 405, mensagem: Method Not Allowed)
🔄 Tentativa 2/5 - Reconectando em 10s...
```

### Após 3 tentativas:
```
🗑️ Limpando sessão corrompida...
🔄 Tentativa 3/5 - Reconectando em 10s...
```

### Se atingir máximo:
```
⚠️ Máximo de tentativas atingido. Bot em standby.
💡 Acesse /api/qr para tentar novamente ou reinicie o serviço.
```

---

## 🎯 Plano de Ação:

### Imediato (Agora):

1. **Aguarde deploy** (3-5 min)
2. **Monitore logs** no Render
3. **Procure por:** `📱 QR Code gerado!`

### Se QR Code Aparecer:

```bash
curl https://seu-app.onrender.com/api/qr
```

Copie o código e use gerador online:
- https://qr-code-styling.com/
- Cole o código
- Escaneie com WhatsApp

### Se Erro 405 Persistir:

**Aguarde 30 minutos** e depois:

1. Render → Manual Deploy
2. Deploy latest commit
3. Aguardar
4. Tentar novamente

---

## 💡 Alternativas:

### Usar Outro Serviço de Hospedagem

Se o Render continuar com problema 405:

**Railway.app** (alternativa ao Render):
```yaml
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Heroku** (mais estável mas pago):
- Dynos pagos não dormem
- IP mais confiável
- Menos chance de bloqueio

**VPS** (melhor opção):
- DigitalOcean
- Linode
- Vultr
- IP dedicado

---

## 🔧 Troubleshooting Avançado:

### 1. Verificar se IP está Bloqueado

```bash
# Testar conectividade com servidores WhatsApp
curl -I https://web.whatsapp.com
```

### 2. Limpar Sessão Manualmente

No Render, adicione build command:
```bash
rm -rf auth_info && npm install && npm start
```

### 3. Adicionar Variável de Ambiente

```
BAILEYS_LOGGER_LEVEL=debug
```

Para ver mais detalhes nos logs.

### 4. Testar Localmente Primeiro

```bash
# No seu computador
npm install
npm start

# Se funcionar local, problema é do Render
```

---

## 📱 Quando Funcionar:

### Ver Status:
```bash
curl https://seu-app.onrender.com/api/status
```

### Ver QR Code:
```bash
curl https://seu-app.onrender.com/api/qr
```

### Testar Envio:
```bash
curl -X POST https://seu-app.onrender.com/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Teste!"
  }'
```

---

## ⏰ Timeline de Recuperação:

```
0-5 min:   Deploy e tentativas automáticas
5-10 min:  Se funcionar → QR Code gerado
10-30 min: Se não funcionar → Aguardar rate limit
30-60 min: Reiniciar serviço
60+ min:   Considerar alternativas
```

---

## 🎯 Status Atual:

```
✅ Código melhorado
✅ Retry logic implementada
✅ Limpeza de sessão automática
✅ Commit: c030763
✅ Push: Concluído
🔄 Render: Fazendo deploy
⏳ Aguarde: 3-5 minutos
```

---

## 🆘 Se Nada Funcionar:

### Última Opção: Usar Número Diferente

1. Use número que JÁ usou WhatsApp Web antes
2. Não use número novo/nunca usado
3. Evite números virtuais (Twilio, etc)
4. Use número pessoal/corporativo real

---

## 📚 Recursos Úteis:

- **Baileys Issues**: https://github.com/WhiskeySockets/Baileys/issues
- **Render Status**: https://status.render.com
- **WhatsApp Status**: https://downdetector.com.br/fora-do-ar/whatsapp

---

**AGUARDE O DEPLOY E MONITORE OS LOGS!**

Se aparecer `📱 QR Code gerado!` = sucesso! 🎉

Se erro 405 persistir por 30+ min = aguardar ou trocar hospedagem.

Me avise o que aparecer nos logs! 🚀

