var webpage = "";
var replacedParameters = [];
var droppedElement;
var selectedStateVariable;
var selectedrequestStateVariable;
var selectedActionFunction;
function supportstorage() {
  if (typeof window.localStorage == "object") return true;
  else return false;
}

function handleSaveLayout() {
  var e = $(".demo").html();
  if (!stopsave && e != window.demoHtml) {
    stopsave++;
    window.demoHtml = e;
    saveLayout();
    stopsave--;
  }
}

var layouthistory;
function saveLayout() {
  var data = layouthistory;
  if (!data) {
    data = {};
    data.count = 0;
    data.list = [];
  }
  if (data.list.length > data.count) {
    for (i = data.count; i < data.list.length; i++) data.list[i] = null;
  }
  data.list[data.count] = window.demoHtml;
  data.count++;
  if (supportstorage()) {
    localStorage.setItem("layoutdata", JSON.stringify(data));
  }
  layouthistory = data;
  //console.log(data);
  /*$.ajax({
		type: "POST",
		url: "/build/saveLayout",
		data: { layout: $('.demo').html() },
		success: function(data) {
			//updateButtonsVisibility();
		}
	});*/
}

function downloadLayout() {
  alert("downloadLayout");
  $.ajax({
    type: "POST",
    url: "/build/downloadLayout",
    data: { layout: $("#download-layout").html() },
    success: function (data) {
      window.location.href = "/build/download";
    },
  });
}

function downloadHtmlLayout() {
  alert("downloadHtmlLayout");
  $.ajax({
    type: "POST",
    url: "/build/downloadLayout",
    data: { layout: $("#download-layout").html() },
    success: function (data) {
      window.location.href = "/build/downloadHtml";
    },
  });
}

function undoLayout() {
  var data = layouthistory;
  //console.log(data);
  if (data) {
    if (data.count < 2) return false;
    window.demoHtml = data.list[data.count - 2];
    data.count--;
    $(".demo").html(window.demoHtml);
    if (supportstorage()) {
      localStorage.setItem("layoutdata", JSON.stringify(data));
    }
    return true;
  }
  return false;
  /*$.ajax({
		type: "POST",
		url: "/build/getPreviousLayout",
		data: { },
		success: function(data) {
			undoOperation(data);
		}
	});*/
}

function redoLayout() {
  var data = layouthistory;
  if (data) {
    if (data.list[data.count]) {
      window.demoHtml = data.list[data.count];
      data.count++;
      $(".demo").html(window.demoHtml);
      if (supportstorage()) {
        localStorage.setItem("layoutdata", JSON.stringify(data));
      }
      return true;
    }
  }
  return false;
  /*
	$.ajax({
		type: "POST",
		url: "/build/getPreviousLayout",
		data: { },
		success: function(data) {
			redoOperation(data);
		}
	});*/
}

