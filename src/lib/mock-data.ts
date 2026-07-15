// Central mock data for the Sunlight back-office demo.
export type ID = string;

export type Channel = "whatsapp" | "web" | "email" | "phone" | "linkedin" | "facebook" | "instagram";
export type SocialChannel = "linkedin" | "facebook" | "instagram";
export type Priority = "urgent" | "normale" | "basse";
export type TicketStatus = "ouvert" | "en_cours" | "resolu";
export type PostStatus = "brouillon" | "planifie" | "publie";
export type LeadStage = "nouveau" | "contacte" | "qualifie" | "negociation" | "converti" | "perdu";
export type EmployeeStatus = "present" | "conge" | "absent";
export type InvoiceStatus = "payee" | "attente" | "retard";
export type InvoiceKind = "fournisseur" | "client";
export type UserRole = "admin" | "commercial" | "rh" | "support";
export type CandidateStage = "recue" | "preselection" | "entretien" | "offre" | "recrute" | "refuse";

export type Message = { id: ID; from: "client" | "ai" | "human"; text: string; at: string };
export type Conversation = {
  id: ID; contact: string; company: string; channel: "whatsapp" | "web";
  unread: number; escalated: boolean; lastAt: string;
  messages: Message[]; tags: string[]; orders: { ref: string; amount: number; date: string }[];
};

export type Ticket = {
  id: ID; client: string; subject: string; channel: Channel; priority: Priority;
  status: TicketStatus; assignee: string; updatedAt: string; description: string;
  history: { at: string; text: string }[]; internalNote?: string;
};

export type KBArticle = { id: ID; category: string; question: string; answer: string; usage: number; updatedAt: string; tags: string[] };

export type Post = {
  id: ID; title: string; caption: string; channels: SocialChannel[]; date: string; status: PostStatus;
  gradient: string; stats?: { likes: number; comments: number; shares: number; reach: number };
};

export type Lead = {
  id: ID; company: string; sector: string; contact: string; email: string; phone: string;
  channel: Channel; stage: LeadStage; amount: number; lastContact: string; owner: string;
  notes: string; nextAction: { date: string; text: string };
  history: { at: string; kind: "appel" | "email" | "message"; text: string }[];
};

export type FollowUpRule = { id: ID; name: string; channel: Channel; trigger: string; days: number; template: string; active: boolean };
export type FollowUpLog = { id: ID; lead: string; channel: Channel; at: string; status: "envoyee" | "ouverte" | "repondue" };

export type Employee = {
  id: ID; name: string; role: string; department: string; status: EmployeeStatus;
  hiredAt: string; email: string; phone: string; manager: string; salary: number;
  documents: { name: string; size: string }[];
  leaves: { from: string; to: string; type: string }[]; leavesRemaining: number;
};

export type Worker = {
  id: ID; name: string; agency: string; mission: string; contractStart: string; contractEnd: string;
  hourlyRate: number; hoursByDay: Record<number, number>;
};

export type Invoice = { id: ID; kind: InvoiceKind; number: string; party: string; amount: number; due: string; status: InvoiceStatus };

export type JobPosting = { id: ID; title: string; department: string; description: string };
export type Candidate = {
  id: ID; jobId: ID; name: string; source: string; appliedAt: string; rating: number; stage: CandidateStage;
  cvSummary: string; notes: string;
};

export type UserAccount = { id: ID; name: string; email: string; role: UserRole; active: boolean; lastLogin: string; avatarColor: string };

export type Integration = { id: ID; name: string; logo: string; connected: boolean; lastSync: string };

export type Notification = { id: ID; title: string; time: string; read: boolean; kind: "info" | "success" | "warning" };

// --------- Data ---------
const now = new Date();
const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => { const d = new Date(now); d.setDate(d.getDate() - n); return iso(d); };
const hoursAgo = (n: number) => { const d = new Date(now); d.setHours(d.getHours() - n); return iso(d); };
const minutesAgo = (n: number) => { const d = new Date(now); d.setMinutes(d.getMinutes() - n); return iso(d); };

