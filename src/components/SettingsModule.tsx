import React from "react";
import { Settings } from "lucide-react";
import { Project } from "../types";

interface SettingsModuleProps {
  project: Project;
  onUpdateProject?: (project: Project) => void;
}

export default function SettingsModule({ project, onUpdateProject }: SettingsModuleProps) {
  return (
    <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
      <div className="border-b border-zinc-850 pb-4">
        <h3 className="text-sm font-mono uppercase text-red-500 font-bold flex items-center gap-2">
          <Settings size={15} />
          CONFIGURAÇÕES DO PROJETO NEXUS
        </h3>
        <p className="text-xs text-zinc-500 font-medium">
          Controles operacionais e de identidade de seu lançamento ativo.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Nome do Lançamento / Produto</label>
          <input
            type="text"
            value={project.name}
            onChange={(e) => {
              if (onUpdateProject) {
                onUpdateProject({ ...project, name: e.target.value });
              }
            }}
            className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Nicho de Mercado</label>
          <input
            type="text"
            value={project.niche}
            onChange={(e) => {
              if (onUpdateProject) {
                onUpdateProject({ ...project, niche: e.target.value });
              }
            }}
            className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Objetivo Comercial</label>
          <textarea
            value={project.objective}
            onChange={(e) => {
              if (onUpdateProject) {
                onUpdateProject({ ...project, objective: e.target.value });
              }
            }}
            rows={3}
            className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none transition-all font-medium resize-none leading-relaxed"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-850 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
        <span>ID DO PROJETO: #{project.id}</span>
        <span>STATUS DE SERVIDOR: ONLINE</span>
      </div>
    </div>
  );
}
