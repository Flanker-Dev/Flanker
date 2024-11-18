import MainNationalSearchEngines from "../../data/Main_National_Search_Engines.json";

export const getMainNationalSearchEngines = () => {
  const hostnames = {
    ...MainNationalSearchEngines,
  };
  return hostnames;
};
