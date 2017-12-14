<template>
  <div class="guide" @click="jdWsjOut=false">
    <div class="loading" v-if="isload">
      <div class="loadicon">
        <vue-loading></vue-loading>
        <p>加载中</p>
      </div>
    </div>
      <!-- <x-dialog v-model="guideWelcome" :dialog-style="{'overflow':'visible','border-radius':'8px'}">
        <div class="gw_dt">
          <img src="../assets/images/tc-tu-02.jpg">
          <div class="gw_close" @click="closeDialog">
           <img src="../assets/images/close.png">
          </div>
          <div class="close_btn" @click="closeDialog">
            <x-button type="primary" style="border-radius:30px;">确定</x-button>
          </div>  
        </div>
      </x-dialog>
      <x-dialog v-model="wxDialog" :dialog-style="{'overflow':'visible','border-radius':'8px'}">
        <div class="gw_dt">
          <img src="../assets/images/wxdialog.png">
          <div class="gw_close" @click="clwxDialog">
           <img src="../assets/images/close.png">
          </div>
          <div class="wxEWM">
            <img src="../assets/images/ewm01.jpg">
            <p>景区</p>
          </div>
          <div class="ylyEWM">
            <img src="../assets/images/ewm02.jpg">
            <p>翼旅游</p>
          </div> 
        </div>
      </x-dialog> -->
      <!-- <x-dialog v-model="choose_ditu" :dialog-style="{'overflow':'visible'}">
        <div class="gw_dt">
          <img src="../assets/images/alert-bg.png">
          <div class="gw_close" @click="choose_ditu=false">
           <img src="../assets/images/close.png">
          </div>
          <div class="choose_pth" @click="choose2d">
            <span>2D地图</span><check-icon :value.sync="ditu2d" class="fr"></check-icon>
          </div>
          <div class="choose_English" @click="choose3d">
            <span>3D地图</span><check-icon :value.sync="ditu3d" class="fr"></check-icon>
          </div>
        </div>
      </x-dialog> -->
      <x-dialog v-model="btnOut" hide-on-blur></x-dialog>
      <!-- 语言选择Dialog -->
      <x-dialog v-model="choose_language" :dialog-style="{'overflow':'visible','border-radius':'8px'}">
        <div class="gw_dt">
          <img :src="imurl + 'alert-bg.png'">
          <div class="gw_close" @click="choose_language=false">
           <img :src="imurl+'close.png'">
          </div>
          <div class="cl_head">语音类型</div>
          <div class="language_lists">
            <!-- <checker v-model="languageChoose" default-item-class="unChoosed" selected-item-class="choosed">
              <checker-item :value="item" :key="index" v-for="(item, index) in languages" @on-item-click="chooseThis(languageChoose)">
                <div class="lg_list">
                   <span>{{item.soundname}}</span> <i class="chooseIcon"></i>
                </div>
              </checker-item>
            </checker> -->
            <div v-for="(item, index) in languages" class="checkers">
              <input type="radio" :id="item.soundname" :value="item.scode" v-model.lazy="languageChoose">
              <label class="radioLabel" @click="chooseThis(item)" :for="item.soundname">
                <div class="lg_list">
                  <span>{{item.soundname}}</span> <i class="chooseIcon"></i>
                </div>
              </label>
            </div>
          </div>
          <!-- <div class="choose_pth" @click="choosePth">
            <span>普通话</span><check-icon :value.sync="putonghua" class="fr"></check-icon>
          </div>
          <div class="choose_English" @click="chooseEnl">
            <span>英语</span><check-icon :value.sync="English" class="fr"></check-icon>
          </div> -->
        </div>
      </x-dialog>
      <!-- 意见反馈Dialog -->
      <x-dialog v-model="feedback" :dialog-style="{'overflow':'visible','border-radius':'8px', 'width': '70%'}">
        <div class="fd_head">意见反馈 <span @click="feedback=false">&times;</span></div>
        <div class="phone" style="padding:5px 8px">
          <p style="text-align:left;font-size:.8rem;">联系方式(手机号/QQ/微信)：</p>
          <input v-model="phone" placeholder="" type="tel" />
        </div>
        <div class="phone" style="padding:5px 8px">
          <p style="text-align:left;font-size:.8rem;">联系人：</p>
          <input v-model="user" placeholder=""/>
        </div>
        <div class="fd_text" style="padding:5px 8px;font-size:.8rem;">
          <p style="text-align:left">意见或者问题：</p>
          <textarea placeholder="请写下您的宝贵建议或者问题，我们会认真改进的哦！" v-model="fdTT" style="padding:3px"></textarea>
          <div class="fd_err" v-show="fdErr">{{fdErrt}}</div>
        </div>
        <div class="fd_smt">
          <span @click="fdsmt">提交</span>
        </div>
      </x-dialog>
      <alert v-model="alertShow" title="定位失败!">请确认是否已允许浏览器定位</alert>
      <confirm v-model="outscn" title="定位到您当前不在景区范围内" confirm-text="继续导航" cancel-text="取消" style="font-size:14px" @on-confirm="onConfirm"></confirm>
      <!-- 支付验证Dialog -->
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
      <!-- <popup v-model="leftMenu" hide-on-blur position="right" :popup-style="{'background-color':'#fff','padding-left':'.5rem'}">
          <group>
            <i class="icon_bf"></i>
            <x-switch v-model="ifbf" title="自动播放"></x-switch>  
            <i class="icon_bf"></i>
            <x-switch v-model="ifdt" title="3D地图"></x-switch>
          </group>   
      </popup> -->
      <!-- <div class="guide_head">
        免费导游
      </div> -->
      <popup v-model="lineOut" position="bottom" :show-mask=false width="100%" height="auto" :popup-style="{'background-color':'#fff','overflow-y':'hidden','padding-bottom':''}">
        <p class="line_head">路线选择<x-icon type="ios-close-empty" size="30" @click="closeline" class="close_icon"></x-icon></p>
        <checker v-model="linecheck" default-item-class="linelist" selected-item-class="lineck" @on-change="linechange">
          <checker-item v-for="(item, index) in linelists" :key="index" :value="item">
            <div class="ck-list">
              <img src="../assets/images/l1.png"><span>{{item.name}}</span><div></div>
            </div>
          </checker-item>
        </checker>
        <transition name="fade">
        <div v-if="linedtOut">
          <p class="line_head">{{linecheck.name}}（途径{{routePois.length}}个景点 | 约{{linecheck.distotal}}）<x-icon type="ios-close-empty" size="30" @click="closelinedt"></x-icon></p>
          <div class="line-dt">
            <div class="l-lists">
              <div class="l-list" v-for="(item,index) in routePois" :key="index">
                <div>
                  <img :src="imurl+'hot-tu.jpg'">
                  <p>{{item.name}}</p>
                </div>
                <img :src="imurl+'lra.png'">
              </div>
            </div>
          </div>
        </div>
      </transition>
      </popup>
      <div class="guide_main">
        <div class="amap-marker-label" id="dvCompute"></div>
        <div class="poi-img" id="poiimg"></div>
        <div id="map"></div>
        <div class="go_all_scenic">
          <router-link :to="{path: '/home', query: {cityCode: $route.query.cityCode}}">
            <i><img :src="imurl+'icon01.png'"></i>全部景区
          </router-link>
        </div>
        <!-- <div class="linedt" v-if="linecheck?true:false" @click="linedtOutmd">{{linecheck.name}}</div> -->
        <div class="linedt" v-if="routeLine" @click="routeLineOff">关闭路线</div>
        <!-- <div class="left_manu" @click="leftMenu=true">
        </div> -->
        <div class="logo"><img :src="imurl+'logo01.png'"></div>
        <!-- <div class="ditu3d" v-bind:class="{ ditu3d_on : ditu3dOn}" @click="dituChange"></div> -->
        <div class="top-menu">
          <div @click="opLanguage"><div class="language"></div><div class="text">语言</div></div>
          <div @click="lineOutmd"><div class="line" ></div>
          <div class="text">路线</div></div>
          <div><div class="autoPlay"><my-switch @clk="ckchange" :status="status"></my-switch>
          <div class="text">自动</div></div>
          </div>
        </div>
        <div class="fdback" v-show="!ifGdftm" @click="feedbackOut"></div>
        <!-- <div class="left_refresh" @click="$router.go(0)"></div> -->
        <div class="address_now" v-show="!ifGdftm" @click="location">
        </div>
        <!-- <div class="wx_wb">
          <div class="weixin" @click="opwxDialog">
            <img src="../assets/images/zc-07.png">
            <span>微信</span>
          </div>
          <div class="weibo">
            <img src="../assets/images/zc-06.png">
            <span>微博</span>
          </div>
        </div> -->
        <div class="arrowOut" @click.stop="jdWsjOut=true"><img :src="imurl+'arrow2-01.png'"></div>
        <div class="shop_wsj" v-bind:class="{out: jdWsjOut}">
          <div class="shopping" @click="getJDpot">
            <img :src="imurl+'t-02-01.png'">
            <span>景点</span>
          </div>
          <div class="jindian" @click="getWSJpot">
            <img :src="imurl+'t-03-01.png'">
            <span>卫生间</span>
          </div>
          <div class="weisj" @click="getQTpot">
            <img :src="imurl+'t-01-01.png'">
            <span>其他</span>
          </div>
        </div>
        <div class="bottom_menu" v-show="btmn">
          <span class="bbtn btn00" @click="btnOut = !btnOut" v-bind:class="{rotate: btnOut}"></span>
          <transition name="fade" v-for="(item, index) in menus" :key="index">
            <div :class="'dli dli0' + (index+1)"  v-if="btnOut" @click="btGo(item.linkurl)">
              <div :class="'bbtn btn0' + (index+1)"><img :src="fileUrl+item.icon"></div>
              <span>{{item.name}}</span>
            </div>
          </transition>
          <!-- <transition name="fade">
            <div class="dli dli02"  v-if="btnOut">
              <div class="bbtn btn02">活动</div>
               <span>活动</span>
            </div>     
          </transition>
          <transition name="fade">
          <div class="dli dli03"  v-if="btnOut">
            <div class="bbtn btn03">购票</div>
            <span>购票票票</span>
          </div>
          </transition>
          <transition name="fade">
          <div class="dli dli04" v-if="btnOut"> 
            <div class="bbtn btn04">电话</div>
            <span>电话话</span>
          </div>       
          </transition>
          <transition name="fade">
          <div class="dli dli05" v-if="btnOut">
            <div class="bbtn btn05">其他</div>
            <span>其他</span>
          </div> 
          </transition> -->  
        </div>
        <!-- <div class="ceshidian" style="position:absolute;top:50%;left:50%;" @click="ifGdftm=true">
          <img src="../assets/images/zb.png">
        </div> -->
      </div>
      <!-- <div class="guide_foot" v-if="ifGdft">
        <ul class="clearfix">
          <li>
            <router-link to="">
              <img src="../assets/images/tuji.png" align="absmiddle" class="tuji"><i>图集</i>
            </router-link>
          </li>
          <li @click="gdftmOut">
            <img src="../assets/images/yuyin.png" class="yuyin"><i>语音</i>
          </li>
          <li>
            <router-link to="">
              <img src="../assets/images/quanjing.png" align="absmiddle"><i>全景</i>
            </router-link>
          </li>
        </ul>
      </div> -->
      <transition name="fade">
      <div class="guide_foot_main" v-if="ifGdftm">
        <div class="goThere" @click="goThere">
          <img :src="imurl+'go-icon.png'">
          <p>去这里</p>
        </div>
        <x-icon type="ios-arrow-up" size="28" @click="textOut" v-if="!ifTextOut"></x-icon>
        <x-icon type="ios-arrow-down" size="28" @click="textIn" v-if="ifTextOut"></x-icon>
        <x-icon type="ios-close-empty" size="30" @click="closeFoot" class="close_icon"></x-icon>
        <div class="scenic_distance">
          <h3 v-html="poiData.name"></h3>
          <p><span></span>距离&nbsp;{{distance}}</p>
        </div>
        <div class="tjYyQj clearfix">
          <div class="tj fl" @click="goImg">
            <b></b><i>图集</i>
          </div>
          <div class="yy" @click="yyPlay">
            <b v-bind:class="{yyparse: !isParse, cannot: cannot}"></b><i v-bind:class="{cannot: cannot}">语音</i>
            <!-- <span class="language">普通话&ensp;&gt;</span> -->
          </div>
          <div class="qj fr" @click="goQj">
            <b></b><i>全景</i>
          </div>
        </div>
        <x-progress :percent="yytime" :show-cancel="false" style="background:#fff;"></x-progress>
        <div class="scenic_text" v-if="ifTextOut" v-html="poiData.introduction">
        </div>
      </div>
      </transition>
  </div>
