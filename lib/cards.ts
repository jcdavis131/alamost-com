export type CardLeague = "hoops" | "equities" | "gridiron";
export type CardItem = {
  id: string;
  league: CardLeague;
  title: string;
  subtitle: string;
  badge: string;
  accent: string; // okabe key
  price: string;
  asof: string;
  model: string;
  drivers: string[];
  conf: number;
};

export const cardsManifest: CardItem[] = [
  {
    id: "eq-AAPL-20260725",
    league: "equities",
    title: "AAPL • Equities 1D",
    subtitle: "forecast +1.8% • p_up 0.62",
    badge: "▲ up",
    accent: "green",
    price: "$4.00",
    asof: "2026-07-24T22:00:00Z",
    model: "mtNN-v3.2",
    drivers: ["momentum +0.12","flow +0.08","iv skew -0.04"],
    conf: 0.71
  },
  {
    id: "hoops-BOSvsNYK-20260725",
    league: "hoops",
    title: "BOS vs NYK • Hoops",
    subtitle: "p_home 0.58 • spread -2.5",
    badge: "home 58%",
    accent: "blue",
    price: "$3.50",
    asof: "2026-07-24T23:00:00Z",
    model: "mtNN-v3.2",
    drivers: ["transition D +0.12","rim prot +0.09","pace -0.03"],
    conf: 0.66
  },
  {
    id: "gridiron-DALvsPHI-20260725",
    league: "gridiron",
    title: "DAL vs PHI • Gridiron",
    subtitle: "p_home 0.62 • spread -3",
    badge: "home 62%",
    accent: "orange",
    price: "$3.50",
    asof: "2026-07-24T20:00:00Z",
    model: "mtNN-v3.2",
    drivers: ["pressure +0.14","explosives +0.07"],
    conf: 0.69
  },
  {
    id: "eq-NVDA-20260725",
    league: "equities",
    title: "NVDA • Equities 1D",
    subtitle: "forecast -0.9% • p_up 0.44",
    badge: "▼ down",
    accent: "vermillion",
    price: "$4.00",
    asof: "2026-07-24T22:00:00Z",
    model: "mtNN-v3.2",
    drivers: ["gamma -0.11","breadth -0.06"],
    conf: 0.58
  },
  {
    id: "eq-SPOT-20260725",
    league: "equities",
    title: "SPOT • Equities 1W",
    subtitle: "forecast +2.4% • p_up 0.64",
    badge: "▲ up",
    accent: "purple",
    price: "$5.00",
    asof: "2026-07-23T22:00:00Z",
    model: "mtNN-v3.2",
    drivers: ["retention +0.15","margin +0.10"],
    conf: 0.63
  },
  {
    id: "hoops-LALvsGSW-20260725",
    league: "hoops",
    title: "LAL vs GSW • Hoops",
    subtitle: "p_home 0.51 • O/U 228.5",
    badge: "coinflip",
    accent: "sky",
    price: "$3.50",
    asof: "2026-07-24T23:00:00Z",
    model: "mtNN-v3.2",
    drivers: ["pace +0.08","isolation +0.05"],
    conf: 0.55
  },
];
