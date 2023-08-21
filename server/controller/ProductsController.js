const { Op } = require("sequelize");
import config from "../config/config.js";
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.db_name,
    config.db_username,
    config.db_password,
    {
      logging : false,
      host: "localhost", 
      dialect : "postgres",
      pool : {
        max : 5,
        min : 0,
        acquire : 30000,
        idle : 10000,
      }
    }
);
    

const createProduct = async (req, res) => {
    const { files, fields } = req.fileAttrb;

    try {
        const result = await req.context.models.products.create({
            prod_name: fields[0].value,
            prod_price: fields[1].value,
            prod_desc: fields[2].value,
            prod_cate_id: fields[3].value,
            prod_image: files[0].file.originalFilename
        });

        return res.status(200).json({
            message: "Create Products",
            data: result    
        });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const allProducts = async (req, res) => {
    try {
        let limit = parseInt(req.query.record);
        let page = parseInt(req.query.page);
        let start = 0 + (page - 1) * limit;
        let end = page * limit;

        const result = await sequelize.query(
            `
                select * from products a
                inner join categories b on b.cate_id = a.prod_cate_id
            `,
            {
                replacements: { limit, start },
                type: Sequelize.QueryTypes.SELECT,          
            }
        );

        const countResult = await sequelize.query(
            `
                select count(*) as count from products
            `, 
            {
                type: sequelize.QueryTypes.SELECT
            }
        );

        const countFiltered = countResult[0].count;
    
        let pagination = {}
        pagination.totalRow = parseInt(countFiltered);
        pagination.totalPage = Math.ceil(countFiltered / limit)
        if (end < countFiltered) {
          pagination.next = {
            page: page + 1,
            limit: limit
          }
        }
    
        if (start > 0) {
          pagination.prev = {
            page: page - 1,
            limit: limit
          }
        }    

        return res.status(200).json({
            message: "Show All Products",
            data: result,
            pagination: pagination    
        })
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const searchProduct = async (req, res) => {
    const { search } = req.body;
    try {
        let limit = parseInt(req.query.record);
        let page = parseInt(req.query.page);
        let start = 0 + (page - 1) * limit;
        let end = page * limit;

        const result = await sequelize.query(
            `
                select * from products a
                inner join categories b on b.cate_id = a.prod_cate_id
                where lower(prod_name) like lower(:id) 
            `,
            {
                replacements: { limit, start, id: `%${search}%` },
                type: Sequelize.QueryTypes.SELECT,          
            }
        );

        const countResult = await sequelize.query(
            `
                select count(*) as count from products
            `, 
            {
                type: sequelize.QueryTypes.SELECT
            }
        );

        const countFiltered = countResult[0].count;
    
        let pagination = {}
        pagination.totalRow = parseInt(countFiltered);
        pagination.totalPage = Math.ceil(countFiltered / limit)
        if (end < countFiltered) {
          pagination.next = {
            page: page + 1,
            limit: limit
          }
        }
    
        if (start > 0) {
          pagination.prev = {
            page: page - 1,
            limit: limit
          }
        }    

        return res.status(200).json({
            message: "Search All Products",
            data: result,
            pagination: pagination    
        })
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const updateProducts = async (req, res) => {
    const { files, fields } = req.fileAttrb;

    try {
        const result = await req.context.models.products.update({
            prod_name: fields[0].value,
            prod_price: fields[1].value,
            prod_desc: fields[2].value,
            prod_cate_id: fields[3].value,
            prod_image: files[0].file.originalFilename
        },
        {
            returning: true,
            where: { prod_id: req.params.id }
        });

        return res.status(200).json({
            message: "Update With Image Products",
            data: result[1][0]    
        });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const updateProductsNoImage = async (req, res) => {
    const {
        prod_name,
        prod_price,
        prod_desc,
        prod_cate_id,
    } = req.body;

    try {
        const result = await req.context.models.products.update({
            prod_name: prod_name,
            prod_price: prod_price,
            prod_desc: prod_desc,
            prod_cate_id: prod_cate_id
        },
        {
            returning: true,
            where: { prod_id: req.params.id }
        });

        return res.status(200).json({
            message: "Update Without Image Products",
            data: result[1][0]    
        });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const deleteProducts = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await req.context.models.products.destroy({
            where: { prod_id: id }
        });

        return res.status(200).json({
            message: "Delete Product",
            data: result
        });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const categoriProducts = async (req, res) => {
    try {
        let limit = parseInt(req.query.record);
        let page = parseInt(req.query.page);
        let start = 0 + (page - 1) * limit;
        let end = page * limit;  

        const result = await req.context.models.products.findAll({
            where: { prod_cate_id: req.params.id },
            include: [
                {
                    model: req.context.models.categories,
                    as: "prod_cate",
                    attributes: ["cate_id", "cate_name"],
                },
            ],
            offset: start, limit: limit
        });

        const countResult = await req.context.models.products.findAndCountAll({

        });

        const countFiltered = countResult.count;

        let pagination = {}
        pagination.totalRow = parseInt(countFiltered);
        pagination.totalPage = Math.ceil(countFiltered / limit)
        if (end < countFiltered) {
          pagination.next = {
            page: page + 1,
            limit: limit
          }
        }
    
        if (start > 0) {
          pagination.prev = {
            page: page - 1,
            limit: limit
          }
        }    
    
        return res.status(200).json({
            message: "Categories Products",
            data: result,
            pagination: pagination
        });
        } catch (error) {
        return res.status(500).json({ // Changed status code to 500 for server errors
            message: error.message,
        });
        }
  };  

const detailProducts = async (req, res) => {
    try {
        const result = await req.context.models.products.findAll({
            where: { prod_id: req.params.id },
            attributes: [
                "prod_id",
                "prod_name",
                "prod_image",
                "prod_price",
                "prod_desc"
            ]
        });

        return res.status(200).json({
            message: "Detail Products",
            data: result
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

export default {
    createProduct,
    allProducts,
    searchProduct,
    updateProducts,
    updateProductsNoImage,
    deleteProducts,
    categoriProducts,
    detailProducts
}