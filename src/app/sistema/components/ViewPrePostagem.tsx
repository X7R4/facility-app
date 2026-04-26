import { useState, useEffect } from "react";
import { CheckCircle2, Search, AlertCircle, Loader2, Receipt, Printer, Download } from "lucide-react";
import InputField from "./InputField";
import ViewReciboModal from "./ViewReciboModal";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

// Inicializa o Mercado Pago
initMercadoPago('APP_USR-a3a1a4ca-73cb-49e7-9ef2-d62878cc488a');

export default function ViewPrePostagem({ isDark }: { isDark: boolean }) {
  const [senderMode, setSenderMode] = useState<"fixed" | "existing" | "new">("fixed");
  const [currentStep, setCurrentStep] = useState(1);

  // Workflow states
  const [isLoading, setIsLoading] = useState(false);
  const [simulation, setSimulation] = useState<any[]>([]);
  const [loadingPrice, setLoadingPrice] = useState(false);
  
  // Recibo States
  const [geradoEtiquetaData, setGeradoEtiquetaData] = useState<any>(null);
  const [pontoColetaNome, setPontoColetaNome] = useState("");
  const [showRecibo, setShowRecibo] = useState(false);

  // PIX States
  const [pixInfo, setPixInfo] = useState<any>(null);
  const [pixEtiquetaId, setPixEtiquetaId] = useState<string | null>(null);
  const [pixValor, setPixValor] = useState<number>(0);
  const [pixStep, setPixStep] = useState<'form'|'qrcode'|'confirmed'>('form');
  const [pixQrBase64, setPixQrBase64] = useState<string>('');
  const [pixQrText, setPixQrText] = useState<string>('');
  const [pixCopied, setPixCopied] = useState(false);
  const [pixPaymentId, setPixPaymentId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('facility_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data) {
          setPontoColetaNome(data.nomePonto || data.nome || "Ponto de Coleta");
        }
      })
      .catch(e => console.error(e));
  }, []);
  
  // Efeito para buscar preço ao chegar no Passo 3
  useEffect(() => {
    if (currentStep === 3) {
      fetchPriceSimulation();
    }
  }, [currentStep]);

  const fetchPriceSimulation = async () => {
    setLoadingPrice(true);
    try {
      const payload = {
        idLote: "1",
        parametrosProduto: [
          {
            coProduto: "03220", // SEDEX
            nuRequisicao: "1",
            nuContrato: formData.numeroCartaoPostagem,
            nuDR: "20",
            cepOrigem: formData.remetente.endereco.cep.replace(/\D/g, ""),
            cepDestino: formData.destinatario.endereco.cep.replace(/\D/g, ""),
            psObjeto: formData.pesoInformado,
            tpObjeto: formData.codigoFormatoObjetoInformado,
            comprimento: formData.comprimentoInformado,
            largura: formData.larguraInformada,
            altura: formData.alturaInformada
          },
          {
            coProduto: "03298", // PAC
            nuRequisicao: "2",
            nuContrato: formData.numeroCartaoPostagem,
            nuDR: "20",
            cepOrigem: formData.remetente.endereco.cep.replace(/\D/g, ""),
            cepDestino: formData.destinatario.endereco.cep.replace(/\D/g, ""),
            psObjeto: formData.pesoInformado,
            tpObjeto: formData.codigoFormatoObjetoInformado,
            comprimento: formData.comprimentoInformado,
            largura: formData.larguraInformada,
            altura: formData.alturaInformada
          }
        ]
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/consulta/simularFrete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('facility_token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data) {
        setSimulation(data);
      }
    } catch (e) {
      console.error("Erro na simulação", e);
    } finally {
      setLoadingPrice(false);
    }
  };
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  // States for dynamic sender modes
  const [fixedPonto, setFixedPonto] = useState<any>(null);
  const [clientSearchText, setClientSearchText] = useState("");
  const [clientSearchResults, setClientSearchResults] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const API_PRE  = `${API_BASE}/prepostagem`;

  // Form State
  const [formData, setFormData] = useState({
    remetente: {
      nome: "",
      cpfCnpj: "",
      telefone: "",
      email: "",
      endereco: { cep: "", logradouro: "", numero: "", bairro: "", cidade: "", uf: "", pais: "BR" }
    },
    destinatario: {
      nome: "Maria Oliveira",
      cpfCnpj: "98765432100",
      telefone: "21987654321",
      endereco: { cep: "20040010", logradouro: "Rua da Quitanda", numero: "250", bairro: "Centro", cidade: "Rio de Janeiro", uf: "RJ", pais: "BR" }
    },
    codigoServico: "03220", // Default: SEDEX
    numeroCartaoPostagem: "0079634834",
    itemConteudo: "Ex: Camiseta de Algodão",
    itemQuantidade: "1",
    itemValor: "50.00",
    pesoInformado: "500",
    codigoFormatoObjetoInformado: "2",
    alturaInformada: "20",
    larguraInformada: "20",
    comprimentoInformado: "20",
    cienteObjetoNaoProibido: "1",
    dataPrevistaPostagem: new Date().toISOString().split("T")[0],
    modalidadePagamento: "2",
    avisoRecebimento: false
  });

  // Load Fixed Ponto (from User Profile)
  useEffect(() => {
    const token = localStorage.getItem('facility_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data && (data.nomePonto || data.nome)) {
          const profilePonto = {
            nome: data.nomePonto || data.nome,
            cpfCnpj: data.cpf,
            telefone: data.telefonePonto || data.telefone,
            email: data.email,
            endereco: {
              cep: data.enderecoPonto?.cep || "",
              logradouro: data.enderecoPonto?.logradouro || "",
              numero: data.enderecoPonto?.numero || "",
              bairro: data.enderecoPonto?.bairro || "",
              cidade: data.enderecoPonto?.cidade || "",
              uf: data.enderecoPonto?.uf || "",
              pais: "BR"
            }
          };
          setFixedPonto(profilePonto);
          if (senderMode === "fixed") {
            setFormData(prev => ({ ...prev, remetente: profilePonto }));
          }
        }
      })
      .catch(err => console.error("Erro ao carregar ponto fixo:", err));
  }, []);

  // Update Remetente Data if mode changes
  useEffect(() => {
    if (senderMode === "fixed" && fixedPonto) {
      setFormData(prev => ({ ...prev, remetente: fixedPonto }));
    } else if (senderMode === "existing" && selectedClient) {
      setFormData(prev => ({ ...prev, remetente: selectedClient }));
    } else if (senderMode === "new") {
      setFormData(prev => ({
        ...prev, remetente: {
          nome: "", cpfCnpj: "", telefone: "", email: "",
          endereco: { cep: "", logradouro: "", numero: "", bairro: "", cidade: "", uf: "", pais: "BR" }
        }
      }));
    }
  }, [senderMode, fixedPonto, selectedClient]);

  // Client Search Debounce
  useEffect(() => {
    if (clientSearchText.length < 2) {
      setClientSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`${API_BASE}/clientes?busca=${clientSearchText}`)
        .then(r => r.json())
        .then(data => setClientSearchResults(data))
        .catch(e => console.error(e));
    }, 400);
    return () => clearTimeout(timer);
  }, [clientSearchText]);

  // CEP Fetch Logic
  const fetchViaCEP = async (cep: string, targetContent: 'remetenteEndereco' | 'destinatarioEndereco') => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          handleInputChange(targetContent, "logradouro", data.logradouro);
          handleInputChange(targetContent, "bairro", data.bairro);
          handleInputChange(targetContent, "cidade", data.localidade);
          handleInputChange(targetContent, "uf", data.uf);
        }
      } catch (err) {
        console.warn("ViaCEP indisponível", err);
      }
    }
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev: any) => {
      let nextState = prev;
      if (section === "root") {
        nextState = { ...prev, [field]: value };
      } else if (section === "destinatario" || section === "remetente") {
        nextState = { ...prev, [section]: { ...prev[section], [field]: value } };
      } else if (section === "destinatarioEndereco") {
        nextState = { ...prev, destinatario: { ...prev.destinatario, endereco: { ...prev.destinatario.endereco, [field]: value } } };
      } else if (section === "remetenteEndereco") {
        nextState = { ...prev, remetente: { ...prev.remetente, endereco: { ...prev.remetente.endereco, [field]: value } } };
      }

      return nextState;
    });

    if (field === "cep" && value.replace(/\D/g, "").length === 8) {
      fetchViaCEP(value, section as 'remetenteEndereco' | 'destinatarioEndereco');
    }
  };

  const handleGerarFlow = async () => {
    setIsLoading(true);
    setErrorText(null);
    setPdfUrl(null);
    setQrCodeUrl(null);


    try {
      // Validação Básica
      if (!formData.remetente.nome || !formData.remetente.endereco.numero || !formData.remetente.endereco.cep) {
        throw new Error("Por favor, preencha os campos vitais do Remetente (Nome, CEP e Número).");
      }
      if (!formData.destinatario.nome || !formData.destinatario.endereco.numero || !formData.destinatario.endereco.cep) {
        throw new Error("Por favor, preencha os campos vitais do Destinatário (Nome, CEP e Número).");
      }

      // 1. Se for Novo Cliente, salva no DB primeiro
      if (senderMode === "new") {
        try {
          await fetch(`${API_BASE}/clientes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('facility_token')}`
            },
            body: JSON.stringify(formData.remetente)
          });
        } catch (e) {
          console.warn("Nao foi possivel salvar o novo cliente", e);
        }
      }

      const payloadCriar = {
        idCorreios: "59647774000151",
        remetente: {
          nome: formData.remetente.nome,
          cpfCnpj: formData.remetente.cpfCnpj.replace(/\D/g, ""),
          endereco: {
            cep: formData.remetente.endereco.cep.replace(/\D/g, ""),
            logradouro: formData.remetente.endereco.logradouro,
            numero: formData.remetente.endereco.numero,
            bairro: formData.remetente.endereco.bairro,
            cidade: formData.remetente.endereco.cidade,
            uf: formData.remetente.endereco.uf,
            pais: "BR"
          }
        },
        destinatario: {
          nome: formData.destinatario.nome,
          cpfCnpj: formData.destinatario.cpfCnpj.replace(/\D/g, ""),
          endereco: {
            cep: formData.destinatario.endereco.cep.replace(/\D/g, ""),
            logradouro: formData.destinatario.endereco.logradouro,
            numero: formData.destinatario.endereco.numero,
            bairro: formData.destinatario.endereco.bairro,
            cidade: formData.destinatario.endereco.cidade,
            uf: formData.destinatario.endereco.uf,
            pais: "BR"
          }
        },
        codigoServico: formData.codigoServico,
        numeroCartaoPostagem: formData.numeroCartaoPostagem,
        itensDeclaracaoConteudo: [
          {
            conteudo: formData.itemConteudo,
            quantidade: String(parseInt(formData.itemQuantidade, 10) || 1),
            valor: String(parseFloat(formData.itemValor).toFixed(2) || "50.00")
          }
        ],
        pesoInformado: String(parseInt(formData.pesoInformado, 10) || 500),
        codigoFormatoObjetoInformado: formData.codigoFormatoObjetoInformado,
        alturaInformada: formData.alturaInformada,
        larguraInformada: formData.larguraInformada,
        comprimentoInformado: formData.comprimentoInformado,
        cienteObjetoNaoProibido: formData.cienteObjetoNaoProibido,
        dataPrevistaPostagem: formData.dataPrevistaPostagem,
        modalidadePagamento: formData.modalidadePagamento
      };

      // 1. Criar
      const cRes = await fetch(`${API_PRE}/criar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('facility_token')}`
        },
        body: JSON.stringify(payloadCriar)
      });
      const cData = await cRes.json();
      if (!cRes.ok || !cData.id) throw new Error(cData.mensagem || cData.detalhe || "Falha ao criar pré-postagem na API dos Correios.");

      const { id, codigoObjeto, _idEtiqueta, pagamentoStatus } = cData;

      // Se pendente, travar o fluxo para o Checkout Brick
      if (pagamentoStatus === 'Pendente' && _idEtiqueta) {
        setPixEtiquetaId(_idEtiqueta);
        
        // Buscamos o valor da simulação para o Brick
        const simMatch = simulation.find(s => (formData.codigoServico === "03220" ? s.coProduto === "03220" : s.coProduto === "03298"));
        setPixValor(parseFloat(simMatch?.custoParaUsuario || "0"));
        setPixInfo(true); // Ativa a exibição do painel de pagamento
        
        // Preencher dados do recibo para exibir o botão
        setGeradoEtiquetaData({
          codigoObjeto: codigoObjeto,
          remetente: formData.remetente.nome,
          remetenteTelefone: formData.remetente.telefone,
          destinatario: formData.destinatario.nome,
          destinatarioCep: formData.destinatario.endereco.cep,
          destinatarioCidade: formData.destinatario.endereco.cidade,
          destinatarioUf: formData.destinatario.endereco.uf,
          tipo: formData.codigoServico === '03220' ? 'SEDEX' : 'PAC',
          peso: formData.pesoInformado,
          medidas: `${formData.comprimentoInformado}x${formData.larguraInformada}x${formData.alturaInformada} cm`,
          valorFinal: parseFloat(simMatch?.pcFinal || "0"),
          prazoEntrega: parseInt(simMatch?.prazoEntrega || "5"),
          createdAt: new Date().toISOString()
        });

        return; // Para o fluxo aqui! O usuário precisa pagar via Brick.
      }

      // Se Isento ou já de alguma forma pago, continua o fluxo normal
      await fetchEtiquetaPdf(id, codigoObjeto);

    } catch (error: any) {
      console.error(error);
      setErrorText(error.message);
    } finally {
      if (!pixInfo) setIsLoading(false);
    }
  };

  const fetchEtiquetaPdf = async (idPostagem: string, codigoObjeto: string) => {
    try {
      setIsLoading(true);
      console.log("Aguardando 5s para transição Assíncrona Correios (Pendente -> Faturado)...");
      await new Promise(resolve => setTimeout(resolve, 5000));

      const gRes = await fetch(`${API_PRE}/gerar-rotulo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('facility_token')}`
        },
        body: JSON.stringify({ idsPrePostagem: [idPostagem], tipoRotulo: "P", formatoRotulo: "EN" })
      });
      const gData = await gRes.json();
      if (!gRes.ok || !gData.idRecibo) throw new Error(gData.mensagem || "Falha ao gerar o rótulo da etiqueta.");
      const idRecibo = gData.idRecibo;

      // Espera 3 segundos devido à API Assíncrona dos Correios
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Download Etiqueta (PDF) 
      const dRotRes = await fetch(`${API_PRE}/download-rotulo/${idRecibo}?pago=true`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('facility_token')}`
        }
      });
      if (!dRotRes.ok) throw new Error("Falha ao autorizar liberação da etiqueta.");
      const rotBlob = await dRotRes.blob();
      setPdfUrl(URL.createObjectURL(rotBlob));

      // Preencher dados para o Recibo
      const simMatch = simulation.find(s => (formData.codigoServico === "03220" ? s.coProduto === "03220" : s.coProduto === "03298"));
      setGeradoEtiquetaData({
        codigoObjeto: codigoObjeto,
        remetente: formData.remetente.nome,
        remetenteTelefone: formData.remetente.telefone,
        destinatario: formData.destinatario.nome,
        destinatarioCep: formData.destinatario.endereco.cep,
        destinatarioCidade: formData.destinatario.endereco.cidade,
        destinatarioUf: formData.destinatario.endereco.uf,
        tipo: formData.codigoServico === '03220' ? 'SEDEX' : 'PAC',
        peso: formData.pesoInformado,
        medidas: `${formData.comprimentoInformado}x${formData.larguraInformada}x${formData.alturaInformada} cm`,
        valorFinal: parseFloat(simMatch?.pcFinal || "0"),
        prazoEntrega: parseInt(simMatch?.prazoEntrega || "5"),
        createdAt: new Date().toISOString()
      });

    } catch (error: any) {
      console.error(error);
      setErrorText(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onPaymentSubmit = async ({ formData: mpFormData }: any) => {
    try {
      const token = localStorage.getItem('facility_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/pix/processar/${pixEtiquetaId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(mpFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorText(data.mensagem || "Erro ao processar pagamento.");
        throw new Error(data.mensagem);
      }

      // Extrai QR Code da resposta
      const txData = data?.point_of_interaction?.transaction_data;
      if (txData?.qr_code_base64) {
        setPixQrBase64(txData.qr_code_base64);
        setPixQrText(txData.qr_code || '');
        setPixPaymentId(String(data.id));
        setPixStep('qrcode');
      } else {
        setErrorText('QR Code não disponível. Status: ' + data.status);
      }

      return data;
    } catch (error: any) {
      setErrorText(error.message || "Falha na comunicação.");
      throw error;
    }
  };

  // Poll status after QR shown
  useEffect(() => {
    if (pixStep !== 'qrcode' || !pixPaymentId || !pixEtiquetaId) return;
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('facility_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/pix/status/${pixEtiquetaId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const statusData = await res.json();
          if (statusData.pagamentoStatus === 'Pago') {
            clearInterval(interval);
            setPixStep('confirmed');
            await fetchEtiquetaPdf(pixEtiquetaId ?? '', geradoEtiquetaData?.codigoObjeto || '');
          }
        }
      } catch (e) { /* silent */ }
    }, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixStep, pixPaymentId, pixEtiquetaId]);

  return (
    <div className="max-w-6xl space-y-6 pb-8">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          Emissão de Pré-Postagem
        </h2>
        <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Preencha os dados completos para gerar a etiqueta oficial.
        </p>
      </div>

      <div className="flex gap-6 relative items-start">
        {/* Formulário Principal */}
        <div className={`flex-1 p-8 rounded-2xl border shadow-sm ${isDark ? "bg-[#121620] border-slate-800/80" : "bg-white border-slate-200"}`}>

          {errorText && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm font-semibold">
              <AlertCircle size={18} /> {errorText}
            </div>
          )}

          {/* Stepper Horizontal Header */}
          <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'}`}>1</div>
              <span className={`text-xs font-bold mt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Endereços</span>
            </div>
            <div className={`flex-1 h-1 mx-4 rounded-full ${currentStep >= 2 ? 'bg-blue-600' : isDark ? 'bg-slate-800' : 'bg-slate-200'} transition-colors duration-500`}></div>
            
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'}`}>2</div>
              <span className={`text-xs font-bold mt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Dimensões &amp; Conteúdo</span>
            </div>
            <div className={`flex-1 h-1 mx-4 rounded-full ${currentStep >= 3 ? 'bg-blue-600' : isDark ? 'bg-slate-800' : 'bg-slate-200'} transition-colors duration-500`}></div>
            
            <div className={`flex flex-col items-center ${currentStep >= 3 ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= 3 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'}`}>3</div>
              <span className={`text-xs font-bold mt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Gerar Envio</span>
            </div>
          </div>

          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>

            {/* PASSO 1: ENDEREÇOS E CLIENTES */}
            {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 flex flex-col sm:flex-row gap-2 border p-1 rounded-xl w-fit relative bg-slate-900/5 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSenderMode("fixed")}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${senderMode === "fixed" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  Endereço Fixo (Ponto)
                </button>
                <button
                  type="button"
                  onClick={() => setSenderMode("existing")}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${senderMode === "existing" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  Cliente Cadastrado
                </button>
                <button
                  type="button"
                  onClick={() => setSenderMode("new")}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${senderMode === "new" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  Novo Cliente
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* Remetente Lógica */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b pb-2 border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">1</div>
                  <h3 className={`font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}>Remetente</h3>
                </div>

                {senderMode === "fixed" && fixedPonto && (
                  <div className={`p-4 rounded-xl border border-dashed text-sm flex flex-col gap-2 transition-all ${isDark ? "bg-blue-500/5 border-blue-500/20 text-slate-400" : "bg-blue-50 border-blue-200 text-blue-800"}`}>
                    <p className="font-bold flex items-center gap-2"><CheckCircle2 size={16} /> {fixedPonto.nome}</p>
                    <p>{fixedPonto.endereco?.logradouro}, {fixedPonto.endereco?.numero} - {fixedPonto.endereco?.cidade}, {fixedPonto.endereco?.uf}</p>
                    <p>CNPJ: {fixedPonto.cnpj}</p>
                  </div>
                )}

                {senderMode === "existing" && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search size={18} className={`absolute left-3 top-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <input
                        type="search"
                        placeholder="Buscar cliente por nome ou CPF..."
                        value={clientSearchText}
                        onChange={(e) => setClientSearchText(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm font-semibold transition-all ${isDark ? 'bg-[#0B0E14] border-slate-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                      />
                    </div>

                    {clientSearchResults.length > 0 && !selectedClient && (
                      <div className={`border rounded-xl max-h-48 overflow-y-auto ${isDark ? 'border-slate-800 bg-[#121620]' : 'border-slate-200 bg-white shadow-lg absolute z-10 w-full left-0 max-w-sm ml-8 mt-14'}`}>
                        {clientSearchResults.map((cl) => (
                          <div
                            key={cl._id}
                            onClick={() => { setSelectedClient(cl); setClientSearchResults([]); setClientSearchText(cl.nome); }}
                            className={`px-4 py-3 cursor-pointer border-b last:border-0 hover:bg-blue-500/10 ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-700'}`}
                          >
                            <p className="font-bold text-sm">{cl.nome}</p>
                            <p className="text-xs opacity-70 mt-0.5">{cl.cpfCnpj}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedClient && (
                      <div className={`p-4 rounded-xl border border-dashed text-sm flex items-center justify-between transition-all ${isDark ? "bg-emerald-500/5 border-emerald-500/20 text-slate-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"}`}>
                        <div>
                          <p className="font-bold flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> {selectedClient.nome}</p>
                          <p className="mt-1 opacity-80">{selectedClient.cpfCnpj}</p>
                        </div>
                        <button type="button" onClick={() => { setSelectedClient(null); setClientSearchText(""); }} className="text-xs font-bold underline opacity-70 hover:opacity-100">
                          Trocar
                        </button>
                      </div>
                    )}
                    {!selectedClient && clientSearchText.length === 0 && (
                      <div className={`p-4 rounded-xl border border-dashed text-sm text-center ${isDark ? 'bg-[#0B0E14] border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                        Selecione um cliente para carregar os dados...
                      </div>
                    )}
                  </div>
                )}

                {senderMode === "new" && (
                  <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                    <InputField label="Nome Completo" placeholder="Ex: João Exemplo" isDark={isDark} value={formData.remetente.nome} onChange={(e: any) => handleInputChange("remetente", "nome", e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="CPF / CNPJ" placeholder="000.000..." isDark={isDark} value={formData.remetente.cpfCnpj} onChange={(e: any) => handleInputChange("remetente", "cpfCnpj", e.target.value)} />
                      <InputField label="Telefone" placeholder="(00)..." isDark={isDark} value={formData.remetente.telefone} onChange={(e: any) => handleInputChange("remetente", "telefone", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <InputField label="CEP" placeholder="00000-000" isDark={isDark} value={formData.remetente.endereco.cep} onChange={(e: any) => handleInputChange("remetenteEndereco", "cep", e.target.value)} />
                      <InputField label="Logradouro" placeholder="Rua..." isDark={isDark} value={formData.remetente.endereco.logradouro} onChange={(e: any) => handleInputChange("remetenteEndereco", "logradouro", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <InputField label="Nº" placeholder="Ex: 10" isDark={isDark} value={formData.remetente.endereco.numero} onChange={(e: any) => handleInputChange("remetenteEndereco", "numero", e.target.value)} />
                      <InputField label="Bairro" placeholder="Bairro" isDark={isDark} value={formData.remetente.endereco.bairro} onChange={(e: any) => handleInputChange("remetenteEndereco", "bairro", e.target.value)} />
                      <InputField label="Cidade" placeholder="SP" isDark={isDark} value={formData.remetente.endereco.cidade} onChange={(e: any) => handleInputChange("remetenteEndereco", "cidade", e.target.value)} />
                      <InputField label="UF" placeholder="SP" isDark={isDark} value={formData.remetente.endereco.uf} onChange={(e: any) => handleInputChange("remetenteEndereco", "uf", e.target.value)} />
                    </div>
                  </div>
                )}

              </div>

              {/* Destinatário */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b pb-2 border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">2</div>
                  <h3 className={`font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}>Destinatário</h3>
                </div>
                <InputField label="Nome Completo" placeholder="Ex: João da Silva" isDark={isDark} value={formData.destinatario.nome} onChange={(e: any) => handleInputChange("destinatario", "nome", e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="CPF / CNPJ" placeholder="000.000.000-00" isDark={isDark} value={formData.destinatario.cpfCnpj} onChange={(e: any) => handleInputChange("destinatario", "cpfCnpj", e.target.value)} />
                  <InputField label="Telefone" placeholder="(00) 00000-0000" isDark={isDark} value={formData.destinatario.telefone} onChange={(e: any) => handleInputChange("destinatario", "telefone", e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <InputField label="CEP" placeholder="00000-000" isDark={isDark} value={formData.destinatario.endereco.cep} onChange={(e: any) => handleInputChange("destinatarioEndereco", "cep", e.target.value)} />
                  <div className="col-span-2">
                    <InputField label="Logradouro" placeholder="Rua exemplo..." isDark={isDark} value={formData.destinatario.endereco.logradouro} onChange={(e: any) => handleInputChange("destinatarioEndereco", "logradouro", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <InputField label="Nº" placeholder="Ex: 250" isDark={isDark} value={formData.destinatario.endereco.numero} onChange={(e: any) => handleInputChange("destinatarioEndereco", "numero", e.target.value)} />
                  <InputField label="Bairro" placeholder="Bairro" isDark={isDark} value={formData.destinatario.endereco.bairro} onChange={(e: any) => handleInputChange("destinatarioEndereco", "bairro", e.target.value)} />
                  <InputField label="Cidade" placeholder="RJ" isDark={isDark} value={formData.destinatario.endereco.cidade} onChange={(e: any) => handleInputChange("destinatarioEndereco", "cidade", e.target.value)} />
                  <InputField label="UF" placeholder="RJ" isDark={isDark} value={formData.destinatario.endereco.uf} onChange={(e: any) => handleInputChange("destinatarioEndereco", "uf", e.target.value)} />
                </div>
              </div>
              </div> {/* <-- FECHA A GRID DO PASSO 1 */}
              
              {/* FINAL DO PASSO 1 */}
              <div className="pt-8 flex justify-end">
                  <button type="button" onClick={() => setCurrentStep(2)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors">Avançar para Pacote &amp; Conteúdo →</button>
              </div>
            </div>
            )}

            {/* PASSO 2: PACOTE E CONTEÚDO */}
            {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Pacote e Declaração */}
              <div className="space-y-5 lg:col-span-2">
                <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">3</div>
                    <h3 className={`font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}>Pacote &amp; Conteúdo</h3>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <InputField label="Larg. (cm)" placeholder="0" isDark={isDark} value={formData.larguraInformada} onChange={(e: any) => handleInputChange("root", "larguraInformada", e.target.value)} />
                  <InputField label="Alt. (cm)" placeholder="0" isDark={isDark} value={formData.alturaInformada} onChange={(e: any) => handleInputChange("root", "alturaInformada", e.target.value)} />
                  <InputField label="Comp. (cm)" placeholder="0" isDark={isDark} value={formData.comprimentoInformado} onChange={(e: any) => handleInputChange("root", "comprimentoInformado", e.target.value)} />
                  <InputField label="Peso (g)" placeholder="500" isDark={isDark} value={formData.pesoInformado} onChange={(e: any) => handleInputChange("root", "pesoInformado", e.target.value)} />
                </div>

                <div className={`p-4 rounded-xl border mt-2 ${isDark ? "bg-[#0B0E14] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? "text-slate-500" : "text-slate-500"}`}>Declaração de Conteúdo</h4>
                  <div className="space-y-4">
                    <InputField label="Descrição do Item principal" placeholder="Ex: Camiseta de Algodão" isDark={isDark} value={formData.itemConteudo} onChange={(e: any) => handleInputChange("root", "itemConteudo", e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Quantidade" placeholder="1" type="number" isDark={isDark} value={formData.itemQuantidade} onChange={(e: any) => handleInputChange("root", "itemQuantidade", e.target.value)} />
                      <InputField label="Valor Unitário (R$)" placeholder="50,00" isDark={isDark} value={formData.itemValor} onChange={(e: any) => handleInputChange("root", "itemValor", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FINAL DO PASSO 2 */}
              <div className="pt-8 flex justify-between items-center">
                  <button type="button" onClick={() => setCurrentStep(1)} className={`px-6 py-3 font-bold rounded-xl transition-colors ${isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}>← Voltar</button>
                  <button type="button" onClick={() => setCurrentStep(3)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors">Avançar para Seleção de Frete →</button>
              </div>
            </div>
            )}

            {/* PASSO 3: FRETE E FINALIZAÇÃO */}
            {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className={`flex flex-col items-center justify-center p-8 border rounded-2xl ${isDark ? "border-slate-800 bg-[#0B0E14]" : "border-slate-200 bg-slate-50"}`}>
                <h3 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>Selecione a Modalidade de Envio</h3>
                <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                  {/* Selecionar entre PAC e SEDEX */}
                  <div className="flex w-full border rounded-xl overflow-hidden border-slate-200 dark:border-slate-700 shadow-sm">
                    <button
                      type="button"
                      onClick={() => handleInputChange("root", "codigoServico", "03298")}
                      className={`flex-1 py-4 text-sm font-bold uppercase transition-all ${formData.codigoServico === "03298" ? "bg-amber-500 text-white scale-105 shadow-lg" : isDark ? "bg-[#121620] text-slate-400 hover:bg-slate-800" : "bg-white text-slate-500 hover:bg-slate-100"}`}
                    >
                      Correios PAC
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange("root", "codigoServico", "03220")}
                      className={`flex-1 py-4 text-sm font-bold uppercase transition-all ${formData.codigoServico === "03220" ? "bg-blue-600 text-white scale-105 shadow-lg" : isDark ? "bg-[#121620] text-slate-400 hover:bg-slate-800" : "bg-white text-slate-500 hover:bg-slate-100"}`}
                    >
                      Correios SEDEX
                    </button>
                  </div>

                  <div className={`w-full px-4 py-3 rounded-lg border flex items-center justify-center gap-3 ${isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200"}`}>
                    <input type="checkbox" id="av" checked={formData.avisoRecebimento} onChange={(e: any) => handleInputChange("root", "avisoRecebimento", e.target.checked)} className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                    <label htmlFor="av" className={`text-sm font-semibold cursor-pointer select-none ${isDark ? "text-blue-400" : "text-blue-700"}`}>Desejo Aviso de Recebimento (AR)</label>
                  </div>

                  {/* Exibição do Preço e Prazo Simulado */}
                  <div className={`w-full p-4 rounded-xl border ${isDark ? "bg-[#121620] border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                    {loadingPrice ? (
                      <div className="flex items-center justify-center py-4 gap-3 text-sm text-slate-500">
                        <Loader2 size={18} className="animate-spin" /> Consultando Preço e Prazo...
                      </div>
                    ) : (
                      <>
                        {Array.isArray(simulation) && simulation.filter(s => (formData.codigoServico === "03220" ? s.coProduto === "03220" : s.coProduto === "03298")).map((sim, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div>
                              <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Valor Estimado</p>
                              <div className="flex items-baseline gap-2">
                                <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>R$ {sim.pcFinal}</p>
                                {sim.custoParaUsuario && parseFloat(sim.pcFinal) > parseFloat(sim.custoParaUsuario) && (
                                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                    + R$ {(parseFloat(sim.pcFinal) - parseFloat(sim.custoParaUsuario)).toFixed(2)} Lucro
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Prazo</p>
                              <p className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{sim.prazoEntrega} dias úteis</p>
                            </div>
                          </div>
                        ))}
                        {(!Array.isArray(simulation) || simulation.length === 0) && !loadingPrice && <p className="text-center text-xs text-red-500 py-2">Não foi possível calcular o frete para estes dados.</p>}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t flex items-center justify-between border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setCurrentStep(2)} className={`px-6 py-3 font-bold rounded-xl transition-colors ${isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}>← Voltar</button>
                <button
                  onClick={handleGerarFlow}
                  disabled={isLoading}
                  className="px-10 min-w-[280px] flex justify-center items-center h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:scale-100 transition-all">
                  {isLoading ? <Loader2 size={24} className="animate-spin" /> : "Gerar Etiqueta & Resumo"}
                </button>
              </div>
            </div>
            )}
          </form>
        </div>

        {/* Painel Lateral com os Resultados (Etiqueta & QRCode) */}
        {(pdfUrl || qrCodeUrl || pixInfo || geradoEtiquetaData) && (
          <div className="w-[380px] flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500 sticky top-4">

            {/* Box PIX Mercado Pago */}
            {pixInfo && !pdfUrl && (
              <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-[#121620] border-amber-500/30" : "bg-white border-amber-200"}`}>
                <h3 className={`font-bold mb-2 text-center ${isDark ? "text-amber-400" : "text-amber-600"}`}>Pagamento de Tarifa</h3>

                {/* Step: Form (Brick) */}
                {pixStep === 'form' && (
                  <>
                    <p className={`text-xs mb-4 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>A etiqueta oficial será liberada após a confirmação do PIX.</p>
                    <Payment
                      initialization={{ amount: pixValor }}
                      customization={{
                        paymentMethods: { bankTransfer: ["pix"] },
                        visual: { style: { theme: isDark ? 'dark' : 'default' } }
                      } as any}
                      onSubmit={onPaymentSubmit}
                      onReady={() => {}}
                      onError={(e: any) => setErrorText(e?.message || 'Erro no Brick')}
                    />
                  </>
                )}

                {/* Step: QR Code */}
                {pixStep === 'qrcode' && (
                  <div className="flex flex-col items-center gap-4">
                    <p className={`text-xs text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>Escaneie o QR Code com seu banco</p>
                    {pixQrBase64 && (
                      <div className="p-2 bg-white rounded-xl">
                        <img src={`data:image/png;base64,${pixQrBase64}`} alt="QR Code PIX" className="w-44 h-44" />
                      </div>
                    )}
                    <div className={`w-full p-3 rounded-xl border text-xs break-all flex items-center gap-2 ${isDark ? 'bg-[#0f111a] border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <span className="flex-1 line-clamp-3">{pixQrText}</span>
                      <button onClick={() => { navigator.clipboard.writeText(pixQrText); setPixCopied(true); setTimeout(() => setPixCopied(false), 3000); }} className="shrink-0">
                        {pixCopied ? <CheckCircle2 size={16} className="text-green-500" /> : <Search size={14} />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 size={13} className="animate-spin text-amber-500" />
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verificando pagamento…</p>
                    </div>
                  </div>
                )}

                {/* Step: Confirmed */}
                {pixStep === 'confirmed' && (
                  <div className="flex flex-col items-center gap-3 py-4 text-center">
                    <CheckCircle2 size={44} className="text-green-500" />
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Pagamento confirmado!</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gerando etiqueta…</p>
                  </div>
                )}
              </div>
            )}

            {/* Box Etiqueta */}
            {pdfUrl && (
              <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? "bg-[#121620] border-slate-800/80" : "bg-white border-slate-200"}`}>
                <h3 className={`font-bold mb-3 ${isDark ? "text-slate-200" : "text-slate-700"}`}>Etiqueta de Envio</h3>
                <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <object data={pdfUrl} type="application/pdf" className="w-full h-full">
                    <p className="p-4 text-xs">Seu navegador não suporta view de PDF in-line. <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-blue-500">Baixar PDF</a></p>
                  </object>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      const win = window.open(pdfUrl, '_blank');
                      win?.addEventListener('load', () => win.print());
                    }}
                    className={`flex-1 py-2 flex justify-center items-center gap-2 text-sm font-bold border rounded-lg transition-colors ${
                      isDark ? 'border-blue-500/40 hover:bg-blue-600/20 text-blue-400' : 'border-blue-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
                    }`}
                  >
                    <Printer size={16} /> Imprimir Etiqueta
                  </button>
                  <a
                    href={pdfUrl}
                    download="etiqueta_correios.pdf"
                    className={`flex-1 py-2 flex justify-center items-center gap-2 text-sm font-bold border rounded-lg transition-colors ${
                      isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Download size={16} /> Baixar PDF
                  </a>
                </div>
              </div>
            )}

            {/* Box DCe */}
            {qrCodeUrl && (
              <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? "bg-[#121620] border-slate-800/80" : "bg-white border-slate-200"}`}>
                <h3 className={`font-bold mb-3 ${isDark ? "text-slate-200" : "text-slate-700"}`}>DCe (Declaração Conteúdo)</h3>
                <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrCodeUrl)}`} alt="QRCode DACE" className="w-[140px] h-[140px]" />
                </div>
              </div>
            )}
            
            {/* Box Recibo */}
            {geradoEtiquetaData && (
              <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? "bg-[#121620] border-slate-800/80" : "bg-emerald-50 border-emerald-200"}`}>
                <h3 className={`font-bold mb-3 ${isDark ? "text-slate-200" : "text-emerald-700"}`}>Comprovante Final</h3>
                <p className={`text-xs mb-3 ${isDark ? "text-slate-400" : "text-emerald-600"}`}>Gere o recibo do cliente para impressão na térmica ou envio por WhatsApp.</p>
                <button onClick={() => setShowRecibo(true)} className={`w-full py-3 flex justify-center items-center gap-2 text-sm font-bold border rounded-lg transition-colors ${isDark ? 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' : 'border-emerald-300 bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20'}`}>
                  <Receipt size={18} /> Ver Recibo Cliente
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showRecibo && geradoEtiquetaData && (
        <ViewReciboModal 
          etiqueta={geradoEtiquetaData}
          pontoColetaNome={pontoColetaNome}
          onClose={() => setShowRecibo(false)}
        />
      )}
    </div>
  );
}