function handleJsIds() {
  handleModalIds();
  handleAccordionIds();
  handleCarouselIds();
  handleTabsIds();
}
function handleAccordionIds() {
  var e = $(".demo #myAccordion");
  var t = randomNumber();
  var n = "accordion-" + t;
  var r;
  e.attr("id", n);
  e.find(".accordion-group").each(function (e, t) {
    r = "accordion-element-" + randomNumber();
    $(t)
      .find(".accordion-toggle")
      .each(function (e, t) {
        $(t).attr("data-parent", "#" + n);
        $(t).attr("href", "#" + r);
      });
    $(t)
      .find(".accordion-body")
      .each(function (e, t) {
        $(t).attr("id", r);
      });
  });
}
function handleCarouselIds() {
  var e = $(".demo #myCarousel");
  var t = randomNumber();
  var n = "carousel-" + t;
  e.attr("id", n);
  e.find(".carousel-indicators li").each(function (e, t) {
    $(t).attr("data-target", "#" + n);
  });
  e.find(".left").attr("href", "#" + n);
  e.find(".right").attr("href", "#" + n);
}
function handleModalIds() {
  var e = $(".demo #myModalLink");
  var t = randomNumber();
  var n = "modal-container-" + t;
  var r = "modal-" + t;
  e.attr("id", r);
  e.attr("href", "#" + n);
  e.next().attr("id", n);
}
function handleTabsIds() {
  var e = $(".demo #myTabs");
  var t = randomNumber();
  var n = "tabs-" + t;
  e.attr("id", n);
  e.find(".tab-pane").each(function (e, t) {
    var n = $(t).attr("id");
    var r = "panel-" + randomNumber();
    $(t).attr("id", r);
    $(t)
      .parent()
      .parent()
      .find("a[href=#" + n + "]")
      .attr("href", "#" + r);
  });
}
function randomNumber() {
  return randomFromInterval(1, 1e6);
}
function randomFromInterval(e, t) {
  return Math.floor(Math.random() * (t - e + 1) + e);
}
function gridSystemGenerator() {
  $(".lyrow .preview input").bind("keyup", function () {
    var e = 0;
    var t = "";
    var n = $(this).val().split(" ", 12);
    $.each(n, function (n, r) {
      e = e + parseInt(r);
      t += '<div class="span' + r + ' column"></div>';
    });
    if (e == 12) {
      $(this).parent().next().children().html(t);
      $(this).parent().prev().show();
    } else {
      $(this).parent().prev().hide();
    }
  });
}
function configurationElm(e, t) {
  $(".demo").delegate(".configuration > a", "click", function (e) {
    e.preventDefault();
    var t = $(this).parent().next().next().children();
    $(this).toggleClass("active");
    t.toggleClass($(this).attr("rel"));
  });
  $(".demo").delegate(".configuration .dropdown-menu a", "click", function (e) {
    e.preventDefault();
    var t = $(this).parent().parent();
    var n = t.parent().parent().next().next().children();
    t.find("li").removeClass("active");
    $(this).parent().addClass("active");
    var r = "";
    t.find("a").each(function () {
      r += $(this).attr("rel") + " ";
    });
    t.parent().removeClass("open");
    n.removeClass(r);
    n.addClass($(this).attr("rel"));
  });
}
function removeElm() {
  $(".demo").delegate(".remove", "click", function (e) {
    e.preventDefault();

    $(this).parent().remove();
    if (!$(".demo .lyrow").length > 0) {
      clearDemo();
      //CODE FOR REMOVAL
      uiBlock = $("#BlockNameMentionedHere").text();
      uiBlock = uiBlock.toString().trim();
      $.ajax({
        url: "http://127.0.0.1:5000/uiblockmetadata",
        type: "POST",
        data: {
          uiBlockName: JSON.stringify(uiBlock),
          gridPresence: false,
        },
        success: function (result) {
          console.log(result);
          window.location.href = "/createuiblock?uiBlockName=" + result;
        },
      });
    }
  });
}
function clearDemo() {
  $(".demo").empty();
  layouthistory = null;
  if (supportstorage()) localStorage.removeItem("layoutdata");
}
function removeMenuClasses() {
  $("#menu-layoutit li button").removeClass("active");
}
function changeStructure(e, t) {
  $("#download-layout ." + e)
    .removeClass(e)
    .addClass(t);
}
function cleanHtml(e) {
  $(e).parent().append($(e).children().html());
}
function downloadLayoutSrc() {
  var e = "";
  $("#download-layout").children().html($(".demo").html());
  var t = $("#download-layout").children();
  t.find(".preview, .configuration, .drag, .remove").remove();
  t.find(".lyrow").addClass("removeClean");
  t.find(".box-element").addClass("removeClean");
  t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function () {
    cleanHtml(this);
  });
  t.find(".lyrow .lyrow .lyrow .lyrow .removeClean").each(function () {
    cleanHtml(this);
  });
  t.find(".lyrow .lyrow .lyrow .removeClean").each(function () {
    cleanHtml(this);
  });
  t.find(".lyrow .lyrow .removeClean").each(function () {
    cleanHtml(this);
  });
  t.find(".lyrow .removeClean").each(function () {
    cleanHtml(this);
  });
  t.find(".removeClean").each(function () {
    cleanHtml(this);
  });
  t.find(".removeClean").remove();
  $("#download-layout .column").removeClass("ui-sortable");
  $("#download-layout .row-fluid")
    .removeClass("clearfix")
    .children()
    .removeClass("column");
  if ($("#download-layout .container").length > 0) {
    changeStructure("row-fluid", "row");
  }
  formatSrc = $.htmlClean($("#download-layout").html(), {
    format: true,
    allowedAttributes: [
      ["id"],
      ["class"],
      ["data-toggle"],
      ["data-target"],
      ["data-parent"],
      ["role"],
      ["data-dismiss"],
      ["aria-labelledby"],
      ["aria-hidden"],
      ["data-slide-to"],
      ["data-slide"],
      ["api_type"],
      ["api_name"],
      ["schema_name"],
      ["custom_key"],
      ["onchange"],
      ["onclick"],
    ],
  });
  $("#download-layout").html(formatSrc);
  $("#downloadModal textarea").empty();
  $("#downloadModal textarea").val(formatSrc);
  webpage = formatSrc;
  //COMPONENTS JSX IS PRESENT HERE
  $.ajax({
    url: "http://127.0.0.1:5000/JSXGenerator",
    type: "POST",
    data: {
      webpage: JSON.stringify(webpage),
      uiBlockName: JSON.stringify($("#BlockNameMentionedHere").text().trim()),
    },
    success: function (result) {
      console.log(result);
    },
  });
  console.log(webpage);
}

function downloadLayoutSrcCustom() {
  var e = "";
  /*$("#download-layout")
    .children()
    .html($(".demo").html());*/
  var t = $("#download-layout").children();
  t.find(".preview, .configuration, .drag, .remove").remove();
  t.find(".lyrow").addClass("removeClean");
  t.find(".box-element").addClass("removeClean");
  t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function () {
    cleanHtml(this);
  });
  t.find(".lyrow .lyrow .lyrow .lyrow .removeClean").each(function () {
    cleanHtml(this);
  });
  t.find(".lyrow .lyrow .lyrow .removeClean").each(function () {
    cleanHtml(this);
  });
  t.find(".lyrow .lyrow .removeClean").each(function () {
    cleanHtml(this);
  });
  t.find(".lyrow .removeClean").each(function () {
    cleanHtml(this);
  });
  t.find(".removeClean").each(function () {
    cleanHtml(this);
  });
  t.find(".removeClean").remove();
  $("#download-layout .column").removeClass("ui-sortable");
  $("#download-layout .row-fluid")
    .removeClass("clearfix")
    .children()
    .removeClass("column");
  if ($("#download-layout .container").length > 0) {
    changeStructure("row-fluid", "row");
  }
  formatSrc = $.htmlClean($("#download-layout").html(), {
    format: true,
    allowedAttributes: [
      ["id"],
      ["class"],
      ["data-toggle"],
      ["data-target"],
      ["data-parent"],
      ["role"],
      ["data-dismiss"],
      ["aria-labelledby"],
      ["aria-hidden"],
      ["data-slide-to"],
      ["data-slide"],
      ["onchange"],
      ["onclick"],
    ],
  });
  $("#download-layout").html(formatSrc);
  $("#downloadModal textarea").empty();
  $("#downloadModal textarea").val(formatSrc);
  webpage = formatSrc;
  return webpage;
}

