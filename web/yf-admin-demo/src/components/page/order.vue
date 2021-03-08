<template>
    <div class="page">
        <div class="pageTop">
            <el-button type="text" icon="el-icon-circle-plus" @click="toCreate">新增</el-button>
            <el-button class="ml-15" type="text" icon="el-icon-refresh" @click="toRefresh">刷新</el-button>
            <el-select class="ml-15" style="width: 100px" size="mini" clearable placeholder="状态" v-model="filter.status">
                <el-option v-for="item in filter.statusAry" :key="item.v" :label="item.n" :value="item.v"></el-option>
            </el-select>
            <el-button style="margin-left: 15px" type="primary" size="mini" @click="toFilter">筛选</el-button>
        </div>
        <div class="pageCenter">
            <el-table  :data="listAry" stripe border :cell-style="{padding:'10px 0'}">
                <el-table-column prop="id" label="编号" width="60"></el-table-column>
                <el-table-column prop="operator" label="作业人" width="100"></el-table-column>
                <el-table-column label="状态" width="90" align="left">
                    <template slot-scope="scope">
                        <el-tag v-if     ="scope.row.status === 2">等待开始</el-tag>
                        <el-tag v-else-if="scope.row.status === 5" type="success">服务中</el-tag>
                        <el-tag v-else-if="scope.row.status === 10" type="warning">已结束</el-tag>
                        <el-tag v-else-if="scope.row.status === 11" type="info">已删除</el-tag>
                        <el-tag v-else-if="scope.row.status === 3" type="info">已删除</el-tag>
                        <el-tag v-else>其他</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="serves" label="服务内容" min-width="240"></el-table-column>
                <el-table-column prop="company" label="公司" width="200"></el-table-column>
                <el-table-column prop="startTimeStr" label="开始时间" width="130"></el-table-column>
                <el-table-column prop="endTimeStr" label="结束时间" width="130"></el-table-column>
                <el-table-column label="操作" width="70" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status <= 4" type="text" @click="toEditRow(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pageBottom">
            <el-pagination background @current-change="tblPageOnChange" layout="prev, pager, next,total"
                           :page-size="tbl.size" :total="tbl.total"></el-pagination>
        </div>

        <!--编辑-->
        <el-form v-if="isEditShow" ref="editForm" :model="detail" label-width="80px">
            <div class="flex pagePop">
                <div style="width: 400px;">
                    <el-form-item label="选择企业">
                        <el-select size="mini" clearable :disabled="detail.id > 0" placeholder="请选择" v-model="detail.companyId" style="width: 320px">
                            <el-option v-for="item in companyAry" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择作业人">
                        <el-select size="mini" clearable placeholder="请选择" v-model="detail.operatorId" style="width: 320px">
                            <el-option v-for="item in operatorAry" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="服务内容">
                        <div class="flexWrapBetween servers">
                            <div>{{detail.serves || '服务内容空'}}</div>
                            <span class="iconfont iconiconfontxueqi"></span>
                        </div>
                    </el-form-item>

                    <el-form-item label="其他服务">
                        <el-input :disabled="detail.status >= 5" type="textarea" rows="3" v-model="detail.remark"></el-input>
                    </el-form-item>
                </div>
                <div v-if="!detail.status || detail.status < 5" style="margin-left: 20px; width: calc(100% - 450px);">
                    <div class="categoryView">
                        <div v-for="(c,cIndex) in categoryAry" class="cItem flexWrap">
                            <div class="category">
                                <div class="title">{{c.title}}</div>
                                <div v-if="c.desc" class="desc">{{c.desc}}</div>
                            </div>
                            <div v-if="c.itemAry && c.itemAry.length > 0" class="itemView w-per100 flexWrap">
                                <div v-for="(s,sIndex) in c.itemAry" class="serve" >
                                    <div class="title">{{s.title}}</div>
                                    <div v-if="s.desc" class="desc">{{s.desc}}</div>
                                    <el-button class="bgBtn" :id="cIndex + '_' + sIndex" @click="toSelectServe"></el-button>
                                    <el-checkbox class="check" size="medium" v-model="s.selected"></el-checkbox>
                                    <div :class="s.selected ? 'detailBtnSelect' : 'detailBtn'" :id="s.id">{{s.selected ? '已选' : '选择'}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pageBottom">
                <el-form-item>
                    <el-button type="success" size="mini" style="width: 80px; height: 30px" @click="toSubmit">提交需求</el-button>
                    <el-button type="danger" size="mini" style="width: 80px; height: 30px; margin-left: 40px" @click="toCancel">取消</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'order',
        data() {
            return {
                filter:{
                    words:"", onlyOk:false,
                    status:"", statusAry:[{v:2, n:'等待确认'},{v:5, n:'进行中'},{v:10, n:'已结束'},{v:11, n:'已取消'}],
                    categoryId:"", categoryAry:[],
                },
                listAry: [],
                tbl:{size:10, total:0, curr:1},

                accountId:0,

                companyAry:[],
                categoryAry: [],
                operatorAry:[],

                isEditShow:false,
                detail: {},
                detailRules: {
                    desc: [
                        { max: 256, message: '不能超过256个字符', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message:'状态不能空', trigger: 'blur' },
                    ],
                },
                s_options:[],
                s_value:[],
            }
        },
        created() {
            this.accountId = this.getAccountInfo().id;
            this.fetchOperatorAry();
            this.fetchCompanies();
            this.fetchServes();
            this.fetchList();
        },
        computed: {

        },
        methods: {
            /**************** 基本操作 ****************/
            toFilter() {
                this.listAry = [];
                this.tbl.curr = 1;
                this.tbl.total = 0;
                this.fetchList()
            },
            toCreate: function () {
                if (this.detail && this.detail.id > 0) {this.detail = {}}
                if (!this.detail.startTime) {
                    this.detail.startTime = new Date();
                }
                if (!this.detail.endTime) {
                    this.detail.endTime = this.utils.nextYearYesterday()
                }

                this.isEditShow = true;
            },

            toRefresh() {
                this.listAry = [];
                this.tbl.curr = 1;
                this.tbl.total = 0;
                this.fetchList();
            },

            tblPageOnChange(val) {
                this.tbl.curr = val;
                this.fetchList();
            },

            toEditRow(row) {
                this.isEditShow = true;
                if (this.detail.id !== row.id) {
                    this.detail = row;
                    if (row.serveAry && row.serveAry.length > 0) {
                        for(let i = 0; i < this.categoryAry.length; i ++) {
                            let c = this.categoryAry[i];
                            if (c.itemAry && c.itemAry.length > 0) {
                                for(let j = 0; j < c.itemAry.length; j ++) {
                                    this.categoryAry[i].itemAry[j].selected = false;
                                    for(let k = 0; k < row.serveAry.length; k ++) {
                                        if (row.serveAry[k].id === c.itemAry[j].id) {
                                            this.categoryAry[i].itemAry[j].selected = true;
                                            break
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            toSubmit() {
                this.$refs["editForm"].validate((valid) => {
                    if (!valid) {return false;}

                    if (typeof this.detail.startTime !== "number") {
                        this.detail.startTime = parseInt(Date.parse(this.detail.startTime) / 1000);
                    } else {
                        this.detail.startTime = parseInt(this.detail.startTime / 1000);
                    }

                    if (typeof this.detail.endTime !== "number") {
                        this.detail.endTime = parseInt(Date.parse(this.detail.endTime) / 1000);
                    } else {
                        this.detail.endTime = parseInt(this.detail.endTime / 1000);
                    }

                    if (this.detail.operatorId > 0 && this.detail.status < 5) {
                        this.detail.status = 5; //服务中状态
                    }

                    this.detail.serveIdAry = [];
                    for(let i = 0; i < this.categoryAry.length; i ++) {
                        let c = this.categoryAry[i];
                        if (c.itemAry && c.itemAry.length > 0) {
                            for(let j = 0; j < c.itemAry.length; j ++) {
                                if (c.itemAry[j].selected) {
                                    this.detail.serveIdAry.push(c.itemAry[j].id)
                                }
                            }
                        }
                    }

                    let url = "coserve/order." + (this.detail.id ? "update" : "add");
                    this.request({
                        url: url, data: this.detail,
                        method: 'post', needToken:true
                    }).then(res => {
                        this.detail = {id:0};
                        this.isEditShow = false;
                        this.fetchList();
                    }, res=> {
                        this.$message.error(res.msg || "提交失败~");
                    })
                });
            },

            toCancel() {
                this.isEditShow = false;
            },

            toSelectServe(e) {
                let ary = e.currentTarget.id.split("_");
                if (ary && ary.length === 2) {
                    let cIdx = parseInt(ary[0]);
                    let sIdx = parseInt(ary[1]);
                    if (cIdx < this.categoryAry.length) {
                        let cV = this.categoryAry[cIdx];
                        if (sIdx < cV.itemAry.length) {
                            let sV = this.categoryAry[cIdx].itemAry[sIdx];
                            sV.selected = !sV.selected;
                            this.isSelectChanged = true;
                            this.$forceUpdate()
                        }
                    }
                }

                this.detail.serves = "";
                for(let i = 0; i < this.categoryAry.length; i ++) {
                    let item = this.categoryAry[i];
                    if (item.itemAry) {
                        for(let j = 0; j < item.itemAry.length; j ++) {
                            let s = item.itemAry[j];
                            if (s.selected) {
                                if (this.detail.serves) {
                                    this.detail.serves += "，"
                                }
                                this.detail.serves += s.title;
                            }
                        }
                    }
                }
            },

            searchCompanyAry(str, cb) {
                if (!str) {
                    cb([]);
                    return;
                }

                this.request({
                    url: "coserve/company.search",
                    data:{name:str, channelId: this.accountInfo.id},
                    needToken:true
                }).then(res => {
                    let ary = [];
                    for(let i = 0; i < res.result.length; i ++) {
                        ary.push({value:res.result[i].name, id:res.result[i].id})
                    }
                    cb(ary)
                },res => {
                    cb([])
                })
            },

            fetchList() {
                let url = "coserve/order.list";
                let params = {
                    pageSize:this.tbl.size, pageNumber:this.tbl.curr, status: this.filter.status,
                };

                this.request({
                    url: url,
                    data:params, needToken:true,
                }).then( res => {
                    this.listAry = [];
                    if (res.result && res.result.length > 0) {
                        let that = this;
                        res.result.forEach(function(d) {
                            d.startTimeStr = that.utils.timeStr(d.startTime, "Y-M-D H:M");
                            d.startTime *= 1000;

                            d.endTimeStr = that.utils.timeStr(d.endTime, "Y-M-D H:M");
                            d.endTime *= 1000;

                            d.createTimeStr = that.utils.timeStr(d.createTime, "Y-M-D H:M");
                        });
                        this.listAry = res.result;
                    }

                    if (res.ext && res.ext.totalCount) {
                        this.tbl.total = res.ext.totalCount;
                    }
                }, res => {
                    this.$message.error(res.msg || "获取数据失败");
                });
            },

            fetchOperatorAry() {
                let url = "coserve/account.list";
                let params = {role:"1,2", limit:100};
                this.request({url: url, data:params, needToken:true}).then( res => {
                    this.listAry = [];
                    if (res.result && res.result.length > 0) {
                        this.operatorAry = res.result;
                    }
                }, res => {
                    this.$message.error(res.msg || "获取数据失败");
                });
            },
            fetchServes() {
                let url = "coserve/category.ary";
                this.request({
                    url: url, needToken:true,
                    data:{widthItems:true, status:2},
                }).then( res => {
                    this.categoryAry = res.result;
                    if (this.categoryAry && this.categoryAry.length > 0) {
                        for(let i = 0; i < this.categoryAry.length; i ++) {
                            let c = this.categoryAry[i];
                            if (c.itemAry && c.itemAry.length > 0) {
                                for(let j = 0; j < c.itemAry.length; j ++) {
                                    let s = c.itemAry[j];
                                    s.selected = false;
                                }
                            }
                        }
                    }
                }, res => {});
            },
            fetchCompanies() {
                let url = "coserve/ms/company.list";
                this.request({
                    url: url, needToken:true,
                    data:{widthItems:true, status:2, channelId:this.accountId},
                }).then( res => {
                    this.companyAry = res.result;
                }, res => {});
            },

            /**************** 其他操作 ****************/

            toUploadImg(e) {
                let idx = parseInt(e.currentTarget.id);
                let formData = new FormData();
                formData.append("file", e.target.files[0]);
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
        }
    }
</script>

<style scoped>
    .tip {font-size: 10px; color: red; margin-left: 80px}
    .servers {width: 100%;}
    .servers div {width: calc(100% - 20px); line-height: 30px; text-align: right; font-size: 13px;}
    .servers span {margin:auto 0; width: 20px; }


    .categoryView {margin: 0 0 30px 20px; width: 100%; height: 100%; overflow-y:scroll; -ms-overflow-style:none;}
    .cItem {margin:10px 0}
    .category {width: 100%; padding: 10px 0; background-color: #EDF0FF; }
    .category .title {
        margin: 0 5px 0 10px; width: calc(100% - 15px); line-height: 20px;
        font-size: 13px; font-weight: bold; color: #555555}
    .category .desc {
        margin: 0 5px 0 10px; width: calc(100% - 15px); line-height: 20px;
        font-size: 12px; color: #999999}

    .categoryView .itemView .serve {
        position: relative; margin: 0; height: 130px; width: calc(33% - 2px);
        border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd;
    }
    .itemView .serve:hover {background-color: #f8f8f8}

    .serve .title {
        margin: 15px 10px 0 10px; width: calc(100% - 10px); line-height: 20px;
        font-size: 16px; color: #333333; font-weight: 400;
    }
    .serve .desc {
        margin: 10px 10px 0 10px; width: calc(100% - 10px); line-height: 20px;
        font-size: 13px; color: #888888;
    }
    .serve .bgBtn {
        position: absolute; left: 0; top:0; width: 100%; height: 100%; border: 0; opacity: 0; z-index: 10;
    }
    .serve .detailBtn {
        position: absolute; bottom: 5px; right: 5px; width: 50px; line-height: 20px; border-radius: 2px; text-align: center;
        color: #555555; font-size: 12px; font-weight: 200; opacity: 0.8; border: 1px solid #eeeeee;
    }
    .serve .detailBtnSelect {
        position: absolute; bottom: 5px; right: 5px; width: 50px; line-height: 20px; border-radius: 2px; text-align: center;
        color: white; font-size: 12px; font-weight: 200; opacity: 0.8; background-color: #2d8cf0;
    }
    .serve .check {
        position: absolute; right: 10px; top:5px;
    }
</style>
