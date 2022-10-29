const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
router.get('/', async (req, res) => {
  try {

    // Find all tags and its associated Product data
   const allTags = await Tag.findAll({
     include: {
        model: Product,
        through: ProductTag,
      },
   });

   // Return tag data back to user
   return res.status(200).json(allTags);

  // Handle error catching
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// Find a single tag by its `id` along its its associated Product data
router.get('/:id', async (req, res) => {
  try {
    const oneTag = await Tag.findOne({ 

      // Find product in db with same id that user requests    
      where: {
        id: req.params.id,
      },
      include: 
        {
           model: Product,
          through: ProductTag, 
        },
    });

    // Return requested category back to user 
    return res.status(200).json(oneTag);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// Create a new tag
router.post('/', async (req, res) => {
  try {

    // Create request body object
    const newTag = await Tag.create({
      tag_name: req.body.tag_name,
    });
    
      res.status(200).json(newTag);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  };
});

// Update a tag's name by its `id` value\
router.put('/:id', async (req, res) => {

  try {
    const updatedTag = await Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        // Tag ID is specified in route parameter in URL
        where: {
          id: req.params.id,
        } 
      }
  );
  
  // Confirm to user that category was updated
  res.status(200).json({updatedTag, message : `Updated Tag!`})

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// Delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {

    const deletedTag = await Tag.destroy({
        where: {
            id: req.params.id,
        },
    });
    res.status(200).json({deletedTag, message: `Deleted Tag!` });

    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
});

module.exports = router;