var currentDocument = null;
//var timerSave = 10000;
var timerSave = 1000;
var stopsave = 0;
var startdrag = 0;
var demoHtml = $(".demo").html();
var currenteditor = null;
// $(window).resize(function() {
// 	$("body").css("min-height", $(window).height() - 90);
// 	$(".demo").css("min-height", $(window).height() - 160)
// });

function restoreData() {
  if (supportstorage()) {
    layouthistory = JSON.parse(localStorage.getItem("layoutdata"));
    console.log(layouthistory);
    if (!layouthistory) return false;
    window.demoHtml = layouthistory.list[layouthistory.count - 1];
    if (window.demoHtml) $(".demo").html(window.demoHtml);
    //console.log(window.demoHtml);
  }
}

function initContainer() {
  $(".demo, .demo .column").sortable({
    connectWith: ".column",
    opacity: 0.35,
    handle: ".drag",
    start: function (e, t) {
      if (!startdrag) stopsave++;
      startdrag = 1;
    },
    stop: function (e, t) {
      if (stopsave > 0) stopsave--;
      startdrag = 0;
    },
  });
  configurationElm();
}
$(document).ready(function () {
  CKEDITOR.disableAutoInline = true;
  $(document).dblclick(function () {
    alert("Handler for .dblclick() called.");
    var $focused = $(":focus").parent().html();
    alert($focused);
  });

  restoreData();
  var contenthandle = CKEDITOR.replace("contenteditor", {
    language: "en",
    contentsCss: ["css/bootstrap-combined.min.css"],
    allowedContent: true,
  });
  // $("body").css("min-height", $(window).height() - 50);
  // $(".demo").css("min-height", $(window).height() - 130);
  $(".sidebar-nav .lyrow").draggable({
    connectToSortable: ".demo",
    helper: "clone",
    handle: ".drag",
    start: function (e, t) {
      if (!startdrag) stopsave++;
      startdrag = 1;
      console.log("HTML Tag 1...");
      console.log(t.helper.context.children[3]);
    },
    drag: function (e, t) {
      t.helper.width(400);
    },
    stop: function (e, t) {
      var restOfItems = $(".nav.nav-list.accordion-group").length;
      uiBlock = $("#BlockNameMentionedHere").text();
      uiBlock = uiBlock.toString().trim();
      console.log("DEVELOPER LAYOUT");
      console.log($(".demo.ui-sortable").html());
      console.log("ACTUAL LAYOUT");
      console.log(downloadLayoutSrcCustom());
      var devLayout = $(".demo.ui-sortable").html();
      var actLayout = downloadLayoutSrcCustom();
      $.ajax({
        url: "http://127.0.0.1:5000/uiblockmetadata",
        type: "POST",
        data: {
          uiBlockName: JSON.stringify(uiBlock),
          gridPresence: true,
          devComp: JSON.stringify(devLayout),
          actualComp: JSON.stringify(actLayout),
        },
        success: function (result) {
          console.log(result);
          //nav nav-list accordion-group
          if (restOfItems !== 5)
            window.location.href = "/createuiblock?uiBlockName=" + result;
        },
      });
      //console.log($("#download-layout").html());
      $(".demo .column").sortable({
        opacity: 0.35,
        connectWith: ".column",
        start: function (e, t) {
          if (!startdrag) stopsave++;
          startdrag = 1;
          /*console.log("HTML Tag 2 ...");
          console.log(t.helper.context.children[4]);*/
        },
        stop: function (e, t) {
          if (stopsave > 0) stopsave--;
          startdrag = 0;
        },
      });
      if (stopsave > 0) stopsave--;
      startdrag = 0;
    },
  });
  $(".sidebar-nav .box").draggable({
    connectToSortable: ".column",
    helper: "clone",
    handle: ".drag",
    start: function (e, t) {
      if (!startdrag) stopsave++;
      startdrag = 1;
      /*console.log("HTML Tag 3...");
      console.log(t.helper.context.children[4]);*/
      //console.log(t.helper.context.children[4]);
    },
    drag: function (e, t) {
      t.helper.width(400);
    },
    stop: function (t, ui) {
      handleJsIds();
      /*$("#containerProgressBar .box .preview")
        .parent()
        .hide();*/
      //CLEAR PRESELECTED NODES AND SELECTED NODES FROM SAMPLE NODE
      $("#selectedNodeElementHidden").empty();
      //END OF CLEAR PRESELECTED NODES AND SELECTED NODES FROM SAMPLE NODE
      var thislement = $(this);
      var element2 = thislement.attr("class").replace(/\s/g, ".");
      var element1 = $(t.toElement).attr("class").replace(/\s/g, ".");
      var tagName = thislement.children().last().children().prop("tagName");
      var className = thislement.children().last().children().prop("class");
      console.log(tagName);
      console.log(className);
      uiBlock = $("#BlockNameMentionedHere").text();
      uiBlock = uiBlock.toString().trim();
      //DROPED ELEMENT ON THE DOM
      var droppedElementWithEnclosedDiv = $("#containerProgressBar").find(
        "." + element2
      );
      if (className.length != 0) {
        droppedElement = $("#containerProgressBar").find(
          "." + element2 + " " + tagName + "[class=" + className + "]"
        );
      } else if (className.length == 0) {
        droppedElement = $("#containerProgressBar").find(
          "." + element2 + " " + tagName
        );
      }
      if (droppedElement.length == 2) {
        droppedElement = droppedElement.last();
      } else if (droppedElement.length > 2) {
        droppedElement = droppedElement.first();
      }
      console.log(droppedElement);
      //REPLACE LOGIC //VERY VERY IMPORTANT
      /*droppedElement.html(function () {
        return $(this).html().replace("Card_Header_For_MutipleCard", "title");
      });*/
      console.log(droppedElement.parent().html());
      //START FROM HERE.....

      if (className == "form-control" && tagName !== "SELECT") {
        //INPUT FORM ELEMENTS HANDLING
        vex.dialog.open({
          message: "Select Request State Variable..",
          input: [
            '<select class="form-control" name="requeststateVariableSelection" id="requeststateVariableSelection" onchange="GetSelectedRequestStateVariable(this)" onclick="GetAvailableRequestStateVariablesAndShow()"></select>',
          ].join(""),
          buttons: [$.extend({}, vex.dialog.buttons.YES, { text: "Next>>" })],
          callback: function (data) {
            if (!data) {
              console.log("Cancelled");
            } else {
              console.log("Username", data.requeststateVariableSelection);
              //this.APINAME_STATEVARIABLE_NAME.bind(this)
              var apiName = data.requeststateVariableSelection.split("@")[1];
              var selectedrequestStateVariable = data.requeststateVariableSelection.split(
                "@"
              )[2];
              var onChangeFunctionName =
                "{this.OnChange" +
                "_" +
                selectedrequestStateVariable +
                ".bind(this)}";
              onChangeFunctionName = onChangeFunctionName.replace(/"/g, "");
              droppedElement.attr("onchange", onChangeFunctionName);
              //  OnChange_GetLatestNews_Reques1 = (e) => {this.setState({ GetLatestNews_Reques1: e.target.value });};
              $.ajax({
                url: "http://127.0.0.1:5000/EventCodeGenerator",
                type: "POST",
                data: {
                  actionFunction: JSON.stringify(
                    "OnChange_" + selectedrequestStateVariable
                  ),
                  stateVariable: JSON.stringify(selectedrequestStateVariable),
                },
                success: function (results) {},
              });
            }
          },
        });
      }
      if (className == "form-control" && tagName === "SELECT") {
        alert("Select Logic");
        alert(tagName);
      }
      if (className == "btn") {
        //BUTTON ELEMENTS HANDLING
        vex.dialog.open({
          message: "Select action function to be invoked..",
          input: [
            '<select class="form-control" name="requestActionFunction" id="requestActionFunction" onchange="GetSelectedActionFunction(this)" onclick="GetAvailableActionFunctionAndShow()"></select>',
          ].join(""),
          buttons: [$.extend({}, vex.dialog.buttons.YES, { text: "Next>>" })],
          callback: function (data) {
            if (!data) {
              console.log("Cancelled");
            } else {
              console.log("Username", data.requestActionFunction);
              //this.APINAME_STATEVARIABLE_NAME.bind(this)
              var apiName = data.requestActionFunction.split("@")[1];
              var actionFunctionToBeCalled = data.requestActionFunction.split(
                "@"
              )[2];
              var selectedrequestStateVariable = data.requestActionFunction.split(
                "@"
              )[3];
              var onClickFunctionName =
                "{this.OnClick" +
                "_" +
                selectedrequestStateVariable +
                ".bind(this)}";
              onClickFunctionName = onClickFunctionName.replace(/"/g, "");
              droppedElement.attr("onclick", onClickFunctionName);
              //  OnChange_GetLatestNews_Reques1 = (e) => {this.setState({ GetLatestNews_Reques1: e.target.value });};
              $.ajax({
                url: "http://127.0.0.1:5000/ButtonCodeGenerator",
                type: "POST",
                data: {
                  actionFunction: JSON.stringify(
                    "OnClick_" + selectedrequestStateVariable
                  ),
                  actionFunctionToBeCalled: JSON.stringify(
                    actionFunctionToBeCalled
                  ),
                },
                success: function (results) {},
              });
            }
          },
        });
      }
      if (className !== "form-control" && className != "btn") {
        var currentParametersForComponent = parametersForComponent(
          droppedElement.parent().html()
        );
        console.log(currentParametersForComponent);
        var htmlParameters = [];
        for (var p = 0; p < currentParametersForComponent.length; p++) {
          htmlParameters.push(
            '<a href="#" onclick="getClickedElement(this)" class="list-group-item list-group-item-action" data-toggle="modal" data-target="#SampleNodeForStateVariable">' +
              currentParametersForComponent[p] +
              "</a>"
          );
        }
        console.log(htmlParameters.join(",", " "));
        $("#elementParameters").empty();
        $("#elementParameters").append(htmlParameters.join(",", " "));
        //$("#exampleModalScrollable2").modal("show");
        vex.dialog.open({
          message: "Select State Variable..",
          input: [
            '<select class="form-control" name="stateVariableSelection" id="stateVariableSelection" onchange="GetSelectedStateVariable(this)" onclick="GetAvailableStateVariablesAndShow()"></select>',
          ].join(""),
          buttons: [$.extend({}, vex.dialog.buttons.YES, { text: "Next>>" })],
          callback: function (data) {
            if (!data) {
              console.log("Cancelled");
            } else {
              console.log("Username", data.stateVariableSelection);
              $("#exampleModalScrollable2").modal("show");
              var wrapper = document.getElementById("tree4");
              wrapper.remove();
              var newWrapper = document.createElement("div");
              newWrapper.setAttribute("id", "tree4");
              newWrapper.setAttribute(
                "style",
                "width: 1000px; height: 500px; overflow-y: scroll;"
              );
              var newWrapperParent = document.getElementById("modelBodyTree4");
              newWrapperParent.appendChild(newWrapper);
              var tree = jsonTree.create({}, newWrapper);
              tree.loadData(JSON.parse(data.stateVariableSelection));
              tree.expand();
            }
          },
        });
      }
      //Associate_HTML_WITH_API(t, uiBlock, thislement);
      console.log("DEVELOPER LAYOUT");
      console.log($(".demo.ui-sortable").html());
      console.log("ACTUAL LAYOUT");
      console.log(saveHtmlCustom());
      if (stopsave > 0) stopsave--;
      startdrag = 0;
    },
  });
  initContainer();

  $("body.edit .demo").on("click", "[data-target=#editorModal]", function (e) {
    e.preventDefault();
    currenteditor = $(this).parent().parent().find(".view");
    var eText = currenteditor.html();
    contenthandle.setData(eText);
  });
  $("#savecontent").click(function (e) {
    e.preventDefault();
    currenteditor.html(contenthandle.getData());
  });
  $("[data-target=#downloadModal]").click(function (e) {
    e.preventDefault();
    downloadLayoutSrc();
  });
  $("[data-target=#shareModal]").click(function (e) {
    e.preventDefault();
    handleSaveLayout();
  });
  $("#download").click(function () {
    downloadLayout();
    return false;
  });
  $("#downloadhtml").click(function () {
    downloadHtmlLayout();
    return false;
  });
  $("#edit").click(function () {
    $("body").removeClass("devpreview sourcepreview");
    $("body").addClass("edit");
    removeMenuClasses();
    $(this).addClass("active");
    return false;
  });
  $("#clear").click(function (e) {
    e.preventDefault();
    clearDemo();
  });
  $("#devpreview").click(function () {
    $("body").removeClass("edit sourcepreview");
    $("body").addClass("devpreview");
    removeMenuClasses();
    $(this).addClass("active");
    return false;
  });
  $("#sourcepreview").click(function () {
    $("body").removeClass("edit");
    $("body").addClass("devpreview sourcepreview");
    removeMenuClasses();
    $(this).addClass("active");
    return false;
  });
  $("#fluidPage").click(function (e) {
    e.preventDefault();
    changeStructure("container", "container-fluid");
    $("#fixedPage").removeClass("active");
    $(this).addClass("active");
    downloadLayoutSrc();
  });
  $("#fixedPage").click(function (e) {
    e.preventDefault();
    changeStructure("container-fluid", "container");
    $("#fluidPage").removeClass("active");
    $(this).addClass("active");
    downloadLayoutSrc();
  });
  $(".nav-header").click(function () {
    $(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
    $(this).next().slideDown();
  });
  $("#undo").click(function () {
    stopsave++;
    if (undoLayout()) initContainer();
    stopsave--;
  });
  $("#redo").click(function () {
    stopsave++;
    if (redoLayout()) initContainer();
    stopsave--;
  });
  removeElm();
  gridSystemGenerator();
  setInterval(function () {
    handleSaveLayout();
  }, timerSave);
  var prevalue_sv = $(".sidebar-nav").css("overflow");
  $(".popover-info").hover(
    function () {
      $(".sidebar-nav").css("overflow", "inherit");
    },
    function () {
      $(".sidebar-nav").css("overflow", prevalue_sv);
    }
  );
});

function ShowAddColumnSection() {
  $("#addColumnSection").toggle();
  var dataTypes = [
    "String",
    "Integer",
    "Boolean",
    "Double",
    "Arrays",
    "Object",
  ];
  $.ajax({
    url: "http://127.0.0.1:5000/getColumns",
    type: "POST",
    success: function (results) {
      $("#columnName").empty();
      $("#availableColumnType").empty();
      results.map((result) => {
        $("#columnName").append(
          $("<option></option>")
            .attr("value", result.columnName)
            .text(result.columnName)
        );
      });
      dataTypes.map((result) => {
        $("#availableColumnType").append(
          $("<option></option>").attr("value", result).text(result)
        );
      });
    },
  });
}

function Associate_HTML_WITH_API(t, uiBlock, thislement) {
  var currentData = {};
  var htmlTag_RandonNumber;
  var element1 = $(t.toElement).attr("class").replace(/\s/g, ".");
  var element2 = thislement.attr("class").replace(/\s/g, ".");
  var tagName = thislement.children().last().children().prop("tagName");
  htmlTag_RandonNumber = tagName + "_" + Math.round(Math.random() * 1000000);
  console.log(element1);
  console.log(element2);
  $("." + element2 + " " + tagName)
    .parent()
    .parent("." + element2)
    .hide();
  vex.dialog.open({
    message: "Choose API TYPE and API",
    input: [
      '<div class="container-fluid">',
      '<select name="apiRouteTypeFromDropDown" onchange="APIFunction(this)" class="browser-default custom-select"> <option selected>Type Of API</option> <option value="GET">GET</option><option value="POST">POST</option><option value="ROUTE">ROUTE</option></select>',
      "<br/> &nbsp;&nbsp",
      '<select name="apiRouteListFromDropDown" id="API_ROUTE_LIST" class="browser-default custom-select"> <option selected>API LIST/ROUTE LIST</option></select>',
      "<br/> &nbsp;&nbsp",
      '<select name="eventTypeFromDropDown" id="EVENT_LIST" class="browser-default custom-select"> <option selected>None</option><option>OnClick</option><option>OnChange</option></select>',
      "</div>",
    ].join(""),
    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: "Link API" })],
    callback: function (data) {
      if (!data) {
        alert("Please choose values..");
      } else {
        currentData.componentName = uiBlock;
        currentData.elementKey = htmlTag_RandonNumber;
        currentData.apiNamePassed = data.apiRouteListFromDropDown;
        currentData.apiTypePassed = data.apiRouteTypeFromDropDown;
        currentData.eventTypePassed = data.eventTypeFromDropDown;
        $.ajax({
          url: "http://127.0.0.1:5000/GetAPIData",
          type: "POST",
          data: {
            apiName: JSON.stringify(currentData.apiNamePassed),
          },
          success: function (results) {
            console.log(JSON.parse(results.request));
            currentData.request = JSON.parse(results.request);
            console.log(JSON.parse(results.response));
            currentData.response = JSON.parse(results.response);
            $("#exampleModalScrollable").modal("show");
            var wrapper = document.getElementById("tree1");
            wrapper.remove();
            var newWrapper = document.createElement("div");
            newWrapper.setAttribute("id", "tree1");
            newWrapper.setAttribute(
              "style",
              "width: 1000px; height: 500px; overflow-y: scroll;"
            );
            var newWrapperParent = document.getElementById("modelBodyTree1");
            newWrapperParent.appendChild(newWrapper);
            /*document.getElementById("tree1").innerHTML = JSONTree.create(
              JSON.parse(results.request)
            );*/
            var tree = jsonTree.create({}, newWrapper);
            tree.loadData(currentData.request);
            tree.expand();
            $("#NextButtonForRequest").click(function () {
              $("#exampleModalScrollable").modal("hide");
              $("#exampleModalScrollable1").modal("show");
              var wrapper = document.getElementById("tree2");
              wrapper.remove();
              var newWrapper = document.createElement("div");
              newWrapper.setAttribute("id", "tree2");
              newWrapper.setAttribute(
                "style",
                "width: 1000px; height: 500px; overflow-y: scroll;"
              );
              var newWrapperParent = document.getElementById("modelBodyTree2");
              newWrapperParent.appendChild(newWrapper);
              var tree = jsonTree.create({}, newWrapper);
              tree.loadData(currentData.response);
              tree.expand();
            });
            //console.log(JSON.parse(tree.toSourceJSON()));
            $("#exampleModalScrollableTitle").text(results.apiName);
            $("#exampleModalScrollableTitle1").text(results.apiName);
            $("#exampleModalScrollableTitle").attr(
              "element_Key",
              currentData.elementKey
            );
            $("." + element2 + " " + tagName)
              .parent()
              .parent("." + element2)
              .show();
            $("." + element2 + " " + tagName).attr(
              "custom_key",
              htmlTag_RandonNumber
            );
          },
        });
      }
    },
  });
}

