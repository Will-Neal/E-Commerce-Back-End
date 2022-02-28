const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

//GET all products along with associated category and tag information
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll(
      {
        include:
          [{ model: Category }, { model: Tag }]
      }
    )
    return res.json(products)
  } catch (err) {
    res.send(err)
  }
});

//GET the product defined in the URL parameter along with its associate category and tag information
router.get('/:id', async (req, res) => {
  id = req.params.id;
  try {
    const product = await Product.findOne({
      where: { id },
      include: [{ model: Category }, { model: Tag }]
    })
    return res.json(product)
  } catch (err) {
    res.send(err)
  }
});

//POST request to create new product 
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product FOREIGN KEY CONSTRAINT
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

//DELETE the Product defined by the id given in the URL parameter. 
router.delete('/:id', async (req, res) => {
  try {
    const deleteProd = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json("Deleted product...")
  } catch (err) {
    res.send(err)
  }
});

module.exports = router;
