
// pages/shop/shop.js
const db=wx.cloud.database()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
   ypfenlei:[],
   medicinal:[],
   search:[],
   inputShowed: true,
   inputVal: "",
   searchVal: "",
   page: 1,
   pageSize: 8,
   isLastPage: false,
   tips: '上拉加载更多'
  },
  


  input(e) {
    this.setData({
      searchVal: e.detail.value
    })
    console.log(e.detail.value)
  },
  clear: function () {
    this.setData({
      searchVal: ""
    })
  },
  //商品关键字模糊搜索
  search: function () {
    let that=this
    // 数据库正则对象
    db.collection('medicinal').where({
      name: db.RegExp({
        regexp: this.data.searchVal,//做为关键字进行匹配
        options: 'i',//不区分大小写
      })
    })
    .get().then(res => {
      console.log('搜索成功',res.data)
       that.setData({
        search:res.data
       })
    }).catch(err => {
      console.error(err)
      wx.hideLoading();
    })
  },


  onReachBottom: function () {
    // 最后一页了，取消下拉功能
    if (this.data.isLastPage) {
        return
    }
    this.setData({ page: this.data.page + 1 })
    
},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that=this
    const c = db.collection("medicinal"); //获取集合中记录的总数
    const total = await (await c.count()).total
    const batchTimes = Math.ceil(total / 20)
    console.log(batchTimes) //计算需要获取几次  比如你有36条数据就要获取两次 第一次20条第二次16条
    let arraypro = []
   db.collection('fenlei').get({
     success:function(res){
      //  console.log('分类获取成功',res)
      that.setData({
        ypfenlei:res.data
      })
     },
     fail:function(res){
       console.log('分类获取失败',res)
     }
   })
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


  onShow:function(){
   
    let that=this
   db.collection('ypfenlei').get({
     success:function(res){
       console.log('分类获取成功',res)
      that.setData({
        ypfenlei:res.data
      })
     },
     fail:function(res){
       console.log('分类获取失败',res)
     }
   })
   onReachBottom()
  //  药品获取
  db.collection('medicinal').get({
    success:function(res){
      console.log('药品获取成功',res)
     that.setData({
       medicinal:res.data
     })
    },
    fail:function(res){
      console.log('药品获取失败',res)
    }
  })

  }
 

  
})