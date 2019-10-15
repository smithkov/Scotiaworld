$(function() {
  let enquiryContainer = $(".enquiryContainer");
  let feeCompareContainer = $(".feeCompareContainer");
  let btnSearch = document.getElementById("btnSearch");
  let cboUni1 = document.getElementById("uni1");
  let cboUni2 = document.getElementById("uni2");
  let cboFaculty = document.getElementById("faculty");
  let wrapper1 = $("#course1Wrapper");
  let wrapper2 = $("#course2Wrapper");
  let name1 = $("#schoolName1");
  let name2 = $("#schoolName2");
  let searchSpinner = $(".spinner");
  let cboSearchType = $("#cboSearchType");
  let btnBack = $("#btnBack");
  let btnNext = $("#btnNext");

  let btnBack2 = $("#btnBack2");
  let btnNext2 = $("#btnNext2");
  let allData = [];
  let renderData = [];
  let allData2 = [];
  let renderData2 = [];
  let totalData1 = 0;
  let totalData2 = 0;

  var limit1 = 10;
  var limit2 = 10;
  var pageNext1 = 10;
  let pagePrevious1 = 0;
  var pageNext2 = 10;
  let pagePrevious2 = 0;

  btnBack.click(function(e) {
    if (pagePrevious1 == 0) {
      $(this).attr("disabled", true);
    } else {
      $(this).attr("disabled", false);
      pageNext1 -= limit1;
      pagePrevious1 -= limit1;
      renderData = [];
      renderData = allData.slice(pagePrevious1, pageNext1);
      wrapper1.empty();
      renderData.forEach(course => {
        wrapper1.append(template(course));
      });

      paginationControl();
    }
  });
  btnBack2.click(function(e) {
    if (pagePrevious2 == 0) {
      $(this).attr("disabled", true);
    } else {
      $(this).attr("disabled", false);
      pageNext2 -= limit2;
      pagePrevious2 -= limit2;
      renderData2 = [];
      renderData2 = allData2.slice(pagePrevious2, pageNext2);
      wrapper2.empty();
      renderData2.forEach(course => {
        wrapper2.append(template(course));
      });
      paginationControl();
    }
  });

  btnNext.click(function(e) {
    pageNext1 += limit1;
    pagePrevious1 += limit1;
    renderData = [];
    renderData = allData.slice(pagePrevious1, pageNext1);
    wrapper1.empty();
    renderData.forEach(course => {
      wrapper1.append(template(course));
    });

    paginationControl();
  });
  btnNext2.click(function(e) {
    pageNext2 += limit2;
    pagePrevious2 += limit2;
    renderData2 = [];
    renderData2 = allData2.slice(pagePrevious2, pageNext2);
    wrapper2.empty();
    renderData2.forEach(course => {
      wrapper2.append(template(course));
    });
    paginationControl();
  });
  function paginationControl() {
    //alert(totalData2)
    if (totalData2 < pageNext2 - 1) btnNext2.attr("disabled", true);
    else btnNext2.attr("disabled", false);

    if (totalData1 < pageNext1 - 1) btnNext.attr("disabled", true);
    else btnNext.attr("disabled", false);

    if (pagePrevious2 <= 0) btnBack2.attr("disabled", true);
    else btnBack2.attr("disabled", false);

    if (pagePrevious1 <= 0) btnBack.attr("disabled", true);
    else btnBack.attr("disabled", false);
  }
  displayContainer(cboSearchType);
  cboSearchType.change(function() {
    displayContainer($(this));
  });
  function displayContainer(input) {
    let val = input.children("option:selected").val();
    if (val == 0) {
      feeCompareContainer.show();
      enquiryContainer.hide();
    } else if (val == 2) {
      feeCompareContainer.hide();
      enquiryContainer.show();
    }
  }
  searchSpinner.hide();

  function getIputs() {
    return {
      uni1: cboUni1.options[cboUni1.selectedIndex],
      uni2: cboUni2.options[cboUni2.selectedIndex],
      faculty: cboFaculty.options[cboFaculty.selectedIndex]
    };
  }
  function template(data) {
    return `<tr>
                <td>${data.name}</td>
                <td>${data.StudyArea.name}</td>
                <td>${data.fee}</td>
                </tr>`;
  }

  function nullTemplate() {
    return `<tr><td></td><td>No record found </td><td></td></tr>`;
  }
  function ajaxRequest(uni1, uni2, faculty) {
    if (uni1.value != 0) name1.empty().append(uni1.text);
    else name1.empty().append("All Institutions");
    if (uni2.value != 0) name2.empty().append(uni2.text);
    else name2.empty().append("All Institutions");

    $.ajax({
      type: "POST",
      url: "/compareFee",
      data: {
        institutionId1: uni1.value,
        institutionId2: uni2.value,
        facultyId: faculty.value
      },
      dataType: "json",
      success: function(result) {
        searchSpinner.hide();
        let course1 = result.data.course1;
        let course2 = result.data.course2;
        allData = course1;
        allData2 = course2;

        renderData = allData.slice(0, limit1);
        renderData2 = allData2.slice(0, limit2);

        totalData1 = course1.length;
        totalData2 = course2.length;
        paginationControl();

        wrapper1.empty();
        wrapper2.empty();

        if (course1.length == 0) wrapper1.append(nullTemplate());

        if (course2.length == 0) wrapper2.append(nullTemplate());

        renderData.forEach(course => {
          wrapper1.append(template(course));
        });
        renderData2.forEach(course => {
          wrapper2.append(template(course));
        });
      },
      error: function(er) {}
    });
  }
  ajaxRequest(getIputs().uni1, getIputs().uni2, getIputs().faculty);
  btnSearch.addEventListener("click", function() {
    searchSpinner.show();

    ajaxRequest(getIputs().uni1, getIputs().uni2, getIputs().faculty);
  });

  function alertBoxTemplate(message, isError) {
    let classVal = isError ? "alert alert-danger" : "alert alert-success";
    $("#alertContainer")
      .empty()
      .html(`<div class="${classVal}">  </div>`)
      .fadeOut(16000);
  }
  let myform = $("#enquiryForm");
  let enquirySpinner = $("#enquirySpinner");
  let btnEnquiry = $("#btnEnquiry");

  enquirySpinner.hide();
  myform.on("submit", function(e) {
    btnEnquiry.attr("disabled", true);
    enquirySpinner.show();
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/enquiry/add",
      data: myform.serialize(),
      success: function(response) {
        btnEnquiry.attr("disabled", false);
        if (!response.error)
          alertBoxTemplate(
            "Thanks for your enquiry, we will get back to you in 2 working days ",
            false
          );
        else
          alertBoxTemplate(
            "Form submission was not successful, please try again later.",
            true
          );
        enquirySpinner.hide();
      },
      error: function(jqXHR, exception) {
        btnEnquiry.attr("disabled", false);
        alertBoxTemplate(
          "Form submission was not successful, please try again later.",
          true
        );
        enquirySpinner.hide();
      }
    });
  });
});
