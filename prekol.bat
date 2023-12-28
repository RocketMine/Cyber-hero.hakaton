@echo off

echo Содержимое текущей директории:
dir /b /a-d

echo.
echo Содержимое поддиректорий:
for /d %%D in (*) do (
    echo   %%D
    pushd "%%D"
    for /d %%S in (*) do (
        echo      %%S
    )
    popd
)

echo.
echo Нажмите любую клавишу для выхода...
pause >nul
