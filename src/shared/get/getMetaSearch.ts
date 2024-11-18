import MetaSearch from "../../data/Meta_Search.json";

export const getMetaSearch = () => {
  const hostnames = {
    ...MetaSearch,
  };
  return hostnames;
};