function addColumn() {
  var columnName = $("#newColumnName").val();
  var columnType = $("#availableColumnType").val();
  $.ajax({
    url: "http://127.0.0.1:5000/addColumn",
    type: "POST",
    data: {
      columnNamePassed: JSON.stringify(columnName),
      columnTypePassed: JSON.stringify(columnType),
    },
    success: function (results) {
      var dataTypes = [
        "String",
        "Integer",
        "Boolean",
        "Double",
        "Arrays",
        "Object",
      ];
      $.ajax({
        url: "http://127.0.0.1:5000/getColumns",
        type: "POST",
        success: function (results) {
          $("#columnName").empty();
          $("#availableColumnType").empty();
          results.map((result) => {
            $("#columnName").append(
              $("<option></option>")
                .attr("value", result.columnName)
                .text(result.columnName)
            );
          });
          dataTypes.map((result) => {
            $("#availableColumnType").append(
              $("<option></option>").attr("value", result).text(result)
            );
          });
        },
      });
    },
  });
}
function AddSchema() {
  var schemaName = $("#newSchemaName").val();
  var columnsSelected = $("#columnName").val();
  console.log(columnsSelected);
  $.ajax({
    url: "http://127.0.0.1:5000/addNewSchema",
    type: "POST",
    data: {
      schemaNamePassed: JSON.stringify(schemaName),
      columnsSelectedPassed: JSON.stringify({ lst: columnsSelected }),
    },
    success: function (results) {
      //console.log(results);
      $("#availableSchema").empty();
      $.ajax({
        url: "http://127.0.0.1:5000/getAllAvailableSchemas",
        type: "POST",
        success: function (results) {
          console.log(results);
          results.map((result) => {
            $("#availableSchema").append(
              $("<option></option>")
                .attr("value", result.schemaName)
                .text(result.schemaName)
            );
          });
        },
      });
    },
  });
}

