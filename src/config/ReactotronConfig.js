import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reactotronRedux } from "reactotron-redux";
import reactotronSaga from "reactotron-redux-saga";

const devMode = false;

if (devMode) {
  const tron = Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({ host: "192.168.1.84" })
    .useReactNative()
    .use(reactotronRedux())
    .use(reactotronSaga())
    .connect();

  console.tron = tron;

  tron.clear();
}
