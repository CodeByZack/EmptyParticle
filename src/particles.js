
(function(window){
//工具类函数

function getRandom(min,max){
    min = parseInt(min);
    max = parseInt(max);
    if(min>max ) return console.log("getRandom error!");
    if(min == max) return Math.floor(min);
    return min+Math.floor(Math.random()*(max-min));
}

window.requestAnimFrame = (function() {
return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})(); 




//粒子对象
// id:0,                   // 粒子id
// aliveTime:1000,         // 粒子存活时间
// createTime:Date.now(),  // 粒子创建时间
// x:0,y:0,                // 粒子当前位置
// axisXSpeed:0,           // 粒子当前X轴速度
// axisYSpeed:0,           // 粒子当前Y轴速度
// accelerationX:0,        // x加速度
// accelerationY:0         // y加速度
function EmptyParticle(){
    this.id = -1;
    this.x = -1;
    this.y = -1;
    this.XSpeed = 0;
    this.YSeed = 0;
    this.XAcceleration = 0;
    this.YAcceleration = 0;
    this.aliveTime = 0;
    this.createTime = 0;
    this.status = 1;//0-不渲染 1-渲染
}

//粒子生成器
let FactoryId = 0;

let DeafultOption = {
    MAX_COUNT : 100,     
    XSpeedArea : [-5,5],
    YSpeedArea : [-5,5],
    XAccelerationArea : [-2,2],
    YAccelerationArea : [-2,2],
    EmmitterArea : {
        x0 : 0,
        y0 : 0,
        x1 : 0,
        y1 : 0
    },
    MaxArea : {
        x0 : 0,
        y0 : 0,
        x1 : 100,
        y1 : 100    
    },
    AliveTime : 1000,
}

function ParticlesFactory(option){

    // 合并对象至default
    for(var key in option){
        if(DeafultOption[key]){
            DeafultOption[key] = option[key];
        }
    }
    
    this._option = DeafultOption;
    this._id = FactoryId++;
    this._ActiveParticles = [],
    this._DeactiveParticles = [],
    this._Particles = []

    this.create();
}

ParticlesFactory.prototype = {
    constructor : ParticlesFactory,
    create : function(){
        for(let i = 0; i<this._option.MAX_COUNT;i++ ){
            let particle = new EmptyParticle();
            particle.id = i;
            
            particle.x = getRandom(this._option.EmmitterArea.x0,this._option.EmmitterArea.x1);
            particle.y = getRandom(this._option.EmmitterArea.y0,this._option.EmmitterArea.y1);
            
            particle.XSpeed = getRandom(this._option.XSpeedArea[0],this._option.XSpeedArea[1]);
            particle.YSpeed = getRandom(this._option.YSpeedArea[0],this._option.YSpeedArea[1]);
            
            particle.XAcceleration = getRandom(this._option.XAccelerationArea[0],this._option.XAccelerationArea[1]);
            particle.YAcceleration = getRandom(this._option.YAccelerationArea[0],this._option.YAccelerationArea[1]);
            
            particle.aliveTime = this._option.AliveTime;

            this._Particles.push(particle);
        }
    },
    emit : function(){

    },
    update : function(){
        for (let index = 0; index < this._Particles.length; index++) {
            let particle = this._Particles[index];

            if(particle.status == 1){
                particle.x = particle.x + particle.XSpeed*1+particle.XAcceleration*1*1/2;
                particle.y = particle.y + particle.YSpeed*1+particle.YAcceleration*1*1/2;
    
                if(particle.x < this._option.MaxArea.x0 || particle.x > this._option.MaxArea.x1){
                    particle.status = 0;
                }

                if(particle.y < this._option.MaxArea.y0 || particle.y > this._option.MaxArea.y1){
                    particle.status = 0;
                }
                particle.XSpeed = particle.XSpeed+particle.XAcceleration*1;
                particle.YSpeed = particle.YSpeed+particle.YAcceleration*1;    
                // console.log("更新后：",particle);
            }else{

            }

        }
    },
    stop : function(){

    },
    renderData : function(){
        return this._Particles;
    }
    
}


//渲染器
function CanvasRender(canvas){
    //需要一个画布
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
}

CanvasRender.prototype.render = function(data){
    
    //清除屏幕
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0,0,this.w,this.h);

    //画粒子
    for (let index = 0; index < data.length; index++) {
        let particle = data[index];
        this.ctx.fillStyle = "yellow";
        this.ctx.fillRect(particle.x,particle.y,2,2);
    }
}

//粒子系统命名空间

EPS = function(){
    this.factories = [];
    this.nowRender = null;
} 

EPS.prototype = {
    constructor:EPS,
    loop:function(){
        //检查设置了渲染器没
        if(!this.nowRender){
            console.log("请设置渲染器！");
            return;
        }
        //检查设置了粒子产生器没
        if(this.factories.length == 0){
            console.log("你没有添加粒子工厂.....");
            return;
        }
        for (let index = 0; index < this.factories.length; index++) {
            
            this.nowRender.render(this.factories[index].renderData());


            this.factories[index].update();
        }
        window.requestAnimFrame(this.loop.bind(this));
    },
    addFactory : function(factory){
        this.factories.push(factory);
    },
    setRender : function(render){
        this.nowRender = render;
    },
    factory : ParticlesFactory,
    particle : EmptyParticle,
    render : CanvasRender
}

let instance = new EPS();

//挂载到全局变量上
window.EPS = instance;

})(window)













