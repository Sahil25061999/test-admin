import { createContext, useContext, useState } from "react";

interface BulkTxn {
  txnid: string;
  [key: string]: any;
}

interface BulkTxnContextType {
  bulkTxnList: BulkTxn[];
  updateBulkTxn: (txn: BulkTxn[]) => void;
  clearBulkTxn: () => void;
  removeTxn: (txn: BulkTxn) => void;
}

const BulkTxnContext = createContext<BulkTxnContextType | null>(null);

export const BulkTxnProvider = ({ children }: { children: React.ReactNode }) => {
  const [bulkTxnList, setBulkTxnList] = useState<BulkTxn[]>([]);

  const updateBulkTxn = (currtxn: BulkTxn[]) => {
    setBulkTxnList(currtxn);
  };

  const removeTxn = (txn: BulkTxn) => {
    setBulkTxnList((prev) => prev.filter(currTxn => currTxn.txnid !== txn.txnid));
  };

  const clearBulkTxn = () => {
    setBulkTxnList([]);
  };

  return (
    <BulkTxnContext.Provider value={{ bulkTxnList, updateBulkTxn, clearBulkTxn, removeTxn }}>
      {children}
    </BulkTxnContext.Provider>
  );
};

export const useBulkTxn = () => {
  const context = useContext(BulkTxnContext);
  if (!context) {
    throw new Error("useBulkTxn must be used within a BulkTxnProvider");
  }
  return context;
};
