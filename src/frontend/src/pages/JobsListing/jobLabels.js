import { maskField } from '../../components/form/Label/maskField';

export const CONTRACT_TYPES = {
    CLT: 'CLT', PJ: 'PJ',
    APRENDIZ: 'Aprendiz', ESTAGIO: 'Estágio',
    TRAINEE: 'Trainee', TEMPORARIO: 'Temporário',
    FREELANCER: 'Freelancer', VOLUNTARIO: 'Voluntário'
};

export const JOB_MODELS = {
    REMOTO: 'Remoto', HIBRIDO: 'Híbrido', PRESENCIAL: 'Presencial'
};

export const JOB_LEVELS = {
    JUNIOR: 'Júnior', PLENO: 'Pleno', SENIOR: 'Sênior'
};

export const toOptions = (labels) => Object.entries(labels).map(([value, label]) => ({ value, label }));

// a data vem como "2026-11-05", sem fuso: new Date() leria em UTC e mostraria um dia a menos no Brasil
export function formatDeadline(date) {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

// hoje no fuso local, no formato do <input type="date">
export function todayISO() {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// salário é opcional: sem valores, a vaga mostra "A combinar"
export function formatSalaryRange(min, max) {
    if (min && max) return Number(min) === Number(max) ? BRL.format(min) : `${BRL.format(min)} a ${BRL.format(max)}`;
    if (min) return `A partir de ${BRL.format(min)}`;
    if (max) return `Até ${BRL.format(max)}`;
    return 'A combinar';
}

// valor do back-end (ex.: 2500.5) no formato do campo com máscara; sem salário, o campo fica vazio
export const moneyToField = (value) => (value ? maskField('money', Number(value).toFixed(2)) : '');
