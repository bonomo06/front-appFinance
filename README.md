# 💰 App Finanças - Mobile

Aplicativo mobile para controle financeiro pessoal com processamento automático de transações via notificações bancárias.

## 🚀 Funcionalidades

### ✅ Implementadas

- **Autenticação**
  - Login e cadastro de usuários
  - Gerenciamento de sessão com AsyncStorage

- **Dashboard (Home)**
  - Visualização de saldo total (conta principal + poupança)
  - Resumo mensal de receitas e despesas
  - Transações recentes
  - Indicador de processamento automático

- **Transações**
  - Adicionar transações manualmente (PIX, Crédito, Débito, Dinheiro)
  - Listagem com filtros (todas, receitas, despesas)
  - Busca por descrição
  - Exclusão de transações (pressione e segure)
  - **Processamento automático via notificações bancárias**

- **Metas**
  - Criar metas financeiras
  - Acompanhar progresso
  - Adicionar valores às metas
  - Definir prazos opcionais
  - Visualização de metas concluídas

- **Poupança**
  - Transferir dinheiro para poupança
  - Retirar dinheiro da poupança
  - Visualização de saldos separados

- **Perfil**
  - Configurações de notificações
  - Toggle para processamento automático
  - Logout

## 📱 Processamento Automático de Notificações

O app monitora notificações bancárias e extrai automaticamente:
- **Valor** da transação
- **Tipo** (PIX, Crédito, Débito)
- **Categoria** (Receita ou Despesa)
- **Descrição**

### Exemplos de notificações suportadas:
- "PIX recebido de João Silva - R$ 150,00"
- "Compra no débito aprovada - R$ 45,50"
- "Pagamento no crédito - R$ 1.200,00"

## 🛠️ Tecnologias

- **React Native** (Expo)
- **React Navigation** (navegação)
- **React Native Paper** (UI components)
- **Expo Notifications** (notificações)
- **Axios** (requisições HTTP)
- **AsyncStorage** (armazenamento local)
- **date-fns** (manipulação de datas)

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- Smartphone Android ou iOS (ou emulador)
- **API Backend rodando** (configure o IP em `src/services/api.js`)

## 🔧 Instalação

### 1. Clone o repositório (se aplicável)
```bash
cd front
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure a URL da API

Abra o arquivo `src/services/api.js` e altere a URL da API:

```javascript
// Descubra seu IP local:
// Windows: cmd -> ipconfig -> Endereço IPv4
// Mac/Linux: terminal -> ifconfig -> inet

const API_URL = 'http://SEU_IP_LOCAL:3000/api';
// Exemplo: 'http://192.168.1.100:3000/api'
```

### 4. Inicie o projeto
```bash
npm start
```

### 5. Abra no seu smartphone

1. Instale o app **Expo Go** na Google Play ou App Store
2. Escaneie o QR Code que aparece no terminal
3. Aguarde o app carregar

**Importante:** Seu smartphone e computador devem estar na mesma rede WiFi!

## 📱 Testando Notificações Automáticas

### No Android (Recomendado)

1. Ative o processamento automático no app (ícone de sino no topo da Home)
2. Envie uma notificação de teste simulando seu banco:

```bash
# Usando ADB (Android Debug Bridge)
adb shell am broadcast -a android.intent.action.NOTIFICATION_TEST --es title "PIX recebido" --es message "Você recebeu R$ 100,00 de João Silva"
```

### Simulação Manual

Você pode testar criando notificações locais no próprio app (requer código adicional) ou usar apps de terceiros como "Notification Maker" para simular notificações bancárias.

## 📂 Estrutura do Projeto

```
front/
├── src/
│   ├── contexts/          # Context API (Auth, Notifications)
│   ├── navigation/        # Navegação (Auth, Main)
│   ├── screens/          # Telas do app
│   │   ├── Auth/         # Login, Register
│   │   ├── Home/         # Dashboard
│   │   ├── Transactions/ # Transações
│   │   ├── Goals/        # Metas
│   │   ├── Savings/      # Poupança
│   │   └── Profile/      # Perfil
│   ├── services/         # API e serviços
│   └── styles/           # Tema e cores
├── App.js               # Componente raiz
├── app.json            # Configuração Expo
└── package.json        # Dependências
```

## 🎨 Temas e Cores

O app usa um tema personalizado com as seguintes cores principais:
- **Primary:** #6200ee (roxo)
- **Secondary:** #03dac6 (ciano)
- **Income:** #4CAF50 (verde)
- **Expense:** #F44336 (vermelho)
- **PIX:** #32BCAD
- **Credit:** #FF6B6B
- **Debit:** #4ECDC4
- **Cash:** #95E1D3

## 🔑 Fluxo de Uso

1. **Registro/Login** - Crie uma conta ou faça login
2. **Dashboard** - Visualize seu saldo e resumo
3. **Adicionar Transação** - Use o botão + na aba Transações
4. **Criar Meta** - Use o botão + na aba Metas
5. **Gerenciar Poupança** - Transfira valores na aba Poupança
6. **Ativar Notificações** - Toque no sino na Home para ativar processamento automático

## 🐛 Troubleshooting

### App não conecta com a API
- Verifique se a API está rodando: `http://SEU_IP:3000/health`
- Confirme que alterou o IP em `src/services/api.js`
- Verifique se smartphone e PC estão na mesma rede

### Notificações não funcionam
- Verifique permissões de notificação nas configurações do smartphone
- No Android, ative "Exibir sobre outros apps" para o Expo Go
- Certifique-se de que o processamento automático está ativado

### Erro ao instalar dependências
```bash
# Limpe o cache e reinstale
rm -rf node_modules
npm cache clean --force
npm install
```

## 📝 Notas

- Para produção, compile o app: `expo build:android` ou `expo build:ios`
- Configure um certificado SSL para a API em produção
- As notificações push reais requerem configuração adicional (Firebase, APNs)
- Este app foi desenvolvido para fins educacionais

## 🔐 Segurança

- Nunca commite tokens ou credenciais
- Use variáveis de ambiente para informações sensíveis
- Em produção, use HTTPS para todas as requisições

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

## 👨‍💻 Autor

Desenvolvido para controle financeiro pessoal.

---

**Dúvidas?** Entre em contato ou abra uma issue!
