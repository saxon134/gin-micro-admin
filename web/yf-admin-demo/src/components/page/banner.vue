<template>
    <div class="pageView">
        <div class="pageContainer">
            <div class="handle-box">
                <el-button type="text" icon="el-icon-circle-plus" class="mr10" @click="toCreate">新建</el-button>
                <span class="imgSizeTip">封面建议尺寸（750×{{imgHeight}}）</span>
            </div>
            <el-menu :default-active="currTab" class="el-menu-demo topTab" mode="horizontal" @select="currTabOnChange">
                <el-menu-item class="topTab" index="home">首页</el-menu-item>
                <el-menu-item class="topTab" index="brokerage">服务页</el-menu-item>
            </el-menu>
            <el-table :data="list" highlight-current-row stripe border class="table" style="margin-top: 15px">
                <el-table-column prop="id" label="ID" width="60"></el-table-column>
                <el-table-column label="封面" width="200">
                    <template slot-scope="scope">
                        <img :src="scope.row.cover" :style="'height:' + (150 * imgHeight) / 750 + 'px'" class="list-img">
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" min-width="150"></el-table-column>
                <el-table-column prop="seq" label="序号" width="60"></el-table-column>
                <el-table-column prop="parentId" label="关联数据ID" width="90"></el-table-column>
                <el-table-column width="100" label="关联数据类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.parentType == 1">财税知识</el-tag>
                        <el-tag v-else-if="scope.row.parentType == 3">优惠活动</el-tag>
                        <el-tag v-else-if="scope.row.parentType == 4">服务项目</el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="180" label="时间">
                    <template slot-scope="scope">
                        {{scope.row.timeStr}}
                    </template>
                </el-table-column>
                <el-table-column width="120">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toModify(scope.$index)">修改</el-button>
                        <el-button type="text" style="color: red" @click="toModifyStatus(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagePopView" v-if="isDetailShow">
                <div class="pagePopSub">
                    <div class="flexWrap">
                        <el-upload
                                class="uploader-view" :style="'width:' + (70 * 750 / imgHeight) + 'px'"
                                action=""
                                :http-request="toUploadPic"
                                :show-file-list="false">
                            <template v-if="detail.cover">
                                <img :src="detail.cover" class="uploader-img" :style="'width:' + (70 * 750 / imgHeight) + 'px'">
                            </template>
                            <template v-else>
                                <i class="el-icon-plus uploader-icon"></i>
                            </template>
                        </el-upload>
                        <div class="flexWrap" style="width: calc(100% - 350px);">
                            <div class="flexWrap w-per100">
                                <div class="bannerTip">标题：</div>
                                <el-input v-model="detail.title" class="bannerTitle" placeholder="名称（可空）"></el-input>
                            </div>
                            <div class="flexWrap w-per100">
                                <div class="bannerTip">排序：</div>
                                <el-input v-model="detail.seq" class="bannerTitle" placeholder="序号（可空）"></el-input>
                            </div>
                            <div class="flexWrap w-per100"style="color: red; font-size: 12px; margin-left: 70px">
                                只能选择一条关联数据
                            </div>
                        </div>
                    </div>

                    <div class="contentView">
                        <el-tabs tab-position="left"  v-model="detailCurrTab" @tab-click="detailCurrTabChanged">
                            <el-tab-pane label="服务项目" name="serve">
                                <div v-for="item in serveAry" class="item flexWrapBetween">
                                    <div style="display: flex; height: 40px">
                                        <img v-if="item.cover" :src="item.cover" class="cover">
                                        <img v-else class="cover" src="../../assets/img/default.png">
                                        <span class="title tLeft txtLine1">{{item.title}}</span>
                                    </div>
                                    <el-checkbox border v-model="item.selected" @change="selectChanged">选择</el-checkbox>
                                </div>
                                <div v-if="serveAry.length === 0">暂无内容</div>
                            </el-tab-pane>
                            <el-tab-pane label="优惠活动" name="activity">
                                <div v-for="item in activityAry" class="item flexWrapBetween">
                                    <div style="display: flex; height: 40px">
                                        <img v-if="item.cover" :src="item.cover" class="cover">
                                        <img v-else class="cover" src="../../assets/img/default.png">
                                        <span class="title tLeft txtLine1">{{item.title}}</span>
                                    </div>
                                    <el-checkbox border v-model="item.selected" @change="selectChanged">选择</el-checkbox>
                                </div>
                                <div v-if="activityAry.length === 0">暂无内容</div>
                            </el-tab-pane>
                            <el-tab-pane label="财税知识" name="content">
                                <div v-for="item in contentAry" class="item flexWrapBetween">
                                    <div style="display: flex; height: 40px">
                                        <img v-if="item.cover" :src="item.cover" class="cover">
                                        <img v-else class="cover" src="../../assets/img/default.png">
                                        <span class="title tLeft txtLine1">{{item.title}}</span>
                                    </div>
                                    <el-checkbox border v-model="item.selected" @change="selectChanged">选择</el-checkbox>
                                </div>
                                <div v-if="contentAry.length === 0">暂无内容</div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
                <div class="pagePopBottom w-per100 flexWrapCenter" style="width: 700px">
                    <div style="margin-right: 40px">
                        <el-button type="primary" class="submitBtn" @click="toSubmit">提交</el-button>
                        <el-button class="submitBtn" @click="toCancel">取消</el-button>
                    </div>

                    <el-pagination v-if="detailCurrTab === 'content'" style="width: 200px;"
                                   background
                                   layout="prev, pager, next"
                                   :total="contentCnt" :current-page="contentCurrPage"
                                   @current-change="detailCurrentPageChanged">
                    </el-pagination>
                    <el-pagination v-if="detailCurrTab === 'serve'" style="width: 200px;"
                                   background
                                   layout="prev, pager, next"
                                   :total="serveCnt" :current-page="serveCurrPage"
                                   @current-change="detailCurrentPageChanged">
                    </el-pagination>
                    <el-pagination v-if="detailCurrTab === 'activity'" style="width: 200px;"
                                   background
                                   layout="prev, pager, next"
                                   :total="activityCnt" :current-page="activityCurrPage"
                                   @current-change="detailCurrentPageChanged">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'banner',
        data() {
            return {
                currTab:"home",
                detailCurrTab:"serve",

                contentAry:[{disable:false, selected:false}],
                contentCnt:0,
                contentCurrPage:1,

                serveAry:[{disable:false, selected:false}],
                serveCnt:0,
                serveCurrPage:1,

                activityAry:[{disable:false, selected:false}],
                activityCnt:0,
                activityCurrPage:1,

                list:[],
                isDetailShow:false,
                detail:{id:0, title:"", cover:""},
                homeAggregateId:0,
                brokerageAggregateId:0,

                imgHeight:400, //相应于750高度
            }
        },
        created() {
            this.imgHeight = (this.currTab === 'home' ? 400 : 375);
            this.fetchContent();
            this.fetchActivity();
            this.fetchServe();
            this.fetchBanner();
        },
        methods: {
            currTabOnChange(v) {
                this.currTab = v;
                this.list = [];
                this.fetchBanner();
                this.imgHeight = (this.currTab === 'home' ? 400 : 375);
            },
            toModify(index) {
                this.isDetailShow = true;
                this.detail = this.list[index];
                this.findSelected()
            },
            toModifyStatus(index) {
                let item = this.list[index];
                this.$confirm('点击继续将删除该项，是否继续?', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteBannerItem(item.id)
                }).catch(() => {

                });
            },
            toCreate() {
                this.isDetailShow = true;
                if (this.detail.id) {
                    this.detail = {id:0, title:"", cover:""};
                }
            },
            toCancel() {
                this.isDetailShow = false;
            },

            detailCurrTabChanged() {
                this.findSelected();
            },
            detailCurrentPageChanged(v) {
                let that = this;
                if (that.currTab == "content") {
                    that.contentCurrPage = v;
                    that.fetchContent(function () {
                        that.findSelected();
                    });
                } else if (that.currTab == "serve") {
                    that.serveCurrPage = v;
                    that.fetchServe(function () {
                        that.findSelected();
                    })
                } else if (that.currTab == "activity") {
                    that.activityCurrPage = v;
                    that.fetchActivity(function () {
                        that.findSelected();
                    })
                }
            },
            selectChanged(v) {
                let that = this;
                if (!v) {
                    that.detail.parentId = 0;
                    that.detail.parentType = 0;
                }

                for(let i = 0; i < that.contentAry.length; i ++) {
                    let item = that.contentAry[i];
                    if (v) {
                        if (item.selected) {
                            if (item.isSelectOld) {
                                item.selected = false;
                                item.isSelectOld = false;
                            } else {
                                item.isSelectOld = true;
                                that.detail.parentId = item.id;
                                that.detail.parentType = 1;
                            }
                            that.contentAry.splice(i, 1, item);
                        }
                    } else {
                        if (item.selected) {
                            item.selected = false;
                            item.isSelectOld = false;
                            that.contentAry.splice(i, 1, item);
                        }
                    }
                }

                for(let i = 0; i < that.serveAry.length; i ++) {
                    let item = that.serveAry[i];
                    if (v) {
                        if (item.selected) {
                            if (item.isSelectOld) {
                                item.selected = false;
                                item.isSelectOld = false;
                            } else {
                                item.isSelectOld = true;
                                that.detail.parentId = item.id;
                                that.detail.parentType = 4;
                            }
                            that.serveAry.splice(i, 1, item);
                        }
                    } else {
                        if (item.selected) {
                            item.selected = false;
                            item.isSelectOld = false;
                            that.serveAry.splice(i, 1, item);
                        }
                    }
                }

                for(let i = 0; i < that.activityAry.length; i ++) {
                    let item = that.activityAry[i];
                    if (v) {
                        if (item.selected) {
                            if (item.isSelectOld) {
                                item.selected = false;
                                item.isSelectOld = false;
                            } else {
                                item.isSelectOld = true;
                                that.detail.parentId = item.id;
                                that.detail.parentType = 3;
                            }
                            that.activityAry.splice(i, 1, item);
                        }
                    } else {
                        if (item.selected) {
                            item.selected = false;
                            item.isSelectOld = false;
                            that.activityAry.splice(i, 1, item);
                        }
                    }
                }

                console.log("selected " + v + ":" + that.detail.parentId + " " + that.detail.parentType)
            },
            findSelected() {
                for(let i = 0; i < this.contentAry.length; i ++) {
                    let item = this.contentAry[i];
                    if (item.id == this.detail.parentId && this.detail.parentType == 1) {
                        item.isSelectOld = true;
                        if (!item.selected) {
                            item.selected = true;
                            this.contentAry.splice(i, 1, item);
                        }
                    } else {
                        item.isSelectOld = false;
                        if (item.selected) {
                            item.selected = false;
                            this.contentAry.splice(i,1,item);
                        }
                    }
                }
                for(let i = 0; i < this.serveAry.length; i ++) {
                    let item = this.serveAry[i];
                    if (item.id == this.detail.parentId && this.detail.parentType == 4) {
                        item.isSelectOld = true;
                        if (!item.selected) {
                            item.selected = true;
                            this.serveAry.splice(i, 1, item);
                        }
                    } else {
                        item.isSelectOld = false;
                        if (item.selected) {
                            item.selected = false;
                            this.serveAry.splice(i,1,item)
                        }
                    }
                }
                for(let i = 0; i < this.activityAry.length; i ++) {
                    let item = this.activityAry[i];
                    if (item.id == this.detail.parentId && this.detail.parentType == 3) {
                        item.isSelectOld = true;
                        if (!item.selected) {
                            item.selected = true;
                            this.activityAry.splice(i, 1, item);
                        }
                    } else {
                        item.isSelectOld = false;
                        if (item.selected) {
                            item.selected = false;
                            this.activityAry.splice(i, 1, item);
                        }
                    }
                }
            },

            // 上传图片处理过程
            toUploadPic(req){
                let formData = new FormData();
                formData.append("file", req.file);
                this.upload({
                    url:"coserve/upload",
                    data: formData
                }).then( res => {
                    this.detail.cover = res.result.uri;
                    this.$forceUpdate();
                }, res => {
                    this.$message.error("图片上传失败");
                })
            },
            toSubmit() {
                if (!this.detail.cover) {this.$message.error("请先上传图片");return}

                if (!this.detail.id) {
                    this.detail.selected = true;
                    this.detail.aggregateId = this.aggregateId;
                    this.detail.status = 2;
                    //计算seq
                    if ((typeof this.detail.seq === 'undefined') || this.detail.seq === '') {
                        this.detail.seq = 0;
                        if (this.list && this.list.length > 0) {
                            this.detail.seq = this.list.length;
                            for (let i = 0; i < this.list.length; i ++) {
                                if (this.list[i].seq >= this.detail.seq) {
                                    this.detail.seq = this.list[i].seq + 1;
                                }
                            }
                        }
                    }
                }

                let url = "coserve/aggregate.";
                let params = {
                    position: this.currTab === "home" ? 1 : 2, status:2,
                    aggregateId:this.currTab === "home" ? this.homeAggregateId : this.brokerageAggregateId,
                };
                if (!params.aggregateId) {
                    params.itemAry = [this.detail];
                    url += "add"
                } else {
                    params.changedItemAry = [this.detail];
                    url += "update"
                }

                this.request({
                    url: url, data: params,
                    method: 'post', needToken:true
                }).then(res => {
                    this.detail = {id:0};
                    this.isDetailShow = false;

                    this.contentAry.forEach(function (t) {
                        t.selected = false;
                        t.isSelectOld = false;
                    });
                    this.serveAry.forEach(function (t) {
                        t.selected = false;
                        t.isSelectOld = false;
                    });
                    this.activityAry.forEach(function (t) {
                        t.selected = false;
                        t.isSelectOld = false;
                    });
                    this.fetchBanner()
                }, res=> {
                    this.$message.error(res.msg || "提交失败~");
                })
            },

            /**************** 接口 ****************/

            fetchBanner() {
                this.request({
                    url: "coserve/aggregate.items",
                    data: {
                        aggregateId:this.currTab === "home" ? this.homeAggregateId : this.brokerageAggregateId,
                        position:this.currTab === "home" ? 1 : 2, limit:-1
                    }
                }).then(res => {
                    if (res.result && res.result.length > 0) {
                        let that = this;
                        res.result.forEach(function (t) {
                            t.statusClass = (t.status == 2 ? 'status-ok' : 'status-fail');
                            t.statusStr = (t.status == 2 ? '已上架' : '已禁用');
                            t.timeStr = that.utils.timeStr(t.updateTime, "Y-M-D H:M");
                            t.selected = true;
                        });

                        that.list = res.result;
                        if (that.list && that.list.length > 0) {
                            if (this.currTab === "home") {
                                that.homeAggregateId = that.list[0].aggregateId;
                            } else {
                                that.brokerageAggregateId = that.list[0].aggregateId;
                            }
                        }
                    } else {
                        this.list = [];
                    }
                }, res=> {
                    this.$message.error(res.msg || "获取数据失败~");
                })
            },

            fetchContent(cb) {
                this.request({
                    url: "coserve/content.list",
                    data: {status:2, pageSize:10, pageNumber:this.contentCurrPage},
                    needToken:true
                }).then(res => {
                    for(let i = 0; i < res.result.length; i ++) {
                        let item = res.result[i];
                        item.selected = false;
                        item.seq = "";
                    }
                    this.contentAry = res.result;

                    if (res.ext && res.ext.totalCount) {this.contentCnt = res.ext.totalCount;}
                    if (typeof cb === "function") {cb()}
                }, res=> {
                    this.$message.error(res.msg || "获取数据失败~");
                    if (typeof cb === "function") {cb()}
                })
            },
            fetchActivity(cb) {
                this.request({
                    url: "coserve/activity.list",
                    data: {status:2, pageSize:10, pageNumber:this.activityCurrPage}
                }).then(res => {
                    if (res.result.length > 0) {
                        this.activityAry = res.result;
                    } else {
                        this.activityAry = [];
                    }

                    if (res.ext && res.ext.totalCount) {this.activityCurrPage = res.ext.totalCount;}
                    if (typeof cb === "function") {cb()}
                }, res => {
                    this.$message.error(res.msg || "获取数据失败~");
                    if (typeof cb === "function") {cb()}
                })
            },
            fetchServe(cb) {
                this.request({
                    url: "coserve/serve.list",
                    data: {status:2, pageSize:10, pageNumber:this.serveCurrPage}
                }).then(res => {
                    if (res.result.length > 0) {
                        this.serveAry = res.result;
                    } else {
                        this.serveAry = [];
                    }

                    if (res.ext && res.ext.totalCount) {this.goodsCnt = res.ext.totalCount;}
                    if (typeof cb === "function") {cb()}
                }, res => {
                    this.$message.error(res.msg || "获取商品数据失败~");
                    if (typeof cb === "function") {cb()}
                })
            },

            deleteBannerItem(id) {
                this.request({
                    url: "coserve/aggregate.item.del",
                    method:"post", needToken:true, data: {idAry:[id]}
                }).then(res => {
                    this.fetchBanner()
                }, res => {
                    this.$message.error(res.msg || "删除失败~");
                })
            }
        }
    }

