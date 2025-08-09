# Her Tech Rise 

Repositório completo do sistema [**Her Tech Rise**](https://her-tech-rise.onrender.com), incluindo **frontend** em React e **backend** em Spring Boot.

## Sobre o projeto
O [Her Tech Rise](https://her-tech-rise.onrender.com) é uma plataforma desenvolvida como projeto acadêmico para a disciplina de Engenharia de Software, com o objetivo de fomentar a inclusão, o networking e o empoderamento de mulheres na área de tecnologia.

## Nosso foco
Criar um ambiente seguro e colaborativo onde:
- Empresas podem se cadastrar e divulgar vagas de emprego, ampliando o alcance das oportunidades para mulheres na tecnologia;
- Profissionais podem construir redes de apoio, trocar experiências, publicar conteúdos e fortalecer a comunidade tech feminina.

## Funcionalidades principais

- Cadastro e autenticação seguros com controle de acesso via JWT.
- Feed personalizado com publicações, compartilhamentos e comentários para promover interação.
- Sistema de comentários aninhados, possibilitando respostas diretas e discussão organizada.
- Curtições e interações sociais para engajamento dentro da comunidade.
- Configuração de pefil completo para poder compartilhar suas experiências e ideias.
- Design responsivo baseado em protótipos validados no Figma, garantindo boa experiência em dispositivos móveis e desktop.

## Objetivo final

Promover a representatividade feminina no setor de tecnologia, oferecendo uma rede de apoio que conecta talentos, facilita a divulgação de oportunidades e fortalece a comunidade tech de forma inclusiva e colaborativa.

## Tecnologias Utilizadas

### Frontend

* React (Componentes funcionais e arquitetura responsiva)
* React Router DOM
* Tailwind CSS

### Backend

* Spring Boot (Java)
* Segurança via JWT (JSON Web Token)
* Testes automatizados com alta cobertura de código
* Autenticação e autorização via JWT, garantindo sessões seguras e controle de acesso baseado em roles.

### Infraestrutura

* Deploy frontend com [Render](https://her-tech-rise.onrender.com)
* Banco de dados hospedado no Neon (PostgreSQL gerenciado)

## Design & Prototipagem

O frontend segue o protótipo definido no [Figma](https://www.figma.com/design/irB4b6jVhhuOIBOMXyxxrX/ES-HerTechRise-Prototipa%C3%A7%C3%A3o?node-id=1-11&t=RhR1GeOBXv4F9vxX-1) para garantir a melhor experiência do usuário.

## Estrutura do Projeto

```
/src
  /backend       # Código backend (Spring Boot)
  /frontend       # Código frontend (React + Tailwind)
```

## Metodologia Aplicada

Este projeto está sendo construído com base nas melhores práticas de Engenharia de Software:

* Levantamento de requisitos, histórias de usuário, critérios de aceite;
* Modelagem UML (casos de uso, diagramas de atividades, classes, sequência);
* Protótipo navegável (Figma);
* Planejamento incremental/em Sprints de 1 semana de ciclo;
* Desenvolvimento iterativo;
* Testes automatizados completos;

## Como rodar localmente (para acessar na nuvem basta clicar [aqui](https://her-tech-rise.onrender.com))

### Pré-requisitos

* Java 17+
* PostgreSQL 
* React
* Tailwind

### Passos

1. Clone o repositório:

```bash
git clone https://github.com/RosanaCeline/her-tech-rise.git
```

2. Backend:

```bash
cd her-tech-rise/src/backend
./mvnw spring-boot:run
```

3. Frontend:

```bash
cd her-tech-rise/src/frontend
npm install
npm run dev
```

## Testes Backend

O backend conta com testes automatizados com alta cobertura, garantindo qualidade e confiabilidade do sistema. Para rodar os testes:

```bash
cd src/backend
./mvnw test
```

## Contribuição

Contribuições são bem-vindas! Antes de enviar PRs, verifique se os testes estão passando no backend e que o frontend está responsivo e funcional.