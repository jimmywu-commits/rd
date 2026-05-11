@echo off
chcp 65001 >nul
echo.
echo ================================================
echo    bei jing tu ku index.json geng xin gong ju
echo ================================================
echo.

cd /d "%~dp0.."

echo scanning...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$categories = @('EL','Fashion','FMCG','Lifestyle'); $result = @{}; foreach ($cat in $categories) { $hbnPath = 'bgimg\'+$cat+'\hbn'; $ddPath = 'bgimg\'+$cat+'\ddcard'; $hbnFiles = @(); $ddFiles = @(); if (Test-Path $hbnPath) { $hbnFiles = Get-ChildItem -Path $hbnPath -File | Where-Object { $_.Extension -match '\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$' } | Select-Object -ExpandProperty Name | Sort-Object }; if (Test-Path $ddPath) { $ddFiles = Get-ChildItem -Path $ddPath -File | Where-Object { $_.Extension -match '\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$' } | Select-Object -ExpandProperty Name | Sort-Object }; $result[$cat] = @{ hbn = $hbnFiles; ddcard = $ddFiles }; Write-Host ('  '+$cat+': HBN '+$hbnFiles.Count+' / DDCard '+$ddFiles.Count) }; $result | ConvertTo-Json -Depth 4 | Out-File -FilePath 'bgimg\index.json' -Encoding UTF8; Write-Host ''; Write-Host 'DONE! index.json updated. Please press F5 in browser.' -ForegroundColor Green"

echo.
pause