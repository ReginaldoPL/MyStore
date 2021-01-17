var fs = require('fs');
const imagesConf = require("../config/images.config");
const db = require("../models");
const Product = db.product;
exports.store = (req, res) => {


  const fileImage = req.file && req.file.filename ? req.file.filename : undefined;
  let item = {
    name: req.body.name,
    price: req.body.price,
    fileImage: fileImage
  }

  const product = new Product(item);

  product.save((err, product) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    let ret = product
    if (ret.fileImage)
      ret.fileImage = imagesConf.url + ret.fileImage;
    res.status(200).send({ "product": ret });

  });
};

exports.update = (req, res) => {

  const productId = req.body.id

  const fileImage = req.file && req.file.filename ? req.file.filename : undefined;

  Product.findById(productId)
    .then((product) => {
      if (fileImage) {
        const filePath = appRoot + '/uploads/' + product.fileImage;
        try {
          fs.unlinkSync(filePath)
        } catch (err) {
          console.error('filePath ', err)
        }
      }

      product.name = req.body.name;
      product.price = req.body.price;
      product.fileImage = fileImage;

      product.save((err, product) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        let ret = product
        if (ret.fileImage)
          ret.fileImage = imagesConf.url + ret.fileImage;
        res.status(200).send({ "product": ret });
      });
    }).catch((err) => {
      res.status(500).send({ message: err });
    });


};


exports.get = (req, res) => {

  const productId = req.params.id;

  Product.findById(productId)
    .then((product) => {
      let ret = product
      if (ret.fileImage)
        ret.fileImage = imagesConf.url + ret.fileImage;
      res.status(200).send({ "product": ret });
    }).catch((err) => {
      res.status(500).send({ message: err });
    });

};






exports.delete = (req, res) => {

  const productId = req.params.id;

  //precisa localizar a imagens pra poder apagar
  Product.findByIdAndDelete(productId)
    .then((ret) => {

      if (fileImage) {
        const filePath = appRoot + '/uploads/' + product.fileImage;
        try {
          fs.unlinkSync(filePath)
        } catch (err) {
          console.error('filePath ', err)
        }
      }
      res.status(200).send("Excluído com sucesso");
      //excluir a imagem aqui
    }).catch((err) => {
      res.status(500).send({ message: err });
    });


};

exports.list = (req, res) => {
  // pagination and filter
};