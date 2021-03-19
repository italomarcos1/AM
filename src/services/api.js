import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

axios.defaults.baseURL = "https://sandbox.amfrutas.pt/backend";

axios.interceptors.request.use(async (config) => {
  const uuid = await AsyncStorage.getItem("@uuid");

  if (uuid) {
    config.headers.uuid = uuid;
  }

  return config;
});

export default axios;
