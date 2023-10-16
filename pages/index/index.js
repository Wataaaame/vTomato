const util = require("../../utils/util.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 首页
    cateList: [
      {
        icon: "work",
        text: "work"
      },
      {
        icon: "study",
        text: "study"
      },
      {
        icon: "think",
        text: "think"
      },
      {
        icon: "write",
        text: "write"
      },
      {
        icon: "sport",
        text: "sport"
      },
      {
        icon: "read",
        text: "read"
      }
    ],
    cateActiveIndex: -1,
    // 时钟页
    isClockHide: true,
    time: 25,
    timeStr: "25:00",
    timer: null,
    ctx: null,
    width: 0,
    height: 0,
    // 时钟页-按钮
    isBackHide: true,
    isPauseHide: false,
    isContinueStopHide: true,
  },
  
  /**
   * 首页-滑块
   * 动态绑定滑动条时间
   * @param {obj} e 事件处理
   */
  slideChange(e) {
    this.setData({time: e.detail.value})
  },

  /**
   * 首页-项目
   * 选中对应的项目
   * @param {obj} e 事件处理
   */
  tapCate(e) {
    this.setData({cateActiveIndex: e.currentTarget.dataset.index})
  },

  /**
   * 首页-开始专注
   * 点击“开始专注”
   * @param {obj} e event
   */
  tapFocusOn(e) {
      this.setData({
          mTime: this.data.time * 60 * 1000,
          timeStr: (this.data.time < 10 ? "0"+this.data.time.toString() : this.data.time.toString()) + ":00",
          isBackHide: true,
          isPauseHide: false,
          isContinueStopHide: true,
          isClockHide: false
    })
    this._drawBg()
    this._drawActive()
  },

  /**
   * 计时页-背景圆
   * 绘制背景圆
   */
  _drawBg() {
    wx.createSelectorQuery()
      .select("#progress_bg")
      .fields({node: true, size: true})
      .exec((res) => {
        // Canvas obj
        const canvas = res[0].node
        // 渲染上下文
        const ctx = canvas.getContext('2d')

        // Canvas 画布的实际绘制宽高
        const width = res[0].width
        const height = res[0].height

        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        // 清空画布
        ctx.clearRect(0, 0, width, height)

        // Draw arc
        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.arc(width/2, height/2, width/2 - 1, 0, 2*Math.PI)
        ctx.stroke()
      })
  },

  /**
   * 计时页-倒计时圆
   * 绘制计时圆
   */
  _drawActive() {
    let that = this
    wx.createSelectorQuery()
      .select("#progress_active")
      .fields({node: true, size: true})
      .exec((res) => {
        // Canvas obj
        const canvas = res[0].node
        // 渲染上下文
        const ctx = canvas.getContext('2d')
        this.setData({ctx: ctx})

        // Canvas 画布的实际绘制宽高
        const width = res[0].width
        const height = res[0].height
        this.setData({
            width: width,
            height: height
        })

        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        // 清空画布
        ctx.clearRect(0, 0, width, height)

        // 开始绘画
        that._drawActiveArc()
      })
  },

  /**
   * Draw Arc
   * 绘制倒计时圆
   */
  _drawActiveArc() {
    let that = this
    let ctx = this.data.ctx
    const timeMs = that.data.time * 60 * 1000
    const width = this.data.width
    const height = this.data.height
    // let mTime = timeMs
    let timer = setInterval(() => {
        let angle = 1.5 + 2 * (timeMs - that.data.mTime) / timeMs
        if (angle > 3.5) {
            clearInterval(timer)
            that.setData({
                isBackHide: false,
                isPauseHide: true
            })
            // 存储日志
            let statistics = wx.getStorageSync('statistics') || []
            statistics.unshift({
                date: util.formatTime(new Date),
                cate: that.data.cateActiveIndex,
                time: that.data.time
            })
            wx.setStorageSync('statistics', statistics)
        }
        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = "white"
        ctx.arc(width/2, height/2, width/2 - 1, 1.5*Math.PI, angle*Math.PI)
        ctx.stroke()

        that.data.mTime -= 100
        // 更改数字时间
        if (!(that.data.mTime % 1000)) {
            let second = that.data.mTime / 1000
            // >> 位运算会强制将浮点数转换为整数
            let minute = second / 60 >> 0
            second = second % 60

            if (second < 10) {
                second = "0" +　second.toString()
            }
            if (minute < 10) {
                minute = "0" + minute.toString()
            }
            that.setData({
                timeStr: minute + ":" + second
            })
        }
    }, 100)
    that.setData({
        timer: timer,
    })
  },

  /**
   * 重置已绘制的圆
   */
  _drawActiveInit () {
    const width = this.data.width
    const height = this.data.width

    this.data.ctx.clearRect(0, 0, width, height)
  },

  /**
   * 计时页-暂停btn
   */
  tapPause() {
    clearInterval(this.data.timer)
    this.setData({
        isPauseHide: true,
        isContinueStopHide: false
    })
  },

  /**
   * 计时页-继续btn
   */
  tapContinue() {
    this._drawActiveArc()
    this.setData({
        isPauseHide: false,
        isContinueStopHide: true
    })
  },

  /**
   * 计时页-停止btn
   */
  tapStop() {
    clearInterval(this.data.timer)
    this._drawActiveInit()
    this.setData({
        isClockHide: true,
        isBackHide: true
    })
  },
  
  /**
   * 计时页-返回btn
   * 时钟自然停止
   */
  tapBack() {
    clearInterval(this.data.timer)
      this._drawActiveInit()
      this.setData({
          isClockHide: true,
          isBackHide: true
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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