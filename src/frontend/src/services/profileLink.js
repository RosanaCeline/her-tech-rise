// Monta a rota de perfil a partir dos dados que a API já envia (id, handle e tipo),
// sem precisar buscar o perfil antes de navegar.
export const getProfilePath = (id, handle, type) => {
    if (!id) return null;
    const userType = String(type || '').toUpperCase() === 'COMPANY' ? 'company' : 'professional';
    return `/profile/${userType}/${id}-${handle ?? ''}`;
};
