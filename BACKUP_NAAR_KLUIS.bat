@echo off
setlocal EnableDelayedExpansion

:: 1. Setup Variables
set "VAULT_DIR=%USERPROFILE%\Desktop\De Kluis\Godbrain_Backups"
set "TIMESTAMP=%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"
set "BACKUP_NAME=Godbrain_Core_%TIMESTAMP%.zip"

:: 2. Create Vault Directory if it doesn't exist
if not exist "%VAULT_DIR%" (
    echo [GODBRAIN] Kluis map niet gevonden. Maak nieuwe kluis aan op %VAULT_DIR%...
    mkdir "%VAULT_DIR%"
)

echo [GODBRAIN] Start Nood-Backup Protocol...
echo [GODBRAIN] Doelbestand: %VAULT_DIR%\%BACKUP_NAME%
echo.

:: 3. Create a temporary staging area
set "TEMP_DIR=%TEMP%\godbrain_backup_staging"
if exist "%TEMP_DIR%" rmdir /s /q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"

:: 4. Copy essential files (excluding node_modules, .next, etc.)
echo [GODBRAIN] Kopiëren van de code architectuur...
xcopy "apps" "%TEMP_DIR%\apps\" /E /H /C /I /Q /Y /EXCLUDE:exclude_backup.txt >nul
xcopy "packages" "%TEMP_DIR%\packages\" /E /H /C /I /Q /Y /EXCLUDE:exclude_backup.txt >nul
copy "package.json" "%TEMP_DIR%\" >nul
copy "turbo.json" "%TEMP_DIR%\" >nul
copy ".env" "%TEMP_DIR%\" >nul 2>nul
echo [GODBRAIN] Code architectuur gekopieerd.

:: 5. Zip the staging directory using PowerShell
echo [GODBRAIN] Comprimeren naar kogelvrije zip in de Kluis...
powershell.exe -nologo -noprofile -command "Compress-Archive -Path '%TEMP_DIR%\*' -DestinationPath '%VAULT_DIR%\%BACKUP_NAME%' -Force"

:: 6. Cleanup
rmdir /s /q "%TEMP_DIR%"

echo.
echo ====================================================================
echo [SUCCESS] BACKUP SUCCESVOL VOLTOOID!
echo [LOCATIE] %VAULT_DIR%\%BACKUP_NAME%
echo ====================================================================
echo Druk op een toets om dit venster te sluiten...
pause >nul
