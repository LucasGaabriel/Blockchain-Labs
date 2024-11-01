# Hash Miner

Este script é uma implementação em Python de um minerador de hashes SHA-256. Ele busca encontrar um hash que comece com um número específico de zeros, usando uma abordagem de tentativa e erro (força bruta).

## Funcionalidades
- **Prefixo opcional**: Possibilidade de definir um prefixo para a entrada do hash, permitindo ajustes adicionais na busca.
- **Configuração de dificuldade**: Permite especificar o número de zeros iniciais que o hash deve ter, ajustando o nível de dificuldade.
- **Animação de carregamento**: Um indicador visual mostra o progresso da mineração.

## Como Funciona
O programa utiliza o algoritmo SHA-256 para gerar um hash a partir de uma entrada composta por um prefixo e um número (nonce). A mineração continua até que o hash gerado tenha o número desejado de zeros iniciais.

## Requisitos
- Python 3.x

## Execução
Para executar o código, utilize o seguinte comando:
```bash
python main.py
```

Edite as variáveis `prefix` e `num_zeros` para ajustar o prefixo e a dificuldade conforme necessário. Ao encontrar o hash com os zeros especificados, o programa exibirá a entrada e o hash.