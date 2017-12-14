<template>
<div class="sc-list">
  <div class="scenic_list">
    <div class="scenic_img">
      <router-link :to="{path: '/guide', query: {spotId: spotId, cityCode: cityCode}}" class='scenic_list_link'>
      <div class="scenic_pic" v-if="scenic.image!=''">
        <img v-lazy="imgurl">
        <!-- <i></i> -->
      </div>
      <div class="scenic_pic" v-else>
        <img :src="imurl+ 'dy-tu-01.jpg'">
        <!-- <i></i> -->
      </div>
      <span class="adcount">{{scenic.audiocount}}个讲解</span>
      </router-link>
    </div>
    <div class="scenic_bt">
       <h4>{{scenic.name}}<span>{{scenic.address}}</span></h4>
       <div><img src="../assets/images/ell.png">{{scenic.levelname}}&nbsp;{{scenic.typename}}&nbsp;{{scenic.needticket?'收费':'免费'}}</div>
    </div>
    <div class="scenic_ad">
      <img src="../assets/images/sadd.png">{{scenic.dis?scenic.dis:'0m'}}<img src="../assets/images/slis.png">{{scenic.readcount}}次
    </div>
  </div>
</div>
</template>
<script type="text/javascript">
  import api from '../api/api.js'
  export default {
    data () {
      return {
        imgurl: {
          src: api.fileUrl + this.scenic.image,
          error: api.imgUrl + 'dy-tu-01.jpg'
        },
        imurl: api.imgUrl
      }
    },
    props: ['scenic', 'spotId', 'cityCode']
  }
</script>
<style type="text/css" scoped>
  .sc-list{
    padding: 5px;
    font-family: Heiti SC;
  }
  .scenic_list{
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 5px;
  }
  .scenic_img{
    position: relative;
  }
  .scenic_img img{
    display: block;
    width: 100%;
    height: 45vw;
    max-height: 337px;
  }
  .adcount{
    background-color: #19cb8f;
    padding: 3px 10px;
    position: absolute;
    top:1rem;
    right: .5rem;
    font-size: .8rem;
    color: #fff;
    border-radius: 3px;
  }
  .scenic_bt{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 2px 0;
  }
  .scenic_bt h4 span{
    color: #19cb8f;
    border-radius: 2px;
    border: 1px solid #19cb8f;
    background: #bff5e3;
    padding: 2px 5px;
    font-size: 12px;
    transform: scale(0.8);
    display: inline-block;
    font-weight: normal;
  }
  .scenic_bt div,.scenic_ad{
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #8f8f8f;
  }
  .scenic_bt div img{
    width: 15px;
    height: 15px;
    margin-right: .5rem;
  }
  .scenic_ad img{
    height: 12px;
    width: 10px;
    margin-right: 5px;
  }
  .scenic_ad img:last-child{
    width: 12px;
    margin-left: 8px;
  }
  </style>