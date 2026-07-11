const categoryTitles = {
  en: ["Languages", "Backend", "Frontend", "Infra & Tools"],
  pt: ["Linguagens", "Backend", "Frontend", "Infra & Ferramentas"],
};

const items = [
  [
    { icon: "Py", name: "Python", level: 5 },
    { icon: "Sq", name: "SQL", level: 4 },
    { icon: "Js", name: "JavaScript", level: 3 },
  ],
  [
    { icon: "Fa", name: "FastAPI", level: 5 },
    { icon: "Pd", name: "Pydantic v2", level: 4 },
    { icon: "Sa", name: "SQLAlchemy", level: 4 },
    { icon: "Dj", name: "Django / DRF", level: 4 },
  ],
  [
    { icon: "Ht", name: "HTML / CSS", level: 5 },
    { icon: "Re", name: "React", level: 3 },
    { icon: "Vi", name: "Vite", level: 3 },
  ],
  [
    { icon: "Pg", name: "PostgreSQL", level: 4 },
    { icon: "Gt", name: "Git", level: 4 },
    { icon: "Po", name: "Poetry", level: 4 },
    { icon: "Dk", name: "Docker", level: 3 },
  ],
];

export function getStackData(lang) {
  return categoryTitles[lang].map((title, i) => ({
    title,
    items: items[i],
  }));
}
