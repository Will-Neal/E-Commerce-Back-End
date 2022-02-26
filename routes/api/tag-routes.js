const router = require('express').Router();
const res = require('express/lib/response')
const { Tag, Product, ProductTag} = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findAll({
      include: [{ model:Product }],
      attributes: ['product_name', 'price', 'stock', 'category_id']
    });
    return res.json(tag)
  } catch(err) {
    console.log
  }
  
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  const id = req.params.id
  try {
    const tag = await Tag.findOne({
      where: { id },
      include:[{ model:Product }]
    });
    return res.json(tag)
  } catch(err) {
    console.log
  }
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name,
  })
    .then((newTag) => {
      // Send the newly created row as a JSON object
      res.json(newTag);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
