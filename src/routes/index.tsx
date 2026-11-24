import { createFileRoute } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, CircleCheck, Copy, LoaderCircle, MapPin, Search, ShieldCheck, Navigation, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCep, lookupCep, type Address } from '@/lib/cep';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Consulta de CEP | pontoCEP' },
    { name: 'description', content: 'Consulte um CEP e encontre logradouro, bairro, cidade e estado com os dados do ViaCEP.' },
    { property: 'og:title', content: 'pontoCEP — Consulta de CEP' },
    { property: 'og:description', content: 'Encontre o endereço de um CEP brasileiro de forma simples e gratuita.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function AddressMap({ address }: { address: Address | null }) {
  return <div className="map-illustration">
    <svg viewBox="0 0 420 326" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustração de ruas com um marcador de endereço">
      <g className="map-block">
        <rect x="-5" y="-20" width="95" height="82" rx="8"/><rect x="109" y="-20" width="92" height="82" rx="8"/><rect x="220" y="-20" width="92" height="82" rx="8"/><rect x="331" y="-20" width="100" height="82" rx="8"/>
        <rect x="-5" y="81" width="95" height="77" rx="8"/><rect x="109" y="81" width="92" height="77" rx="8"/><rect x="220" y="81" width="92" height="77" rx="8"/><rect x="331" y="81" width="100" height="77" rx="8"/>
        <rect x="-5" y="177" width="95" height="77" rx="8"/><rect x="109" y="177" width="92" height="77" rx="8"/><rect x="220" y="177" width="92" height="77" rx="8"/><rect x="331" y="177" width="100" height="77" rx="8"/>
        <rect x="-5" y="273" width="95" height="77" rx="8"/><rect x="109" y="273" width="92" height="77" rx="8"/><rect x="220" y="273" width="92" height="77" rx="8"/><rect x="331" y="273" width="100" height="77" rx="8"/>
      </g>
      <path className="map-river" d="M-40 132 C90 170 35 280 185 350"/>
      <path className="map-road" d="M-10 71H440 M-10 167H440 M100-20V350 M211-20V350 M321-20V350"/>
      <rect className="map-highlight" x="229" y="90" width="31" height="25" rx="4"/>
      <circle cx="211" cy="179" r="32" className="map-pin" opacity=".1"/>
      <path className="map-pin" d="M211 103a27 27 0 0 0-27 27c0 21 27 48 27 48s27-27 27-48a27 27 0 0 0-27-27Z"/>
      <circle className="map-pin-center" cx="211" cy="130" r="10"/>
    </svg>
    <div className="map-location"><MapPin/><div><strong>{address ? `${address.localidade}, ${address.uf}` : 'Cada endereço começa com um CEP.'}</strong><p>{address ? `CEP ${address.cep}` : 'Encontre o seu próximo destino.'}</p></div></div>
  </div>;
}

function Index() {
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function search(value: string) {
    if (loading) return;
    setCep(formatCep(value)); setError(''); setAddress(null); setCopied(false); setLoading(true);
    try { setAddress(await lookupCep(value)); }
    catch (err) { setError(err instanceof Error && err.name === 'Error' ? err.message : 'Não foi possível conectar ao ViaCEP. Tente novamente em instantes.'); }
    finally { setLoading(false); }
  }
  function submit(event: FormEvent) { event.preventDefault(); void search(cep); }
  async function copy() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(`${address.logradouro}\n${address.bairro}\n${address.localidade} - ${address.uf}\nCEP ${address.cep}`);
      setCopied(true);
    } catch { setError('Não foi possível copiar o endereço neste navegador.'); }
  }

  return <div>
    <header className="site-header"><div className="header-inner">
      <div className="brand"><div className="brand-mark"><MapPin size={23}/></div><span>ponto<span>CEP</span></span></div>
      <div className="header-note"><span className="status-dot"/> Dados do ViaCEP <ArrowUpRight size={13}/></div>
    </div></header>
    <main className="page-content">
      <section className="intro"><div className="eyebrow"><Navigation size={13}/> De um CEP a um endereço</div><h1>Consulta de CEP<span className="text-primary">.</span></h1><p>O endereço que você procura, sem complicação.<br/>Consulte qualquer CEP do Brasil.</p></section>
      <div className="workspace">
        <section aria-label="Consulta e endereço">
          <form onSubmit={submit} noValidate>
            <label className="search-label" htmlFor="cep">Qual CEP você procura?</label>
            <div className="search-row"><div className="cep-input-wrap"><Search/><Input className="cep-input" id="cep" value={cep} onChange={e => setCep(formatCep(e.target.value))} placeholder="00000-000" inputMode="numeric" autoComplete="postal-code" maxLength={9} aria-invalid={Boolean(error)} aria-describedby={error ? 'cep-error' : undefined}/></div><Button className="search-button" disabled={loading} type="submit">{loading ? <LoaderCircle className="spin"/> : <Search/>}{loading ? 'Buscando' : 'Consultar'}</Button></div>
            <div className="example-row">Experimente: <Button variant="link" type="button" disabled={loading} onClick={() => void search('01001000')}>01001-000 <ArrowUpRight size={12}/></Button></div>
            {error && <p id="cep-error" className="error-note" role="alert">{error}</p>}
          </form>
          <section className="address-section" aria-live="polite" aria-busy={loading}>
            <div className="result-heading"><h2>Endereço</h2><span className={`result-status ${address ? 'found' : ''}`}>{address ? <CircleCheck size={13}/> : <MapPin size={13}/>} {loading ? 'Consultando CEP' : address ? 'CEP encontrado' : 'Aguardando consulta'}</span></div>
            <div className="address-grid">
              {([{ key: 'logradouro', label: 'Logradouro', full: true }, { key: 'bairro', label: 'Bairro', full: true }, { key: 'localidade', label: 'Cidade', full: false }, { key: 'uf', label: 'Estado', full: false }] as const).map(field => <div key={field.key} className={`address-field ${field.full ? 'full' : ''}`}><label htmlFor={field.key}>{field.label}</label><Input id={field.key} readOnly value={address?.[field.key] ?? ''} placeholder={address ? 'Não informado' : '—'}/></div>)}
            </div>
            <div className="result-bottom"><span className="privacy-note"><ShieldCheck size={13}/> Sua consulta não é armazenada.</span><Button className="copy-button" variant="ghost" disabled={!address} onClick={() => void copy()}>{copied ? <Check/> : <Copy/>}{copied ? 'Copiado' : 'Copiar endereço'}</Button></div>
          </section>
        </section>
        <aside className="map-side"><div><AddressMap address={address}/><div className="map-caption">Ilustração · não representa a localização real</div></div><div className="service-info"><div className="service-icon"><Map size={18}/></div><div><strong>De norte a sul, encontre seu endereço.</strong><p>Dados públicos do ViaCEP, para consultar endereços em todo o Brasil. Simples e gratuito.</p></div></div></aside>
      </div>
      <footer className="page-footer"><span>Feito para encurtar caminhos.</span><a href="https://viacep.com.br/" target="_blank" rel="noreferrer">Conheça o ViaCEP <ArrowUpRight size={12}/></a></footer>
    </main>
  </div>;
}
