var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true }));
var listID = [];
var listMenu = [];
var listHarga = [];
var listJumlah = [];
var listStatus = [];
var latestID = 0;
app.listen(3002, function () {
    console.info("Server started on port 3002");
});
app.post('/transactions', function (req, res) {
    if (typeof req.body.menu === 'number') {
        res.status(400);
        res.send("Parameter Menu is not a string");
        return;
    }
    if (req.body.menu == undefined) {
        res.status(400);
        res.send("Parameters not complete");
        return;
    }
    if (typeof Number(req.body.harga) === 'string') {
        res.status(400);
        res.send("Parameter Harga is not a number");
        return;
    }
    if (req.body.harga == undefined) {
        res.status(400);
        res.send("Parameters not complete");
        return;
    }
    if (typeof Number(req.body.jumlah) === 'string') {
        res.status(400);
        res.send("Parameter Jumlah is not a number");
        return;
    }
    if (req.body.jumlah == undefined) {
        res.status(400);
        res.send("Parameters not complete");
        return;
    }
    listMenu.push(req.body.menu);
    listJumlah.push(req.body.jumlah);
    listHarga.push(req.body.harga);
    listStatus.push(false);
    listID.push(latestID);
    latestID = latestID + 1;
    res.send("success create");
});
app.get('/transactions', function (req, res) {
    var result = [];
    for (var i = 0; i < listMenu.length; i++) {
        var item = {
            id: listID[i],
            menu: listMenu[i],
            harga: listHarga[i],
            jumlah: listJumlah[i],
            status: listStatus[i],
        };
        result.push(item);
    }
    res.send(result);
});
app.get('/transactions/:id', function (req, res) {
    var id = Number(req.params.id);
    if (id >= latestID) {
        res.status(400);
        res.send("Parameter is not registered");
        return;
    }
    if (id < 0) {
        res.status(400);
        res.send("Parameter is not registered");
        return;
    }
    var result;
    for (var i = 0; i < listID.length; i++) {
        if (listID[i] === id) {
            result = {
                id: listID[i],
                menu: listMenu[i],
                jumlah: listJumlah[i],
                harga: listHarga[i],
                status: listStatus[i],
            };
        }
    }
    res.send(result);
});
app.delete('/transactions/:id', function (req, res) {
    var idToDelete = Number(req.params.id);
    if (idToDelete >= latestID) {
        res.status(400);
        res.send("Parameter is not registered");
        return;
    }
    if (idToDelete < 0) {
        res.status(400);
        res.send("Parameter is not registered");
        return;
    }
    var newListHarga = [];
    var newListMenu = [];
    var newListJumlah = [];
    var newListID = [];
    var newListStatus = [];
    var found = false;
    for (var i = 0; i < listID.length; i++) {
        if (listID[i] !== idToDelete) {
            newListID.push(listID[i]);
            newListMenu.push(listMenu[i]);
            newListHarga.push(listHarga[i]);
            newListJumlah.push(listJumlah[i]);
            newListStatus.push(listStatus[i]);
        }
        else {
            found = true;
        }
    }
    if (!found) {
        res.status(400);
        res.send("Parameter is not registered");
        return;
    }
    listID.length = 0;
    listHarga.length = 0;
    listJumlah.length = 0;
    listMenu.length = 0;
    listStatus.length = 0;
    listID.push.apply(listID, newListID);
    listHarga.push.apply(listHarga, newListHarga);
    listJumlah.push.apply(listJumlah, newListJumlah);
    listMenu.push.apply(listMenu, newListMenu);
    listStatus.push.apply(listStatus, newListStatus);
    res.send("success delete");
});
app.put('/transactions/:id', function (req, res) {
    var idToUpdate = Number(req.params.id);
    var found = false;
    if (idToUpdate >= latestID) {
        res.status(400);
        res.send("Parameter is not registered");
        return;
    }
    if (idToUpdate < 0) {
        res.status(400);
        res.send("Parameter is not registered");
        return;
    }
    for (var i = 0; i < listID.length; i++) {
        if (listID[i] === idToUpdate) {
            listHarga[i] = req.body.harga;
            listMenu[i] = req.body.menu;
            listJumlah[i] = req.body.jumlah;
            found = true;
        }
    }
    if (!found) {
        res.status(400);
        res.send("Parameter is not registered");
        return;
    }
    res.send("success update");
});
app.patch('/transactions/:id', function (req, res) {
    var idToUpdate = Number(req.params.id);
    var found = false;
    for (var i = 0; i < listID.length; i++) {
        if (listID[i] === idToUpdate) {
            listStatus[i] = true;
            found = true;
        }
    }
    if (!found) {
        res.status(400);
        res.send("Parameter is not registered");
        return;
    }
    res.send("success update");
});
