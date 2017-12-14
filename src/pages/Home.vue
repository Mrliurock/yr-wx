<template>
  <div class="home">
  <confirm v-model="lacsucc" :title="title" confirm-text="切换城市" cancel-text="取消" style="font-size:14px" @on-confirm="onConfirm"></confirm>
  <scroller :on-infinite="infinite" loading-layer-color="#ec4949">
    <div class="h_top">
      <div class="h_top_img">
        <img :src="cityInfo.citycardimg?imgUrl + cityInfo.citycardimg:imurl+'z-tu01.jpg'">
      </div>
      <div class="h_top_box">
        <div class="h_top_w clearfix">
          <div class="city_c">
            <router-link :to="{path: '/city', query: {cityCode: cityCode}}" class="city_ct">
                <span>{{cityInfo.areaname}}</span><img :src="imurl+'z-icon-02.png'"> 
            </router-link>
          </div>
            <div class="city_e">
              <span>{{cityInfo.pinyin}}&nbsp;&nbsp;</span><img :src="weatherImg"><span>&nbsp;&nbsp;{{temperature}}℃</span>
            </div>
            <!-- <div class="city_star">
              <span><img src="../assets/images/z-icon-03.png"></span>
              <span><img src="../assets/images/z-icon-03.png"></span>
              <span><img src="../assets/images/z-icon-03.png"></span>
              <span><img src="../assets/images/z-icon-03.png"></span>
              <span><img src="../assets/images/z-icon-04.png"></span>
            </div> 
            <div class="want_go">
              <router-link to="">
                <img src="../assets/images/z-icon-01.png"> 
              </router-link>
            </div> -->        
        </div>   
      </div>
      <div class="n_top_search">
          <input placeholder="请输入景点名称" v-model="searchName">
          <button @click="scnSearch">
            <img :src="imurl+'z-icon-05.png'">
          </button>
      </div>  
    </div>
    <div class="home_main">
      <!-- <scenic-list v-for="(item, index) in scenicLists" :scenicimage="item.image" :imgUrl="imgUrl" :name="item.name" :opentime="item.opentime" :typename="item.typename" :needticket="item.needticket" :spotId="item.spotid" :key="index" :cityCode="cityCode">
      </scenic-list> -->
      <sc-list v-for="(item, index) in scenicLists" :scenic="item" :spotId="item.spotid" :key="index" :cityCode="cityCode">
        
      </sc-list>
    </div>
    </scroller>
  </div>
