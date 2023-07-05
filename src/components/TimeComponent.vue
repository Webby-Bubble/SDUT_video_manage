<template>
    <div id="clock">
        <p class="date">{{ date }}</p>
        <p class="time">{{ time }}</p>
    </div>
</template>

<script>
    let week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

    export default {
        name: 'TimeComponent',
        data() {
            return {
                time: '',
                date:''
            }
        },

        methods: {
            updateTime() {
                let cd = new Date();
                this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2);
                this.date = this.zeroPadding(cd.getFullYear(), 4) + '-' + this.zeroPadding(cd.getMonth()+1, 2) + '-' + this.zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];
            },
            zeroPadding(num, digit) {
                var zero = '';
                for(var i = 0; i < digit; i++) {
                    zero += '0';
                }
                return (zero + num).slice(-digit);
            }

        },
        created() {
            setInterval(this.updateTime, 1000)
        }

    }
</script>

<style scoped>
    p {
        margin: 0;
        padding: 0;
    }

    #clock {
        font-family: 'Share Tech Mono', monospace;
        color: #ffffff;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 20%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        color: #daf6ff;
        text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
    }
    #clock .time {
        letter-spacing: 0.05em;
        font-size: 80px;
        padding: 5px 0;
    }
    #clock .date {
        letter-spacing: 0.1em;
        font-size: 24px;
    }
    #clock .name {
        letter-spacing: 0.1em;
        font-size: 12px;
        padding: 20px 0 0;
    }
</style>