"use client";
import React, { createContext, useContext, useState } from "react";

// Adicione aqui os nomes dos arrays e as estruturas dos objetos
type Guiche = { id: number; name: string; status: string };

// Define quais dados e funções estarão disponíveis no contexto
type AppDataContextType = {
  guiches: Guiche[];
  adicionarGuiche: (g: Guiche) => void;
  editarGuiche: (id: number, dados: Partial<Guiche>) => void;
  excluirGuiche: (id: number) => void;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  
  // Adicione aqui os estados iniciais dos arrays, exemplo:
  // -> guiches: Guiche[] array de objetos
  // -> setGuiches: Função para atualizar o estado dos guiches
  const [guiches, setGuiches] = useState<Guiche[]>([]);

  // Funções para manipular os dados

  function adicionarGuiche(g: Guiche) {
    setGuiches((prev) => [...prev, g]);
  }
  function editarGuiche(id: number, dados: Partial<Guiche>) {
    setGuiches((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...dados } : g))
    );
  }
  function excluirGuiche(id: number) {
    setGuiches((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    // Adicione ao "value" para que os dados e funções estejam disponíveis
    <AppDataContext.Provider value={{ 
      guiches, adicionarGuiche, editarGuiche, excluirGuiche
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}