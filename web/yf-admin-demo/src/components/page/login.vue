<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">企丈人后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <template v-if="qrCode.visible">
                    <div class="qrCodeView">
                        <div class="qrCode">
                            <el-image class="img" :src="qrCode.url">
                                <div slot="error">
                                    <i class="el-icon-picture-outline err-img"></i>
                                </div>
                            </el-image>
                        </div>
                        <div class="hint">微信扫一扫登录</div>
                        <div style="text-align: center; color: white">
                            <el-button type="text" style="color: white; font-size: 11px" @click="toSwitchQrCodeMode">账号密码登录</el-button>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <el-form-item prop="username">
                        <el-input v-model="ruleForm.username" placeholder="用户名">
                            <i class="el-icon-lx-people" slot="prepend"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                            <i class="el-icon-lx-lock" slot="prepend"></i>
                        </el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                    </div>

                    <div style="text-align: center; color: white">
                        <el-button type="text" style="color: white; font-size: 11px" @click="toSwitchQrCodeMode">扫码登录</el-button>
                    </div>
                </template>
            </el-form>
        </div>
    </div>
</template>

<script>
    import md5 from '../../utils/md5';
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                qrCode:{visible:true, url:"", code:""},
                loginOk:false,
            }
        },
        created() {
            this.fetchQrCode();
        },
        methods: {
            toSwitchQrCodeMode() {
                this.qrCode.visible = !this.qrCode.visible;
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: "coserve/account.login",
                            data: {
                                account:this.ruleForm.username,
                                password:md5.hex_md5('qzr'+this.ruleForm.password)
                            },
                            method: "post",
                        }).then( res => {
                            this._loginOk(res)
                        }, res => {
                            this.$message.error(res.msg || "登录失败，请重试~");
                        });
                    } else {
                        return false;
                    }
                });
            },

            fetchQrCode() {
                this.request({
                    url: "coserve/authorize.qrcode",
                    data:{scene:"auth"},
                    method: "post",
                }).then( res => {
                    if (res && res.result) {
                        this.qrCode.code = res.result.code;
                        this.qrCode.url = res.result.url;
                    }

                    let that = this;
                    setTimeout(function () {
                        that.checkQrCode()
                    },3000)
                }, res => {
                    this.$message.error(res.msg || "获取二维码失败，请刷新页面重试！");
                });
            },
            checkQrCode() {
                if (this.qrCode.visible && this.qrCode.code) {
                    this.request({
                        url: "coserve/authorize.qrcode.check",
                        data:{code:this.qrCode.code, scene:"auth.ms"},
                        method: "post",
                    }).then( res => {
                        if (res.result && res.result.id > 0 && res.result.token) {
                            this._loginOk(res);
                        }
                    });
                }

                let that = this;
                setTimeout(function () {
                    if (!that.loginOk) {
                        that.checkQrCode()
                    }
                },2000)
            },

            _loginOk(res) {
                this.loginOk = true;
                res.result.accountId = res.result.id;
                let info = this.getAccountInfo();
                if (info && info.current && info.current.id > 0) {
                    for(let i = 0; i < res.result.length; i ++) {
                        let item = res.result[i];
                        if (item.id === info.current.id) {
                            res.result.current = item;
                            break;
                        }
                    }
                }

                if (!res.result.current && res.result.companyAry && res.result.companyAry.length > 0) {
                    res.result.current = res.result.companyAry[0];
                }

                if (!res.result.menuAry) {res.result.menuAry = []}
                localStorage.setItem("qzr_ms_account_info", JSON.stringify(res.result));

                if (res.result.menuAry.length > 0) {
                    this.$router.replace({path:res.result.menuAry[0].path});
                }
                this.$message.success("登录成功~");
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100% 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }

    .qrCodeView {}
    .qrCode {margin: 0 auto 0 auto; width: 200px; height: 200px; background-color: white; border-radius: 5px}
    .qrCode .err-img {width: 200px; line-height: 200px; text-align: center; font-size: 40px; color: #dddddd}

    .qrCodeView .hint {margin-top: 10px; width: 100%; text-align: center; font-size: 13px; color: #eeeeee}
    .qrCodeView .btn {margin-top: 10px; color: white;font-size: 11px; width: 100%; text-align: center; }
</style>