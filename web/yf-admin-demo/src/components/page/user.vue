<template>
    <div class="pageView">
        <div class="pageContainer">
            <div class="pagePopView">
                <div class="pagePopSub">
                    <div class="handle-box">
                        <el-button type="text" icon="el-icon-refresh" @click="toRefresh">刷新</el-button>
                    </div>
                    <el-table :data="tableData" stripe border :cell-style="{padding:'2px 0'}">
                        <el-table-column prop="id" label="ID" width="80"></el-table-column>
                        <el-table-column prop="parentId" label="推荐人ID" width="90"></el-table-column>
                        <el-table-column prop="name" label="姓名" min-width="140"></el-table-column>
                        <el-table-column label="头像" width="100" align="center">
                            <template slot-scope="scope">
                                <template v-if="scope.row.avatar">
                                    <img :src="scope.row.avatar" class="avatar">
                                </template>
                                <template v-else>
                                    <img src="../../assets/img/avatar.png" class="avatar">
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="phone" label="手机号" width="140"></el-table-column>
                        <el-table-column prop="createTimeStr" label="注册日期" width="130"></el-table-column>
                        <el-table-column prop="updateTimeStr" label="最后登录日期" width="130"></el-table-column>
                    </el-table>
                </div>
                <div class="pagePopBottom">
                    <el-pagination background @current-change="tableCurPageChanged" layout="prev, pager, next,total"
                                   :page-size="tbl.size" :total="tbl.cnt"></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'user.list',
        data() {
            return {
                listAry: [],
                tbl:{size:10, cnt:0, curr:1},
            }
        },
        created() {
            this.fetchData();
        },
        computed: {
            tableData() {
                return this.listAry.filter((d) => {
                    d.createTimeStr = this.utils.timeStr(d.createTime);
                    d.updateTimeStr = this.utils.timeStr(d.updateTime);
                    return d
                })
            }
        },
        methods: {
            toRefresh() {
                this.listAry = [];
                this.tbl.curr = 1;
                this.fetchData();
            },

            /**************** 表格操作 ****************/

            tableCurPageChanged(val) {
                this.tbl.curr = val;
                this.fetchData();
            },

            /**************** 接口请求 ****************/

            fetchData() {
                let url = "coserve/user.list";
                this.request({
                    url: url, needToken:true,
                    data:{pageSize:this.tbl.size, pageNumber:this.tbl.curr},
                }).then( res => {
                    this.listAry = res.result;
                    if (res.ext && res.ext.totalCount) {
                        this.tbl.cnt = res.ext.totalCount;
                    }
                }, res => {
                    this.$message.error(res.msg || "获取用户数据失败");
                });
            },
        }
    }
</script>

<style scoped>
    .avatar {
        width: 40px; height: 40px;
    }
</style>
