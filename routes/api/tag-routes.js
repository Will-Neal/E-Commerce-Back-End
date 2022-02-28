const router = require('express').Router();
const res = require('express/lib/response')
const { Tag, Product, ProductTag} = require('../../models');

// The `/api/tags` endpoint //

//GETs all Tags and the products associated with them
router.get('/', async (req, res) => {
  try {
    const tag = await Tag.findAll({
      include: [{ model:Product }],
    });
    return res.json(tag)
  } catch(err) {
    console.log
  }
  
});

//GETs the tag given in the URL along with the products associated with that tag
router.get('/:id', async (req, res) => {
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

//POST route to create new tag by passing a json object with the property tag_name into the body
router.post('/', (req, res) => {
  Tag.create({
    tag_name: req.body.tag_name,
  })
    .then((newTag) => {
      res.json(newTag);
    })
    .catch((err) => {
      res.json(err);
    });
});

//PUT route to update the tag name defined by the parameter in the URL by passing a new value for the property tag_name into a JSON into the body
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

//DELETE the tag defined by the ID in the URL parameter.
router.delete('/:id', async (req, res) => {
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
