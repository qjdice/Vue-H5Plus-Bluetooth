<template>
  <div id="app">
     <router-view/>
  </div>

</template>

<script>
export default {
  name: 'app',
  components:{
  },
  data () {
    return {
      
    }
  }
}
</script>

<style>
body,*{
  margin:0;padding:0;

}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*background:orange;*/
  border:1px solid #ccc;
  padding:2%;
  height: 100%;
}
html,body{
  height:100%;
  width: 100%;
}
#left{
  width:33%;
  /*height:600px;*/
  float:left;
  /*background:#C4D7C5;*/
  padding:1.5%;
  border-radius:5px;
  height: 100%;
}
#right{
  width:65%;
  float:left;
  /*background:#C4D7C5;*/
  margin-left:2%;
  padding:1.5%;
  /*height:600px;*/
  border-radius:5px;
  height: 100%;
}
#left-content{
  height:100%;
}
#top-content{
  height:85%;
}
#menu-content{
  height:15%;
}
#app:after{
  content:"";
  width:0;
  height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}

.slide-left-enter,
 .slide-right-leave-active {
     opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
     opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100% 0);
}

 .slide-left1-enter,
 .slide-right1-leave-active {
     opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
}

.slide-left1-leave-active,
.slide-right1-enter {
     opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100% 0);
}
</style>
