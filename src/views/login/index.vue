<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录" />
    <!-- /导航栏 -->
    <!-- 登录表单 -->
    <van-form @submit="onSubmit">
      <van-field
        v-fofo
        v-model="user.mobile"
        name="mobile"
        :placeholder="placeholder1"
        :rules="[{ required: true, message: '请填写手机号' }]"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        :placeholder="placeholder2"
        :rules="[{ required: true, message: '请填写验证码' }]"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-button
            class="send-sms-btn"
            round
            size="small"
            type="default"
            @click.prevent
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          class="login-btn"
          block
          type="info"
          native-type="submit"
          :loading="isLoding"
          :disabled="isLoding"
          loading-text="程序员拼命加载ing..."
        >
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { MyNotify } from "@/utils/Notify";
export default {
  name: "LoginPage",
  data() {
    return {
      user: {
        mobile: "",
        mobile: "",
      },
      token: "",
      refresh_token: "",
      isLoding: false,
      placeholder1: "手机号",
      placeholder2: "验证码",
    };
  },
  methods: {
    async onSubmit() {
      this.user.isLoding = true;
      try {
        await this.$store.dispatch("asyncLoginAction", this.user);
        MyNotify({ type: "success", message: "登录成功" });
        // console.log(this)
        // this.$Dialog.alert({
        //   message: "登录成功",
        // }).then(() => {
        //   // on close
        // });
        this.$router.replace(
          { path: this.$route.query.path || "/layout" },
          () => {},
          () => {}
        );
      } catch (error) {
        MyNotify({ type: "warning", message: "手机号或验证码错误" });
      }

      // this.user.isLoding = false;
    },
  },
};
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    // width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
