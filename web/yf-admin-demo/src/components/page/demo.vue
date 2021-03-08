<template>
    <div class="page">
        <div class="pageTop">
            <el-button type="text" icon="el-icon-circle-plus" @click="toCreate">新增</el-button>
            <el-button class="ml-15" type="text" icon="el-icon-refresh" @click="toRefresh">刷新</el-button>
            <el-select class="ml-15" style="width: 80px" size="mini" clearable placeholder="状态" v-model="filter.status">
                <el-option v-for="item in filter.statusAry" :key="item.v" :label="item.n" :value="item.v"></el-option>
            </el-select>

            <el-checkbox class="ml-15" size="mini" v-model="filter.onlyOk">只看激活</el-checkbox>
            <el-input class="ml-15" style="width:140px" size="mini"
                      placeholder="输入关键字" v-model="filter.words"
                      suffix-icon="el-icon-search">
            </el-input>
            <el-button style="margin-left: 15px" type="primary" size="mini" @click="toFilter">筛选</el-button>
        </div>
        <div class="pageCenter">
            <el-table  :data="listAry" stripe border :cell-style="{padding:'2px 0'}">
                <el-table-column prop="id" label="ID" width="60"></el-table-column>
                <el-table-column prop="title" label="姓名" min-width="140"></el-table-column>
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
                <el-table-column label="性别" width="65">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.sex == 1" effect="dark" type="success">女</el-tag>
                        <el-tag v-else-if="scope.row.sex == 2" effect="dark" type="danger">男</el-tag>
                        <el-tag v-else effect="dark" type="info">未知</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="integral" label="积分" width="80"></el-table-column>
                <el-table-column prop="createTimeStr" label="注册日期" width="130"></el-table-column>
                <el-table-column prop="updateTimeStr" label="最后登录日期" width="130"></el-table-column>
                <el-table-column label="操作" width="90" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toEditRow(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pageBottom">
            <el-pagination background @current-change="tblPageOnChange" layout="prev, pager, next,total"
                           :page-size="tbl.size" :total="tbl.total"></el-pagination>
        </div>

        <!--详情页-->
        <el-form v-if="isDetailShow" ref="editForm" :model="detail" :rules="detailRules" label-width="80px">
            <div class="pagePop">
                <div style="width: 500px">
                    <el-form-item label="活动名称" prop="name">
                        <el-input v-model="detail.name"></el-input>
                    </el-form-item>
                    <el-form-item label="活动区域">
                        <el-select v-model="detail.region" placeholder="请选择活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="detail.date1" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-time-picker placeholder="选择时间" v-model="detail.date2" style="width: 100%;"></el-time-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="即时配送">
                        <el-switch v-model="detail.delivery"></el-switch>
                    </el-form-item>
                    <el-form-item label="活动性质">
                        <el-checkbox-group v-model="detail.type">
                            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                            <el-checkbox label="地推活动" name="type"></el-checkbox>
                            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="特殊资源">
                        <el-radio-group v-model="detail.resource">
                            <el-radio label="线上品牌商赞助"></el-radio>
                            <el-radio label="线下场地免费"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="活动形式">
                        <el-input type="textarea" v-model="detail.desc"></el-input>
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
                listAry: [
                    {title:1},
                        ],
                tbl:{size:10, total:0, curr:1},
                mediaInfo:{},

                isDetailShow:false,
                detail: {
                    name: '',
                    age:"",
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                detailRules: {
                    name: [
                        { required: true, message:'名称不能空', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
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
                if (this.detail && this.detail.id) {this.detail = {}}
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
            },

            toSubmit() {
                this.$refs["editForm"].validate((ok) => {
                    if (!ok) {return false}
                });
            },

            toCancel() {
                this.isDetailShow = false;
            },

            fetchList() {
                return
                let url = "techio/user/user.list.ms";
                this.request({
                    url: url, needToken:true,
                    data:{pageSize:this.tbl.size, pageNumber:this.tbl.curr, level:2},
                }).then( res => {
                    this.listAry = res.result;
                    if (res.ext && res.ext.totalCount) {
                        this.tbl.total = res.ext.totalCount;
                    }
                }, res => {
                    this.$message.error(res.msg || "获取用户数据失败");
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
