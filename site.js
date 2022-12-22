var tradingDT = "";
$(document).ready(function () {    
	if (typeof $("body").tooltip === "function") {        
        $("body").tooltip({ selector: '[data-toggle=tooltip]' });
    }
    
	$(document).on("click", "a", function (obj) {
		
        if ($(this).hasClass('externalLink')) {
            linkPost($(this));
        }
        else {
            if ($(this).hasClass('clicked')) {
                return false;
            } else {
                $(this).addClass('clicked');
                linkPost($(this));
            }
        }
    });

    setInterval(function () { showTime("clock"); }, 1000); 

    $(".call-center").click(function () {
        $.dialog({
            title: 'Call us',
            type: 'orange',
            content: '<a href="tel:16325">Domestic 16325</a><br/><a href="tel:+8809611016325">International +8809611016325</a>',
        });
    });

    setTimeout(function () {
        if ($('#bn2').length > 0) {
            var ullen = $('#bn2').find("ul li").length;
            tm = ullen == 1 ? 60 * 1000 : 10 * 1000;

            $('#bn2').breakingNews({
                effect: "slide-h",
                autoplay: true,
                timer: tm,
                color: 'darkred',
                border: false
            });
        }
    }, 2000);
	
    $(".navbar a, footer a[href='#myPage']").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;

            $('html, body').animate({
					scrollTop: $(hash).offset().top
				}, 900, function () {                
                window.location.hash = hash;
            });
        }
    });
	
	$.ajax({
        url: "/api/APIMarket/GetExchangeSessionTime",    
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("RequestVerificationToken",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        }
    }).done(function (data) {
        tradingDT = data[0];
    });

    function strTruncate() {
        $('.card-text').each(function (index, value) {
            $(this).html($(this).html().substring(0, 35) + '...');
        });
    }
    strTruncate();

    $('.sector .card-price').each(function (index, value) {
        var price = parseFloat($(this).text().replace("%", "").replace(" ", "").replace("+", ""));
        if (price > 0) $(this).parent().css("background-color", "rgb(97, 147, 76, 0.5)");
        else if (price < 0) $(this).parent().css("background-color", "rgb(218, 48, 57, 0.4)");
        else if (price == 0) $(this).parent().css("background-color", "rgb(236, 237, 232, 0.2)");
    });
    
    if ($.cookie("css")) {
        $("#theme").attr("href", $.cookie("css"));
    }
    $("#colorchanger a").click(function () {
        $("#theme").attr("href", $(this).attr('rel'));
        $.cookie("css", $(this).attr('rel'), { expires: 365, path: '/' });
        return false;
    });
    
	if ($.cookie("breadcrumb")) {        
        var len = $(".page-content .breadcrumb> li").size();
        if (len > 1) $('.page-content .breadcrumb li:last-child').remove();
        $(".page-content .breadcrumb li:last").after('<li class="breadcrumb-item active" aria-current="page">' + $.cookie("breadcrumb") + '</li>');
        $.removeCookie('breadcrumb', { path: '/' });
    }
    $(".sidebar-menu .sidebar-submenu li").click(function () {
        $.cookie("breadcrumb", $(this).text(), { expires: 1, path: '/' });
    });
    $(".nav-side-menu .menu-content li .nav-link").click(function () {                
        $.cookie("breadcrumb", $(this).text(), { expires: 1, path: '/' });
    });
    
});

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (this.length >= targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

if (!Object.values) {
    Object.values = function values(params) {
        return Object.keys(params).map(function (itm) { return params[itm]; });
    };
}

if (!Object.entries) {
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i);
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };
}

$.UrlExists = function (url) {
    //var http = new XMLHttpRequest();
    //http.open('HEAD', url, false);
    //http.send();
    //return http.status != 404;
    return true;
};

var ajaxLoading = {
    start: function () {
        if ($('#full-loading').length == 0) {
            var loading = $("<div>").attr("id", "full-loading");
            var wrapper = $("<div>").addClass("wrapper").appendTo(loading);
            var inner = $("<div>").addClass("inner").appendTo(wrapper);
            $("<span>").text("L").appendTo(inner);
            $("<span>").text("o").appendTo(inner);
            $("<span>").text("a").appendTo(inner);
            $("<span>").text("d").appendTo(inner);
            $("<span>").text("i").appendTo(inner);
            $("<span>").text("n").appendTo(inner);
            $("<span>").text("g").appendTo(inner);
            $(loading).appendTo("body");
        }
    },
    stop: function () {
        if ($('#full-loading').length != 0) {
            $('#full-loading').remove();
        }
    }
}

/* *
 * dialogBox.show('Currently <b>adjusted</b> data unavailable!', { title: 'Warning', titleClass: 'warning', dialogSize: 'lg', textAlign: 'center', showButton:'ok', onHide: function () { console.log('Callback!'); } });
 * */
