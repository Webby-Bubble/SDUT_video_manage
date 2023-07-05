<template>
    <div class="userManage">
        <el-table
                :data="userList"
                border
                style="width: 100%">
            <el-table-column
                    label="用户头像"
                    width="100">
                <template slot-scope="scope">
                    <el-image :src="scope.row.userPic" style="width: 70px;height: 70px;border-radius: 8px"></el-image>
                </template>
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="用户名"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="sex"
                    label="性别">
                <template slot-scope="scope">
                   <i :style="scope.row.sex === '男'?'color:blue':'color:pink'" :class="scope.row.sex === '男'?'el-icon-male':'el-icon-female'"></i>{{' ' +scope.row.sex}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="个人简介">
            </el-table-column>
            <el-table-column
                    prop="age"
                    label="年龄">
            </el-table-column>
            <el-table-column
                    prop="guanZhuCount"
                    label="关注量">
            </el-table-column>
            <el-table-column
                    prop="fenSiCount"
                    label="粉丝量">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="电话">
            </el-table-column>
            <el-table-column
                    label="用户状态">
                <template slot-scope="scope">
                   <el-tag :type="scope.row.status === 1?'success':'danger'" >{{scope.row.status === 1?'正常':'已封禁'}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column
                    min-width="120px"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="showUserOption(scope.row)" icon="el-icon-edit" size="small">操作</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                style="margin-top: 30px"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[4, 8, 10, 12]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>

        <el-dialog title="用户操作" center width="25%"  :visible.sync="showUserOptionVisiable">
            <div v-show="disableShowForm.status === 1" style="text-align: center">
                <div style="font-size: 16px;margin-bottom: 10px">选择对该用户封禁时间</div>
                <el-select v-model="deadTime" placeholder="请选择时间" style="width: 170px">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <div style="margin-top: 20px">
                    <el-button type="danger" @click="disableUser()">封禁</el-button>
                </div>
            </div>

            <div style="text-align: center" v-show="disableShowForm.status == 2">
               <div style="display: flex;align-items: center;justify-content: center">
                   <div style="font-size: 20px">该用户已被</div>
                   <h2 style="color:#ff5151;">{{disableShowForm.disableAllTime === -1?'永久封禁':'封禁'+ disableShowForm.disableAllTime + '天'}}</h2>
               </div>
                <div style="display: flex;align-items: center;justify-content: center">
                    <div>封禁时间：</div>
                    <div>{{disableShowForm.disableStartTime}}</div>
                </div>
                <div style="display: flex;align-items: center;justify-content: center">
                    <div>预计解封时间：</div>
                    <div>{{disableShowForm.disableEndTime}}</div>
                </div>
                <div style="margin-top: 20px">
                    <el-button type="success" @click="enableUser()">解封</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "userManage",
        data(){
            /* 定义初始化变量 */
            return{
                showUserOptionVisiable:false,
                userList:[],
                pageNum:1,
                pageSize:4,
                total:0,
                deadTime:'',
                userId:'',
                options:[
                    {value:1,label:'1天'},
                    {value:7,label:'7天'},
                    {value:30,label:'30天'},
                    {value:365,label:'365天'},
                    {value:-1,label:'永久'}
                ],
                //用来存放用户数据
                disableShowForm:{}
            }
        },
        /* 定义事件函数 */
        methods:{
            //解封用户
            enableUser(){
                this.$http.get('/rst-user/user/updateUserStatus',{params:{
                        userId:this.userId,
                        status:1
                    }}).then(res=>{
                    if(res.data.code === 200){
                        this.$message.success('操作成功')
                        this.showUserOptionVisiable = false
                        this.queryAllUserList()
                    }else {
                        this.$message.error('操作失败')
                    }
                })
            },
            //封禁用户
            disableUser(){
                let disableUserForm = {
                    userId:this.userId,
                    allTime:this.deadTime,
                }
                this.$http.post('/rst-user/user/disableUser',disableUserForm).then(res=>{
                    if(res.data.code === 200){
                        this.$message.success('操作成功')
                        this.showUserOptionVisiable = false
                        this.queryAllUserList()
                    }else {
                        this.$message.error('操作失败')
                    }
                })
            },
            showUserOption(row){
                this.userId = row.id
                this.disableShowForm = {...row}
                this.showUserOptionVisiable = true
            },
            handleSizeChange(pageSize){
                this.pageSize = pageSize
                this.queryAllUserList()
            },
            handleCurrentChange(pageNum){
                this.pageNum = pageNum
                this.queryAllUserList()
            },
            queryAllUserList(){
                this.$http.get('/rst-user/user/getAllUserList',{params:{
                        pageNum:this.pageNum,
                        pageSize:this.pageSize
                    }}).then(res=>{
                    this.userList = res.data.data.rows
                    this.total = res.data.data.total
                })
            }
        },
        /* vue的生命周期函数
           当页面加载完毕就会执行created里面的函数
        */
        created() {
            this.queryAllUserList()
        }
    }
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>
    @import url("UserManage.css");
</style>