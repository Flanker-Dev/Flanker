import Facebook from "../../../data/SocialMediaTools/Facebook.json";

export const getFacebook = () => {
  const hostnames = {
    ...Facebook,
  };
  return hostnames;
};
