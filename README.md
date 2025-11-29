# 📱 appFinance — Controle Financeiro Pessoal Automático

O **appFinance** é um aplicativo de controle financeiro pessoal que atualiza seu saldo automaticamente lendo notificações bancárias. Além disso, ele calcula horas trabalhadas, valor por hora, mostra extrato completo e permite planejar gastos mensais.

---

## 🚀 Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- NativeWind (Tailwind)
- Backend em TypeScript + Prisma + SQLite
- Integração com notificações no Android
- Armazenamento local

---

## 📦 Funcionalidades

### ✔️ Saldo e Transações
- Cadastro de saldo inicial (crédito, débito e dinheiro).
- Leitura automática de notificações bancárias.
- Atualização automática do saldo.
- Registro de entradas e saídas.

### ✔️ Horas e Trabalho
- Cálculo de horas trabalhadas.
- Cálculo automático do valor por hora.

### ✔️ Organização Financeira
- Extrato detalhado.
- Planejamento mensal.
- Painel geral com resumo financeiro.

---

## 📁 Estrutura do Projeto

```text
front-appFinance/
├── android/
├── assets/
├── plugins/
├── src/
│   ├── components/
│   ├── screens/
│   ├── hooks/
│   ├── services/
│   └── utils/
├── App.js
├── package.json
└── babel.config.js
```

---

## ▶️ Como Rodar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o projeto:**
   ```bash
   npx expo start
   ```

3. **Escaneie o QR Code** no seu celular (com o app Expo Go).

---

## 📡 Backend

O backend é feito em **TypeScript + Prisma + SQLite**, responsável por:

- Cálculo e atualização de saldos.
- Registro de transações.
- Processamento de dados financeiros.

---

## 🧪 Testes de Notificações

O projeto inclui um guia de testes para verificar se a leitura de notificações no Android está funcionando corretamente.

### 📖 Guias e Documentação

- **`INSTALACAO.md`** — Como instalar e rodar.
- **`GUIA_VISUAL.md`** — Demonstração visual do app.
- **`TESTE_NOTIFICACOES.md`** — Como testar as notificações.
- **`RESUMO.md`** — Resumo técnico geral.

---

## 🤝 Contribuição

Sinta-se livre para abrir issues, sugerir melhorias ou enviar PRs.

## 📄 Licença

Este projeto é de uso pessoal, mas você pode estudá-lo e adaptá-lo como quiser.
