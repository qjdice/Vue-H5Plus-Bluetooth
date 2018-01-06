import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource); //请求资源插件

export default {
  getlist: function () {
  	return Vue.http.post('/v3/ecapi.addgoods.goodsbrand');
  },
  getstoreInfo: function (data) {
  	return Vue.http.post('/v2/ecapi.consignee.setDefault',data);
  }
}