var dialogBox = dialogBox || (function ($) {
    'use strict';

    var $dialog = $(
        '<div class="modal fade" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true">' +
            '<div class="modal-dialog modal-dialog-centered modal-notify modal-info modal-md"  role="document">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<h5 style="margin:0;"></h5>' +
                        '<span class="btn btn-sm shadow-none text-dark bg-transparent pull-right float-right right" data-dismiss="modal" aria-label="Close"><i class="fas fa-times fa-2x"></i></span>' +
                    '</div>' +        
                    '<div class="modal-body"></div>' +
                    '<div class="modal-footer"></div>'+
                '</div>' +
            '</div>' +
         '</div>');

    return {		
        show: function (message, options) {
            
            if (typeof options === 'undefined') options = {};
            if (typeof message === 'undefined') message = 'Loading';

            var settings = $.extend({
                title: '',
                dialogSize: '',
                titleClass: '',
                textAlign: 'left',
                showButton: '',                
                onHide: null,
                onOk: null,
                onCancel: null
            }, options);

            if (settings.dialogSize !== '')
                $dialog.find('.modal-dialog').removeClass('modal-md').addClass('modal-' + settings.dialogSize);
            if (settings.titleClass !== '')
                $dialog.find('.modal-dialog').removeClass('modal-info').addClass('modal-' + settings.titleClass);            

            $dialog.find('h5').text(settings.title);

            $dialog.find('.modal-body').html(message.replace(/\n/g, "<br />"));
            if (settings.showButton !== '') {
                if (settings.showButton.toLowerCase() === 'ok')
                    $dialog.find('.modal-footer').html('<button type="button" class="btn btn-md btn-default" id="modalOk">Ok</button>');
                else if (settings.showButton.toLowerCase() === 'okcancel')
                    $dialog.find('.modal-footer').html('<button type="button" class="btn btn-md btn-default" id="modalOk">Ok</button><button type="button" class="btn btn-md btn-primary" id="modalCancel">Cancel</button>');
            }
            if (settings.textAlign !== 'left')
                $dialog.find('.modal-body').css('text-align', settings.textAlign);

            // Adding callbacks
            if (typeof settings.onHide === 'function') {
                $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                    settings.onHide.call($dialog);
                });
            }
            if (typeof settings.onOk === 'function') {
                $dialog.find('#modalOk').on("click", function () {
                    settings.onOk.call($dialog);                        
                    $dialog.modal('hide');
                });
            }
            if (typeof settings.onCancel === 'function') {
                $dialog.find('#modalCancel').on("click", function () {
                    settings.onCancel.call($dialog);
                    $dialog.modal('hide');
                });
            }
            $dialog.modal();
        },		
        hide: function () {
            $dialog.modal('hide');
        }
    };

})(jQuery);

var fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
function onSearchInput(e) {
    var input = e.target, val = input.value;
    var list = input.getAttribute('list');
    
    $.ajax({
		async: true,
        url: '/api/APIDropDown/GetCompanySearchSuggestions?text=' + val,
        type: 'GET',
        dataType: "json",
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("RequestVerificationToken",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },        
        success: function (data) {
            $('#' + list).find('option').remove();
            $.each(data, function (k, v) {
                if (k === val) {
                    var nurl = "/Company/Search?searchText=" + val + "&cn=" + v.replace(/[& ]/g, "_");
                    input = $("<input>").attr("type", "hidden").attr("name", "__RequestVerificationToken").val($('input:hidden[name="__RequestVerificationToken"]').val());
                    $('#target').append($(input));
                    $("#target").attr('action', nurl);
                    $("#target").attr('method', 'post');
                    $('#target').submit();
                }
                $('#' + list).append('<option value="' + k + '">' + v + '</option>');
            });
        },
        error: function (err) {
        }
    });
}

function onSearch(e, targetURL, sKey, sValue) {

    var input = e.target,
        val = input.value;
    var list = input.getAttribute('list');
    
    if (val !== "" && val !== undefined) {    
        $.ajax({
			async: true,
            url: '/api/APIDropDown/GetCompanySearchSuggestions?text=' + val,
            type: 'GET',
            dataType: "json",
            contentType: 'application/json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("RequestVerificationToken",
                    $('input:hidden[name="__RequestVerificationToken"]').val());
            },
            success: function (data) {
                $('#' + list).find('option').remove();

                $.each(data, function (k, v) {
                    if (k === val) {
                        var url = sKey !== null && sKey !== '' && sKey !== undefined ? sKey + "=" + sValue : "";
                        targetURL = targetURL !== null && targetURL !== '' && targetURL !== undefined ? targetURL + '/' + url : "";
                        if (targetURL !== "")
                            window.location.replace(targetURL);
                        return;
                    }
                    $('#' + list).append('<option value="' + k + '">' + v + '</option>');
                });
            },
            error: function (err) {
            }
        });
    }
}

