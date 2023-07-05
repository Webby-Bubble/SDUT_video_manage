<template>
    <div class="videoTalke">
        <div class="queryDiv">
            <el-input size="small" v-model="queryForm.videoTitle" class="queryTitle" placeholder="请输入影视名称"  prefix-icon="el-icon-search"></el-input>
            <el-input style="margin-left: 20px" size="small" v-model="queryForm.userName" class="queryTitle" placeholder="请输入评论人姓名"  prefix-icon="el-icon-search"></el-input>
            <el-button size="small" type="primary" class="queryButton" @click="getAllTalkeAndReplyList()">查询</el-button>
        </div>

        <el-table
                :data="videoTalkeList"
                border
                style="width: 100%">
            <el-table-column
                    prop="videoTitle"
                    label="影视标题"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="评论者"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="publishTime"
                    label="评论时间">
            </el-table-column>
            <el-table-column
                    prop="talkeContent"
                    label="评论内容">
            </el-table-column>
            <el-table-column
                    label="回复内容">
                <template slot-scope="scope">
                  <el-button
                          :style="scope.row.videoReplyList.length === 0?'color:#f19eac':''" type="text"
                            @click="showTableDialog(scope.row)">
                      {{scope.row.videoReplyList.length === 0?'暂无回复':scope.row.videoReplyList.length + '条回复'}}

                  </el-button>
                </template>
            </el-table-column>
            <el-table-column
                    min-width="120px"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="showVideoEdit(scope.row)" icon="el-icon-edit" size="small">编辑</el-button>
                    <el-button @click="handleClick(scope.row)" icon="el-icon-delete" type="text" size="small" style="color: orangered">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                style="margin-bottom: 30px;margin-top: 40px"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[4, 6, 8, 12]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <!--回复的列表弹窗-->
        <el-dialog title="影评回复内容" :visible.sync="tableReplyVisible">
            <el-table :data="tableReplyList">
                <el-table-column property="replyUserName" label="回复人" width="150"></el-table-column>
                <el-table-column property="rname" label="被回复人" width="200"></el-table-column>
                <el-table-column property="replyContent" label="回复内容"></el-table-column>
                <el-table-column
                        min-width="120px"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" icon="el-icon-delete" type="text" size="small" style="color: orangered">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "VideoTalke",
        data(){
            return{
                tableReplyVisible:false,//点击回复内容的弹窗属性
                videoTalkeList:[],
                tableReplyList:[],
                queryForm:{
                    videoTitle:'',
                    userName:''
                },
                pageNum:1,
                pageSize:4,
                total:0,
            }
        },
        methods:{
            showTableDialog(row){
                this.tableReplyList = row.videoReplyList
                this.tableReplyVisible = true
            },
            handleSizeChange(pageSize){
                this.pageSize = pageSize
                this.getAllTalkeAndReplyList()
            },
            handleCurrentChange(pageNum){
                this.pageNum = pageNum
                this.getAllTalkeAndReplyList()
            },
            getAllTalkeAndReplyList(){
                this.$http.get("/rst-video/manager/selectAllTalkeAndReply",{params:{
                        pageNum:this.pageNum,
                        pageSize:this.pageSize,
                        userName:this.queryForm.userName,
                        videoTitle:this.queryForm.videoTitle
                    }}).then(res=>{
                    this.videoTalkeList = res.data.data.rows
                    this.pageNum = res.data.data.pageNum
                    this.total = res.data.data.total
                })
            }
        },
        mounted() {
            this.getAllTalkeAndReplyList()
        }

    }
</script>

<style scoped>
    @import url("VideoTalke.css");
</style>