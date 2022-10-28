SELECT product.id, product.product_name, product_tag.product_id
FROM product
INNER JOIN product_tag ON product_tag.product_id=product.id;