const characters = [
  {
    value: "very-low",
    family: "Income",
    element: "select[name=\"income\"] option[value=\"very-low\"]",
    score: 2,
  },
  {
    value: "low",
    family: "Income",
    element: "select[name=\"income\"] option[value=\"low\"]",
    score: 4,
  },
  {
    value: "middle",
    family: "Income",
    element: "select[name=\"income\"] option[value=\"middle\"]",
    score: 6,
  },
  {
    value: "middle-high",
    family: "Income",
    element: "select[name=\"income\"] option[value=\"middle-high\"]",
    score: 8,
  },
  {
    value: "high",
    family: "Income",
    element: "select[name=\"income\"] option[value=\"high\"]",
    score: 10,
  },
  {
    value: "finished",
    family: "Parents",
    element: "select[name=\"parents\"] option[value=\"finished\"]",
    score: 2,
  },
  {
    value: "no-finish",
    family: "Parents",
    element: "select[name=\"parents\"] option[value=\"no-finish\"]",
    score: 0,
  },
  {
    value: "white",
    family: "Race",
    element: "select[name=\"race\"] option[value=\"white\"]",
    score: 4,
  },
  {
    value: "black",
    family: "Race",
    element: "select[name=\"race\"] option[value=\"black\"]",
    score: 2,
  },
  {
    value: "latino",
    family: "Race",
    element: "select[name=\"race\"] option[value=\"latino\"]",
    score: 2,
  },
  {
    value: "asian",
    family: "Race",
    element: "select[name=\"race\"] option[value=\"asian\"]",
    score: 3,
  },
  {
    value: "native",
    family: "Race",
    element: "select[name=\"race\"] option[value=\"native\"]",
    score: 1,
  },
  {
    value: "public",
    family: "School",
    element: "select[name=\"school\"] option[value=\"pub-urb\"]",
    score: 2,
  },
  {
    value: "private",
    family: "School",
    element: "select[name=\"school\"] option[value=\"private\"]",
    score: 4,
  },
]

export default characters;
