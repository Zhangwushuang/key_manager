/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const ChainsqlAPI = require('chainsql');
console.log("Chainsql ready!");

const regexes = require('./regexes.js');

exports.main = function (obj, process) {

    switch (obj.action) {

        //本地进行无须上链
        case "sign":
        case "generateAddress":
            local(obj, process);
            break;

        //简单请求
        case "pay":
        case "accountSet":
        case "trustSet":
        case "createTable":
        case "renameTable":
        case "dropTable":
        case "grant":
            obj.expect = { expect: 'validate_success' };
            simple(obj, process);
            break;

        //数据库简单请求
        case "insert":
        case "update":
        case "delete":
            obj.expect = { expect: 'validate_success' };
            simple(obj, process);
            break;

        //数据库事务
        case "Transaction":
            obj.expect = { expect: 'validate_success' };
            transaction(obj, process);
            break;

        //其他无法识别的请求
        default:
            var rt = {};
            rt.action = obj.action;
            rt.sta = "unknow";
            process.send(rt);
            break;

    }
}

//本地进行无需上链操作
function local(obj, process) {

    const chainsql = new ChainsqlAPI();
    var rt = {};
    rt.action = obj.action;
    rt.sta = "succ";

    switch (obj.action) {

        case "sign":
            rt.rst = chainsql.sign(obj.payload, obj.key.secret);
            break;

        case "generateAddress":
            rt.rst = chainsql.generateAddress();
            break;

        default:
            rt.sta = "unknow";

    }

    process.send(rt);

}

//简单请求
function simple(obj, process) {

    var rt = {};
    rt.action = obj.action;

    chain_connect(obj, rt, process, function (chainsql) {

        try { chainsql.use(obj.tableOwnerAddr); } catch (e) { console.log("no onwer!");}

        prepare_tran(obj, chainsql).submit(obj.expect).then((ret) => {

            process.send(ret_rt(rt, ret));

        }).catch(err => {

            process.send(err_rt(rt, err));

        });
    });
}

//数据库事务
function transaction(obj, process) {

    var rt = {};
    rt.action = obj.action;

    chain_connect(obj, rt, process, function (chainsql) {

        try { chainsql.use(obj.tableOwnerAddr); } catch (e) { console.log("no onwer!") }

        for (var i = 0; i < obj.payload.length; i++) {

            if (obj.payload[i].action === "insert" ||
                obj.payload[i].action === "update" ||
                obj.payload[i].action === "delete") {

                prepare_tran(obj.payload[i], chainsql);

            }

        }

        chainsql.commit(obj.expect).then((ret) => {

            process.send(ret_rt(rt, ret));

        }).catch(err => {

            process.send(err_rt(rt, err));

        });
    });

}

//准备交易，接下来直接submit
function prepare_tran(obj, chainsql) {

    switch (obj.action) {

        case "pay":
            return chainsql.pay(obj.payload.Destination, obj.payload.Amount);

        case "accountSet":
            return chainsql.accountSet(obj.payload);

        case "trustSet":
            return chainsql.trustSet(obj.payload);

        case "createTable":
            return chainsql.createTable(obj.payload.tableName, obj.payload.Raw, obj.payload.Opt);

        case "renameTable":
            return chainsql.renameTable(obj.payload.oldName, obj.payload.newName);

        case "dropTable":
            return chainsql.dropTable(obj.payload.tableName);

        case "grant":
            if (typeof (obj.payload.userPub) === "undefined" || !(obj.payload.userPub)) {

                return chainsql.grant(obj.payload.tableName, obj.payload.userAddr, obj.payload.Raw);

            } else {

                return chainsql.grant(obj.payload.tableName, obj.payload.userAddr, obj.payload.Raw, obj.payload.userPub);

            }
            
        case "insert":
            return chainsql.table(obj.payload.tableName).insert(obj.payload.Raw);

        case "update":
            return chainsql.table(obj.payload.tableName).get(obj.payload.Condition).update(obj.payload.Raw);

        case "delete":
            return chainsql.table(obj.payload.tableName).get(obj.payload.Condition).delete();

        default:
            return null;
    }
}

function chain_connect(qy_obj, rt_obj, process, cb) {

        var chainsql = new ChainsqlAPI();

        chainsql.connect(qy_obj.host, function (err, rest) {

            if (err) {

                rt_obj.sta = "Node Connect Error!";
                rt_obj.rst = err;
                process.send(rt_obj);
                return;

            }

            chainsql.as(qy_obj.key);

            cb(chainsql);

        });
    }

function err_rt(rt, err) {

    rt.sta = "Chain Error!";
    rt.rst = err;

    return rt;

}

function ret_rt(rt, ret) {

    rt.sta = "succ";
    rt.rst = ret;
    return rt;

}
