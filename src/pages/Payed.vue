<template>
  <div class="payed">
    <msg title="支付成功" :description="description" :buttons="buttons" :icon='icon'></msg>
  </div>
</template>
<script type="text/javascript">
  import { Msg, Divider, XButton } from 'vux'
  import api from '../api/api.js'
  let timer
  export default {
    data () {
      return {
        icon: '',
        buttons: [{type: 'primary', text: '确定', onClick: this.goGuide}],
        data: {},
        description: '正在为您派送激活码...',
        status: '',
        code: null
      }
    },
    components: {
      Msg,
      Divider,
      XButton
    },
    methods: {
      getQuery () {
        console.log(this.$route.query)
        if (this.$route.query.code) {
          this.code = this.$route.query.code
          this.description = '恭喜，您的激活码为:' + this.code
          this.getAccessToken(this.code)
        }
      },
      getPayStatus () {
        let vm = this
        if (vm.code) {
          return
        }
        let params = {paySerialNo: localStorage.paySerialNo}
        api.GetPayStatus(params).then(res => {
          vm.data = res.data
          vm.status = res.data.status
          console.log(vm.data)
        })
      },
      getAccessToken (code) {
        let params = {spotId: localStorage.spotId, licenseCode: code}
        api.GetAccessToken(params).then(res => {
          if (res.data.status === 1) {
            let obj = {'accessToken': res.data.accessToken}
            let str = JSON.stringify(obj)
            localStorage.setItem(localStorage.spotId, str)
          }
        })
      },
      goGuide () {
        this.$router.push({path: '/guide', query: {spotId: localStorage.spotId}})
      }
    },
    created: function () {
      this.getQuery()
      let vm = this
      vm.getPayStatus()
    },
    watch: {
      status: function () {
        let vm = this
        if (vm.data.status === 1) {
          vm.description = '恭喜，您的激活码为:' + vm.data.code
          clearTimeout(timer)
          vm.getAccessToken(vm.data.code)
        } else if (vm.data.status === 0) {
          timer = setTimeout(vm.getPayStatus, 5000)
        } else {
          vm.description = vm.data.msg
          clearTimeout(timer)
        }
      }
    }
  }
</script>
<style type="text/css">
  .payed{
    width: 100%;
    min-height: 100vh;
  }
</style>