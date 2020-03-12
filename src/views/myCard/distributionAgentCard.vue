<template>
    <div>
        <el-form ref="formSearchTpye1" :inline="true" :model="formAllInfo" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="网卡类型">
                        <el-select v-model="formAllInfo.cardType" filterable placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    
                    <el-form-item label="卡号范围查询">
                        <el-input v-model="formAllInfo.startCard" placeholder="起始卡号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formAllInfo.endCard" placeholder="结束卡号"></el-input>
                    </el-form-item>
                    
                </el-col>
            </el-row>
        </el-form>

    </div>
</template>

<script>
export default {
    name: 'distributionAgentCard',
    data() {
        return {
            formAllInfo:{}
        }
    },
    created(){

    },
    computed:{

    }
}
</script>

<style scoped>

</style>