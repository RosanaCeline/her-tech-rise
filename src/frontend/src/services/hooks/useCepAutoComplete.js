import { useEffect, useState } from "react";
import axios from "axios";

export function useCepAutoComplete({ cep, handleChange, setFormData, refs = {} }) {
    const [formHasChanged, setFormHasChanged] = useState(false);

    const estados = [
        'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
        'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
        'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
        'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
        'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
    ];

    const setFieldValue = (field, value) => {
        if (handleChange) {
            handleChange(field, value);
        } else if (setFormData) {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    useEffect(() => {
        async function fetchCEP() {
            if (cep.length === 9) {
                try {
                    const { data } = await axios.get(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`);
                    if (!data.erro) {
                        setFormHasChanged(true);
                        setFieldValue('rua', data.logradouro || '');
                        setFieldValue('cidade', data.localidade || '');
                        setFieldValue('bairro', data.bairro || '');
                        setFieldValue('estado', data.estado || '');

                        Object.values(refs).forEach(ref => ref?.current && (ref.current.disabled = true));
                    }
                } catch (error) {
                    console.error("Erro ao buscar CEP:", error);
                }
            } else if (formHasChanged) {
                setFormHasChanged(false);
                ['rua', 'cidade', 'bairro', 'estado'].forEach(campo => setFieldValue(campo, ''));
                Object.values(refs).forEach(ref => ref?.current && (ref.current.disabled = false));
            }
        }
        fetchCEP();
    }, [cep]);

    return { estados }
}
