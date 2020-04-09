<template>
  <div class="powerManage">

    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="username" label="角色名称"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">

          <el-button
            size="mini"
            type="danger"
            @click="pagePower(scope.row)">页面级别权限</el-button>

          <el-button
            size="mini"
            type="danger"
            @click="havedPower(scope.row)">按钮级别权限</el-button>
          
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
      class="mt-15 mb-15 fr"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length">
    </el-pagination>

    <el-dialog v-if="dialogMark==1" class="clearfix" title="按钮级别权限设定" :visible.sync="dialogVisible" width="400px" @close="closeDialogFn('tree')">
      <div>
        <el-input class="mb-15" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree 
          ref="tree" 
          :data="data" 
          show-checkbox 
          node-key="id" 
          accordion
          :filter-node-method="filterNode" 
          :default-checked-keys="defaultCheckedKeys" 
          :props="defaultProps"
          >
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="getNode">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog v-if="dialogMark==0" class="clearfix" title="页面级别权限设定" :visible.sync="dialogVisible" width="400px" @close="closeDialogFn('pageTree')">
      <div>
        <el-input class="mb-15" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree
          ref="pageTree" 
          :data="pageData"
          show-checkbox
          node-key="id" 
          accordion
          :filter-node-method="filterNode" 
          :default-checked-keys="pagedefaultCheckedKeys" 
          :props="pageDefaultProps"
          >
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getPageNode">确 定</el-button>
      </span>
    </el-dialog>

{{arr}}
  </div>
</template>


