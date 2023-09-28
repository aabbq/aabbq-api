export const ProductCategoryErrors = {
    Conflict: {
        statusCode: 409,
        message: 'Name already exists',
        error: "Conflict Error"
    },

    NotFound: {
        statusCode: 404,
        message: 'Product Category does not exists',
        error: "NotFound Error"
    },

    Unauthorized: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: "Unauthorized Error"
    },

    ProductCategoryNotFound: {
        statusCode: 404,
        message: 'Product Category does not exists',
        error: "NotFound Error"
    },

}