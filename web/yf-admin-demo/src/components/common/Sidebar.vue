<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :collapse="false"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router>
            <template v-for="item in menuAry">
                <template v-if="item.subs && item.subs.length > 0">
                    <el-submenu :index="item.path" :key="item.path">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs && subItem.subs.length > 0"
                                        :index="subItem.path" :key="subItem.path">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.path"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else
                                :index="subItem.path" :key="subItem.path"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.path" :key="item.path">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from './bus';
    export default {
        data() {
            return {
                menuAry: []
            }
        },
        created() {
            this.menuAry = this.getAccountInfo().menuAry;
            this.$forceUpdate();

            bus.$on("account", ary => {
                this.menuChanged(ary);
            })
        },
        methods: {
            menuChanged(ary) {
                if (!ary) {ary = []}

                this.menuAry = ary;
                this.$forceUpdate();

                //存储menu
                let info = this.getAccountInfo();
                info.menuAry = this.menuAry;
                localStorage.setItem("qzr_ms_account_info", JSON.stringify(info));
            }
        }
    }

</script>

<style scoped>
@import "../../assets/css/iconfont/iconfont.css";

.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
