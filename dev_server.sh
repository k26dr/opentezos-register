sigint() {
    ps aux | grep SimpleHTTPServer | awk '{print $2}' | xargs kill
}
trap "sigint" INT

python -m SimpleHTTPServer &
node balance_server.js
