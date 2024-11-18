import Instagram from "../../../data/SocialMediaTools/Instagram.json";

export const getInstagram = () => {
  const hostnames = {
    ...Instagram,
  };
  return hostnames;
};
