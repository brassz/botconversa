# 🎨 Guia do Painel de Cobranças

## 🚀 Como Acessar

Após iniciar o bot, acesse:

```
http://localhost:3001
```

O painel abrirá automaticamente! 🎉

---

## 📋 Funcionalidades

### **1. Dashboard de Estatísticas**
- 📊 Total de clientes
- 🔴 Clientes em atraso
- 🟡 Clientes que vencem hoje
- 🔵 Clientes ativos

### **2. Filtros Rápidos**
- **📋 Todos**: Exibe todos os clientes
- **🔴 Em Atraso**: Apenas clientes com pagamento atrasado
- **🟡 Vencem Hoje**: Clientes com vencimento hoje
- **🔵 Ativos**: Clientes com vencimento futuro

### **3. Seleção de Clientes**
- ✅ Checkbox para selecionar clientes individualmente
- ✅ "Selecionar Todos" para marcar todos de uma vez
- ✅ Contador mostra quantos estão selecionados

### **4. Ações Individuais**
Cada cliente tem dois botões:

- **ℹ️ Ver Detalhes**: Abre modal com informações completas do empréstimo
  - Nome, telefone, email
  - Valor do empréstimo
  - Data de vencimento
  - Status
  - Dias de atraso (se aplicável)
  - Botão para enviar mensagem direto do modal

- **💬 Enviar Mensagem**: Envia mensagem personalizada imediatamente
  - Mensagem automática baseada no status
  - Confirmação antes de enviar

### **5. Envio em Lote**
- **📤 Enviar para Selecionados**: Envia para todos os clientes marcados
- ⏱️ Delay automático de 15 segundos entre mensagens
- 📊 Barra de progresso mostra:
  - Porcentagem concluída
  - Mensagens enviadas
  - Falhas
  - Quantidade restante
- ⏰ Tempo estimado antes de iniciar

### **6. Atualização Automática**
- 🔄 Botão "Atualizar" para recarregar lista de clientes
- 🟢 Indicador de conexão WhatsApp atualiza a cada 30 segundos

---

## 💬 Mensagens Automáticas

O sistema envia mensagens personalizadas baseadas no status:

### **🔴 Em Atraso (overdue)**
```
Olá [Nome]! ⚠️

Seu pagamento de R$ [Valor] está em atraso há [X] dia(s).

Vencimento: [Data]

Por favor, regularize sua situação o quanto antes para evitar juros adicionais.
```

### **🟡 Vence Hoje (due_today)**
```
Olá [Nome]! ⏰

Seu pagamento de R$ [Valor] vence HOJE ([Data]).

Realize o pagamento para evitar multas e juros!
```

### **🔵 Ativo (active)**
```
Olá [Nome]! 😊

Lembramos que seu pagamento de R$ [Valor] vence amanhã ([Data]).

Conte conosco para qualquer dúvida!
```

---

## 🎯 Fluxo de Uso Recomendado

### **Envio Diário de Cobranças:**

1. **09:00** - Abrir o painel
2. Clicar no filtro **🟡 Vencem Hoje**
3. Clicar em "Selecionar Todos"
4. Clicar em **📤 Enviar para Selecionados**
5. Aguardar conclusão (barra de progresso)
6. Repetir para **🔴 Em Atraso**

### **Cobrança Individual:**

1. Localizar o cliente na lista
2. Clicar em **ℹ️ Ver Detalhes** para verificar informações
3. Clicar em **💬 Enviar Mensagem** no modal ou na lista
4. Confirmar envio

### **Cobrança Seletiva:**

1. Usar filtros para encontrar grupo específico
2. Marcar apenas os clientes desejados (checkbox individual)
3. Clicar em **📤 Enviar para Selecionados**
4. Confirmar (mostra tempo estimado)
5. Aguardar conclusão

---

## ⏱️ Tempo de Envio

O sistema envia com **delay de 15 segundos** entre mensagens para evitar bloqueio do WhatsApp.

**Exemplos:**
- 10 clientes = ~2.5 minutos
- 50 clientes = ~12.5 minutos
- 100 clientes = ~25 minutos

💡 **Dica**: Envie em lotes menores (30-50 clientes por vez) para melhor controle.

---

## 🔒 Segurança

- ✅ Confirmação antes de envio em lote
- ✅ Mostra quantidade de mensagens que serão enviadas
- ✅ Indicador de conexão WhatsApp
- ✅ Mensagens personalizadas por status
- ✅ Histórico de envios (backend)

---

## 🎨 Interface

### **Cores por Status:**
- 🔴 **Vermelho**: Em atraso (urgente)
- 🟡 **Amarelo**: Vence hoje (importante)
- 🔵 **Azul**: Ativo (lembrete)

### **Design:**
- 🎨 Inspirado no WhatsApp
- 📱 Responsivo (funciona no celular)
- 🖱️ Interativo (hover, animações)
- 📊 Visual claro e organizado

---

## 🐛 Troubleshooting

### **Lista vazia**
- Verifique se há clientes no banco de dados
- Verifique o filtro selecionado
- Clique em "🔄 Atualizar"

### **WhatsApp desconectado**
- Status mostra "Desconectado" (vermelho)
- Acesse: `http://localhost:3001/api/qr`
- Escaneie o QR Code novamente

### **Erro ao enviar mensagem**
- Verifique conexão WhatsApp
- Verifique número de telefone do cliente
- Veja logs no terminal do servidor

### **Painel não carrega**
- Verifique se o servidor está rodando
- Acesse: `http://localhost:3001/api/status`
- Reinicie o servidor se necessário

---

## 📱 Acesso Mobile

O painel é **totalmente responsivo**!

Acesse pelo celular:
1. Descubra seu IP local: `ipconfig` (Windows)
2. Acesse: `http://[SEU-IP]:3001`
3. Exemplo: `http://192.168.1.100:3001`

---

## 🚀 Atalhos de Teclado

(Para implementar no futuro):
- `Ctrl + R`: Atualizar lista
- `Ctrl + A`: Selecionar todos
- `Ctrl + Enter`: Enviar selecionados
- `Esc`: Fechar modal

---

## 💡 Dicas de Uso

1. **Manhã (09:00)**:
   - Enviar para "Vencem Hoje"
   - Enviar para "Em Atraso"

2. **Meio-dia (12:00)**:
   - Revisar clientes que não pagaram
   - Envio individual para casos críticos

3. **Tarde (15:00)**:
   - Último lembrete para "Vencem Hoje"

4. **Fim do dia**:
   - Verificar estatísticas
   - Preparar relatório

---

## 📊 Relatórios

O painel mostra em tempo real:
- Total de clientes
- Clientes por status
- Contadores visuais

Para relatórios detalhados, use:
```
GET http://localhost:3001/api/historico
```

---

## 🎯 Próximos Passos

1. ✅ Acessar o painel
2. ✅ Conectar WhatsApp (se desconectado)
3. ✅ Testar envio individual
4. ✅ Testar envio em lote (poucos clientes)
5. ✅ Usar diariamente para cobranças

---

## 🆘 Suporte

Se precisar de ajuda:
1. Veja os logs no terminal onde o bot está rodando
2. Acesse `/api/status` para verificar conexão
3. Consulte os guias:
   - `GUIA-INTEGRACAO.md`
   - `RODAR-LOCAL.md`
   - `FAQ.md`

**Acesse agora: http://localhost:3001** 🚀

