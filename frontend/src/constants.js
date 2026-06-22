export const VIOLATION_CODES = {
  "Helmet Violation": "TFC-01",
  "Triple Riding": "TFC-02",
  "Seatbelt Non-Compliance": "TFC-03",
  "Illegal Parking": "TFC-04",
};

export const getViolationCode = (type) => VIOLATION_CODES[type] || "TFC-XX";

export const VIOLATION_COLORS = {
  "Helmet Violation": "#E2462F",
  "Triple Riding": "#FFB627",
  "Seatbelt Non-Compliance": "#8B5CF6",
  "Illegal Parking": "#3B82F6",
};

export const getViolationColor = (type) => VIOLATION_COLORS[type] || "#9CA3AF";
