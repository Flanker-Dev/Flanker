import LinkedIn from "../../../data/SocialMediaTools/LinkedIn.json";

export const getLinkedIn = () => {
  const hostnames = {
    ...LinkedIn,
  };
  return hostnames;
};
