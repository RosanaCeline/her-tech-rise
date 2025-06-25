# Her Tech Rise — Frontend

Este repositório contém o frontend do sistema **Her Tech Rise**, desenvolvido em **React**, utilizando arquitetura de componentes funcionais e foco em responsividade, seguindo os protótipos definidos no [Figma](https://www.figma.com/design/irB4b6jVhhuOIBOMXyxxrX/ES-HerTechRise-Prototipa%C3%A7%C3%A3o?node-id=0-1&t=VMC4tWx2S8mlTJhS-1).
O backend do sistema é desenvolvido separadamente em **Spring Boot**.

---

## 🛠️ Tecnologias Utilizadas

* [React](https://react.dev/)
* [React Router DOM](https://reactrouter.com/)
* [Tailwind CSS](https://tailwindcss.com/)

---

## ⚙️ Pré-requisitos

Antes de iniciar o projeto, certifique-se de ter instalado em sua máquina:

* **Node.js** (recomendado versão 18+)
* **npm** (gerenciado junto com o Node.js)

---

## 🚀 Como Rodar o Projeto Localmente

1️⃣ Clone o repositório:

```bash
git clone https://github.com/RosanaCeline/her-tech-rise.git
```

2️⃣ Acesse o diretório do projeto:

```bash
cd her-tech-rise/src/frontend
```

3️⃣ Instale as dependências necessárias:

```bash
npm install
```

Obs.: As principais dependências já estão definidas no `package.json`, incluindo:

* `react-router-dom`
* `tailwindcss`

4️⃣ Rode o projeto em ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em:
👉 [http://localhost:3000](http://localhost:3000)

---

## 📦 Build para Produção

Para gerar o build otimizado:

```bash
npm run build
```

Os arquivos serão gerados na pasta `/build`.

---

## 🧩 Estrutura do Projeto

* `src/components/` — Componentes reutilizáveis.
* `src/pages/` — Páginas da aplicação (ex.: Landing Page, Login, Cadastro, etc).
* `src/routes/` — Configuração de rotas com `react-router-dom`.
* `src/assets/` — Imagens, ícones e recursos estáticos.

---

## 📐 Design e Protótipo

O desenvolvimento do frontend segue rigorosamente o protótipo validado no Figma.
🔗 [Acessar protótipo no Figma](https://www.figma.com/design/irB4b6jVhhuOIBOMXyxxrX/ES-HerTechRise-Prototipa%C3%A7%C3%A3o?node-id=0-1&t=VMC4tWx2S8mlTJhS-1)

---

## 🧑‍💻 Observação

Este repositório contém **apenas o frontend** da aplicação.
O backend REST API desenvolvido em Spring Boot está disponível em repositório separado.