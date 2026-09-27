const categoryTitles = {
  en: ["Languages", "Backend", "Frontend", "Infra & Tools"],
  pt: ["Linguagens", "Backend", "Frontend", "Infra & Ferramentas"],
};

const items = [
  [
    { icon: "Py", name: "Python", level: 4 },
    { icon: "Sq", name: "SQL", level: 4 },
    { icon: "Js", name: "JavaScript", level: 3 },
  ],
  [
    { icon: "Fa", name: "FastAPI", level: 4 },
    { icon: "Pd", name: "Pydantic v2", level: 4 },
    { icon: "Sa", name: "SQLAlchemy 2.0", level: 4 },
    { icon: "Jw", name: "JWT / OAuth2", level: 3 },
    { icon: "Pt", name: "pytest", level: 3 },
  ],
  [
    { icon: "Ht", name: "HTML / CSS", level: 4 },
    { icon: "Re", name: "React", level: 3 },
    { icon: "Vi", name: "Vite", level: 3 },
  ],
  [
    { icon: "Pg", name: "PostgreSQL", level: 4 },
    { icon: "Rd", name: "Redis", level: 3 },
    { icon: "Dk", name: "Docker / Compose", level: 3 },
    { icon: "Gt", name: "Git", level: 4 },
    { icon: "Po", name: "Poetry", level: 4 },
  ],
];

export function getStackData(lang) {
  return categoryTitles[lang].map((title, i) => ({
    title,
    items: items[i],
  }));
}
