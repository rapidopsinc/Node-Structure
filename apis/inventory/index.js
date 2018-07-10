/**
 * @Class InventoryController
 * @description class to manage apis.
 */
class InventoryController {
    constructor(app) {
        app.get('/api/inventory', this.listInventory);
        app.get('/api/inventory/:id', this.getInventory);
        app.post('/api/inventory', this.createInventory);
        app.put('/api/inventory/:id', this.updateInventory);
        app.delete('/api/inventory/:id', this.removeInventory);
    }

    listInventory(req, res) {
        console.log('List inventory.');
        global.MongoORM.Inventory.find().then((inventories) => {
            res.sendResponse(inventories);
        }).catch((error) => {
            res.sendError(error);
        })
    }

    getInventory(req, res) {
        console.log('Get inventory.');
        let id = req.params.id;
        global.MongoORM.Inventory.findOne({'_id': id}).then((inventoryObj) => {
            res.sendResponse(inventoryObj);
        }).catch((error) => {
            res.sendError(error);
        })
    }

    createInventory(req, res) {
        console.log('Create inventory');
        let sku = req.body.sku,
            skuId = req.body.skuId,
            inventoryLevel = req.body.inventory,
            productId = req.body.productId;

        let inventory = new global.MongoORM.Inventory();
        inventory.sku = sku;
        inventory.sku_id = skuId;
        inventory.inventory_level = inventoryLevel;
        inventory.product_id = productId;
        inventory.save().then((response) => {
            res.send(response);
        }).catch((error) => {
            console.log('error', error);
            res.send(error);
        })

    }

    updateInventory(req, res) {
        console.log('Update inventory.');
        let id = req.params.id;
        let updateObj = {
            "inventory_level": req.body.inventory
        };
        global.MongoORM.Inventory.update({"_id": id},
            {$set: updateObj}).then((response) => {
            res.send(response);
        }).catch((error) => {
            res.send(error);
        })
    }

    removeInventory(req, res) {
        console.log('Remove inventory.');
        let id = req.params.id;
        global.MongoORM.Inventory.remove({'_id': id}).then((response) => {
            res.sendResponse({'Message': 'Inventory removed successfully.', 'Response': response});
        }).catch((error) => {
            res.sendError(error);
        })
    }


}

module.exports = InventoryController;