# 🚀 GUIA RÁPIDO DE INSTALAÇÃO

## Passo 1: Instalar Dependências
```bash
npm install
```

## Passo 2: Configurar IP da API

Abra `src/services/api.js` e altere a linha 6:

```javascript
const API_URL = 'http://192.168.1.100:3000/api'; // Coloque SEU IP aqui
```

**Como descobrir seu IP:**
- Windows: Abra CMD e digite `ipconfig`, procure por "Endereço IPv4"
- Mac/Linux: Abra Terminal e digite `ifconfig`, procure por "inet"

## Passo 3: Iniciar o App
```bash
npm start
```

## Passo 4: Abrir no Celular

1. Instale o app **Expo Go** no seu smartphone (Google Play ou App Store)
2. Escaneie o QR Code que aparece no terminal
3. Aguarde o app carregar

**IMPORTANTE:** Seu celular e computador precisam estar conectados na MESMA rede WiFi!

---

## ✅ Verificar se a API está funcionando

Abra o navegador e acesse:
```
http://SEU_IP:3000/health
```

Deve retornar: `{"status":"ok"}`

---

## 🎯 Funcionalidades Principais

- ✅ Login e Cadastro
- ✅ Dashboard com saldo e resumo
- ✅ Adicionar transações manualmente (PIX, Crédito, Débito, Dinheiro)
- ✅ **Leitura automática de notificações bancárias**
- ✅ Criar e gerenciar metas financeiras
- ✅ Sistema de poupança (transferir/retirar)
- ✅ Filtros e busca de transações

---

## 📱 Como funciona a leitura de notificações?

1. Toque no ícone de **sino** no topo da tela inicial
2. Certifique-se de que está **VERDE** (ativado)
3. Quando você receber uma notificação bancária (PIX, débito, crédito), o app vai:
   - Ler o valor
   - Identificar o tipo (PIX/Crédito/Débito)
   - Detectar se é receita ou despesa
   - Registrar automaticamente na sua conta!

**Exemplos de notificações que funcionam:**
- "PIX recebido de João - R$ 150,00"
- "Compra no débito - R$ 45,50"
- "Pagamento aprovado - R$ 1.200,00"

---

## 🐛 Problemas Comuns

### "Não consegue conectar com a API"
- Verifique se a API está rodando (veja acima)
- Confirme que alterou o IP em `src/services/api.js`
- Celular e PC devem estar na mesma WiFi

### "Notificações não funcionam"
- Dê permissão de notificações ao Expo Go
- Ative o processamento automático (sino verde)
- Use um celular real (não funciona bem em emuladores)

---

## 📞 Precisa de Ajuda?

Leia o arquivo `README.md` completo para mais detalhes!

---

**Desenvolvido com ❤️ por Pedro Bonomo**
