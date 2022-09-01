<template>
  <div>
    <!-- 二级路由页面 -->
    <div class="home_container">
      <keep-alive>
      <router-view></router-view>
      </keep-alive>
      </div>
    <van-tabbar v-model="active">
      <van-tabbar-item 
      icon="home-o"
      to="Home">首页</van-tabbar-item>
      <van-tabbar-item 
      icon="setting-o"
      to="User">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Layout",
  data() {
    return {
      active: 0,
    };
  },
};
</script >
 
<style scoped lang ="less">
 .home_container{
     padding-bottom: 50px;
  }
  .van-tabbar{
    border-top: 1px solid #f8f8f8;
  }

  
</style>