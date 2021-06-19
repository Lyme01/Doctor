let app = getApp()
const db = wx.cloud.database()
const recorderManager = wx.getRecorderManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    watcher: null,
    userInfo: {},
    item: {},
    title: '',
    msgList: [],
    InputBottom: 0,
    closeStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      item: JSON.parse(decodeURIComponent(options.item))
    })
    this.msgStart('进入聊天室', null, null, 0, true)
    this.msgMonitorInit()
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
    this.setData({
      userInfo: app.globalData.userInfo
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.reset()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (!this.data.closeStatus) {
      this.reset()
    }
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

  },
  /**
   * 发送消息
   * @param {*} title 文本内容
   * @param {*} img  图片资源
   * @param {*} voice  音源
   * @param {*} voiceMS  音源时长MS
   * @param {*} news  是否信息显示
   */
  msgStart(title, img, voice, voiceMS, news) {
    const _ = db.command
    const userInfo = app.globalData.userInfo
    db.collection('chat')
      .add({
        data: {
          name: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          doctorId: this.data.item['_id'],
          doctorName: this.data.item['name'],
          title: title,
          voice: voice,
          voiceMS: voiceMS,
          img: img,
          news: news,
          create_time: this.datePureHandle(new Date()),
          time: new Date().getTime()
        }
      })
      .then(res => {
        console.log('患者端新增消息', res)
      })

  },
  /**
   * 接收消息
   */
  msgMonitorInit() {
    let _this = this
    const watcher = db.collection('chat')
      .where({
        doctorId: this.data.item['_id'],
        doctorName: this.data.item['name'],
        name: this.data.userInfo.nickName
      })
      .watch({
        onChange: (snapshot) => {
          if (snapshot.type == 'init') {
            console.log('加载以往记录')
            snapshot.docs.forEach(docs => {
              if (!docs.news) {
                if (docs.voice != null) {
                  docs.voiceMS = Math.floor((docs.voiceMS / 1000) % 60);
                  docs.voice = decodeURIComponent(docs.voice)
                }
                this.setData({
                  [`msgList[${this.data.msgList.length}]`]: docs
                })
              }
            })
            console.log('设置占用')
            db.collection('doctor')
              .doc(this.data.item['_id'])
              .update({
                data: {
                  count: db.command.set(1)
                },
                success: (res => {
                  console.log('设置占用成功', res)
                })
              })
            console.log('记录就诊')
            db.collection('record')
              .add({
                data: {
                  name: this.data.userInfo.nickName,
                  avatarUrl: this.data.userInfo.avatarUrl,
                  doctorId: this.data.item['_id'],
                  doctorName: this.data.item['name'],
                  img: this.data.item['img'],
                  create_time: this.dateAll(new Date())
                }
              })
              .then(res => {
                console.log('记录就诊成功', res)
              })
          } else {
            for (const docChange of snapshot.docChanges) {
              switch (docChange.queueType) {
                case 'enqueue':
                  console.log('新消息:', docChange.doc)
                  const data = docChange.doc
                  if (data.voice != null) {
                    data.voiceMS = Math.floor((data.voiceMS / 1000) % 60);
                    data.voice = decodeURIComponent(data.voice)
                  }
                  this.setData({
                    [`msgList[${this.data.msgList.length}]`]: data
                  })
              }
            }
          }
          _this.pageScrollToBottom()
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
    this.setData({
      watcher: watcher
    })
  },
  titleBind(e) {
    this.setData({
      title: e.detail.value
    })
  },
  titleSub() {
    this.msgStart(this.data.title, null, null, 0, false)
    this.setData({
      title: ''
    })
  },
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },
  datePureHandle(date) {
    /**
     * date.getFullYear() + '-' + (date.getMonth() < 10 ? '0' + (date.getMonth()) : date.getMonth) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' + 
     */
    return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  },
  dateAll(date) {
    return date.getFullYear() + '-' + (date.getMonth() < 10 ? '0' + (date.getMonth()) : date.getMonth) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  },
  pageScrollToBottom() {
    wx.createSelectorQuery().select('.cu-chat').boundingClientRect((rect) => {
      console.log(rect)
      wx.pageScrollTo({
        scrollTop: rect.height,
        duration: 100
      })
    }).exec()
  },
  reset() {
    console.log('清除占用')
    db.collection('doctor')
      .doc(this.data.item['_id'])
      .update({
        data: {
          count: db.command.set(0)
        },
        success: (res => {
          console.log('清除成功')
          console.log('退出聊天室')
          this.msgStart('退出聊天室', null, null, 0, true)
          this.data.watcher.close()
        })
      })
  },
  audioStart() {
    //开始录音  
    const options = {
      duration: 60000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    wx.vibrateShort({
      type: 'heavy',
      success: (x) => {
        recorderManager.start(options)
        recorderManager.onStart(() => {
          console.log('开始录入语音')
        });
      }
    })
  },
  audioStop() {
    //结束录音  
    recorderManager.stop();
    recorderManager.onStop((e) => {
      const name = Math.random() * 1000000;
      let tempFilePath = e.tempFilePath
      wx.cloud.uploadFile({
        cloudPath: `sounds/${name}.mp3`,
        filePath: tempFilePath,
        success: res => {
          console.log('成功：', res)
          this.msgStart(null, null, encodeURIComponent(res.fileID), e.duration, false)
        },
        fail: e => {
          console.error('[上传] 失败：', e)
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    })

  },
  //播放
  voicePlay(e) {
    let voice = e.currentTarget.dataset.voice
    let httpUrl = 'https://6d65-medicine-3g6yepgdaa6eaceb-1301129365.tcb.qcloud.la/sounds'
    let v = voice.substr(voice.lastIndexOf('/'))
    wx.playBackgroundAudio({
      dataUrl: httpUrl + v
    })
  },
  doUpload() {
    let that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '发送中...',
        });
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            let fileId = res.fileID
            that.msgStart(null, fileId, null, false)
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 1500
            })
          },
          fail: e => {},
          complete: () => {}
        });
      }
    })
  }
})