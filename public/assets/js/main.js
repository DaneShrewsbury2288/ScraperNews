$(document).ready(function () {

    // Hide all modals at the start
    $("#noteModal").hide();


    // Click event to scrape new articles
    $('#scrape').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/scrape/newArticles',
            type: 'GET',
            success: function (response) {
                $('#numArticles').text(response.count);
            },
        });
    });

    // Click event to save an article
    $("#saveArticle").on("click", function (e) {
        var articleId = $(this).data('id');
        $.ajax({
            url: "/articles/save/" + articleId,
            type: 'GET',
            success: function (response) {
                window.location.href = '/';
            },
        });
    });

    //click event to delete an article from savedArticles
    $('.deleteArticle').on('click', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        $.ajax({
            url: '/articles/deleteArticle/' + id,
            type: 'DELETE',
            success: function (response) {
                window.location.href = '/articles/viewSaved';
            },
        });
    });

    //click event to open note modal and populate with notes
    $('.addNote').on('click', function (e) {
        $('#noteArea').empty();
        $('#noteTitleEntry, #noteBodyEntry').val('');
        var id = $(this).data('id');
        $('#submitNote, #noteBodyEntry').attr('data-id', id);
        $.ajax({
            url: '/notes/getNotes/' + id,
            type: 'GET',
            success: function (data) {
                console.log(data)
            console.log("data notes: " + JSON.stringify(data.notes))
                $.each(data.notes, function (i, item) {
                    showNote(item, id);
                });
                $('#noteModal').show();
            },
        });
    });


    //function to display notes in notemodal
    function showNote(element, articleId) {
        var title = $('<p>')
            .text(element.title)
            .addClass('noteTitle');
        var deleteButton = $('<button>')
            .text('X')
            .addClass('deleteNote');
        var note = $('<div>')
            .append(deleteButton, title)
            .attr('data-note-id', element._id)
            .attr('data-article-id', articleId)
            .addClass('note')
            .appendTo('#noteArea');
    }//end of showNote function

    //click event to create a note
    $('#submitNote').on('click', function (e) {
        e.preventDefault();
        sendNote($(this));
    });

    $(".close").on("click", function (e) {
        e.preventDefault();
        $("#noteModal").hide();
    });

    //click event to delete a note from a saved article
    $(document).on('click', '.deleteNote', function (e) {
        e.stopPropagation();
        $('#noteTitleEntry, #noteBodyEntry').val('');
        var thisItem = $(this);
        var ids = {
            noteId: $(this).parent().data('note-id'),
            articleId: $(this).parent().data('article-id')
        };
        $.ajax({
            url: '/notes/deleteNote',
            type: 'POST',
            data: ids,
            success: function (response) {
                thisItem.parent().remove();
            },
        });
    });

    function sendNote(element) {
        var note = {};
        note.articleId = $(element).attr('data-id'),
        note.title = $('#noteTitleEntry').val().trim();
        note.body = $('#noteBodyEntry').val().trim();
        if (note.title && note.body) {
            $.ajax({
                url: '/notes/createNote',
                type: 'POST',
                data: note,
                success: function (response) {
                    console.log("response:" + JSON.stringify(response))
                    showNote(response, note.articleId);
                    $('#noteBodyEntry, #noteTitleEntry').val('');
                },
            });
        }
    }



    //click event to retrieve the title and body of a single note
    //and populate the note modal inputs with it
    $(document).on('click', '.note', function (e) {
        e.stopPropagation();
        var id = $(this).data('note-id');
        $.ajax({
            url: '/notes/getSingleNote/' + id,
            type: 'GET',
            success: function (note) {
                $('#noteTitleEntry').val(note.title);
                $('#noteBodyEntry').val(note.body);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    //keypress event to allow user to submit note with enter key
    $('#noteBodyEntry').on('keypress', function (e) {
        if (e.keyCode === 13) {
            sendNote($(this));
        }
    });

});