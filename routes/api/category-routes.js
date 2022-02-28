const router = require('express').Router();
const res = require('express/lib/response');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

//GET all categories and associated products
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    return res.json(categories)
  } catch (err) {
    console.log(err)
    res.json(err)
  }
});

//GET the specific category given by the URL parameter as well as the product associated with it
router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const category = await Category.findOne({
      where: { id },
      include: [{ model: Product }]
    })
    return res.json(category)
  } catch (err) {
    console.log(err)
  }
});

//POST request to create a category with the value given by the category name in the JSON of the request body
router.post('/', (req, res) => {
  console.log(req.body)
  Category.create({
    category_name: req.body.category_name,
  })
    .then((newBook) => {
      res.json(newBook);
    })
    .catch((err) => {
      res.json(err);
    });
})


//UPDATE the name of the specific category defined by the ID in the URL parameter with the value given by category_name in the JSON of the request body
router.put('/:id', (req, res) => {
  Category.update({
    category_name: req.body.category_name,
  },
    {
      where: {
        id: req.params.id
      }
    }).then((updateCategory) => {
      res.json("Successfully updated category...")
    }).catch((err) => res.json(err));
});

//DELETE category defined by the ID given in the URL parameter
router.delete('/:id', async (req, res) => {
  try {
    const deleteCat = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json("Category deleted...")
  } catch (err) {
    res.send(err)
  }

});

module.exports = router;
