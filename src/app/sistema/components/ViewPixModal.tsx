"use client";
import { useState, useEffect, useCallback } from "react";
import { X, QrCode, Copy, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { initMercadoPago, Payment, StatusScreen } from "@mercadopago/sdk-react";

initMercadoPago('APP_USR-a3a1a4ca-73cb-49e7-9ef2-d62878cc488a');

type Step = 'form' | 'qrcode' | 'confirmed' | 'error';

export default function ViewPixModal({
  pixInfo,
  onClose,
  onPaid,
  isDark
}: {
  pixInfo: any;
  onClose: () => void;
  onPaid: () => void;
  isDark: boolean;
}) {
  const [step, setStep] = useState<Step>('form');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string>('');
  const [qrCodeText, setQrCodeText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Poll payment status after QR code is displayed
  useEffect(() => {
    if (step !== 'qrcode' || !paymentId) return;

    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('facility_token');
        // We check any of the etiqueta IDs
        const checkId = pixInfo.idsEtiquetas ? pixInfo.idsEtiquetas[0] : pixInfo.idEtiqueta;
        const res = await fetch(`http://localhost:4000/pix/status/${checkId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.pagamentoStatus === 'Pago') {
            clearInterval(interval);
            setStep('confirmed');
            setTimeout(() => onPaid(), 2000);
          }
        }
      } catch (e) {
        // silent
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [step, paymentId, pixInfo, onPaid]);

  const onSubmit = useCallback(async ({ formData: mpFormData }: any) => {
    try {
      const payload = {
        ...mpFormData,
        idsEtiquetas: pixInfo.idsEtiquetas || [pixInfo.idEtiqueta]
      };
      const targetId = pixInfo.idsEtiquetas ? 'multiple' : pixInfo.idEtiqueta;
      const token = localStorage.getItem('facility_token');

      const response = await fetch(`http://localhost:4000/pix/processar/${targetId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrMsg(data.mensagem || "Erro ao processar pagamento.");
        setStep('error');
        throw new Error(data.mensagem);
      }

      // Extract QR Code data
      const txData = data?.point_of_interaction?.transaction_data;
      if (txData?.qr_code_base64) {
        setQrCodeBase64(txData.qr_code_base64);
        setQrCodeText(txData.qr_code || '');
        setPaymentId(String(data.id));
        setStep('qrcode');
      } else {
        // Fallback: no QR data but payment created
        setErrMsg("QR Code não disponível. Status: " + data.status);
        setStep('error');
      }

      return data;
    } catch (error: any) {
      setErrMsg(error.message || "Falha na comunicação.");
      setStep('error');
      throw error;
    }
  }, [pixInfo]);

  const copyToClipboard = () => {
    if (!qrCodeText) return;
    navigator.clipboard.writeText(qrCodeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#0f111a] text-slate-200 border border-slate-800' : 'bg-white text-slate-800'}`}>

        {/* Header */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${isDark ? 'border-slate-800 bg-[#121620]' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <QrCode size={16} />
            </div>
            <h2 className="font-bold">Pagamento PIX</h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[85vh]">

          {/* STEP: Form (Brick) */}
          {step === 'form' && (
            <>
              <div className="text-center mb-4">
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {pixInfo.idsEtiquetas ? `Pagamento para ${pixInfo.idsEtiquetas.length} etiqueta(s).` : "Pague para liberar sua etiqueta."}
                </p>
                <p className={`text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {formatCurrency(pixInfo.valor)}
                </p>
              </div>
              <Payment
                initialization={{ amount: pixInfo.valor }}
                customization={{
                  paymentMethods: { bankTransfer: ["pix"] },
                  visual: { style: { theme: isDark ? 'dark' : 'default' } }
                } as any}
                onSubmit={onSubmit}
                onReady={() => {}}
                onError={(e: any) => {
                  console.error('Brick error:', e);
                  setErrMsg(e?.message || 'Erro ao inicializar pagamento.');
                  setStep('error');
                }}
              />
            </>
          )}

          {/* STEP: QR Code */}
          {step === 'qrcode' && (
            <div className="flex flex-col items-center gap-5">
              <div className="text-center">
                <p className={`text-sm font-semibold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Aguardando pagamento</p>
                <p className={`text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(pixInfo.valor)}</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Escaneie o QR Code com o app do seu banco</p>
              </div>

              {qrCodeBase64 && (
                <div className="p-3 bg-white rounded-2xl shadow-lg">
                  <img
                    src={`data:image/png;base64,${qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="w-52 h-52"
                  />
                </div>
              )}

              <div className="w-full">
                <p className={`text-xs mb-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>PIX Copia e Cola</p>
                <div className={`flex items-center gap-2 p-3 rounded-xl border text-xs break-all ${isDark ? 'bg-[#121620] border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <span className="flex-1 line-clamp-2">{qrCodeText || 'Carregando...'}</span>
                  <button onClick={copyToClipboard} className={`shrink-0 p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}>
                    {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-amber-500" />
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verificando pagamento automaticamente…</p>
              </div>
            </div>
          )}

          {/* STEP: Confirmed */}
          {step === 'confirmed' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle2 size={56} className="text-green-500" />
              <p className="text-xl font-bold">Pagamento confirmado!</p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sua etiqueta foi liberada. Aguarde…</p>
            </div>
          )}

          {/* STEP: Error */}
          {step === 'error' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <AlertCircle size={56} className="text-red-500" />
              <p className="text-xl font-bold">Ocorreu um erro</p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{errMsg}</p>
              <button onClick={() => setStep('form')} className="mt-2 px-6 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors">
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