export const initialConversations: Conversation[] = [
  { id: "c1", contact: "Youssef El Amrani", company: "Atlas Distribution", channel: "whatsapp", unread: 2, escalated: false, lastAt: minutesAgo(4), tags: ["distributeur", "MAD"], orders: [{ ref: "CMD-2044", amount: 48200, date: "2026-05-12" }],
    messages: [
      { id: "m1", from: "client", text: "Bonjour, quel est le délai de livraison pour la gamme LED 200W ?", at: minutesAgo(30) },
      { id: "m2", from: "ai", text: "Bonjour Youssef, la gamme LED industrielle 200W est disponible sous 5 à 7 jours ouvrés depuis notre entrepôt de Casablanca.", at: minutesAgo(29) },
      { id: "m3", from: "client", text: "Parfait, pouvez-vous m'envoyer un devis pour 120 unités ?", at: minutesAgo(4) },
    ] },
  { id: "c2", contact: "Nadia Berrada", company: "Immobilière Anfa", channel: "web", unread: 0, escalated: true, lastAt: hoursAgo(2), tags: ["prospect"], orders: [],
    messages: [
      { id: "m1", from: "client", text: "J'aimerais un rendez-vous avec un commercial.", at: hoursAgo(3) },
      { id: "m2", from: "human", text: "Bonjour Nadia, je vous appelle dans l'heure.", at: hoursAgo(2) },
    ] },
  { id: "c3", contact: "Karim Ouaziz", company: "Ouaziz & Fils", channel: "whatsapp", unread: 1, escalated: false, lastAt: hoursAgo(5), tags: ["SAV"], orders: [{ ref: "CMD-1998", amount: 12300, date: "2026-04-02" }], messages: [{ id: "m1", from: "client", text: "Un projecteur ne s'allume plus après 3 mois.", at: hoursAgo(5) }] },
  { id: "c4", contact: "Sara Idrissi", company: "Groupe Ménara", channel: "web", unread: 0, escalated: false, lastAt: hoursAgo(9), tags: ["devis"], orders: [], messages: [{ id: "m1", from: "client", text: "Avez-vous une offre pour éclairage extérieur de parking ?", at: hoursAgo(10) }, { id: "m2", from: "ai", text: "Oui, notre gamme extérieure IP66 est parfaite. Je vous transmets la brochure.", at: hoursAgo(9) }] },
  { id: "c5", contact: "Rachid Benali", company: "Cafés Moulay", channel: "whatsapp", unread: 0, escalated: false, lastAt: daysAgo(1), tags: ["client"], orders: [{ ref: "CMD-2001", amount: 5400, date: "2026-04-18" }], messages: [{ id: "m1", from: "client", text: "Merci pour la livraison rapide.", at: daysAgo(1) }] },
  { id: "c6", contact: "Fatima Zahra Alaoui", company: "Alaoui Retail", channel: "web", unread: 3, escalated: false, lastAt: minutesAgo(45), tags: ["new"], orders: [], messages: [{ id: "m1", from: "client", text: "Bonjour, je souhaite des infos tarifs.", at: minutesAgo(45) }] },
  { id: "c7", contact: "Omar Tahiri", company: "Tahiri Construction", channel: "whatsapp", unread: 0, escalated: true, lastAt: daysAgo(2), tags: ["chantier"], orders: [], messages: [{ id: "m1", from: "client", text: "Besoin urgent de 80 spots pour chantier.", at: daysAgo(2) }] },
  { id: "c8", contact: "Hicham Naciri", company: "Naciri Hôtellerie", channel: "web", unread: 0, escalated: false, lastAt: daysAgo(3), tags: ["hôtel"], orders: [{ ref: "CMD-1955", amount: 92000, date: "2026-03-10" }], messages: [{ id: "m1", from: "client", text: "Renouvellement gamme chambres ?", at: daysAgo(3) }] },
  { id: "c9", contact: "Amine Cherkaoui", company: "Cherkaoui SARL", channel: "whatsapp", unread: 0, escalated: false, lastAt: daysAgo(4), tags: [], orders: [], messages: [{ id: "m1", from: "client", text: "Catalogue 2026 dispo ?", at: daysAgo(4) }] },
  { id: "c10", contact: "Leila Fassi", company: "Fassi Design", channel: "web", unread: 0, escalated: false, lastAt: daysAgo(5), tags: ["design"], orders: [], messages: [{ id: "m1", from: "client", text: "Avez-vous des LED décoratives dorées ?", at: daysAgo(5) }] },
  { id: "c11", contact: "Younes Ait", company: "Ait Frères", channel: "whatsapp", unread: 1, escalated: false, lastAt: hoursAgo(7), tags: ["revendeur"], orders: [], messages: [{ id: "m1", from: "client", text: "Conditions revendeur svp.", at: hoursAgo(7) }] },
  { id: "c12", contact: "Meryem Chraibi", company: "Chraibi Group", channel: "web", unread: 0, escalated: false, lastAt: daysAgo(6), tags: [], orders: [], messages: [{ id: "m1", from: "client", text: "Facture manquante.", at: daysAgo(6) }] },
];

