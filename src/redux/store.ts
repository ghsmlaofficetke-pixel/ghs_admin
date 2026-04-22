import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

// reducers
import Layout from "./layout/reducers";
import Auth from "./auth/reducers";
import tpReducer from "../api/tp";
import patanaReducer from "../api/patana";
import hobliReducer from "../api/hobli";
import gramaReducer from "../api/gramapanchayath";
import villageReducer from "../api/village";
import manaviReducer from "../api/manavi";
import individualWorkReducer from "../api/individualwork";
import communityWorkReducer from "../api/communitywork";
import wardReducer from "../api/ward";
import wardmanaviReducer from "../api/wardmanavi";
import wardindReducer from "../api/wardindwork";
import wardcomReducer from "../api/wardcomwork";
import statdataReducer from "../api/statdata";
import statgroupReducer from "../api/statgroup";
import govtofficeReducer from "../api/govtoffice";
import adhiveshanaPdfReducer from "../api/adhiveshanapdf";
import adhiveshanaReducer from "../api/adhiveshana";
import mlaladdReducer from "../api/mlaladd";
import schemReducer from "../api/schem";
import schemdataReducer from "../api/schemdata";
import consolidateReducer from "../api/consolidate";

// saga
import rootSaga from "./sagas";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

// mount it on the store
export const store = configureStore({
  reducer: {
    Auth: Auth,
    Layout: Layout,
    tp:tpReducer,
    patana:patanaReducer,
    hobli:hobliReducer,
    gramaPanchayath: gramaReducer,
    village: villageReducer,
    manavi: manaviReducer,
    individualWork: individualWorkReducer,
    communityWork:communityWorkReducer,
    ward:wardReducer,
    wardmanavi:wardmanaviReducer,
    wardIndWork: wardindReducer,
    wardcomWork:wardcomReducer,
    statdata:statdataReducer,
    statgroup:statgroupReducer,
    govtoffice:govtofficeReducer,
    adhiveshanaPdf: adhiveshanaPdfReducer,
    adhiveshana: adhiveshanaReducer,
    mlaladd: mlaladdReducer,
    schem: schemReducer,
    schemdata: schemdataReducer,
    consolidate:consolidateReducer,
  } as any,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

// run the saga
sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
