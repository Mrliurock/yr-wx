<template>
  <div class="pay">
    <div class="payhead clearfix">
      <b @click="$router.go(-1)"></b><span>支付方式</span>
    </div>
    <div class="payDetail">
      <div><span>应付金额：</span><i>&yen;{{data.payprice}}</i></div>
      <div style="font-style:italic;text-decoration:line-through"><span>抵扣金额: </span>&yen;{{data.integral_money}}</div>
      <div><span>产品名称：</span>{{data.ordername}}</div>
    </div>
    <div class="payWX" @click="wxPay" v-if="isWX">
      <img :src="imurl+'wx.png'"><span>微信支付</span>
      <i></i>
    </div>
    <div class="payZFB" @click="zfbPay" v-if="!isWX">
      <img :src="imurl+'zfb.png'"><span>支付宝</span>
      <i></i>
    </div>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import api from '../api/api.js'
  const pingpp = require('pingpp-js')
  export default {
    data () {
      return {
        orderNo: '',
        data: {},
        isWX: false,
        openid: '',
        imurl: api.imgUrl
      }
    },
    methods: {
      getOrderNo () {
        this.orderNo = this.$route.query.orderNo
        this.openid = this.$route.query.openid
        console.log(this.openid)
      },
      getChannel () {
        let channel = api.getVersion()
        console.log(channel)
        if (channel === 'wx') {
          this.isWX = true
        } else {
          this.isWX = false
        }
      },
      getOrder () {
        let vm = this
        let params = {orderNo: vm.orderNo}
        api.GetOrder(params).then(res => {
          console.log(res.data)
          vm.data = res.data
        })
      },
      zfbPay () {
        let vm = this
        let cn = api.getVersion()
        let paychannel
        let extra
        if (cn === 'web') {
          paychannel = 'alipay_pc_direct'
          extra = {'success_url': `${api.proUrl}payed`}
          vm.pingppPay(paychannel, extra)
          return
        }
        if (cn === 'mobile' || cn === 'wx') {
          paychannel = 'alipay_wap'
          extra = {'success_url': `${api.proUrl}payed`, 'app_pay': true}
          vm.pingppPay(paychannel, extra)
          return
        }
      },
      generateCB () {
        return `jsonp${Math.ceil(Math.random() * 1000000)}`
      },
      wxPay () {
        let paychannel = 'wx_pub'
        let extra = {'open_id': this.openid}
        this.pingppPay(paychannel, extra)
      },
      pingppPay (pc, ex) {
        let vm = this
        let params = {orderNo: vm.data.orderno, channel: pc, extra: ex}
        axios({
          method: 'post',
          url: `${api.baseUrl}pay.do`,
          data: params,
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*', 'X-Requested-With': 'XMLHttpRequest'},
          withCredentials: true
        }).then(res => {
          let data = res.data
          if (!data.success) {
            alert(data.msg)
            return
          }
          localStorage.paySerialNo = res.data.data.orderNo
          pingpp.createPayment(res.data.data, function (result, err) {
            if (result === 'success') {
              vm.$router.push({path: '/payed'})
            } else if (result === 'fail') {
              alert('支付失败')
            } else if (result === 'cancel') {
              alert('取消支付')
            }
          }, err => {
            alert(JSON.stringify(err))
          })
        }).catch(err => {
          alert(JSON.stringify(err))
        })
      }
      // loadScript (url, func) {
      //   var head = document.head || document.getElementByTagName('head')[0]
      //   var script = document.createElement('script')
      //   script.src = url
      //   script.type = 'text/javascript'
      //   script.id = 'wxpay'
      //   script.onload = script.onreadystatechange = function () {
      //     if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
      //       script.onload = script.onreadystatechange = null
      //     }
      //   }
      //   head.appendChild(script)
      // }
    },
    created: function () {
      this.getOrderNo()
      this.getOrder()
      this.getChannel()
    }
  }
</script>
<style type="text/css">
  .pay{
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
    max-width: 768px;
    margin:0 auto;
    min-height: 100vh;
  }
  .payhead{
    height: 3rem;
    line-height: 3rem;
    background: #11cd8d;
    color: #fff;
    text-align: center;
    position: relative;
    font-size: 1.2rem;
    width: 100%;
  }
  .payhead b{
    height: 1.5rem;
    width: .7rem;
    left:1rem;
    display: inline-block;
    background:url(../assets/images/dis-icon03.png) no-repeat center;
    background-size: 100%;
    position: absolute;
    top: .75rem;
  }
  .payDetail{
    padding: .6rem;
    background: #fff;
  }
  .payDetail>div:not(:last-child){
    margin-bottom: .5rem;
  }
  .payDetail>div span{
    display: inline-block;
    width: 6rem;
    color: #999;
  }
  .payDetail>div i{
    color:#E64340;
  }
  .payWX,.payZFB{
    width: 100%;
    height: 4rem;
    line-height: 4rem;
    padding: .5rem;
    background: #fff;
    margin-top: 3rem;
    position: relative;
    cursor: pointer;
  }
  .payWX img,.payZFB img{
    height: 3rem;
    width: 3rem;
  }
  .payWX span, .payZFB span{
    display: inline-block;
    height: 3rem;
    line-height: 3rem;
    vertical-align: top;
    margin-left: 2rem;
  }
  .payWX i,.payZFB i{
    position: absolute;
    width: 1rem;
    height: 2rem;
    background:url(../assets/images/z-icon-06.png) no-repeat center;
    top:50%;
    right: 2%;
    margin-top: -1rem;
  }
  .payZFB{
    margin-top: 1rem;
  }
</style>