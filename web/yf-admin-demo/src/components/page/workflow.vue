<template>
    <div class="page">
        <!--筛选-->
        <div class="pageTop">
            <el-button type="text" icon="el-icon-circle-plus" @click="toCreate">新增</el-button>
        </div>
        <!--列表-->
        <div class="pageCenter">
            <el-table :data="listAry" highlight-current-row stripe border :cell-style="{padding:'2px 0'}">
                <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
                <el-table-column label="状态" width="90" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 2"  type="success">正常</el-tag>
                        <el-tag v-else  type="danger">已删除</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="110" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toShowRow(scope.$index, scope.row)">查看</el-button>
                        <el-button type="text" @click="toEditRow(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="工作事项" min-width="100" align="center"></el-table-column>
                <el-table-column prop="desc" label="描述" align="center" min-width="100"></el-table-column>
                <el-table-column prop="updateTimeStr" label="更新时间" align="center" width="130"></el-table-column>
                <el-table-column prop="createTimeStr" label="创建时间" align="center" width="130"></el-table-column>
            </el-table>
        </div>
        <!--分页-->
        <div class="pageBottom">
            <el-pagination background @current-change="tblPageOnChange" layout="prev, pager, next,total"
                           :page-size="tbl.size" :total="tbl.total"></el-pagination>
        </div>

        <!--编辑页-->
        <template v-if="isEditShow">
            <div class="pagePop" style="height: calc(100vh - 80px)">
                <div class="flexWrap" style="margin:0 20px; width: 500px;">
                    <div class="flexWrap w-per100">
                        <!--基础信息-->
                        <div class="flexWrap" style="width: 500px;">
                            <el-input class="title is-bold" type="text" v-model="detail.title" maxlength=64 show-word-limit placeholder="标题"></el-input>
                            <el-input class="desc mt-15" type="textarea" v-model="detail.desc" maxlength=512 show-word-limit placeholder="描述"></el-input>

                            <div class="flexWrap">
                                <div class="flexWrap" style="width:160px;">
                                    <div class="separateView" style="font-size: 13px; margin: 25px 0 0 0">状态</div>
                                    <el-select v-model="detail.status" clearable placeholder="请选择" style="width:120px;">
                                        <el-option
                                                v-for="item in filter.statusAry"
                                                :key="item.v"
                                                :label="item.n"
                                                :value="item.v">
                                        </el-option>
                                    </el-select>
                                </div>

                            </div>
                        </div>
                        
                        <div class="flexWrap mb-30">
                            <div class="separateView">操作流程：</div>
                            <div class="flexWrap">
                                <div v-for="(item,idx) in detail.steps" :key="idx" v-if="item.status !== 3" class="flexV pr step">
                                    <div class="idx">{{idx + 1}}</div>
                                    <div class="stepContent" :style="'border-left:' + (idx + 1 === detail.steps.length ? '0' : '2px solid #2d8cf0')">
                                        <div class="stepDetail">
                                            <div class="flexWrap w-per100">
                                                <el-input class="title is-bold" type="text" v-model="item.title" maxlength=125 show-word-limit placeholder="操作内容"></el-input>
                                                <el-input class="desc mt-10 mb-10" type="textarea" v-model="item.desc" maxlength=255 show-word-limit placeholder="描述"></el-input>
                                            </div>
                                            <div class="flexWrap" style="margin-bottom: 5px">
                                                <div class="uploadBtn pr mr-10">
                                                    <input type="file" class="pa" style="opacity: 0;" :id="idx" @change="toUploadFile" />
                                                    上传文件
                                                </div>
                                                <div v-if="item.files && item.files.length > 0" class="fileView">
                                                    <div v-for="(f,fidx) in item.files" class="flexWrap fileItem">
                                                        <div><a :href="f.url" target="_blank">{{f.name}}</a></div>
                                                        <el-button type="danger" size="mini" icon="el-icon-delete" circle :id="idx + '_' + fidx" @click="toDelFile"></el-button>
                                                    </div>
                                                </div>
                                            </div>
                                            <el-button type="text" size="mini" @click="toCreateStep" :id="idx">新建步骤</el-button>
                                            <el-button type="text" size="mini" @click="toDelStep" :id="idx">删除步骤</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mb-30 w-per100" style="margin-left: 65px">
                            <el-button type="success" size="mini" class="mr-25" style="width: 80px; height: 30px" @click="toSubmit">提交</el-button>
                            <el-button type="danger" size="mini" style="width: 80px; height: 30px" @click="toCancel">取消</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!--详情页-->
        <template v-if="isDetailShow">
            <div class="pagePop" style="height: calc(100vh - 80px)">
                <div class="flexWrap w-per100">
                    <!--基础信息-->
                    <div class="flexWrap" style="width: 500px;">
                        <div class="group" style="width: 500px">
                            <div class="top">工作内容：</div>
                            <div class="bottom">{{detail.title}}</div>
                        </div>
                        <div class="group" style="width: 500px" v-if="detail.desc">
                            <div class="top">工作描述：</div>
                            <div class="bottom">{{detail.desc}}</div>
                        </div>
                    </div>

                    <div class="flexWrap mb-30">
                        <div class="separateView">操作流程：</div>
                        <div class="flexWrap">
                            <div v-for="(item,idx) in detail.steps" :key="idx" v-if="item.status !== 3" class="flexV pr step">
                                <div class="idx">{{idx + 1}}</div>
                                <div class="stepContent" :style="'border-left:' + (idx + 1 === detail.steps.length ? '0' : '2px solid #2d8cf0')">
                                    <div class="stepReadDetail">
                                        <div class="flexWrap w-per100">
                                            <div class="group" style="width: 500px;">
                                                <div class="top" style="font-size: 14px">内容：</div>
                                                <div class="bottom" style="font-size: 14px">{{item.title}}</div>
                                            </div>
                                            <div class="group" style="width: 500px" v-if="item.desc">
                                                <div class="top" style="font-size: 14px">描述：</div>
                                                <div class="bottom" style="font-size: 14px">{{item.desc}}</div>
                                            </div>
                                        </div>
                                        <div class="flexWrap" v-if="item.files && item.files.length > 0">
                                            <div class="w-per100 mt-10" style="font-size:13px; font-weight: bold">参考资料</div>
                                            <template v-for="f in item.files">
                                                <div class="readFile pr mr-10 flexWrap">
                                                    <i class="el-icon-document"></i>
                                                    <div><a :href="f.url" target="_blank">{{f.name}}</a></div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-30 w-per100" style="margin-left: 65px">
                        <el-button type="danger" size="mini" style="width: 80px; height: 30px" @click="toCancel">关闭</el-button>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'serve.list',
        data() {
            return {
                filter:{
                    status:"", statusAry:[{v:2, n:'正常'},{v:3, n:'删除'}],
                },
                listAry: [],
                tbl:{size:10, total:0, curr:1},

                detail:{id:0, status:2, steps: [{title:"", workflowId:0, files:[]}]},
                isDetailShow:false,
                isEditShow:false,
                richTxt:"",
            }
        },
        created() {
            this.fetchList();
        },
        computed: {

        },
        methods: {
            /**************** 操作 ****************/
            tblPageOnChange(val) {
                this.tbl.curr = val;
                this.fetchList();
            },

            toCreate() {
                if (this.detail && this.detail.id) {
                    localStorage.setItem("coServe_workflow_tmp", "");
                    this.detail = {id:0, steps: [{title:"", workflowId:this.detail.id, files:[]}]};
                }

                let v = localStorage.getItem("coServe_workflow_tmp");
                if (v && v.info && !v.info.id) {
                    this.detail = v.info;
                    this.richTxt = v.richTxt;
                }

                if (!this.detail.imgTxtAry) {
                    this.detail.imgTxtAry = [{type:6}];
                }

                this.isDetailShow = false;
                this.isEditShow = true;
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
                let that = this;
                this.fetchDetail(row.id,function () {
                    that.isDetailShow = false;
                    that.isEditShow = true;
                });
            },
            toShowRow(index,row) {
                let that = this;
                this.fetchDetail(row.id, function () {
                    that.isDetailShow = true;
                    that.isEditShow = false;
                });
            },

            toCreateStep(e) {
                let idx = parseInt(e.currentTarget.id);
                if (idx >= 0 && idx < this.detail.steps.length) {
                    this.detail.steps.splice(idx + 1, 0, {title:"", workflowId:this.detail.id, files:[]});
                    this.$forceUpdate()
                }
            },
            toDelStep(e) {
                let idx = parseInt(e.currentTarget.id);
                if (idx >= 0 && idx < this.detail.steps.length && this.detail.steps.length > 1) {
                    this.detail.steps.splice(idx, 1);
                    this.$forceUpdate()
                }
            },

            toSubmit() {
                if (!this.detail) {
                    this.$message.error("内容不能为空");
                }

                if (!this.detail.title) {
                    this.$message.error("工作内容不能为空");
                    return;
                }
                if (this.detail.title && this.detail.title.length > 128) {
                    this.$message.error("工作内容字符太长");
                    return;
                }

                let url = "coserve/ms/workflow." + (this.detail.id > 0 ? 'update' : "add");
                let data = {...this.detail};
                if (data.steps && data.steps.length > 0) {
                    for(let i = 0; i < data.steps.length; i ++) {
                        if (data.steps[i].files && data.steps[i].files.length > 0) {
                            for(let j = 0; j < data.steps[i].files.length; j ++) {
                                data.steps[i].files[j] = data.steps[i].files[j].url
                            }
                        }
                    }
                }
                this.request({
                    url: url, data:this.detail,
                    method: "post", needToken:true,
                }).then( res => {
                    this.fetchList();
                    this.isDetailShow = false;
                    this.isEditShow = false;
                    this.detail = {id:0, status:2};
                    localStorage.setItem("coServe_workflow_tmp", "");
                }, res => {
                    this.$message.error(res.msg || "提交修改失败");
                })
            },

            toCancel() {
                this.isDetailShow = false;
                this.isEditShow = false;
            },

            toSave:function() {
                localStorage.setItem("coServe_workflow_tmp", JSON.stringify({
                    richTxt:this.richTxt,
                    info:this.detail
                }));
                this.$message.success("保存成功~");
            },

            /**************** 操作 ****************/

            fetchList() {
                let url = "coserve/ms/workflow.list";
                let params = {
                    pageSize:this.tbl.size, pageNumber:this.tbl.curr,
                    status:this.filter.status,
                };

                this.request({
                    url: url, data: params, needToken:true,
                }).then( res => {
                    if (res && res.code === 0) {
                        let that = this;
                        res.result.forEach(function (t) {
                            if (t.title && t.title.length > 60) {
                                t.title = t.title.substr(0, 50);
                                t.title += " ..."
                            }

                            if (t.desc && t.desc.length > 50) {
                                t.desc = t.desc.substr(0, 50);
                                t.desc += " ...";
                            }

                            t.createTimeStr = that.utils.timeStr(t.createTime);
                            t.updateTimeStr = that.utils.timeStr(t.updateTime);
                            if (t.type === 0) {t.type = ""}
                            if (t.position === 0) {t.position = ""}

                            if (t.files && t.files.length > 0) {
                                let ary = [];
                                for(let i = 0; i < t.files.length; i ++) {
                                    let f = {url:t.files[i], name:t.files[i].split(".").pop()};
                                    ary.push(f)
                                }
                                t.files = ary
                            }
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

            fetchDetail(id, cb) {
                this.request({
                    url: "coserve/ms/workflow", data: {id:id}, needToken:true,
                }).then( res => {
                    this.detail = res.result;
                    if (!this.detail.steps) {this.detail.steps = []}
                    if (this.detail.steps.length === 0) {this.detail.steps = [{title:"", workflowId:this.detail.id, files:[]}]}

                    for(let i = 0; i < this.detail.steps.length; i ++) {
                        if (this.detail.steps[i].files && this.detail.steps[i].files.length > 0) {
                            for(let j = 0; j < this.detail.steps[i].files.length; j ++) {
                                if (typeof this.detail.steps[i].files[j] === "string") {
                                    let ary = this.detail.steps[i].files[j].split("/");
                                    this.detail.steps[i].files[j] = {name:ary[ary.length - 1], url:this.detail.steps[i].files[j]}
                                }
                            }
                        }
                    }
                    if (cb) {cb()}
                }, res => {
                    this.$message.error("获取数据失败");
                });
            },

            //上传封面处理
            toUploadFile(e) {
                let idx = parseInt(e.currentTarget.id);
                if (idx < this.detail.steps.length) {
                    if (this.detail.steps[idx].files && this.detail.steps[idx].files.length >= 3) {
                        this.$message.error("最多只能上传3个文件");
                        return;
                    }
                }

                let formData = new FormData();
                formData.append("file", e.target.files[0]);
                formData.append("uri", "/tmp/workflow/" + (new Date().getTime()) + "/" + e.target.files[0].name);
                this.upload({
                    url:"coserve/upload",
                    data: formData
                }).then( res => {
                    if (idx < this.detail.steps.length) {
                        if (!this.detail.steps[idx].files) {this.detail.steps[idx].files = []}
                        this.detail.steps[idx].files.push({name:res.result.name, url:res.result.uri});
                    }
                    this.$forceUpdate();
                }, res => {
                    this.$message.error("图片上传失败");
                })
            },
            toDelFile(e) {
                let ary = e.currentTarget.id.split("_");
                if (ary && ary.length === 2) {
                    let idx = parseInt(ary[0]);
                    let fidx = parseInt(ary[1]);
                    this.detail.steps[idx].files.splice(fidx,1)
                }
            }
        }
    }
</script>

<style scoped>
    .uploadBtn {margin: 5px 0 0 0; width: 60px; height: 25px; border-radius: 4px; line-height: 25px; color: #2d8cf0; text-align: left}
    .fileView {margin: 0 0 0 20px; width: 355px;}
    .fileView .fileItem {padding-bottom: 10px; width: 100%; height: 20px; text-align: left; border-bottom: 1px solid #f0f0f0;}
    .fileItem div {margin-top: 5px; width: calc(100% - 30px); height: 20px; line-height: 20px; overflow: hidden}



    .step {margin: 0 30px; width: 800px}
    .step .idx {width: 20px; height: 20px; line-height: 20px; font-size: 16px; color:#2d8cf0; text-align: center; border-radius: 50%; border: 2px solid #2d8cf0;}
    .stepContent {position: relative; min-height: 50px; margin: 0 0 0 10px; height: 220px;}
    .stepContent .stepDetail {position: absolute; left: 25px; top:-25px; width: 100%;}
    .stepDetail .title {font-size: 15px; width: 430px; margin-right: 10px}
    .stepDetail .desc {font-size: 15px; width: 430px; margin-right: 10px}

    .stepContent .stepReadDetail {position: absolute; left: 25px; top:-35px; width: 100%;}
    .stepReadDetail .title {font-size: 15px; width: 430px; margin-right: 10px}
    .stepReadDetail .desc {font-size: 15px; width: 430px; margin-right: 10px}


    .readFile {line-height: 20px; margin: 5px 10px 0 0;}
    .readFile i {margin:3px 5px 0 0;}

</style>