function onAnnouncementSearchInput(e, targetURL, sKey, sValue) {
    var input = e.target,
        val = input.value;
    var list = input.getAttribute('list');

    if (val !== "" && val !== undefined) {
        $.ajax({
			async: true,
            url: '/api/APIDropDown/GetAnnouncementSearchSuggestions?text=' + val,
            type: 'GET',
            dataType: "json",
            contentType: 'application/json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("RequestVerificationToken",
                    $('input:hidden[name="__RequestVerificationToken"]').val());
            },
            success: function (data) {
                $('#' + list).find('option').remove();

                $.each(data, function (k, v) {
                    if (k === val) {
                        var url = sKey !== null && sKey !== '' && sKey !== undefined ? sKey + "=" + sValue : "";
                        targetURL = targetURL !== null && targetURL !== '' && targetURL !== undefined ? targetURL + '/' + url : "";
                        if (targetURL !== "")
                            window.location.replace(targetURL);
                        return;
                    }
                    $('#' + list).append('<option value="' + k + '">' + v + '</option>');
                });
            },
            error: function (err) {
            }
        });
    }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "350px";
    document.getElementById("main").style.marginLeft = "350px";
    $("#mySidenav").children('ul').children('li').children('a').children('span').css('display', "inline-block");    
    $("#mySidenav").children('h4').css('visibility', "visible");
    $("#OpenLink").css('display', "none");
    $("#CloseLink").css('display', "block");
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "60px";
    document.getElementById("main").style.marginLeft = "60px";
    $("#mySidenav").children('ul').children('li').children('a').children('span').css('display', "none");
    $("#mySidenav").children('h4').css('visibility', "hidden");
    $("#OpenLink").css('display', "block");
    $("#CloseLink").css('display', "none");
}

function toggleNav() {
    if ($("#mySidenav").css('width') == "60px") {
        openNav();
    } else {
        closeNav();
    }
}

function HtmlToCSVDownload(id, filename) {
    if (!filename) {
        filename = 'data_export';
    }
    $table = $('#' + id);
    var $rows = $table.find('tr:has(td)'),

        tmpColDelim = String.fromCharCode(11),
        tmpRowDelim = String.fromCharCode(0),

        colDelim = ',',
        rowDelim = '\r\n',

        csv = '' + $rows.map(function (i, row) {
            var $row = $(row),
                $cols = $row.find('td');

            return $cols.map(function (j, col) {
                var $col = $(col),
                    text = $col.text();

                return text.replace(/"/g, '""'); // escape double quotes

            }).get().join(tmpColDelim);

        }).get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim) + '';
    var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
    
    var link = document.createElement("a");
    link.href = csvData;
    link.style = "visibility:hidden";
    link.download = filename + ".csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);    
}

function HtmlToCSVDownloadWithHead(id, filename) {
    if (!filename) {
        filename = 'data_export';
    }
    $table = $('#' + id);    
    var $heads = $table.find('tr:has(th)'),

        tmpColDelim = String.fromCharCode(11),
        tmpRowDelim = String.fromCharCode(0),

        colDelim = ',',
        rowDelim = '\r\n',

        csvTH = '' + $heads.map(function (i, row) {
            var $row = $(row),
                $cols = $row.find('th');

            return $cols.map(function (j, col) {
                var $col = $(col),
                    text = $col.text();

                text.replace(/"/g, '""');
                return text.replace(/,/g, ' ').replace(/(\r\n|\n|\r)/gm, "").trim();
            }).get().join(tmpColDelim);

        }).get().join(tmpRowDelim).split(tmpRowDelim).join(rowDelim).split(tmpColDelim).join(colDelim) + '';
    
    var $rows = $table.find('tr:has(td)'),

        csvTD = '' + $rows.map(function (i, row) {
            var $row = $(row),
                $cols = $row.find('td');

            return $cols.map(function (j, col) {
                var $col = $(col),
                    text = $col.text();

                text.replace(/"/g, '""');
                return text.replace(/,/g, ' ').replace(/(\r\n|\n|\r)/gm, "").trim();
            }).get().join(tmpColDelim);

        }).get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim) + '';
    
    var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvTH + rowDelim + csvTD);
    var link = document.createElement("a");
    link.href = csvData;
    link.style = "visibility:hidden";
    link.download = filename + ".csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);    
}

