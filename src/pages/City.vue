<template>
<div class="citys">
    <div class="city_head">
      <span @click="goBack">&times;</span><b>选择城市</b>
    </div>
    <div class="city_search">
      <div class="xz_search">
        <div class="xz_search_box">
          <button class="xz_search_btn">
          <img :src="imgUrl + 'xz-icon-02.png'">
          </button>
          <input class="xz_search_txt" v-model="search_txt" type="text" placeholder="广州" id="search">
        </div>
      </div>
    </div>
    <div v-show="search_txt!==''">
      <div class="z_box">
        <div class="city_dt" v-for="(item, key) in cityList">
          <dl>
            <dt :id="key">
            <span>{{key}}</span>
            </dt>
            <dd v-for="city in item">
            <router-link :to="{path: '/home', query: { cityCode: city.areacode}}">
            <img :src="imgUrl + 'xz-icon-03.png'" alt="" v-if="city.thumbimg==''">
            <img :src="fileUrl + city.thumbimg" v-else>
            <i>{{city.areaname}}</i>
            </router-link>
            </dd>
          </dl>
        </div>
        <div v-if="noCity" class="noCity"><p>很抱歉，暂时找不到该城市。。。</p></div>
      </div>
    </div>
    <div v-show="search_txt==''">
      <div class="container">
        <div id="hot" class="dis_jd_title" style="margin-top: 15px;">
          <h4>热门城市</h4>
        </div>
        <div class="hot_list clearfix">
          <div class="hot_li"  v-for="(item, index) in hotList">
            <router-link :to="{path: '/home', query: { cityCode: item.areacode}}">
            {{item.areaname}}
            </router-link>
          </div>
          
        </div>
      </div>
      <div class="city_dts">
        <div class="city_dt" v-for="(item, key) in cityList">
          <dl>
            <dt :ref="key">
            <span>{{key}}</span>
            </dt>
            <dd v-for="city in item">
            <router-link :to="{path: '/home', query: { cityCode: city.areacode}}">
            <img :src="imgUrl + 'xz-icon-03.png'" alt="" v-if="city.thumbimg==''">
            <x-img :src="fileUrl + city.thumbimg" v-else></x-img>
            <i>{{city.areaname}}</i>
            </router-link>
            </dd>
          </dl>
        </div>
        <div class="city_letter" v-bind:class="{'active':ctActive}">
          {{dtid}}
        </div>
        <div class="z_md">
          <a href="#search">查找</a> <a :href="'#'+charA" v-for="charA in charArr" @click="goCity(charA)">{{charA}}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../api/api.js'
  import Vue from 'vue'
  import {XImg} from 'vux'
  let charArr = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
  let cityData
  export default {
    components: {
      XImg
    },
    data () {
      return {
        search_txt: '',
        charArr: charArr,
        dtid: '',
        ctActive: false,
        cityCode: '',
        hotList: [],
        cityList: {},
        cityData: cityData,
        noCity: false,
        fileUrl: api.fileUrl,
        imgUrl: api.imgUrl
      }
    },
    methods: {
      goBack: function () {
        let lastCityCode = this.$route.query.cityCode
        this.$router.push({path: '/home', query: {cityCode: lastCityCode}})
      },
      goCity: function (dtid) {
        let that = this
        this.dtid = dtid
        this.ctActive = true
        setTimeout(function () {
          that.ctActive = false
        }, 800)
        Vue.nextTick(function () {
          that.scrollTo(dtid)
        })
      },
      scrollTo (dtid) {
        let el = this.$refs[dtid]
        let total = el[0].offsetTop
        let distance = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        console.log(total)
        console.log(distance)
        let step = total / 50
        function smoothUp () {
          if (distance > total) {
            distance -= step
            document.body.scrollTop = distance
            document.documentElement.scrollTop = distance
            setTimeout(smoothUp, 5)
          } else {
            document.body.scrollTop = total
            document.documentElement.scrollTop = total
          }
        }
        function smoothDown () {
          if (distance < total) {
            distance += step
            document.body.scrollTop = distance
            document.documentElement.scrollTop = distance
            setTimeout(smoothDown, 5)
          } else {
            document.body.scrollTop = total
            document.documentElement.scrollTop = total
          }
        }
        if (total > distance) {
          smoothDown()
        } else {
          let newTotal = distance - total
          step = newTotal / 50
          smoothUp()
        }
      },
      getCityLists: function (sT) {
        let vm = this
        let params = {cityName: sT}
        api.GetCityLists(params).then(res => {
          vm.hotList = res.data.hot
          let citys = res.data.areas
          if (citys.length === 0) {
            this.noCity = true
          } else {
            this.noCity = false
          }
          cityData = citys
          citys.forEach(function (item, index) {
            let key = item.firstLetter
            if (vm.cityList[key] === undefined) {
              vm.cityList[key] = []
            }
            vm.cityList[key].push(item)
          })
          console.log(vm.cityList)
        })
      }
    },
    created: function () {
      this.getCityLists()
    },
    watch: {
      search_txt: function () {
        let vm = this
        vm.cityList = {}
        this.getCityLists(vm.search_txt)
        console.log(vm.cityList)
      }
    }
  }
