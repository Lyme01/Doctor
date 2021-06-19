const db=wx.cloud.database()
Page( {  
  data: {   
    // tab切换  
    currentTab:'待发货',  
    page:1,
    order:[], 
  },  
 
 order_state(){
    let that = this
    db.collection('order').where({
      medicinal_state:that.data.currentTab
    }).get({
      success:function(res){
        console.log(that.data.currentTab+'订单获取成功',res)
        that.setData({
          order:res.data
        })
      },fail:function(res){
        console.log('订单获取失败',res)
      }
    })
  },
  onLoad: function(options) {  
    let that = this
    that.setData({
      currentTab:options.currentTab
    })
  
    that.order_state()
  },  

  swichNav: function( e ) {  
    console.log(e)
     let that=this
    if( this.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else {  
      that.setData({
        currentTab:e.currentTarget.dataset.current,
      });
    };
    that.order_state()
  } 
})
