<template>
    <div class="pageView">
        <div class="pageContainer">
            <div class="pagePopView">
                <div class="pagePopSub">
                    <div class="filterView">
                        <el-button type="text" icon="el-icon-refresh" @click="toRefresh">刷新</el-button>
                        <el-button type="text" icon="el-icon-circle-plus" @click="toCreate">新建</el-button>

                        <el-input style="width: 160px; margin-left: 30px;" size="mini" clearable @blur="toRefresh" placeholder="公司名" v-model="filter.company" />
                        <el-input style="width: 160px; margin-left: 10px;" size="mini" clearable @blur="toRefresh" placeholder="账户名" v-model="filter.account" />
                    </div>
                    <el-table :data="list" stripe border :cell-style="{padding:'3px 0'}">
                        <el-table-column prop="id" label="ID" width="60"></el-table-column>
                        <el-table-column prop="account" label="账户" width="120"></el-table-column>
                        <el-table-column prop="accountName" label="姓名" width="120"></el-table-column>

                        <el-table-column label="状态" width="100">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status === 2" type="success">已结算</el-tag>
                                <el-tag v-if="scope.row.status === 3" type="info">已取消</el-tag>
                                <el-tag v-if="scope.row.status === 4" type="">已提现</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" width="100">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.type === 1">充值结算</el-tag>
                                <el-tag v-if="scope.row.type === 2">佣金结算</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="fund" label="金额" width="140"></el-table-column>
                        <el-table-column prop="remark" label="备注" min-width="140"></el-table-column>
                        <el-table-column prop="createTimeStr" label="创建日期" width="130"></el-table-column>
                        <el-table-column prop="updateTimeStr" label="更新日期" width="130"></el-table-column>
                        <el-table-column label="操作" width="60">
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
                            <div class="top">状态：</div>
                            <el-select clearable v-model="detail.status" :disabled="detail.status === 4" placeholder="请选择" class="bottom">
                                <el-option
                                        v-for="item in filter.statusAry"
                                        :key="item.v"
                                        :label="item.n"
                                        :value="item.v">
                                </el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 400px">
                            <div class="top">付款企业：</div>
                            <el-autocomplete style="width: 280px"
                                             v-model="detail.company"
                                             :fetch-suggestions="searchCompanyAry"
                                             :disabled="detail.id > 0"
                                             @select="companyChanged"
                            ></el-autocomplete>
                        </div>
                    </div>

                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 400px">
                            <div class="top">佣金受益人：</div>
                            <el-autocomplete style="width: 280px"
                                             v-model="detail.accountName"
                                             :fetch-suggestions="searchAccountAry"
                                             :disabled="detail.id > 0"
                                             @select="accountChanged"
                            ></el-autocomplete>
                        </div>
                    </div>

                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 400px">
                            <div class="top">金额：</div>
                            <el-input v-model="detail.fund" type="number" :disabled="detail.status === 4"
                                      class="bottom"  style="width: 280px" placeholder=""></el-input>
                        </div>
                    </div>
                    <div class="flexWrap w-per100">
                        <div class="group" style="width: 300px">
                            <div class="top">备注：</div>
                            <textarea type="text"
                                      class="inputArea"
                                      style="width: 260px; height: 80px;"
                                      v-model="detail.remark" placeholder="">
                            </textarea>
                        </div>
                    </div>
                </div>
                <div class="pagePopBottom">
                    <el-button type="success" size="mini" style="width: 100px; margin:0 30px" @click="toSubmitDetail">提交</el-button>
                    <el-button type="danger" size="mini" style="width: 100px" @click="toCancelDetail">取消</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                accountInfo:{},
                filter:{
                    status:"", statusAry:[{v:2, n:'已结算'},{v:3, n:'已取消'},{v:4, n:'已提现'}],
                    company:"", account:"",
                },

                tbl:{cnt:0, size:20, curr:1},
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
            toRefresh() {

            },
            toCreate() {
                if (this.detail.id != 0) {
                    this.detail = {id:0}
                }
                this.isDetailShow = true
            },
            toEditRow(index, row) {
                if (row.id !== this.detail.id) {
                    this.detail = row
                }
                this.isDetailShow = true
            },
            companyChanged(e) {
                if (e) {
                    this.detail.companyId = e.id
                }
            },
            accountChanged(e) {
                if (e) {
                    this.detail.accountId = e.id
                }
            },
            toSubmitDetail() {
                if (!this.detail.status) {this.$message.error("状态不能空");return}
                if (!this.detail.companyId) {this.$message.error("请先选择公司");return}
                if (!this.detail.fund) {this.$message.error("请输入金额");return}

                let url = "coserve/fund." + (this.detail.id ? "update" : "add");
                this.request({
                    url: url, data: {
                        id:this.detail.id,
                        status:this.detail.status,
                        fund:parseInt(this.detail.fund*100),
                        companyId:this.detail.companyId,
                        accountId:this.detail.accountId,
                        type:2,
                        remark:this.detail.remark,
                    },
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
                    url: "coserve/fund.list",
                    data:{type:2},
                    needToken:true
                }).then(res => {
                    this.list = res.result;
                    this.list.forEach( t => {
                        t.fund = t.fund/100;
                        t.createTimeStr = this.utils.timeStr(t.createTime, "Y-M-D H:M");
                        t.updateTimeStr = this.utils.timeStr(t.updateTime, "Y-M-D H:M");
                    })
                },res => {
                    this.$message.error(res.msg || "获取数据失败~");
                })
            },
            searchCompanyAry(str, cb) {
                this.request({
                    url: "coserve/company.search",
                    data:{name:str},
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
            searchAccountAry(str, cb) {
                this.request({
                    url: "coserve/account.search",
                    data:{name:str, role:200},
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
            }
        }
    }
</script>

<style scoped>

</style>