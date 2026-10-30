// aceita link com ou sem http(s)://, desde que tenha um domínio (ex.: github.com/ana)
export function normalizeUrl(value) {
  const trimmed = value?.trim() ?? ''
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function isValidUrl(value) {
  if (/\s/.test(value)) return false
  try {
    const url = new URL(normalizeUrl(value))
    return /^https?:$/.test(url.protocol) && /\.[a-z]{2,}$/i.test(url.hostname)
  } catch {
    return false
  }
}

export function validateField(type, value, required) {
  const trimmed = value?.trim() ?? ''

  if (required && (!trimmed || trimmed === '')) {
    return 'Este campo é obrigatório.'
  }

  // campo opcional vazio não tem o que validar
  if (!required && !trimmed) return null

  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
        ? null
        : 'Email com formato inválido'
    case 'data':
      return /^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)
        ? null
        : 'Data inválida. Use DD/MM/AAAA.'
    case 'telefone': {
      // aceita fixo (10 dígitos) ou celular (11 dígitos); a máscara cuida da pontuação
      const digits = trimmed.replace(/\D/g, '')
      if (digits.length < 10)
        return 'Telefone incompleto. Informe DDD e número.'
      if (digits.length > 11)
        return 'Telefone com dígitos a mais.'
      if (/^(0|\d0)/.test(digits))
        return 'DDD inválido.'
      return null
    }
    case 'url':
      return isValidUrl(trimmed)
        ? null
        : 'Link inválido.'
    case 'cpf': {
      const cleanCPF = trimmed.replace(/[^\d]/g, '');

      if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
        return cleanCPF.length !== 11 ? 'CPF incompleto.' : 'CPF inválido.';
      }

      // 1º dígito verificador
      let soma1 = 0;
      for (let i = 0; i < 9; i++) {
        soma1 += parseInt(cleanCPF[i]) * (10 - i);
      }
      const resto1 = soma1 % 11;
      const digito1 = resto1 < 2 ? 0 : 11 - resto1;

      // 2º dígito verificador
      let soma2 = 0;
      for (let i = 0; i < 10; i++) {
        soma2 += parseInt(cleanCPF[i]) * (11 - i);
      }
      const resto2 = soma2 % 11;
      const digito2 = resto2 < 2 ? 0 : 11 - resto2;

      const digitoValido = cleanCPF[9] == digito1 && cleanCPF[10] == digito2;
      return digitoValido ? null : 'CPF inválido. Verifique os dígitos.';
      }
    case 'cnpj':{
      const cleanCNPJ = trimmed.replace(/[^\d]/g, '');

      if (cleanCNPJ.length !== 14 || /^(\d)\1{13}$/.test(cleanCNPJ)) {
        return cleanCNPJ.length !== 14 ? 'CNPJ incompleto.' : 'CNPJ inválido.';
      }

      const calcularDV = (base, pesos) => {
        const soma = base.split('').reduce((acc, num, i) => {
          return acc + parseInt(num) * pesos[i];
        }, 0);
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
      };

      const baseCNPJ = cleanCNPJ.slice(0, 12);
      const digitosInformados = cleanCNPJ.slice(12);

      const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const primeiroDV = calcularDV(baseCNPJ, pesos1);

      const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const segundoDV = calcularDV(baseCNPJ + primeiroDV, pesos2);

      const digitosCalculados = `${primeiroDV}${segundoDV}`;

      return digitosInformados === digitosCalculados
    ? null
    : 'CNPJ inválido. Verifique os dígitos.';
    }
    case 'cep':
      return /^\d{5}-\d{3}$/.test(trimmed)
        ? null
        : 'CEP inválido.'
    case 'numero':
      return /^\d+$/.test(trimmed)
        ? null
        : 'Apenas números são permitidos'
    case 'select':
      return trimmed ? null : 'Selecione uma opção'
    case 'mensagem':
    case 'endereco':
    case 'texto':
      return trimmed.length < 3 ? 'Mínimo de 3 caracteres' : null
    case 'senha':
      return trimmed.length < 6 ? 'A senha deve ter no mínimo 6 caracteres' : null
    default:
      return null
  }
}
