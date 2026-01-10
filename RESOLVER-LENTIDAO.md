# 🐌 Resolver Lentidão e Travamentos

## 🔴 Problemas Identificados

### 1. Chrome/Puppeteer Travado
```
❌ The browser is already running for tokens/cobranca-session
```

### 2. Painel Não Carrega Clientes
- Página fica carregando infinitamente
- Spinner não para
- Nenhum dado aparece

---

## ✅ Soluções

### 🚀 Solução Rápida (Use Sempre Que Travar)

**No PowerShell:**

```powershell
.\limpar.ps1
npm start
```

Isso vai:
1. Matar processos travados (Chrome + Node)
2. Reiniciar o bot limpo

---

### 🔧 Solução Completa

#### 1️⃣ Limpar Processos Travados

```powershell
# Matar Chrome e Node
Get-Process chrome,node -ErrorAction SilentlyContinue | Stop-Process -Force

# Verificar se matou
Get-Process chrome,node -ErrorAction SilentlyContinue
```

Se não retornar nada = ✅ Processos limpos!

#### 2️⃣ Limpar Cache do Navegador

No Chrome/Edge:
- Pressione: `Ctrl + Shift + Delete`
- Marque: "Imagens e arquivos em cache"
- Clique: "Limpar dados"

#### 3️⃣ Limpar Sessão do WhatsApp (Se Necessário)

```powershell
# Deletar pasta de sessão
Remove-Item -Path "tokens\cobranca-session" -Recurse -Force -ErrorAction SilentlyContinue

# Reiniciar
npm start
```

**⚠️ Atenção**: Você precisará escanear o QR Code novamente!

#### 4️⃣ Verificar Banco de Dados

**Teste se o banco está respondendo:**

Acesse no navegador:
```
http://localhost:3001/api/clientes/all
```

**Resultados possíveis:**

✅ **Retorna JSON com clientes**: Banco OK, problema é no frontend  
❌ **Erro 500**: Problema no banco ou credenciais  
⏳ **Fica carregando**: Banco lento ou query pesada  

---

## 🔍 Diagnóstico de Lentidão

### Teste 1: API Direta

```powershell
# Testar API
curl http://localhost:3001/api/status
```

**Se demorar mais de 2 segundos**: Problema no backend

### Teste 2: Console do Navegador

1. Abra o painel: `http://localhost:3001`
2. Pressione `F12` (DevTools)
3. Vá na aba "Console"
4. Veja os erros

**Erros comuns:**

```javascript
// ❌ Erro de CORS
Access to fetch has been blocked by CORS policy

// ❌ Erro de conexão
Failed to fetch

// ❌ Erro 500
Internal Server Error
```

### Teste 3: Logs do Servidor

No terminal onde o bot está rodando, procure por:

```
❌ Erro ao buscar empréstimos
❌ Erro ao conectar Supabase
⏳ Query demorou mais de 5s
```

---

## ⚡ Otimizações

### 1. Adicionar Limite de Resultados

Se você tem MUITOS clientes (>1000), a query pode ficar lenta.

**Solução**: Adicionar paginação ou limite

Edite `src/api/routes.js`:

```javascript
// Linha ~410
router.get('/clientes/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const { limit = 100 } = req.query; // ← ADICIONAR LIMITE
    
    let clientes;
    switch (status) {
      case 'all':
        clientes = await getAllClientsForReminder();
        break;
      // ... resto do código
    }
    
    // Limitar resultados
    clientes = clientes.slice(0, limit);
    
    res.json({ 
      status, 
      count: clientes.length,
      clientes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // ...
  }
});
```

### 2. Adicionar Timeout na API

No `public/painel.html`, adicionar timeout:

```javascript
// Função loadClients() - linha ~647
async function loadClients() {
    try {
        // Adicionar timeout de 10 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const res = await fetch(`${API_URL}/clientes/all`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        // ... resto do código
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('⏱️ Timeout: A requisição demorou mais de 10s');
        }
        // ... resto do erro
    }
}
```

### 3. Verificar Índices no Banco

Execute no Supabase PRINCIPAL:

```sql
-- Verificar índices existentes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('loans', 'clients')
ORDER BY tablename, indexname;

-- Se não tiver índices, criar:
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_due_date ON loans(due_date);
CREATE INDEX IF NOT EXISTS idx_loans_client_id ON loans(client_id);
```

---

## 🛠️ Scripts Úteis

### `limpar.ps1` - Limpar Processos

```powershell
.\limpar.ps1
```

### Reiniciar Bot Limpo

```powershell
.\limpar.ps1
npm start
```

### Verificar Processos Rodando

```powershell
Get-Process node,chrome -ErrorAction SilentlyContinue
```

### Matar Processo Específico

```powershell
# Por nome
Stop-Process -Name "node" -Force

# Por porta (se souber qual porta está travada)
netstat -ano | findstr :3001
taskkill /PID <numero_do_pid> /F
```

---

## 📊 Checklist de Diagnóstico

Quando o painel estiver lento:

- [ ] Limpar processos travados (`.\limpar.ps1`)
- [ ] Verificar logs do servidor (terminal)
- [ ] Testar API direta (`/api/clientes/all`)
- [ ] Verificar console do navegador (F12)
- [ ] Limpar cache do navegador
- [ ] Verificar conexão com Supabase
- [ ] Verificar se tem muitos dados (>1000 clientes)
- [ ] Verificar índices no banco de dados

---

## 🚨 Problemas Específicos

### Problema: "Cannot connect to Supabase"

**Verificar**:
1. Arquivo `.env` está correto?
2. Chaves do Supabase estão válidas?
3. Supabase está online (não pausado)?

**Testar conexão**:
```powershell
curl https://mhtxyxizfnxupwmilith.supabase.co
curl https://vpxdtrhqzxfllgjvrdrg.supabase.co
```

### Problema: "CORS Error"

**Causa**: Frontend e backend em portas diferentes

**Solução**: Já está configurado CORS no `src/index.js`

Se persistir, adicione:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Problema: Painel Carrega mas Não Mostra Dados

**Verificar**:
1. Tem clientes no banco?
2. Status dos clientes está correto (overdue, due_today)?
3. Filtro está selecionado corretamente?

**Testar SQL**:
```sql
-- No Supabase PRINCIPAL
SELECT COUNT(*) FROM loans WHERE status IN ('overdue', 'due_today');
```

Se retornar 0 = Não tem clientes para mostrar!

---

## ⚡ Modo de Desenvolvimento (Mais Rápido)

Para testar mais rápido durante desenvolvimento:

```powershell
# Usar nodemon (reinicia automaticamente)
npm install -g nodemon
nodemon src/index.js
```

---

## 📞 Resumo Rápido

**Bot travou?**
```powershell
.\limpar.ps1
npm start
```

**Painel lento?**
1. F12 → Console → Veja erros
2. Teste: `http://localhost:3001/api/clientes/all`
3. Verifique logs do servidor

**Chrome não fecha?**
```powershell
Get-Process chrome | Stop-Process -Force
```

**Resetar tudo?**
```powershell
.\limpar.ps1
Remove-Item tokens\cobranca-session -Recurse -Force
npm start
```

---

✅ **Agora está otimizado e com ferramentas para resolver travamentos!** 🚀