export const initialTickets: Ticket[] = [
  { id: "T1038", client: "Atlas Distribution", subject: "Retard de livraison CMD-2044", channel: "whatsapp", priority: "urgent", status: "ouvert", assignee: "Sofia M.", updatedAt: hoursAgo(1), description: "Client attend la livraison depuis 3 jours.", history: [{ at: hoursAgo(3), text: "Ticket créé" }] },
  { id: "T1039", client: "Immobilière Anfa", subject: "Demande de devis parking", channel: "web", priority: "normale", status: "en_cours", assignee: "Karim B.", updatedAt: hoursAgo(4), description: "Devis pour 40 luminaires extérieurs.", history: [{ at: daysAgo(1), text: "Ticket créé" }, { at: hoursAgo(4), text: "Devis en préparation" }] },
  { id: "T1040", client: "Groupe Ménara", subject: "Question technique IP66", channel: "email", priority: "basse", status: "resolu", assignee: "IA", updatedAt: daysAgo(1), description: "Info technique.", history: [{ at: daysAgo(2), text: "Créé" }, { at: daysAgo(1), text: "Résolu par IA" }] },
  { id: "T1041", client: "Cafés Moulay", subject: "Panne projecteur", channel: "phone", priority: "urgent", status: "en_cours", assignee: "Sofia M.", updatedAt: hoursAgo(6), description: "Client rappelle plusieurs pannes.", history: [{ at: hoursAgo(8), text: "Créé" }] },
  { id: "T1042", client: "Alaoui Retail", subject: "Info tarifs pro", channel: "web", priority: "normale", status: "resolu", assignee: "IA", updatedAt: hoursAgo(2), description: "Résolu automatiquement.", history: [{ at: hoursAgo(3), text: "Créé" }, { at: hoursAgo(2), text: "Résolu" }] },
  { id: "T1043", client: "Tahiri Construction", subject: "Commande urgente chantier", channel: "whatsapp", priority: "urgent", status: "ouvert", assignee: "Karim B.", updatedAt: hoursAgo(12), description: "Besoin de 80 spots sous 48h.", history: [{ at: daysAgo(1), text: "Créé" }] },
  { id: "T1044", client: "Naciri Hôtellerie", subject: "Renouvellement gamme", channel: "email", priority: "normale", status: "en_cours", assignee: "Yasmine H.", updatedAt: daysAgo(2), description: "Rendez-vous à planifier.", history: [{ at: daysAgo(3), text: "Créé" }] },
  { id: "T1045", client: "Fassi Design", subject: "LED décoratives sur mesure", channel: "web", priority: "basse", status: "ouvert", assignee: "IA", updatedAt: daysAgo(1), description: "Demande spéciale.", history: [{ at: daysAgo(1), text: "Créé" }] },
  { id: "T1046", client: "Ait Frères", subject: "Conditions revendeur", channel: "whatsapp", priority: "normale", status: "en_cours", assignee: "Karim B.", updatedAt: hoursAgo(9), description: "Demande de grille tarifaire.", history: [{ at: hoursAgo(10), text: "Créé" }] },
  { id: "T1047", client: "Chraibi Group", subject: "Facture manquante", channel: "email", priority: "normale", status: "ouvert", assignee: "Yasmine H.", updatedAt: daysAgo(3), description: "Facture à renvoyer.", history: [{ at: daysAgo(3), text: "Créé" }] },
  { id: "T1048", client: "Ouaziz & Fils", subject: "SAV projecteur 3 mois", channel: "whatsapp", priority: "urgent", status: "ouvert", assignee: "Sofia M.", updatedAt: hoursAgo(5), description: "Sous garantie, à remplacer.", history: [{ at: hoursAgo(6), text: "Créé" }] },
  { id: "T1049", client: "Cherkaoui SARL", subject: "Envoi catalogue 2026", channel: "web", priority: "basse", status: "resolu", assignee: "IA", updatedAt: daysAgo(2), description: "Catalogue PDF envoyé.", history: [{ at: daysAgo(2), text: "Créé" }, { at: daysAgo(2), text: "Résolu" }] },
  { id: "T1050", client: "Menara Industries", subject: "Bug widget site", channel: "web", priority: "urgent", status: "en_cours", assignee: "Karim B.", updatedAt: hoursAgo(1), description: "Widget chat ne se charge pas.", history: [{ at: hoursAgo(2), text: "Créé" }] },
  { id: "T1051", client: "Sofia Traiteur", subject: "Éclairage salle événementielle", channel: "phone", priority: "normale", status: "ouvert", assignee: "Yasmine H.", updatedAt: hoursAgo(20), description: "Demande devis 300 m².", history: [{ at: daysAgo(1), text: "Créé" }] },
  { id: "T1052", client: "Rabat Municipality", subject: "Appel d'offres public", channel: "email", priority: "urgent", status: "en_cours", assignee: "Karim B.", updatedAt: hoursAgo(3), description: "Dossier à préparer pour vendredi.", history: [{ at: daysAgo(2), text: "Créé" }] },
];