function loadCashMap(panel) {
	
    $(panel + " table tr").each(function (k, v) {
        var hmap = $(this).find('.hitmap');
        var postData = {
            symbol: $(this).find('td a').text(),
            trdDate: tradingDT.lastTradingDate,
            openTime: tradingDT.openTime,
            closeTime: tradingDT.closeTime
        };

        $.ajax({
            url: "/Home/HitMap",
            data: postData,
            async: true,
            type: "POST",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("RequestVerificationToken",
                    $('input:hidden[name="__RequestVerificationToken"]').val());
            },
        }).done(function (data) {            
            if (data !== null) {
                newHtml = hmap.html('<div class="hitmap-bar"><div class="hitmap-buy" >' + data.buyPercentage + '%</div><div class="hitmap-sell">' + data.sellPercentage + '%</div></div>');
                newHtml.find(".hitmap-buy").animate({ width: data.buyPercentage }, 2000);                
                if (data.buyPercentage === 0 && data.sellPercentage === 0)
                    newHtml.find(".hitmap-bar").addClass("hitmap-bar-neutral").removeClass("hitmap-bar");
            }
        });
    });
}

function ProgressBarModal(showHide) {

    if (showHide === 'show') {
        $('#mod-progress').modal('show');
        if (arguments.length >= 2) {
            $('#progressBarParagraph').text(arguments[1]);
        } else {
            $('#progressBarParagraph').text('U tijeku...');
        }

        window.progressBarActive = true;

    } else {
        $('#mod-progress').modal('hide');
        window.progressBarActive = false;
    }
}

function StringisNullOrEmpty(n) {
    return n === undefined || n == null ? !0 : (n = n.trim(), !n || 0 === n.length);
}

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach( function(item) {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

function ucfirst(str, force) {
    str = force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/,
        function (firstLetter) {
            return firstLetter.toUpperCase();
        });
}

function ucwords(str, force) {
    str = force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/g,
        function (firstLetter) {
            return firstLetter.toUpperCase();
        });
}

function showTime(controlId) {
    var time = new Date();
    var hour = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();

    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    $("#" + controlId).html(hour + ":" + min + ":" + sec);
}

function linkPost(obj) {	
    var url = $(obj).attr('data-href');    
    var segments = $(obj).attr('data-segments');
    var param = $(obj).attr('param-href');
    
    if (url === '' || url === undefined) { return false;}
    
    input = $("<input>").attr("type", "hidden").attr("name", "__RequestVerificationToken").val($('input:hidden[name="__RequestVerificationToken"]').val());
    $('#target').append($(input));
	
    if (param !== '' && param !== undefined) {        
        urlPath = window.location.href;
        input = $("<input>").attr("type", "hidden").attr("name", "path").val(param);
        $('#target').append($(input));

        input = $("<input>").attr("type", "hidden").attr("name", "actionPath").val(urlPath);
        $('#target').append($(input));

        $("#target").attr('target', "_self");
        $("#target").attr('action', url);
        $("#target").attr('method', 'post');
        $('#target').submit();        
        return false;
    }
    
    if (segments !== '' && segments !== undefined) {        
        var segJson = JSON.parse('{"' + decodeURI(segments).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        $.each(segJson, function (index, value) {            
            input = $("<input>").attr("type", "hidden").attr("name", index).val(value);
            $('#target').append($(input));
        });
    }
	
    $("#target").attr('action', url);
    $("#target").attr('method', 'post');
    $('#target').submit();
    return false;
}

function cusFetch(urlparams, token) {      
    var theRes = null;
    $.ajax({
        url: urlparams,
        async: false,
        type: "GET",
        dataType: "json",		
        data: {},
		xhrFields: {
			withCredentials: true
		},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("RequestVerificationToken", token);
        }
    }).done(function (data) {            
        theRes = data;
    }); 
		  
    return theRes;
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

window.onload = function () {

    if ($('.table-view-more').length) {
        setTimeout(function () {

            $('.table-view-more').each(function () {                
                $(this).find('tr:gt(4)').hide();
                if ($(this).find("tbody tr").length > 4) {
                    $(this).after('<div class="viewSection"> <a class=" btn btn-sm btn-default text-center text-white">view more</a></div>');
                }                 
            });

            $(".viewSection a").click(function () {
                var $table = $(this).parent().parent().find('table');
                $table.find('tr:gt(4)').toggle();
                $(this).html($(this).html() == 'view more' ? 'view less' : 'view more');
            });

        }, 3000);
    }

    if ($('.p-view-more').length) {
        setTimeout(function () {
            $(".p-view-more").each(function () {
                var maxLength = 900;
                var myStr = $(this).text();
                if ($.trim(myStr).length > maxLength) {
                    var newStr = myStr.substring(0, maxLength);
                    var removedStr = myStr.substring(maxLength, $.trim(myStr).length);
                    $(this).empty().html(newStr);
                    $(this).append(' <a href="javascript:void(0);" class="btn btn-sm btn-default text-center text-white read-more">View More</a>');
                    $(this).append('<span class="more-text">' + removedStr + '</span>');
                }
            });
            
            $(".read-more").click(function () {
                $(this).siblings(".more-text").contents().unwrap();
                $(this).remove();
            });

        }, 3000);
    }
};