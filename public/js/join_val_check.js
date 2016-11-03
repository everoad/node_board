var JoinValueCheck = function() {

  return {
    joinValueCheck: function() {
      var email_flag = false;
      var nick_flag = false;
      var pwd_flag = false;

      $('#mb_email').on('blur', (e) => {
        if(e.target.value.length < 4) {
          $('#email_check').html('4자 이상 작성하세요.').css({ color: 'red' });
          email_flag = false;
        } else {
          $.post('/member/checkEmail', { mb_email: e.target.value }, (data) => {
            if(data == false) {
              $('#email_check').html('이미 가입하셨습니다.').css({ color: 'red' });
              email_flag = false;
            } else {
              $('#email_check').html('사용가능한 이메일입니다.').css({ color: 'blue' });
              email_flag= true;
            }
          });
        }
      });

      $('#mb_nick').on('blur', (e) => {
        $.post('/member/nickCheck', { mb_nick: e.target.value }, (data) => {
          if(data === false) {
            $('#nick_check').html('이미 존재하는 닉네임입니다.').css({ color: 'red' });
            nick_flag = false;
          } else {
            $('#nick_check').html('사용가능한 닉네임입니다.').css({ color: 'blue' });
            nick_flag = true;
          }
        });
      });

      $('.pwd').on('blur', (e) => {
        var pwd = $('#mb_pwd').val();
        var pwd_cf = $('#mb_pwd_cf').val();
        if(pwd.length < 4 || pwd_cf.length < 4) {
          pwd_flag = false;
          $('#pwd_check').html('4자이상 입력하세요.').css({ color: 'red' });
        } else if(pwd !== pwd_cf) {
          pwd_flag = false;
          $('#pwd_check').html('일치하지 않습니다.').css({ color: 'red' });
        } else {
          pwd_flag = true;
          $('#pwd_check').html('일치합니다.').css({ color: 'blue' });
        }
      });
      
      $('#submit').on('click', (e) =>{
        if(!email_flag || !nick_check || !pwd_flag) {
          e.preventDefault();
        }
      })
    }
  }

}();