</script>

<style scoped>
    .list-img {
        object-fit: cover; width: 150px; height: 75px;
    }


    .uploader-view {display: flex; width: 140px; height: 70px; margin: 10px 0 10px 100px;}
    .uploader-img {width: 140px; height: 70px; object-fit: cover}
    .uploader-icon {width: 140px; margin-top: 30px;}

    .detail .remark {
        margin: 0 300px; width: 400px; height: 30px; line-height: 30px; font-size: 14px;
    }
    .submitBtn {width: 100px;}

    .bannerTip {margin: 0 0 0 10px; font-size: 12px; font-weight: bold; width: 60px; text-align: right; line-height: 35px}
    .bannerTitle {margin: 0; width: 250px; height: 40px; line-height: 40px;}

    .contentView {
        width: calc(100% - 40px);
    }
    .contentView .item {
        margin: 10px 20px 0 20px; width: 600px; height: 35px;
        border-bottom: 1px solid #cccccc;
    }
    .contentView .item:last-child {
        margin-bottom: 10px;
    }
    .contentView .cover {
        width: 30px; height: 30px; object-fit: contain;
    }
    .contentView .title {
        margin-left: 10px; width: 460px; font-size: 15px; line-height: 40px; height: 40px; overflow: hidden;
    }

    .imgSizeTip {margin: 0 0 0 10px; font-size: 12px; color: red;}
    .topTab {height: 45px; line-height: 45px}
</style>
