export const ProductErrors = {
    Conflict: {
        statusCode: 409,
        message: 'Name already exists',
        error: "Conflict Error"
    },

    NotFound: {
        statusCode: 404,
        message: 'Product does not exists',
        error: "NotFound Error"
    },

    Unauthorized: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: "Unauthorized Error"
    },

    ProductNotFound: {
        statusCode: 404,
        message: 'Product does not exists',
        error: "NotFound Error"
    },

    ProductInventoryNotFound: {
        statusCode: 404,
        message: 'Product Inventory not yet created',
        error: "NotFound Error"
    },

    ProductInventoryConflict: {
        statusCode: 409,
        message: 'Product already created',
        error: "Conflict Error"
    },

    ProductInNotFound: {
        statusCode: 404,
        message: 'Product In does not exists',
        error: "NotFound Error"
    },

    ProductInyConflict: {
        statusCode: 409,
        message: 'Product already exists',
        error: "Conflict Error"
    },
}