import VisualSearchAndClusteringSearchEngines from "../../data/Visual_Search_and_Clustering_Search_Engines.json";

export const getVisualSearchAndClusteringSearchEngines = () => {
  const hostnames = {
    ...VisualSearchAndClusteringSearchEngines,
  };
  return hostnames;
};
