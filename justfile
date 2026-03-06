@_default:
    just --list

build:
    docker build -t gojuon-typing-practice .

run:
    -docker rm -f gojuon-typing-practice 2>/dev/null
    docker run --restart always -d -p 5173:80 --name gojuon-typing-practice gojuon-typing-practice
