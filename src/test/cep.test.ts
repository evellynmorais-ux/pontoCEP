import { describe, expect, it } from 'vitest';
import { formatCep, lookupCep, parseAddress } from '@/lib/cep';

describe('Consulta de CEP', () => {
  it('mantém logradouro, bairro, localidade e uf como dados separados', () => {
    expect(parseAddress({ cep: '01001-000', logradouro: 'Praça da Sé', bairro: 'Sé', localidade: 'São Paulo', uf: 'SP' })).toEqual({ cep: '01001-000', logradouro: 'Praça da Sé', bairro: 'Sé', localidade: 'São Paulo', uf: 'SP' });
  });
  it('rejeita CEP sem oito números', async () => {
    await expect(lookupCep('123')).rejects.toThrow('8 números');
  });
  it('informa quando a API não encontra o CEP', () => {
    expect(() => parseAddress({ erro: true })).toThrow('CEP não encontrado');
  });
  it('formata o CEP sem aceitar mais de oito números', () => {
    expect(formatCep('0100100099')).toBe('01001-000');
  });
});