export const initialKB: KBArticle[] = [
  { id: "k1", category: "Produits", question: "Quelle est la durée de vie de vos LED industrielles ?", answer: "Nos LED industrielles ont une durée de vie moyenne de 50 000 heures.", usage: 142, updatedAt: daysAgo(3), tags: ["led", "durée"] },
  { id: "k2", category: "Produits", question: "Vos luminaires sont-ils IP66 ?", answer: "Oui, la gamme extérieure est certifiée IP66 pour tous milieux.", usage: 88, updatedAt: daysAgo(7), tags: ["ip", "extérieur"] },
  { id: "k3", category: "Tarifs & Devis", question: "Comment obtenir un devis ?", answer: "Vous pouvez demander un devis via le chat, par WhatsApp ou par email à devis@sunlight.ma.", usage: 210, updatedAt: daysAgo(2), tags: ["devis"] },
  { id: "k4", category: "Tarifs & Devis", question: "Quels sont vos délais de paiement ?", answer: "30 jours net pour les clients professionnels avec compte validé.", usage: 65, updatedAt: daysAgo(10), tags: ["paiement"] },
  { id: "k5", category: "Livraison", question: "Quels sont les délais de livraison ?", answer: "5 à 7 jours ouvrés depuis notre entrepôt de Casablanca partout au Maroc.", usage: 178, updatedAt: daysAgo(5), tags: ["livraison"] },
  { id: "k6", category: "Livraison", question: "Livrez-vous à l'international ?", answer: "Oui, sur devis, en Afrique de l'Ouest et Europe.", usage: 32, updatedAt: daysAgo(14), tags: ["international"] },
  { id: "k7", category: "SAV & Garantie", question: "Quelle est la durée de garantie ?", answer: "Tous nos produits sont garantis 3 ans pièces et main d'œuvre.", usage: 96, updatedAt: daysAgo(4), tags: ["garantie"] },
  { id: "k8", category: "SAV & Garantie", question: "Comment déclarer une panne ?", answer: "Contactez-nous via WhatsApp avec la référence du produit et une photo.", usage: 54, updatedAt: daysAgo(6), tags: ["sav"] },
  { id: "k9", category: "Compte client", question: "Comment ouvrir un compte pro ?", answer: "Remplissez le formulaire sur notre site, activation sous 48h.", usage: 41, updatedAt: daysAgo(9), tags: ["compte"] },
  { id: "k10", category: "Compte client", question: "Puis-je suivre mes commandes en ligne ?", answer: "Oui, via votre espace client sur sunlight.ma.", usage: 73, updatedAt: daysAgo(1), tags: ["suivi"] },
];

