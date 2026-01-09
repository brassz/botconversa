# ❓ Perguntas Frequentes (FAQ)

## 🎯 Geral

### O que é este bot?
Um sistema automatizado de cobrança via WhatsApp que envia lembretes, notificações de vencimento e cobranças para clientes atrasados, integrado com Supabase.

### É legal usar o Baileys (API não oficial)?
O Baileys usa o protocolo oficial do WhatsApp Web. Porém, use por sua conta e risco. Para uso comercial em larga escala, considere a API oficial do WhatsApp Business.

### Preciso pagar pelo Render?
Não necessariamente. O plano Free funciona, mas inativa após 15min sem uso. Para produção 24/7, recomenda-se o Starter ($7/mês).

### Quantas mensagens posso enviar?
Não há limite fixo do bot, mas o WhatsApp pode bloquear se detectar spam. Recomendamos:
- Máximo 100 mensagens/hora
- Delay de 3 segundos entre mensagens (já configurado)
- Apenas para clientes existentes

## 🔧 Configuração

### Posso usar apenas um banco de dados Supabase?
Sim, mas foram separados para organização:
- Principal: dados de negócio (clientes)
- Bot: logs operacionais

Você pode adaptar o código para usar apenas um.

### Como alterar as mensagens de cobrança?
Edite o arquivo `src/config/constants.js`:

```javascript
export const MENSAGENS = {
  LEMBRETE: (nome, valor, dataVencimento) => 
    `Sua mensagem personalizada aqui...`,
  // ...
};
```

Após editar, faça commit e push. Render fará deploy automático.

### Posso alterar os horários de envio?
Sim! No Render, vá em Environment Variables e altere:
```
HORA_ENVIO_LEMBRETES=08:00
HORA_ENVIO_VENCIMENTO=10:00
HORA_ENVIO_ATRASO=14:00
```

**Atenção:** Render usa UTC. Ajuste conforme seu timezone.

### Como adicionar mais campos aos clientes?
1. Adicione a coluna no Supabase:
   ```sql
   ALTER TABLE clientes ADD COLUMN cpf VARCHAR(14);
   ```

2. Use em `src/services/clientService.js` conforme necessário

### O bot funciona offline?
Não. Precisa estar rodando 24/7 no Render (ou servidor similar) para enviar mensagens automaticamente.

## 📱 WhatsApp

### Preciso de um número específico para o bot?
Não! Use seu número pessoal ou corporativo. O bot vincula como "dispositivo" no WhatsApp Web.

### Posso usar o mesmo número em múltiplos bots?
Não. Um número pode ter apenas uma instância do bot ativa por vez.

### O bot responde mensagens recebidas?
Na versão atual, não. Apenas envia mensagens. Para adicionar respostas automáticas, você precisará implementar handlers de mensagens.

### Quanto tempo a sessão do WhatsApp dura?
Indefinidamente, enquanto:
- O bot permanecer conectado
- Você não desconectar manualmente no WhatsApp
- A pasta `auth_info` não for deletada

### E se meu WhatsApp desconectar?
O bot tenta reconectar automaticamente. Se não conseguir, você precisará escanear novo QR Code em `/api/qr`.

## 🗄️ Banco de Dados

### Como o status dos clientes é atualizado?
**O bot NÃO atualiza automaticamente**. Seu sistema deve atualizar baseado na data de vencimento:

```sql
-- Executar diariamente no seu sistema
UPDATE clientes SET status = 'overdue' 
WHERE data_vencimento < CURRENT_DATE;

UPDATE clientes SET status = 'due_today' 
WHERE data_vencimento = CURRENT_DATE;

UPDATE clientes SET status = 'active' 
WHERE data_vencimento = CURRENT_DATE + INTERVAL '1 day';
```

### O que significa cada status?

| Status | Significado | Quando enviar | Horário |
|--------|-------------|---------------|---------|
| `active` | Vence amanhã | Lembrete amigável | 09:00 |
| `due_today` | Vence hoje | Notificação urgente | 09:00 |
| `overdue` | Atrasado | Cobrança | 10:00 |

### Posso ter clientes em outros status?
Sim, mas o bot só enviará para os 3 status acima. Você pode ter `paid`, `cancelled`, etc.

### Como evitar que o mesmo cliente receba mensagem todo dia?
O bot já verifica automaticamente se enviou hoje. Um cliente só recebe 1 mensagem por tipo por dia.

## 🚀 Deploy e Hospedagem

### Por que não usar Vercel?
Vercel é serverless e não mantém conexão persistente. Baileys precisa de conexão WebSocket ativa 24/7.

### Posso usar AWS/Azure/Google Cloud?
Sim! Qualquer servidor que rode Node.js 18+. Render foi escolhido pela simplicidade.

### E Docker?
Você pode criar um Dockerfile:

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

### O bot perde a sessão ao fazer redeploy?
Render Free pode perder a pasta `auth_info`. Considere:
- Fazer backup da pasta
- Usar volume persistente (planos pagos)
- Aceitar que precisará reescanear QR às vezes

### Como fazer backup da sessão?
```bash
# Localmente, se tiver acesso SSH
scp -r usuario@servidor:/app/auth_info ./backup/

# Restaurar
scp -r ./backup/auth_info usuario@servidor:/app/
```

## 📊 Uso e Integração

### Como integrar com meu sistema atual?
Use a API REST:

