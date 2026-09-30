const categoryTitles = {
  en: ["Languages", "Backend", "Frontend", "Infra & Tools"],
  pt: ["Linguagens", "Backend", "Frontend", "Infra & Ferramentas"],
};

const items = [
  [
    { icon: "Py", name: "Python" },
    { icon: "Sq", name: "SQL" },
    { icon: "Js", name: "JavaScript" },
  ],
  [
    { icon: "Fa", name: "FastAPI" },
    { icon: "Pd", name: "Pydantic v2" },
    { icon: "Sa", name: "SQLAlchemy 2.0" },
    { icon: "Jw", name: "JWT / OAuth2" },
    { icon: "Pt", name: "pytest" },
  ],
  [
    { icon: "Ht", name: "HTML / CSS" },
    { icon: "Re", name: "React" },
    { icon: "Vi", name: "Vite" },
  ],
  [
    { icon: "Pg", name: "PostgreSQL" },
    { icon: "Rd", name: "Redis" },
    { icon: "Dk", name: "Docker / Compose" },
    { icon: "Gt", name: "Git" },
    { icon: "Po", name: "Poetry" },
  ],
];

export function getStackData(lang) {
  return categoryTitles[lang].map((title, i) => ({
    title,
    items: items[i],
  }));
}
