var Comment = function () {

  return {
    initComment: function (obj) {
      init();
      function init() {
        $.get('/board/comment', { bd_id: obj.bd_id }, (datas) => {
          showCmtList(datas);
        }).fail(() => { alert('fail'); });
      };
      $('#cmt_write').on('click', function(e) {
        if(obj.isLogin === '') {
          location.href='/member/login?redirect=' + location.pathname;
          return;
        }
        $.post('/board/comment', {mb_id: obj.mb_id, bd_id: obj.bd_id, cmt_content: $('#cmt_content').val() }, (datas) => {
          showCmtList(datas);
          $('#cmt_content').val('');
        }).fail(() => { alert('fail'); });
      });

      $(document).on('click', '#cmt_delete', function(e) {
        console.log("ajax");
        $.ajax('/board/comment/'+$(this).attr('data-id') + '/' + obj.bd_id, { method: 'DELETE' }, function(datas) {
          console.log("dlete: " + datas['result']);

        }).fail(() => { alert('fail'); });
      });

      function showCmtList(datas) {
        var str ='<div>';
        datas.forEach((data) => {
          str +='<div>' + data.cmt_content + '</div><button id="cmt_delete" data-id="'+data.cmt_id+'">삭제</button>';
        });
        str +='</div>';
        $('.cmt_list').html(str);
      }
    }
  };
  $.ajax({
    success: function(data) {

    },
    error: function() {

    }
  })

}();
