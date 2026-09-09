# Ambição em Negócios - Edição Sorocaba 🚀

Landing page de alta conversão para o evento presencial executivo **Ambição em Negócios** em Sorocaba/SP.

## 📋 Sobre o Projeto

Uma página moderna, responsiva e otimizada com foco em geração e qualificação de leads para empresários e tomadores de decisão.

### Principais Recursos
- **Design Executivo & Responsivo:** Identidade visual premium, tipografia com Geist/Cinzel e paleta escura sofisticada.
- **Formulário de Qualificação:** Coleta de dados com faturamento, número de colaboradores e validação em tempo real.
- **Integração com UNNICA CRM:** Envio direto via Webhook com suporte a fallback e contingência local (`localStorage`).
- **Configuração Centralizada:** Todas as variáveis de texto, datas, mídias e chaves de integração podem ser alteradas em `js/config.js`.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** semântico
- **Tailwind CSS** (via CDN) + Estilizações personalizadas em `css/style.css`
- **JavaScript Moderno (ES6+)**
- **Integração Webhook REST** (UNNICA CRM)

---

## 📁 Estrutura de Arquivos

```text
├── assets/         # Ícones, favicon e recursos visuais
├── css/
│   └── style.css   # Estilos complementares e animações
├── id/
│   └── Logo.png    # Identidade visual oficial
├── js/
│   ├── config.js   # Central de configurações e credenciais
│   └── main.js     # Lógica do formulário, modal e integração
├── index.html      # Página principal
└── README.md       # Documentação do projeto
```

---

## ⚙️ Configuração do CRM

Para atualizar a URL de recebimento de leads do CRM, altere o campo `webhookUrl` dentro de `js/config.js`:

```javascript
crm: {
  webhookUrl: "https://webhook.unnica.com.br/functions/v1/flow-webhook-receive?token=SEU_TOKEN_AQUI",
  whatsappNumero: "5515999999999",
  whatsappMensagem: "Olá! Acabei de aplicar na landing page..."
}
```
