export interface ComponentSection {
  name: string;
  ordinal: number;
}

export const defaultComponentSections: ComponentSection[] = [
  {
    name: "Preconditions",
    ordinal: 0,
  },
  {
    name: "Constants",
    ordinal: 1,
  },
  {
    name: "State",
    ordinal: 2,
  },
  {
    name: "Hooks",
    ordinal: 3,
  },
  {
    name: "Context",
    ordinal: 4,
  },
  {
    name: "Memos",
    ordinal: 5,
  },
  {
    name: "Effects",
    ordinal: 6,
  },
  {
    name: "Functions",
    ordinal: 7,
  },
];
