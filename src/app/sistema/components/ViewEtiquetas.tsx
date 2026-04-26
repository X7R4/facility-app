import { useState, useEffect, useCallback } from "react";
import { ListChecks, LayoutDashboard, CheckSquare, Square, Receipt, FileText, QrCode, Printer, RefreshCw, Download } from "lucide-react";
import ViewReciboModal from "./ViewReciboModal";
import ViewPixModal from "./ViewPixModal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function ViewEtiquetas({ isDark }: { isDark: boolean }) {
  const [selectedIds, setSelectedIds]     = useState<string[]>([]);
  const [viewMode, setViewMode]           = useState<'list' | 'grid'>('list');
  const [etiquetas, setEtiquetas]         = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [selectedRecibo, setSelectedRecibo] = useState<any>(null);
  const [pixModalData, setPixModalData]   = useState<any>(null);
  const [pontoColetaNome, setPontoColetaNome] = useState("");

  const token = () => localStorage.getItem('facility_token') ?? '';

  const fetchEtiquetasList = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, listRes] = await Promise.all([
        fetch(`${API_BASE}/auth/me`,   { headers: { Authorization: `Bearer ${token()}` } }),
        fetch(`${API_BASE}/etiquetas`, { headers: { Authorization: `Bearer ${token()}` } }),
      ]);
      if (profileRes.ok) {
        const p = await profileRes.json();
        setPontoColetaNome(p.nomePonto || p.nome || "Ponto de Coleta");
      }
      if (listRes.ok) setEtiquetas(await listRes.json());
    } catch (err) {
      console.error("Erro ao buscar etiquetas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEtiquetasList(); }, [fetchEtiquetasList]);

  /* ── Ações ─────────────────────────────────────────────── */

  const handlePrintEtiqueta = (e: any) => {
    // Só permite se status Aprovado e pago
    if (e.status !== 'Aprovado' || e.pagamentoStatus === 'Pendente') return;
    const id = e._id || e.id;
    const url = `${API_BASE}/prepostagem/pdf-salvo/${id}?token=${token()}`;
    const win = window.open(url, '_blank');
    win?.addEventListener('load', () => win.print());
  };

  const handleDownloadEtiqueta = (e: any) => {
    if (e.status !== 'Aprovado' || e.pagamentoStatus === 'Pendente') return;
    const id = e._id || e.id;
    const url = `${API_BASE}/prepostagem/pdf-salvo/${id}?token=${token()}`;
    // Cria link temporário para forçar download
    const link = document.createElement('a');
    link.href = url;
    link.download = `etiqueta_${e.codigoObjeto || id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePayEtiqueta = (e: any) => {
    setPixModalData({ idEtiqueta: e._id || e.id, valor: e.valorBaseUsuario });
  };

  const handlePixPaid = () => {
    setPixModalData(null);
    fetchEtiquetasList();
  };

  /* ── Seleção ─────────────────────────────────────────── */
  const toggleSelect = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleSelectAll = () =>
    setSelectedIds(selectedIds.length === etiquetas.length && etiquetas.length > 0 ? [] : etiquetas.map(e => e._id || e.id));

  const selectedEtiquetas = etiquetas.filter(e => selectedIds.includes(e._id || e.id));
  const pendingEtiquetas  = selectedEtiquetas.filter(e => e.pagamentoStatus === 'Pendente');
  const totalPending      = pendingEtiquetas.reduce((s, e) => s + (e.valorBaseUsuario || 0), 0);

  const handleMultiPay = () => {
    if (pendingEtiquetas.length === 0) {
      alert("Nenhuma etiqueta selecionada está pendente."); return;
    }
    setPixModalData({ idsEtiquetas: pendingEtiquetas.map(e => e._id || e.id), valor: totalPending });
  };

  /* ── Badge de status ─────────────────────────────────── */
  const StatusBadge = ({ status, pagamentoStatus }: { status: string; pagamentoStatus: string }) => {
    const isAprovado  = status === 'Aprovado';
    const isFalhou    = status === 'Falhou';
    const isPendente  = pagamentoStatus === 'Pendente';
    const label       = isAprovado ? 'Aprovado' : isFalhou ? 'Falhou' : isPendente ? 'Pendente' : status;
    const cls         = isAprovado
      ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
      : isFalhou
        ? 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30'
        : 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30';
    return <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
  };

  return (
    <div className="space-y-5 pb-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Minhas Etiquetas
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Acompanhe o status e lucro de todos os seus envios.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchEtiquetasList}
            className={`p-2 rounded-lg border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'}`}
            title="Atualizar lista"
          >
            <RefreshCw size={18} />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg border transition-all ${viewMode === 'list' ? (isDark ? 'bg-blue-600/20 text-blue-500 border-blue-500/40' : 'bg-blue-50 text-blue-600 border-blue-200') : (isDark ? 'bg-slate-800 border-transparent text-slate-500' : 'bg-white border-slate-200 text-slate-400')}`}>
            <ListChecks size={20} />
          </button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg border transition-all ${viewMode === 'grid' ? (isDark ? 'bg-blue-600/20 text-blue-500 border-blue-500/40' : 'bg-blue-50 text-blue-600 border-blue-200') : (isDark ? 'bg-slate-800 border-transparent text-slate-500' : 'bg-white border-slate-200 text-slate-400')}`}>
            <LayoutDashboard size={20} />
          </button>
        </div>
      </div>

      {/* ── Barra de seleção múltipla ── */}
      {selectedIds.length > 0 && (
        <div className={`p-3 rounded-xl border flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 ${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{selectedIds.length} selecionadas</span>
            {totalPending > 0 && (
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Pendente ({pendingEtiquetas.length}): {fmt(totalPending)}
              </span>
            )}
          </div>
          {totalPending > 0 && (
            <button onClick={handleMultiPay} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              Pagar Selecionadas
            </button>
          )}
        </div>
      )}

      {/* ── Tabela ── */}
      {loading ? (
        <div className="flex justify-center p-10 text-slate-500">Carregando etiquetas...</div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'}`}>
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col style={{ width: '40px' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '9%' }} />
            </colgroup>
            <thead>
              <tr className={`border-b text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-slate-900/60 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                <th className="px-3 py-3">
                  <button onClick={handleSelectAll} className="text-blue-500">
                    {selectedIds.length > 0 && selectedIds.length === etiquetas.length
                      ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                </th>
                <th className="px-3 py-3">Remetente</th>
                <th className="px-3 py-3">Destinatário</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3 text-right">Custo</th>
                <th className="px-3 py-3 text-right">Valor Cliente</th>
                <th className="px-3 py-3 text-right">Lucro</th>
                <th className="px-3 py-3 text-right">Objeto</th>
                <th className="px-3 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
              {etiquetas.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-sm font-bold text-slate-500">
                    Nenhuma etiqueta gerada ainda.
                  </td>
                </tr>
              )}
              {etiquetas.map((e) => {
                const id = e._id || e.id;
                const isAprovado = e.status === 'Aprovado';
                // Isento = autorizadoSemPagamento | Pago = pagou via MP | undefined = dado antigo sem campo
                const isPago     = e.pagamentoStatus === 'Pago'
                  || e.pagamentoStatus === 'Isento'
                  || e.pagamentoStatus == null; // fallback para registros anteriores sem o campo
                const canPrint   = isAprovado && isPago;

                return (
                  <tr key={id} className={`group transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                    {/* Checkbox */}
                    <td className="px-3 py-3">
                      <button onClick={() => toggleSelect(id)} className={selectedIds.includes(id) ? 'text-blue-500' : (isDark ? 'text-slate-700' : 'text-slate-300')}>
                        {selectedIds.includes(id) ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </td>

                    {/* Remetente */}
                    <td className="px-3 py-3">
                      <p className={`text-xs font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{e.remetente || e.remetenteNome}</p>
                    </td>

                    {/* Destinatário */}
                    <td className="px-3 py-3">
                      <p className={`text-xs font-medium truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{e.destinatario || e.destinatarioNome}</p>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <StatusBadge status={e.status} pagamentoStatus={e.pagamentoStatus} />
                    </td>

                    {/* Tipo */}
                    <td className="px-3 py-3">
                      <span className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{e.tipo || e.tipoEnvio}</span>
                    </td>

                    {/* Custo Plataforma */}
                    <td className="px-3 py-3 text-right">
                      <p className={`text-xs font-bold ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>{fmt(e.valorBaseUsuario || 0)}</p>
                    </td>

                    {/* Valor Cliente */}
                    <td className="px-3 py-3 text-right">
                      <p className={`text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{fmt(e.valorFinal || 0)}</p>
                    </td>

                    {/* Lucro */}
                    <td className="px-3 py-3 text-right">
                      <p className={`text-xs font-black ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{fmt(e.lucroUsuario || 0)}</p>
                    </td>

                    {/* Código Objeto */}
                    <td className="px-3 py-3 text-right">
                      <p className="text-[10px] font-bold text-blue-500 truncate">{e.codigoObjeto}</p>
                    </td>

                    {/* Ações */}
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                        {/* Imprimir + Baixar — só Aprovado+Pago */}
                        {canPrint ? (
                          <>
                            <button
                              onClick={() => handlePrintEtiqueta(e)}
                              className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-emerald-900/30 text-emerald-400' : 'hover:bg-emerald-50 text-emerald-600'}`}
                              title="Imprimir Etiqueta (PDF)"
                            >
                              <Printer size={15} />
                            </button>
                            <button
                              onClick={() => handleDownloadEtiqueta(e)}
                              className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-blue-900/30 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                              title="Baixar PDF da Etiqueta"
                            >
                              <Download size={15} />
                            </button>
                          </>
                        ) : !isPago ? (
                          <button
                            onClick={() => handlePayEtiqueta(e)}
                            className="p-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all"
                            title="Realizar Pagamento PIX"
                          >
                            <QrCode size={15} />
                          </button>
                        ) : (
                          <span className={`p-1.5 rounded-lg ${isDark ? 'text-slate-600' : 'text-slate-300'}`} title="Aguardando aprovação">
                            <FileText size={15} />
                          </span>
                        )}

                        {/* Ver Recibo */}
                        <button
                          onClick={() => setSelectedRecibo(e)}
                          className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-blue-900/30 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                          title="Ver Recibo"
                        >
                          <Receipt size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modais ── */}
      {selectedRecibo && (
        <ViewReciboModal
          etiqueta={selectedRecibo}
          pontoColetaNome={pontoColetaNome}
          onClose={() => setSelectedRecibo(null)}
        />
      )}

      {pixModalData && (
        <ViewPixModal
          pixInfo={pixModalData}
          onClose={() => setPixModalData(null)}
          onPaid={handlePixPaid}
          isDark={isDark}
        />
      )}
    </div>
  );
}
