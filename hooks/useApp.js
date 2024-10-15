import { AppContext } from '@/contexts/appContext';
import { useContext } from 'react';

export const useApp = () => useContext(AppContext);
