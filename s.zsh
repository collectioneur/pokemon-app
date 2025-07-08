cd ~/Desktop/pokemon-app/android
# проверьте, что путь существует:
ls -d ~/Library/Android/sdk/platform-tools >/dev/null || {
  echo "SDK не там ― уточните путь!" ; exit 1 ; }
echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties