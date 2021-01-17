checkProducts = (req, res, next) => {
    if (!req.body.name || req.body.name.length == 0) {
        res.status(400).send({ message: "Failed! Product's Name is empty!" });
        return;
    }
    if (!req.body.price || req.body.price<=0 || req.body.price.length == 0) {
        res.status(400).send({ message: "Failed! Product's Price is invalid!" });
        return;
    }
    if(!req.body.id && (!req.file || !req.file.filename)){
        res.status(400).send({ message: "Failed! Product's File (image) is invalid!" });
        return;
    }   
    next();
}

const verifyProduct = {
    checkProducts
};

module.exports = verifyProduct;