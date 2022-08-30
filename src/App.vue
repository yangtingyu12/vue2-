<template>
  <div>
    <keep-alive :exclude="['ArticleDetail', 'Login', 'Search', 'SearchResult']">
    <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="less">
</style>>

