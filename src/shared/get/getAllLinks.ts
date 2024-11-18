import Blog_Search from "../../data/Blog_Search.json";
import Browsers from "../../data/Browsers.json";
import Code_Search from "../../data/Code_Search.json";
import Company_Research from "../../data/Company_Research.json";
import Data_and_Statistics from "../../data/Data_and_Statistics.json";
import DNS from "../../data/DNS.json";
import Document_and_Slides_Search from "../../data/Document_and_Slides_Search.json";
import Domain_and_IP_Research from "../../data/Domain_and_IP_Research.json";
import Email_Search_Check from "../../data/Email_Search_Check.json";
import Expert_Search from "../../data/Expert_Search.json";
import Fact_Checking from "../../data/Fact_Checking.json";
import File_Search from "../../data/File_Search.json";
import Forums_and_Discussion_Boards_Search from "../../data/Forums_and_Discussion_Boards_Search.json";
import General_Search from "../../data/General_Search.json";
import Geospatial_Research_and_Mapping_Tools from "../../data/Geospatial_Research_and_Mapping_Tools.json";
import Image_Analysis from "../../data/Image_Analysis.json";
import Image_Search from "../../data/Image_Search.json";
import Infographics_and_Data_Visualization from "../../data/Infographics_and_Data_Visualization.json";
import Job_Search_Resources from "../../data/Job_Search_Resources.json";
import Keywords_Discovery_and_Research from "../../data/Keywords_Discovery_and_Research.json";
import Language_Tools from "../../data/Language_Tools.json";
import Main_National_Search_Engines from "../../data/Main_National_Search_Engines.json";
import Major_Social_Networks from "../../data/Major_Social_Networks.json";
import Maritime from "../../data/Maritime.json";
import Meta_Search from "../../data/Meta_Search.json";
import News from "../../data/News.json";
import News_Digest_and_Discovery_Tools from "../../data/News_Digest_and_Discovery_Tools.json";
import Offline_Browsing from "../../data/Offline_Browsing.json";
import OSINT_Blogs from "../../data/OSINT_Blogs.json";
import OSINT_Videos from "../../data/OSINT_Videos.json";
import Other_Resources from "../../data/Other_Resources.json";
import Other_Tools from "../../data/Other_Tools.json";
import Pastebins from "../../data/Pastebins.json";
import People_Investigations_Complete from "../../data/People_Investigations_Complete.json";
import Phone_Number_Research from "../../data/Phone_Number_Research.json";
import Privacy_and_Encryption_Tools from "../../data/Privacy_and_Encryption_Tools.json";
import QandA_Sites from "../../data/QandA_Sites.json";
import Realtime_Search_Social_Media_Search_and_General_Social_Media_Tools from "../../data/Realtime_Search_Social_Media_Search_and_General_Social_Media_Tools.json";
import Related_Awesome_Lists from "../../data/Related_Awesome_Lists.json";
import Similar_Sites_Search from "../../data/Similar_Sites_Search.json";
import Social_Network_Analysis from "../../data/Social_Network_Analysis.json";
import Facebook from "../../data/SocialMediaTools/Facebook.json";
import Instagram from "../../data/SocialMediaTools/Instagram.json";
import LinkedIn from "../../data/SocialMediaTools/LinkedIn.json";
import Pinterest from "../../data/SocialMediaTools/Pinterest.json";
import Reddit from "../../data/SocialMediaTools/Reddit.json";
import Telegram from "../../data/SocialMediaTools/Telegram.json";
import Tumblr from "../../data/SocialMediaTools/Tumblr.json";
import Twitter from "../../data/SocialMediaTools/Twitter.json";
import VKontakte from "../../data/SocialMediaTools/VKontakte.json";
import Specialty_Search_Engines from "../../data/Specialty_Search_Engines.json";
import Threat_Intelligence from "../../data/Threat_Intelligence.json";
import Username_Check from "../../data/Username_Check.json";
import Video_Search_and_Other_Video_Tools from "../../data/Video_Search_and_Other_Video_Tools.json";
import Visual_Search_and_Clustering_Search_Engines from "../../data/Visual_Search_and_Clustering_Search_Engines.json";
import VPN_Services from "../../data/VPN_Services.json";
import Web_History_and_Website_Capture from "../../data/Web_History_and_Website_Capture.json";
import Web_Monitoring from "../../data/Web_Monitoring.json";

export const getAllLinks = () => {
  const hostnames = {
    ...General_Search,
    ...Main_National_Search_Engines,
    ...Meta_Search,
    ...Specialty_Search_Engines,
    ...Visual_Search_and_Clustering_Search_Engines,
    ...Similar_Sites_Search,
    ...Document_and_Slides_Search,
    ...File_Search,
    ...Pastebins,
    ...Code_Search,
    ...Major_Social_Networks,
    ...Realtime_Search_Social_Media_Search_and_General_Social_Media_Tools,
    // SocialMediaTools start
    ...Twitter,
    ...Facebook,
    ...Instagram,
    ...Pinterest,
    ...Reddit,
    ...VKontakte,
    ...Tumblr,
    ...LinkedIn,
    ...Telegram,
    // SocialMediaTools end
    ...Blog_Search,
    ...Forums_and_Discussion_Boards_Search,
    ...Username_Check,
    ...People_Investigations_Complete,
    ...Email_Search_Check,
    ...Phone_Number_Research,
    ...Expert_Search,
    ...Company_Research,
    ...Job_Search_Resources,
    ...QandA_Sites,
    ...Domain_and_IP_Research,
    ...Keywords_Discovery_and_Research,
    ...Web_History_and_Website_Capture,
    ...Language_Tools,
    ...Image_Search,
    ...Image_Analysis,
    ...Video_Search_and_Other_Video_Tools,
    ...Geospatial_Research_and_Mapping_Tools,
    ...News,
    ...News_Digest_and_Discovery_Tools,
    ...Fact_Checking,
    ...Data_and_Statistics,
    ...Web_Monitoring,
    ...Browsers,
    ...Offline_Browsing,
    ...VPN_Services,
    ...Infographics_and_Data_Visualization,
    ...Social_Network_Analysis,
    ...Privacy_and_Encryption_Tools,
    ...DNS,
    ...Maritime,
    ...Other_Tools,
    ...Threat_Intelligence,
    ...OSINT_Videos,
    ...OSINT_Blogs,
    ...Other_Resources,
    ...Related_Awesome_Lists,
  };
  return hostnames;
};
