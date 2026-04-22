import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Save, MapPin, Loader2, User } from 'lucide-react';

interface ViewConfigModalProps {
  onClose: () => void;
  isDark: boolean;
  onSaved: (newData: any) => void;
}

export default function ViewConfigModal({ onClose, isDark, onSaved }: ViewConfigModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingCep, setFetchingCep] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fotoPerfil: '',
    nomePonto: '',
    cpf: '',
    telefonePonto: '',
    enderecoPonto: {
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      uf: ''
    }
  });

  useEffect(() => {
    // Carregar dados atuais do usuário logado
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem('facility_token');
        const res = await fetch('http://localhost:3000/auth/me', {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            fotoPerfil: data.fotoPerfil || '',
            nomePonto: data.nomePonto || data.nome || '',
            cpf: data.cpf || '',
            telefonePonto: data.telefonePonto || data.telefone || '',
            enderecoPonto: {
              cep: data.enderecoPonto?.cep || '',
              logradouro: data.enderecoPonto?.logradouro || '',
              numero: data.enderecoPonto?.numero || '',
              bairro: data.enderecoPonto?.bairro || '',
              cidade: data.enderecoPonto?.cidade || '',
              uf: data.enderecoPonto?.uf || ''
            }
          });
        }
      } catch (err) {
        console.error("Erro ao buscar perfil", err);
      }
    };
    fetchPerfil();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEnderecoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      enderecoPonto: { ...prev.enderecoPonto, [field]: value }
    }));
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let cep = e.target.value.replace(/\D/g, '');
    handleEnderecoChange('cep', cep);
    
    if (cep.length === 8) {
      setFetchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          handleEnderecoChange('logradouro', data.logradouro);
          handleEnderecoChange('bairro', data.bairro);
          handleEnderecoChange('cidade', data.localidade);
          handleEnderecoChange('uf', data.uf);
        }
      } catch (err) {
        console.error("Erro ViaCEP:", err);
      } finally {
        setFetchingCep(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, fotoPerfil: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('facility_token');
      const res = await fetch('http://localhost:3000/auth/perfil', {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const result = await res.json();
        onSaved(result.usuario);
        onClose();
      } else {
        alert("Falha ao salvar perfil.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 border shadow-2xl flex flex-col relative ${isDark ? 'bg-[#121620] border-slate-800' : 'bg-white border-slate-200'}`}>
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors z-10">
          <X size={20} />
        </button>

        <h2 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Configurações da Loja</h2>

        <div className="space-y-8">
          
          {/* Foto de Perfil */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className={`w-28 h-28 rounded-full overflow-hidden border-4 flex items-center justify-center ${isDark ? 'border-slate-800 bg-slate-800' : 'border-slate-100 bg-slate-100'}`}>
                {formData.fotoPerfil ? (
                  <img src={formData.fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-slate-400" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <p className={`text-xs mt-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Clique para alterar a foto (Máx 2MB)</p>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Nome do Ponto de Coleta</label>
              <input 
                type="text" 
                value={formData.nomePonto}
                onChange={(e) => handleInputChange('nomePonto', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border outline-none font-medium transition-colors ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'}`} 
                placeholder="Ex: Minha Loja Store"
              />
            </div>
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>CPF / CNPJ</label>
              <input 
                type="text" 
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value.replace(/\D/g, ''))}
                className={`w-full px-4 py-3 rounded-xl border outline-none font-medium transition-colors ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'}`} 
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>WhatsApp Contato</label>
              <input 
                type="text" 
                value={formData.telefonePonto}
                onChange={(e) => handleInputChange('telefonePonto', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border outline-none font-medium transition-colors ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'}`} 
                placeholder="21987654321"
              />
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <MapPin size={16} /> Endereço de Remetente (Fixo)
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>CEP</label>
                  <input 
                    type="text" 
                    value={formData.enderecoPonto.cep}
                    onChange={handleCepChange}
                    maxLength={8}
                    className={`w-full px-4 py-3 rounded-xl border outline-none font-medium transition-colors ${fetchingCep ? 'opacity-50' : ''} ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'}`} 
                    placeholder="00000000"
                  />
                </div>
                <div className="col-span-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Logradouro</label>
                  <input 
                    type="text" 
                    value={formData.enderecoPonto.logradouro}
                    onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none font-medium transition-colors ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'}`} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Nº</label>
                  <input 
                    type="text" 
                    value={formData.enderecoPonto.numero}
                    onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none font-medium transition-colors ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'}`} 
                  />
                </div>
                <div className="col-span-1">
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Bairro</label>
                  <input 
                    type="text" 
                    value={formData.enderecoPonto.bairro}
                    onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none font-medium transition-colors ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'}`} 
                  />
                </div>
                <div className="col-span-1">
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Cidade</label>
                  <input 
                    type="text" 
                    value={formData.enderecoPonto.cidade}
                    onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none font-medium transition-colors ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'}`} 
                  />
                </div>
                <div className="col-span-1">
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>UF</label>
                  <input 
                    type="text" 
                    value={formData.enderecoPonto.uf}
                    onChange={(e) => handleEnderecoChange('uf', e.target.value)}
                    maxLength={2}
                    className={`w-full px-4 py-3 rounded-xl border outline-none font-medium transition-colors uppercase ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'}`} 
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} 
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}
