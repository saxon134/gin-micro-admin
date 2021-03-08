<template>
    <div class="pageView">
        <div class="pageContainer">
            <div class="pagePopView">
                <div class="pagePopSub">
                    <div class="separateView" style="margin-top: 10px">基本参数设置</div>
                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 200px">
                            <div class="top">应用名称：</div>
                            <el-input v-model="detail.name" @change="detailOnChange"
                                      class="bottom" style="width: 160px" placeholder=""></el-input>
                        </div>
                    </div>
                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 160px">
                            <div class="top">微信小程序AppID：</div>
                            <el-input v-model="detail.appConf.appId" @change="detailOnChange"
                                      class="bottom" style="width: 160px" placeholder=""></el-input>
                        </div>
                    </div>
                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 380px">
                            <div class="top">微信小程序AppKey：</div>
                            <el-input v-model="detail.appConf.appKey" @change="detailOnChange"
                                      class="bottom" style="width: 380px" placeholder=""></el-input>
                        </div>
                    </div>
                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 200px">
                            <div class="top">备注：</div>
                            <el-input type="textarea" style="width: 380px;"
                                      maxlength="64" show-word-limit @change="detailOnChange"
                                      v-model="detail.remark" placeholder="">
                            </el-input>
                        </div>
                    </div>
                </div>
                <div class="pagePopBottom">
                    <el-button type="success" size="mini" style="width: 80px;"
                               :disabled="!isDetailChanged" @click="toSubmitDetail">提交</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                tbl:{cnt:0, size:20, curr:1},
                list:[],
                accountList:[],

                detail:{id:0},
                isDetailShow:false,
                isDetailChanged:false
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            /**************** 动作 ****************/
            tblCurPageChanged(v) {
                this.tbl.curr = v;
                this.fetchData();
            },
            toCreate() {
                if (this.detail.id !== 0) {
                    this.detail = {id:0}
                }

                if (!this.detail.appConf) {
                    this.detail.appConf = {appId:"", appKey:"", merchantId:""}
                }
                this.isDetailShow = true
            },
            toEditRow(index, row) {
                this.isDetailShow = true;
                if (!this.detail || this.detail.id !== row.id) {
                    this.detail = row;
                }
            },
            toSubmitDetail() {
                if (this.detail.name === "") {this.$message.error("名称不能空~");return}

                let url = "coserve/media.";
                let params = {...this.detail};
                if (this.detail.id) {
                    url += "update";
                    params.id = this.detail.id;
                } else {
                    url += "add";
                }

                this.request({
                    url: url, data: params,
                    method: "post", needToken: true
                }).then(res => {
                    this.$message.success("提交成功！");
                    this.detail = {id:0};
                    this.isDetailShow = false;
                    this.isDetailChanged = false;
                    this.fetchData();
                },res => {
                    this.$message.error(res.msg || "提交失败~");
                })
            },
            toCancelDetail() {
                this.isDetailShow = false
            },

            /**************** 接口 ****************/
            fetchData() {
                this.request({
                    url: "coserve/media.list", needToken:true, data:{status:2}
                }).then(res => {
                    let _this = this;
                    res.result.forEach(function (t) {
                        if (!t.appConf) {
                            t.appConf = {appId:"", appKey:"", merchantId:""}
                        }
                    });
                    this.list = res.result;
                    if (this.list.length > 0) {this.detail = this.list[0]}
                },res => {
                    this.$message.error(res.msg || "获取数据失败~");
                })
            },

            detailOnChange() {
                this.isDetailChanged = true;
            }
        }
    }
</script>

<style scoped>
.logo {display: flex; width: 40px; height: 40px; border: 1px dashed #cccccc; border-radius: 5px}
.uploaderIcon {width: 40px; line-height: 40px; text-align: center}
</style>