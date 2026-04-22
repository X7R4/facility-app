import React, { useRef } from 'react';
import { Printer, MessageCircle, X } from 'lucide-react';

interface ReciboProps {
  etiqueta: any;
  onClose: () => void;
  pontoColetaNome: string;
}

export default function ViewReciboModal({ etiqueta, onClose, pontoColetaNome }: ReciboProps) {
  const reciboRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = document.getElementById('recibo-termal');
    if (!printContent) return;

    // Create an invisible iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Imprimir Recibo</title>
          <style>
            @page { margin: 0; size: 80mm auto; }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: monospace; 
              color: black; 
              width: 80mm; 
              background: white; 
            }
            .text-center { text-align: center; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-1 { margin-bottom: 0.25rem; }
            .mt-2 { margin-top: 0.5rem; }
            .mt-1 { margin-top: 0.25rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-3 { margin-top: 0.75rem; }
            .pb-4 { padding-bottom: 1rem; }
            .border-b-2 { border-bottom-width: 2px; }
            .border-black { border-color: black; }
            .border-dashed { border-style: dashed; }
            .font-black { font-weight: 900; }
            .font-bold { font-weight: bold; }
            .text-xl { font-size: 1.25rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-sm { font-size: 0.875rem; }
            .text-xs { font-size: 0.75rem; }
            .text-\\[10px\\] { font-size: 10px; }
            .text-\\[8px\\] { font-size: 8px; }
            .tracking-tighter { letter-spacing: -0.05em; }
            .tracking-widest { letter-spacing: 0.1em; }
            .bg-black { background-color: black; }
            .text-white { color: white; }
            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
            .block { display: block; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .w-32 { width: 8rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .grayscale { filter: grayscale(100%); }
            .mb-2 { margin-bottom: 0.5rem; }
          </style>
        </head>
        <body>
          <div style="padding: 10px;">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.parent.document.body.removeChild(window.frameElement); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  const handleWhatsApp = () => {
    const dataEstimada = new Date();
    dataEstimada.setDate(dataEstimada.getDate() + (etiqueta.prazoEntrega || 5));
    const dataFormatada = dataEstimada.toLocaleDateString('pt-BR');

    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const text = `Olá, *${pontoColetaNome.toUpperCase()}* enviou a sua encomenda pela *facilityenvios.com.br*. Seguem os dados para rastreio:\n\n` +
      `*Remetente:* ${etiqueta.remetente}\n` +
      `*Destinatário:* ${etiqueta.destinatario}\n` +
      `*Destino:* ${etiqueta.destinatarioCidade}/${etiqueta.destinatarioUf}\n\n` +
      `*Serviço:* ${etiqueta.tipo}\n` +
      `*Peso:* ${etiqueta.peso}g\n` +
      `*Valor Pago:* ${formatMoney(etiqueta.valorFinal)}\n` +
      `*Previsão de Entrega:* ${dataFormatada} (estimativa)\n\n` +
      `*CÓDIGO DE RASTREIO:*\n` +
      `🚚 *${etiqueta.codigoObjeto}*\n\n` +
      `Acompanhe seu pacote pelo site dos Correios! Obrigado pela preferência.\n\n` +
      `https://rastreamento.correios.com.br/app/index.php`;

    const telefone = etiqueta.remetenteTelefone?.replace(/\D/g, '') || '';
    if (!telefone || telefone.length < 10) {
      alert("Nenhum telefone de remetente foi salvo nesta etiqueta (ou é uma etiqueta antiga).");
      return;
    }

    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const dataEmissao = new Date(etiqueta.createdAt || new Date()).toLocaleString('pt-BR');
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print animate-in fade-in duration-300">

        <div className="flex flex-col md:flex-row gap-6 max-h-[90vh] w-full max-w-4xl">

          {/* PAINEL DE CONTROLE (NO-PRINT) */}
          <div className="flex-1 bg-white dark:bg-[#121620] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-center">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Opções de Recibo</h2>
              <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              O recibo ao lado está formatado no padrão de <strong>bobina térmica de 80mm</strong>. Você pode imprimi-lo diretamente ou enviar uma via digital para o WhatsApp do remetente preenchido na etapa de envio.
            </p>

            <div className="space-y-4">
              <button onClick={handlePrint} className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                <Printer size={20} /> Imprimir Cupom Térmico (80mm)
              </button>

              <button onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebd5a] transition-colors shadow-lg shadow-[#25D366]/20">
                <MessageCircle size={20} /> Enviar via WhatsApp
              </button>
            </div>
          </div>

          {/* VISUALIZADOR DO RECIBO */}
          <div className="w-full max-w-[320px] mx-auto bg-slate-100 dark:bg-slate-900 rounded-xl p-4 flex justify-center items-center overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-inner">

            {/* INÍCIO DO CUPOM TÉRMICO (ID PARA IMPRESSÃO) */}
            <div id="recibo-termal" ref={reciboRef} className="bg-white text-black p-4 w-[80mm] min-h-[100mm] shadow-lg border border-slate-200 font-mono text-sm uppercase leading-tight relative">

              {/* CABEÇALHO */}
              <div className="text-center mb-4 border-b-2 border-black border-dashed pb-4">
                <img src="/logo.png" alt="Logo Facility Envios" className="w-32 mx-auto mb-2 grayscale" />
                <p className="text-[10px] font-bold">CNPJ: 59.647.774/0001-51</p>
                <div className="mt-2 text-xs font-bold bg-black text-white py-1">
                  PONTO DE COLETA PARCEIRO
                </div>
                <p className="text-sm font-bold mt-1">{pontoColetaNome}</p>
                <p className="text-[10px] mt-2">Emissão: {dataEmissao}</p>
              </div>

              {/* DADOS REMETENTE / DESTINATÁRIO */}
              <div className="mb-4 border-b-2 border-black border-dashed pb-4 text-xs space-y-2">
                <div>
                  <span className="font-bold block">Remetente:</span>
                  <span>{etiqueta.remetente}</span><br />
                  <span>{etiqueta.remetenteTelefone}</span>
                </div>
                <div>
                  <span className="font-bold block mt-2">Destinatário:</span>
                  <span>{etiqueta.destinatario}</span><br />
                  <span>{etiqueta.destinatarioCidade} - {etiqueta.destinatarioUf}</span><br />
                  <span>CEP: {etiqueta.destinatarioCep}</span>
                </div>
              </div>

              {/* DADOS PACOTE E VALOR */}
              <div className="mb-4 border-b-2 border-black border-dashed pb-4 text-xs">
                <div className="flex justify-between mb-1">
                  <span>SERVIÇO:</span>
                  <span className="font-bold">{etiqueta.tipo}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>PESO:</span>
                  <span>{etiqueta.peso}g</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>MEDIDAS:</span>
                  <span>{etiqueta.medidas}</span>
                </div>
                <div className="flex justify-between mt-3 text-sm font-black">
                  <span>TOTAL PAGO:</span>
                  <span>{formatMoney(etiqueta.valorFinal || 0)}</span>
                </div>
              </div>

              {/* RASTREIO */}
              <div className="text-center border-b-2 border-black border-dashed pb-4 mb-4">
                <p className="text-xs font-bold mb-1">CÓDIGO DE RASTREIO</p>
                <h2 className="text-2xl font-black tracking-widest">{etiqueta.codigoObjeto}</h2>
                <p className="text-[10px] mt-2 font-bold">PRAZO PREVISTO: {etiqueta.prazoEntrega || 5} DIAS ÚTEIS</p>
              </div>

              {/* RODAPÉ */}
              <div className="text-center text-[10px] font-bold">
                <p>OBRIGADO PELA PREFERÊNCIA!</p>
                <p className="mt-1 font-normal">Rastreie em: rastreamento.correios.com.br</p>
                <p className="mt-4 text-[8px]">Sistema desenvolvido por Facility Envios</p>
              </div>

            </div>
            {/* FIM DO CUPOM */}

          </div>

        </div>
      </div>
    </>
  );
}
