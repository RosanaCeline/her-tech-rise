import React from 'react'

export function validateField(type, value, required) {
  const trimmed = value?.trim() ?? ''

  if (required && (!trimmed || trimmed === '')) {
    return 'Este campo é obrigatório.'
  }

  switch (type) {
    case 'cpf':
      return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(trimmed)
        ? null
        : 'CPF inválido. Formato esperado: 000.000.000-00'
    case 'cnpj':
      return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(trimmed)
        ? null
        : 'CNPJ inválido. Formato esperado: 00.000.000/0000-00'
    case 'cep':
      return /^\d{5}-\d{3}$/.test(trimmed)
        ? null
        : 'CEP inválido. Exemplo: 00000-000'
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
        ? null
        : 'E-mail inválido'
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
