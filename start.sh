echo hello
echo hello again

RAY_URL="https://github.com/XTLS/Xray-core/releases/download/${VER}/Xray-linux-64.zip"
echo ${RAY_URL}
wget -q --no-check-certificate ${RAY_URL} > /dev/null 2>&1
unzip Xray-linux-64.zip