@_default:
    just --list

build:
    docker build -t gojuon-typing-practice .

run:
    -docker stop gojuon-typing-practice 2>/dev/null
    docker run --rm -d -p 5173:80 --name gojuon-typing-practice gojuon-typing-practice
