<template>
  <div class="order">
    <div class="order_head">
      <div class="oh_detail">
        <div class="oh_img">
          <img :src="imgUrl + scenic.image">
        </div>
        <div class="pd_name">{{product.name}}</div>
        <!-- <div class="pd_info">{{product.introduce}}</div> -->
        <div class="pd_price clearfix">&yen;{{product.price}}元<span>/张</span><i @click="payKnow=true">购票须知&gt;&gt;</i></div>
      </div>
    </div>
    <x-dialog v-model="payKnow" :dialog-style="{'max-width': '100%', width: '100%', height: '100%', 'background-color': 'transparent', 'color': '#fff'}">
      <h3 style="margin-top:1rem;">购票须知</h3>
      <div v-html="booknotice"></div>
      <img :src="imurl+'close2.png'" style="position:absolute;bottom:2rem;left:50%;margin-left:-26px;cursor:pointer" @click="payKnow=false">
    </x-dialog>
    <div style="flex:1;width:100%;">
      <div class="pd_count">
      <span>购买数量</span>
      <div class="count">
        <b class="sub" v-bind:class="{ cannot: count === 1 }" @click="sub">-</b><b style="font-weight: normal;font-size:1rem;border-right:0">{{count}}</b><b @click="add">+</b>
      </div>
    </div>
    <group>
      <x-input v-model="coupon" label-width="5rem" title="优惠券" name="coupon" placeholder="请输入优惠卷号" type="number"></x-input> 
    </group>
    <div class="order_info">
      <group>
        <x-input v-model="contact" label-width="5rem" title="姓名" name="ordername" placeholder="请输入姓名" is-type="chine-name"></x-input>
        <x-input v-model="mobile" label-width="5rem" title="手机号码" name="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile" type="tel" required></x-input>
      </group>
    </div>
    <div class="tishi">注意：此号码用于接收激活码，不要填错哦！</div>
    <div v-if="toast" class="toast">{{message}}</div>
    </div>  
    <div class="od_foot">
      <span>支付金额：</span><u v-if="price">{{price}}</u><i>{{total}}&nbsp;&yen;</i><b class="fr" @click="goPay">立即支付</b>
    </div>
  </div>
</template>
<script type="text/javascript">
  import api from '../api/api.js'
  import {XInput, Group, XDialog} from 'vux'
  export default {
    data () {
      return {
        spotId: '',
        scenic: {},
        product: {},
        booknotice: '',
        imgUrl: api.fileUrl,
        count: 1,
        contact: '',
        mobile: '',
        coupon: '',
        total: '',
        message: '',
        toast: false,
        payKnow: false,
        price: null,
        imurl: api.imgUrl
      }
    },
    components: {
      Group,
      XInput,
      XDialog
    },
    methods: {
      getSpotId () {
        this.spotId = this.$route.query.spotId
        localStorage.spotId = this.spotId
      },
      getProduct () {
        let vm = this
        let params = {spotId: vm.spotId}
        api.GetProduct(params).then(res => {
          console.log(res.data)
          vm.scenic = res.data
          vm.product = res.data.products
          vm.total = vm.count * vm.product.price
        })
      },
      getBooknotice () {
        let vm = this
        api.GetBooknotice().then(res => {
          vm.booknotice = res.data
        })
      },
      sub () {
        if (this.count === 1) {
          return
        } else {
          this.count--
        }
      },
      add () {
        this.count++
      },
      goPay () {
        let vm = this
        let canpay = vm.canpay(vm.contact, vm.mobile)
        if (canpay) {
          let cn = api.getVersion()
          let params = {mobile: vm.mobile, contacts: vm.contact, productid: vm.product.id, producttype: 2, quantity: vm.count, source: 1, coupon: vm.coupon}
          api.PayOrder(params).then(res => {
            if (res.data.needPay === 0) {
              vm.$router.push({path: '/payed', query: {code: res.ext.code}})
              return
            }
            if (cn === 'wx') {
              let redirectUil = `${api.baseUrl}wx/pay.do?orderNo=${res.data.orderNo}&redurl=${api.proUrl}pay?orderNo=${res.data.orderNo}`
              redirectUil = encodeURIComponent(redirectUil)
              window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + api.appid + '&redirect_uri=' + redirectUil + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
            } else {
              vm.$router.push({path: '/pay', query: res.data})
            }
          })
        }
      },
      canpay (c, m) {
        let pattern = /^1[34578]\d{9}$/
        // if (!c) {
        //   this.message = '姓名不能为空！'
        //   this.toast = true
        //   return false
        // } else {
        //   if (!pattern.test(m)) {
        //     this.message = '电话号码输入有误！'
        //     this.toast = true
        //     return false
        //   }
        // }
        if (!pattern.test(m)) {
          this.message = '电话号码输入有误！'
          this.toast = true
          return false
        }
        return true
      }
    },
    created: function () {
      this.getSpotId()
      this.getProduct()
      this.getBooknotice()
    },
    watch: {
      count: function () {
        this.total = this.count * this.product.price
      },
      coupon: function () {
        let vm = this
        if (vm.coupon !== '') {
          let params = {productid: vm.product.id, producttype: 2, quantity: vm.count, coupon: vm.coupon}
          api.GetDiscount(params).then(res => {
            if (!res.success) {
              vm.toast = true
              vm.message = '对不起，您的优惠卷号有误，无法为您优惠'
            } else if (res.success) {
              vm.total = true
              vm.message = `恭喜，您的优惠卷可以为您优惠 ￥${res.data.deduction} 元`
              vm.price = res.data.price
              vm.total = res.data.payAmount
            }
          }, err => {
            if (err) {
              vm.toast = true
              vm.message = '对不起，您的优惠卷号有误，无法为您优惠'
            }
          })
        }
      }
    }
  }

