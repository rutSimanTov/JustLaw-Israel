// Redux store setup
import { configureStore } from '@reduxjs/toolkit';

// כאן יתווספו ה-slices (reducers) בעתיד
export const store = configureStore({
  reducer: {
    // user: userReducer, // נוסיף בהמשך
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;