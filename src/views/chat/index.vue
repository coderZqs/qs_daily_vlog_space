<template>
  <div>
    <!-- 聊天记录 -->

    <div class="flex">
      user1:
      <a-button @click="sendMessage('user1')">send</a-button>
      <a-input v-model="data.user1.content"></a-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import jsCookie from "js-cookie";
import { onMounted, reactive } from "vue";

enum ChatType {
  GROUP = 1,
  FRIEND = 2
}

class WS extends WebSocket {
  public url;
  public chatType: ChatType | undefined;

  constructor(url, chatType: ChatType) {
    super(url);
    this.chatType = chatType;
  }
}

enum MsgType {
  TEXT = 1,
  PICTURE = 2,
  VOICE = 3
}

type SocketMsgType = {
  to_id: number;
  content: string;
  category: string;
  belong_id: number;
  msg_type: MsgType;
};

type Data = {
  user1: {
    content: string;
    socket: WebSocket | null;
    token: string;
    id: number;
  };
  user2: {
    content: string;
    token: string;
    socket: WebSocket | null;
    id: number;
  };
};

let data = reactive<Data>({
  user1: {
    id: 33,
    content: "",
    socket: null,
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoxNjc5Mjk5MjM1MjY4LCJ0aW1lb3V0IjoxNjc5Mjk5Mjk1MjY4LCJ1c2VybmFtZSI6InFpbmdzaHVuIiwiaWQiOjM0LCJpYXQiOjE2NzkyOTkyMzV9.w-uz3XmwZEtTzq7TxLwXXcgMxBwqUIhZQjEY3WCTcxU"
  },
  user2: {
    id: 34,
    content: "",
    socket: null,
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoxNjc5Mjk5MjYwNzE2LCJ0aW1lb3V0IjoxNjc5Mjk5MzIwNzE2LCJ1c2VybmFtZSI6InppbW0iLCJpZCI6MzMsImlhdCI6MTY3OTI5OTI2MH0.NKcbPC_Hw1TqbPKhmvJjR-e9Kf--mjXgqFTUGN7FqYA"
  }
});

const sendMessage = user => {
  if (user === "user1") {
    if (!data.user1.socket) {
      let ws = connect(data.user1.token);
      data.user1.socket = ws;
    } else {
      data.user1.socket.send(
        JSON.stringify({
          to_id: data.user2.id,
          content: data.user1.content,
          category: ChatType.FRIEND,
          belong_id: data.user1.id,
          msg_type: MsgType.TEXT
        })
      );
    }
  } else {
    if (!data.user2.socket) {
      let ws = connect(data.user1.token);
      data.user2.socket = ws;
    } else {
      data.user2.socket.send(
        JSON.stringify({
          to_id: data.user1.id,
          content: data.user2.content,
          category: ChatType.FRIEND,
          belong_id: data.user2.id,
          msg_type: MsgType.TEXT
        })
      );
    }
  }
};

const connect = (token: string) => {
  let ws = new WS("ws://192.168.16.155:88?token=" + token, ChatType.FRIEND);
  return ws;
};

onMounted(() => {
  data.user1.socket = connect(data.user1.token);
  data.user2.socket = connect(data.user2.token);

  data.user1.socket.onmessage = e => {
    console.log(e, "user1");
  };

  data.user2.socket.onmessage = e => {
    console.log(e, "user2");
  };
});
</script>

<style scoped></style>
