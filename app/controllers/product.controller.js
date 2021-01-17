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

exports.list = async (req, res) => {
  // pagination and filter
  // destructure page and limit and set default values
  const { search, page = 1, limit = 10 } = req.query;

  try {

    const filter = (!search || search.length == 0) ? {} :
      {
        name: new RegExp(`${search}`, 'i')

      }

    // get total documents in the Product collection 
    const count = await Product.countDocuments(filter);
    if (count == 0) {
      res.status(200).send({
        products: [],
        count: 0,
        totalPages: 1,
        currentPage: 1
      });
    } else {
      let pageAmount = (page > Math.ceil(count / limit)) ? Math.ceil(count / limit) : page;
      let skip = pageAmount > 0 ? (pageAmount - 1) * limit : 1

      //get Register
      const prods = await Product.find(filter)
        .limit(limit * 1)
        .skip(skip)
        .exec();



      let rets = prods.map((element) => {
        let ret = element
        if (ret.fileImage)
          ret.fileImage = imagesConf.url + ret.fileImage;
        return ret

      })

      // return response with Product, total pages, and current page
      res.status(200).send({
        products: rets,
        count: count,
        totalPages: Math.ceil(count / limit),
        currentPage: pageAmount
      });
    }
  } catch (err) {
    res.status(500).send({ message: err });

  }
};