import { createContext, useContext, useState, type ReactNode } from "react";
import * as M from "./mock-data";

type AgentConfig = {
  serviceClient: { tone: string; escalationDelay: number; escalationUnit: string; languages: string[]; hoursFrom: string; hoursTo: string };
  community: { objectives: string[]; frequency: Record<M.SocialChannel, string>; tone: string; captionLength: number; imagesPerPost: number };
  prospection: { sectors: string[]; sources: Record<string, boolean>; followUpFrequency: string; firstFollowUpDelay: number };
  interne: { accountingCategories: string[]; recruitmentSteps: string[]; employeeFields: string[] };
};

type SocialSettings = Record<M.SocialChannel, { connected: boolean; account: string; frequency: string; tone: string; imagesPerPost: number }>;

type Store = {
  // conversations
  conversations: M.Conversation[]; setConversations: (v: M.Conversation[]) => void;
  // tickets
  tickets: M.Ticket[]; setTickets: (v: M.Ticket[]) => void;
  // KB
  kb: M.KBArticle[]; setKb: (v: M.KBArticle[]) => void;
  // posts
  posts: M.Post[]; setPosts: (v: M.Post[]) => void;
  // leads + follow-ups
  leads: M.Lead[]; setLeads: (v: M.Lead[]) => void;
  followUps: M.FollowUpRule[]; setFollowUps: (v: M.FollowUpRule[]) => void;
  followUpLogs: M.FollowUpLog[];
  // employees / workers / invoices
  employees: M.Employee[]; setEmployees: (v: M.Employee[]) => void;
  workers: M.Worker[]; setWorkers: (v: M.Worker[]) => void;
  invoices: M.Invoice[]; setInvoices: (v: M.Invoice[]) => void;
  // recruitment
  jobs: M.JobPosting[]; setJobs: (v: M.JobPosting[]) => void;
  candidates: M.Candidate[]; setCandidates: (v: M.Candidate[]) => void;
  // admin
  users: M.UserAccount[]; setUsers: (v: M.UserAccount[]) => void;
  integrations: M.Integration[]; setIntegrations: (v: M.Integration[]) => void;
  notifications: M.Notification[]; setNotifications: (v: M.Notification[]) => void;
  agentConfig: AgentConfig; setAgentConfig: (v: AgentConfig) => void;
  socialSettings: SocialSettings; setSocialSettings: (v: SocialSettings) => void;
};

const defaultConfig: AgentConfig = {
  serviceClient: { tone: "professionnelle", escalationDelay: 10, escalationUnit: "minutes", languages: ["Français", "Arabe", "Anglais"], hoursFrom: "08:00", hoursTo: "20:00" },
  community: { objectives: ["Notoriété", "Génération de leads"], frequency: { linkedin: "3x/semaine", facebook: "hebdomadaire", instagram: "quotidien" }, tone: "inspirante", captionLength: 180, imagesPerPost: 2 },
  prospection: { sectors: ["Distribution", "Hôtellerie", "BTP", "Retail"], sources: { "Site web": true, "WhatsApp": true, "LinkedIn": true, "Salons": false, "Recommandations": true }, followUpFrequency: "hebdomadaire", firstFollowUpDelay: 3 },
  interne: { accountingCategories: ["Achats", "Ventes", "Salaires", "Charges"], recruitmentSteps: ["Candidature reçue", "Présélection", "Entretien", "Offre", "Décision"], employeeFields: ["Nom", "Poste", "Département", "Manager", "Salaire"] },
};

const defaultSocial: SocialSettings = {
  linkedin: { connected: true, account: "@SunlightTechnologies", frequency: "3x/semaine", tone: "professionnelle", imagesPerPost: 2 },
  facebook: { connected: true, account: "Sunlight Maroc", frequency: "hebdomadaire", tone: "décontractée", imagesPerPost: 3 },
  instagram: { connected: false, account: "—", frequency: "quotidien", tone: "inspirante", imagesPerPost: 4 },
};

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState(M.initialConversations);
  const [tickets, setTickets] = useState(M.initialTickets);
  const [kb, setKb] = useState(M.initialKB);
  const [posts, setPosts] = useState(M.initialPosts);
  const [leads, setLeads] = useState(M.initialLeads);
  const [followUps, setFollowUps] = useState(M.initialFollowUps);
  const [followUpLogs] = useState(M.initialFollowUpLogs);
  const [employees, setEmployees] = useState(M.initialEmployees);
  const [workers, setWorkers] = useState(M.initialWorkers);
  const [invoices, setInvoices] = useState(M.initialInvoices);
  const [jobs, setJobs] = useState(M.initialJobs);
  const [candidates, setCandidates] = useState(M.initialCandidates);
  const [users, setUsers] = useState(M.initialUsers);
  const [integrations, setIntegrations] = useState(M.initialIntegrations);
  const [notifications, setNotifications] = useState(M.initialNotifications);
  const [agentConfig, setAgentConfig] = useState(defaultConfig);
  const [socialSettings, setSocialSettings] = useState(defaultSocial);

  return (
    <Ctx.Provider value={{
      conversations, setConversations, tickets, setTickets, kb, setKb, posts, setPosts,
      leads, setLeads, followUps, setFollowUps, followUpLogs, employees, setEmployees,
      workers, setWorkers, invoices, setInvoices, jobs, setJobs, candidates, setCandidates,
      users, setUsers, integrations, setIntegrations, notifications, setNotifications,
      agentConfig, setAgentConfig, socialSettings, setSocialSettings,
    }}>{children}</Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be inside AppStoreProvider");
  return ctx;
}
