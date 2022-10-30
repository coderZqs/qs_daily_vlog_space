let isMoveLeft = false;
let isMoveRight = false;
let isMoveFront = false;
let isMoveBack = false;

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

export const listenKeyboard = (controls) => {
    if (isMoveFront) {
        controls.moveForward(0.05);
    }
    if (isMoveLeft) {
        controls.moveRight(-0.05);
    }
    if (isMoveRight) {
        controls.moveRight(0.05);
    }
    if (isMoveBack) {
        controls.moveForward(-0.05);
    }
}