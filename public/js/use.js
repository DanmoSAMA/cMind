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

// 模拟后端传来的数据
// let res = {
//   "status": 200,
//   "data": [
//     "酒", "酒文化", "啤酒", "白酒", "黄酒", "红酒", "葡萄酒", "酒精", "酒鬼", "酒疯"
//   ]
// }
// let wordList = new Array;
// const circleRd = document.getElementsByClassName("circle-rd");

// for (let i = 0; i < 5; i++) {
//   circleRd[i].innerHTML = res.data[i];
// }

function inited() {
  let history = localStorage.getItem("history");
  return (history !== null && history[0] !== undefined);
}

function getLocal(name, def) {
  let obj = localStorage.getItem(name);
  return obj === null ? def : JSON.parse(obj);
}

function setLocal(name, obj) {
  localStorage.setItem(name, JSON.stringify(obj));
}

function reset() {
  localStorage.removeItem("favorite");
  localStorage.removeItem("history");
  for (let i = 0; i < 5; i++) {
    $($(".circle-rd")[i]).html("");
  }
}

var start = 0;
var wordList;

function copyToCircle(arr) {
  for (let i = 0; i < 5; i++) {
    $($(".circle-rd")[i]).html(i + start < arr.length ? arr[start + i] : "");
  }
}

// init
(() => {
  reset(); // TODO: Remove it when not debugging
  let history = getLocal("history", []);
  wordList = history.length > 0 ? history[history.length - 1].wordList : [];
  copyToCircle(wordList);
})();


// search
// TODO: clear the search text when clicked
$(".swiper-slide > i.iconfont").click(function () {
  let keyword = $("input").val();
  if (keyword === "") {
    return;
  }
  $.ajax({
    url: 'https://cmind-app.qliphoth.tech/api/related', // 待测试
    data: { "word": keyword },
    type: 'GET',
    dataType: 'json',
    success: function (res) {
      // 传来的是一个对象，含有status和data属性，data是数组
      // 如果保存不下来，可能要使用缓存的API
      if (res.status == 200) {
        wordList = res.data; // 将data数组保存下来，为之后的刷新做准备
        let history = getLocal("history", []);
        if (inited() && (wordList[0] === undefined || wordList[0] !== keyword)) {
          wordList.unshift(keyword);
        }
        if (history.length === 0 || history[history.length - 1].keyword !== keyword) {
          appendKeyword(keyword);
          history.push({keyword, wordList});
          setLocal("history", history);
        }
        start = 0;
        copyToCircle(wordList);
      }
      else {
        console.error('出错了！');
      }
    },
    error: function () {
      console.error('出错了！');
    }
  })
});

// 更新词语
// $(".update").click(function() {
//   for (let i = 5; i < 10; i++) {
//     $($(".circle-rd")[i]).html(wordList[i]);
//   }
// });

// 之后改，应该要不断地加5 
let updateBtn = document.getElementsByClassName("update")[0];
updateBtn.onclick = function () {
  start += 5;
  if (start >= wordList.length) {
    start = 0;
  }
  copyToCircle(wordList);
};

let longClick = 0;

$(".circle-rd").on({
  touchstart: function (e) {
    let keyword = $(this).html();
    if (keyword === "") {
      return;
    }
    longClick = 0;
      timeOutEvent = setTimeout(function () {
      // 长按
      // 问题：若长按后鼠标在圆上松开，会触发单击函数
      console.log('长按！');
      let favorite = getLocal("favorite", {});
      let history = getLocal("history", []);
      let cursor = favorite;
      for (let i = 1; i < history.length; i++) {
        if (cursor.hasOwnProperty(history[i])) {
          cursor = cursor[history[i]];
        }
      }
      if (!cursor.hasOwnProperty(keyword)) {
        cursor[keyword] = null;
      }
      setLocal("favorite", favorite);
    }, 500);
  },
  touchmove: function (e) {
    if ($(this).html() === "") {
      return;
    }
    clearTimeout(timeOutEvent);
    timeOutEvent = 0;
    e.preventDefault();
  },
  touchend: function (e) {
    let keyword = $(this).html();
    if (keyword === "") {
      return false;
    }
    clearTimeout(timeOutEvent);
      if (timeOutEvent != 0 && longClick == 0) {
        // 点击
      console.log('单击！');
      $.ajax({
        url: 'https://cmind-app.qliphoth.tech/api/related',
        data: { "word": keyword },
        type: 'GET',
        dataType: 'json',
        success: function (res) {
          if (res.status == 200) {
            wordList = res.data;
            let history = getLocal("history", []);
            if (history.length === 0 || history[history.length - 1].keyword !== keyword) {
              appendKeyword(keyword);
              history.push({keyword, wordList});
              setLocal("history", history);
            }
            start = 0;
            copyToCircle(wordList);
          }
          else {
            console.error('出错了！');
          }
        },
        error: function () {
          console.error('出错了！');
        }
      });
    }
    return false;
  }
});

function appendKeyword(keyword) {
  let bar = $(`<p>${keyword}</p>`);
  bar.click(function () {
    console.log(this);
    let children = this.parentNode.childNodes;
    let i;
    for (i = 0; i < children.length; i++) {
      if (children[i] === this) {
        break;
      }
    }
    let history = getLocal("history", []);
    for (let k = children.length - 1; k > i; k--) {
      history.pop();
      this.parentNode.removeChild(children[k]);
    }
    setLocal("history", history);
    wordList = history[history.length - 1].wordList;
    start = 0;
    copyToCircle(wordList);
    // let num = Number($(this).attr("num"));
    // console.log(num);
    // for (let i = 0; i < 5; i++) {
    //   $($(".circle-rd")[i]).html(obj[`attr${num}`][i]);
    // }
  });
  $(".menu").append(bar);
}

// console.log($(".menu > p"));
// $(".menu > p").click(function () {
//   console.log("clicked")
//   console.log(this);
//   // let num = Number($(this).attr("num"));
//   // console.log(num);
//   // for (let i = 0; i < 5; i++) {
//   //   $($(".circle-rd")[i]).html(obj[`attr${num}`][i]);
//   // }
// });

// let obj2 = new Object;
// let hello = 'haha';
// obj2[hello] = [2,5,7,9];
// console.log(obj2[hello]);
// console.log(obj2);



