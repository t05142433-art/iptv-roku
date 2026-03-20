#!/bin/bash

# Configurações da sua Roku TV
# Mude o IP para o IP que aparece na sua TV
ROKU_IP="192.168.1.4" 
USER="rokudev"
PASS="thayson" # Senha que você definiu no modo desenvolvedor

echo "🚀 Compilando Thayson & Thayla IPTV para Roku..."

# Criar pasta temporária para o build
mkdir -p build_roku
cp -r roku-app/* build_roku/

# Criar o arquivo ZIP (Formato nativo Roku)
cd build_roku
zip -r ../app.zip .
cd ..

echo "📦 Pacote app.zip criado com sucesso!"
echo "📡 Enviando para a TV Roku em $ROKU_IP..."

# Comando para fazer o upload via cURL (Nativo do Termux)
curl --user "$USER:$PASS" --digest -s -S -F "archive=@app.zip" -F "mysubmit=Install" http://$ROKU_IP/plugin_install | grep -i "Install Success"

if [ $? -eq 0 ]; then
    echo "✅ INSTALADO COM SUCESSO NA ROKU TV!"
else
    echo "❌ Erro na instalação. Verifique se o Modo Desenvolvedor está ativo na TV."
fi

# Limpeza
rm -rf build_roku
rm app.zip
