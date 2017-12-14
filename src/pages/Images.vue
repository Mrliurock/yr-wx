<template>
  <div class="images">
    <div class="images_head clearfix">
      <b @click="$router.go(-1)"></b><span v-html="poiData.name"></span>
    </div>
    <!-- <div class="big_img" v-if="poiData.imageurl">
      <img :src="fileUrl + poiData.imageurl">
      <span @click="goQj"><i><img src="../assets/images/dy-icon-02.png"></i>点击看全景</span>
    </div> -->
    <div class="img_lists clearfix">
      <div v-for="(item, index) in imgLists" class="list-div">
        <img class="list-img" :src="`${item.src}-scenic_img_thumb`" @click="show(index)">
        <span>{{item.name}}</span>
      </div>
        <div v-transfer-dom>
          <previewer :list="imgLists" ref="previewer" :options="options"></previewer>
        </div>
    </div>
    <div class="moreImgs" @click="loadMoreImg">
      <load-more :show-loading="loading" :tip="loadText" background-color="#fbf9fe"></load-more>
    </div>
  </div>
</template>
<script>
  import {Previewer, TransferDom, LoadMore} from 'vux'
  import api from '../api/api.js'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Previewer,
      LoadMore
    },
    created () {
      this.getPoiId()
      this.fetchImgs()
    },
    watch: {
      '$route': 'fetchImgs'
    },
    methods: {
      show (index) {
        this.$refs.previewer.show(index)
      },
      getPoiId () {
        this.poiId = this.$route.query.poiId
      },
      fetchImgs: function () {
        let vm = this
        let params = {id: vm.poiId}
        api.GetPoiDetail(params).then(res => {
          vm.poiData = res.data.poiData
          if (vm.poiData.images.length <= 8) {
            vm.loadText = '暂时没有更多图片'
          } else {
            vm.loadText = '点击加载更多'
          }
          vm.poiData.images.forEach(function (item) {
            let img = item
            vm.$set(img, 'src', api.fileUrl + item.url)
            vm.imgListsAll.push(img)
          })
          vm.imgLists = vm.imgListsAll.slice(0, 8)
          console.log(vm.poiData)
        })
        // this.imgListsAll = imgLists
      },
      loadMoreImg: function () {
        if (this.poiData.images.length <= 8) {
          return
        }
        this.loading = true
        this.loadText = '正在加载中'
        this.clickCount++
        let imgEnd = this.clickCount * 8
        if (imgEnd >= this.imgListsAll.length) {
          this.loading = false
          this.loadText = '暂时没有更多图片'
          imgEnd = this.imgListsAll.length
        }
        this.imgLists = this.imgListsAll.slice(0, imgEnd)
        this.loading = false
      },
      goQj () {
        window.open(this.poiData.panourl)
      }
    },
    data () {
      return {
        poiId: '',
        poiData: {},
        imgLists: [],
        fileUrl: api.fileUrl,
        imgListsAll: [],
        clickCount: 1,
        loading: false,
        loadText: '',
        options: {
          getThumbBoundsFn (index) {
            let thumbnail = document.querySelectorAll('.list-img')[index]
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            let rect = thumbnail.getBoundingClientRect()
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          }
        }
      }
    }
  }
</script>
<style scoped>
  .images{
    max-width: 768px;
    width: 100%;
    margin: 0 auto;
  }
  .images_head{
    height: 3rem;
    line-height: 3rem;
    background: #11cd8d;
    color: #fff;
    text-align: center;
    position: relative;
    font-size: 1.2rem;
  }
  .images_head b{
    width: .7rem;
    height: 1.5rem;
    display: inline-block;
    background:url(../assets/images/dis-icon03.png) no-repeat center;
    background-size: 100%;
    position: absolute;
    top: .75rem;
    left: 1rem;
    cursor: pointer;
  }
  .big_img{
    width: 100%;
    position: relative;
  }
  .big_img>img{
    width: 100%;
  }
  .big_img span{
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    color: #fff;
    background-color: rgba(0,0,0,0.5);
    border-radius: 1rem;
    font-size: .9rem;
    padding: 5px 10px;
  }
  .big_img span img{
    width: 1rem;
    vertical-align: middle;
    margin-right: .5rem;
  }
  .list-img{
    display: block;
    width: 100%;
    padding: 5px;
    height: 8rem;
  }
  .list-div{
    width: 50%;
    float: left;
    position: relative;
  }
  .list-div span{
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    color: #fff;
  }
  @media screen and (min-width: 700px) {
    .list-div{
      width: 25%;
    }
  }
</style>
