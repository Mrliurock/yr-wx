<template>
<div class="scenic_lists">
  <div class="scenic_list">
    <div class="scenic_img">
      <router-link :to="{path: '/guide', query: {spotId: spotId, cityCode: cityCode}}" class='scenic_list_link'>
      <div class="scenic_pic" v-if="scenicimage!=''">
        <img v-lazy="imgurl">
        <!-- <i></i> -->
      </div>
      <div class="scenic_pic" v-else>
        <img :src="imurl+ 'dy-tu-01.jpg'">
        <!-- <i></i> -->
      </div>
      <div class="scenic_bt">
        <div class="scenic_t">
          <router-link to='' class='clearfix'>
          <h4>
          {{name}}<i>{{typename}}</i><!-- <b class="fr"><img src="../assets/images/z-icon-06.png" alt=""></b> -->
          </h4>
          </router-link>
        </div>
        <div class="scenic_b clearfix">
          <span class=""><img :src="imurl + 'z-icon-08.png'">&nbsp;&nbsp;{{needticket == 0? '免费': '收费'}}</span>
          <!-- <div class="clearfix"> -->
            <span class=""><img :src="imurl + 'z-icon-07.png'">&nbsp;&nbsp;{{opentime}}</span>
          <!-- </div> -->
        </div>
      </div>
      </router-link>
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
          src: this.imgUrl + this.scenicimage,
          error: api.imgUrl + 'dy-tu-01.jpg'
        },
        imurl: api.imgUrl
      }
    },
    props: ['scenicimage', 'name', 'opentime', 'needticket', 'typename', 'spotId', 'imgUrl', 'cityCode']
  }
</script>
<style type="text/css">
.scenic_lists{
  background-color:#f0f0f0;
  /*padding-bottom: 10px;*/
}
.scenic_list{
  padding: 5px 4px 0px 4px;
  background: #fff;
}
.scenic_img{
  position: relative;
}
/*.scenic_img i{
  background: url(../assets/images/z-yy-icon.png) no-repeat;
  background-size: 100%;
  display: block;
  width: 4rem;
  height: 4rem;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -2rem;
  margin-top: -2rem;
}*/
.scenic_img img{
  display: block;
  width: 100%;
  border-radius: 5px;
  height: auto;
}
.scenic_bt{
  position: absolute;
  top: 1rem;
  left: 0;
  width: 100%;
  padding:0 1rem;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.3)
}
.scenic_t h4{
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
}
.scenic_t h4 i {
    display: inline-block;
    border: 1px solid #fff;
    color: #fff;
    border-radius: 8px;
    font-size: .5rem;
    font-weight: normal;
    padding: 0px 8px;
    height: 1rem;
    line-height: .9rem;
    margin-left: 10px;
    position: relative;
    top: -2px;
}
.scenic_t b{
  display: inline-block;
}
.scenic_t b img{
  width: .5rem;
  display: block;
}
.scenic_b{
  padding: 10px 0;
}
.scenic_b span{
  font-size: 12px;
  color: #f6f6f6;
  margin-right: .5rem;
}
.scenic_b span img{
  width: .7rem;
  display: inline-block;
}
</style>