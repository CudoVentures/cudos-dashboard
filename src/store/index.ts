import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import marketReducer from './market'
import profileReducer from './profile'
import validatorReducer from './validator'
import settingsReducer from './settings'
import networkReducer from './network'
import proposalsReducer from './proposals'
import proposalDetailsReducer from './proposalDetails'
import userTransactionsReducer from './userTransactions'
import validatorDetailsReducer from './validatorDetails'
import notificationsReducer from './notifications'
import modalReducer from './modal'
import { APP_DETAILS } from 'utils/constants'

const rootReducer = combineReducers({
  profile: profileReducer,
  market: marketReducer,
  validator: validatorReducer,
  settings: settingsReducer,
  network: networkReducer,
  userTransactions: userTransactionsReducer,
  proposals: proposalsReducer,
  proposalDetails: proposalDetailsReducer,
  validatorDetails: validatorDetailsReducer,
  notifications: notificationsReducer,
  modal: modalReducer
})

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    'proposals',
    'proposalDetails',
    'validator',
    'validatorDetails',
    'userTransactions',
    'modal'
  ]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: APP_DETAILS.NODE_ENV.toLowerCase() !== 'production'
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
