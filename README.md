# Exemplo de desenvolvimento utilizando Clean Architecture+DDD com TypeScript

Este repositório contém o exemplo de integração da `Clean Architecture` em um projeto originalmente desenvolvido utilizando somente o `Domain-Driven Design (DDD)` com `TypeScript`.

 - link para repositório utilizando o [Domain-Driven Design - DDD](https://github.com/Lucassamuel97/ddd-patterns)

## Entendendo a arquitetura

<img alt="Onion Architecture" heigth="200"  src="https://bazaglia.com/img/onion-architecture.png">

### 1 Domínio (Domain Layer, Entities)
Pasta: domain/
Responsabilidade: Contém as entidades, objetos de valor, interfaces de repositórios, serviços de domínio e eventos. Está camada representa o núcleo do sistema, com a lógica de negócio pura.

### 2 Casos de Uso (Application Layer, Use Cases)
Pasta: usecase/
Responsabilidade: Contém os casos de uso ou serviços de aplicação, que coordenam a execução de operações de acordo com as regras de negócio. Está camada orquestra a interação entre o domínio e a infraestrutura.

### 3 Infraestrutura (Infrastructure Layer)
Pasta: infrastructure/
Responsabilidade: Contém as implementações concretas das interfaces de repositórios, serviços de infraestrutura, adaptadores para frameworks externos, e detalhes de implementação específicos. Está camada lida com a comunicação com o mundo externo, como bancos de dados, APIs, etc.

### 4 Interface de Adapters (Interface Adapters Layer, Presenters, Controllers, Gateways)
Pasta: infrastructure/api/
Responsabilidade: Contém os adaptadores para interfaces externas, como APIs REST, XML, etc. Está camada lida com a conversão de dados entre o formato interno do sistema e o formato esperado pelas interfaces externas.
framework utilizado: express.js


## Referencial teórico
- [domain-driven-design](https://fullcycle.com.br/domain-driven-design/)
- [Clean Architecture vs DDD](https://fullcycle.com.br/clean-architecture-vs-ddd-e-outras-perguntas-2/)
- [Clean architecture with TypeScript: DDD, Onion](https://bazaglia.com/clean-architecture-with-typescript-ddd-onion/)

## Requisitos

Antes de começar, certifique-se de que você tem o seguinte instalado:

- [Node.js](https://nodejs.org) (versão 16.x ou superior)
- [Sqlite3](https://www.sqlite.org/docs.html)

ou docker + docker-compose...

## Configuração do Ambiente

### 1. Clonando o Repositório

Clone este repositório para a sua máquina local:

```bash
git clone https://github.com/Lucassamuel97/clean-architecture
cd clean-architecture
```

### 2. Instalando Dependências e executando a aplicação
```bash
npm install
npm run dev
```

### 3. Executando aplicação com docker-compose
```bash
    docker-compose up --build
```