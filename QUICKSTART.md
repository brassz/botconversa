# ⚡ Início Rápido - 5 Minutos

## 🚀 Deploy Rápido no Render

### 1. Preparar Código (2 min)
```bash
git init
git add .
git commit -m "Bot de cobrança WhatsApp"
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main
```

### 2. Configurar Supabase (2 min)

**Banco Principal** (https://mhtxyxizfnxupwmilith.supabase.co):
- Abra SQL Editor
- Cole e execute a **parte 1** de `database/schema.sql`
- Insira dados de teste (opcional): `database/exemplo_clientes.sql`

**Banco do Bot** (https://vpxdtrhqzxfllgjvrdrg.supabase.co):
- Abra SQL Editor
- Cole e execute a **parte 2** de `database/schema.sql`

### 3. Deploy no Render (1 min)

1. Acesse https://render.com
2. New + → Web Service
3. Conecte GitHub → Selecione repositório
4. Configure:
   - Name: `bot-cobranca-whatsapp`
   - Build: `npm install`
   - Start: `npm start`

5. **Environment Variables** (copie do `CREDENTIALS.txt`):
   ```
   SUPABASE_URL=https://mhtxyxizfnxupwmilith.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   BOT_SUPABASE_URL=https://vpxdtrhqzxfllgjvrdrg.supabase.co
   BOT_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NODE_ENV=production
   PORT=3000
   HORA_ENVIO_LEMBRETES=09:00
   HORA_ENVIO_VENCIMENTO=09:00
   HORA_ENVIO_ATRASO=10:00
   ```

6. Clique em **Create Web Service**

### 4. Conectar WhatsApp (30 seg)

1. Aguarde o deploy completar
2. Acesse: `https://seu-app.onrender.com/api/qr`
3. Escaneie o QR Code com WhatsApp
4. Verifique: `https://seu-app.onrender.com/api/status`
   - Deve mostrar: `"connected": true`

## ✅ Pronto!

Seu bot está no ar! 🎉

### Testar Agora

```bash
# Ver status
curl https://seu-app.onrender.com/api/status

# Enviar mensagem de teste
curl -X POST https://seu-app.onrender.com/api/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "5511999999999", "message": "Teste!"}'

# Ver clientes
curl https://seu-app.onrender.com/api/clientes/all
```

## 📋 Próximos Passos

1. **Configurar dados reais** no banco de clientes
2. **Testar cobrança manual**: 
   ```bash
   curl -X POST https://seu-app.onrender.com/api/cobrancas/processar
   ```
3. **Integrar com seu sistema** (ver `USAGE.md`)
4. **Monitorar logs** no painel do Render

## 📚 Documentação Completa

- 📖 `README.md` - Visão geral completa
- 🚀 `DEPLOY.md` - Guia detalhado de deploy
- 💡 `USAGE.md` - Como usar a API
- ✅ `CHECKLIST.md` - Checklist completo
- 📝 `CREDENTIALS.txt` - Suas credenciais

## 🆘 Problemas?

### WhatsApp não conecta
```bash
# Obter novo QR Code
curl https://seu-app.onrender.com/api/qr
```

### Mensagens não enviam
- Verifique formato do telefone: `5511999999999`
- Confirme que WhatsApp está conectado: `/api/status`
- Veja os logs no painel do Render

### Clientes não aparecem
- Verifique se as tabelas foram criadas no Supabase
- Confirme que os dados estão inseridos
- Teste a conexão: `/api/clientes/all`

## 💬 Precisa de Ajuda?

Consulte a documentação completa ou verifique:
1. Logs no Render
2. Status: `/api/status`
3. Histórico: `/api/historico`

---

**Tempo total: ~5 minutos** ⚡

Agora seu bot está pronto para enviar cobranças automáticas 24/7!

