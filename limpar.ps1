# Limpar processos
Write-Host "ðŸ§¹ Limpando processos..." -ForegroundColor Yellow
Get-Process chrome,node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "âœ… Processos limpos!" -ForegroundColor Green
