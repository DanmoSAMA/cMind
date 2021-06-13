// 滑屏后切换导航条不同区域的背景色
const menuArr = document.getElementsByClassName("topbar")[0].getElementsByTagName("div");
const slideArr = document.getElementsByClassName("swiper-slide");

setInterval(() => {
  for (let i = 0; i < slideArr.length; i++) {
    if (slideArr[i].className == "swiper-slide swiper-slide-active") {
      for (let j = 0; j < slideArr.length; j++) {
        menuArr[j].className = "";
      }
      menuArr[i].className = "topbar-chosen";
    }
  }
}, 166)

// 关键词
$(".yours").children("i.iconfont").click(function () {
  $(".menu").slideToggle("slow");
  if ($(".menu").attr("folded") == "true") {
    $(".yours").children("i.iconfont").html("&#xe642;");
    $(".menu").attr("folded", "false");
  }
  else {
    $(".yours").children("i.iconfont").html("&#xe627;");
    $(".menu").attr("folded", "true");
  }
});

// 收藏夹

// 一级
$(".fav-list").children("span").children("i.iconfont").click(function () {
  $(this).parents(".fav-list").children(".st-item").slideToggle("slow");
  if ($(this).parents(".fav-list").attr("folded") == "false") {
    $(this).parents(".fav-list").children("span").children("i.iconfont").html("&#xe62b;");
    $(this).parents(".fav-list").attr("folded", "true");
  }
  else {
    $(document.querySelectorAll(".fav-list[folded='false']")).children(".st-item").slideUp("slow");
    $(document.querySelectorAll(".fav-list[folded='false']")).children("span").children("i.iconfont").html("&#xe62b;");
    $(document.querySelectorAll(".fav-list[folded='false']")).attr("folded", "true");

    $(this).parents(".fav-list").children("span").children("i.iconfont").html("&#xe649;");
    $(this).parents(".fav-list").attr("folded", "false");
  }
});

// 二级
$(".st-item").children("span").children("i.iconfont").click(function () {

  $(this).parents(".st-item").children(".nd-item").slideToggle("slow");
  if ($(this).parents(".st-item").attr("folded") == "false") {
    $(this).parents(".st-item").children("span").children("i.iconfont").html("&#xe62b;");
    $(this).parents(".st-item").attr("folded", "true");
  }
  else {
    $(document.querySelectorAll(".st-item[folded='false']")).children(".nd-item").slideUp("slow");
    $(document.querySelectorAll(".st-item[folded='false']")).children("span").children("i.iconfont").html("&#xe62b;");
    $(document.querySelectorAll(".st-item[folded='false']")).attr("folded", "true");

    $(this).parents(".st-item").children("span").children("i.iconfont").html("&#xe649;");
    $(this).parents(".st-item").attr("folded", "false");
  }
});

// 发ajax
$(".swiper-slide > i.iconfont").click(function () {
  $.ajax({
      url: `https://cmind.qliphoth.tech/api/related`,
      data: {word: $("input").val()},
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        console.log('data' + data);
      }, 
      error: function () {
        console.log('出错了！');
      }
    })
});