</template>
<script type="text/javascript">
  import ScenicList from '../components/scenicList'
  import ScList from '../components/scList'
  import api from '../api/api.js'
  import {Confirm} from 'vux'
  var cCode, cName
  export default {
    data () {
      return {
        cityCode: '',
        cityInfo: {},
        weatherImg: '',
        temperature: '',
        searchName: '',
        scenicLists: [],
        page: 1,
        pages: 0,
        imgUrl: api.fileUrl,
        lacsucc: false,
        title: '',
        cityname: null,
        isLac: false,
        imurl: api.imgUrl,
        coords: null
      }
    },
    components: {
      ScenicList,
      Confirm,
      ScList
    },
    methods: {
      getLocation () {
        let netType = api.getNetType()
        let vm = this
        let changeCity = this.$route.query.cityCode
        if (!changeCity) {
          vm.cityCode = localStorage.cityCode || '440100'
          vm.cityname = localStorage.cityname || '广州市'
          vm.getCityInfo()
          vm.getWeather()
          vm.getScenicList(vm.cityCode, vm.searchName, vm.page)
          if (netType) {
            vm.getCityCode()
            api.getPosition(function (coords) {
              vm.coords = coords
            }, function (e) {
              console.log(e)
            })
          } else {
            api.getPosition(function (coords) {
              vm.coords = coords
              vm.getCityCode(coords)
            }, function (e) {
              console.log(e)
            })
          }
        } else {
          vm.cityCode = changeCity
          localStorage.cityCode = changeCity
          api.getPosition(function (coords) {
            vm.coords = coords
          }, function (e) {
            console.log(e)
          })
          vm.getCityInfo()
          vm.getWeather()
          vm.getScenicList(vm.cityCode, vm.searchName, vm.page)
        }
      },
      getCityCode (coords) {
        let vm = this
        let type
        let params
        if (!coords) {
          type = api.ip
          params = {key: api.gaodeRestKey}
        } else {
          type = api.geo
          params = {key: api.gaodeRestKey, location: coords.longitude + ',' + coords.latitude}
        }
        api.GetCity(type, params).then(res => {
          if (res.status) {
            if (res.adcode) {
              if (res.adcode === vm.cityCode) {
                return
              } else {
                vm.title = `定位到您在${res.city}，是否切换`
                cCode = res.adcode
                vm.lacsucc = true
              }
            } else if (res.regeocode.addressComponent.city) {
              if (res.regeocode.addressComponent.city === vm.cityname) {
                return
              } else {
                vm.title = `定位到您在${res.regeocode.addressComponent.city}，是否切换`
                cName = res.regeocode.addressComponent.city
                vm.isLac = true
                vm.lacsucc = true
              }
            }
            // vm.getCityInfo(cityname)
            // if (res.adcode) {
            //   vm.getWeather()
            //   vm.getScenicList(vm.cityCode, vm.searchName, vm.page)
            // }
          }
          // } else {
          //   alert(res)
          //   vm.cityCode = '440100'
          //   vm.getCityInfo()
          //   vm.getWeather()
          //   vm.getScenicList(vm.cityCode, vm.searchName, vm.page)
          // }
        }, err => {
          // vm.cityCode = '440100'
          // vm.getCityInfo()
          // vm.getWeather()
          // vm.getScenicList(vm.cityCode, vm.searchName, vm.page)
          console.log(err)
        })
      },
      onConfirm () {
        if (cCode) {
          this.cityCode = cCode
        }
        if (cName) {
          this.cityname = cName
        }
        this.scenicLists = []
        if (this.isLac) {
          localStorage.cityname = this.cityname
          this.getCityInfo(this.cityname)
        } else {
          localStorage.cityCode = this.cityCode
          this.getCityInfo()
          this.getWeather()
          this.getScenicList(this.cityCode, this.searchName, this.page)
        }
      },
      getCityInfo (cityname) {
        let params = {cityCode: cityname || this.cityCode}
        let vm = this
        api.GetCityInfo(params).then(res => {
          vm.cityInfo = res.data
          localStorage.cityname = res.data.areaname + '市'
          localStorage.cityCode = res.data.areacode
          if (cityname) {
            vm.cityCode = res.data.areacode
            vm.getWeather()
            vm.getScenicList(res.data.areacode, vm.searchName, vm.page)
          }
        })
      },
      getWeather () {
        let params = {key: api.gaodeRestKey, city: this.cityCode, output: 'JSON'}
        let vm = this
        api.GetWeather(params).then(res => {
          let lives = res.lives[0]
          vm.weatherImg = api.weatherImg + api.GetWeatherImg(lives.weather)
          vm.temperature = lives.temperature
        })
      },
      getScenicList (cC, sN, p) {
        let params = {cityCode: cC, name: sN, page: p}
        let vm = this
        api.GetScenicList(params).then(res => {
          let records = res.data.records
          records.forEach(function (item) {
            vm.scenicLists.push(item)
          })
          if (vm.coords) {
            vm.scenicLists.forEach((item) => {
              let dis = api.getDistance(vm.coords.latitude, vm.coords.longitude, Number(item.latitude), Number(item.longitude))
              dis = dis >= 1000 ? ((dis / 1000).toFixed(1) + 'km') : (dis.toFixed(0) + 'm')
              vm.$set(item, 'dis', dis)
            })
          } else {
            api.getPosition(function (coords) {
              vm.scenicLists.forEach((item) => {
                let dis = api.getDistance(23.137924, 113.265701, Number(item.latitude), Number(item.longitude))
                dis = dis >= 1000 ? ((dis / 1000).toFixed(1) + 'km') : (dis.toFixed(0) + 'm')
                vm.$set(item, 'dis', dis)
              })
            }, function (e) {
              console.log(e)
            })
          }
          vm.pages = res.data.pages
          console.log(vm.scenicLists, vm.pages)
        })
      },
      infinite (done) {
        if (this.page >= this.pages) {
          setTimeout(() => {
            done(true)
          }, 1000)
          return
        }
        let vm = this
        let startPage = vm.page + 1
        this.getScenicList(vm.cityCode, vm.searchName, startPage)
        vm.page++
        setTimeout(() => {
          done()
        }, 1000)
      },
      scnSearch: function () {
        let vm = this
        let sName = vm.searchName
        vm.scenicLists = []
        vm.page = 1
        this.getScenicList(vm.cityCode, sName)
      }
    },
    created: function () {
      this.getLocation()
    },
    mounted: function () {
    },
    watch: {
      searchName: function () {
        if (!this.searchName) {
          this.scenicLists = []
          this.getScenicList(this.cityCode)
        }
      }
    }
  }

</script>
<style type="text/css">

  .home{
    width: 100%;
    max-width: 768px;
    margin: 0 auto;
    min-height: 100vh;
    overflow: auto;
  }
  .h_top{
    width: 100%;
    position: relative;
    color: #fff;
    font-weight:bold;
    max-width: 768px;
    margin: 0 auto;
  }
  .h_top_img{
    width: 100%;
  }
  .h_top_img img{
    width: 100%;
    display: block;
    height: auto;
  }
  .h_top_box{
    position: absolute;
    width:100%;
    left: 0;
    top: 0;
    padding: 0 20px;
  }
  .h_top_w{
    margin-top:10%;
    position: relative;
  }
  .city_ct{
    display: block;
  }
  .city_ct span{
      font-size: 1.4rem;
      color: #fff;
    }
  .city_ct img{
      width: 1rem;
      margin-left: 10px;
      vertical-align: middle;
      margin-top: -10px; 
    }
    .city_c{
      margin-bottom: 1rem; 
    }
    .city_e span{
      font-size: 1rem;
      font-weight: normal;
    }
    .city_star img{
      width: .8rem;
    }
    .want_go{
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -1.5rem;
    }
    .want_go img{
      width: 3rem;
    }
    .n_top_search{
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 3rem;
      padding: 0 20px;
      height: 2rem;
      line-height: 2rem;
      overflow: hidden;
      margin-top: 3rem; 
    }
    .n_top_search input{
      width: 75%;
      padding: 0px 10px;
      float: left;
      height: 2rem;
      line-height: 2rem;
      border-radius: 1rem 0 0 1rem;
      background: none;
      border: 1px solid #DDD;
      border-right: 0px;
      outline: none;
      color: #FFF;
      background: rgba(0,0,0,0.3);
    }
    .n_top_search button{
      background: #19cb8f;
      width: 25%;
      height: 2rem;
      border: none;
      outline: none;
      border-radius:0 1rem 1rem 0;
    }
    .n_top_search button img{
      width: 1rem;
      margin-left: -.5rem;
    }
    .home_main{
      width: 100%;
      max-width: 768px;
      margin: 0 auto;
    }
</style>