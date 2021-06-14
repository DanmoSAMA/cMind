// 滑屏后切换导航条不同区域的背景色
const menuArr = document.getElementsByClassName("topbar")[0].getElementsByTagName("div");
const slideArr = document.getElementsByClassName("swiper-slide");

var prevPage = 0;
var favStack = [];
setInterval(() => {
  for (let i = 0; i < slideArr.length; i++) {
    if (slideArr[i].className == "swiper-slide swiper-slide-active") {
      for (let j = 0; j < slideArr.length; j++) {
        menuArr[j].className = "";
      }
      menuArr[i].className = "topbar-chosen";
      if (prevPage !== 1 && i === 1) {
        freshFav();
      }
      else if (prevPage !== 2 && i === 2 && inited()) {
        let history = getLocal("history", []);
        let favorite = getLocal("favorite", {});
        $("#third-slide").remove("svg");
        $("#third-slide").prepend(`<svg id="mindmap"></svg>`);
        drawOnSvg("mindmap", history[0].keyword, favorite);
      }
      prevPage = i;

    }
  }
  // // 收藏夹（修改）
  // $(".words > span").click(function () {
  //   $(this).parent().parent().append(`
  //   <div class="st-item" folded="true">
  //     <span>${$(this).html()}</span>
  //   </div>
  // `);
  //   $(this).parent().remove();
  // });
}, 166);

function freshFav() {
  $(".mid-wrapper").empty();
  $(".words-wrapper").empty();

  if (inited()) {
    // Display root
    let history = getLocal("history", []);
    $(".root > span").html(history[0].keyword).click(
      function() {
        favStack = [];
        freshFav();
      }
    );

    // Display bars
    let cursor = getLocal("favorite", {});
    for (let keyword of favStack) {
      let elem = $(`<div class="fav-list"><span>${keyword}</span></div>`);
      makeButton(
        elem,
        function short() {
          while (favStack[favStack.length - 1] !== keyword) {
            favStack.pop();
          }
          freshFav();
        },
        function long() {
          while (favStack[favStack.length - 1] !== keyword) {
            favStack.pop();
          }
          favStack.pop();
          let favorite = getLocal("favorite", {});
          let cursor = favorite;
          for (let keyword of favStack) {
            cursor = cursor[keyword];
          }
          cursor[keyword] = undefined;
          setLocal("favorite", favorite);
          freshFav();
        }
      );
      $(".mid-wrapper").append(elem);
      cursor = cursor[keyword];
    }

    // Display tabs
    for (let keyword in cursor) {
      let elem = $(`<span>${keyword} </span>`);
      makeButton(
        elem,
        function short() {
          favStack.push(keyword);
          freshFav();
        },
        function long() {
          let favorite = getLocal("favorite", {});
          let cursor = favorite;
          for (let keyword of favStack) {
            cursor = cursor[keyword];
          }
          cursor[keyword] = undefined;
          setLocal("favorite", favorite);
          freshFav();
        }
      );
      $(".words-wrapper").append(elem);
    }
  } else {
    $(".root > span").html("");
  }
}

function makeButton(elem, clickHandler, longClickHandler) {
  let longClick = 0;
  elem.on({
    touchstart: function (e) {
      longClick = 0;
      timeOutEvent = setTimeout(function (e) {
        longClick = 1;
        console.log('长按！');
        longClickHandler(e);
      }, 500);
    },
    touchmove: function (e) {
      clearTimeout(timeOutEvent);
      timeOutEvent = 0;
      e.preventDefault();
    },
    touchend: function (e) {
      clearTimeout(timeOutEvent);
      if (timeOutEvent != 0 && longClick == 0) {
        // 点击
        console.log('单击！');
        clickHandler(e);
      }
      return false;
    }
  });
}

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

