# ============================================
# Script para criar arquivo .env
# ============================================

Write-Host ""
Write-Host "🔑 Configurador de Variáveis de Ambiente" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Template do .env
$envContent = @"
# ============================================
# CONFIGURAÇÕES DO SUPABASE
# ============================================

# Banco de Dados PRINCIPAL (Clientes e Empréstimos)
SUPABASE_URL=https://mhtxyxizfnxupwmilith.supabase.co
SUPABASE_KEY=COLE_SUA_CHAVE_AQUI

# Banco de Dados DO BOT (Logs e Mensagens)
BOT_SUPABASE_URL=https://vpxdtrhqzxfllgjvrdrg.supabase.co
BOT_SUPABASE_KEY=COLE_SUA_CHAVE_AQUI

# Porta do servidor (opcional)
PORT=3001
"@

# Criar arquivo .env
try {
    $envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
    Write-Host "✅ Arquivo .env criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Acesse o Supabase PRINCIPAL:" -ForegroundColor Cyan
    Write-Host "   https://mhtxyxizfnxupwmilith.supabase.co" -ForegroundColor White
    Write-Host "   Settings → API → Copie a chave 'anon public'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Acesse o Supabase BOT:" -ForegroundColor Cyan
    Write-Host "   https://vpxdtrhqzxfllgjvrdrg.supabase.co" -ForegroundColor White
    Write-Host "   Settings → API → Copie a chave 'anon public'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Abra o arquivo .env e substitua 'COLE_SUA_CHAVE_AQUI'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "4. Execute: npm start" -ForegroundColor Cyan
    Write-Host ""
    
    # Abrir o arquivo no notepad
    Write-Host "Deseja abrir o arquivo .env agora? (S/N): " -NoNewline -ForegroundColor Yellow
    $resposta = Read-Host
    
    if ($resposta -eq "S" -or $resposta -eq "s") {
        notepad.exe .env
    }
    
} catch {
    Write-Host "❌ Erro ao criar arquivo .env: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Consulte o arquivo CONFIGURAR-ENV.md para mais detalhes." -ForegroundColor Gray
Write-Host ""

