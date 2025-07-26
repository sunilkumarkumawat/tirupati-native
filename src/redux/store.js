import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import genderReducer from './genderSlice';
import doctorReducer from './doctorSlice';
import panelReducer from './panelSlice';
import salutationReducer from './salutationSlice';
import phoneCodeReducer from './phoneCodeSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    gender: genderReducer,
    doctors: doctorReducer,
    panels: panelReducer,
    salutations: salutationReducer,
    phoneCodes: phoneCodeReducer,
  },
});
