<template>
    <div class="pageView">
        <div class="pageContainer">
            <div class="pagePopView">
                <div class="pagePopSub">
                    <div class="handle-box">
                        <el-button type="text" icon="el-icon-circle-plus" @click="toCreate">新建</el-button>
                    </div>
                    <el-table :data="list" stripe border :cell-style="{padding:'3px 0'}">
                        <el-table-column prop="id" label="ID" width="60"></el-table-column>
                        <el-table-column prop="account" label="登录名" width="160"></el-table-column>
                        <el-table-column prop="name" label="姓名" width="140"></el-table-column>
                        <el-table-column label="状态" width="100">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status == 2"  type="success">激活</el-tag>
                                <el-tag v-else  type="danger">禁用</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="角色" width="100">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.role == 1"  type="">管理员</el-tag>
                                <el-tag v-else-if="scope.row.role == 2"  type="">平台人员</el-tag>
                                <el-tag v-else-if="scope.row.role == 300"  type="success">企业负责人</el-tag>
                                <el-tag v-else-if="scope.row.role == 301"  type="success">企业员工</el-tag>
                                <el-tag v-else-if="scope.row.role == 200"  type="warning">渠道伙伴</el-tag>
                                <el-tag v-else-if="scope.row.role == 201"  type="warning">渠道员工</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button type="text" @click="toEditRow(scope.$index, scope.row)">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagePopBottom">
                    <el-pagination background @current-change="tblCurPageChanged" layout="prev, pager, next"
                                   :page-size="tbl.size" :total="tbl.cnt"></el-pagination>
                </div>
            </div>

            <div v-if="isDetailShow" class="pagePopView">
                <div class="pagePopSub">
                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 200px">
                            <div class="top">登录名：</div>
                            <div v-if="detail.id != 0" class="bottom" style="padding-left:10px;width:170px;height:25px;line-height:25px;background-color: #dddddd;border-radius:4px;">{{detail.account}}</div>
                            <input v-else v-model="detail.account" class="bottom inputArea" style="width: 160px" placeholder=""></input>
                        </div>
                        <div class="group" style="width: 200px">
                            <div class="top">姓名：</div>
                            <input v-model="detail.name" class="bottom inputArea" style="width: 160px" placeholder=""></input>
                        </div>
                    </div>
                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 200px">
                            <div class="top">状态：</div>
                            <el-select clearable v-model="detail.status" placeholder="请选择" class="bottom">
                                <el-option
                                        v-for="item in filter.statusAry"
                                        :key="item.v"
                                        :label="item.n"
                                        :value="item.v">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="group" style="width: 200px">
                            <div class="top">角色：</div>
                            <el-select clearable v-model="detail.role" placeholder="请选择" class="bottom">
                                <el-option
                                        v-for="item in filter.roleAry"
                                        :key="item.v"
                                        :label="item.n"
                                        :value="item.v">
                                </el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 200px">
                            <div class="top">登录密码：</div>
                            <input v-model="detail.password" class="bottom inputArea" style="width: 160px" placeholder=""></input>
                        </div>
                    </div>

                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 400px">
                            <div class="top">关联企业：</div>
                            <input v-model="detail.companyIds" class="bottom inputArea" placeholder=""></input>
                        </div>
                    </div>
                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 200px">
                            <div class="top">备注：</div>
                            <textarea type="text"
                                      class="inputArea"
                                      style="width: 380px; height: 80px;"
                                      v-model="detail.remark" placeholder="">
                            </textarea>
                        </div>
                    </div>
                </div>
                <div class="pagePopBottom">
                    <el-button type="success" size="mini" style="width: 100px; margin: 0 30px" @click="toSubmitDetail">提交</el-button>
                    <el-button type="danger" size="mini" style="width: 100px" @click="toCancelDetail">取消</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import md5 from '../../utils/md5'
    export default {
        data: function(){
            return {
                accountInfo:{},
                filter:{
                    status:"", statusAry:[{v:2, n:'激活'},{v:3, n:'禁用'}],
                    role:"", roleAry:[{v:1, n:'管理员'},{v:2, n:'系统人员'},{v:200, n:'渠道伙伴'},{v:300, n:'企业客户'}],
                },

                tbl:{cnt:0, size:10, curr:1},
                list:[],

                detail:{id:0},
                isDetailShow:false
            }
        },
        created() {
            this.fetchData();
            this.accountInfo = this.getAccountInfo();
        },
        methods: {
            /**************** 动作 ****************/
            tblCurPageChanged(v) {
                this.tbl.curr = v;
                this.fetchData();
            },
            toCreate() {
                if (this.detail.id != 0) {
                    this.detail = {id:0}
                }
                this.detail.parentAccountId = this.accountInfo.id;
                this.isDetailShow = true
            },
            toEditRow(index, row) {
                if (row.id !== this.detail.id) {
                    this.detail = row
                }
                this.isDetailShow = true
            },
            toSubmitDetail() {
                if (this.detail.account === "") {this.$message.error("登录名不能空~");return}
                if (this.detail.id === 0) {
                    if (this.detail.password === "") {this.$message.error("密码不能空~");return}
                    if (this.detail.password.length < 5) {this.$message.error("密码不能小于5位~");return}
                } else if (this.detail.password) {
                    if (this.detail.password.length < 5) {this.$message.error("密码不能小于5位~");return}
                }

                if (this.detail.status !==2 && this.detail.status !== 3) {this.$message.error("请选择状态~");return}

                let url = "coserve/account.";
                if (this.detail.id) {
                    url += "update";
                    if (this.detail.password) {
                        this.detail.password = md5.hex_md5("qzr" + this.detail.password)
                    }
                } else {
                    url += "add";
                    this.detail.password = md5.hex_md5("qzr" + this.detail.password);
                }

                this.request({
                    url: url, data: this.detail,
                    method: "post", needToken: true
                }).then(res => {
                    this.$message.success("提交成功！");
                    this.detail = {id:0};
                    this.isDetailShow = false;
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
                    url: "coserve/account.list",
                    data:{pageSize:this.tbl.size, pageNumber:this.tbl.curr},
                    needToken:true
                }).then(res => {
                    this.list = res.result;
                    this.tbl.cnt = (res.ext && res.ext.totalCount) ? res.ext.totalCount : this.list.length;
                },res => {
                    this.$message.error(res.msg || "获取数据失败~");
                })
            },
        }
    }
</script>

<style scoped>

</style>