</template>
<script type="text/javascript">
  import VueLoading from '../components/vueLoading'
  import MySwitch from '../components/mySwitch'
  import { XDialog, XButton, CheckIcon, Checker, CheckerItem, XProgress, Tabbar, TabbarItem, Popup, XSwitch, Group, Alert, Timeline, TimelineItem, Confirm, TransferDomDirective as TransferDom } from 'vux'
  import AMap from 'AMap'
  // import AMapUI from 'AMapUI'
  import api from '../api/api.js'
  import Vue from 'vue'
  var map, mapleLayer, geolocation, line, movemk, warking, cluster, routeLine
  let aCluster = 1
  var markers1 = []
  var markers2 = []
  var scnmarkers = []
  var resultsCache = {}
  function init () {
    map = new AMap.Map('map', {
      center: [113.265701, 23.137924],
      resizeEnable: true,
      zooms: [3, 18],
      expandZoomRange: true,
      baseRender: 'd',
      zoom: 10
    })
  }
  function Dictionary () {
    this.data = []
    this.put = function (key, value) {
      this.data[key] = value
    }
    this.get = function (key) {
      return this.data[key]
    }
    this.remove = function (key) {
      this.data[key] = null
    }
    this.isEmpty = function () {
      return this.data.length === 0
    }
    this.size = function () {
      return this.data.length
    }
  }
  var poiMarkersLayer = new Dictionary()
  var poiMarkers = new Dictionary()
  var scnMarkers = new Dictionary()
  export default {
    directive: {
      TransferDom
    },
    components: {
      XDialog,
      XButton,
      Tabbar,
      TabbarItem,
      Popup,
      XSwitch,
      Group,
      XProgress,
      CheckIcon,
      Checker,
      CheckerItem,
      Alert,
      VueLoading,
      MySwitch,
      Timeline,
      TimelineItem,
      Confirm
    },
    data () {
      return {
        isload: true,
        guideWelcome: true,
        choose_language: false,
        ifbf: true,
        ifdt: false,
        wxDialog: false,
        btnOut: false,
        ifGdftm: false,
        yytime: 0,
        isParse: true,
        ifTextOut: false,
        putonghua: true,
        English: false,
        choosed: false,
        ditu3dOn: true,
        alertShow: false,
        cannot: true,
        jdWsjOut: false,
        feedback: false,
        validate: false,
        ison: false,
        lcserr: false,
        btmn: false,
        lineOut: false,
        linedtOut: false,
        outscn: false,
        languages: [],
        languageChoose: null,
        routeLine: false,
        languageDefault: {},
        spotId: '',
        scnDetail: {},
        poiTypes: [],
        scenicPois: [],
        soundTypes: [],
        spotinfo: {},
        spotinfoattr: {},
        menus: [],
        poiData: null,
        distance: '???',
        adSrc: '',
        phone: '',
        user: '',
        fdTT: '',
        fdErr: false,
        fdErrt: '',
        lcsCode: '',
        lcstext: '亲，直接复制含有激活码的短信至激活码验证框内，系统可以自动识别哦!',
        status: 0,
        imurl: api.imgUrl,
        fileUrl: api.fileUrl,
        linelists: [],
        linecheck: null,
        routepath: [],
        routePois: [],
        localPoi: null,
        iconSize: {w: 40, h: 43},
        ck: false
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.$route.query.spotId !== vm.spotId) {
          vm.$router.go(0)
        }
        vm.getAccessToken()
      })
    },
    methods: {
      closeDialog: function () {
        this.guideWelcome = false
      },
      opwxDialog: function () {
        this.wxDialog = true
      },
      clwxDialog: function () {
        this.wxDialog = false
      },
      textOut: function () {
        this.ifTextOut = true
      },
      textIn: function () {
        this.ifTextOut = false
      },
      closeFoot: function () {
        this.ifGdftm = false
        this.btmn = true
      },
      closeline () {
        this.lineOut = false
        this.btmn = true
      },
      closelinedt () {
        this.linedtOut = false
      },
      // linedtOutmd () {
      //   if (this.linedtOut) {
      //     this.btmn = true
      //     this.linedtOut = false
      //   } else {
      //     this.btmn = false
      //     this.ifGdftm = false
      //     this.lineOut = false
      //     this.linedtOut = true
      //   }
      // },
      //  弹出路线选择界面
      lineOutmd () {
        if (this.lineOut) {
          this.btmn = true
          this.lineOut = false
        } else {
          this.btmn = false
          this.ifGdftm = false
          this.lineOut = true
        }
      },
      getlinelists () {
        let vm = this
        let params = {spotid: vm.spotId}
        api.GetLine(params).then(res => {
          vm.linelists = vm.linelists.concat(res.data)
        })
      },
      //  选择路线
      linechange () {
        let linecheck = this.linecheck
        let vm = this
        if (linecheck) {
          if (line) {
            line.setMap(null)
            line = null
          }
          if (movemk) {
            movemk.stopMove()
            movemk.setMap(null)
            movemk = null
          }
          if (scnmarkers.length) {
            scnmarkers.forEach((item) => {
              item.setContent('')
              item.setIcon(item.getIcon())
            })
            scnmarkers = []
          }
          let params = {id: linecheck.id}
          vm.routepath = []
          vm.routePois = []
          api.GetLineDt(params).then(res => {
            let rpath = res.data.routepath
            let calAg = false
            rpath = JSON.parse(rpath)
            // rpath = rpath.match(/\[[0-9]*.[0-9]*,[0-9]*.[0-9]*]/g)
            vm.routepath = vm.routepath.concat(rpath)
            vm.routePois = vm.routePois.concat(res.data.routePois)
            let distotal = 0
            vm.routePois.forEach((item, i) => {
              if (i > 0) {
                let fpoi = new AMap.LngLat(Number(vm.routePois[i - 1].longitude), Number(vm.routePois[i - 1].latitude))
                let dist = fpoi.distance([Number(vm.routePois[i].longitude), Number(vm.routePois[i].latitude)])
                distotal += dist
              }
            })
            distotal = distotal > 1000 ? (distotal / 1000).toFixed(1) + '公里' : distotal.toFixed(0) + '米'
            vm.$set(vm.linecheck, 'distotal', distotal)
            if (vm.routepath.length > 0) {
              line = new AMap.Polyline({
                path: vm.routepath,
                strokeColor: '#f607dd',
                showDir: true,
                strokeWeight: 5,
                strokeStyle: 'solid',
                lineJoin: 'round'
              })
              movemk = new AMap.Marker({
                icon: new AMap.Icon({
                  size: new AMap.Size(48, 48),
                  image: api.imgUrl + 'moveg.gif',
                  imageSize: new AMap.Size(48, 48)
                }),
                position: [vm.routepath[0].lng, vm.routepath[0].lat]
              })
              line.setMap(map)
              map.setFitView([line])
              movemk.setMap(map)
              movemk.moveAlong(vm.routepath, 50, function (k) {
                if (k < 0.01) {
                  calAg = true
                  return k
                } else {
                  return k
                }
              }, true)
              AMap.event.addListener(movemk, 'moving', function (e) {
                if (calAg) {
                  calAg = false
                  let end = e.passedPath[e.passedPath.length - 1]
                  let start = e.passedPath[e.passedPath.length - 2]
                  //  经纬度转为容器像素坐标
                  let pxe = map.lnglatTocontainer([end.lng, end.lat])
                  let pxs = map.lnglatTocontainer([start.lng, start.lat])
                  let pxX = pxe.getX() - pxs.getX()
                  let pxY = pxe.getY() - pxs.getY()
                  let ag = vm.angle(pxX, pxY)
                  // if (Math.abs(pxX) <= 5 && Math.abs(pxY) <= 5) {
                  //   console.log(pxe, pxs)
                  //   console.log(e.passedPath)
                  //   return
                  // } else {
                  //   ag = vm.angle(pxX, pxY)
                  // }
                  let icon
                  if (ag > 90 && ag <= 270) {
                    icon = new AMap.Icon({
                      size: new AMap.Size(48, 48),
                      image: api.imgUrl + 'moveg2.gif',
                      imageSize: new AMap.Size(48, 48)
                    })
                  } else {
                    icon = new AMap.Icon({
                      size: new AMap.Size(48, 48),
                      image: api.imgUrl + 'moveg.gif',
                      imageSize: new AMap.Size(48, 48)
                    })
                  }
                  if (JSON.stringify(movemk.getIcon()) === JSON.stringify(icon)) {
                    return
                  } else {
                    movemk.setIcon(icon)
                  }
                  console.log(ag)
                } else {
                  return
                }
              })
            }
              // AMap.event.addListener(movemk, 'moving', function (e) {
              //   let end = e.passedPath[e.passedPath.length - 1]
              //   let start = e.passedPath[e.passedPath.length - 2]
              //   // console.log(vm.angle(start, end))
              // })
            if (vm.routePois.length > 0) {
              scnmarkers = []
              vm.routePois.forEach((item, index) => {
                let scnMarker = scnMarkers.get(item.id)
                let divCotent = `<div class="amap-marker-content" style="opacity: 1;"><div class="amap-simple-marker"><div class="amap-simple-marker-icon"><img class="amap-simple-marker-icon-img" src="${api.imgUrl + 'linepoi.png'}" style="width: 40px; height: 43px;"></div><div class="cluster-marker-label">${index + 1}</div></div></div>`
                scnMarker.setContent(divCotent)
                scnmarkers.push(scnMarker)
              })
            }
          })
          vm.linedtOut = true
        } else {
          movemk.stopMove()
          movemk.setMap(null)
          line.setMap(null)
          if (scnmarkers.length) {
            scnmarkers.forEach((item) => {
              item.setContent('')
              item.setIcon(item.getIcon())
            })
            scnmarkers = []
          }
          vm.routePois = []
          vm.routepath = []
          vm.linedtOut = false
        }
      },
      //  计算坐标角度
      angle (pxX, pxY) {
        let ag
        if (pxX === 0) {
          if (pxY <= 0) {
            ag = 90
          } else {
            ag = 270
          }
        } else if (pxX > 0) {
          if (pxY <= 0) {
            ag = -360 * Math.atan(pxY / pxX) / (2 * Math.PI)
          } else {
            ag = 360 - 360 * Math.atan(pxY / pxX) / (2 * Math.PI)
          }
        } else if (pxX < 0) {
          ag = 180 - 360 * Math.atan(pxY / pxX) / (2 * Math.PI)
        }
        return ag
      },
      //  验证激活码
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
          localStorage.status = res.data.status
          if (res.data.status === 1) {
            vm.lcstext = '恭喜您，验证成功！'
            let obj = {'accessToken': res.data.accessToken}
            let str = JSON.stringify(obj)
            localStorage.setItem(vm.spotId, str)
            vm.lcserr = true
            vm.status = 1
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
      //  语音播放
      yyPlay: function () {
        let vm = this
        if (vm.cannot) {
          return
        }
        if (vm.status === 0 && vm.poiData.charge === 1) {
          vm.validate = true
          return
        }
        let audio = document.getElementById('audio')
        if (vm.isParse) {
          if (audio.src === vm.adSrc) {
            audio.play()
            this.isParse = false
            return
          }
          audio.src = vm.adSrc
          audio.play()
          this.isParse = false
        } else {
          audio.pause()
          this.isParse = true
        }
        let yytime = 0
        audio.addEventListener('timeupdate', function () {
          let scales = audio.currentTime / audio.duration
          yytime = parseInt(scales * 100)
          vm.yytime = yytime
          if (audio.currentTime === audio.duration) {
            vm.isParse = true
          }
        }, false)
      },
      chooseThis: function (languageChoose) {
        this.choose_language = false
      },
      //  打开语言选择Dialog
      opLanguage: function () {
        this.choose_language = true
      },
      // dituChange: function () {
      //   this.ditu3dOn = !this.ditu3dOn
      // },
      goThere () {
        let vm = this
        // let st = `23.138371, 113.26461`
        // let ed = `${vm.poiData.latitude},${vm.poiData.longitude}`
        // let mapName = vm.spotinfoattr.pathname
        // let params = {st: st, ed: ed, mapName: mapName}
        // if (routeLine) {
        //   routeLine.setMap(null)
        //   routeLine = null
        // }
        // api.GetRoutePath(params).then(res => {
        //   if (res.data.length > 0) {
        //     routeLine = new AMap.Polyline({
        //       path: res.data,
        //       strokeColor: '#f607dd',
        //       showDir: true,
        //       strokeWeight: 5,
        //       strokeStyle: 'solid',
        //       lineJoin: 'round'
        //     })
        //     routeLine.setMap(map)
        //     if (routeLine) {
        //       vm.routeLine = true
        //     }
        //   } else {
        //     return
        //   }
        // }).catch(err => {
        //   console.log(err)
        // })
        let bounds = vm.getBounds()
        if (vm.localPoi) {
          if (!bounds.contains(vm.localPoi)) {
            vm.outscn = true
          } else if (bounds.contains(vm.localPoi)) {
            if (routeLine) {
              routeLine.setMap(null)
              routeLine = null
            }
            let st = `${vm.localPoi.getLat()},${vm.localPoi.getLng()}`
            let ed = `${vm.poiData.latitude},${vm.poiData.longitude}`
            let mapName = vm.spotinfoattr.pathname
            let params = {st: st, ed: ed, mapName: mapName}
            api.GetRoutePath(params).then(res => {
              if (res.data.length > 0) {
                routeLine = new AMap.Polyline({
                  path: res.data,
                  strokeColor: '#f607dd',
                  showDir: true,
                  strokeWeight: 5,
                  strokeStyle: 'solid',
                  lineJoin: 'round'
                })
                routeLine.setMap(map)
                if (routeLine) {
                  vm.routeLine = true
                }
              } else {
                return
              }
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          vm.getLocation()
        }
      },
      onConfirm () {
        let vm = this
        if (warking) {
          warking.clear()
        }
        let endpoi = new AMap.LngLat(vm.poiData.longitude, vm.poiData.latitude)
        map.plugin('AMap.Walking', function () {
          warking = new AMap.Walking({map: map})
          map.plugin(warking)
          warking.search(vm.localPoi, endpoi)
        })
      },
      //  关闭路线
      routeLineOff () {
        routeLine.setMap(null)
        routeLine = null
        this.routeLine = false
      },
      //  自动播报开关
      ckchange (ck) {
        if (this.status === 0) {
          this.validate = true
          return
        }
        this.ck = ck
        if (ck) {
          this.playAuto()
        }
      },
      playAuto () {
        let vm = this
        if (vm.scenicPois && vm.localPoi) {
          vm.scenicPois.forEach((poi) => {
            let dst = parseFloat(vm.localPoi.distance([poi.longitude, poi.latitude]))
            vm.$set(poi, 'dst', dst)
          })
          vm.scenicPois.sort(function (a, b) {
            return a.dst - b.dst
          })
          if (vm.scenicPois[0].dst <= 20 && vm.scenicPois[0].played === 0) {
            let language = vm.languageChoose
            if (vm.scenicPois[0].audios.length > 0) {
              vm.scenicPois[0].audios.forEach(function (audio) {
                if (audio.scode === language) {
                  vm.adSrc = api.fileUrl + audio.url
                }
              })
              let audio = document.getElementById('audio')
              audio.src = vm.adSrc
              audio.play()
              vm.$set(vm.scenicPois[0], 'played', 1)
            }
            console.log(vm.scenicPois)
          }
        }
      },
      goScenic: function () {
        localStorage.status = this.status
        this.$router.push({path: '/scenic', query: {poiId: this.poiData.id, distance: this.distance}})
      },
      goImg: function () {
        if (this.status === 0 && this.poiData.charge === 1) {
          this.validate = true
          return
        }
        this.$router.push({path: '/images', query: {poiId: this.poiData.id}})
      },
      goQj: function () {
        if (!this.poiData.panourl) {
          return
        }
        if (this.status === 0 && this.poiData.charge === 1) {
          this.validate = true
          return
        }
        window.open(this.poiData.panourl)
      },
      goOrder: function () {
        this.$router.push({path: '/order', query: {spotId: this.spotId}})
      },
      btGo: function (url) {
        let vm = this
        if (url.indexOf('http') > -1) {
          window.open(url)
        } else {
          this.$router.push({path: `/${url}`, query: {spotId: vm.spotId}})
        }
      },
      //  去掉高德logo
      displayNone: function () {
        let logo = document.getElementsByClassName('amap-logo')[0]
        let copyright = document.getElementsByClassName('amap-copyright')[0]
        logo.style.display = 'none'
        copyright.style.visibility = 'hidden'
      },
      //  获得景区id
      getSpotId: function () {
        this.spotId = this.$route.query.spotId
        localStorage.spotId = this.$route.query.spotId
      },
      //  获得景区详情
      getScnDetail: function (spotId) {
        let vm = this
        let params = {spotId: vm.spotId}
        vm.getlinelists()
        api.GetScnDetail(params).then(res => {
          console.log(res.data)
          vm.scnDetail = res.data
          vm.poiTypes = vm.poiTypes.concat(res.data.poiTypes)
          vm.scenicPois = vm.scenicPois.concat(res.data.scenicPois)
          vm.scenicPois.forEach((poi) => {
            vm.$set(poi, 'played', 0)
          })
          vm.spotinfo = res.data.spotinfo
          if (vm.spotinfo.charge === 0) {
            vm.status = 1
          }
          vm.spotinfoattr = res.data.spotinfo.attr[0]
          if (res.data.menus.length === 0) {
            vm.btmn = false
          } else {
            vm.btmn = true
            vm.menus = vm.menus.concat(res.data.menus)
          }
          vm.languages = res.data.soundTypes
          vm.languages.forEach(function (item) {
            if (item.sysdefault === 1) {
              vm.languageDefault = item
            }
          })
          vm.languageChoose = vm.languageDefault.scode
          Vue.nextTick(function () {
            map.setZoomAndCenter(vm.spotinfoattr.initzoom, [vm.spotinfo.longitude, vm.spotinfo.latitude])
            map.set('zooms', [3, vm.spotinfoattr.maxzoom])
            // 添加图层
            if (vm.spotinfoattr.has3d === 1) {
              vm.add3d()
              vm.ditu3dOn = true
            } else {
              vm.ditu3dOn = false
            }
            // 初始划所有的景点POI
            poiMarkersLayer.put('scenic', vm.scenicPois)
            // 初始景区的POI在地图上
            vm.initMarker('scenic')
            if (vm.status === 0) {
              vm.getAccessToken()
            }
            // vm.loadAMapUI()
            //  定位
            vm.getLocation()
            vm.zoomChange()
            vm.centerChange()
          })
        })
      },
      //  验证token
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
          })
        } else {
          vm.status = 0
        }
        console.log(vm.status)
      },
      //  添加3d图层
      add3d: function () {
        let vm = this
        let v = vm.spotinfoattr.v ? `?v=${vm.spotinfoattr.v}` : ''
        let tileUrl = api.dtUrl + vm.spotinfoattr.mappath + '/[z]/[x]_[y]' + vm.spotinfoattr.suffix + v
        mapleLayer = new AMap.TileLayer({
          tileUrl: tileUrl,
          zooms: [parseInt(vm.spotinfoattr.minzoom), parseInt(vm.spotinfoattr.maxzoom)],
          zIndex: 99
        })
        mapleLayer.setMap(map)
        vm.isload = false
      },
      dituChange: function () {
        let vm = this
        if (vm.spotinfoattr.has3d === 0) {
          vm.alertShow = true
          setTimeout(() => {
            vm.alertShow = false
          }, 800)
          return
        }
        console.log(mapleLayer)
        if (vm.ditu3dOn) {
          mapleLayer.setMap(null)
          vm.ditu3dOn = false
        } else {
          mapleLayer.setMap(map)
          vm.ditu3dOn = true
        }
      },
      //  初始化所有景点
      initMarker: function (poitype) {
        markers1 = []
        let vm = this
        let _markers = poiMarkersLayer.get(poitype)
        console.log(_markers)
        let _hismarkers = []
        _markers.forEach(function (item) {
          let poi = item
          let _retMarker = vm.addMarker(poi)
          _hismarkers.push(_retMarker)
          markers1.push(_retMarker)
          poiMarkers.put(poi.id, poi)
          scnMarkers.put(poi.id, _retMarker)
        })
        vm.setHistoryPoi(_hismarkers)
        vm.addCluster(markers1, vm._renderCluserMarker1)
        aCluster = 1
      },
      setHistoryPoi (mks) {
        poiMarkersLayer.put('hpoi', mks)
      },
      // 添加Marker点
      addMarker (poi) {
        let vm = this
        let iconUrl
        vm.poiTypes.forEach(function (item) {
          if (item.code === poi.typeid) {
            iconUrl = api.fileUrl + item.icon
          }
        })
        let marker = new AMap.Marker({
          icon: iconUrl,
          position: [poi.longitude, poi.latitude],
          label: {
            content: poi.name,
            offset: vm.getOffsetPixel1(poi.name)
          },
          extData: {
            typeid: poi.typeid,
            id: poi.id
          },
          offset: new AMap.Pixel(-20, -32)
        })
        marker.setMap(map)
        this.markerPlay(marker)
        return marker
      },
      //  marker点击弹出语音界面
      markerPlay (marker) {
        let vm = this
        AMap.event.addListener(marker, 'click', function (e) {
          let id = e.target.getExtData().id
          let poi = poiMarkers.get(id)
          vm.playWind(poi)
        })
      },
      playWind (poi) {
        let vm = this
        vm.poiData = poi
        if (poi.typeid !== 'scenic') {
          this.ifGdftm = false
          return
        }
        this.ifGdftm = true
        this.lineOut = false
        this.btmn = false
        this.linedtOut = false
        vm.getPoiDetail(poi.id)
      },
      getPoiDetail (poiId) {
        let vm = this
        let params = {id: poiId}
        api.GetPoiDetail(params).then(res => {
          let data = res.data
          vm.soundTypes = data.soundTypes
          console.log(data)
          vm.poiData = data.poiData
          vm.getAdSrc()
          vm.getDistance()
          let audio = document.getElementById('audio')
          let yytime = 0
          audio.addEventListener('timeupdate', function () {
            let scales = audio.currentTime / audio.duration
            yytime = parseInt(scales * 100)
            vm.yytime = yytime
            if (audio.ended) {
              vm.isParse = true
            }
          }, false)
        })
      },
      //  获得语音地址
      getAdSrc () {
        let vm = this
        let audio = document.getElementById('audio')
        let src = audio.src
        // let ad = document.getElementById('audio')
        if (vm.poiData.audios.length === 0) {
          vm.cannot = true
        } else {
          let language = vm.languageChoose
          vm.poiData.audios.forEach(function (ad) {
            if (ad.scode === language) {
              vm.adSrc = api.fileUrl + ad.url
              vm.cannot = false
              if (src === vm.adSrc && !audio.paused) {
                vm.isParse = false
              } else {
                vm.isParse = true
              }
              vm.cannot = false
            }
          })
          if (vm.adSrc === api.fileUrl) {
            vm.cannot = true
          }
        }
      },
      // 定位
      getLocation () {
        let vm = this
        if (geolocation) {
          map.removeControl(geolocation)
        }
        map.plugin('AMap.Geolocation', function () {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //  是否使用高精度定位，默认:true
            // timeout: 5000, //  超过10秒后停止定位，默认：无穷大
            zoomToAccuracy: false, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            showButton: false,
            showMarker: true,
            showCircle: true,
            panToLocation: false //  定位成功后将定位到的位置作为地图中心点
          })
          map.addControl(geolocation)
          geolocation.getCurrentPosition()
          geolocation.watchPosition()
          AMap.event.addListener(geolocation, 'complete', vm.onComplete)
          AMap.event.addListener(geolocation, 'error', vm.onError)
        })
      },
      //  定位成功
      onComplete (data) {
        if (!data) {
          return
        }
        let vm = this
        let localLng = data.position.getLng()
        let localLat = data.position.getLat()
        // let localPos = new AMap.LngLat(localLng, localLat)
        vm.localPoi = new AMap.LngLat(localLng, localLat)
        console.log(vm.localPoi)
      },
      // 定位
      location () {
        let vm = this
        if (vm.localPoi) {
          map.setCenter(vm.localPoi)
        } else {
          this.alertShow = true
        }
      },
      onError (data) {
        if (data.message.indexOf('Geolocation permission denied') > -1) {
          this.alertShow = true
        }
      },
      //  获得景点距离
      getDistance () {
        let vm = this
        if (!vm.localPoi) {
          return
        }
        let dst = parseInt(vm.localPoi.distance([vm.poiData.longitude, vm.poiData.latitude]))
        if (dst > 1000) {
          vm.distance = parseInt(dst / 1000) + 'km'
        } else {
          vm.distance = dst + 'm'
        }
      },
      //  计算出label居中需要偏移的参数
      getOffsetPixel1 (text) {
        let textSize = this.compuleText(text)
        let ow = this.iconSize.w
        return new AMap.Pixel(-(textSize.w / 2 - ow / 2), -textSize.h + 7)
      },
      getOffsetPixel2 (text, w, h) {
        let textSize = this.compuleText(text)
        let pd = document.getElementById('poiimg')
        return new AMap.Pixel(-(textSize.w / 2 - pd.offsetWidth / 2), -textSize.h - 3)
      },
      //  计算marker label的宽高
      compuleText (v) {
        let d = document.getElementById('dvCompute')
        d.innerHTML = v
        return { w: d.offsetWidth, h: d.offsetHeight }
      },
      //  执行聚合
      addCluster (markers, render) {
        // let vm = this
        if (cluster) {
          cluster.setMap(null)
          cluster.clearMarkers()
        }
        map.plugin('AMap.MarkerClusterer', function () {
          cluster = new AMap.MarkerClusterer(map, markers, {
            renderCluserMarker: render,
            gridSize: 45
          })
          map.plugin(cluster)
          cluster.setMap(map)
        })
      },
      // addCluster2 () {
      //   let vm = this
      //   if (cluster2.length !== 0) {
      //     cluster2.setMap(null)
      //     cluster2.clearMarkers()
      //     if (cluster1.length !== 0) {
      //       cluster1.clearMarkers()
      //     }
      //   }
      //   map.plugin('AMap.MarkerClusterer', function () {
      //     cluster2 = new AMap.MarkerClusterer(map, markers2, {
      //       renderCluserMarker: vm._renderCluserMarker2,
      //       gridSize: 45
      //     })
      //     map.plugin(cluster2)
      //     cluster2.setMap(map)
      //   })
      // },
      _renderCluserMarker1 (context) {
        var marker = context.marker
        var count = context.count
        // console.log(context)
        // marker.setIcon('http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png')
        var firstMarker = context.markers[0]
        var divCotent = `<div class="amap-marker-content" style="opacity: 1;"><div class="amap-simple-marker"><div class="amap-simple-marker-icon"><img class="amap-simple-marker-icon-img" src="${api.imgUrl + 'juhe.png'}" style="width: 40px; height: 43px;"></div><div class="cluster-marker-label">${count}</div></div></div>`
        //  显示第一个点的label
        marker.setLabel(firstMarker.getLabel())
        //  设置聚合图标样式
        marker.setContent(divCotent)
      },
      _renderCluserMarker2 (context) {
        console.log(context)
        var marker = context.marker
        var count = context.count
        // console.log(context)
        // marker.setIcon('http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png')
        var firstMarker = context.markers[0]
        var divCotent = `<div class="amap-marker-content2" style="opacity: 1;"><div class="amap-simple-marker"><div class="amap-simple-marker-icon"><div class="poi-img" style="background-image:url(${api.fileUrl + firstMarker.data.image}-32x32)"></div></div><div class="cluster-marker-label">${count}</div></div></div>`
        //  显示第一个点的label
        marker.setLabel(firstMarker.getLabel())
        //  设置聚合图标样式
        marker.setContent(divCotent)
      },
      //  获得景点Marker
      getJDpot () {
        this.clearHistoryPoi()
        let typecode = this.poiTypes[0].code
        if (poiMarkersLayer.get(typecode) != null && poiMarkersLayer.get(typecode).length > 0) {
          this.initMarker(typecode)
        } else {
          this.getScenicDataByType(typecode)
        }
      },
      clearHistoryPoi () {
        let _markers = poiMarkersLayer.get('hpoi')
        map.remove(_markers)
      },
      getScenicDataByType (typecode) {
        let vm = this
        let params = {spotId: vm.spotId, type: typecode}
        api.GetScnDataByType(params).then(res => {
          let data = res.data
          poiMarkersLayer.put(typecode, data)
          vm.initMarker(typecode)
        })
      },
      // 获得卫生间Marker
      getWSJpot () {
        this.clearHistoryPoi()
        let typecode = this.poiTypes[1].code
        if (poiMarkersLayer.get(typecode) != null && poiMarkersLayer.get(typecode).length > 0) {
          this.initMarker(typecode)
        } else {
          this.getScenicDataByType(typecode)
        }
      },
      //  获得其他Marker
      getQTpot () {
        this.clearHistoryPoi()
        let typecode = []
        this.poiTypes.slice(2).forEach(function (item) {
          typecode.push(item.code)
        })
        typecode = typecode + ''
        console.log(typecode)
        if (poiMarkersLayer.get(typecode) != null && poiMarkersLayer.get(typecode).length > 0) {
          this.initMarker(typecode)
        } else {
          this.getScenicDataByType(typecode)
        }
      },
      // 反馈Dialog
      feedbackOut () {
        this.phone = ''
        this.fdTT = ''
        this.fdErr = false
        this.feedback = true
      },
      fdsmt () {
        // let patten = /^1[34578]\d{9}$/
        let vm = this
        // if (!patten.test(vm.phone)) {
        //   vm.fdErrt = '请输入正确的手机号码'
        //   vm.fdErr = true
        //   return
        // }
        if (vm.fdTT.length < 10) {
          vm.fdErrt = '至少需要输入10个字符哦'
          vm.fdErr = true
          return
        }
        let params = {linkman: vm.user, contact: vm.phone, comments: vm.fdTT}
        api.Feedback(params).then(res => {
          vm.fdErrt = res.msg
          vm.fdErr = true
          setTimeout(() => {
            vm.feedback = false
          }, 800)
        })
      },
      //  获取地图范围
      getBounds () {
        let vm = this
        let bounds
        if (!vm.spotinfoattr.lefttop) {
          let sw = new AMap.LngLat(72.833187, 20.066319)
          let ne = new AMap.LngLat(135.762875, 51.515625)
          bounds = new AMap.Bounds(sw, ne)
        } else {
          let lefttop = vm.spotinfoattr.lefttop.split(',')
          let rightbottom = vm.spotinfoattr.rightbottom.split(',')
          let southWest = new AMap.LngLat(parseFloat(lefttop[0]), parseFloat(rightbottom[1]))
          let northEast = new AMap.LngLat(parseFloat(rightbottom[0]), parseFloat(lefttop[1]))
          bounds = new AMap.Bounds(southWest, northEast)
        }
        return bounds
      },
      //  监听zoomchange事件
      zoomChange () {
        let vm = this
        let minzoom = vm.spotinfoattr.minzoom
        AMap.event.addListener(map, 'zoomchange', function () {
          let mz = map.getZoom()  //  获取地图级别
          let ct = map.getCenter()  //  获取地图中心点
          //  获取3d地图范围
          let bounds = vm.getBounds()
          if (mz <= minzoom && aCluster === 1 && markers2.length > 0) {
            //  执行聚合
            vm.addCluster(markers2, vm._renderCluserMarker2)
            aCluster = 2
            // vm.showMarkers(markers2)
            // vm.removeMarkes(markers1)
          } else if (mz >= minzoom && aCluster === 2) {
            if (bounds.contains(ct)) {
              vm.addCluster(markers1, vm._renderCluserMarker1)
              aCluster = 1
              // vm.removeMarkes(markers2)
            }
          }
          if (mz < minzoom + 2) {
            map.clearLimitBounds()
            if (markers2.length > 0) return
            vm.loadPoi(1000000, -1, function (err, foodMarkers) {
              if (err) {
                return
              }
              markers2 = foodMarkers
            })
          } else if (mz >= minzoom + 1) {
          //  限制平移出地图范围
            map.setLimitBounds(bounds)
            if (!bounds.contains(ct)) {
              map.clearLimitBounds()
            }
          }
        })
      },
      //  监听平移地图事件
      centerChange () {
        let vm = this
        let bounds = vm.getBounds()
        AMap.event.addListener(map, 'moveend', function () {
          let ct = map.getCenter()
          let mz = map.getZoom()
          let minzoom = vm.spotinfoattr.minzoom
          if (mz >= minzoom && aCluster === 2) {
            if (bounds.contains(ct)) {
              vm.addCluster(markers1, vm._renderCluserMarker1)
              aCluster = 1
              vm.removeMarkes(markers2)
            }
          }
        })
      },
      // loadAMapUI () {
      //   let vm = this
      //   AMapUI.load(['ui/geo/DistrictCluster', 'lib/$'], function (DistrictCluster, $, SimpleInfoWindow) {
      //     vm.initPage(DistrictCluster, $, SimpleInfoWindow)
      //   })
      // },
      // initPage (DistrictCluster, $, SimpleInfoWindow) {
      //   let vm = this
      //   distCluster = new DistrictCluster({
      //     map: map,
      //     getPosition: function (item) {
      //       if (!item) {
      //         return null
      //       }
      //       var parts = item.split(',')
      //       //  返回经纬度
      //       return [parseFloat(parts[0]), parseFloat(parts[1])]
      //     },
      //     renderOptions: {
      //       featureStyle: {
      //         fillStyle: 'rgba(0, 0, 0, 0)',
      //         lineWidth: 0, //  描边线宽
      //         hoverOptions: null
      //       },
      //       featureStyleByLevel: {
      //         country: {
      //           fillStyle: 'rgba(0, 0, 0, 0)'
      //         },
      //         province: {
      //           fillStyle: 'rgba(0, 0, 0, 0)'
      //         },
      //         city: {
      //           fillStyle: 'rgba(0, 0, 0, 0)'
      //         },
      //         district: {
      //           fillStyle: 'rgba(0, 0, 0, 0)'
      //         }
      //       }
      //     }
      //   })
      //   window.distCluster = distCluster
      //   // var renderEngine = distCluster.getRender()
      //   distCluster.setData([])
      //   distCluster.on('clusterMarkerAdd', function (e, marker, record) {
      //     var areaCode = record.adcode
      //     var level = record.feature.properties.level
      //     var acroutes = record.feature.properties.acroutes
      //     areaCode = acroutes[1]
      //     var name = record.feature.properties.name
      //     console.log('name:' + name + '  areaCode:' + areaCode + '  level:' + level)
      //     $(marker.getContent()).find('.amap-ui-district-cluster-marker-body').html('...')
      //     if (level === 'province') {
      //       level = 1
      //     } else if (level === 'city') {
      //       level = 2
      //     } else if (level === 'district') {
      //       level = 3
      //     } else {
      //       level = 0
      //     }
      //     $(marker.getContent()).find('.amap-ui-district-cluster-marker-body').html('...')
      //     marker.__adcode = record.adcode
      //     vm.loadPoi(areaCode, 1, function (err, foodMarkers) {
      //       if (err) {
      //         return
      //       }
      //       record.foodMarkers = foodMarkers
      //       if (foodMarkers && foodMarkers.length && map.getZoom() < 15) {
      //         foodMarkers.forEach((item) => {
      //           item.setMap(map)
      //           markers2.push(item)
      //         })
      //       }
      //       $(marker.getContent()).find('.amap-ui-district-cluster-marker-body').html(foodMarkers._count || 0)
      //     })
      //   })
      //   distCluster.on('clusterMarkerRemove', function (e, marker, record) {
      //     if (record.foodMarkers) {
      //       let markers = record.foodMarkers
      //       for (let i = 0, len = markers.length; i < len; i++) {
      //         let markerItem = markers[i]
      //         markers[i].setMap(null)
      //         let index = markers2.indexOf(markerItem)
      //         if (index > -1) {
      //           markers2.splice(index, 1)
      //         }
      //       }
      //       record.foodMarkers = null
      //     }
      //   })
      // },
      loadPoi (areaCode, level, callback) {
        let vm = this
        var re = areaCode + level
        if (resultsCache[re]) {
          setTimeout(() => {
            callback(null, resultsCache[re])
          }, 0)
          return
        }
        let params = {areaCode: areaCode, level: level}
        api.GetSpotByCode(params).then(res => {
          // console.log(res.data)
          let foodMarkers = vm.createMarkes(res.data)
          let key = areaCode + level
          foodMarkers._count = foodMarkers.length
          resultsCache[key] = foodMarkers
          callback(null, resultsCache[key])
        })
      },
      createMarkes (datas) {
        let markes = []
        let vm = this
        datas.forEach((item) => {
          let data = item
          let mkicon = document.createElement('div')
          mkicon.className = 'poi-img'
          mkicon.style.backgroundImage = `url(${api.fileUrl + data.image}-32x32)`
          let marker = new AMap.Marker({
            position: new AMap.LngLat(parseFloat(data.longitude), parseFloat(data.latitude)),
            content: mkicon,
            label: {
              content: data.name,
              offset: vm.getOffsetPixel2(data.name)
            }
          })
          marker.data = data
          AMap.event.addListener(marker, 'click', function (e) {
            console.log(marker)
            let spotId = data.id
            // vm.$router.push({path: '/guide', query: {spotId: spotId}})
            // vm.$router.go(0)
            window.location.href = `/guide?spotId=${spotId}`
          })
          markers2.push(marker)
          markes.push(marker)
        })
        return markes
      },
      //  移除地图上的点
      removeMarkes (markers) {
        for (let i = 0, len = markers.length; i < len; i++) {
          markers[i].setMap(null)
        }
      },
      //  显示markers
      showMarkers (markers) {
        for (let i = 0, len = markers.length; i < len; i++) {
          markers[i].setMap(map)
        }
      }
    },
    created: function () {
      this.getSpotId()
    },
    mounted: function () {
      let vm = this
      init()
      vm.displayNone()
      this.getScnDetail()
    },
    watch: {
      languageChoose: function () {
        if (!this.poiData) {
          return
        } else {
          // if (!this.languageChoose) {
          //   this.languageChoose = this.languageDefault
          // }
          this.getAdSrc()
          this.yytime = 0
          this.isParse = true
          let audio = document.getElementById('audio')
          audio.pause()
          console.log(this.languageChoose)
        }
      },
      localPoi: function () {
        if (!this.ck) {
          return
        }
        this.playAuto()
      }
    }
  }
