<template>
  <div class="article-list">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="50"
        :immediate-check="false"
      >
        <!-- 文章列表 -->
        <article-item
          :obj="item"
          v-for="item in articleList"
          :key="item.art_id"
          @dislike="dislikeFn"
          @reports="reportsFn"
          @click.native="$router.push(`/article_detail?aid=${item.art_id}`)"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script >
import { MyNotify } from '@/utils/Notify'
import ArticleItem from "./ArtileItem.vue";
import { articlesListAPI, articleDislikeAPI, articleReportsAPI } from "@/api";
import { timeAgo } from "@/utils/date";
import { Notify } from "vant";
export default {
  name: "articleList",
  data() {
    return {
      articleList: [],
      nextTime: null,
      loading: false,
      finished: false,
      isLoading: false, // 顶部刷新状态
    };
  },
  props: {
    cid: {
      // 文章信息对象
      type: Number,
      default() {
        return 0;
      },
    },
  },

  // 核心代码
  methods: {
    timeAgo,

    // 顶部刷新事件方法
    onRefresh() {
      this.nextTime = null;
      this.articleList = [];
      this.getArticleList();
      console.log("刷新成功");
    },
    async onLoad() {
      if (this.articleList.length > 0) {
        this.getArticleList();
      }
    },
    async getArticleList() {
      // 负责拿文章列表数据
      const res = await articlesListAPI({
        channelId: this.cid,
        timestamp: this.nextTime,
      });
      console.log("新加载的数据", res, this.cid);
      // 回来的数据进行预处理, 把时间转成多久多久之前
      res.data.data.results.forEach((obj) => {
        obj.pubdate = this.timeAgo(obj.pubdate);
      });

      // 如果无数据
      if (res.data.data.results.length === 0) {
        this.finished = true; // 告诉list组件直接底部显示没有更多数据
      } else {
        this.nextTime = res.data.data.pre_timestamp; // 保存下一页数据的时间(做分页用)
        this.articleList = [...this.articleList, ...res.data.data.results];
        // 等待网络请求结果后
        this.loading = false; // 底部加载更多状态
        this.isLoading = false; // 顶部加载状态关闭
      }
    },
    // 反馈(不感兴趣)
    async dislikeFn(obj) {
      // console.log(obj)

      await articleDislikeAPI({
        target: obj.art_id,
      });
      MyNotify({
        type: "success",
        message: "反馈成功",
        className: "Notifyclass",
      });
    },
    // 反馈(举报)
    async reportsFn(obj, type) {
      try {
        await articleReportsAPI({
          target: obj.art_id,
          type: type,
          remark: "就是其他问题",
        });
        MyNotify({ type: "success", message: "举报成功" });
      } catch (err) {
        MyNotify({ type: "warning", message: "举报失败" });
      }
    },
  },

  components: {
    ArticleItem,
  },
  async created() {
    this.getArticleList();
  },
};
</script>
<style scoped lang="less">
.article-list {
  height: 85vh;
  overflow-y: auto;
}
</style>