const gradients = [
  "linear-gradient(135deg,#1B2A4A,#C8862B)",
  "linear-gradient(135deg,#C8862B,#f4c07a)",
  "linear-gradient(135deg,#1B2A4A,#5B6472)",
  "linear-gradient(135deg,#2d3f68,#C8862B)",
  "linear-gradient(135deg,#8a5a1b,#f2d3a0)",
  "linear-gradient(135deg,#1B2A4A,#2a4270)",
];
const postTopics = [
  "Nouvelle gamme LED industrielle 200W",
  "Coulisses de production à Casablanca",
  "Témoignage client : Groupe Ménara",
  "Conseil d'expert : bien choisir son IP",
  "Cas client : hôtel 5 étoiles Marrakech",
  "Focus produit : projecteur extérieur",
  "L'éclairage LED en agroalimentaire",
  "Portrait équipe : Sofia, responsable SAV",
  "Économies d'énergie : chiffres clés",
  "Nouveau catalogue 2026 disponible",
  "Salon Elec Expo : venez nous voir",
  "Éclairage de parking : normes 2026",
  "5 idées pour éclairer une boutique",
  "Comparatif LED vs halogène",
  "Astuce : optimiser sa facture d'énergie",
  "Nouveau partenariat distributeur",
  "Formation technique gratuite",
  "Rétro 2025 : nos meilleurs projets",
  "Éclairage architectural : tendances",
  "Recrutement : nous embauchons",
];
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
export const initialPosts: Post[] = postTopics.map((t, i) => {
  const day = ((i * 2) % 27) + 1;
  const status: PostStatus = i < 8 ? "publie" : i < 14 ? "planifie" : "brouillon";
  const channels: SocialChannel[][] = [["linkedin"], ["instagram"], ["facebook", "instagram"], ["linkedin", "facebook"]];
  return {
    id: `p${i + 1}`, title: t, caption: `${t}. Découvrez comment Sunlight illumine vos espaces avec des solutions LED premium made in Morocco. #Sunlight #LED #Éclairage`,
    channels: channels[i % channels.length], date: new Date(currentYear, currentMonth, day, 9 + (i % 8)).toISOString(),
    status, gradient: gradients[i % gradients.length],
    stats: status === "publie" ? { likes: 40 + i * 7, comments: 3 + i, shares: 2 + (i % 5), reach: 800 + i * 120 } : undefined,
  };
});

const companies = ["Atlas Distribution", "Immobilière Anfa", "Groupe Ménara", "Tahiri Construction", "Naciri Hôtellerie", "Cafés Moulay", "Alaoui Retail", "Fassi Design", "Ait Frères", "Chraibi Group", "Sofia Traiteur", "Rabat Municipality", "Menara Industries", "Ouaziz & Fils", "Cherkaoui SARL", "Bennani BTP", "Zniber Immobilier", "Kettani Group", "Lazrak Holding", "Rif Industries"];
const sectors = ["Distribution", "Immobilier", "Retail", "Construction", "Hôtellerie", "Restauration", "Industrie", "Design", "Public", "BTP"];
const owners = ["Karim B.", "Sofia M.", "Yasmine H.", "Mehdi A."];
const stagesOrder: LeadStage[] = ["nouveau", "contacte", "qualifie", "negociation", "converti"];
export const initialLeads: Lead[] = companies.map((co, i) => {
  const stage: LeadStage = i < 5 ? "nouveau" : i < 9 ? "contacte" : i < 13 ? "qualifie" : i < 17 ? "negociation" : i < 19 ? "converti" : "perdu";
  const channel: Channel = (["web", "whatsapp", "linkedin", "phone", "email"] as Channel[])[i % 5];
  return {
    id: `L${i + 1}`, company: co, sector: sectors[i % sectors.length], contact: `Contact ${i + 1}`,
    email: `contact${i + 1}@${co.toLowerCase().replace(/[^a-z]/g, "")}.ma`, phone: `+212 6${(10000000 + i * 137).toString().slice(0, 8)}`,
    channel, stage, amount: 15000 + ((i * 4237) % 200000), lastContact: daysAgo((i * 3) % 20), owner: owners[i % owners.length],
    notes: i % 3 === 0 ? "Client intéressé par une offre volume, à recontacter la semaine prochaine." : "",
    nextAction: { date: daysAgo(-((i % 7) + 1)), text: "Envoyer devis détaillé" },
    history: [
      { at: daysAgo((i * 3) % 20 + 5), kind: "email", text: "Premier email de qualification envoyé" },
      { at: daysAgo((i * 3) % 20 + 2), kind: "appel", text: "Appel de découverte 15 min" },
      { at: daysAgo((i * 3) % 20), kind: "message", text: "Envoi documentation produit" },
    ],
  };
});

