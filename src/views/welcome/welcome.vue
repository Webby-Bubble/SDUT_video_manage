<template>
    <div class="welcome">
        <div>
            <el-row :gutter="40">
                <el-col :span="6">
                    <div class="cardClass">
                        <div class="iconfont icon-fangwen icon" style="color: #4dc0cf;"></div>
                        <div class="cardRight">
                            <div>访问次数</div>
                            <div style="margin-top: 10px">{{visitCount}}</div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="cardClass">
                        <div class="iconfont icon-yonghushuliang icon" style="color: rgb(212 88 142);"></div>
                        <div class="cardRight">
                            <div>用户数量</div>
                            <div style="margin-top: 10px">{{userCount}}</div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="cardClass">
                        <div class="iconfont icon-ai239 icon" style="color: #5d9fda"></div>
                        <div class="cardRight">
                            <div>电影总数</div>
                            <div style="margin-top: 10px">{{videoCount}}</div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="cardClass">
                        <div class="iconfont icon-weishipin icon" style="color: #d59246"></div>
                        <div class="cardRight">
                            <div>短视频总数</div>
                            <div style="margin-top: 10px">{{shortVideoCount}}</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div id="main" style="height: 500px;width: 100%;margin-top: 40px;margin-left: -40px">

        </div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    export default {
        name: "welcome",
        data(){
            return{
                visitCount:0,
                userCount:0,
                videoCount:0,
                shortVideoCount:0
            }
        },
        methods:{
            getEcharts(){
                let chartDom = document.getElementById('main');
                let myChart = echarts.init(chartDom);
                let option;

                option = {
                    legend: {},
                    tooltip: {},
                    title: {
                        text: '近五天播放量排行前三的影视数据',
                        left:'40px'
                    },
                    dataset: {
                        source: [
                           /* ['product', '2015', '2016', '2017',''],*/
                            /*['Matcha Latte', 43.3, 85.8, 93.7],
                            ['Milk Tea', 83.1, 73.4, 55.1],
                            ['Cheese Cocoa', 86.4, 65.2, 82.5],
                            ['Walnut Brownie', 72.4, 53.9, 39.1]*/
                        ]
                    },
                    xAxis: { type: 'category' },
                    yAxis: {},
                    // Declare several bar series, each will be mapped
                    // to a column of dataset.source by default.
                    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
                };
                this.$http.get('/rst-video/manager/queryFiveDayPlayRank').then(res=>{

                    let nowList =[res.data.data.fiveTime[0]]
                    let before1 =[res.data.data.fiveTime[1]]
                    let before2 =[res.data.data.fiveTime[2]]
                    let before3 =[res.data.data.fiveTime[3]]
                    let before4 =[res.data.data.fiveTime[4]]
                    let product = ['product']
                    res.data.data.before0.forEach((count,index)=>{
                       nowList.push(count)
                    })
                    res.data.data.before1.forEach((count,index)=>{
                        before1.push(count)
                    })
                    res.data.data.before2.forEach((count,index)=>{
                        before2.push(count)
                    })
                    res.data.data.before3.forEach((count,index)=>{
                        before3.push(count)
                    })
                    res.data.data.before4.forEach((count,index)=>{
                        before4.push(count)
                    })
                    res.data.data.videoTitles.forEach(videoTitle=>{
                        product.push(videoTitle)
                    })
                    option.dataset.source.push(product)
                    option.dataset.source.push(before4)
                    option.dataset.source.push(before3)
                    option.dataset.source.push(before2)
                    option.dataset.source.push(before1)
                    option.dataset.source.push(nowList)

                    option && myChart.setOption(option);
                })



            },
            getAllVisitCount(){
                this.$http.get('/rst-video/manager/getAllVisitCount').then(res=>{
                    this.visitCount = res.data.data
                })
            },
            getAllUserCount(){
                this.$http.get('/rst-user/user/getAllUserCount').then(res=>{
                    this.userCount = res.data.data
                })
            },
            getAllVideoCount(){
                this.$http.get('/rst-video/video/getAllVideoCount').then(res=>{
                    this.videoCount = res.data.data
                })
            },
            getAllShortVideoCount(){
                this.$http.get('/rst-video/video/getAllShortVideoCount').then(res=>{
                    this.shortVideoCount = res.data.data
                })
            }
        },
        mounted() {
            this.getEcharts()
            this.getAllVisitCount()
            this.getAllUserCount()
            this.getAllVideoCount()
            this.getAllShortVideoCount()
        }

    }
</script>

<style scoped>
    @import url("welcome.css");
</style>