<script>
export default {
  name: "powerManage",
  data() {
    return {
      tableData: [],
      currentPage: 1, //当前第一页
      pageSize:10, //默认每页1条数据
      pageSizes:[10,20,30], //设置每页显示多少条
      dialogVisible: false,//弹窗显示与否
      dialogMark:-1, //0 打开页面权限  1 打开按钮权限
      data: [
        {
          id: 'A01',
          label: '代理商管理',
          children: [
            {id: 'A01-1',label: '增加'},
            {id: 'A01-2',label: '删除'},
            {id: 'A01-3',label: '修改'},
            {id: 'A01-4',label: '导出'}
          ]
        },
        {
          id: 'A02',
          label: '代理商微信提成设定',
          children: [
            {id: 'A02-1',label: '修改'}
          ]
        },
        {
          id: 'A03',
          label: '代理商查询',
          children: [
            {id: 'A03-1',label: '导出'}
          ]
        },
        {
          id: 'A04',
          label: '代理商网卡提成设定',
          children: [
            {id: 'A04-1',label: '修改'}
          ]
        },
        {
          id: 'B01',
          label: '提现申请',
          children: [
            {id: 'B01-1',label: '申请提现'}
          ]
        },
        {
          id: 'B02',
          label: '代理商提现申请',
          children: [
            {id: 'B02-1',label: '导出申请'},
            {id: 'B02-2',label: '确认转账'}
          ]
        },
        {
          id: 'B03',
          label: '微信充值明细查询',
          children: [
            {id: 'B03-1',label: '导出'}
          ]
        },
        {
          id: 'B04',
          label: '接口充值明细查询',
          children: [
            {id: 'B04-1',label: '导出'}
          ]
        },
        {
          id: 'B05',
          label: '我的账户',
          children: [
            {id: 'B05-1',label: '保存'}
          ]
        },
        {
          id: 'B06',
          label: '转账记录',
          children: [
            {id: 'B06-1',label: '导出'}
          ]
        },
        {
          id: 'B07',
          label: '充值记录',
          children: [
            {id: 'B07-1',label: '导出'}
          ]
        },
        {
          id: 'B08',
          label: '扣款记录',
          children: [
            {id: 'B08-1',label: '导出'}
          ]
        },
        {
          id: 'B09',
          label: '微信对账',
          children: [
            {id: 'B09-1',label: '导出'}
          ]
        },
        {
          id: 'B10',
          label: '接口对账',
          children: [
            {id: 'B10-1',label: '导出'}
          ]
        },
        {
          id: 'C01',
          label: '全部卡',
          children: [
            {id: 'C01-1',label: '导出'},
            {id: 'C01-2',label: '回收'},
            {id: 'C01-3',label: '删除'}
          ]
        },
        {
          id: 'C02',
          label: '分配代理商卡',
          children: [
            {id: 'C02-1',label: '导出'},
            {id: 'C02-2',label: '分配'}
          ]
        },
        {
          id: 'C03',
          label: '回收代理商卡',
          children: [
            {id: 'C03-1',label: '导入'},
            {id: 'C03-2',label: '回收'}
          ]
        },
        {
          id: 'C04',
          label: '上传记录',
          children: [
            {id: 'C04-1',label: '下载'}
          ]
        },
        {
          id: 'D01',
          label: '推送消息',
          children: [
            {id: 'D01-1',label: '新建'},
            {id: 'D01-2',label: '删除'}
          ]
        },
        {
          id: 'D02',
          label: '消息查收'
        },
        {
          id: 'E01',
          label: '用户管理',
          children: [
            {id: 'E01-1',label: '增加用户'},
            {id: 'E01-2',label: '重置用户'}
          ]
        },
        {
          id: 'E02',
          label: '权限管理',
          children: [
            {id: 'E02-1',label: '保存'}
          ]
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultCheckedKeys:[],//已经获取的按钮权限id
      filterText:"",
      selUserId:null,
      ///页面级别
      pageData:[
        {
          id: '1',
          text: '我的代理商',
          children: [
            {id: '1-1',text: '代理商管理',name:'agentsManage',parentId:'1'},
            {id: '1-2',text: '代理商微信提成设定',name:'agentsWxRoyaltySet',parentId:'1'},
            {id: '1-3',text: '代理商接口提成设定',name:'agentsJkRoyaltySet',parentId:'1'},
            {id: '1-4',text: '代理商查询',name:'agentsQuery',parentId:'1'}
          ]
        },
        {
          id: '2',
          text: '用户与权限',
          children: [
            {id: '2-1',text: '权限管理',name:'powerManage',parentId:'2'},
            {id: '2-2',text: '用户管理',name:'userManage',parentId:'2'},
            {id: '2-3',text: '密码修改',name:'userPassword',parentId:'2'}
          ]
        },
        {
          id: '3',
          text: '我的钱包',
          children: [
            {id: '3-1',text: '我的账户',name:'myAccount',parentId:'3'},
            {id: '3-2',text: '代理商提现申请',name:'agentCashWithdrawalApplication',parentId:'3'},
            {id: '3-3',text: '我的提现申请',name:'myCashWithdrawalApplication',parentId:'3'},
            {id: '3-4',text: '微信充值查询',name:'WxRechargeQuery',parentId:'3'},
            {id: '3-5',text: '接口充值查询',name:'JkRechargeQuery',parentId:'3'},
            {id: '3-6',text: '转账记录',name:'transferRecord',parentId:'3'},
            {id: '3-7',text: '微信对账',name:'WxReconciliation',parentId:'3'},
            {id: '3-8',text: '接口对账',name:'JkReconciliation',parentId:'3'},
            {id: '3-9',text: '扣款记录',name:'preCutLst',parentId:'3'},
            {id: '3-10',text: '充值记录',name:'prePayLst',parentId:'3'}
          ]
        },
        {
          id: '4',
          text: '我的卡',
          children: [
            {id: '4-1',text: '全部卡',name:'allCard',parentId:'4'},
            {id: '4-2',text: '分配代理商卡',name:'distributionAgentCard',parentId:'4'},
            {id: '4-3',text: '回收代理商卡',name:'recoveryAgentCard',parentId:'4'}
          ]
        },
        {
          id: '5',
          text: '消息管理',
          children: [
            {id: '5-1',text: '推送消息',name:'pushMsg',parentId:'5'},
            {id: '5-2',text: '查收消息',name:'acceptMsg',parentId:'5'}
          ]
        },
        {
          id: '6',
          text: '任务管理',
          children: [
            {id: '6-1',text: '任务列表',name:'taskList',parentId:'6'}
          ]
        },
      ],
      pageDefaultProps: {
        children: 'children',
        label: 'text'
      },
      pagedefaultCheckedKeys:[], //已经获取的页面权限id
      arr:null
    };
  },
  methods:{
    closeDialogFn(dom){
      this.$refs[dom].setCheckedKeys([]);
    },

    async getUserList(){
      try{
        let data=await this.$axios.post("/fr/SuperSUPro/powerManager",this._qs.stringify({
            userName :JSON.parse(localStorage.getItem("userLoginInfo")).username,
            userId  :localStorage.getItem("userid"),
            userType :localStorage.getItem("usertype"),
            agentId  :localStorage.getItem("agentid"),
        }))
        if(data.errcode==0){
            this.tableData=data.data.data;
        }
        
      }catch(err){
        this.$message.error("服务器异常，请稍后再试！");
      }
    },
    //已经拥有的按钮权限
    async pagePower(msg){
      this.dialogVisible=true;
      this.dialogMark=0;
    },
    //已经拥有的按钮权限
    async havedPower(msg){
      this.dialogVisible=true;
      this.dialogMark=1;
      this.selUserId=msg.id;
      try{
        let data=await this.$axios.post("/fr/SuperSUPro/getUserPower",this._qs.stringify({
            selUserId:msg.id
        }))
        if(data.errcode==0){
          var defaultCheckedKeys=[];
          var arr=data.data.data;
          for(let i=0;i<arr.length;i++){
            for(let j=0;j<arr[i].subbtnid.split(",").length;j++){
              var a=arr[i].subbtnid.split(",");
              var str;
              if(a.length>1){
                str=arr[i].menuid+'-'+a[j];
              }else{
                str=arr[i].menuid;
              }
              defaultCheckedKeys.push(str)
            }
          }
          // console.log(defaultCheckedKeys)
        //  
          this.defaultCheckedKeys=defaultCheckedKeys
        }
        
      }catch(err){
        this.$message.error("服务器异常，请稍后再试！");
      }
    },

    getMenus(data) {
        return Object.entries(data.reduce((res, v) => {
            var [menuId, subBtnId] = v.split('-');
            if(!res[menuId]) res[menuId] = new Set(); // 没有重复的话可以直接使用数组
            if(subBtnId) res[menuId].add(subBtnId)
            return res;
        },{})).map(([menuId, subBtnIds]) => ({menuId, subBtnId: [...subBtnIds].join()}))
    },
    getPageMenus(data) {

    },
    getPageNode(){
      var arr=[];
      this.dialogVisible=false;
      var allId=this.$refs.pageTree.getCheckedNodes().concat(this.$refs.pageTree.getHalfCheckedNodes());
      var len=allId.length;
      for(let i=0;i<len;i++){
        if(allId[i].children){
          var json={
            text:allId[i].text,
            children:[]
          }
          arr.push(json);
          var r=allId[i].id;
          for(let j=0;j<len;j++){
            if( allId[j].parentId==r ){
              json.children.push( allId[j] )
            }
          }
        }
      }
      
this.arr=arr


///



    },
	  async getNode() {
      this.dialogVisible=false;
      var allId=this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
      var a=this.getMenus(allId);
      try{
        let data=await this.$axios.post("/fr/SuperSUPro/saveUserPower",this._qs.stringify({
          userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
          userId:localStorage.getItem("userid"),
          selUserId:this.selUserId,
          userMenuJSON:JSON.stringify(a)
        }))
        if(data.errcode==0){
          this.$message.success(data.errmsg);
        }else{
          this.$message.error(data.errmsg);
        }
        
      }catch(err){
        this.$message.error("服务器异常，请稍后再试！");
      }

    },

    handleEdit(index, row) {
      this.dialogVisible=true;
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    //每页显示多少条设置
    handleSizeChange(val) {
      this.pageSize=val;
      this.currentPage=1;
    },
    //跳转到第几页
    handleCurrentChange(val) {
      this.currentPage=val
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },
  created() {
    this.getUserList();
  },
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
};
</script>

<style scoped>
.powerManage >>> .el-tag{
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>