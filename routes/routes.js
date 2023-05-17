var express = require('express');
var router = express.Router();

const invFun = require('../controllers/inventario');
const venFun = require('../controllers/ventas');
const useFun = require("../controllers/usuarios");
const admFun = require('../controllers/administrar');
const midFun = require("../middleware/middleware")

router.post("/createdAdminInit",useFun.createdAdminInit);
router.post("/createdUse",midFun.verifyUser,useFun.createdUse);
router.post("/updateUser",midFun.verifyUser,useFun.updateUser);
router.post('/updatePasword',midFun.verifyUser,useFun.updatePasword);
router.post('/loginUser',[],useFun.loginUser);
router.post('/readUsers',midFun.verifyUser,useFun.readUsers);
router.post('/deleteUser',midFun.verifyUser,useFun.deleteUser);

router.post("/createdItem", midFun.verifyAdmin, invFun.createdItem);
router.post("/updateItem",midFun.verifyAdminAlma, invFun.updateItem);
router.post("/deleteItem",midFun.verifyAdminAlma, invFun.deleteItem);
router.post("/itemCantMenos",midFun.verifyAdminAlma, invFun.itemCantMenos);
router.post("/itemCantMas",midFun.verifyAdminAlma, invFun.itemCantMas);
router.post("/readInventario",midFun.verifyUser, invFun.readInventario);
router.get("/listaIdsInventario",midFun.verifyUser, invFun.listaIdsInventario);

router.post("/createdVenta",midFun.verifyUser,venFun.createdVenta);
router.post("/updateVenta",midFun.verifyUser, venFun.updateVenta);
router.post("/deleteVenta",midFun.verifyUser,venFun.deleteVenta);
router.post("/readVentas",midFun.verifyUser,venFun.readVentas);
router.post("/readIDSventas",midFun.verifyUser,venFun.readIDSventas);
router.post("/readVentasUserTime",midFun.verifyUser, venFun.readVentasUserTime);
/** 
router.post("/read_venta_id",verifyToken, read_venta_id);
router.post("/del_ventaMarc",servicio,verifyToken, del_ventaMarc);
router.post("/read_ventas_user", read_ventas_user);
*/

router.get("/sizeDB",midFun.verifyUser, admFun.sizeDB);
router.post("/readNumNota",midFun.verifyAdmin, admFun.readNumNota);
router.post("/writeNumNota",midFun.verifyAdmin, admFun.writeNumNota);

module.exports = router;