</script>
<style type="text/css" scoped>

  #map{
    height: 100%;
    width: 100%;
  }
  #dvCompute, #imgicon, #poiimg{position:absolute;visibility:hidden;}
  div.amap-copyright{
    display: none!important;
  }
  img{
    display: block;
  }
  .guide{
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }
  .loading {
    width: 100%;
    height: 100%;
    background:#fff;
    z-index: 50000;
    text-align: center;
    position: relative;
  }
  .loadicon{
    position: absolute;
    top:50%;
    left: 50%;
    margin-top: -50px;
    margin-left: -30px;
  }
  .loadicon{
    color: #11cd8d;
  }
  .gw_dt{
    max-width:300px;
    height: auto;
    position: relative;
  }
  .gw_dt img{
    width: 100%;
    border-radius: 8px;
  }
  .gw_close{
    width: 2rem;
    position: absolute;
    top:-3rem;
    right:0;
  }
  .close_btn{
    width: 60%;
    position: absolute;
    bottom: 5%;
    left: 20%;
  }
  .wxEWM,.ylyEWM{
    max-width: 100px;
    text-align: center;
    position: absolute;
    top:6rem;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .ylyEWM{
    top:14rem;
  }
  .guide_head{
    background: #19cb8f;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    color: #fff;
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    z-index: 1000;
    /*font-weight: bold;*/
  }
  .guide_main{
    background: #48525f;
    height: 100%;
    position: relative;
  }
  .guide_foot{
    width: 100%;
    position: fixed;
    bottom: 0rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    height: 3rem;
    background: #fff;
  }
  .guide_foot ul{
    border-top: 1px solid #ddd;
    padding-top: .5rem
  }
  .guide_foot ul li{
    width: 33%;
    float: left;
    text-align: center;
    height: 3rem;
  }
  .guide_foot ul li a{
    height: 3rem;
    display: block;
  }
  .guide_foot ul li a img{
    display: inline;
    width: 1.8em;
    margin-right: 1px;
  }
  .guide_foot ul li a img.tuji{
    width: 1.6rem;
    margin-right: .4rem;
  }
  .yuyin{
    width: 6rem;
    position: absolute;
    top:-2.7rem;
    left: 50%;
    margin-left: -3rem;
  }
  .go_all_scenic{
    position: absolute;
    left: .5rem;
    top: 1rem;
    z-index: 10;
  }
  .go_all_scenic a {
    color: #19cb8f;
    display: block;
    background: #FFF;
    display: block;
    border-radius: 20px;
    padding: 0.2rem .4rem;
    font-size: .8rem;
    text-decoration: none;
    line-height: 1.2rem;
}
.go_all_scenic a i img {
    display: inline;
    width: 1.2rem;
    vertical-align: top;
    margin-right: 5px;
}
.linedt{
  position: absolute;
  left: .5rem;
  top:5rem;
  z-index: 10;
  background: #fff;
  font-size: 12px;
  padding: 3px;
  border-radius: 6px;
  color: #1296db;
  cursor: pointer;
}
.logo {
  position: absolute;
  top:.5rem;
  right: 1rem;
}
.logo img{
  width: 6rem;
}
.top-menu{
  position: absolute;
  top:3rem;
  right: .5rem;
  background-color: #fff;
  padding: 5px;
  border-radius: 5px;
}
.top-menu .text{
  font-size: 12px;
  text-align: center;
  margin-bottom: 7px;
  transform: scale(0.9);
}
.autoPlay .text{
  margin-bottom: 0;
}
.ditu3d, .left_refresh, .address_now, .fdback{
  width: 2rem;
  height: 2rem;
  background: url(../assets/images/3doff.png) no-repeat center;
  background-size: 100%;
  position: absolute;
  right: .5rem;
  z-index: 10;
  border-radius:3px;
  background-color: #fff;
  border-radius: 6px;  
  cursor: pointer;
}
.autoPlay{
  z-index: 20;
}
.ditu3d{
  top:7rem;
  background-color: transparent;
}
.language,.line{
  width: 20px;
  height: 20px;
  background: url(../assets/images/lang.png) no-repeat center;
  background-size: 100%;
  background-color: transparent;
  z-index: 10;
  cursor: pointer;
  margin: 0 auto;
}
.line{
  background-image: url(../assets/images/line.png);
}
.ditu3d_on{
  background-image: url(../assets/images/3don.png);
}
.left_refresh{
  background-image: url(../assets/images/icon-btn02.png);
  top:2.5rem;
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
/*.choosed .chooseIcon{
  background-image: url(../assets/images/radio-02.png.png); 
}*/
/*.choose_pth,.choose_English{
  position: absolute;
  top:4rem;
  left: 0;
  right: 0;
  width: 70%;
  margin: 0 auto;
  font-size: 1.3rem;
  text-align: left;
}
.choose_English{
  top:6.5rem;
}*/
.fdback{
  background-image: url(../assets/images/fd.png);
  bottom: 4rem;
  left: 1rem;
  border-radius: 6px;
  width: 2rem;
  height: 2rem;
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
.phone {
  border-bottom: 1px solid #eee;
}
.phone input {
  border: none;
  width: 100%;
  height: 1.5rem;
}
.fd_text {
  border-bottom: 1px solid #eee;
}
.fd_text textarea{
  border:none;
  width: 100%;
  height: 6rem;
  line-height: 1rem;
  margin-top: 5px;
}
.fd_smt {
  padding: 5px 0;
}
.fd_smt span{
  display: block;
  width: 80%;
  margin: 0 auto;
  height: 2rem;
  line-height: 2rem;
  background-color: #19cb8f;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
}
.fd_err{
  width: 100%;
  height: 1.2rem;
  color:#fe0338;
  line-height: 1.2rem;
  background-color: #ffdd02;
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
.address_now{
  background-image: url(../assets/images/wz-icon-01.png);
  bottom: 1rem;
  left: 1rem;
  border-radius: 6px;
  width: 2rem;
  height: 2rem;
}
.arrowOut{
  position: absolute;
  right: .5rem;
  bottom: 45%;
  cursor: pointer;
}
.arrowOut img{
  width: 20px;
  height: auto;
}
.wx_wb,.shop_wsj{
  width: 38px;
  padding:3px 0px;
  font-size:12px;
  background-color: #fff;
  position: absolute;
  bottom: 6rem;
 /* left: 1rem;*/
  text-align: center;
  border-radius: 6px;
}
.shop_wsj{
  bottom: 40%;
  right: -3rem;
  -webkit-transition: -webkit-transform .5s;
  transition: transform .5s;
}
.out{
  -webkit-transform: translateX(-3.5rem);
  transform: translateX(-3.5rem);
}
.wx_wb img,.shop_wsj img{
  width: 1.5rem;
  margin: 0 auto;
}
.weixin,.shopping,.jindian{
  padding-bottom: 3px;
  border-bottom: 1px solid #ddd;
}
.jindian,.weisj{
  padding-top: 3px;
}
.weibo{
  padding-top: 3px;
}
.icon_bf{
  display: inline-block;
  position: absolute;
  width: 1.2rem;
  height: 1.2rem;
  background: url(../assets/images/b-icon.png);
  background-size: 100%;
  top:.7rem;
  left: 0;
}
.weui-cell{
  padding-left:1.5rem;
}
.bottom_menu{
  position: absolute;
  bottom: 0rem;
  right: .5rem;
  z-index: 5500;
}
.bbtn{
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  color: #fff;
  text-align: center;
  line-height: 2.5rem;
  font-size:.8rem;
  float: right;
  cursor: pointer;
}
.bbtn img {
  display: inline;
  vertical-align: middle;
}
.btn00{
  position: absolute;
  width: 2.5rem;
  height: 2.5rem;
  background: url(../assets/images/icon-btn03.png) no-repeat center;
  background-size: 100%;
  bottom: 1rem;
  right: .5rem;
  -webkit-transition: -webkit-transform .5s;
  transition: transform .5s;
}
.rotate{
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.btn01{
  background-color: #20cfbb;
}
.btn02{
  
  background-color: #3aa2f2;
}
.btn03{
  background-color: #ecad02;
}
.btn04{
  background-color: #f97a2c;
}
.btn05{
  background-color: #adce0d;
}
.dli{
  width: 10rem;
  height: 2.5rem;
  line-height: 2.5rem;
  position: absolute;
  overflow: hidden;
  color: #000;
  font-size: .8rem;
}
.dli span{
  background-color: #fff;
  border-radius: 3px;
  margin-right: 1rem;
  text-align: right;
  display: inline-block;
  line-height: 1.6rem;
  float: right;
  margin-top: 0.35rem;
  padding: 0 5px;
}
.dli01{
  right: .75rem;
  bottom: 5rem;
}
.dli02{
  right: .75rem;
  bottom: 7.8rem;
}
.dli03{
  right: .75rem;
  bottom: 10.6rem;
}
.dli04{
  right: .75rem;
  bottom: 13.4rem;
}
.dli05{
  right: .75rem;
  bottom: 16.2rem;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to{
  opacity: 0
}
.guide_foot_main{
  width: 100%;
  position: fixed;
  bottom: 0rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  background: #fff;
  text-align: center;
  z-index: 170;
}
.goThere{
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #19cb8f;
  position: absolute;
  top:-2rem;
  right: 2rem;
  text-align: center;
  font-size:.8rem;
  color: #fff;
  cursor: pointer;
}
.goThere img{
  width: 1.5rem;
  margin: 0 auto;
  margin-top:.5rem; 
}
.vux-x-icon{
  fill:#19cb8f;
  cursor: pointer;
}
.close_icon{
  position: absolute;
  right: .1rem;
  top:0;
}
.scenic_distance{
  text-align: left;
  margin-left: 1rem;
}
.scenic_distance h3{
  font-size:1rem;
  margin-bottom: .5rem;
}
.scenic_distance p{
  color: #d6d6d6;
  font-size:.8rem;
  margin-bottom: .5rem; 
}
.scenic_distance span{
  display: inline-block;
  width: .7rem;
  height: 1rem;
  background: url(../assets/images/ad-icon.png) no-repeat center;
  background-size: 100%;
  margin-right: .3rem;
}
.tjYyQj{
  width: 100%;
  padding:.8rem 1.8rem;
  position: relative;
  border-top: 1px solid #d9d9d9;
}
.tj,.qj{
  width: 4rem;
  height: 1.4rem;
  line-height: 1.4rem;
  cursor: pointer;
}
.yy{
  width: 9rem;
  height: 1.4rem;
  position: absolute;
  left: 50%;
  top:50%;
  margin-left: -4.5rem;
  margin-top: -.7rem;
  cursor: pointer;
}
.yy span{
  line-height: 1.4rem;
  vertical-align: top;
  font-size: .7rem;
  color: #19cb8f;
  border: 1px solid #19cb8f;
  border-radius: .7rem;
  padding: 3px 5px;
}
.tj i,.yy i,.qj i{
  line-height: 1.4rem;
  font-size:1rem;
  vertical-align: top;
}
.tj b{ 
  width: 1.2rem;
  height: 1.4rem;
  background:url(../assets/images/tj.png) no-repeat center;  
}
.yy b{
  width: 1.4rem;
  height: 1.4rem;
  background:url(../assets/images/b-01.png) no-repeat center;
}
.yy b.yyparse{
  background-image: url(../assets/images/b-02.png);
}
.yy b.cannot{
  background-image: url(../assets/images/b-01-01.png);
}
.yy i.cannot{
  color:#979797;
}
.qj b{
  width: 1.2rem;
  height: 1.4rem;
  background:url(../assets/images/qj.png) no-repeat center;
}
.tj b,.yy b,.qj b{
  display: inline-block;
  background-size: 100%;
  margin-right: .3rem;
  line-height: 1.4rem;
}
.scenic_text{
  font-size: .9rem;
  text-align: left;
  padding: .5rem;
  text-indent: 1.8rem;
}
.weui-progress__bar{
  background: #fff;
}
.line_head {
  padding: 5px 10px;
  width: 100%;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
.linelist {
  padding: 0 10px;
  background-color: #f7f7f7;
  cursor: pointer;
  display: block;
}
.ck-list{
  display: flex;
  align-items: center;
  font-size: .8rem;
  padding: 10px 0;
  border-bottom: 1px solid #d4d6d4;
  position: relative;
}
.linelist:last-child{
  border-bottom: 1px solid #d4d6d4;
}
.linelist:last-child .ck-list{
  border-bottom:none; 
}
.ck-list img{
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.lineck .ck-list div{
  width: 20px;
  height: 20px;
  background: url(../assets/images/la.png) no-repeat center;
  background-size: 70%;
  position: absolute;
  right: 0;
}
.line-dt{
  padding: 5px 10px;
}
.l-lists{
  display: flex;
  align-items: flex-start;
  overflow-x: scroll;
}
.l-list{
  display: flex;
  align-items: flex-start;
}
.l-list>img{
  width: 20px;
  height: 13px;
  margin: 19px 5px 0 5px;
}
.l-list div img{
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.l-list:last-child>img{
  display: none;
  margin: 0;
}
.l-list p{
  text-align: center;
  font-size: 12px;
}
@media screen and (max-width: 320px){
  .wxEWM{
     top:5rem;
     max-width: 80px; 
    }
  .ylyEWM{
    top:13rem;
    max-width: 80px;
  }
  .two_button span {
    font-size: 12px;
  }
  .shop_wsj{
    top:13rem;
    bottom:auto;
  }
}
</style>
