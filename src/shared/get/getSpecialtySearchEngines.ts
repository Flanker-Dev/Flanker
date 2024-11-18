import SpecialtySearchEngines from "../../data/Specialty_Search_Engines.json";

export const getSpecialtySearchEngines = () => {
  const hostnames = {
    ...SpecialtySearchEngines,
  };
  return hostnames;
};
