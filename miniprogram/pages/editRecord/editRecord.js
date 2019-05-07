// miniprogram/pages/addRecord/addRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputDisabled: true,
    title: '',
    content: '',
    isFocus: false,
    imgList: [],
    hasClose: false,
    isEdit: false,
    isLargeImg: false,
    largeImg: '',
  },

  titleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },

  contentInput(e) {
    this.setData({
      content: e.detail.value
    })
  },

  submitRecord() {
    if (!this.data.title || !this.data.content) {
      wx.showToast({
        icon: 'none',
        title: '内容不能为空哟~',
      })
      return;
    }
    this.db.collection('record').doc(this.record_id).update({
      data: {
        title: this.data.title,
        content: this.data.content,
        image: this.data.imgList
      },
      success: res => {
        wx.showToast({
          title: '修改成功啦~',
        })
        wx.reLaunch({
          url: '../index/index',
        })
      },
      fail: err => {
        wx.showToast({
          title: '修改记录失败'
        })
      }
    })
  },

  editRecord() {
    this.setData({
      inputDisabled: false,
      isFocus: true,
      hasClose: true,
      isEdit: true
    })
  },

  backHome() {
    wx.reLaunch({
      url: '../index/index',
    })
  },

  deleteImg(e) {
    const { index } = e.target.dataset;
    let { imgList } = this.data;
    imgList.splice(index, 1);
    this.setData({
      imgList: imgList
    })
  },

  deleteRecord() {
    this.db.collection('record').doc(this.record_id).remove({
      success: () => {
        wx.reLaunch({
          url: '../index/index',
        })
      },
    })
  },

  clickImg(e) {
    const { src } = e.target.dataset;
    this.setData({
      isLargeImg: true,
      largeImg: src,
    })
  },

  closeImg() {
    this.setData({
      isLargeImg: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    // 从home进来带的参数，首页整体参数stringify，编辑页parse即可 {value: "{"_id":"XItxenffS3SWFdRo","_openid":"oDAA44-W1zNt_…Bc91UWRbJV0g","content":"ggggg","title":"gdwewq"}"}
    // 从分享进来，分享带参单独带，只用将转化为字符串的imageList还原即可 {content: '1', id: '2', image:"['cloud://...']", title: '3'}
    let value;
    if (query.value) {
      value = JSON.parse(query.value);
    }
    if (query.title) {
      value = {
        title: query.title,
        content: query.content,
        image: JSON.parse(query.image) || [],
        _id: query.id
      }
    }
    this.record_id = value._id;
    this.setData({
      title: value.title,
      content: value.content,
      imgList: value.image || [],
    })
    this.db = wx.cloud.database();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 以字符串的方式在路径后面带参数，imgList是数组，先转化为字符串
    const imgList = JSON.stringify(this.data.imgList);
    return {
      title: this.data.title,
      path: `/pages/editRecord/editRecord?title=${this.data.title}&content=${this.data.content}&image=${imgList}&id=${this.record_id}`
    }
  }
})