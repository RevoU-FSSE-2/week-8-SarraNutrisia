const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

interface TransactionItem {
    id: number;
    menu: string;
    harga: number;
    jumlah: number;
    status: boolean;
}

const listID: number[] = [];
const listMenu: string[] = [];
const listHarga: number[] = [];
const listJumlah: number[] = [];
const listStatus: boolean[] = [];
let latestID: number = 0;

app.listen(3002, () => {
    console.info("Server started on port 3002");
});

app.post('/transactions', (req, res) => {
    if (typeof req.body.menu === 'number') {
        res.status(400);
        res.send("Parameter Menu is not a string");
        return
}
    if(req.body.menu == undefined) {
        res.status(400);
        res.send("Parameters not complete");
        return
    }

    if (typeof Number(req.body.harga) === 'string') {
        res.status(400);
        res.send("Parameter Harga is not a number");
        return
    }

    if(req.body.harga == undefined) {
        res.status(400);
        res.send("Parameters not complete");
        return     
    }
    if (typeof Number(req.body.jumlah) === 'string') {
        res.status(400);
        res.send("Parameter Jumlah is not a number");
        return
    }
    if(req.body.jumlah == undefined) {
        res.status(400);
        res.send("Parameters not complete");
        return
    }
    listMenu.push(req.body.menu);
    listJumlah.push(req.body.jumlah);
    listHarga.push(req.body.harga);
    listStatus.push(false);
    listID.push(latestID);
    latestID = latestID + 1;
    res.send("success create");
});

app.get('/transactions', (req, res) => {
    const result: TransactionItem[] = [];
    for (let i = 0; i < listMenu.length; i++) {
        const item: TransactionItem = {
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

app.get('/transactions/:id', (req, res) => {
    const id: number = Number(req.params.id);
    if(id>=latestID){
        res.status(400);
        res.send("Parameter is not registered");
        return
    }
    if(id<0){
        res.status(400);
        res.send("Parameter is not registered");
        return
    }
    let result: TransactionItem | undefined;
    for (let i = 0; i < listID.length; i++) {
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

app.delete('/transactions/:id', (req, res) => {
    const idToDelete: number = Number(req.params.id);
    if(idToDelete>=latestID){
        res.status(400);
        res.send("Parameter is not registered");
        return
    }
    if(idToDelete<0){
        res.status(400);
        res.send("Parameter is not registered");
        return
    }
    const newListHarga: number[] = [];
    const newListMenu: string[] = [];
    const newListJumlah: number[] = [];
    const newListID: number[] = [];
    const newListStatus: boolean[] = [];
    let found: boolean = false;

    for (let i = 0; i < listID.length; i++) {
        if (listID[i] !== idToDelete) {
            newListID.push(listID[i]);
            newListMenu.push(listMenu[i]);
            newListHarga.push(listHarga[i]);
            newListJumlah.push(listJumlah[i]);
            newListStatus.push(listStatus[i]);
        } else {
            found = true;
        }
    }

    if(!found){
        res.status(400);
        res.send("Parameter is not registered");
        return
    }

    listID.length = 0;
    listHarga.length = 0;
    listJumlah.length = 0;
    listMenu.length = 0;
    listStatus.length = 0;

    listID.push(...newListID);
    listHarga.push(...newListHarga);
    listJumlah.push(...newListJumlah);
    listMenu.push(...newListMenu);
    listStatus.push(...newListStatus);

    res.send("success delete");
});

app.put('/transactions/:id', (req, res) => {
    const idToUpdate: number = Number(req.params.id);
    let found: boolean = false;
    if(idToUpdate>=latestID){
        res.status(400);
        res.send("Parameter is not registered");
        return
    }
    if(idToUpdate<0){
        res.status(400);
        res.send("Parameter is not registered");
        return
    }

    for (let i = 0; i < listID.length; i++) {
        if (listID[i] === idToUpdate) {
            listHarga[i] = req.body.harga;
            listMenu[i] = req.body.menu;
            listJumlah[i] = req.body.jumlah;
            found = true
        } 
    }

    if(!found){
        res.status(400);
        res.send("Parameter is not registered");
        return
    }
    res.send("success update");
});

app.patch('/transactions/:id', (req, res) => {
    const idToUpdate: number = Number(req.params.id);
    let found: boolean = false;

    for (let i = 0; i < listID.length; i++) {
        if (listID[i] === idToUpdate) {
            listStatus[i] = true;
            found = true;
        }
    }

    if(!found){
        res.status(400);
        res.send("Parameter is not registered");
        return
    }
    res.send("success update");
});