</script>
<style type="text/css" scoped>
.citys{
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
}
  .city_head{
    padding: 10px 15px;
    text-align: center;
    line-height: 2rem;
    margin-top: 10px;
  }
  .city_head span{
    font-size: 3rem;
    color:  #11cd8d;
    float: left;
    cursor: pointer;
  }
  .city_head b{
    font-size: 1.2rem;
    color: #666;
    margin-right: 1.5rem;
  }
.xz_search{background: #f3f2f5; padding:15px;max-width: 768px;margin: 0 auto;}
.xz_search_box{ border-radius: 15px;box-shadow: 0 0 0.5px rgba(0,0,0,0.2); overflow: hidden; }
.xz_search_box .xz_search_btn{width:10%; height:2rem; line-height: 2rem; background: #FFF; border:none;float:left; ; outline: none; cursor: pointer;}
.xz_search_box .xz_search_btn img{width:1rem;vertical-align: middle;}
.xz_search_box .xz_search_txt{ width: 90%; height: 2rem; line-height: 2rem; border: none;float:left ;outline: none; padding:0 5px;}
.dis_jd{border-top: 1px solid #e5e5e5;background: #FFF; margin: 15px 0px; padding: 10px 0px;}
.dis_jd_title{overflow: hidden; margin: 10px 0px;}
.dis_jd_title h4{font-size: 1rem; float: left; border-left: 2px solid #19cb8f;padding-left:8px;font-weight: normal;color: #666;}
.hot_list{margin-top:20px;}
.hot_li{ margin-bottom: 10px; text-align: center;width: 25%;float: left;padding: 0 8px;}
.hot_li a{ display: block; border: 1px solid #DDD; height: 2rem; line-height: 1.9rem; border-radius: 10px; padding:0px 10px; font-size: 12px;}
.hot_li a:hover{ border: 1px solid #19cb8f; color: #19cb8f;}
.city_dts{position: relative; max-width: 768px; margin: 15px auto 0 auto;}
.city_dt dt{background: #f5f5f5; height: 2rem; line-height: 2rem; padding: 0px 15px;}
.city_dt dt span{font-size: 1rem;}
.city_dt dd{border-top: 1px solid #DDD; padding: 15px;}
.city_dt dd a{display: block;height: 4rem;line-height: 4rem;}
.city_dt dd img{width:6rem; border-radius: 5px; margin-right: 1rem;display: inline-block;height: 4rem;}
.city_dt dd a i{font-size: 1.2rem;vertical-align: top;}
.z_md{position:fixed; right:0; top:50%; transform: translateY(-50%);-webkit-transform: translateY(-50%);text-align: center; background: #FFF; padding:0px 5px;}
.z_md span{display: block;font-size: .5rem;color: #19cb8f;}
.z_md a{display: block;font-size: 12px;margin-bottom:0;color: #19cb8f;}
.z_md a:active,.z_md a:focus,.z_md a:hover{color: rgba(0, 0, 0, 0.3)}

.city_letter{
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -2.5rem;
    margin-top: -2.5rem;
    width: 5rem;
    height: 5rem;
    line-height: 5rem;
    text-align: center;
    color: #fff;
    font-size: 1.5rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    transition: all .4s ease;
    -webkit-transition: all .4s ease;
    display: none;
    z-index: 2;
}
.city_letter.active{
  display: block;
}
.noCity{
  text-align: center;
  margin-top: 1rem;
}
@media screen and (max-width: 350px){
  .hot_li{
    padding:0 3px;
  }
  .hot_li a{
    font-size: .7rem;
  }
}
</style>