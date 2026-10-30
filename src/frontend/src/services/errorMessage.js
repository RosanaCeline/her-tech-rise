const GENERIC_MESSAGES = ['Erro desconhecido', 'Failed to fetch', 'Load failed', 'NetworkError when attempting to fetch resource.'];

// o que a pessoa pode fazer para resolver, de acordo com o tipo de falha
function howToFix(err) {
  const status = err?.status ?? err?.response?.status;
  const backendMessage = err?.response?.data?.message ?? err?.backendMessage ?? err?.message;

  if (!status) {
    if (err instanceof TypeError || err?.isAxiosError || !backendMessage || GENERIC_MESSAGES.includes(backendMessage)) {
      return 'Verifique sua conexão com a internet e tente de novo.';
    }
    return backendMessage;
  }
  if (status === 403) return 'Você não tem permissão para fazer isso com esta conta.';
  if (status === 404) return 'O conteúdo não existe mais. Atualize a página.';
  if (status === 413) return 'O arquivo é grande demais. Envie um arquivo de até 10MB.';
  if (status === 429) return 'Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.';
  if (status >= 500) return 'O servidor está com instabilidade. Tente de novo em alguns minutos.';
  // 400/409/422: o back-end diz o que está errado no que foi enviado
  if (backendMessage && !GENERIC_MESSAGES.includes(backendMessage)) return backendMessage;
  return 'Confira os dados e tente de novo.';
}

/**
 * Junta o que falhou com o que fazer para resolver.
 * ex.: getErrorMessage(err, 'Não foi possível enviar seu comentário.')
 *   -> "Não foi possível enviar seu comentário. Verifique sua conexão com a internet e tente de novo."
 */
export function getErrorMessage(err, whatFailed) {
  const fix = howToFix(err);
  return whatFailed ? `${whatFailed} ${fix}` : fix;
}