```javascript
// Quando um pagamento for confirmado
await fetch('https://seu-bot.onrender.com/api/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: cliente.telefone,
    message: `Pagamento confirmado! Obrigado ${cliente.nome}!`
  })
});
```

### Posso enviar mensagens manualmente?
Sim! Use o endpoint `/api/send`:

```bash
curl -X POST https://seu-bot.onrender.com/api/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "5511999999999", "message": "Olá!"}'
```

### Como ver quem recebeu mensagem?
```bash
# Histórico geral
curl https://seu-bot.onrender.com/api/historico

# De um cliente específico
curl https://seu-bot.onrender.com/api/historico?client_id=123
```

### Posso enviar para números que não estão no banco?
Sim! Use `/api/send` com qualquer número:

```bash
curl -X POST https://seu-bot.onrender.com/api/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "5511999999999", "message": "Mensagem avulsa"}'
```

### Como processar cobranças fora do horário automático?
```bash
# Todas as cobranças
curl -X POST https://seu-bot.onrender.com/api/cobrancas/processar

# Apenas um tipo
curl -X POST https://seu-bot.onrender.com/api/cobrancas/lembretes
curl -X POST https://seu-bot.onrender.com/api/cobrancas/vencimento-hoje
curl -X POST https://seu-bot.onrender.com/api/cobrancas/atrasadas
```

## 🔒 Segurança

### As chaves do Supabase estão seguras?
As chaves ANON são públicas por design. Para dados sensíveis, configure Row Level Security (RLS) no Supabase.

### Como proteger a API do bot?
Adicione autenticação:

```javascript
// Middleware simples
const authMiddleware = (req, res, next) => {
  if (req.headers['x-api-key'] !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  next();
};

app.use('/api/send', authMiddleware);
```

Configure `API_KEY` nas variáveis de ambiente do Render.

### Alguém pode ver meus logs?
Logs no Render são privados. Apenas você com acesso ao dashboard consegue ver.

## 💰 Custos

### Quanto custa tudo?
- **Render Free**: $0 (com limitações)
- **Render Starter**: $7/mês (recomendado)
- **Supabase Free**: $0 até 500MB + 2GB transferência
- **WhatsApp**: $0 (usando API não oficial)

**Total recomendado: $7/mês**

### Supabase Free é suficiente?
Para até ~10.000 clientes e ~1.000 mensagens/dia, sim.

### Vale a pena o Render pago?
Sim, se você precisa de:
- Bot ativo 24/7 sem interrupções
- Melhor performance
- Sem cold starts

## 🐛 Problemas Comuns

### "Too many requests" do WhatsApp
- Você enviou muitas mensagens muito rápido
- Espere 1-2 horas
- Reduza quantidade de envios
- Já existe delay de 3s (aumente se necessário)

### Bot desconecta toda hora
- Problema de rede do Render (raro)
- Sessão expirou (reescanear QR)
- WhatsApp detectou atividade suspeita

### Mensagens não chegam
- Verifique formato do telefone: `5511999999999`
- Confirme que número está no WhatsApp
- Verifique se bot está conectado: `/api/status`

### Tabela não existe
- Execute o schema SQL no Supabase correto
- `clientes` → Banco Principal
- `message_logs` → Banco do Bot

## 📈 Escalabilidade

### Quantos clientes o bot suporta?
Teoricamente ilimitado. Limite prático:
- Render Free: ~1.000 mensagens/dia
- Render Starter: ~10.000 mensagens/dia
- WhatsApp: ~100-200 mensagens/hora (recomendado)

### Posso ter múltiplos bots?
Sim, cada um com um número de WhatsApp diferente. Útil para:
- Separar departamentos
- Dividir carga
- Backup/redundância

### Como otimizar para muitos clientes?
1. Enviar em lotes pequenos
2. Distribuir envios ao longo do dia
3. Usar filas (Bull, BeeQueue)
4. Considerar API oficial do WhatsApp Business

## 🔮 Recursos Futuros

### Vai ter interface web?
Não está no plano atual, mas você pode contribuir!

### Vai suportar múltiplos atendentes?
Não na versão atual. Baileys suporta, mas requer implementação complexa.

### Vai ter respostas automáticas?
Não por enquanto. Você pode implementar adicionando listeners de mensagens.

### Vai ter envio de imagens/PDFs?
Não implementado ainda, mas Baileys suporta. Você pode adicionar:

```javascript
await sock.sendMessage(jid, {
  image: { url: 'https://...' },
  caption: 'Sua fatura'
});
```

## 📚 Recursos Adicionais

### Onde aprendo mais sobre Baileys?
- GitHub: https://github.com/WhiskeySockets/Baileys
- Docs: https://whiskeysockets.github.io/Baileys/

### Onde reporto bugs?
- GitHub Issues do seu repositório
- Ou documente no projeto

### Posso contribuir?
Sim! Fork o projeto, faça melhorias e envie pull request.

### Existe comunidade?
- WhatsApp Baileys: Grupo no Telegram
- Render: Discord oficial
- Supabase: Discord oficial

---

**Não encontrou sua resposta?**

Consulte:
- `README.md` - Documentação completa
- `TROUBLESHOOTING.md` - Soluções de problemas
- `USAGE.md` - Guia de uso da API
- `DEPLOY.md` - Guia de deploy

