<template>
  <div class="scenic">
    <div class="scenic_head clearfix">
      <b @click="$router.go(-1)"></b><span v-html="poiData.name"></span><i @click="goGuide"></i>
    </div>
    <div class="swiper_banner">
      <swiper dots-position="center" auto loop :aspect-ratio="400/800" v-if="poiData.images">
        <swiper-item v-for="(item, index) in poiData.images" :key="index" class="swiper_img">
          <img v-lazy="fileUrl + item.url">
        </swiper-item>
      </swiper>
      <swiper dots-position="center" auto loop :aspect-ratio="400/800" v-else>
        <swiper-item v-for="(item, index) in imgList" :key="index" class="swiper_img">
          <img :src="item">
        </swiper-item>
      </swiper>
    </div>
    <div class="scn_title clearfix">
      <div class="scn_title_fl fl">
        <h3 v-html="poiData.name"><!-- <i><img src="../assets/images/ad-icon.png">距离&nbsp;{{distance}}m</i> --></h3>
      </div>
      <div class="scn_title_fr fr" @click="goQj">
        <div class="goqj">
          <img :src="imurl+'b-icon-03.png'">全景
        </div>
      </div>
    </div>
    <div class="snc_des">
      <!-- <div class="des_add">
        <i></i><span>位置</span>
      </div> -->
      <group>
        <cell title="位置" is-link style="font-size:.9rem;color:#6f7575;">
          <img src="../assets/images/dis-icon01.png" slot="icon" width="14" style="display:block;margin-right:5px">
        </cell>
        <cell title="开放时间" is-link style="font-size:.9rem;color:#6f7575;" value="免费">
          <img src="../assets/images/dis-icon02.png" slot="icon" width="16" style="display:block;margin-right:5px">
        </cell>
      </group>  
    </div>
    <div class="scn_text">
      <p v-html="poiData.introduction"></p>
    </div>
    <div class="near_scn">
      <div class="near_head">
        <h3 class="clearfix">附近景点<x-icon type="ios-arrow-right" size="18" style="vertical-align:middle;float:right"></x-icon><i class="fr">查看更多</i></h3>
      </div>
      <div class="near_scn_lists clearfix">
        <div class="near_scn_list fl" v-for="(item, index) in lbsPoiData" :key="index">
          <img :src="imurl+'dy-tu-01.jpg'" v-if="!item.imageurl">
          <img :src="`${fileUrl + item.imageurl}-scenic_img_thumb`" v-else>
          <div class="near_name" @click="changePoi(item.id)">
            <p v-html="item.name"></p>
            <p>距离：{{item.distance}}m</p>
          </div>  
        </div>
      </div>
    </div>
    <x-dialog v-model="choose_language" :dialog-style="{'overflow':'visible','border-radius': '8px'}">
        <div class="gw_dt">
          <img :src="imurl+'alert-bg.png'">
          <div class="gw_close" @click="choose_language=false">
           <img :src="imurl+'close.png'">
          </div>
          <div class="language_lists">
            <!-- <checker v-model="languageChoose" default-item-class="unChoosed" selected-item-class="choosed">
              <checker-item :value="item" v-for="(item, index) in languages" :key="index">
                <div class="lg_list" @click="chooseThis">
                   <span>{{item.soundname}}</span> <i class="chooseIcon"></i>
                </div>
              </checker-item>
            </checker> -->
            <div v-for="(item, index) in languages" class="checkers">
              <input type="radio" :id="item.soundname" :value="item.soundname" v-model.lazy="languageChoose">
              <label class="radioLabel" @click="chooseThis(item)" :for="item.soundname">
                <div class="lg_list">
                  <span>{{item.soundname}}</span> <i class="chooseIcon"></i>
                </div>
              </label>
            </div>
          </div>
        </div>
    </x-dialog>
    <x-dialog v-model="validate" :dialog-style="{'overflow':'visible','border-radius':'8px', 'width': '70%'}">
        <div class="fd_head">授权激活 <span @click="validate=false">&times;</span></div>
        <div style="background-color:#fefefe">
          <textarea v-model="lcsCode" class="lcsCode" v-bind:class="{nonebkg: ison}" @blur="ison=false" @focus="ison=true" type="tel"></textarea>
          <p class="lcstext" v-bind:class="{lcserr: lcserr}">{{lcstext}}</p>
          <div class="two_button">
            <span @click="goOrder">立即购买</span><span @click="lcsTest">验证授权</span>
          </div>
        </div>  
    </x-dialog>
    <div class="yyFoot">
      <div class="yyMain" @click="yyPlay">
        <b v-bind:class="{yyparse: !isParse, cannot: yycannot}"></b><i v-bind:class="{cannot: yycannot}">语音</i></b>
      </div>
      <span class="language" @click="choose_language=true">{{languageChoose?languageChoose: '中文'}}&ensp;&gt;</span>
      <x-progress :percent="yytime" :show-cancel="false" style="width:100%;position:absolute;bottom:0;left:0"></x-progress>
    </div>
    <audio :src="adSrc" controls="controls" id='audio1' hidden="hidden"></audio>
  </div>