export const initialFollowUps: FollowUpRule[] = [
  { id: "r1", name: "Relance lead froid — 7 jours", channel: "whatsapp", trigger: "Aucun contact depuis", days: 7, template: "Bonjour {contact}, j'espère que vous allez bien. Souhaitez-vous que nous reprenions notre échange sur votre projet d'éclairage ?", active: true },
  { id: "r2", name: "Relance devis — 3 jours", channel: "email", trigger: "Devis envoyé sans réponse depuis", days: 3, template: "Bonjour, avez-vous eu l'occasion de consulter notre devis ? Je reste à votre disposition.", active: true },
  { id: "r3", name: "Relance LinkedIn — 14 jours", channel: "linkedin", trigger: "Aucune interaction depuis", days: 14, template: "Bonjour {contact}, je pensais à notre discussion sur vos besoins d'éclairage LED. Un créneau la semaine prochaine ?", active: false },
  { id: "r4", name: "Relance WhatsApp — 5 jours", channel: "whatsapp", trigger: "Message lu sans réponse depuis", days: 5, template: "Bonjour, souhaitez-vous plus d'informations ?", active: true },
  { id: "r5", name: "Réactivation ancien client — 90 jours", channel: "email", trigger: "Dernière commande depuis", days: 90, template: "Cela fait un moment ! Découvrez nos nouveautés 2026.", active: true },
];

export const initialFollowUpLogs: FollowUpLog[] = Array.from({ length: 14 }, (_, i) => ({
  id: `f${i}`, lead: companies[i % companies.length], channel: (["whatsapp", "email", "linkedin"] as Channel[])[i % 3],
  at: daysAgo(i), status: (["envoyee", "ouverte", "repondue"] as const)[i % 3],
}));

const empNames = ["Sofia Mansouri", "Karim Bennis", "Yasmine Hakimi", "Mehdi Alaoui", "Rachid Toumi", "Nawal Cherki", "Hicham Berrada", "Amina El Fassi", "Youssef Ouali", "Layla Idrissi", "Omar Naciri", "Salma Rachidi"];
const depts = ["Commercial", "Production", "SAV", "RH", "Comptabilité", "Marketing"];
const roles = ["Commerciale B2B", "Technicien SAV", "Responsable production", "Responsable RH", "Comptable", "Chargée de com'", "Commercial terrain", "Technicien qualité", "Chef d'atelier", "Assistante RH", "Directeur commercial", "Gestionnaire paie"];
export const initialEmployees: Employee[] = empNames.map((n, i) => ({
  id: `e${i + 1}`, name: n, role: roles[i], department: depts[i % depts.length],
  status: (["present", "present", "present", "conge", "absent", "present"] as EmployeeStatus[])[i % 6],
  hiredAt: `202${(i % 5) + 0}-0${(i % 9) + 1}-1${i % 9}`, email: n.toLowerCase().replace(" ", ".") + "@sunlight.ma",
  phone: `+212 6${(20000000 + i * 213).toString().slice(0, 8)}`, manager: i > 0 ? empNames[(i - 1) % empNames.length] : "—",
  salary: 8000 + (i * 1350) % 15000,
  documents: [{ name: "contrat.pdf", size: "245 Ko" }, { name: "CIN.pdf", size: "180 Ko" }, { name: "RIB.pdf", size: "95 Ko" }],
  leaves: [{ from: daysAgo(30 + i), to: daysAgo(25 + i), type: "Congé payé" }], leavesRemaining: 18 - (i % 8),
}));

const agencies = ["Casablanca", "Rabat", "Marrakech", "Tanger"];
export const initialWorkers: Worker[] = Array.from({ length: 9 }, (_, i) => ({
  id: `w${i + 1}`, name: `Ouvrier ${["Aziz", "Brahim", "Said", "Hassan", "Jamal", "Larbi", "Moha", "Noureddine", "Tarik"][i]}`,
  agency: agencies[i % 4], mission: ["Installation hôtel Anfa", "Chantier parking Marina", "Maintenance entrepôt Ménara", "Rénovation boutique Alaoui"][i % 4],
  contractStart: "2026-01-15", contractEnd: "2026-12-31", hourlyRate: 45 + (i % 5) * 5,
  hoursByDay: { 1: 8, 2: 8, 3: 7, 4: 8, 5: 6, 8: 8, 9: 8, 10: 8, 11: 7, 12: 8 },
}));

