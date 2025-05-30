"use client";
import React, { createContext, useContext, useState } from "react";

// Adicione aqui os nomes dos arrays e as estruturas dos objetos
type Guiche = { id: number; name: string; status: string };
type State = { id: number; name: string; abbreviation: string; active: string };
type Unit = { id: number; name: string; companyType: string; active: boolean };
type Person = { id: number; name: string; cpf: string };
type Ticket = { id: number; name: string; startDate: Date; endDate: Date, status: string };

// Define quais dados e funções estarão disponíveis no contexto
type AppDataContextType = {
  guiches: Guiche[];
  adicionarGuiche: (g: Guiche) => void;
  editarGuiche: (id: number, dados: Partial<Guiche>) => void;
  excluirGuiche: (id: number) => void;

  states: State[];
  adicionarState: (s: State) => void;
  editarState: (id: number, dados: Partial<State>) => void;
  excluirState: (id: number) => void;

  units: Unit[];
  adicionarUnit: (u: Unit) => void;
  editarUnit: (id: number, dados: Partial<Unit>) => void;
  excluirUnit: (id: number) => void;

  persons: Person[];
  adicionarPerson: (p: Person) => void;
  editarPerson: (id: number, dados: Partial<Person>) => void;
  excluirPerson: (id: number) => void;

  tickets: Ticket[];
  adicionarTicket: (t: Ticket) => void;
  editarTicket: (id: number, dados: Partial<Ticket>) => void;
  excluirTicket: (id: number) => void;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  // Adicione aqui os estados iniciais dos arrays, exemplo:
  // -> guiches: Guiche[] array de objetos
  // -> setGuiches: Função para atualizar o estado dos guiches
  const [guiches, setGuiches] = useState<Guiche[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

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


  function adicionarState(s: State) {
    setStates((prev) => [...prev, s]);
  }
  function editarState(id: number, dados: Partial<State>) {
    setStates((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...dados } : s))
    );
  }
  function excluirState(id: number) {
    setStates((prev) => prev.filter((s) => s.id !== id));
  }
  

  function adicionarUnit(u: Unit) {
    setUnits((prev) => [...prev, u]);
  }
  function editarUnit(id: number, dados: Partial<Unit>) {
    setUnits((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...dados } : u))
    );
  }
  function excluirUnit(id: number) {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  }

   function adicionarPerson(p: Person) {
    setPersons((prev) => [...prev, p]);
  }
  function editarPerson(id: number, dados: Partial<Person>) {
    setUnits((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...dados } : p))
    );
  }
  function excluirPerson(id: number) {
    setPersons((prev) => prev.filter((p) => p.id !== id));
  }


   function adicionarTicket(t: Ticket) {
    setTickets((prev) => [...prev, t]);
  }
  function editarTicket(id: number, dados: Partial<Ticket>) {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...dados } : t))
    );
  }
  function excluirTicket(id: number) {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  }


  return (
    // Adicione ao "value" para que os dados e funções estejam disponíveis
    <AppDataContext.Provider
      value={{
        guiches,
        adicionarGuiche,
        editarGuiche,
        excluirGuiche,
        units,
        adicionarUnit,
        editarUnit,
        excluirUnit,
        states,
        adicionarState,
        editarState,
        excluirState,
        persons,
        adicionarPerson,
        editarPerson,
        excluirPerson,
        tickets,
        adicionarTicket,
        editarTicket,
        excluirTicket,
      }}
          
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
