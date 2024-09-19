import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Recuperar o estado de login do AsyncStorage ao iniciar o app
    const loadLoginState = async () => {
      try {
        const storedLoginState = await AsyncStorage.getItem('isLoggedIn');
        if (storedLoginState !== null) {
          setIsLoggedIn(JSON.parse(storedLoginState));
        }
      } catch (error) {
        console.error('Erro ao carregar o estado de login: ', error);
      }
    };
    loadLoginState();
  }, []);

  const handleSetIsLoggedIn = async (value: boolean) => {
    try {
      setIsLoggedIn(value);
      // Salvar o estado de login no AsyncStorage
      await AsyncStorage.setItem('isLoggedIn', JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar o estado de login: ', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn: handleSetIsLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
