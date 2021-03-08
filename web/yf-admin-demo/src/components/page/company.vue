<template>
    <div class="page">
        <div class="pageTop">
            <el-button type="text" icon="el-icon-circle-plus" @click="toCreate">新增</el-button>
            <el-button class="ml-15" type="text" icon="el-icon-refresh" @click="toRefresh">刷新</el-button>
            <el-select class="ml-15" style="width: 80px" size="mini" clearable placeholder="状态" v-model="filter.status">
                <el-option v-for="item in filter.statusAry" :key="item.v" :label="item.n" :value="item.v"></el-option>
            </el-select>
            <el-button style="margin-left: 15px" type="primary" size="mini" @click="toFilter">筛选</el-button>
        </div>
        <div class="pageCenter">
            <el-table  :data="listAry" stripe border :cell-style="{padding:'2px 0'}">
                <el-table-column prop="id" label="ID" width="130"></el-table-column>
                <el-table-column label="状态" width="70">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 2"  type="success">激活</el-tag>
                        <el-tag v-else-if="scope.row.status == 1"  type="danger">审核</el-tag>
                        <el-tag v-else  type="info">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="公司名称" min-width="200"></el-table-column>
                <el-table-column label="公司logo" width="80" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.logo">
                            <img :src="scope.row.logo" class="avatar">
                        </template>
                        <template v-else>
                            <img src="../../assets/img/default.png" class="avatar">
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="contact" label="企业联系方式" width="120"></el-table-column>
                <el-table-column prop="staffSizeStr" label="企业人员规模" width="110"></el-table-column>
                <el-table-column prop="valueSizeStr" label="企业年产值" width="110"></el-table-column>
                <el-table-column prop="createTimeStr" label="创建日期" width="130"></el-table-column>
                <el-table-column prop="updateTimeStr" label="更新日期" width="130"></el-table-column>
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
        <el-form v-if="isDetailShow" ref="editForm" :model="detail" :rules="detailRules" label-width="100px">
            <div class="pagePop">
                <div style="width: 500px">
                    <el-form-item label="公司名称" prop="name">
                        <el-input v-model="detail.name"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="contact">
                        <el-input v-model="detail.contact"></el-input>
                    </el-form-item>
                    <el-form-item label="公司Logo" prop="logo">
                        <div class="flexWrap">
                            <template v-if="detail.logo">
                                <div class="imgView pr mr-10">
                                    <img :src="detail.logo" class="w-per100 h-per100">
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
                    </el-form-item>

                    <el-form-item label="状态" prop="status">
                        <el-select size="mini" clearable placeholder="状态" v-model="detail.status">
                            <el-option v-for="item in filter.statusAry" :key="item.v" :label="item.n" :value="item.v"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="公司人员规模" prop="staffSize">
                        <el-select size="mini" clearable placeholder="请选择" v-model="detail.staffSize">
                            <el-option v-for="item in filter.staffAry" :key="item.v" :label="item.n" :value="item.v"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="公司年产值规模" prop="valueSize">
                        <el-select size="mini" clearable placeholder="请选择" v-model="detail.valueSize">
                            <el-option v-for="item in filter.valueAry" :key="item.v" :label="item.n" :value="item.v"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="备注">
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
        name: 'company',
        data() {
            return {
                filter:{
                    words:"", onlyOk:false,
                    status:"", statusAry:[{v:1, n:'待审核'},{v:2, n:'激活'},{v:3, n:'禁用'}],
                    staffAry:[{v:1, n:"0-15人"}, {v:2, n:"15-30人"}, {v:3, n:"30-60人"}, {v:4, n:"60-100人"}, {v:5, n:"100人以上"}],
                    valueAry:[{v:1, n:"0-10万"}, {v:2, n:"10-50万"}, {v:3, n:"50-100万"}, {v:4, n:"100-200万"}, {v:5, n:"200-500万"}, {v:6, n:"500万以上"}],
                },
                listAry: [
                    {title:1},
                        ],
                tbl:{size:10, total:0, curr:1},
                mediaInfo:{},

                isDetailShow:false,
                detail: {status:2},
                detailRules: {
                    name: [
                        { required: true, message:'名称不能空', trigger: 'blur' },
                        { min: 4, max: 32, message: '长度不得超过32个字符', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message:'状态不能空', trigger: 'blur' },
                    ],
                },
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
                if (this.detail && this.detail.id > 0) {this.detail = {status:2}}
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
                if (this.detail && this.detail.id != row.id) {this.detail = row}
            },

            toSubmit() {
                this.$refs["editForm"].validate((ok) => {
                    if (!ok) {return false}
                    this.request({
                        url:"coserve/ms/company." + (this.detail.id > 0 ? 'update' : 'add'),
                        data:this.detail, method:"post", needToken:true
                    }).then(res => {
                        this.$message.success("提交成功");
                        this.isDetailShow = false;
                        this.detail = {status: 2};
                        this.fetchList();
                    }, res => {
                        this.$message.error(res.msg || "提交失败");
                    })
                });
            },

            toCancel() {
                this.isDetailShow = false;
            },

            fetchList() {
                let url = "coserve/ms/company.list";
                this.request({
                    url: url, needToken:true,
                    data:{pageSize:this.tbl.size, pageNumber:this.tbl.curr},
                }).then( res => {
                    this.listAry = res.result;
                    if (this.listAry && this.listAry.length > 0) {
                        for(let i = 0; i < this.listAry.length; i ++) {
                            let v = this.listAry[i];

                            if (v.staffSize) {
                                if (v.staffSize - 1 < this.filter.staffAry.length) {
                                    v.staffSizeStr = this.filter.staffAry[v.staffSize - 1].n
                                }
                            }

                            if (v.valueSize) {
                                if (v.valueSize - 1 < this.filter.valueAry.length) {
                                    v.valueSizeStr = this.filter.valueAry[v.valueSize - 1].n
                                }
                            }

                            v.createTimeStr = this.utils.timeStr(v.createTime);
                            v.updateTimeStr = this.utils.timeStr(v.updateTime);
                        }
                    }

                    if (res.ext && res.ext.totalCount) {
                        this.tbl.total = res.ext.totalCount;
                    }
                }, res => {
                    this.$message.error(res.msg || "获取数据失败");
                });
            },

            /**************** 其他操作 ****************/
            //上传封面处理
            toUploadImg(e) {
                let idx = parseInt(e.currentTarget.id);
                let formData = new FormData();
                formData.append("file", e.target.files[0]);
                this.upload({
                    url:"coserve/upload",
                    data: formData
                }).then( res => {
                    this.detail.logo = res.result.uri;
                    this.$forceUpdate();
                }, res => {
                    this.$message.error("图片上传失败");
                })
            },
        }
    }
</script>

<style scoped>
    .avatar {width: 40px; height: 40px; object-fit: contain;}

    .imgView {position: relative; display: flex; width: 120px; height: 120px; border: 1px dashed #cccccc; border-radius: 5px}
    .imgUploadIcon {width: 120px; line-height: 120px; text-align: center}
</style>
