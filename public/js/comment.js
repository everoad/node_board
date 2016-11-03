var Comment = function () {

  return {
    initComment: function (obj) {

      $.get('/board/getComment', { bd_id: obj.bd_id }, (datas) => {
        showCmtList(datas);
      }).fail(() => { alert('fail'); });

      $('#cmt_write').on('click', function(e) {
        if(obj.isLogin === '') {
          location.href='/member/login?redirect=' + location.pathname;
          return;
        }
        $.post('/board/writeComment', {mb_id: obj.mb_id, bd_id: obj.bd_id, cmt_content: $('#cmt_content').val() }, (datas) => {
          showCmtList(datas);
          $('#cmt_content').val('');
        }).fail(() => { alert('fail'); });
      });

      $(document).on('click', '#cmt_delete', function(e) {
        $.post('/board/deleteComment', { cmt_id: $(this).attr('data-id'), bd_id: obj.bd_id }, (datas) => {
          showCmtList(datas);
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

}();
