<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小思同学"
    ></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(obj, index) in list" :key="index">
        <!-- 左侧是机器人小思 -->
        <div class="chat-item left" v-if="obj.name === 'xs'">
          <van-image
            fit="cover"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="chat-pao">{{ obj.msg }}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-if="obj.name === 'me'">
          <div class="chat-pao">{{ obj.msg }}</div>
          <van-image
            fit="cover"
            round
            :src="userPhoto"
          />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field @keyup.enter="sendFn" v-model="word" placeholder="说点什么...">
        <template #button>
          <span style="font-size: 12px; color: #999" @click="sendFn">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
// 导入 socket.io-client 包
import { io } from "socket.io-client";
import {mapGetters} from 'vuex'
// 定义变量，存储 websocket 实例
let socket = null;
export default {
  name: "Chat",
  computed: {
    ...mapGetters(['userPhoto'])
  },
  data() {
    return {
      word: "", // 输入框的内容
      // 所有的聊天消息
      list: [
        // 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
        { name: "xs", msg: "hi，你好！我是小思" },
        { name: "me", msg: "我是编程小王子" },
      ],
      token: this.$store.state.token,
    };
  },
  methods: {
    sendFn() {
      // 判断内容是否为空
      if (!this.word) return;

      // 添加聊天消息到 list 列表中
      this.list.push({
        name: "me",
        msg: this.word,
      });
      // 把消息发送给 websocket 服务器
      socket.emit("message", {
        msg: this.word,
        timestamp: new Date().getTime(),
      });
      // 清空文本框的内容
      this.word = "";
      //滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    // 滚动到页面底部
    scrollToBottom() {
      // 获取到所有的聊天 Item 项
      const chatItem = document.querySelectorAll(".chat-item");
      // 获取到最后一项对应的 DOM 元素
      const lastItem = chatItem[chatItem.length - 1];
      // 调用 scrollIntoView() 方法，显示这个元素
      lastItem.scrollIntoView({
        behavior: "smooth", // 动画平滑
      });
    },
  },
  created() {
    // 创建客户端 websocket 的实例
    socket = io("http://toutiao.itheima.net", {
      query: {
        token: this.token,
      },
      transports: ["websocket"],
    });
    // 建立连接的事件
    socket.on("connect", () => {
      console.log("与服务器建立了连接");
    });
    // 接收到消息的事件
    socket.on("message", (data) => {
      // 把服务器发送过来的消息，存储到 list 数组中
      this.list.push({
        name: "xs",
        msg: data.msg,
      });
      //滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    });
  },
  // 组件被销毁之前，清空 sock 对象
  beforeDestroy() {
    // 关闭连接
    socket.close();

    // 销毁 websocket 实例对象
    socket = null;
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 92px 0 100px 0;
  .chat-list {
    padding-bottom: 100px;
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 20px;
      .van-image {
        vertical-align: top;
        width: 80px;
        height: 80px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 80px;
        max-width: 140%;
        min-height: 80px;
        line-height: 76px;
        border: 1px solid #c2d9ea;
        border-radius: 8px;
        position: relative;
        padding: 0 20px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 28px;
        color: #333;
        &::before {
          content: "";
          width: 20px;
          height: 20px;
          position: absolute;
          top: 24px;
          border-top: 1px solid #c2d9ea;
          border-right: 1px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 30px;
    &::before {
      right: -12px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 30px;
    margin-right: 0;
    &::before {
      left: -10px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 88px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
