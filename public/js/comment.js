var Comment = function() {

  return {
    initComment: function(obj) {
      init();
      function init() {
        $.ajax({
          url: `/board/${obj.bd_id}/comment`,
          type: 'get',
          success: function(datas) {
            showCmtList(datas);
          },
          error: function(err) {
            console.log(err);
          }
        });
        // $.get('/board/comment', { bd_id: obj.bd_id }, (datas) => {
        //   showCmtList(datas);
        // }).fail(() => { alert('fail'); });
      }

      $('#cmt_write').on('click', function(e) {
        if(obj.isLogin === '') {
          location.href='/member/login?redirect=' + location.pathname;
          return;
        }
        $.post(`/board/${obj.bd_id}/comment`, {mb_id: obj.mb_id, cmt_content: $('#cmt_content').val() }, (datas) => {
          showCmtList(datas);
          $('#cmt_content').val('');
        }).fail(() => { alert('fail'); });
      });

      $(document).on('click', '#cmt_delete', function(e) {
        $.ajax({
          url: `/board/${obj.bd_id}/comment`,
          type: 'DELETE',
          data: {
             cmt_id: $(this).attr('data-id')
          },
          dataType: 'json',
          success: function(data) {
            if(data.result) { init(); }
          },
          error: function() {
            console.log('error!');
          }
        });
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