function GetAvailableStateVariablesAndShow() {
  if ($("#stateVariableSelection").find("option").length == 0) {
    $("#stateVariableSelection").empty();
    $("#stateVariableSelection").append(
      $("<option></option>")
        .attr("value", "Select Value..")
        .text("Select Value..")
    );
    $.ajax({
      url: "http://127.0.0.1:5000/getStateVariableNames",
      type: "POST",
      success: function (results) {
        console.log(results);
        results.getResponseStateVariables.map((result) => {
          $("#stateVariableSelection").append(
            $("<option></option>")
              .attr("value", result.sampleValueForStateVariable)
              .attr("stateVariableNode", result.stateVariableNode)
              .text(result.StateVariableName)
          );
        });
      },
    });
  }
}

function GetAvailableRequestStateVariablesAndShow() {
  if ($("#requeststateVariableSelection").find("option").length == 0) {
    $("#requeststateVariableSelection").empty();
    $.ajax({
      url: "http://127.0.0.1:5000/getRequestStateVariableNames",
      type: "POST",
      success: function (results) {
        console.log(results);
        results.getRequestStateVariables.map((result) => {
          $("#requeststateVariableSelection").append(
            $("<option></option>")
              .attr(
                "value",
                result.sampleValueForStateVariable +
                  "@" +
                  result.apiName +
                  "@" +
                  result.StateVariableName
              )
              .attr("stateVariableNode", result.stateVariableNode)
              .text(result.StateVariableName)
          );
        });
      },
    });
  }
}

