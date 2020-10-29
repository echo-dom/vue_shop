<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商管理后台系统</span>
      </div>
      <el-button type='info' @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体区 -->
    <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse?'64px':'200px'">
      <div @click='toggleButton' class="toggle-button">|||</div>
      <!-- 侧边栏菜单区 -->
    <el-menu :collapse-transition="false" :collapse="isCollapse" unique-opened background-color="#333744" text-color="#fff" active-text-color="#409bff" router :default-active="activePath">
      <!-- 一级菜单 -->
      <el-submenu v-for="item in menulist" :key="item.id" :index="item.id+''">
        <!-- 一级菜单的模板区 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item v-for="subitem in item.children" :key="subitem.id" :index="'/'+subitem.path" @click="saveNavStatus('/'+subitem.path)">
          <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subitem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>

    <!-- 右侧内容区 -->
    <el-main>
      <!-- 放一个路由占位符 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      // 建立自定义图表对象
      iconsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-coin',
        101: 'el-icon-shopping-bag-2',
        102: 'el-icon-tickets',
        145: 'el-icon-data-line'
      },
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''

    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      // 如果失败着弹出提示
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 点击按钮控制菜单的折叠与展开
    toggleButton () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接激活的状态
    saveNavStatus (activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }

  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  display: flex;
  justify-content:space-between;
  background-color: #373d41;
  padding-left:0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  >div{
    display: flex;
    align-items: center;
    span{
      margin-left:15px;
    }
  }
}
.el-aside{
    background-color: #333742;
    .el-menu{
      border-right: none;
    }
}
.el-main{
    background-color: #EAEDF1;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
