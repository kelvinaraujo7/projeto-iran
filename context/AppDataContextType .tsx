"use client";
import React, { createContext, useContext, useState } from "react";
import { set } from "react-hook-form";

// Adicione aqui os nomes dos arrays e as estruturas dos objetos
type Guiche = { id: number; name: string; status: string };
type State = { id: number; name: string; abbreviation: string; active: string };
type Unit = { id: number; name: string; companyType: string; active: boolean };
type Person = { id: number; name: string; cpf: string };
type Ticket = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
};
type Department = {
  id: number;
  name: string;
  exceptionDay: string;
  startServiceMorning?: string;
  endServiceMorning?: string;
  startServiceAfternoon?: string;
  endServiceAfternoon?: string;
  status: string;
};
type Video = {
  id: string;
  description: string;
  url: string;
  order: number;
  active: string;
};
type Holiday = { id: string; name: string; dayoff: Date; active: string; };
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

  departments: Department[];
  adicionarDepartment: (d: Department) => void;
  editarDepartment: (id: number, dados: Partial<Department>) => void;
  excluirDepartment: (id: number) => void;

  videos: Video[];
  adicionarVideo: (v: Video) => void;
  editarVideo: (id: string, dados: Partial<Video>) => void;
  excluirVideo: (id: string) => void;

  holidays: Holiday[];
  adicionarHoliday: (v: Holiday) => void;
  editarHoliday: (id: string, dados: Partial<Holiday>) => void;
  excluirHoliday: (id: string) => void;
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

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
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...dados } : u)));
  }
  function excluirUnit(id: number) {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  }

  function adicionarPerson(p: Person) {
    setPersons((prev) => [...prev, p]);
  }
  function editarPerson(id: number, dados: Partial<Person>) {
    setUnits((prev) => prev.map((p) => (p.id === id ? { ...p, ...dados } : p)));
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

  function adicionarDepartment(d: Department) {
    setDepartments((prev) => [...prev, d]);
  }
  function editarDepartment(id: number, dados: Partial<Department>) {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...dados } : d))
    );
  }
  function excluirDepartment(id: number) {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  }

  function adicionarVideo(v: Video) {
    setVideos((prev) => [...prev, v]);
  }
  function editarVideo(id: string, dados: Partial<Video>) {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...dados } : v))
    );
  }
  function excluirVideo(id: string) {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }

  function adicionarHoliday(h: Holiday) {
    setHolidays((prev) => [...prev, h]);
  }
  function editarHoliday(id: string, dados: Partial<Holiday>) {
    setHolidays((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...dados } : h))
    );
  }
  function excluirHoliday(id: string) {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
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
        departments,
        adicionarDepartment,
        editarDepartment,
        excluirDepartment,
        videos,
        adicionarVideo,
        editarVideo,
        excluirVideo,
        holidays,
        adicionarHoliday,
        editarHoliday,
        excluirHoliday,
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
