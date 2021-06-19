// pages/admin/drugs_gl.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   medicinal:[],
   lists: [],
  page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {


    let that=this
    const c = db.collection("medicinal"); //获取集合中记录的总数
    const total = await (await c.count()).total
    const batchTimes = Math.ceil(total / 20)
    console.log(batchTimes) //计算需要获取几次  比如你有36条数据就要获取两次 第一次20条第二次16条
    let arraypro = []
 
    let x = 0 //这是一个标识每次循环就+1 当x等于batchTimes 说明已经到了最后一次获取数据的时候
    //没错，循环查询，看着就觉得很影响性能，但是么的办法。
    for (let i = 0; i < batchTimes; i++) {
  //  药品获取
  db.collection('medicinal').skip(i * 20).get({
    success:function(res){
    
      x += 1
          // 20个20个的获取 最后一次不够20 那就是剩下的
          for (let j = 0; j < res.data.length; j++) {
           arraypro.push(res.data[j])
          }

          if (x == batchTimes) {
            console.log(arraypro)
            that.setData({
             medicinal: arraypro
            })
            console.log(that.data.medicinal)
    }},
    fail:function(res){
      console.log('药品获取失败',res)
    }
  })
    }
    
  },
  onReachBottom: function () {
    // 最后一页了，取消下拉功能
    if (this.data.isLastPage) {
        return
    }
    this.setData({ page: this.data.page + 1 })
    
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this
    db.collection('medicinal').get({
      success:function(res){
        console.log('获取商品成功',res)
        that.setData({
          medicinal:res.data
        })
      },fail:function(res){
        console.log('获取商品失败',res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})