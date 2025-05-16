export const radianToDegree = (radian: number): number => {
  let degree = radian * (180 / Math.PI);
  if (degree < 0) {
    degree += 360;
  }
  return degree % 360;
};