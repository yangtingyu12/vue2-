<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-fofo
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-model="kw"
        @input="inputFn"
        @search="enterFn"
      />
    </div>

    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div
        class="sugg-item"
        v-for="(str, index) in suggestList"
        :key="index"
        v-html="lightFn(str, kw)"
        @click="clickFn(str)"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn" />
        </template>
      </van-cell>
      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(str, index) in history"
          :key="index"
          @click="hisClickFn(str)"
          >{{ str }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from "@/api";
import { lightFn } from "@/utils/str";
import {setStorage,getStorage} from '@/utils/storage'
export default {
  name: "Search",
  data() {
    return {
      kw: "", // 搜索关键字
      timer: null, // 防抖, 用的定时器
      suggestList: [], // 建议关键字列表
      history: JSON.parse(getStorage("his")) || [], // 搜索历史
    };
  },
  watch: {
    history() {
      setStorage("his", JSON.stringify(this.history));
    },
  },
  methods: {
    lightFn,
    async inputFn() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        if (this.kw.trim() === "") return; // 防止空内容触发下面逻辑
        const res = await suggestListAPI({
          q: this.kw,
        });
        this.suggestList = res.data.data.options;
      }, 500);
    },
    // 输入框回车
    enterFn() {
      this.history.push(this.kw); // 保存搜索关键字
      setTimeout(() => {
        this.$router.push({
          path: `/search/${this.kw}`,
        });
      });
      this.history = Array.from(new Set(this.history)); // 去重
    },
    // 建议列表点击
    clickFn(str) {
      this.$router.push({
        path: `/search/${str}`,
      });
      this.history.push(str); // 保存搜索关键字
      setTimeout(() => {
        this.$router.push({
          path: `/search/${str}`,
        });
      });
      this.history = Array.from(new Set(this.history)); // 去重
    },
    // 历史记录点击
    hisClickFn(str) {
      this.$router.push({
        path: `/search/${str}`,
      });
    },
    // 清空搜索历史
    clearFn() {
      this.history = []; // watch会触发, 把空数组保存到本地
    },
  },
};
</script>

<style scoped lang="less">
.search-header {
  height: 92px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 28px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}

/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**搜索历史 */
.search-icon {
  font-size: 32px;
  line-height: inherit;
}

.history-list {
  padding: 0 20px;
  .history-item {
    display: inline-block;
    font-size: 24px;
    padding: 16px 28px;
    background-color: #efefef;
    margin: 20px 16px 0px 16px;
    border-radius: 20px;
  }
}
</style>