function GetAvailableActionFunctionAndShow() {
  if ($("#requestActionFunction").find("option").length == 0) {
    $("#requestActionFunction").empty();
    $.ajax({
      url: "http://127.0.0.1:5000/getRequestStateVariableNames",
      type: "POST",
      success: function (results) {
        console.log(results);
        results.getRequestStateVariables.map((result) => {
          $("#requestActionFunction").append(
            $("<option></option>")
              .attr(
                "value",
                result.sampleValueForStateVariable +
                  "@" +
                  result.apiName +
                  "@" +
                  result.actionFunction +
                  "@" +
                  result.StateVariableName
              )
              .attr("stateVariableNode", result.stateVariableNode)
              .text(result.actionFunction)
          );
        });
      },
    });
  }
}

function SelectedColumns(obj) {
  console.log(obj.val());
}
function APIFunction(obj) {
  var valuePassed = obj.value;
  $("#API_ROUTE_LIST").empty();
  $.ajax({
    url: "http://127.0.0.1:5000/getApiRouteList",
    type: "POST",
    data: {
      apiTypePassed: JSON.stringify(valuePassed),
    },
    success: function (results) {
      console.log(results);
      results.map((result) => {
        $("#API_ROUTE_LIST").append(
          $("<option></option>")
            .attr("value", result.apiName)
            .text(result.apiName)
        );
      });
    },
  });
  /*$("#API_ROUTE_LIST").append(
    $("<option></option>")
      .attr("value", obj.value)
      .text(obj.value)
  );*/
}

