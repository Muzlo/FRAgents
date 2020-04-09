<template>
  <div class="agentsManage">
    <el-form :inline="true" size="mini" :model="form" label-width="100px" ref="ruleForm">
      <el-row>
        <el-col :span="24">
          <el-form-item label="省份">
            <el-select
              :clearable="true"
              v-model="form.provSearch"
              placeholder="请选择"
              filterable
              @change="citySearchFn"
            >
              <el-option
                v-for="item in province"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市">
            <el-select :clearable="true" v-model="form.citySearch" placeholder="请选择">
              <el-option
                v-for="item in city"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="pr-30">
        <el-col :span="24">
          <el-form-item label="地址">
            <el-input v-model="form.addressSearch"></el-input>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="form.linkManSearch"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.telSearch"></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="form.mobileSearch"></el-input>
          </el-form-item>
          <el-form-item label="模糊查询">
            <el-input v-model="form.anySearch"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="10">
          <el-form-item>
            <el-button type="primary" @click="searchformFn('/fr/MyAgent/myAgentSearch')">搜索</el-button>
            <el-button @click="resetForm1()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="clearfix">
        <el-button
          type="primary"
          size="mini"
          class="fr"
          @click="searchformFn('/fr/MyAgent/downLoadAgent')"
        >导出代理商</el-button>
      </div>
    </el-form>

    <el-divider></el-divider>
    <el-table
      border
      :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
    >

      <el-table-column align="center" prop="agentname" label="代理商名称" width="250" fixed></el-table-column>
      <el-table-column align="center" prop="agentno" label="代理商编号" width="100"></el-table-column>
      <el-table-column align="center" prop="num" label="网卡总数" width="100"></el-table-column>
      <el-table-column align="center" prop="bankname" label="开户行" width="250"></el-table-column>
      <el-table-column align="center" prop="bankcardno" label="银行卡号" width="160"></el-table-column>
      <el-table-column align="center" prop="agentprov" label="省份" width="80"></el-table-column>
      <el-table-column align="center" prop="agentciity" label="城市" width="80"></el-table-column>
      <el-table-column align="center" prop="agentaddress" label="详细地址"></el-table-column>
      <el-table-column align="center" prop="agenttel" label="联系电话" width="120"></el-table-column>
      <el-table-column align="center" prop="agentmobile" label="手机号" width="120"></el-table-column>
      <el-table-column align="center" prop="agentlinkmang" label="联系人" width="80"></el-table-column>
      <el-table-column align="right" width="150" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="keySearch" size="mini" placeholder="输入代理商名称搜索" />
        </template>

        <template slot-scope="scope">
          <el-tooltip effect="dark" content="查看USIM卡" placement="top-start">
            <router-link :to="{name:'allCard', params: {id:scope.row.id,name:scope.row.agentname}}">
              <el-button size="mini" type="success" icon="el-icon-search" class="mr-15"></el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      class="fr"
      :total="tableList.length"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      @handleSizeChangeEmit="handleSizeChange"
      @handleCurrentChangeEmit="handleCurrentChange"
    />

    <publicForm
      :inline="formInline"
      :otherInfo="otherInfo"
      :width="formWidth"
      :formTitle="formTitle"
      :form="diaForm"
      :formRules="formRules"
      :url="url"
      @resetFormEmit="resetForm"
    >
      <div slot="formContent">
        <el-form-item label="代理商名称" prop="agentName">
          <el-input v-model="diaForm.agentName" class="pr-30"></el-input>
        </el-form-item>

        <el-form-item label="联系人" prop="agentLinkMan">
          <el-input v-model="diaForm.agentLinkMan" class="pr-30"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="agentMobile">
          <el-input v-model="diaForm.agentMobile" class="pr-30"></el-input>
        </el-form-item>

        <el-form-item label="开户行名称">
          <el-input v-model="diaForm.bankName" class="pr-30"></el-input>
        </el-form-item>

        <el-form-item label="银行卡号">
          <el-input v-model="diaForm.bankCardNo" class="pr-30"></el-input>
        </el-form-item>

        <el-form-item label="省份">
          <el-select
            v-model="diaForm.agentProv"
            placeholder="请选择"
            filterable
            @change="citySearchFn"
          >
            <el-option
              v-for="item in province"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="城市">
          <el-select v-model="diaForm.agentCity" placeholder="请选择">
            <el-option v-for="item in city" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="联系电话">
          <el-input v-model="diaForm.agentTel" class="pr-30"></el-input>
        </el-form-item>

        <el-form-item label="详细地址">
          <textarea v-model="diaForm.agentAddress" rows="4" cols="70"></textarea>
        </el-form-item>
      </div>
    </publicForm>
  </div>
</template>

