export const calculateBMI = (height: string, weight: string): string => {
  const h = parseFloat(height.replace(/[^\d.]/g, "").trim());
  const w = parseFloat(weight.replace(/[^\d.]/g, "").trim());

  if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return "";

  const heightInMeters = h / 100;

  const bmi = w / (heightInMeters * heightInMeters);

  return bmi.toFixed(1);
};
