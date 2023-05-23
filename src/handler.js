const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
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

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((b) => b.id === id).length > 0;

  if (!isSuccess) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku.',
    });

    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });

  response.code(201);
  return response;
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  const filteredBooks = books.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher,
  }));

  if (name) {
    const bookByName = books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
    const bookByNameList = bookByName.map((b) => ({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books: bookByNameList,
      },
    });
    response.code(200);
    return response;
  }

  if (reading) {
    const read = reading === '1';
    const bookByRead = books.filter((b) => b.reading === read);
    const bookByReadList = bookByRead.map((b) => ({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books: bookByReadList,
      },
    });
    response.code(200);
    return response;
  }

  if (finished) {
    const finish = finished === '1';
    const finishedBook = books.filter((b) => b.finished === finish);
    const finishedBookList = finishedBook.map((b) => ({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books: finishedBookList,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });

  response.code(200);
  return response;
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
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

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((b) => b.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookById,
};
