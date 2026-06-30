import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, Lock, User, ShieldCheck, ArrowRight, Database, Info } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../supabaseClient";

interface AuthProps {
  onSuccess: (name: string, email: string) => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError("Por favor preencha todos os campos.");
      return;
    }
    setError("");
    setSuccessMessage("");

    if (!isSupabaseConfigured) {
      // Mock persistence if Supabase keys are not set yet
      onSuccess(isLogin ? (name || email.split("@")[0] || "Usuário") : name, email);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (authError) throw authError;
        
        if (data.user) {
          const userMetadata = data.user.user_metadata || {};
          const displayName = userMetadata.name || email.split("@")[0] || "Usuário";
          onSuccess(displayName, email);
        }
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name
            }
          }
        });
        if (authError) throw authError;

        if (data.user) {
          // Check if confirmation is required or if we are immediately logged in
          if (data.session) {
            onSuccess(name, email);
          } else {
            setSuccessMessage("Conta criada! Verifique sua caixa de entrada para confirmar seu e-mail.");
            setIsLogin(true);
          }
        }
      }
    } catch (err: any) {
      console.warn("Erro na autenticação Supabase:", err);
      setError(err.message || "Ocorreu um erro ao processar sua solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-page" className="min-h-screen flex flex-col items-center justify-center bg-nexus-black px-4 py-12 select-none relative overflow-hidden">
      {/* Background elegant accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.03)_0,transparent_60%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-nexus-card border border-nexus-border p-8 md:p-10 shadow-2xl relative rounded-2xl"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0F0F12]/90 border border-nexus-border shadow-[0_0_20px_rgba(255,31,61,0.25)] mb-4 overflow-hidden relative">
            <img 
              src="https://i.ibb.co/S44NnLMD/content.png" 
              alt="NEXUS Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-110 mix-blend-screen"
            />
          </div>
          <h1 className="font-display text-3xl tracking-tighter font-black text-white mb-1">
            NEXUS
          </h1>
          <p className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase">
            Plataforma Exclusiva de Lançamentos de Ebooks
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-nexus-border mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(""); setSuccessMessage(""); }}
            className={`flex-1 pb-3 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
              isLogin 
                ? "text-nexus-red border-b-2 border-nexus-red" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            disabled={loading}
          >
            Acessar Conta
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(""); setSuccessMessage(""); }}
            className={`flex-1 pb-3 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
              !isLogin 
                ? "text-nexus-red border-b-2 border-nexus-red" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            disabled={loading}
          >
            Cadastrar-se
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-400 text-xs text-center font-medium">
            {successMessage}
          </div>
        )}

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">Nome Completo</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <User size={15} />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full pl-10 pr-4 py-3.5 bg-nexus-black border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-all font-medium"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">E-mail Corporativo</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Mail size={15} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-3.5 bg-nexus-black border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-all font-medium"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">Senha Secreta</label>
              {isLogin && (
                <button type="button" className="text-[10px] text-nexus-red hover:underline hover:text-nexus-red-hover font-mono">
                  Esqueceu a senha?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Lock size={15} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha secreta"
                className="w-full pl-10 pr-4 py-3.5 bg-nexus-black border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-all font-medium"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-nexus-red hover:bg-nexus-red-hover text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-nexus-red/10 hover:shadow-nexus-red/20 cursor-pointer transition-all hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? "Acessar Workspace" : "Criar Minha Conta"}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security assurance */}
        <div className="mt-6 pt-6 border-t border-nexus-border flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono">
          <ShieldCheck size={13} className="text-nexus-red" />
          <span>Ambiente seguro criptografado com SSL</span>
        </div>
      </motion.div>
    </div>
  );
}

