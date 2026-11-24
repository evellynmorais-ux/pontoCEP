# pontoCEP — Consulta de CEP

Consulta de CEP brasileira com endereço completo em campos separados: **logradouro**, **bairro**, **cidade** e **estado**.

Digite um CEP, consulte e copie o endereço formatado. As consultas não são armazenadas.

## Funcionalidades

- Busca por CEP com máscara automática (`00000-000`)
- Quatro campos separados: logradouro, bairro, cidade e estado
- Botão para copiar o endereço completo
- Mensagens de erro em português para CEP inválido, inexistente ou indisponível
- Layout responsivo, do celular ao desktop

## Stack

- [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) para testes
- [ViaCEP](https://viacep.com.br/) como fonte de dados

## Como rodar localmente

Você precisa do Node.js e do npm — [instale com nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <url-deste-repositorio>
cd <nome-do-repositorio>
npm i
npm run dev
```

Abra o endereço indicado no terminal (por padrão `http://localhost:8080`).

## Scripts

```sh
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção
npm run preview  # pré-visualizar o build
npm test         # executar os testes
```

## API

Os endereços vêm da API pública [ViaCEP](https://viacep.com.br/):

```
GET https://viacep.com.br/ws/{cep}/json/
```

A chamada é feita direto do navegador. Nenhuma consulta é salva, e nenhuma chave privada é necessária.

## Estrutura

```
src/
├── lib/cep.ts            # formatação, validação e consulta do CEP
├── routes/
│   ├── __root.tsx        # layout raiz, metadados e tratamento de erros
│   └── index.tsx         # página de consulta
├── styles.css            # tema e estilos globais
└── test/
    ├── cep.test.ts       # regras de CEP e parsing do ViaCEP
    └── app-routing.test.tsx
```

## Testes

As regras de CEP (máscara, validação de 8 dígitos e leitura da resposta do ViaCEP) ficam em `src/lib/cep.ts` e são cobertas por testes em `src/test/cep.test.ts`.

```sh
npm test
```

## Licença

Uso livre. Os dados de endereço pertencem às fontes públicas do ViaCEP.
