const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
router.get('/', async (req, res) => {
  try {

    // Find all categories and its associated Products
   const allCategories = await Category.findAll({

     include: { model: Product },
   })

   // Return category data back to user
   return res.status(200).json(allCategories);

  // Handle error catching
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// Find one category by its `id` value and its associated Products
router.get('/:id', async (req, res) => {

  try {
    const oneCategory = await 
    Category.findOne({ 

      // Find category in db with same id that user requests
      where: req.body.id,
      include: { model: Product },
    });

    // Return requested category back to user 
    return res.status(200).json(oneCategory);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// Creates a new category
router.post('/', async (req, res) => {
  try {
  
    const newCategory = await Category.create({
      category_name: req.body.category_name,
  });
  
  // Confirm to user that category was created
  res.status(200).json({newCategory, message : `Created Category!`})

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// Update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    console.log('PUT REQUEST')
    const updatedCategory = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        // Category ID is specified in route parameter in URL
        where: {
          id: req.params.id,
        } 
      }
  );
  
  // Confirm to user that category was updated
  res.status(200).json({updatedCategory, message : `Updated Category!`})

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };

});

// Delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {

    const deletedCategory = await Category.destroy({
        where: {
            id: req.params.id,
        },
    });
    res.status(200).json({deletedCategory, message: `Deleted Category!` });

    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
});

module.exports = router;