export const initialInvoices: Invoice[] = [
  { id: "i1", kind: "fournisseur", number: "INV-F-2044", party: "LED Components Ltd", amount: 82000, due: daysAgo(-5), status: "attente" },
  { id: "i2", kind: "fournisseur", number: "INV-F-2045", party: "Alu Profils SA", amount: 24500, due: daysAgo(-2), status: "attente" },
  { id: "i3", kind: "fournisseur", number: "INV-F-2046", party: "Transport Rapide", amount: 6200, due: daysAgo(3), status: "retard" },
  { id: "i4", kind: "fournisseur", number: "INV-F-2047", party: "Emballages Pro", amount: 3800, due: daysAgo(-10), status: "payee" },
  { id: "i5", kind: "fournisseur", number: "INV-F-2048", party: "Cables Maroc", amount: 15300, due: daysAgo(-20), status: "attente" },
  { id: "i6", kind: "fournisseur", number: "INV-F-2049", party: "OCP Énergie", amount: 12000, due: daysAgo(-15), status: "payee" },
  { id: "i7", kind: "client", number: "INV-C-2044", party: "Atlas Distribution", amount: 48200, due: daysAgo(-7), status: "attente" },
  { id: "i8", kind: "client", number: "INV-C-2045", party: "Groupe Ménara", amount: 92000, due: daysAgo(4), status: "retard" },
  { id: "i9", kind: "client", number: "INV-C-2046", party: "Naciri Hôtellerie", amount: 138000, due: daysAgo(-14), status: "payee" },
  { id: "i10", kind: "client", number: "INV-C-2047", party: "Cafés Moulay", amount: 5400, due: daysAgo(-3), status: "payee" },
  { id: "i11", kind: "client", number: "INV-C-2048", party: "Tahiri Construction", amount: 76000, due: daysAgo(-9), status: "attente" },
  { id: "i12", kind: "client", number: "INV-C-2049", party: "Fassi Design", amount: 18000, due: daysAgo(1), status: "retard" },
  { id: "i13", kind: "client", number: "INV-C-2050", party: "Ait Frères", amount: 22500, due: daysAgo(-25), status: "payee" },
  { id: "i14", kind: "client", number: "INV-C-2051", party: "Chraibi Group", amount: 41000, due: daysAgo(-6), status: "attente" },
  { id: "i15", kind: "client", number: "INV-C-2052", party: "Sofia Traiteur", amount: 12800, due: daysAgo(-12), status: "attente" },
];

export const initialJobs: JobPosting[] = [
  { id: "j1", title: "Technicien SAV", department: "SAV", description: "Interventions techniques chez nos clients pros." },
  { id: "j2", title: "Commercial B2B", department: "Commercial", description: "Développement du portefeuille distributeurs." },
  { id: "j3", title: "Ingénieur qualité", department: "Production", description: "Contrôle qualité de la ligne de production." },
];

const candidateNames = ["Adam Roux", "Nora Belkacem", "Ismail Ait", "Sara Mansour", "Tarik Alami", "Meryem Fikri", "Anas Ziani", "Kenza Rami", "Yassine Bouzid", "Rim Naji", "Hamza Douiri", "Sanaa Kabbaj"];
export const initialCandidates: Candidate[] = candidateNames.map((n, i) => ({
  id: `cand${i + 1}`, jobId: `j${(i % 3) + 1}`, name: n,
  source: ["LinkedIn", "Site carrière", "Recommandation", "Cabinet"][i % 4],
  appliedAt: daysAgo(i * 2 + 1), rating: (i % 5) + 1,
  stage: (["recue", "recue", "preselection", "preselection", "entretien", "entretien", "offre", "recrute", "refuse"] as CandidateStage[])[i % 9],
  cvSummary: `${n} — 5 ans d'expérience dans ${["l'électricité industrielle", "la vente B2B", "le contrôle qualité"][i % 3]}. Bac+3, mobile.`,
  notes: i % 3 === 0 ? "Bon feeling en entretien téléphonique." : "",
}));

