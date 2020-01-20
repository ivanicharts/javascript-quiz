import React, { createContext, useReducer, useContext, useMemo, useEffect } from 'react';
import localForage from 'localforage';
import produce from 'immer';

const StateContext = createContext();
const DispatchContext = createContext();

const SET_SETTINGS = 'settings/set';
const UPDATE_SETTINGS = 'settings/update';
const SETTINGS = 'settings/set';
const CLEAR = 'settings/clear';

const defaultSettings = {
  useVoiceCommands: false,
  theme: 'light',
};

const settingsReducer = produce(function settingsReducer(state, { type, payload }) {
  switch (type) {
    case SET_SETTINGS: return payload;

    case UPDATE_SETTINGS:
      state[payload.setting] = payload.value;
      break;

    case CLEAR: return defaultSettings;

    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
});

function SettingsProvider({ children }) {
  const [state, dispatch] = useReducer(settingsReducer, defaultSettings);

  useEffect(() => {
    (async () => {
      const settings = await localForage.getItem(SETTINGS);

      if (settings) {
        dispatch({ type: SET_SETTINGS, payload: settings })
      }
    })();
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useSettingsState(params) {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useSettingsState must be used within a SettingsProvider');
  }
  return context;
}

function useSettingsDispatch(params) {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useSettingsDispatch must be used within a SettingsProvider');
  }
  return context;
}

function useSettingsActions() {
  const dispatch = useSettingsDispatch();
  return useMemo(() => ({
    setSettings: payload => dispatch({ type: SET_SETTINGS, payload }),
    updateSetting: payload => dispatch({ type: UPDATE_SETTINGS, payload }),
    clear: payload => dispatch({ type: CLEAR }),
  }), [dispatch]);
}

function useSettings() {
  return [useSettingsState(), useSettingsActions()];
}

export {
  SettingsProvider,
  useSettings,
  useSettingsActions,
};

