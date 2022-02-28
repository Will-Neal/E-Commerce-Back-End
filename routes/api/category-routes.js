const router = require('express').Router();
const res = require('express/lib/response');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    }); 
    return res.json(categories)
  } catch(err){
    console.log(err)
    res.json(err)
  }
  // find all categories

  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const category = await Category.findOne({ 
      where: { id },
      include: [{ model:Product }]
    })
    return res.json(category)
  } catch(err) {
    console.log(err)
  }
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', (req, res) => {
  console.log(req.body)
  Category.create({
    category_name: req.body.category_name,
  })
    .then((newBook) => {
      // Send the newly created row as a JSON object
      res.json(newBook);
    })
    .catch((err) => {
      res.json(err);
    });
})


//UPDATE CATEGORY BY ID
router.put('/:id', (req, res) => {
  Category.update({
    category_name: req.body.category_name,
  },
  {
    where: {
      id: req.params.id
    }
  }) .then((updateCategory) => {
    res.json("Successfully updated category...")
  }) .catch((err) => res.json(err));
});

//Only deletes Categories that Have NO products associated with them
router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deleteCat = await Category.destroy({
      where: {
        id: req.params.id,
      },
    }); 
    res.json("Category deleted...") 
  } catch(err) {
    res.send(err)
  }
  
});

module.exports = router;
