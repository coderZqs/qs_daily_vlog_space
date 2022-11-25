// 球坐标下的标准球方程
// 这里是球坐标和直角坐标的转换
// size相当于球坐标的r
const getSphere = (i, count, size) => {
  const phi = Math.acos(-1 + (2 * i) / count);
  const theta = Math.sqrt(count * Math.PI) * phi;
  return {
    x: size * Math.cos(theta) * Math.sin(phi),
    y: size * Math.sin(theta) * Math.sin(phi),
    z: -size * Math.cos(phi),
  };
};
