<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <audio src='' controls="controls" id='audio' hidden="hidden"></audio>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
}


::-webkit-scrollbar-track
{
  opacity: 0;
}

::-webkit-scrollbar
{
  opacity: 0;
}

::-webkit-scrollbar-thumb
{
  opacity: 0;
}
input,textarea{
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius:0
}
html {
}
body {
  margin: 0 auto;
  font-family: "Helvetica Neue",Helvetica,"Hiragino Sans GB","Microsoft YaHei",Arial,sans-serif;
}
fieldset,iframe{border:none}
ul,ol,li{list-style:none}
th{text-align:left}
img{
  border:none;
  -webkit-transform: scale(1) rotate(0) translate3d(0,0,0);
  transform: scale(1) rotate(0) translate3d(0,0,0);
}
em,i{font-style:normal}
a{color:#333;text-decoration:none;cursor:pointer;}
a:hover{color:#19cb8f;text-decoration:none;}
a:active{color:#19cb8f;text-decoration:none;}
a:focus{outline:none;color: #333;}
input{
    -webkit-appearance: none;
    appearance:button;
    -moz-appearance:button; /* Firefox */
    -webkit-appearance:button; /* Safari 和 Chrome */
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clearfix:after{visibility:hidden;display:block;font-size:0;content:" ";clear:both;height:0;}
*{box-sizing: border-box;}
* html .clearfix{zoom:1;} /* IE6 */
*:first-child+html .clearfix{zoom:1;} /* IE7 */
::-webkit-input-placeholder { /* WebKit browsers */  
    color: #A9A9A9;  
}
.container{
  position: relative;
  padding: 0 15px;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */  
   color:  #A9A9A9;  
   opacity:  1;  
}  
::-moz-placeholder { /* Mozilla Firefox 19+ */  
   color:  #A9A9A9;  
   opacity:  1;  
}  
:-ms-input-placeholder { /* Internet Explorer 10+ */  
   color:  #A9A9A9;  
}  

#app {
  margin: 0 auto;
  height: 100%;
 /* overflow: auto;*/
}
.amap-icon img{

}
.amap-copyright{
  display: none!important;
}
.amap-logo{
  display: none!important;
}
.amap-marker-label{
  border-color: #999;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  white-space: nowrap;
  font-size: 12px;
  line-height: 14px;
  max-width: 100px;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
}
.amap-ui-district-cluster-marker{
  display:none;
}
.amap-simple-marker{
  position: relative;
}
.amap-simple-marker img{
  display: block;
}

.cluster-marker-label{
  position: absolute;
  top:50%;
  left: 50%;
  font-size: 12px;
  width: 13px;
  color: #fff;
  margin-top: -8px;
  margin-left: -6.5px;
  text-align: center; 
  font-weight: bold;
}
.amap-marker-content2{
  position: relative;
  width: 30px;
  height: 30px;
}
/*.cluster-marker-label2{
  position: absolute;
  top:50%;
  left: 50%;
  font-size: 12px;
  width: 13px;
  color: #fff;
  text-align: center;
  font-weight: bold;
}*/
.poi-img {
width: 30px;
height: 30px;
background-position: 50% 50%;
border: 1px solid #8e8e8e;
border-radius: 15px;
}
/*
.poi-img:before,
.poi-img:after {
content: '';
display: block;
position: absolute;
width: 0;
height: 0;
border: solid rgba(0, 0, 0, 0);
border-width: 6px 6px;
top: -12px;
left: 9px;
border-bottom-color: #505050;
}

.poi-img:before {
top: -13px;
border-bottom-color: #8e8e8e;
}*/
.weui-dialog__title{
  font-size: 16px!important;
}
.weui-dialog__bd {
  min-height: 0px!important;
}
.weui-dialog__ft {
  line-height: 42px!important;
  font-size: 16px!important;
}
.weui-progress__bar{
  background-color: #fff!important;
}
.weui-wepay-flow__bd{
  align-items: left !important;
}
@media screen and (max-width: 350px){
  .weui-dialog__title{
    font-size: 14px!important;
  }
  .weui-dialog__ft {
    line-height: 40px!important;
    font-size: 14px!important;
  }
}
._v-container{
    overflow: visible!important;
    position: fixed!important;
  }
::-webkit-scrollbar{
    display: none;
  }

@media screen and (min-width: 768px){
  ._v-container{
    overflow: visible!important;
  }
::-webkit-scrollbar{
    display: none;
  }
}

</style>