function saveHtml() {
  var cpath = window.location.href;
  cpath = cpath.substring(0, cpath.lastIndexOf("/"));
  console.log(webpage);
}

function saveHtmlBkp() {
  var cpath = window.location.href;
  cpath = cpath.substring(0, cpath.lastIndexOf("/"));
  webpage =
    '<html>\n<head>\n<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">\n<link href="' +
    cpath +
    '/css/bootstrap.min.css" rel="stylesheet" media="screen">\n<link href="' +
    cpath +
    '/css/other.css" rel="stylesheet">\n<link href="' +
    cpath +
    '/css/docs.min.css" rel="stylesheet" media="screen">\n<link href="' +
    cpath +
    '/css/toolbox.css" rel="stylesheet" media="stylesheet">\n</head>\n<body>\n' +
    webpage +
    '\n<script type="text/javascript" src="' +
    cpath +
    '/js/jquery-2.0.0.min.js"></script>\n<script type="text/javascript" src="' +
    cpath +
    '/js/jquery-ui.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>\n<script type="text/javascript" src="' +
    cpath +
    '/js/bootstrap6.js"></script>\n<script type="text/javascript" src="' +
    cpath +
    '/js/docs.min.js"></script>\n</body></html>';
  /* FM aka Vegetam Added the function that save the file in the directory Downloads. Work only to Chrome Firefox And IE*/
  if (
    navigator.appName == "Microsoft Internet Explorer" &&
    window.ActiveXObject
  ) {
    var locationFile = location.href.toString();
    var dlg = false;
    with (document) {
      ir = createElement("iframe");
      ir.id = "ifr";
      ir.location = "about.blank";
      ir.style.display = "none";
      body.appendChild(ir);
      with (getElementById("ifr").contentWindow.document) {
        open("text/html", "replace");
        charset = "utf-8";
        write(webpage);
        close();
        document.charset = "utf-8";
        dlg = execCommand("SaveAs", false, locationFile + "webpage.html");
      }
      return dlg;
    }
  } else {
    webpage = webpage;
    var blob = new Blob([webpage], { type: "text/html;charset=utf-8" });
    saveAs(blob, "webpage.html");
  }
}

function saveHtmlCustom() {
  var cpath = window.location.href;
  cpath = cpath.substring(0, cpath.lastIndexOf("/"));
  webpage =
    '<html>\n<head>\n<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">\n<link href="' +
    cpath +
    '/css/bootstrap.min.css" rel="stylesheet" media="screen">\n<link href="' +
    cpath +
    '/css/other.css" rel="stylesheet">\n<link href="' +
    cpath +
    '/css/docs.min.css" rel="stylesheet" media="screen">\n<link href="' +
    cpath +
    '/css/toolbox.css" rel="stylesheet" media="stylesheet">\n</head>\n<body>\n' +
    downloadLayoutSrcCustom() +
    '\n<script type="text/javascript" src="' +
    cpath +
    '/js/jquery-2.0.0.min.js"></script>\n<script type="text/javascript" src="' +
    cpath +
    '/js/jquery-ui.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>\n<script type="text/javascript" src="' +
    cpath +
    '/js/bootstrap6.js"></script>\n<script type="text/javascript" src="' +
    cpath +
    '/js/docs.min.js"></script>\n</body></html>';
  /* FM aka Vegetam Added the function that save the file in the directory Downloads. Work only to Chrome Firefox And IE*/
  return webpage;
}

