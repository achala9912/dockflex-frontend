export const calculateBMI = (height: string, weight: string): string => {
  const h = parseFloat(height);
  const w = parseFloat(weight);

  if (!h || !w) return ""; 

  const heightInMeters = h / 100;
  const bmi = w / (heightInMeters * heightInMeters);

  return bmi.toFixed(1); 
};
