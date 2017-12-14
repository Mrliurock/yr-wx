<template>
  <div class="strategy">
    <div class="stg_head">
        <b @click="$router.go(-1)"></b><span>旅游攻略</span>
    </div>
    <div><img :src="info.image?fileUrl+info.image:imgUrl+'dy-tu-01.jpg'"></div>
    <div class="stg_info">
      <h4>{{info.name}}游玩介绍</h4>
      <p>门票：{{info.needticket?'收费':'免费'}}</p>
      <p>景区类型：{{info.typename}}</p>
      <p>开放时间：{{info.opentime}}</p>
      <p>交通：</p>
    </div>
    <div class="stg_addr">地址：{{info.address}}</div>
    <div class="stg_lists">
      <h4>景区攻略</h4>
      <div class="stg_list" v-for="(item, index) in tgList" :key="index">
        <img :src="imgUrl+'xz-icon-03.png'">
        <div v-if="tgDetail[item.id]">
          <p>{{tgDetail[item.id].name}}</p>
          <p>{{tgDetail[item.id].createtime}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import api from '../api/api.js'
  export default {
    data () {
      return {
        spotid: '',
        fileUrl: api.fileUrl,
        imgUrl: api.imgUrl,
        tgList: [],
        tgDetail: {},
        info: {}
      }
    },
    methods: {
      getSpotId () {
        this.spotid = this.$route.query.spotId
      },
      getBaseinfo () {
        let vm = this
        let params = {spotId: vm.spotid}
        api.GetProduct(params).then(res => {
          vm.info = res.data
        })
      },
      getTGlist () {
        let vm = this
        let params = {spotid: vm.spotid}
        api.GetTGlist(params).then(res => {
          vm.tgList = [...res.data]
          return vm.tgList
        }).then(tgList => {
          tgList.forEach((tg) => {
            let params = {id: tg.id}
            api.GetTGdetail(params).then(res => {
              vm.$set(vm.tgDetail, `${res.data.id}`, res.data)
            })
          })
          console.log(vm.tgDetail)
        })
      }
    },
    created () {
      this.getSpotId()
      this.getBaseinfo()
      this.getTGlist()
    }
  }
</script>
<style type="text/css" scoped>
  .strategy{
    max-width: 768px;
    width: 100%;
    margin: 0 auto;
    min-height: 100vh;
    background: #f7f7f7;
  }
  .stg_head{
    height: 3rem;
    line-height: 3rem;
    background: #11cd8d;
    color: #fff;
    text-align: center;
    position: relative;
    font-size: 1.2rem;
  }
  .stg_head b{
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
  .strategy div img{
    width: 100%;
  }
  .stg_info{
    background: #fff;
    padding: 10px;
  }
  h4{
    border-left: 3px solid #11cd8d;
    padding-left: 5px;
  }
  .stg_info h4 + p{
    margin-top: 10px;
  }
  .stg_info p{
    font-size: .9rem;
    color: #707070;
  }
  .stg_addr{
    font-size: .9rem;
    color: #707070;
    padding: 10px;
    background: #fff;
    margin:10px 0;
  }
  .stg_lists{
    padding: 10px;
    background-color: #fff;
  }
  .stg_list{
    padding:5px 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
  }
  .strategy .stg_list>img{
    width: 4.5rem;
    height: 3.5rem;
    border-radius: 5px;
  }
  .stg_list div{
    display: flex;
    flex: 1;
    height: 3.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: .9rem;
    color: #707070;
    margin-left: 10px;
  }
  .stg_list div p:last-child{
    text-align: right;
  }
</style>