</template>
<script>
  import {Swiper, SwiperItem, XProgress, XDialog, Checker, CheckerItem, Group, Cell} from 'vux'
  import api from '../api/api.js'
  import Vue from 'vue'
  const imgList = [
    `${api.imgUrl}dy-tu-01.jpg`]
  export default {
    components: {
      Swiper,
      SwiperItem,
      XProgress,
      XDialog,
      Checker,
      CheckerItem,
      Group,
      Cell
    },
    data () {
      return {
        imgList: imgList,
        isParse: true,
        yytime: 0,
        choose_language: false,
        languages: [],
        languageChoose: null,
        languageDefault: null,
        poiId: '',
        distance: '',
        soundTypes: [],
        poiData: {},
        lbsPoiData: [],
        yycannot: true,
        adSrc: '',
        spotId: '',
        validate: false,
        lcsCode: '',
        lcstext: '亲，直接复制含有激活码的短信至激活码验证框内，系统可以自动识别哦!',
        ison: false,
        lcserr: false,
        fileUrl: api.fileUrl,
        status: 0,
        imurl: api.imgUrl
      }
    },
    methods: {
      goGuide () {
        this.$router.push({path: '/guide', query: {spotId: this.spotId}})
      },
      getAccessToken () {
        let vm = this
        let at = localStorage.getItem(vm.spotId)
        if (at) {
          at = JSON.parse(at)
          let params = {spotId: vm.spotId, accessToken: at.accessToken}
          api.GetAccessToken(params).then(res => {
            if (res.data.status === 1) {
              vm.status = 1
            }
            if (res.data.status === 2) {
              localStorage.removeItem(vm.spotId)
              vm.status = 0
            }
            if (res.data.status === 0) {
              localStorage.removeItem(vm.spotId)
              vm.status = 0
            }
            console.log(vm.status)
          })
        } else {
          vm.status = 0
        }
      },
      lcsTest: function () {
        let vm = this
        let lcs = vm.lcsCode.replace(/(^\s*)|(\s*$)/g, '')
        let params = {spotId: vm.spotId, licenseCode: lcs}
        if (lcs === '') {
          vm.lcstext = '请填写激活码'
          vm.lcserr = true
          return
        }
        api.GetAccessToken(params).then(res => {
          if (res.data.status === 1) {
            vm.lcstext = '恭喜您，验证成功！'
            let obj = {'accessToken': res.data.accessToken}
            let str = JSON.stringify(obj)
            localStorage.setItem(vm.spotId, str)
            vm.status = 1
            vm.lcserr = true
            setTimeout(() => {
              vm.validate = false
            }, 800)
          }
          if (res.data.status === 0) {
            vm.lcserr = true
            vm.lcstext = '很抱歉，验证失败。请仔细检查验证码'
          }
          if (res.data.status === 2) {
            vm.lcserr = true
            vm.lcstext = '激活设备已超出限制，请重新激活'
            localStorage.removeItem(vm.spotId)
          }
        }, err => {
          vm.lcserr = true
          vm.lcstext = '很抱歉，验证失败。请仔细检查验证码'
          console.log(err)
        })
      },
      goOrder: function () {
        this.$router.push({path: '/order', query: {spotId: this.spotId}})
      },
      yyPlay: function () {
        let vm = this
        // let status = localStorage.status
        if (vm.cannot) {
          return
        }
        if (vm.status === 0 && vm.poiData.charge === 1) {
          vm.validate = true
          return
        }
        var audio = document.getElementById('audio1')
        if (audio.paused) {
          this.isParse = false
          audio.play()
        } else {
          this.isParse = true
          audio.pause()
        }
        let yytime = 0
        let that = this
        audio.addEventListener('timeupdate', function () {
          let scales = audio.currentTime / audio.duration
          yytime = parseInt(scales * 100)
          that.yytime = yytime
          if (audio.currentTime === audio.duration) {
            that.isParse = true
          }
        }, false)
      },
      chooseThis: function (value) {
        this.choose_language = false
      },
      goQj: function () {
        if (this.status === 0 && this.poiData.charge === 1) {
          this.validate = true
          return
        }
        window.open(this.poiData.panourl)
      },
      getPoiId () {
        this.poiId = this.$route.query.poiId
        this.distance = this.$route.query.distance
      },
      getPoidata () {
        let vm = this
        let params = {id: vm.poiId}
        vm.lbsPoiData = []
        vm.languages = []
        api.GetPoiDetail(params).then(res => {
          vm.languages = vm.languages.concat(res.data.soundTypes)
          vm.languages.forEach(function (item) {
            if (item.sysdefault === 1) {
              vm.languageDefault = item
            }
          })
          vm.languageChoose = vm.languageDefault.soundname
          vm.poiData = res.data.poiData
          vm.spotId = res.data.poiData.spotid
          vm.lbsPoiData = vm.lbsPoiData.concat(res.data.lbsPoiData)
          console.log(res.data)
          Vue.nextTick(function () {
            vm.getAdSrc()
            vm.getAccessToken()
          })
        })
      },
      getAdSrc () {
        let vm = this
        // let ad = document.getElementById('audio')
        vm.adSrc = ''
        if (vm.poiData.audios.length === 0) {
          vm.yycannot = true
        } else {
          let language = vm.languageChoose
          vm.poiData.audios.forEach(function (audio) {
            if (audio.soundname === language) {
              vm.adSrc = api.fileUrl + audio.url
              vm.yycannot = false
            }
          })
          if (vm.adSrc === '') {
            vm.yycannot = true
          }
        }
      },
      changePoi (id) {
        this.$router.push({path: '/scenicArea', query: {poiId: id}})
        this.poiId = id
        this.getPoidata()
        this.isParse = true
        let audio = document.getElementById('audio1')
        audio.pause()
        this.yytime = 0
      }
    },
    beforeCreated () {
    },
    created: function () {
      this.getPoiId()
    },
    mounted: function () {
      this.getPoidata()
    },
    watch: {
      languageChoose: function () {
        this.getAdSrc()
        this.yytime = 0
        this.isParse = true
        let audio = document.getElementById('audio1')
        audio.pause()
        console.log(this.languageChoose)
      }
    }
  }
