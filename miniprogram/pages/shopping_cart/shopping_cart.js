
// pages/shopping_cart/shopping_cart.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    medicinal:[],
    money:0,
    medicinal_now:[],
    medicinal_id:[],
    delet_id:[],
    num:0,
    allChecked:"",
    allChecked1:[]
  },
  // 支付事件
  pay:function(e){
    let that = this
    db.collection('shopping_cart').where({
      medicinal_checked:"true"
    }).get({
      success:function(res){
        console.log('获取商品成功',res)
        if(res.data.length == 0){
          wx.showToast({
            title: '你还未选择商品',
            icon:"none"
          })
        }else{
          wx.navigateTo({
            url: '../medicinal/pay',
          })
        }
      },fail:function(res){
        console.log('获取商品失败',res)
      }
    })
  },
  // 计算金额
  money_sum() {
    let that = this
    let money_sum = 0
    for(var x = 0;x<that.data.medicinal.length;x++){
      if(that.data.medicinal[x].medicinal_checked == "true"){
        money_sum=money_sum+(that.data.medicinal[x].medicinal_num*that.data.medicinal[x].medicinal_price)
      }
    }
    that.setData({
      money:money_sum,
    
    })
  },
  num_sum() {
    let that = this
    db.collection('shopping_cart').where({
      medicinal_checked:'true'
    }).count({
      success: function(res) {
        console.log(res.total)
        that.setData({
          num:res.total
        })
      },
      fail: console.error
    })
    云函数
  },
    // 选择事件
   select:function(e){
      let that = this
      console.log(e)
      that.setData({
        delet_id:that.data.delet_id.concat(e.detail.value[0])
      })
      if(e.detail.value.length !== 0){
        db.collection('shopping_cart').doc(e.target.dataset.id).update({
          data:{
            medicinal_checked:"true",
          },success:function(res){
            that.onLoad()
          }
        })
      }else{
        db.collection('shopping_cart').doc(e.target.dataset.id).update({
          data:{
            medicinal_checked:""
          },success:function(){
            that.onLoad()
          }
        })
      }
    },
   

  
 
   
    checked(){
      let that=this
      db.collection('shopping_cart').where({
        tags: _.all(['medicinal_check'])
      })
      .get({
        success:function (res){
          that.setData({
            allChecked1:res.data
          })
         console.log('获取成功',res)
        },
        fail: console.error
      })
    },
  // 商品删除
  delete:function(){
    let that = this
    wx.cloud.callFunction({
      name:"shopping_del",
      success:function(res){
        console.log('删除商品成功',res)
        that.onLoad()
      },fail:function(res){
        console.log('删除商品失败',res)
      }
    })
  },

  // 商品数量加事件
  medicinal_add:function(e){
    let that = this
    console.log(e)
    db.collection('shopping_cart').doc(e.target.dataset.id).update({
      data: {
        medicinal_num: _.inc(1)
      }, success:function(res){
        console.log('商品数量加一',res)
        that.onLoad()
      },fail:function(res){
        console.log('获取商品价格失败',res)
      }
    })
  },

  // 商品数量减事件
  medicinal_reduce:function(e){
    let that = this
    console.log(e)
    if(e.target.dataset.medicinal_num<2){
      wx.showToast({
        title: '最少购买一件哦！',
      })
    }else{
      db.collection('shopping_cart').doc(e.target.dataset.id).update({
      data: {
        medicinal_num: _.inc(-1)
      }, success:function(res){
        console.log('商品数量加一',res)
        that.onLoad()
      },fail:function(res){
        console.log('获取商品价格失败',res)
      }
    })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    db.collection('shopping_cart').get({
      success:function(res){
        console.log('获取购物车商品成功',res)
        that.setData({
          medicinal:res.data,
        })
        that.money_sum()
        that.num_sum()
        that.allChecked() 
        that.checked()
      },fail:function(res){
        console.log('获取购物车商品失败',res)
      }
    })
  
},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    db.collection('shopping_cart').get({
      success:function(res){
        console.log('获取购物车商品成功',res)
        that.setData({
          medicinal:res.data,
        })
        that.money_sum()
        that.num_sum()
        that.allChecked() 
      },fail:function(res){
        console.log('获取购物车商品失败',res)
      }
    })
  },
   

})
