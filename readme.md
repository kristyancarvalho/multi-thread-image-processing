# Processamento de Imagens com Node.js

Este projeto demonstra o processamento de imagens utilizando o Node.js, comparando a performance entre processamento em single thread e com Worker Threads. As imagens de entrada são convertidas para escala de cinza e redimensionadas para uma largura de 800 pixels.

## Instalação

1. Instale as dependências:

```sh
npm install
```

2. Crie as pastas para as imagens processadas:

```sh
mkdir images_processed images_processed_worker_threads
```

## Como Rodar

1. Adicione suas imagens na pasta `images`.

2. Execute o script principal:

```sh
node src/main.js
```

## Logs

Os logs são gerados tanto no console quanto no arquivo `logs/app.log`. Eles incluem informações sobre o tempo de processamento e possíveis erros.

<hr />

<h3 align="center">Desenvolvido por <a href="https://github.com/kristyancarvalho/">Kristyan Carvalho</a>.</h3>
