<template>
  <div class="xz_search">
    <div class="xz_search_box">
      <button class="xz_search_btn">
      <img src="../assets/images/xz-icon-02.png">
      </button>
      <input class="xz_search_txt" v-model="search_txt" type="text" placeholder="广州">
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {

  }
</script>
<style type="text/css">
.xz_search{background: #f3f2f5; padding:15px;max-width: 1200px;margin: 0 auto;}
.xz_search_box{ border-radius: 15px;box-shadow: 0 0 0.5px rgba(0,0,0,0.2); overflow: hidden; }
.xz_search_box .xz_search_btn{width:10%; height:2rem; line-height: 2rem; background: #FFF; border:none;float:left; ; outline: none; cursor: pointer;}
.xz_search_box .xz_search_btn img{width:1rem;vertical-align: middle;}
.xz_search_box .xz_search_txt{ width: 90%; height: 2rem; line-height: 2rem; border: none;float:left ;outline: none; padding:0 5px;}
</style>