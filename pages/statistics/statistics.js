// pages/statistics/statistics.js
const utils = require("../../utils/util.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        sumList: [
            {
                "title": "Today Tomatoes",
                "val": 0
            },
            {
                "title": "Total Tomatoes",
                "val": 0
            },
            {
                "title": "Today Focus Time",
                "val": "0 min"
            },
            {
                "title": "Total Focus Time",
                "val": "0 min"
            },
        ],

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

        activeIndex: 0,
        todayList: [],
        showList: []
    },

    /**
     * 切换标签
     */
    changeType(e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            activeIndex: index
        })

        if (index == 0) {
            this.setData({
                showList: this.data.todayList
            })
        }
        else if (index == 1) {
            this.setData({
                showList: wx.getStorageSync('statistics') || []
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 加载统计信息
        let statistics = wx.getStorageSync('statistics') || []

        let todayTomatoes = 0
        let totalTomatoes = statistics.length
        let todayTimes = 0
        let totalTimes = 0
        
        let todayList = []

        // 统计详细数据
        if (statistics.length > 0) {
            const dateNowStr = utils.formatTime(new Date).substr(0, 10)

            statistics.forEach(e => {
                // today
                if (e.date.substr(0, 10) == dateNowStr) {
                    // 计算 todayTomatoes
                    todayTomatoes++
                    // 计算 todayTimes
                    todayTimes += e.time
                    // Today 统计页
                    todayList.push(e)
                }

                // totalTimes
                totalTimes += e.time
            });

            // Times 字符串处理
            todayTimes = todayTimes.toString() + " min"
            totalTimes = totalTimes.toString() + " min"
        }

        // 更新到页面
        this.setData({
            "sumList[0].val": todayTomatoes,
            "sumList[1].val": totalTomatoes,
            "sumList[2].val": todayTimes,
            "sumList[3].val": totalTimes,

            // today 统计页
            todayList: todayList,
            showList: todayList
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})