</script>
<style scoped>
  .scenic{
    max-width: 768px;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 3rem;
  }
  .scenic_head{
    height: 3rem;
    line-height: 3rem;
    background: #11cd8d;
    color: #fff;
    text-align: center;
    position: relative;
    font-size: 1.2rem;
    width: 100%;
  }
  .scenic_head b,.scenic_head i{
    width: 1rem;
    height: 1.5rem;
    display: inline-block;
    background:url(../assets/images/dis-icon03.png) no-repeat center;
    background-size: 100%;
    position: absolute;
    top: .75rem;
    cursor: pointer;
  }
  .scenic_head b{
    width: .7rem;
    left:1rem;
  }
  .scenic_head i{
    background-image: url(../assets/images/h-icon.png);
    right: 1rem;
    width: 1.5rem;
    height: 1.5rem;
  }
  .swiper_img img{
    width: 100%;
    height: 100%;
  }
.scn_title{ 
  padding: 15px 15px 10px 15px; 
  background: #FFF;
  border-bottom: 1px solid #e5e5e5; 
}
.scn_title_fl {width: 75%;}
.scn_title_fl h3{ font-size: 1.1rem;font-weight: normal;}
.scn_title_fl h3 i{font-size: .9rem; color: #999;margin-left: 1rem;}
.scn_title_fl i img{width:.8rem; margin-right: 5px; margin-top: -3px;vertical-align: middle;}
.scn_title_fr img{width: 1.3rem; margin-right: 5px; vertical-align:middle;}
.scn_title_fr{font-size: 1rem;}
.scn_text{
  padding: 10px 15px;
  background-color: rgb(249, 249, 249);
  font-size: .9rem;
  border-bottom: 1px solid #e5e5e5;
  text-indent: 2em;
}
.scn_text p{
  line-height: 1.5rem;
}
.near_scn{
  padding: 0 15px;
}
.near_head{
  padding: 18px 0;
}
.near_head h3{
  font-size: 1rem;
  font-weight: normal;
  border-left: 2px solid #19cb8f;
  padding-left: 10px;
  line-height: 1rem;
}
.near_head h3 i{
  font-size: .8rem;
  color: #999;
}
.vux-x-icon{
  fill:#999;
}
.near_scn_lists{
  width: 100%;
}
.near_scn_list{
  width: 50%;
  padding: 5px;
  position: relative;
}
.near_scn_list img{
  width: 100%;
  height: 7rem;
}
.near_name{
  width: 100%;
  position: absolute;
  top:50%;
  left: 0;
  margin-top: -1.1rem;
  cursor: pointer;
}
.near_scn_list p{
  width: 90%;
  color: #fff;
  text-align: center;
  font-size: 13px;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 auto;
}
.yyFoot{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 768px;
  margin: 0 auto;
  height: 3.5rem;
  width: 100%;
  background-color: #fff;
  border-top:1px solid #eee;
}
.yyMain{
  width: 5rem;
  height: 5rem;
  position: absolute;
  top:-2.5rem;
  left: 50%;
  margin-left:-2.5rem;
  border-top: 1px solid #10cd8d;
  z-index: 100;
  background-color: #fff;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
}
.yyMain i{
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
}
.yyMain b{
  width: 2rem;
  height: 2rem;
  position: absolute;
  left: 50%;
  top:40%;
  margin: -1rem 0 0 -1rem;
  background:url(../assets/images/b-01.png) no-repeat center;
  background-size: 100%;
}
.yyMain b.yyparse{
  background-image: url(../assets/images/b-02.png);
}
.yyMain b.cannot{
  background-image: url(../assets/images/b-01-01.png);
}
.yyMain i.cannot{
  color: #979797;
}
.language{
  position: absolute;
  right: 3rem;
  top:1rem;
  color: #11cd8d;
  font-size: .8rem;
  border: 1px solid #11cd8d;
  padding: 2px 5px;
  border-radius:10px;
  cursor: pointer;
}
.gw_dt{
    max-width:300px;
    height: auto;
    position: relative;
    border-radius: 8px;
  }
  .gw_dt img{
    width: 100%;
    display: block;
    border-radius: 8px;
  }
  .gw_close{
    width: 2rem;
    position: absolute;
    top:-3rem;
    right:0;
  }
.cl_head {
  position: absolute;
  top:0;
  text-align: center;
  left: 0;
  width: 100%;
  padding: 10px;
}
.language_lists{
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  width: 70%;
  margin: 0 auto;
  font-size: 14px;
  text-align: left;
}
.unChoosed{
  display: block;
}
.radioLabel{
  width: 100%;
  height: auto;
  cursor: pointer;
}
.checkers {
  margin-bottom: .5rem;
}
.checkers input{
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  display:none;
}
.lg_list{
  line-height: 1.2rem;
  position: relative;
  padding: 5px;
}
.chooseIcon{
  display: inline-block;
  width: 1.2rem;
  height: 1.2rem;
  background: url(../assets/images/radio-01.png) no-repeat center;
  background-size: 100%;
  vertical-align: middle;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -.6rem;
}
input:checked + label.radioLabel .chooseIcon{
  background-image: url(../assets/images/radio-02.png);
}
.fd_head {
  height: 3rem;
  width: 100%;
  line-height: 3rem;
  border-bottom: 1px solid #eee;
  position: relative;
}
.fd_head span{
  font-size: 1.5rem;
  position: absolute;
  right: 1rem;
  top:-.1rem;
  cursor: pointer;
}
.lcsCode {
  width: 90%;
  border:1px dashed #dcdcdc;
  height: 6rem;
  background: url(../assets/images/tbg.png) no-repeat center;
  background-size: 80%;
  padding: 5px;
  margin-top: .5rem;
}
.nonebkg{
  background: #fff;
}
.lcstext{
  width: 80%;
  font-size: 12px;
  color: #999;
  margin: 0 auto; 
}
.lcserr{
  color: #fe0338;
}
.two_button{
  margin:1rem 0; 
}
.two_button span{
  display: inline-block;
  height: 2rem;
  line-height: 2rem;
  background-color: #19cb8f;
  margin:0 1rem;
  padding: 0 1rem;
  border-radius: .3rem;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}
.two_button span:first-child{
  background-color: #999;
}
@media screen and (max-width: 320px){
  .two_button span {
    font-size: 12px;
  }
}
@media screen and (min-width: 480px){
  .near_scn_list img{
    height: 10rem;
  }
}
</style>  