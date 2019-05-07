// miniprogram/pages/addRecord/addRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputDisabled: false,
    imgList: [],
    hasAddphoto: true,
  },

  titleInput(e) {
    this.title = e.detail.value;
  },

  contentInput(e) {
    this.content = e.detail.value;
  },

  submitRecord() {
    if (!this.title || !this.content) {
      wx.showToast({
        icon: 'none',
        title: '内容不能为空哟~',
      })
      return;
    }
    const db = wx.cloud.database();
    db.collection('record').add({
      data: {
        title: this.title,
        content: this.content,
        image: this.data.imgList
      },
      success: res => {
        wx.showToast({
          title: '添加成功啦~',
        })
        wx.reLaunch({
          url: '../index/index',
        })
      },
      fail: err => {
        wx.showToast({
          title: '添加记录失败'
        })
      }
    })
  },

  addImg() {
    let self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 创建了一个nickname的文件夹
        const cloudPath = wx.getStorageSync("userInfo").nickName + '/' + Date.now() + filePath.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            self.data.imgList.length === 2 &&  
            self.setData({
              hasAddphoto: false
            });
            self.data.imgList.push(res.fileID);
            self.setData({
              imgList: self.data.imgList
            }, () => {
              wx.hideLoading()
            })
          },
          fail: err => {
            console.log(err);
          }
        })
      }
    })
  },

  deleteImg(e) {
    const { index } = e.target.dataset;
    let { imgList } = this.data;
    imgList.splice(index, 1);
    this.setData({
      imgList: imgList
    })
    imgList.length === 0 && 
    this.setData({
      hasAddphoto: true
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
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})