export const VIOLATION_CODES = {
  "Helmet Violation": "TFC-01",
  "Triple Riding": "TFC-02",
};

export const getViolationCode = (type) => VIOLATION_CODES[type] || "TFC-XX";