$("#initComponent").click(function () {
  //NEED TO SEND FOLLOWING
  //REQUEST_STATE_VARIABLE
  //RESPONSE_STATE_VARIABLE
  //APINAME
  var currentData = {};
  var uiBlock = $("#BlockNameMentionedHere").text();
  uiBlock = uiBlock.toString().trim();
  vex.dialog.open({
    message: "Choose API TYPE and API",
    input: [
      '<div class="container-fluid">',
      '<select name="apiRouteTypeFromDropDown" onchange="APIFunction(this)" class="browser-default custom-select"> <option selected>Type Of API</option> <option value="GET">GET</option><option value="POST">POST</option><option value="ROUTE">ROUTE</option></select>',
      "<br/> &nbsp;&nbsp",
      '<select name="apiRouteListFromDropDown" id="API_ROUTE_LIST" class="browser-default custom-select"> <option selected>API LIST/ROUTE LIST</option></select>',
      "</div>",
    ].join(""),
    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: "Next>>" })],
    callback: function (data) {
      if (!data) {
        alert("Please choose values..");
      } else {
        currentData.componentName = uiBlock;
        currentData.apiNamePassed = data.apiRouteListFromDropDown;
        currentData.apiTypePassed = data.apiRouteTypeFromDropDown;
        $.ajax({
          url: "http://127.0.0.1:5000/GetAPIData",
          type: "POST",
          data: {
            apiName: JSON.stringify(currentData.apiNamePassed),
          },
          success: function (results) {
            console.log(JSON.parse(results.request));
            currentData.request = JSON.parse(results.request);
            console.log(JSON.parse(results.response));
            currentData.response = JSON.parse(results.response);
            $("#exampleModalScrollable").modal("show");
            var wrapper = document.getElementById("tree1");
            wrapper.remove();
            var newWrapper = document.createElement("div");
            newWrapper.setAttribute("id", "tree1");
            newWrapper.setAttribute(
              "style",
              "width: 1000px; height: 500px; overflow-y: scroll;"
            );
            var newWrapperParent = document.getElementById("modelBodyTree1");
            newWrapperParent.appendChild(newWrapper);
            var tree = jsonTree.create({}, newWrapper);
            tree.loadData(currentData.request);
            tree.expand();
            $("#NextButtonForRequest").click(function () {
              setTimeout(function () {
                $("#exampleModalScrollable1").modal("show");
                var wrapper = document.getElementById("tree2");
                wrapper.remove();
                var newWrapper = document.createElement("div");
                newWrapper.setAttribute("id", "tree2");
                newWrapper.setAttribute(
                  "style",
                  "width: 1000px; height: 500px; overflow-y: scroll;"
                );
                var newWrapperParent = document.getElementById(
                  "modelBodyTree2"
                );
                newWrapperParent.appendChild(newWrapper);
                var tree2 = jsonTree.create({}, newWrapper);
                console.log(currentData.response);
                tree2.loadData(currentData.response);
                tree2.expand();
              }, 1000);
            });
            /**/
            $("#exampleModalScrollableTitle").text(results.apiName);
            $("#exampleModalScrollableTitle1").text(results.apiName);
          },
        });
      }
    },
  });
});

var parametersForComponent = (htmlElement) => {
  const regex = /{data./gm;
  const str = htmlElement;
  let m;

  var indexesOfData = [];
  var returnParameters = [];

  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      //alert(`Found match, group ${groupIndex}: ${match}`);
      //alert(m.index)
      indexesOfData.push(m.index);
    });
  }
  for (var i = 0; i < indexesOfData.length; i++) {
    var extractedData = str.substring(indexesOfData[i]);

    returnParameters.push(
      extractedData
        .split("}")[0]
        .replace("{", "")
        .replace("data", "")
        .replace(".", "")
    );
  }
  return returnParameters;
};
function getClickedElement(element) {
  $("#exampleModalLabel4").text(element.innerText);
}

document
  .getElementById("updatedDroppedElement")
  .addEventListener("click", updatedDroppedContents);

function updatedDroppedContents() {
  console.log(selectedStateVariable);
  console.log(droppedElement.parent().html());
  parametersReplacedValueCombination = $("#selectedNodeElementHidden").text();
  parametersReplacedValueCombinationlength = parametersReplacedValueCombination.split(
    ";"
  ).length;
  for (i = 1; i < parametersReplacedValueCombinationlength; i++) {
    droppedElement.html(function () {
      return $(this)
        .html()
        .replace(
          parametersReplacedValueCombination.split(";")[i].split(":")[0],
          parametersReplacedValueCombination
            .split(";")
            [i].split(":")[1]
            .replace("$.", "")
        );
    });
  }
  droppedElement.parent().html(function () {
    return $(this)
      .html()
      .replace("STATE_VARIABLE_TO_BE_PLACED", selectedStateVariable);
  });
  console.log(droppedElement.parent().html());
}

function GetSelectedStateVariable(element) {
  selectedStateVariable = $("#stateVariableSelection option:selected").text();
}

function GetSelectedRequestStateVariable(element) {
  selectedrequestStateVariable = $(
    "#requeststateVariableSelection option:selected"
  ).text();
}

function GetSelectedActionFunction(element) {
  selectedActionFunction = $("#requestActionFunction option:selected").text();
}
