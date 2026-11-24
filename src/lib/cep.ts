export type Address = { cep: string; logradouro: string; bairro: string; localidade: string; uf: string };

export function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export function parseAddress(data: Record<string, unknown>): Address {
  if (data['erro']) throw new Error("CEP não encontrado. Confira os números e tente novamente.");
  const field = (key: string) => typeof data[key] === 'string' ? data[key] : '';
  return { cep: field('cep'), logradouro: field('logradouro'), bairro: field('bairro'), localidade: field('localidade'), uf: field('uf') };
}

export async function lookupCep(value: string): Promise<Address> {
  const cep = value.replace(/\D/g, '');
  if (cep.length !== 8) throw new Error('Digite um CEP com 8 números.');
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error('Não foi possível consultar o CEP. Tente novamente.');
  return parseAddress(await response.json());
}