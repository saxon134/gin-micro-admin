<template>
    <div class="page">
        <!--筛选-->
        <div class="pageTop">
            <el-button type="text" icon="el-icon-circle-plus" @click="toCreate">新增</el-button>
            <el-select class="ml-15" style="width: 80px" size="mini" clearable placeholder="状态" v-model="filter.status">
                <el-option v-for="item in filter.statusAry" :key="item.v" :label="item.n" :value="item.v"></el-option>
            </el-select>
            <el-select class="ml-15" style="width: 130px" size="mini" clearable placeholder="类型" v-model="filter.categoryId">
                <el-option v-for="item in filter.categoryAry" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
            <el-select class="ml-15" style="width: 120px" size="mini" clearable placeholder="位置" v-model="filter.position">
                <el-option v-for="item in filter.positionAry" :key="item.v" :label="item.n" :value="item.v"></el-option>
            </el-select>
            <el-button style="margin-left: 15px" type="primary" size="mini" @click="toFilter">筛选</el-button>
        </div>
        <!--列表-->
        <div class="pageCenter">
            <el-table :data="tblData" highlight-current-row stripe border :cell-style="{padding:'2px 0'}">
                <el-table-column prop="id" label="ID" width="60"></el-table-column>
                <el-table-column label="位置" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.positionStr"  type="">{{scope.row.positionStr}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="服务类型" width="130">
                    <template slot-scope="scope">
                        {{scope.row.categoryTitle}}
                    </template>
                </el-table-column>
                <el-table-column prop="seq" label="序号" width="60"></el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="scope">
                        <img v-if="scope.row.cover" :src="scope.row.cover" class="list_cover">
                        <img v-else class="list_icon" src="../../assets/img/default.png">
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="服务项目" width="230"></el-table-column>
                <el-table-column prop="desc" label="描述" min-width="100"></el-table-column>
                <el-table-column prop="timeStr" label="创建时间" width="130"></el-table-column>
                <el-table-column label="状态" width="70">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 2"  type="success">激活</el-tag>
                        <el-tag v-else  type="danger">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toEditRow(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--分页-->
        <div class="pageBottom">
            <el-pagination background @current-change="tblPageOnChange" layout="prev, pager, next,total"
                           :page-size="tbl.size" :total="tbl.total"></el-pagination>
        </div>
        <!--详情页-->
        <template v-if="isDetailShow">
            <div class="pagePop">
                <div class="flexWrap" style="margin:0 20px; width: 500px;">
                    <div class="flexWrap w-per100">
                        <!--基础信息-->
                        <div class="flexWrap" style="width: 500px">
                            <el-input class="title is-bold" type="text" v-model="detail.title" maxlength=64 show-word-limit placeholder="标题"></el-input>
                            <el-input class="desc mt-15" type="textarea" v-model="detail.desc" maxlength=512 show-word-limit placeholder="描述"></el-input>

                            <div class="flexWrap">
                                <div class="flexWrap" style="width:190px; margin-right: 10px">
                                    <div class="separateView" style="font-size: 13px; margin: 25px 0 0 0">服务类型</div>
                                    <el-select v-model="detail.categoryId" clearable placeholder="请选择">
                                        <el-option
                                                v-for="item in filter.categoryAry"
                                                :key="item.id"
                                                :label="item.title"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>

                                <div class="flexWrap" style="width:120px;margin-right: 10px">
                                    <div class="separateView" style="font-size: 13px; margin: 25px 0 0 0">位置</div>
                                    <el-select v-model="detail.position" clearable placeholder="请选择">
                                        <el-option
                                                v-for="item in filter.positionAry"
                                                :key="item.v"
                                                :label="item.n"
                                                :value="item.v">
                                        </el-option>
                                    </el-select>
                                </div>

                                <div class="flexWrap" style="width:120px;margin-right: 10px">
                                    <div class="separateView" style="font-size: 13px; margin: 25px 0 0 0">状态</div>
                                    <el-select v-model="detail.status" clearable placeholder="请选择">
                                        <el-option
                                                v-for="item in filter.statusAry"
                                                :key="item.v"
                                                :label="item.n"
                                                :value="item.v">
                                        </el-option>
                                    </el-select>
                                </div>

                                <div class="flexWrap" style="width:160px;">
                                    <div class="separateView" style="font-size: 13px; margin: 25px 0 0 0;">
                                        序号<span style="font-size: 11px;font-weight: normal"> 越小越靠前</span>
                                    </div>
                                    <el-input type="number" style="width: 120px; margin-top: 0"
                                              v-model="detail.seq" placeholder="序号"></el-input>
                                </div>

                            </div>

                            <div v-if="detail.position == 3" class="separateView" style="font-size: 13px; margin-top: 25px">图标 <span style="font-size: 11px;font-weight: normal">建议尺寸80×80</span></div>
                            <div v-else class="separateView" style="font-size: 13px; margin-top: 25px">封面 <span style="font-size: 11px;font-weight: normal">建议尺寸400×300</span></div>
                            <div class="flexWrap">
                                <template v-if="detail.cover">
                                    <div class="imgView pr mr-10">
                                        <img :src="detail.cover" class="w-per100 h-per100">
                                        <input type="file" class="pa" style="opacity: 0;" @change="toUploadImg" />
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="imgView">
                                        <i class="el-icon-plus imgUploadIcon"></i>
                                        <input type="file" multiple="multiple" class="pa" style="opacity: 0;" @change="toUploadImg" />
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="mt-40 mb-30 w-per100">
                        <el-button type="success" size="mini" class="mr-10" style="width: 60px; height: 30px" @click="toSubmit">提交</el-button>
                        <el-button type="primary" size="mini" class="mr-10" style="width: 60px; height: 30px" @click="toSave">暂存</el-button>
                        <el-button type="danger" size="mini" style="width: 60px; height: 30px" @click="toCancel">取消</el-button>
                    </div>
                </div>
            </div>
            <div class="pagePop" style="margin: 10px 0 0 550px;width:300px;">
                <sa-editor class="rtEditor" :content="richTxt" :change="richTxtOnChange"></sa-editor>
            </div>
        </template>
    </div>
</template>

<script>
    import saEditor from '../sa/sa_editor.vue';
    export default {
        name: 'serve.list',
        components: {
            saEditor
        },
        data() {
            return {
                filter:{
                    words:"", onlyOk:false,
                    status:"", statusAry:[{v:2, n:'激活'},{v:3, n:'禁用'}],
                    categoryId:"", categoryAry:[],
                    position:"", positionAry:[{v:3, n:'首页置顶'}, {v:5, n:'经纪页置顶'}, {v:6, n:'经纪页列表'}],
                },
                listAry: [],
                tbl:{size:10, total:0, curr:1},

                detail:{position:"", status:2, type:""},
                isDetailShow:false,
                richTxt:"",

                videoCover:"",
            }
        },
        created() {
            this.request({
                url: "coserve/category.ary", data: {status:2},
            }).then(res => {
                if (res && res.result) {this.filter.categoryAry = res.result}
                this.fetchList();
            }, res => {

            })
        },
        computed: {
            tblData() {
                return this.listAry.filter((d) => {
                    d.positionStr = "";
                    for(let i = 0; i < this.filter.positionAry.length; i ++) {
                        if (this.filter.positionAry[i].v == d.position) {
                            d.positionStr = this.filter.positionAry[i].n;
                            break;
                        }
                    }

                    if (d.categoryId > 0 && this.filter.categoryAry) {
                        for(let i = 0; i < this.filter.categoryAry.length; i ++) {
                            if (this.filter.categoryAry[i].id == d.categoryId) {
                                d.categoryTitle = this.filter.categoryAry[i].title;
                            }
                        }
                    }

                    return d
                })
            }
        },
        methods: {
            /**************** 操作 ****************/
            tblPageOnChange(val) {
                this.tbl.curr = val;
                this.fetchList();
            },

            toCreate() {
                if (this.detail && this.detail.id) {
                    localStorage.setItem("coServe_serve_tmp", "");
                    this.detail = {position:0, status:2};
                    this.richTxt = "";
                }

                let v = localStorage.getItem("coServe_serve_tmp");
                if (v && v.info && !v.info.id) {
                    this.detail = v.info;
                    this.richTxt = v.richTxt;
                }

                if (!this.detail.imgTxtAry) {
                    this.detail.imgTxtAry = [{type:6}];
                }

                this.isDetailShow = true;
            },

            toRefresh() {
                this.listAry = [];
                this.tbl.curr = 1;
                this.tbl.total = 0;
                this.fetchList();
            },

            toFilter() {
                this.tbl.curr = 1;
                this.tbl.total = 0;
                this.fetchList();
            },

            toEditRow(index,row) {
                this.fetchDetail(row.id);
            },

            toSubmit() {
                if (!this.detail) {
                    this.$message.error("内容不能为空");
                }

                if (!this.detail.title) {
                    this.$message.error("服务名不能为空");
                    return;
                }
                if (this.detail.title && this.detail.title.length > 250) {
                    this.$message.error("服务名称过长");
                    return;
                }
                if (this.detail.desc && this.detail.desc.length > 510) {
                    this.$message.error("描述过长");
                    return;
                }

                this.detail.imgTxtAry = [];
                if (this.richTxt) {this.detail.imgTxtAry = [{type:6, content:this.richTxt}];}

                if (this.detail.categoryId == "") {this.detail.categoryId = 0}
                if (this.detail.position == "") {this.detail.position = 0}
                if (this.detail.status == "") {this.detail.status = 3}
                if (this.detail.seq == "") {this.detail.seq = 0}

                let url = "coserve/serve.add";
                if (this.detail.id) {url = "coserve/serve.update"}

                this.request({
                    url: url, data:this.detail,
                    method: "post", needToken:true,
                }).then( res => {
                    this.fetchList();
                    this.isDetailShow = false;
                    this.videoCover = "";
                    this.detail = {position:0, status:2};
                    this.richTxt = "";
                    localStorage.setItem("coServe_serve_tmp", "");
                }, res => {
                    this.$message.error(res.msg || "提交修改失败");
                })
            },

            toCancel() {
                this.isDetailShow = false;
            },

            toSave:function() {
                localStorage.setItem("coServe_serve_tmp", JSON.stringify({
                    richTxt:this.richTxt,
                    info:this.detail
                }));
                this.$message.success("保存成功~");
            },

            /**************** 操作 ****************/

            fetchList() {
                let url = "coserve/serve.list";
                let params = {
                    pageSize:this.tbl.size, pageNumber:this.tbl.curr,
                    categoryId:this.filter.categoryId, position:this.filter.position, status:this.filter.status,
                };

                this.request({
                    url: url, data: params, needToken:true,
                }).then( res => {
                    if (res && res.code === 0) {
                        let that = this;
                        res.result.forEach(function (t) {
                            if (t.title && t.title.length > 60) {
                                t.title = t.title.substr(0, 60);
                                t.title += " ..."
                            }

                            if (t.desc && t.desc.length > 200) {
                                t.desc = t.desc.substr(0, 200);
                                t.desc += " ...";
                            }

                            t.timeStr = that.utils.timeStr(t.createTime);
                            if (t.position === 0) {t.position = ""}
                        });
                        this.listAry = res.result;
                        if (res.ext && res.ext.totalCount) {
                            this.tbl.total = res.ext.totalCount;
                        }
                    }
                }, res => {
                    this.$message.error("获取数据失败");
                });
            },

            fetchDetail(id) {
                if (this.detail && this.detail.id == id) {
                    _formateDetail(this);
                    this.isDetailShow = true;
                    return;
                }

                let v = localStorage.getItem("coServe_serve_tmp");
                if (v && v.info && v.info.id == id) {
                    this.detail = v.info;
                    this.richTxt = v.richTxt;

                    _formateDetail(this);
                    this.isDetailShow = true;
                    return;
                }

                this.detail = {};
                this.request({
                    url: "coserve/serve",
                    data:{id:id}, needToken:true
                }).then(res => {
                    let info = res.result;
                    info.timeStr = this.utils.timeStr(info.createTime);
                    if (info.type === 0) {info.type = ""}
                    if (info.position === 0) {info.position = ""}
                    this.detail = info;
                    _formateDetail(this);

                    this.isDetailShow = true;
                }, res => {
                    this.$message.error("获取内容详情失败");
                });

                function _formateDetail(that) {
                    if (!that.detail.imgTxtAry) {
                        that.detail.imgTxtAry = [{type:6}];
                    }

                    for (let i = 0; i < that.detail.imgTxtAry.length; i++) {
                        if (that.detail.imgTxtAry[i].type == 6) {
                            that.richTxt = that.detail.imgTxtAry[i].content;
                            break;
                        }
                    }
                }
            },

            //上传封面处理
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

            richTxtOnChange(title, html) {
                this.richTxt = html;
            },
        }
    }
</script>

<style scoped>
    .list_cover {width:60px;height:60px;object-fit:contain}
    .list_icon {width:60px;height:60px;object-fit:contain}

    .imgView {position: relative; display: flex; width: 120px; height: 120px; border: 1px dashed #cccccc; border-radius: 5px}
    .imgUploadIcon {width: 120px; line-height: 120px; text-align: center}

    .rtEditor {
        position: absolute; left: 0; top:0; width: 450px; height: calc(100% - 70px);
    }

</style>
