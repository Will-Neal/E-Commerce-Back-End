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
  Tag.update(
    {
    tag_name: req.body.tag_name,
  },
  {
    where: {
      id: req.params.id
    }
  }) .then((updateTag) => {
    res.json("Successfully updated category...");
  }) .catch((err) => res.json(err));
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deleteTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    }); 
    res.json("Deleted tag...") 
  } catch(err) {
    res.send(err)
  }
});

module.exports = router;
