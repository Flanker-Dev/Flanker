import GeneralSearch from "../../data/General_Search.json";

export const getGeneralSearch = () => {
  const hostnames = {
    ...GeneralSearch,
  };
  return hostnames;
};
