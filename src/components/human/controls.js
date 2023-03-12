let isMoveLeft = false;
let isMoveRight = false;
let isMoveFront = false;
let isMoveBack = false;

let andge = 0;

window.onkeydown = (e) => {
    switch (e.keyCode) {
        case 87:
            return isMoveFront = true;
        case 65:
            return isMoveLeft = true;
        case 68:
            return isMoveRight = true;
        case 83:
            return isMoveBack = true;
    }

};

window.onkeyup = (e) => {
    switch (e.keyCode) {
        case 87:
            return isMoveFront = false;
        case 65:
            return isMoveLeft = false;
        case 68:
            return isMoveRight = false;
        case 83:
            return isMoveBack = false;
    }
};

export const listenKeyboard = (mesh) => {
    if (isMoveFront) {
        mesh.position.z -= 0.05;
    }
    if (isMoveLeft) {
        mesh.position.x -= 0.05;
        mesh.rotation.y += 0.01;
    }
    if (isMoveRight) {
        mesh.position.x += 0.05;
        mesh.rotateY();
    }
    if (isMoveBack) {
        mesh.position.z += 0.05;
    }
}