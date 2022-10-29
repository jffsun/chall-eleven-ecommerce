const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint
router.get('/', async (req, res) => {
  try {

    // Gets all products including its associated Category and Tag data
    const allProducts = await Product.findAll({

      include: [ Category , 
        {
           model: Tag,
          through: ProductTag, 
        }
      ],
   })

   // Return product data back to user
   return res.status(200).json(allProducts);

  // Handles errors
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// Get one product by its `id` value and its associated Category and Tag data
router.get('/:id', async (req, res) => {

  try {
    const oneProduct = await Product.findOne({ 

      // Find product in db with same id that user requests    
      where: {
        id: req.params.id,
      },
      include: [ Category , 
        {
           model: Tag,
          through: ProductTag, 
        }
      ],
    });

    // Return requested category back to user 
    return res.status(200).json(oneProduct);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// Create new product
router.post('/', async (req, res) => {

  try {

    // Create request body object
    const newProduct = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      tagIds: req.body.tagIds
    });
    
      // If there's product tags
      if (req.body.tagIds.length) {

        // Create array with each tag_id 
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: newProduct.id,
            tag_id,
          };
        });
        // Create pairings with array to bulk create in the ProductTag model
        ProductTag.bulkCreate(productTagIdArr);

        console.log(productTagIdArr);

        // // Return to user the product's ID and tag_ids
        res.status(200).json(productTagIdArr);
      } else {
      // If no product tags, just respond
      res.status(200).json(newProduct);
      };
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  };
});

// Update product
router.put('/:id', (req, res) => {
  try {

  // Update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((product) => {

    // Find all associated tags from ProductTag if updated product has tags
    if (req.body.tagIds && req.body.tagIds.length) {
    
      const productTags = ProductTag.findAll({ where: { product_id: req.params.id } });
  
      // Get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);

    // Create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

    // Figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // run both actions
    return Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
  }
  return res.json(product);
  })
  } catch(err) {
    console.log(err);
    res.status(400).json(err);
  };
});

// Delete one product by its `id` value
router.delete('/:id', async (req, res) => {

  try {

    const deletedProduct = await Product.destroy({
        where: {
            id: req.params.id,
        },
    });
    res.status(200).json({deletedProduct, message: `Deleted Product!` });

    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
});

module.exports = router;
