<template>
    <div class="pageView">
        <div class="pageContainer">
            <div class="pagePopView">
                <div class="pagePopSub">
                    <div class="handle-box">
                        <el-button type="text" icon="el-icon-refresh" @click="toRefresh">刷新</el-button>
                    </div>
                    <div class="tableContainer pr">
                        <el-table :data="listAry" stripe border :cell-style="{padding:'2px 0'}" class="tableView">
                            <el-table-column prop="id" label="ID" width="60"></el-table-column>
                            <el-table-column prop="userId" label="用户ID" width="80"></el-table-column>
                            <el-table-column prop="content" label="反馈内容" min-width="300"></el-table-column>
                            <el-table-column label="图片" width="100" align="center">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.picAry && scope.row.picAry.length > 0">
                                        <el-image
                                                style="width: 40px; height: 40px"
                                                :src="scope.row.picAry[0]"
                                                :preview-src-list="scope.row.picAry">
                                        </el-image>
                                    </template>
                                    <template v-else>
                                        <span>无</span>
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column prop="contact" label="联系方式" width="130"></el-table-column>
                            <el-table-column prop="timeStr" label="反馈时间" width="160"></el-table-column>
                        </el-table>
                    </div>
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
        name: 'feedbackList',
        data() {
            return {
                tbl:{size:20, cnt:0, curr:1},
                listAry: [],

                popPic:{img:"", ary:[""]}
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            toRefresh() {
                this.listAry = [];
                this.listCurPage = 1;
                this.fetchData();
            },

            /**************** 表格操作 ****************/

            tableCurPageChanged(val) {
                this.tbl.curr = val;
                this.fetchData();
            },

            /**************** 接口请求 ****************/

            fetchData() {
                let url = "coserve/feedback.list";
                this.request({
                    url: url,
                    data:{pageSize:this.tbl.size, pageNumber:this.tbl.curr},
                    needToken:true
                }).then( res => {
                    if (res.result && res.result.length > 0) {
                        let that = this;
                        res.result.forEach(function (t) {
                            t.timeStr = that.utils.timeStr(t.createTime, "Y年M月D日 H:M");
                        });
                        this.listAry = res.result;
                    }
                    if (res.ext && res.ext.totalCount) {this.tbl.cnt = res.ext.totalCount;}
                }, res => {
                    this.$message.error(res.msg || "获取用户数据失败");
                });
            },
        }
    }
</script>

<style scoped>

</style>