<script>
import pagination from "../../components/myCard/pagination";
import publicForm from "../../components/myCard/publicForm";
export default {
  name: "agentsQuery",
  data() {
    return {
      form: {},
      tableData: [],
      currentPage: 1, //当前第一页
      pageSize: 30, //默认每页1条数据
      pageSizes: [30, 50, 100], //设置每页显示多少条
      keySearch: "",
      province: null, //省份
      city: null, //城市
      otherInfo: "-1", //标记 '0'新增 '1'修改
      formWidth: "700px",
      formTitle: "增加代理商",
      diaForm: {
        ispre:0
      },
      formInline: true,
      //验证表单
      formRules: {
        agentName: [{ required: true, message: "不能为空", trigger: "blur" }],
        agentLinkMan: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        agentMobile: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      //接口地址
      url: {
        addUrl: `/fr/MyAgent/saveAgent`,
        updUrl: `/fr/MyAgent/updAgent`,
        delUrl: `/fr/MyAgent/delAgent`
      }
    };
  },
  components: { pagination, publicForm },
  created() {
    this.getProvince();
    let formOtherInfo = {
      agentId: localStorage.getItem("agentid"),
      userType: localStorage.getItem("usertype"),
      userId: localStorage.getItem("userid"),
      userName: JSON.parse(localStorage.getItem("userLoginInfo")).username
    };
    this.diaForm = { ...this.diaForm,...formOtherInfo };
  },
  computed: {
    //复制一份表格数据
    tableList() {
      return this.tableData.filter(item => {
        if (item.agentname.includes(this.keySearch)) {
          return item;
        }
        this.currentPage = 1;
      });
    },        
  },
  methods: {
    resetForm(data) {
      let formOtherInfo = {
        agentId: localStorage.getItem("agentid"),
        userType: localStorage.getItem("usertype"),
        userId: localStorage.getItem("userid"),
        userName: JSON.parse(localStorage.getItem("userLoginInfo")).username
      };
      this.diaForm = { ...formOtherInfo, ...data };
    },
    confirmFn(txt, cb) {
      this.$confirm(`是否确认${txt}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cb();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //处理字符串省市
    dealProvinceCity(data) {
      let str = data.lst;
      let provinceDeal = new Array();
      str = str.split("</option>");
      let len = str.length;
      str.splice(len - 1, 1);
      str.forEach((item, index) => {
        let provinceDealJson = {};
        provinceDealJson.name = item.split(">")[1];
        provinceDeal[index] = provinceDealJson;
      });
      return provinceDeal;
    },
    //获取省份
    async getProvince() {
      try {
        let data = await this.$axios.post("/fr/MyAgent/cardArea");
        if (data.errcode == 0) {
          this.province = this.dealProvinceCity(data);
        }
      } catch (err) {
        this.$message.error("服务器异常，请稍后再试！");
      }
    },
    //获取对应城市
    async citySearchFn(val) {
      try {
        let data = await this.$axios.post(
          "/fr/MyAgent/cardCity",
          this._qs.stringify({
            area: val
          })
        );
        if (data.errcode == 0) {
          this.city = this.dealProvinceCity(data);
        }
      } catch (err) {
        this.$message.error("服务器异常，请稍后再试！");
      }
    },
    resetForm1(formName) {
      this.form = {};
    },
    async searchformFn(url) {
      let paramsObj = {
        userName: JSON.parse(localStorage.getItem("userLoginInfo")).username,
        userId: localStorage.getItem("userid"),
        userType: localStorage.getItem("usertype"),
        agentId: localStorage.getItem("agentid")
      };
      paramsObj = { ...paramsObj, ...this.form };

      try {
        let data = await this.$axios.post(url, this._qs.stringify(paramsObj));
        if (data.errcode == 0) {
          if (url.includes("myAgentSearch")) {
            this.tableData=data.lst.data;
            // let arr=[];
            //   for(let i=0;i<data.lst.data.length;i++){
            //     let data2 = await this.$axios.post(`/fr/MyAgent/getCardCount`, this._qs.stringify({id:data.lst.data[i].id}));
            //     arr.push(data.lst.data[i]);
            //     arr[i].cardCount=data2.lst;
            //   }
            //   this.tableData =arr;
          }
          if (url.includes("downLoadAgent")) {
            window.location.href = data.downUrl;
          }
        } else {
          this.$message.error(data.errmsg);
        }
      } catch (err) {
        this.$message.error("服务器异常，请稍后再试！");
      }
    },

    handleSizeChange(data) {
      this.pageSize = data;
      this.currentPage = 1;
    },
    handleCurrentChange(data) {
      this.currentPage = data;
    }
  }
};
</script>

<style scoped>
.agentsManage >>> .pr-30 input,
.agentsManage >>> .pr-30 textarea {
  padding-right: 30px !important;
}
</style>