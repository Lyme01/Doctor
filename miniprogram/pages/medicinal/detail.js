// pages/medicinal/detail.js
 const db=wx.cloud.database()
 const _=db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
   medicinal_src:[],
   medicinal_name:"",
   medicinal_detail:"",
   medicinal_price:"",
   medicinal_num:"",
   medicinal_id:[],
   id:""
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let that = this
    console.log('产品的id已经获取到了',options.id)
    db.collection('medicinal').doc(options.id).get({
      success:function(res){
        console.log('商品详细信息获取成功',res)
        that.setData({
          medicinal_src:res.data.src,
          medicinal_name:res.data.name,
          medicinal_num:res.data.num,
          medicinal_price:res.data.price,
          medicinal_detail:res.data.detail,
          id:res.data._id
        })
      
      },fail:function(res){
        console.log('商品详细信息获取失败',res)
      }
    })
   
  },
  

  into_shopping_cart:function(){
    let that = this
    db.collection('shopping_cart').where({
     medicinal_id: that.data.id
    }).get({
      success:function(res){
        console.log(res)
        if(res.data == ""){
          db.collection('shopping_cart').add({
            data:{
            medicinal_name:that.data.medicinal_name,
            medicinal_src:that.data.medicinal_src[0],
            medicinal_price:that.data.medicinal_price,
            medicinal_num:1,
            medicinal_id:that.data.id,
            // 新增代码
            
            },success:function(res){
              console.log('商品加入购物车成功',res)
              wx.showToast({
                title: '加入成功',
              })
            },fail:function(res){
              console.log('商品加入购物车失败',res)
            }
          })
        }else{
         wx.showToast({
           title: '已有这个商品',
         })
          
        }
      },fail:function(res){
        console.log(res)
      }
    })
  },

  // 购买模块
  buy:function(){
    let that=this
    db.collection('shopping_cart').where({
    medicinal_id: that.data.id
    }).get({
      success:function(res){
        console.log(res)
        if(res.data==""){
            db.collection('shopping_cart').add({
              data:{
                medicinal_name:that.data.medicinal_name,
                medicinal_src:that.data.medicinal_src[0],
                medicinal_price:that.data.medicinal_price,
                medicinal_num:1,
                medicinal_id:that.data.id,
              },success:function(res){
              console.log('商品加入购物车成功',res)
              wx.switchTab({
                url: '../shopping_cart/shopping_cart',
              })
              },fail:function(res){
                console.log('商品加入购物车失败',res)
              }
            })
        }else{
        wx.switchTab({
          url: '../shopping_cart/shopping_cart',
        })
        }
      },fail:function(res){
        console.log(res)
      }

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
 
})