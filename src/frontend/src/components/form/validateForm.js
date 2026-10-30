import { validateField } from './Label/validationField'

/**
 * Valida vários campos de uma vez.
 * rules: { campo: { type, label, required = true } }
 * Retorna { campo: mensagem } apenas com os campos que têm erro.
 */
export function validateForm(rules, values) {
  const errors = {}
  for (const [field, { type, required = true }] of Object.entries(rules)) {
    const error = validateField(type, values[field] ?? '', required)
    if (error) errors[field] = error
  }
  return errors
}

// leva o foco (e a rolagem) até o primeiro campo com erro, para a pessoa saber onde corrigir
export function focusFirstError(errors, order) {
  const first = (order ?? Object.keys(errors)).find((field) => errors[field])
  if (!first) return
  const element = document.getElementById(first)
  if (!element) return
  element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  element.focus({ preventScroll: true })
}

// texto curto para o resumo de erros: "Corrija 2 campos: Telefone, CEP."
export function errorSummary(errors, rules) {
  const labels = Object.keys(errors).map((field) => rules[field]?.label ?? field)
  if (labels.length === 0) return ''
  return labels.length === 1
    ? `Corrija o campo ${labels[0]}.`
    : `Corrija ${labels.length} campos: ${labels.join(', ')}.`
}
