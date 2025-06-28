const mockUsers = [
  {
    email: "adalovelace@gmail.com",
    senha: "123456",
    perfil: "professional",
    dados: {
      id: 1,
      nome: "Ada Lovelace",
      tipo_usuario: "professional",
      cpf: "123.123.123-10",
      nameuser: "lovelace21311",
      telefone: "(88) 9 3297-0383",
      endereco: {
        rua: "rua",
        bairro: "bairro",
        cidade: "Fortaleza",
        estado: "Ceará",
      },
      photo: "https://blog.vinco.com.br/wp-content/uploads/2021/03/Copia-de-Copia-de-Copia-de-COmprovante-Legal-7-1200x675.png",
      link: "http://localhost:5175/meuperfil",
      tecnologias: "Ruby on Rails | Spring | React | Git | Engenharia de Software",
      biografia: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      experiencia: {
        titulo  : "Engenheira de Software",
        empresa : "Tech Innovations",
        modalidade: "Full-time",
        datainicial: "2022-01-01",
        datafinal: "2023-12-31",
        atualxp: false,
        descricao: "Desenvolvimento de soluções inovadoras em software, com foco em eficiência e escalabilidade.",
      }
    }
  },
  {
    email: "contato@techcompany.com.br",
    senha: "123456",
    perfil: "enterprise",
    dados: {
      id: 1000,
      nome: "Techc Company Ltda",
      tipo_usuario: "enterprise",
      cnpj: "12.345.678/0001-90",
      nameuser: "techcompany23424",
      telefone: "(88) 9 3325-5372",
      endereco: {
        rua: "rua",
        bairro: "bairro",
        cidade: "Sao Paulo",
        estado: "Sao Paulo",
      },
      link: "http://www.techcompany.com.br/",
      descricao: "A maior comunidade tech em aprendizado contínuo da América Latina para aprender, praticar e se conectar com o mundo",
      sobrenos: "A Tech Solutions é uma empresa comprometida com a inovação e a excelência em tecnologia, buscando sempre superar as expectativas dos nossos clientes.",
    }
  }
];

export default mockUsers;
