import axios from "axios";
import { useSession } from "next-auth/react";
import { encryptToken } from "../components/loginForm";

export const useAuthAxios = () => {
  const { data: session } = useSession();

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CHRYSUS_URI,
  });

  // useEffect(() => {
  // CHRYSUS_API.defaults.headers.common.Authorization = "Bearer " + token;
  // refreshInstance.defaults.headers.common.Authorization = "Bearer "+refreshToken

  // refreshInstance.defaults.headers["X-Auth-Token"] = JSON.stringify(encryptedAccessToken);
  // }, [token]);

  if (session?.accessToken) {
    instance.defaults.headers.common.Authorization = `Bearer ${session.accessToken}`;
    const encryptedAccessToken = encryptToken(
      "N#8v!zXq3eP$wLr7@U2jT%9kBm5Qf4Y1",
      "6f8f57715090da2632453988d9a1501b6d4f7dffed6a532f1e3a7865e837a69a"
    );
    instance.defaults.headers["X-Auth-Token"] = JSON.stringify(encryptedAccessToken);
  }

  return instance;
};