//（此处注释不要删，展开一个菜单时合上另一个）
// 一级
// $(".fav-list").children("span").children("i.iconfont").click(function () {
//   $(this).parents(".fav-list").children(".st-item").slideToggle("slow");
//   if ($(this).parents(".fav-list").attr("folded") == "false") {
//     $(this).parents(".fav-list").children("span").children("i.iconfont").html("&#xe62b;");
//     $(this).parents(".fav-list").attr("folded", "true");
//   }
//   else {
//     $(document.querySelectorAll(".fav-list[folded='false']")).children(".st-item").slideUp("slow");
//     $(document.querySelectorAll(".fav-list[folded='false']")).children("span").children("i.iconfont").html("&#xe62b;");
//     $(document.querySelectorAll(".fav-list[folded='false']")).attr("folded", "true");

//     $(this).parents(".fav-list").children("span").children("i.iconfont").html("&#xe649;");
//     $(this).parents(".fav-list").attr("folded", "false");
//   }
// });

// 二级
// $(".st-item").children("span").children("i.iconfont").click(function () {

//   $(this).parents(".st-item").children(".nd-item").slideToggle("slow");
//   if ($(this).parents(".st-item").attr("folded") == "false") {
//     $(this).parents(".st-item").children("span").children("i.iconfont").html("&#xe62b;");
//     $(this).parents(".st-item").attr("folded", "true");
//   }
//   else {
//     $(document.querySelectorAll(".st-item[folded='false']")).children(".nd-item").slideUp("slow");
//     $(document.querySelectorAll(".st-item[folded='false']")).children("span").children("i.iconfont").html("&#xe62b;");
//     $(document.querySelectorAll(".st-item[folded='false']")).attr("folded", "true");

//     $(this).parents(".st-item").children("span").children("i.iconfont").html("&#xe649;");
//     $(this).parents(".st-item").attr("folded", "false");
//   }
// });

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

let start = 0;
let wordList;

function copyToCircle(arr) {
  for (let i = 0; i < 5; i++) {
    $($(".circle-rd")[i]).html(i + start < arr.length ? arr[start + i] : "");
  }
}

// init
(() => {
  // reset(); // TODO: Remove it when not debugging
  let history = getLocal("history", []);
  wordList = history.length > 0 ? history[history.length - 1].wordList : [];
  copyToCircle(wordList);
  // 修改menu
  for (let i = 0; i < history.length; i++) {
    appendKeyword(history[i].keyword);
  }
  // 添加收藏夹的词
  // if (history[0]) {
  //   $(".fav-list").append(`
  //   <span>${history[0].keyword}</span>
  // `)
  // }
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
      if (res.status == 200) {
        wordList = res.data;
        let history = getLocal("history", []);
        if (inited() && (wordList[0] === undefined || wordList[0] !== keyword)) {
          wordList.unshift(keyword);
        }
        if (history.length === 0 || history[history.length - 1].keyword !== keyword) {
          appendKeyword(keyword);
          history.push({ keyword, wordList });
          setLocal("history", history);
        }
        start = 0;
        copyToCircle(wordList);
        $("input").val(''); // 清空input

        // $(".fav-list").append(`
        //   <span>${history[0].keyword}</span>
        // `)
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
      // 问题：若长按后鼠标在圆上松开，会触发单击函数（已解决）
      longClick = 1;
      console.log('长按！');

      let favorite = getLocal("favorite", {});
      let history = getLocal("history", []);
      let cursor = favorite;
      for (let i = 1; i < history.length; i++) {
        if (cursor.hasOwnProperty(history[i].keyword)) {
          cursor = cursor[history[i].keyword];
        }
      }
      if (!cursor.hasOwnProperty(keyword)) {
        cursor[keyword] = {};
      }
      setLocal("favorite", favorite);
      console.log(favorite); // 使用它

      console.log(cursor);
      // 加入的位置和加入的词语

      // for (let key in cursor) {
      //   console.log(key);
      //   $().append(`
      //   <span>${key}</span>
      // `);
      // }
      console.log(cursor[cursor.length - 1]);

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
              history.push({ keyword, wordList });
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
  });
  $(".menu").append(bar);
}

$(".download").click(function () {
  downloadPng(document.querySelector('#mindmap'));
  // 下载导图
});