const avatarColors = ["#1B2A4A", "#C8862B", "#5B6472", "#2d3f68", "#8a5a1b", "#3d5178", "#a86e22", "#4a5768"];
export const initialUsers: UserAccount[] = [
  { id: "u1", name: "Salim Reda", email: "salim@sunlight.ma", role: "admin", active: true, lastLogin: hoursAgo(1), avatarColor: avatarColors[0] },
  { id: "u2", name: "Karim Bennis", email: "karim@sunlight.ma", role: "commercial", active: true, lastLogin: hoursAgo(3), avatarColor: avatarColors[1] },
  { id: "u3", name: "Sofia Mansouri", email: "sofia@sunlight.ma", role: "support", active: true, lastLogin: minutesAgo(15), avatarColor: avatarColors[2] },
  { id: "u4", name: "Yasmine Hakimi", email: "yasmine@sunlight.ma", role: "commercial", active: true, lastLogin: hoursAgo(8), avatarColor: avatarColors[3] },
  { id: "u5", name: "Nawal Cherki", email: "nawal@sunlight.ma", role: "rh", active: true, lastLogin: daysAgo(1), avatarColor: avatarColors[4] },
  { id: "u6", name: "Rachid Toumi", email: "rachid@sunlight.ma", role: "support", active: false, lastLogin: daysAgo(15), avatarColor: avatarColors[5] },
  { id: "u7", name: "Amina El Fassi", email: "amina@sunlight.ma", role: "commercial", active: true, lastLogin: hoursAgo(20), avatarColor: avatarColors[6] },
];

export const initialIntegrations: Integration[] = [
  { id: "wa", name: "WhatsApp Business", logo: "🟢", connected: true, lastSync: minutesAgo(3) },
  { id: "web", name: "Site web (widget chat)", logo: "🌐", connected: true, lastSync: minutesAgo(1) },
  { id: "li", name: "LinkedIn", logo: "in", connected: true, lastSync: hoursAgo(2) },
  { id: "fb", name: "Facebook", logo: "f", connected: true, lastSync: hoursAgo(4) },
  { id: "ig", name: "Instagram", logo: "◎", connected: false, lastSync: daysAgo(3) },
  { id: "tg", name: "Telegram (MVP)", logo: "✈", connected: false, lastSync: "—" },
];

export const initialNotifications: Notification[] = [
  { id: "n1", title: "Nouveau lead qualifié : Atlas Distribution", time: "il y a 5 min", read: false, kind: "success" },
  { id: "n2", title: "3 tickets en attente depuis +24h", time: "il y a 1h", read: false, kind: "warning" },
  { id: "n3", title: "Post LinkedIn publié avec succès", time: "il y a 2h", read: false, kind: "success" },
  { id: "n4", title: "Candidature reçue : Technicien SAV", time: "hier", read: true, kind: "info" },
  { id: "n5", title: "Facture INV-2044 marquée payée", time: "hier", read: true, kind: "success" },
];

export type ActivityItem = { id: string; icon: string; text: string; at: string };
export const initialActivity: ActivityItem[] = [
  { id: "a1", icon: "🎯", text: "Nouveau lead qualifié : Atlas Distribution", at: "il y a 5 min" },
  { id: "a2", icon: "✅", text: "Ticket #1042 résolu par l'agent IA", at: "il y a 20 min" },
  { id: "a3", icon: "📣", text: "Post LinkedIn publié : « Nouvelle gamme LED industrielle »", at: "il y a 1h" },
  { id: "a4", icon: "💬", text: "Nouvelle conversation WhatsApp : Naciri Hôtellerie", at: "il y a 2h" },
  { id: "a5", icon: "👤", text: "Candidature reçue : poste Technicien SAV", at: "il y a 3h" },
  { id: "a6", icon: "💰", text: "Facture #INV-2044 marquée payée", at: "hier à 14h32" },
  { id: "a7", icon: "📅", text: "Post Instagram planifié pour vendredi", at: "hier à 11h04" },
  { id: "a8", icon: "🔥", text: "Lead converti : Groupe Ménara — 92 000 MAD", at: "hier à 09h18" },
  { id: "a9", icon: "🧾", text: "3 factures fournisseurs importées", at: "il y a 2 jours" },
  { id: "a10", icon: "🎓", text: "Formation équipe SAV planifiée", at: "il y a 2 jours" },
  { id: "a11", icon: "📈", text: "Rapport mensuel prospection généré", at: "il y a 3 jours" },
  { id: "a12", icon: "🛠", text: "Configuration Agent Community mise à jour", at: "il y a 3 jours" },
];

export const channelIcons: Record<string, string> = {
  whatsapp: "🟢", web: "🌐", email: "✉", phone: "☎", linkedin: "in", facebook: "f", instagram: "◎",
};
