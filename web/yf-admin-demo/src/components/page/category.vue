<template>
    <div class="page">
        <div class="pageTop">
            <el-button type="text" icon="el-icon-circle-plus" @click="toCreate">新增</el-button>
        </div>
        <div class="pageCenter">
            <el-table  :data="listAry" stripe border :cell-style="{padding:'5px 0'}">
                <el-table-column prop="id" label="ID" width="60"></el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 2" type="success">正常</el-tag>
                        <el-tag v-else type="danger">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="seq" label="序号" width="60"></el-table-column>
                <el-table-column prop="title" label="分类名" width="230"></el-table-column>
                <el-table-column label="操作" width="90" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toEditRow(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--详情页-->
        <el-form v-if="isDetailShow" ref="editForm" :model="detail" :rules="detailRules" label-width="80px">
            <div class="pagePop">
                <div style="width: 500px">
                    <el-form-item label="分类名称" prop="title">
                        <el-input size="mini" v-model="detail.title" style="width:200px"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select size="mini" clearable placeholder="状态" v-model="detail.status">
                            <el-option v-for="item in filter.statusAry" :key="item.v" :label="item.n" :value="item.v"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="序号" prop="seq">
                        <el-input type="number" style="width: 170px" size="mini" v-model="detail.seq"></el-input>
                    </el-form-item>
                </div>
            </div>
            <div class="pageBottom">
                <el-form-item>
                    <el-button type="success" size="mini" style="width: 80px; height: 30px" @click="toSubmit">保存</el-button>
                    <el-button type="danger" size="mini" style="width: 80px; height: 30px; margin-left: 40px" @click="toCancel">取消</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'demo',
        data() {
            return {
                filter:{
                    words:"", onlyOk:false,
                    status:"", statusAry:[{v:2, n:'激活'},{v:3, n:'禁用'}],
                },
                listAry: [],
                tbl:{size:10, total:0, curr:1},
                mediaInfo:{},

                isDetailShow:false,
                detail: {},
                detailRules: {
                    title: [
                        { required: true, message:'名称不能空', trigger: 'blur' },
                        { min: 1, max: 30, message: '不能超过30个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        created() {
            this.fetchList();
        },
        computed: {

        },
        methods: {
            /**************** 基本操作 ****************/
            toCreate() {
                if (this.detail && this.detail.id) {this.detail = {status:2}}

                if (!this.detail.seq && this.listAry.length > 0) {
                    let max = 0;
                    for(let i = 0; i < this.listAry.length; i ++) {
                        let item = this.listAry[i];
                        if (item.seq >= max) {
                            max = item.seq + 1
                        }
                    }
                    this.detail.seq = max;
                }

                if (!this.detail.status) {this.detail.status = 2}

                this.isDetailShow = true;
            },

            toRefresh() {
                this.listAry = [];
                this.tbl.curr = 1;
                this.tbl.total = 0;
                this.fetchList();
            },

            toFilter() {

            },

            tblPageOnChange(val) {
                this.tbl.curr = val;
                this.fetchList();
            },

            toEditRow(row) {
                this.isDetailShow = true;
                if (this.detail.id !== row.id) {this.detail = row}
            },

            toSubmit() {
                this.$refs["editForm"].validate((ok) => {
                    if (!ok) {return false}

                    let url = "coserve/category." + (this.detail.id ? "update" : "add");
                    this.request({
                        url:url, data:this.detail,
                        method:"post", needToken:true,
                    }).then(res => {
                        this.$message.success("提交成功！");
                        this.fetchList();
                        this.isDetailShow = false;
                        this.detail = {status:2};
                    }, res=> {
                        this.$message.error(res.msg || "提交失败~");
                    })
                });
            },

            toCancel() {
                this.isDetailShow = false;
            },

            fetchList() {
                let url = "coserve/category.ary";
                this.request({
                    url: url, needToken:true,
                    data:{pageSize:this.tbl.size, pageNumber:this.tbl.curr, level:2},
                }).then( res => {
                    this.listAry = res.result;
                    if (res.ext && res.ext.totalCount) {
                        this.tbl.total = res.ext.totalCount;
                    }
                }, res => {
                    this.$message.error(res.msg || "获取数据失败");
                });
            },

            /**************** 其他操作 ****************/
        }
    }
</script>

<style scoped>
    .tableView {
        width: 100%; height: calc(100vh - 160px);
        font-size: 12px;
    }
    .tableContainer {
        padding: 20px; border: 1px solid #dddddd; border-radius: 5px; background-color: white;
    }

    .avatar {width: 40px; height: 40px;}
</style>
