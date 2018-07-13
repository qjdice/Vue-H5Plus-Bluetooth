String.prototype.len = function()             
{   
    return this.replace(/[^\x00-\xff]/g, "xx").length;   
}   

//打印机调度function
var printer = require("node-thermal-printer");
var $http = require('axios');
var $store = require('../../store');
let async = require('async');
var network = require('./365PrintLibary.js');
module.exports = 
{
	
	//统一调用打印方法
	print:function(data,callback)
	{
		let type = "receipts";//打印场景
		let option = [];
		let sign = true;//通关标记
		let printinfo = {};//打印机配置信息
		let that = this;
		console.dir(data);

		if(data.length<=0)
		{
			callback(true);
			return;
		}



		//1.第一步获取打印机数据
		option.push(function(callback){

			that.getprint(type,function(row){

				if(row){

					printinfo = row;	
				}else{
					sign = false;
				}
				callback(null,true);
				
			});
		});

		option.push(function(callback){
			if(!localStorage.store && !localStorage.display_name)
			{
				
				that.getuserinfo(function(row){
					if(!row)
					{
						sign = false;
					}
					callback(null,true);
				});	
			}else{
				// console.dir(12);
				// return;
				callback(null,true)
			}
			
		})

		//2.第二步过滤并打印订单
		option.push(function(callback)
		{
		
			if(sign)
			{	
				async.mapSeries(data,function(item,callback){
					//拼接打印数据进行打印
					//
					if(item.is_print == 0)
					{
						that.sub_print("all",item,printinfo,function(row){
						if(row)
						{
							//打印成功
							item.is_print = 1;
						}
						callback(null,true);
						});
					}else{
						callback(null,true);
					}
					

				},function(err,row){

					callback(null,true);
				})


			}else{
				callback(null,true);
			}
		});
	
		// //4.返回带有打印标记字段的数据
		async.series(option,function(err,row){
			callback(data);
		});

	},
	//驱动打印
	drive:function(mm,data,printname,callback)
	{
	
		// printer.isPrinterConnected(function(err){
			
		// 	console.dir(err);
		// 	callback(null);
		// 	return;
		// })

		console.dir(printname);
		// if(!printname){
		// 	callback(false);
		// 	return;
		// }

		if(typeof callback != 'function') callback = function(){};

		printer.init({
		  type: 'epson',
		  interface: printname,
		});

		// 设置头部信息
		if(typeof data.shopname != 'undefined'){
			printer.alignCenter();
			printer.setTextQuadArea();
			printer.println(data.shopname,true);
		}
		if(typeof data.brand != 'undefined'){
			printer.alignLeft();
			printer.setTextDoubleHeight();
			printer.setTextDoubleWidth();
			printer.println('牌号:' + data.brand,true);
		}
		if(typeof data.orderno != 'undefined'){
			printer.alignLeft();
			printer.setTextNormal();
			printer.println('单号:' + data.orderno,true);
		}
		if(typeof data.account != 'undefined'){
			printer.alignLeft();
			printer.setTextNormal();
			printer.println('收银:' + data.account,true);
		}
		if(typeof data.dish == 'undefined') return false;

		// 分打印纸尺寸
		if(mm == 80){
			var all_spacing = 48;
			var dish_name_spacing = 22;
			var dish_price_spacing = 8;
			var dish_num_spacing = 17;

			var totalprice_spacing = 17;
			var paidin_spacing = 34;
			var separator = '------------------------------------------------';
			printer.println(separator);
			printer.println('    菜品              单价    数量          金额',true);
			printer.println(separator);
		}else if(mm == 58){
			var all_spacing = 32;
			var dish_name_spacing = 13;
			var dish_price_spacing = 8;
			var dish_num_spacing = 11;

			var totalprice_spacing = 11;
			var paidin_spacing = 18;
			var separator = '--------------------------------';
			printer.println(separator);
			printer.println('菜品         单价    数量   金额',true);
			printer.println(separator);
		}
		// 菜品总数量
		var totalnum = 0;
		var totalprice = 0;
		// 添加菜品信息
		for(var k in data.dish){
			var l = data.dish[k];
			
			var text = '';
			var ptext = '';
			var price = l.price.toFixed(2) + '';
			var num = l.num + '';
			var alltotal = l.total.toFixed(2) + '';
			text += l.name;
			for(var i = 0;i < dish_name_spacing - l.name.len();i++) text += ' ';
			text += price;
			for(var i = 0;i < dish_price_spacing - price.len();i++) text += ' ';
			text += num;
			for(var i = 0;i < dish_num_spacing - num.len() - alltotal.len();i++) text += ' ';
			text += alltotal;

			console.dir(l.Ingredient);
            if(l.Ingredient.length>0)
            {
                for(var keys  in  l.Ingredient)
                {
                    ptext += l.Ingredient[keys] + "\n";
                }
                
            }

            if(l.discountName.length>0)
            {
                for(var key in l.discountName)
                {
                 ptext += l.discountName[key] + "\n";
                }
            }

			totalnum += l.num;
			totalprice += l.price;
			printer.alignLeft();
			printer.setTextNormal();
			printer.println(text,true);
			printer.println(ptext,true);
		}
		// 分隔线
	    printer.println(separator);

	    if(data.discountinfo.length>0)
        {
           
            var  tt = '';
            
		     for(var key in data.discountinfo)
		     {
		        tt += data.discountinfo[key];
		     }
		     printer.println(tt,true);
        }

	    // 添加优惠信息
	    var ban = '';
	    for(var i = 0;i < all_spacing - (data.youhui.toFixed(2).length + '优惠:'.len());i++) ban += ' ';
	    printer.println('优惠:' + ban + data.youhui.toFixed(2),true);



		// 添加合计
		totalnum = totalnum + '';
		totalprice = totalprice.toFixed(2) + '';
		if(mm == 80){
			var he = '合计:                         ' + totalnum;
		}else if(mm == 58){
			var he = '合计:                ' + totalnum;
		}
		var h_ban = '';
		for(var i = 0;i < totalprice_spacing - totalprice.len() - totalnum.len();i++) h_ban += ' ';
		he += h_ban;
		he += totalprice;
		printer.println(he,true);
		// 分割线
		printer.println(separator);


		// 应收
		var ban = '';
	    for(var i = 0;i < all_spacing - (data.yingshou.toFixed(2).length + '应收:'.len());i++) ban += ' ';
	    printer.println('应收:' + ban + data.yingshou.toFixed(2),true);

		// 实收(小票怎么会有实收呢)
		// var paidin_ban = '';
		// var paidin = data.paidin.toFixed(2) + '';
		// var paidin_txt = '实收:     现金';
		// for(var i = 0;i < paidin_spacing - paidin.len();i++) paidin_ban+= ' ';
		// paidin_txt += paidin_ban + paidin;
		// printer.println(paidin_txt,true);

		printer.cut();

		printer.execute(function(err){
	
		callback(err);
		printer.clear();
		});
		
		
	},
	//网口打印
	network:function(mm,data)
	{

	},
	//获取打印机配置
	getprint:function(type,callback)
	{
		
		 	let self = this;
	        let url = $store.default.state.config.GLOBAL_CONFIG.API_HOST + "/sync-get-printer";
	        $http.defaults.headers['X-ODAPI-Authorization'] = localStorage.token;
	        $http.post(url,{print_type:type})
	        .then(function (response) {
	          let data = response.data;
           		// console.dir(data);return;
	          if(data.errcode == 0)
	          {
		           callback(data);
	          }else{
	          	   callback(false);
	          }
	        })
	        .catch(function (error) {
	        	console.dir(error);
	        	callback(false);
	        	mui.toast('网络有误');
	        });
		
	},	
	getuserinfo:function(callback)
	{
		let self = this;
		let url = $store.default.state.config.GLOBAL_CONFIG.API_HOST + "/point-api-getuserinfo";
		$http.defaults.headers['X-ODAPI-Authorization'] = localStorage.token;
		$http.post(url,{}).then(function(res){
			if(res.data.error_code == 0)
			{
				localStorage.store = res.data.data[0]['company_id'][1];
				localStorage.display_name = res.data.data[0]['display_name'];

				callback(true);

			}else{
				callback(false);
			}
		}).catch(function(error){
			callback(false);
		})
	},
	sub_print:function(state,data,printinfo,callback)
	{	

		let that = this;
		//根据订单打印状态
		if(data.state == state || state =="all")
		{	
			
			let obj = {};
			let dish = [];
			let total = 0;
			let youhui = 0;

			//小票打印机逻辑
			if(printinfo.data.print_type =="receipts"  && data.state == 'paid')
			{
				let system = require('../system/'+localStorage.filename);
				
				obj = system.print_data(data);

				console.dir(obj);
				// return;
				if(printinfo.data.type == "drive")
				{	
					that.drive(printinfo.data.size,obj,"printer:"+printinfo.data.name,function(err){

						if(err)
						{
							// console.dir(2);
							callback(false);
						}else{
							// console.dir(1);
							callback(true);
						}
							
					})
				}

				if(printinfo.data.type == "365printer")	
				{
					
					obj.mm = printinfo.data.size;

						console.dir(obj);
						// callback(true);

						// return;
					network.print(printinfo.data.deviceno,printinfo.data.devicekey,obj,function(data)
					{		
							console.dir(data);
						   	if(data.data.responseCode == 0)
						   	{
						   		callback(true);
						   	}else{
						   		callback(false);
						   	}	

						   	
						  

					});
				}else{

					 // callback(false);
				}
				// console.dir(1);
				//

				//else if???

				
			}else{
				callback(null,true);
			}

			//厨房打印机逻辑
			// if(printinfo.print_type == "???")
			// {
			// 	//?????
			// }

		}else{
			callback(false);
		}
	},

	system_printmap:function(data,type)
	{
		  let system = require('../system/'+localStorage.filename);

		  let str = system.printmap(data,type); 	

		  return str;
	},
	suns:function(data)
	{
		 let system = require('../system/'+localStorage.filename);

		 let sum = system.sums(data); 	
		 
		  return sum;
	}


}
