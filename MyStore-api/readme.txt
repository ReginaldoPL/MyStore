#gerar a imagem
docker build -t mystoreapi .
#rodar a a imagem
docker run -d -p 7500:7500 mystoreapi
