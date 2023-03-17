import jsCookie from "js-cookie";

export enum ChatType {
  GROUP = 1,
  FRIEND = 2
}

class WS extends WebSocket {
  /* static url: string =
    "ws://192.168.16.155:88?token=" + jsCookie.get("auth-token"); */

  static url: string =
    "ws://192.168.16.155:88?token=" +
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoxNjc5MDIyMzQ5MjExLCJ0aW1lb3V0IjoxNjc5MDIyNDA5MjExLCJ1c2VybmFtZSI6IlNlYmFzdGlhbiIsImlkIjozNSwiaWF0IjoxNjc5MDIyMzQ5fQ.pqRd_g4c4Qo45DLPtvDr4k7SpVdvjriCEEMjHJNPmBQ";
  public chatType: ChatType | undefined;

  constructor(chatType: ChatType) {
    super(WS.url);
    this.chatType = chatType;
  }
}

export default WS;
