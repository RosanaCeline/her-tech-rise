export const fileName = (url) => {
  const raw = (url ?? '').split('?')[0].split('/').pop() || 'Documento';
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

const CLOUDINARY_IMAGE = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/i;

// o Cloudinary guarda PDF como "image": dá para pedir cada página como JPG
export const isPreviewablePdf = (url) => CLOUDINARY_IMAGE.test(url ?? '') && /\.pdf$/i.test((url ?? '').split('?')[0]);

export function pdfPageUrl(url, page, width = 900) {
  const [, base, rest] = url.match(CLOUDINARY_IMAGE);
  return `${base}pg_${page},w_${width},c_limit,q_auto/${rest.split('?')[0].replace(/\.pdf$/i, '.jpg')}`;
}

// força o download do arquivo original (o Cloudinary manda Content-Disposition: attachment)
export function downloadUrl(url) {
  const match = (url ?? '').match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|raw)\/upload\/)(.+)$/i);
  return match ? `${match[1]}fl_attachment/${match[2]}` : url;
}
