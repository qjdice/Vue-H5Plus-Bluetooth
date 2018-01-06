<template>
  <div class="setting">
    <button type="button" class="mui-btn mui-btn-primary mui-btn-outlined" @click="startBlue">{{msg}}</button>
    <div class="Bluelist">
	    <ul class="mui-table-view">
		    <li class="mui-table-view-cell first">未配对列表(点击开始配对)</li>
		    <li class="mui-table-view-cell" @click="Bluepairing(index)" v-for="(item,index) in Unpairedlist">
		    	{{index}} -- {{item.bleName}}
		    </li>
		</ul>

		<ul class="mui-table-view Blueinpairing">
		    <li class="mui-table-view-cell first">已配对列表(点击连接)</li>
		    <li class="mui-table-view-cell" @click="ConnectDevice(index)" v-for="(item,index) in Pairedlist">
		    	{{index}} -- {{item.bleName}}
		    </li>
		</ul>
	</div>

  </div>
</template>

<script>
export default {
  name: 'Bluesetting',
  data () {
    return {
      msg: '开始搜索',
      isSearch:false,
      Pairedlist:[],
      Unpairedlist:[],
      blue:null, // 当前组件全局蓝牙类
      BlueConnect:null // 连接对象
    }
  },
  methods: {
    changeInfo : function (type) {      
      this.$parent.selectInfoCom = type; 
    },
    // 搜索蓝牙设备
    startBlue: function(){
      	var self = this;
        if(!self.blue.CheckBluetoothState()){ // 判断是否开启蓝牙
            self.blue.StartBluetooth();
            return;
        }
        self.Pairedlist = [];
        self.Unpairedlist = [];
        self.isSearch = true;

        mui('.mui-btn').button('loading');
        self.blue.StartSeatch(function(obj){
          if(obj){
            if(obj.bleName){
            	if(obj.isPaired){
            		self.Pairedlist.push(obj);
            	}else{
            		self.Unpairedlist.push(obj);
            	}
            }
          }
        },function(){
          self.msg = '搜索结束，重新搜索！';
          mui('.mui-btn').button('reset');
          self.isSearch = false;
        });
    },
    // 进行配对
    Bluepairing:function(index){
      if(this.isSearch){
      	mui.toast('正在搜索当中，请稍后');
      	return;
      }
      if(!this.Unpairedlist[index]){
        mui.toast('设备不存在');
        return;
      }
      var self = this,
      	  BleDevice = self.Unpairedlist[index].BleDevice,
      	  bleId = self.Unpairedlist[index].bleId;
      mui('.mui-btn').button('loading');

      self.blue.Bluepairing(BleDevice,bleId,function(msg){
      	mui.toast(msg.errmsg);

      	self.Pairedlist.push(self.Unpairedlist[index]); // 已配对设备新增元素
      	self.Unpairedlist.splice(index,1); // 未配对设备删除元素

      	self.msg = '配对结束，重新搜索！';
        mui('.mui-btn').button('reset');

      },function(msg){
      	mui.toast(msg.errmsg);
      	self.msg = '配对结束，重新搜索！';
        mui('.mui-btn').button('reset');
      });
    },
    // 连接设备
    ConnectDevice:function(index){
      if(this.isSearch){
    	  mui.toast('正在搜索当中，请稍后');
    	  return;
      }
	    if(!this.Unpairedlist[index]){
	      mui.toast('设备不存在');
	      return;
	    }

	    var self = this;
	    mui.plusReady(function(){
    		var bleId = self.Pairedlist[index].bleId;
    		if(!self.BlueConnect || self.BlueConnect.BleId != bleId){
    			self.BlueConnect = new self.ConnectPrinter.BluePrinter(bleId);
    		}

    		if(self.BlueConnect.ConnectStatus){
    			mui.alert('连接成功');
          // Todo:  打印的代码
    		}else{
    			mui.alert('连接失败');
          // Todo: 执行连接
    		}
	    });
    }

  },
  // 初始化
  mounted:function(){
    // 初始化创建对象
    var self = this;
    mui.plusReady(function(){
    	self.blue = new self.SearchBluetooth();
    }); 
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.setting{
  height:90%;
  width:100%;
}
.Bluelist{
	margin:0 auto;
	width:60%;
	margin-top:20px;
}
.first{
	font-size:14px;
}
.Blueinpairing{
	margin-top:20px;
}
</style>
