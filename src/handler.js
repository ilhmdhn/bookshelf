const { response } = require('@hapi/hapi/lib/validation');
const {nanoid} = require('nanoid');
const books = require('./book');

const addBookHandler = (request, h) =>{
    const {name, 
            year, 
            author, 
            summary, 
            publisher,
            pageCount,
            readPage,
            reading,} = request.payload;

            const id = nanoid(16);
            const insertedAt = new Date().toISOString();
            const updatedAt = insertedAt;
            let finished;
            if(pageCount === readPage){
                finished = true;
            } else{
                finished = false;
            }

            if(name == '' || name === undefined){
                const response = h.response({
                    status: "fail",
                    message : 'Gagal menambahkan buku. Mohon isi nama buku',
                });
                response.code(400);
                return response;
            }

            if(readPage > pageCount){
                const response = h.response({
                    status: "fail",
                    message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
                });
                response.code(400);
                return response;
            }

            const newBook ={
                id,
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading,
                insertedAt,
                updatedAt,
            };

            books.push(newBook);

            const insertSuccess = books.filter((book) => book.id === id).length>0;

            if(insertSuccess){
                const response = h.response ({
                    status: "success",
                    message: "Buku berhasil ditambahkan",
                    data: {
                        bookId: id
                    }
                });
                response.code(201);
                return response;
            }

            const response = h.response({
                    status: "error",
                    message: "Buku gagal ditambahkan"
            });
            response.code(500);
            return response;
};

const getAllBooksHandler = (request, h) =>{
    const filterBook= books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
        
      const response = h.response({
        status: 'Success',
        data:{
                books: filterBook
            }
        });
        response.code(200);        
        return response;
};

const getBookbyIdHandler = (request, h) =>{
    const {bookId} = request.params;
    const getBookId = books.filter((n) => n.id == bookId)[0];

    if(getBookId === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    const response = h.response({
        status: 'Success',
        data:{
            'book': getBookId
        }
    });
    response.code(200);
    return response;
}

const editBookHandler = (request, h) =>{
    const {bookId} = request.params;
    const {
        name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
    } = request.payload;

    const indexBook = books.findIndex((book) => book.id === bookId);
    if(indexBook === -1){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        });
        response.code(404);
        return response;
    }

    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    books[indexBook]={
        ...books[indexBook],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    };

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
    });
    response.code(200);
    return response;
};

const deleteBookHandler = (request, h) =>{
    const {bookId} = request.params;
    
    const indexBook = books.findIndex((book) => book.id === bookId);

    if(indexBook === -1){
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }); 
        response.code(404);
        return response;
    }

    books.splice(indexBook, 1);
    const response = h.response({
        status: 'Success',
        message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
}

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookbyIdHandler,
    editBookHandler,
    deleteBookHandler,
}