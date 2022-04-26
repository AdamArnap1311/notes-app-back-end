const { nanoid } = require('nanoid');
const notes = require('./notes');

//fungsi untuk menambahkan catatan
const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
      };
      notes.push(newNote);

      const isSuccess = notes.filter((note) => note.id === id).length > 0;

      if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Catatan berhasil ditambahkan',
          data: {
            noteId: id,
          },
        });
        response.code(201);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
      });
      response.code(500);
      return response;
};



//fungsi untuk menampilkan catatan

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
      notes,
    },
  });

//fungsi untuk menampilkan detail catatan sesuai id
const getNoteByIdHandler = (request, h) => {
    const { id } = request.params; //mendapatkan nilai id dari request.params

    const note = notes.filter((n) => n.id === id)[0]; //mendapatkan objek note dengan id tersebut dari objek array notes dengan memanfaatkan method array filter() untuk mendapatkan objeknya.

    //pengembalian fungsi handler dengan data berserta objek note didalamnya. Namun sebelum itu, pastikan dulu objek note tidak bernilai undefined. Bila undefined, kembalikan dengan respons gagal.

    if (note !== undefined) {
        return {
          status: 'success',
          data: {
            note,
          },
        };
      }
      const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      });
      response.code(404);
      return response;

    };

//fungsi untuuk PUT / Mengedit catatan sesuai id
const editNoteByIdHandler = (request, h) => {
    const { id } = request.params; //pengambilan id dengan request.params

    const { title, tags, body } = request.payload; //proses pendapatan data notes terbaru yang dikirimkan olehclient melalui body request
    const updatedAt = new Date().toISOString(); //perbarui juga nilai dari properti updatedAt. Jadi, dapatkan nilai terbaru dengan menggunakan new Date().toISOString().

    const index = notes.findIndex((note) => note.id === id); //pendapatan index array pada objek catatan sesuai id yang ditentukan dengan method array findIndex().

    if (index !== -1) {
        notes[index] = {
          ...notes[index],
          title,
          tags,
          body,
          updatedAt,
        };
        const response = h.response({
          status: 'success',
          message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    
    };

//fungsi untuk menghapus catatan sesuai id
    const deleteNoteByIdHandler = (request, h) => {
        const { id } = request.params; //proses pendapatan id yang dikirim melalui parameter
        const index = notes.findIndex((note) => note.id === id); //dapatkan index dari objek catatan sesuai dengan id yang didapat.

        //pengecekan terhadap nilai index pastikan nilainya tidak -1 jika ingin menghapus catatan. Langkah ini dilakukan dengan menthod array splice().
        
        if (index !== -1) {
            notes.splice(index, 1);
            const response = h.response({
              status: 'success',
              message: 'Catatan berhasil dihapus',
            });
            response.code(200);
            return response;
          }

          //jika index -1 maka gagal
          const response = h.response({
            status: 'fail',
            message: 'Catatan gagal dihapus. Id tidak ditemukan',
          });
          response.code(404);
          return response;
    };

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler, };