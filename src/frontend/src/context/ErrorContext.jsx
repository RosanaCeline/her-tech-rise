import { createContext, useContext, useState, useCallback } from "react";

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [errorMsg, setErrorMsg] = useState(null);

  const showError = useCallback((msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4000); 
  }, []);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}

      {errorMsg && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {errorMsg}
        </div>
      )}
    </ErrorContext.Provider>
  );
}

export function useError() {
  return useContext(ErrorContext);
}