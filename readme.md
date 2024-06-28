# Benchmark: Processamento de imagens em pararelo com Node Worker Threads x Single-Thread

Este projeto demonstra o processamento de imagens utilizando o Node.js, comparando a performance entre processamento em single thread e com Worker Threads. As imagens de entrada são convertidas para escala de cinza e redimensionadas para uma largura de 800 pixels.

## Instalação

1. Instale as dependências:

```sh
npm install
```

2. Crie as pastas para as imagens:

```sh
mkdir images images_processed_single_thread images_processed_worker_threads logs
```

## Como Rodar

1. Adicione suas imagens na pasta `images`.

2. Execute o servidor principal:

```sh
npm start
```

3. Inicie os testes de processamento:

use `curl` para iniciar os testes. Exemplo, para processar 100 imagens, execute:

```sh
curl http://localhost:3000/test/100
```

## Features

1. Limpar pastas de imagens processadas:

```sh
npm run clean
```

## Logs

Os logs são gerados tanto no console quanto no arquivo `logs/app.log`. Eles incluem informações sobre o tempo de processamento e possíveis erros.

<hr />

<h3 align="center">Desenvolvido por <a href="https://github.com/kristyancarvalho/">Kristyan Carvalho</a>.</h3>
