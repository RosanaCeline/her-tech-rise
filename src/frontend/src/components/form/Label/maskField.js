import React from 'react'

export function maskField(type, value) {
    value = value.replace(/\D/g, ''); 
  switch (type) {
    case 'telefone':
        if (value.length <= 2) {
            return `(${value}`;
        }
        else if (value.length <= 6) {
            return `(${value.slice(0, 2)})${value.slice(2)}`;
        }
        else if (value.length <= 10) {
            return `(${value.slice(0, 2)})${value.slice(2, 6)}-${value.slice(6)}`;
        }
        return `(${value.slice(0, 2)})${value.slice(2, 7)}-${value.slice(7, 11)}`;
    case 'cpf':
        if (value.length <= 3) {
            return value;
        }
        else if (value.length <= 6) {
            return `${value.slice(0, 3)}.${value.slice(3)}`;
        }
        else if (value.length <= 9) {
            return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
        }
        return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`;
    case 'data':
        if (value.length <= 2) return value;
        else if(value.length <= 4) return `${value.slice(0,2)}/${value.slice(2)}`
        return `${value.slice(0,2)}/${value.slice(2,4)}/${value.slice(4)}`
    case 'cnpj':
        if (value.length <= 2) return value;
        else if(value.length <= 5) return `${value.slice(0,2)}.${value.slice(2)}`
        else if(value.length <= 8) return `${value.slice(0,2)}.${value.slice(2,5)}.${value.slice(5)}`
        else if(value.length <= 12) return `${value.slice(0,2)}.${value.slice(2,5)}.${value.slice(5,8)}/${value.slice(8)}`
        return `${value.slice(0,2)}.${value.slice(2,5)}.${value.slice(5,8)}/${value.slice(8,12)}-${value.slice(12)}`
    case 'cep':
        if (value.length <= 5) return value;
        return `${value.slice(0,5)}-${value.slice(5)}`
    case 'money': {
      if (!value) return 'R$ 0,00';

      const number = parseFloat(value) / 100
      return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      });
    }
    default:
      return value
  }
}
