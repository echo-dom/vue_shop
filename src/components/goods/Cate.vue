<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
          <el-col>
              <el-button type="primary" @click="showAddCateDialog">
                  添加分类
              </el-button>
          </el-col>
      </el-row>
      <!-- 表格区 -->
      <tree-table class="treetable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
          <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted===false" class="el-icon-success" style="color:lightgreen;"></i>
          <i v-else class="el-icon-error" style="color:red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" >
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
             <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
    title="添加分类"
    :visible.sync="addCateDialogVisible"
    width="50%" @close="addCateDialogClosed"
    >
    <!-- 添加分类的表单 -->
    <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
   <el-form-item label="分类名称:" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类:">
      <!-- 级联选择器 options指定数据源 -->
      <!-- props 用来指定配置对象 -->
      <el-cascader  expand-trigger="hover"
    v-model="selectedKeys"
    :options="parentCateList"
    :props="cascaderProps"
    @change="parentCateChanged" clearable change-on-select></el-cascader>
  </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      catelist: [],
      //   总数据条数
      total: 0,
      //   为table指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 表示，将当前列定义为模板列
        type: 'template',
        // 模板列名
        template: 'isok'
      },
      {
        label: '排序',
        // 表示，将当前列定义为模板列
        type: 'template',
        // 模板列名
        template: 'order'
      },
      {
        label: '操作',
        // 表示，将当前列定义为模板列
        type: 'template',
        // 模板列名
        template: 'opt'
      }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      //   添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的ID 不能为空，如果要添加1级分类，则父分类Id应该设置为  `0`
        cat_pid: 0,
        // 分类层级 不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0
      },
      //   添加分类表单的验证规程对象
      addCateFormRules: {
        cat_name: [
          { required: true,message: '请输入分类的名称',trigger: 'blur' }
        ]
      },
      //   父级分类的数据列表
      parentCateList: [],
      //   用来指定级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //   选中的分级分类的id数组
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories',{ params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      console.log(res)
      //   把数据列表，赋值给catalist
      this.catelist = res.data.result
      //   总数据条数
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    // 点击按钮展示添加分类的对话框
    showAddCateDialog () {
    //   获取父级分类数据列表
      this.getParentCateList()
      // 展示出对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories',{
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged () {
      console.log(this.selectedKeys)
      //   如果selectedKeys 数组长度大于0那么就说明选中了父级分类
      // 反之久没有选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories',this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败!')
        }
        this.$message.success('添加分类成功!')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件,重置表单数据
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      //   清空数组
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }

  }
}
</script>

<style lang="less" scoped>
.treetable{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>