</script>
<style type="text/css" scoped>
.order{
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  max-width: 1024px;
  margin:0 auto;
}
img{
  display: block;
}
.order_head{
  width: 100%;
  padding:.6rem 0;
  background-color: #fff;
}
.oh_img{
  margin:0 .5rem;
  position: absolute;
  left: 0;
  top: 0;
}
.oh_img img{
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 50%;
}
.oh_detail{
  width: 100%;
  padding-left: 6rem;
  position: relative;
  height: 4.8rem;
  padding-right: .6rem;
}
.pd_name{
  white-space: nowrap;
  width: 90%;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 28px;
}
.pd_info{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: .8rem;
  color: #666;
  margin-bottom: 5px;
}
.pd_price{
  color: #eb2848;
}
.pd_price span{
  font-size: 12px;
  color: #666;
}
.pd_price i{
  float: right;
  color: #3838e4;
  font-size: 13px;
  cursor:pointer;
}
.pd_count{
  height: 3rem;
  line-height: 3rem;
  width: 100%;
  padding:0 .6rem;
  background-color: #fff;
  margin-top: 1rem;
}
.count{
  float: right;
}
.count b{
  display: inline-block;
  height: 2rem;
  width: 2.5rem;
  font-size: 1rem;
  border:1px solid #eee;
  text-align: center;
  line-height: 2rem;
  border-radius: 2px;
  cursor: pointer;
}
b.sub{
  border-right: 0
}
.cannot{
  background-color: #f9f9f9
}
.od_foot{
  height: 3rem;
  background-color: #fff;
 /* position: fixed;*/
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  /*bottom: 0;*/
  line-height: 3rem;
  padding:0 .6rem;
  padding-right:0; 
}
.od_foot i {
  color: #32b96b;
}
.od_foot b{
  display: inline-block;
  background-color: #11cd8d;
  width: 6rem;
  text-align: center;
  cursor: pointer;
  color: #f2f2f2;
}
.toast{
  color:#E64340;
  padding: 10px;
}
.od_foot u{
  text-decoration: line-through;
  font-style:italic;
  margin-right: 10px;
}
.tishi{
  color: #999;
  font-size: .8rem;
  font-style: italic;
  text-indent: 2em;
  margin-top: 1em;
}
</style>