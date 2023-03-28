var express = require('express');
var router = express.Router();
const crypto = require('crypto');

/*-++-++++=-++---+-=-++++---=-++++--+=-++++-+-=--+-+++-=-++---++=-++-++++=-++-++-+*/
router.get('/', (req, res, next)=>{
    res.render('optimize', {
        title: 'Optimize DEMO'
    });
});
/*-++-++++=-++---+-=-++++---=-++++--+=-++++-+-=--+-+++-=-++---++=-++-++++=-++-++-+*/
const optimize_expId="4_MwALBYTKaaSPDBsALAqg"; //实验ID
const optimize_expVarNum=4;                    //实验变体数量
var optimize_expVar;                           //实验变体ID

/*-++-++++=-++---+-=-++++---=-++++--+=-++++-+-=--+-+++-=-++---++=-++-++++=-++-++-+*/
// 后端分配变体ID，后端返回不同版本页面
router.get('/be', (req, res, next)=>{
    var gacid=req.cookies["_ga"];             
    var cookieName="gOpt_expVar_"+optimize_expId;
    if(req.cookies[cookieName]){
        optimize_expVar=req.cookies[cookieName];
    }else if(typeof gacid=="string"){
        optimize_expVar=hash(gacid.split('.').slice(-2).join("."),optimize_expVarNum);  //从特定用户识别符哈希生成变体ID
    }else{
        optimize_expVar=Math.floor(Math.random() * optimize_expVarNum);  //随机生成变体ID并存储到cookie
        res.cookie(cookieName, optimize_expVar, { maxAge: 63072E3});
    };
    /*-++-++++=-++---+-=-++++---=-++++--+=-++++-+-=--+-+++-=-++---++=-++-++++=-++-++-+*/
    res.render('optimize/expBE', {
        title: 'Optimize Server-side Experiments Demo',
        optimize_expId: optimize_expId,
        optimize_expVar: optimize_expVar,
        expTitle: "be optimize variation "+optimize_expVar,
    });
});
/*-++-++++=-++---+-=-++++---=-++++--+=-++++-+-=--+-+++-=-++---++=-++-++++=-++-++-+*/
// 权重测试
router.get('/dw/', (req, res, next)=>{
    var optimize_expId="RUuY8JlkQ8GSoZkcGEg5Rg";
    var optimize_expVarNum=2;
    var optimize_expVar;
    var cookieName="gOpt_expVar_"+optimize_expId;
    if(req.cookies[cookieName]){
        optimize_expVar=req.cookies[cookieName]
    }else{
        optimize_expVar=Math.floor(Math.random() * optimize_expVarNum);
        res.cookie(cookieName, optimize_expVar, { maxAge: 24*60*60*365*2});
    };
    res.render('optimize/expDW', {
        title: 'Optimize Server-side Experiments Demo: BE',
        optimize_expId: optimize_expId,
        optimize_expVar: optimize_expVar,
        expTitle: "dw optimize variation "+optimize_expVar,
    });
});




/*-++-++++=-++---+-=-++++---=-++++--+=-++++-+-=--+-+++-=-++---++=-++-++++=-++-++-+*/
/*-++-++++=-++---+-=-++++---=-++++--+=-++++-+-=--+-+++-=-++---++=-++-++++=-++-++-+*/
// 前端分配变体ID，发送携带变体ID的请求给后端
router.get('/fe', (req, res, next)=>{
    res.render('optimize/expFE', {
        title: 'Optimize Server-side Experiments Demo: FE',
    });
});
/*-++-++++=-++---+-=-++++---=-++++--+=-++++-+-=--+-+++-=-++---++=-++-++++=-++-++-+*/
// 后端根据前端请求中的变体ID返回不同版本页面
router.post('/var/',function(req, res, next){
    if(req.body.var){
        res.json("fe optimize variation "+req.body.var);
    }else{
        res.json("fe optimize variation undefined");
    };
});




/*-++-++++=-++---+-=-++++---=-++++--+=-++++-+-=--+-+++-=-++---++=-++-++++=-++-++-+*/
/*-++-++++=-++---+-=-++++---=-++++--+=-++++-+-=--+-+++-=-++---++=-++-++++=-++-++-+*/
function hash(str,max) {
    let hash = crypto.createHash('md5').update(str).digest('hex');
    return parseInt(hash.substring(0, 1), 16) % max;
}
// function hash(str,max) {
//     var hash = 0;
//     for (var i = 0; i < str.length; i++) {
//         hash += str.charCodeAt(i);
//     }
//     return hash % max;
// }


module.exports = router;