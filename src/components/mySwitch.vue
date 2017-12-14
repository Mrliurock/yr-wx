<template>
  <div class="my-switch">
    <input class="my-switch-checkbox" id="onoffswitch" type="checkbox" v-model="ck" @click="ckchange">
    <label class="my-switch-label" for="onoffswitch">
      <span class="my-switch-inner" data-on="" data-off=""></span>
      <span class="my-switch-switch"></span>
    </label>
  </div>
</template>
<script type="text/javascript">
  export default {
    data () {
      return {
        ck: false
      }
    },
    props: ['status'],
    methods: {
      ckchange (e) {
        if (this.status === 0) {
          e.preventDefault()
          this.ck = false
          this.$emit('clk', this.ck)
        }
      }
    },
    watch: {
      ck: function () {
        this.$emit('clk', this.ck)
      }
    }
  }
</script>
<style type="text/css">
.my-switch {  
    position: relative;   
    width: 25px;  
    margin: 0;  
    -webkit-user-select:none;   
    -moz-user-select:none;   
    -ms-user-select: none; 
}  
  
.my-switch-checkbox {  
    display: none;
}  
  
.my-switch-label {  
    display: block;   
    overflow: hidden;   
    cursor: pointer;  
    border: 1px solid #d3d3d3;   
    border-radius: 20px;  
}  
  
.my-switch-inner {  
    display: block;   
    width: 200%;   
    margin-left: -100%;  
    transition: margin 0.3s ease-in 0s;  
}  
  
.my-switch-inner::before, .my-switch-inner::after {  
    display: block;   
    float: right;   
    width: 50%;   
    height: 13px;   
    padding: 0;   
    line-height: 13px;  
    font-size: 12px;   
    color: white;   
    font-family:   
    Trebuchet, Arial, sans-serif;   
    font-weight: bold;  
    box-sizing: border-box;  
}  
  
.my-switch-inner::after {  
    content: attr(data-on);  
    padding-left: 4px;  
    background-color: #31d4ff;   
    color: #FFFFFF;  
}  
  
.my-switch-inner::before {  
    content: attr(data-off);  
    padding-right: 4px;  
    background-color: #f1f1f1;   
    color: #999999;  
    text-align: right;  
}  
  
.my-switch-switch {  
    position: absolute;   
    display: block;   
    width: 15px;  
    height: 15px;  
    margin: 0px;  
    background: #FFFFFF;  
    top: 0;   
    bottom: 0;  
    right: 12px;  
    border: 1px solid #d3d3d3;   
    border-radius: 20px;  
    transition: all 0.3s ease-in 0s;  
}  
  
.my-switch-checkbox:checked + .my-switch-label .my-switch-inner {  
    margin-left: 0;  
}  
  
.my-switch-checkbox:checked + .my-switch-label .my-switch-switch {  
    right: 0px;   
}
</style>