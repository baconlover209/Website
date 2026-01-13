@echo off
echo Building Project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b %ERRORLEVEL%
)

echo Deploying to Cloudflare Pages...
call npx wrangler pages deploy dist --project-name hungrydart
if %ERRORLEVEL% NEQ 0 (
    echo Deployment failed!
    pause
    exit /b %ERRORLEVEL%
)

echo Done!
pause
