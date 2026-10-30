import { useEffect, useRef, useState } from "react";
import axios from "axios";

const ufParaEstado = {
    AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal',
    ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
    MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí',
    RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia',
    RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins'
};

const estados = Object.values(ufParaEstado).sort((a, b) => a.localeCompare(b, 'pt-BR'));

export function useCepAutoComplete({ cep, handleChange, setFormData }) {
    const [status, setStatus] = useState('idle');
    const lastSearchedCep = useRef(cep?.length === 9 ? cep : null);

    const setFieldValue = (field, value) => {
        if (handleChange) {
            handleChange(field, value);
        } else if (setFormData) {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    useEffect(() => {
        if (cep?.length !== 9) {
            lastSearchedCep.current = null;
            setStatus('idle');
            return;
        }
        if (cep === lastSearchedCep.current) return;
        lastSearchedCep.current = cep;

        let ignore = false;
        async function fetchCEP() {
            setStatus('loading');
            try {
                const { data } = await axios.get(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`, { timeout: 8000 });
                if (ignore) return;
                if (data.erro) {
                    setStatus('notFound');
                    return;
                }
                const estado = data.estado || ufParaEstado[data.uf];
                if (data.logradouro) setFieldValue('rua', data.logradouro);
                if (data.bairro) setFieldValue('bairro', data.bairro);
                if (data.localidade) setFieldValue('cidade', data.localidade);
                if (estado) setFieldValue('estado', estado);
                setStatus('found');
            } catch (error) {
                if (ignore) return;
                console.error("Erro ao buscar CEP:", error);
                setStatus('error');
            }
        }
        fetchCEP();
        return () => {
            ignore = true;
            lastSearchedCep.current = null;
        };
    }, [cep]);

    return { estados, status }
}
