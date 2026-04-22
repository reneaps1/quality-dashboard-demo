import { createContext, useContext, useState } from 'react';
import { INITIAL_INSPECTIONS, CLIENTS, PARTS_BY_CLIENT, DEFECT_TYPES, INSPECTORS } from '../data/mockData';

const InspectionContext = createContext(null);

export function InspectionProvider({ children }) {
  const [inspections, setInspections] = useState(INITIAL_INSPECTIONS);

  const addInspection = (record) => {
    setInspections(prev => [
      ...prev,
      { ...record, id: prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1 },
    ]);
  };

  return (
    <InspectionContext.Provider value={{ inspections, addInspection, CLIENTS, PARTS_BY_CLIENT, DEFECT_TYPES, INSPECTORS }}>
      {children}
    </InspectionContext.Provider>
  );
}

export const useInspections = () => useContext(InspectionContext);
