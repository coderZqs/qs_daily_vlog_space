let isMoveLeft = false;
let isMoveRight = false;
let isMoveFront = false;
let isMoveBack = false;

let angle = 0;

window.onkeydown = (e) => {
  switch (e.keyCode) {
    case 87:
      return (isMoveFront = true);
    case 65:
      return (isMoveLeft = true);
    case 68:
      return (isMoveRight = true);
    case 83:
      return (isMoveBack = true);
  }
};

window.onkeyup = (e) => {
  switch (e.keyCode) {
    case 87:
      return (isMoveFront = false);
    case 65:
      return (isMoveLeft = false);
    case 68:
      return (isMoveRight = false);
    case 83:
      return (isMoveBack = false);
  }
};

export const listenKeyboard = (mesh) => {
  if (isMoveFront) {
    mesh.position.z -= Math.cos((Math.PI / 180) * angle) * 0.05;
    mesh.position.x -= Math.sin((Math.PI / 180) * angle) * 0.05;

    console.log(
      Math.cos((Math.PI / 180) * angle) * 0.05,
      Math.sin((Math.PI / 180) * angle) * 0.05
    );
  }
  if (isMoveLeft) {
    angle += 1;
    mesh.rotation.y = (Math.PI / 180) * angle;
  }
  if (isMoveRight) {
    angle -= 1;
    mesh.rotation.y = (Math.PI / 180) * angle;
  }
  if (isMoveBack) {
    mesh.position.z += Math.cos((Math.PI / 180) * angle) * 0.05;
    mesh.position.x += Math.sin((Math.PI / 180) * angle) * 0.05;
  }
};
