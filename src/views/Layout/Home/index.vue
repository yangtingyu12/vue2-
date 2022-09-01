<template>
  <div>
    <van-nav-bar fixed>
      <template #title>
        <van-button
          round
          class="search_home"
          size="small"
          icon="search"
          @click="$router.push('/search')"
          >搜索</van-button
        >
      </template>
    </van-nav-bar>

    <!-- 频道部分 -->
    <van-tabs v-model="active" sticky animated offset-top="1.226667rem">
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
        <div>
          <!-- 文章列表 -->
          <article-list class="articlelist" :cid="item.id"></article-list>
        </div>
      </van-tab>
    </van-tabs>

    <!-- 编辑频道图标 -->
    <van-icon
      name="plus"
      size="0.37333334rem"
      class="moreChannels"
      @click="show = true"
    />

    <!-- 弹出层组件 -->
    <van-popup v-model="show" class="edit_wrap" @closed="onPopupClosed">
      <!-- 弹出层的主体区域 -->
      <channel-edit
        @removeChannel="removeChannelFn"
        :userChannelList="channelList"
        @close="show = false"
        @addChannel="addChannelFn"
        @changeChannel="channgeChannelFn"
        ref="channelEdit"
      ></channel-edit>
    </van-popup>
  </div>
</template>
<script>
import { userChannelAPI, updateChannelAPI } from "@/api";
import ArticleList from "./components/ArticleList.vue";
import ChannelEdit from "./components/ChannelEdit.vue";
export default {
  name: "Home",
  data() {
    return {
      active: 0,
      channelList: [], // 频道数据
      show: false, //编辑弹窗组件
      scrollTop: [], // 储存滚动位置
    };
  },
  components: {
    ArticleList,
    ChannelEdit,
  },
  activated() {
    // 进入该组件后读取数据变量设置滚动位置
    // 注意, 此处由页面是否具有 DTD (如: `<!DOCTYPE html>`), 决定具体选择, 详见参考资料
    // console.log("~~", this.scrollTop);
    if (this.scrollTop != []) {
      this.scrollTop.forEach(
        (arr, index) =>
          (document.querySelectorAll(".articlelist")[index].scrollTop = arr)
      );

      // document.body.scrollTop = this.scrollTop;
    }
  },
  beforeRouteLeave(to, from, next) {
    // 离开组件时保存滚动位置
    // 注意, 此时需调用路由守卫`beforeRouterLeave`而非生命周期钩子`deactivated`
    // 因为, 此时利用`deactivated`获取的 DOM 信息已经是新页面得了
    // console.log(document.querySelectorAll(".articlelist"));
    this.scrollTop = [];
    document
      .querySelectorAll(".articlelist")
      .forEach((arr) => (this.scrollTop = [...this.scrollTop, arr.scrollTop]));
    // document
    //   .querySelectorAll(".articlelist")
    //   .forEach((arr) => console.log(arr.scrollTop));
    next();
  },
  methods: {
    // 添加频道
    addChannelFn(obj) {
      this.channelList.push(obj);
      // console.log("添加频道成功", this.channelList);
    },
    // 统一更新频道
    async updateChannel() {
      // 先拷贝一份数组(前端页面用channelList, 后端用拷贝出的数组)
      // 数组第一层, 对象里key+value是第二层
      const newArr = this.channelList.map((obj) => {
        const newObj = { ...obj };
        return newObj;
      });
      // 先剔除推荐
      const index = newArr.findIndex((obj) => obj.name === "推荐");
      newArr.splice(index, 1);
      // 转换字段
      newArr.forEach((obj, index) => {
        delete obj.name;
        obj.seq = index + 1;
      });
      // 调用接口
      await updateChannelAPI({
        channels: newArr,
      });
    },
    // 删除频道
    async removeChannelFn(obj) {
      // 找到这个频道在数组下标删除
      const ind = this.channelList.findIndex((item) => item.id === obj.id);
      this.channelList.splice(ind, 1);
      this.updateChannel();
    },
    // 弹层关闭-重置编辑频道状态
    onPopupClosed() {
      this.$refs.channelEdit.isEdit = false;
    },
    // 切换频道
    channgeChannelFn(obj) {
      this.active = obj.id; // 传过来的频道ID, 影响tabs默认v-model的选择
    },
  },
  async created() {
    const res = await userChannelAPI();
    this.channelList = res.data.data.channels;
    console.log("获取频道分类成功", this.channelList);
  },
};
</script>

<style scoped lang="less">
/deep/ .van-nav-bar {
  background-color: #007bff;
  .van-nav-bar__title {
    max-width: unset;
  }
  .search_home {
    width: 555px;
    height: 64px;
  }
}

/* tab内容距离tab导航的距离 */
/deep/ .van-tabs__content {
  padding-top: 44px;
  padding-bottom: 55px;
}
/deep/ .van-tabs__line {
  background-color: #007bff;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 40px;
  background-color: #fff;
}

/deep/ .van-list {
  padding-top: 47px;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 118px;
  right: 8px;
  z-index: 999;
}

/* 频道编辑弹出层铺满屏幕 */
.edit_wrap {
  width: 100%;
  height: 100%;
}
</style>