# 🧪 TESTANDO O PROCESSAMENTO DE NOTIFICAÇÕES

Este guia mostra como testar a funcionalidade de leitura automática de notificações bancárias.

## 📋 Pré-requisitos

1. App instalado e rodando no celular
2. Processamento automático **ATIVADO** (sino verde na tela inicial)
3. Permissões de notificação concedidas

---

## 🎯 Método 1: Usando App de Teste (RECOMENDADO)

### Android

1. Instale o app **"Notification Maker"** ou **"Fake Notifications"** da Play Store
2. Configure uma notificação com os seguintes dados:

**Exemplo 1 - PIX Recebido:**
- Título: `PIX recebido`
- Mensagem: `Você recebeu R$ 150,00 de João Silva`

**Exemplo 2 - Compra no Débito:**
- Título: `Nubank`
- Mensagem: `Compra no débito aprovada - R$ 45,50 em Supermercado Extra`

**Exemplo 3 - Compra no Crédito:**
- Título: `Cartão de Crédito`
- Mensagem: `Pagamento no crédito de R$ 1.200,00 aprovado`

3. Envie a notificação
4. O app deve detectar e registrar automaticamente!

### iOS

No iOS, o teste é mais limitado. Use o Método 2 (código) ou aguarde notificações reais do banco.

---

## 🎯 Método 2: Código de Teste (Avançado)

Adicione este código temporário em `src/screens/Home/HomeScreen.js` para testar:

```javascript
// Adicione no useEffect
useEffect(() => {
  // Código existente...
  
  // TESTE: Simular notificação após 5 segundos
  setTimeout(() => {
    const testNotification = {
      request: {
        content: {
          title: 'PIX recebido',
          body: 'Você recebeu R$ 250,00 de Maria Santos',
        },
      },
    };
    
    notificationService.processNotificationTransaction(testNotification);
  }, 5000);
}, []);
```

---

## 📝 Padrões de Notificação Suportados

### ✅ Receitas (Entradas)

```
- "PIX recebido de [Nome] - R$ XX,XX"
- "Você recebeu R$ XX,XX"
- "Transferência recebida - R$ XX,XX"
- "Depósito de R$ XX,XX"
- "Crédito em conta - R$ XX,XX"
```

### ✅ Despesas (Saídas)

```
- "Compra no débito - R$ XX,XX"
- "Compra no crédito aprovada - R$ XX,XX"
- "Pagamento de R$ XX,XX aprovado"
- "Débito de R$ XX,XX em [Local]"
```

---

## 🔍 Como Verificar se Funcionou

1. Após enviar a notificação, abra o app
2. Você verá um **Alert** confirmando a transação automática
3. A transação aparecerá na lista da tela **Transações**
4. O saldo será atualizado automaticamente

---

## ⚙️ Como o Sistema Funciona

### 1. Detecção de Tipo
O sistema procura por palavras-chave:
- **PIX**: "pix", "transferência"
- **Débito**: "débito", "compra no débito"
- **Crédito**: "crédito", "cartão", "fatura"

### 2. Extração de Valor
Procura padrões como:
- `R$ 100,00`
- `R$ 1.000,00`
- `100,00`
- `1000.00`

### 3. Categoria (Receita/Despesa)
Identifica por palavras:
- **Receita**: "recebido", "recebeu", "depósito", "crédito em conta"
- **Despesa**: "compra", "pagamento", "débito", "aprovado"

### 4. Descrição
Extrai informações após "de", "em", "para":
- "PIX recebido **de João Silva**"
- "Compra **em Supermercado**"

---

## 🧪 Exemplos de Teste Completos

### Teste 1: PIX Recebido
```
Título: Banco Original
Mensagem: PIX recebido de João Silva no valor de R$ 150,00
```
**Resultado Esperado:**
- Tipo: PIX
- Categoria: Receita
- Valor: R$ 150,00
- Descrição: "João Silva"

---

### Teste 2: Compra no Débito
```
Título: Nubank
Mensagem: Compra no débito aprovada - R$ 45,50 em Supermercado Extra
```
**Resultado Esperado:**
- Tipo: Débito
- Categoria: Despesa
- Valor: R$ 45,50
- Descrição: "Supermercado Extra"

---

### Teste 3: Compra no Crédito
```
Título: Banco do Brasil
Mensagem: Pagamento no crédito de R$ 1.200,00 foi aprovado
```
**Resultado Esperado:**
- Tipo: Crédito
- Categoria: Despesa
- Valor: R$ 1.200,00
- Descrição: "Transação automática via notificação"

---

## 🐛 Troubleshooting

### Notificação não foi processada

**Verifique:**
1. ✅ Processamento automático está ATIVADO (sino verde)
2. ✅ Notificação contém um valor em formato R$ XX,XX
3. ✅ Notificação tem palavras-chave (PIX, débito, crédito)
4. ✅ App tem permissão de notificações

### Valor extraído errado

O sistema procura o primeiro valor no formato:
- `R$ 100,00`
- `100,00`
- `100.00`

Certifique-se de que o valor está neste formato!

### Tipo detectado errado

O sistema prioriza:
1. PIX (se encontrar "pix" ou "transferência")
2. Débito (se encontrar "débito")
3. Crédito (se encontrar "crédito" ou "cartão")

Use as palavras-chave corretas!

---

## 📱 Testando com Notificações Reais

Para testar com notificações reais do banco:

1. Ative o processamento automático
2. Faça uma transação real (PIX, compra, etc.)
3. Aguarde a notificação do banco
4. O app processará automaticamente!

**Bancos testados:**
- ✅ Nubank
- ✅ Inter
- ✅ C6 Bank
- ✅ PicPay
- ⚠️ Outros bancos podem ter formatos diferentes

---

## 💡 Dicas

- Mantenha o app em foreground para melhor detecção
- Dê todas as permissões de notificação
- Se não funcionar, desative e ative novamente o processamento
- Verifique o console do Expo para logs de erro

---

**Pronto para testar? Boa sorte! 🚀**
