	var global_backURL = "http://localhost:8080/infoplat";
// var global_articleId = null;
// var global_channelId = null;
// var global_siteId = null;
	var global_isPreview = null;
	var suffix = "json";
		global_isPreview=false;
	var logId = null;
	var pageUrl = null;
	var init=function(){
		//初始化
		//var init=function(siteId,channelId,articleId,isPreview){
		//global_backURL=backURL;
		//global_articleId=articleId;
		//global_channelId=channelId;
		//global_siteId=siteId;
		//global_isPreview = isPreview;
		if(global_isPreview==false){
			pageVisit();
			window.onbeforeunload = pageLeave;
		}
		pageComment();
		pageClick();
		//访问量统计
		siteVisitors();
		siteVisitorsPerMonth();
		siteVisitorsPerDay();
		siteVisitorsPerYear();
	//绑定评论按钮click事件
	//$("#pageCommentSend").click(commentSave);
		siteVisitorsAuto();
	//load CSRF form protection 
		loadCSRF();
	//memberLoginName();
	//addToCollection();
		
		//加载热词
		//queryHotWordsAuto();
	}
//页面进入
	var pageVisit = function() {
		pageUrl = global_backURL+"/reception/log/front-visit!saveOrUpdate."+suffix+"?tm="+new Date().getTime();
		var iWidth = window.screen.width;
		var iHeight = window.screen.height;
		$.ajax({
			url : pageUrl,
		// async : false,
			data : {
				"siteId":global_siteId,
				"channelId":global_channelId,
				"articleId":global_articleId,
				"visitSiteType":"pc",
				"resolution":iWidth+"*"+iHeight
			},
			dataType : suffix,
			success : function(data) {
				logId = data.id;
			}
		});
	};
// 页面离开
	var pageLeave = function(e){
		$.ajax({
			url : pageUrl,
			data : {
				siteId:global_siteId,
				id:logId
			},
			dataType : suffix,
			success : function(data) {
				logId = data.id;
			}
		});
	}
// 获取评论数
	var pageComment=function(handle){
		debugger;
		if(!global_articleId)return;
		if(!document.getElementById("pageComment")){
			return;
		}
		$.ajax({
			url : global_backURL+"/reception/log/front-article!getComment."+suffix+"?tm="+new Date().getTime(),
			data : {
				id:global_articleId,
				siteId:global_siteId
			},
			dataType : suffix,
			success : function(data) {
				if(handle){
					handle(data.count);
				}else{
					$("#pageComment").html(data.count);
				}
			}
		});
	}

// 获取点击数
	var pageClick=function(handle){
		if(!global_articleId)return;

		if(!document.getElementById("pageClick")){
			return;
		}
		$.ajax({
			url : global_backURL+"/reception/log/front-article!getClick."+suffix+"?tm="+new Date().getTime(),
			data : {
				id:global_articleId,
				siteId:global_siteId
			},
			dataType : suffix,
			success : function(data) {
				if(handle){
					handle(data.count);
				}else{
					$("#pageClick").html(data.count+1);
				}
			},
			error:function(msg){
	        }
		});
	}

// **************************访问量统计begin**********************************/
// 获取整站访问数
	var siteVisitors=function(handle){
		if(!global_siteId||global_articleId)return;
		if(!document.getElementById("siteVisitors")){
			return;
		}
		$.ajax({
			url : global_backURL+"/reception/log/front-visit!getVisitors."+suffix+"?tm="+new Date().getTime(),
			data : {
				siteId:global_siteId
			},
			dataType : suffix,
			success : function(data) {
				if(handle){
					handle(data);
				}else{
					$("#siteVisitors").html(data);
				}
			}
		});
	}
// 获取整站当年访问数
	var siteVisitorsPerYear=function(handle){
		if(!global_siteId||global_articleId)return;
		if(!document.getElementById("siteVisitorsPerYear")){
			return;
		}
		$.ajax({
			url : global_backURL+"/reception/log/front-visit!getVisitorsPerYear."+suffix+"?tm="+new Date().getTime(),
			data : {
				siteId:global_siteId
			},
			dataType : suffix,
			success : function(data) {
				if(handle){
					handle(data);
				}else{
					$("#siteVisitorsPerYear").html(data);
				}
			}
		});
	}
// 获取整站当月访问数
	var siteVisitorsPerMonth=function(handle){
		if(!global_siteId||global_articleId)return;
		if(!document.getElementById("siteVisitorsPerMonth")){
			return;
		}
		$.ajax({
			url : global_backURL+"/reception/log/front-visit!getVisitorsPerMonth."+suffix+"?tm="+new Date().getTime(),
			data : {
				siteId:global_siteId
			},
			dataType : suffix,
			success : function(data) {
				if(handle){
					handle(data);
				}else{
					$("#siteVisitorsPerMonth").html(data);
				}
			}
		});
	}
// 获取整站当天访问数
	var siteVisitorsPerDay=function(handle){
		if(!global_siteId||global_articleId)return;
		if(!document.getElementById("siteVisitorsPerDay")){
			return;
		}
		$.ajax({
			url : global_backURL+"/reception/log/front-visit!getVisitorsPerDay."+suffix+"?tm="+new Date().getTime(),
			data : {
				siteId:global_siteId
			},
			dataType : suffix,
			success : function(data) {
				if(handle){
					handle(data);
				}else{
					$("#siteVisitorsPerDay").html(data);
				}
			}
		});
	}
	function siteVisitorsAuto(){
		setInterval(siteVisitors,5000);
		setInterval(siteVisitorsPerMonth,5000);
		setInterval(siteVisitorsPerDay,5000);
	}
// **************************访问量统计end**********************************/
// **************************评论begin**********************************/

// 评论保存

	function commentSave(content,viewer,code,parentId){
		debugger;
		content = encodeURI(content);
		if(!viewer){
			viewer ="匿名";  
		}
		viewer = encodeURI(viewer);

		$.ajax({
			url :  global_backURL+"/reception/component/front-comment!create."+suffix+"?tm="+new Date().getTime(),
			data : {
				content : content,
				reviewer : viewer,
				code : code,
				siteId : global_siteId,
				articleId : global_articleId,
				parentId : parentId
			},
			dataType : suffix,
			beforeSend:function(xhr) {
				xhr.setRequestHeader("_csrf" ,csrf);
			},
			success : function(data) {
				if(data){
					alert(data.data.msg);
					pageComment();
				}
			},
			error : function(e) {
			}
		}); 
	}
// 评论验证码有效性验证
	function checkValidateCode(code){
		if(!code){
			return false;
		}
		var isValidate = false;
		$.ajax({
			url :  global_backURL+"/reception/component/front-comment!checkValidateCode."+suffix+"?tm="+new Date().getTime(),
		// async:false,
			data : {
				code : code
			},
			dataType : suffix,
			success : function(data) {
				isValidate = data;
			},
			error : function(e) {
			}
		}); 
		return isValidate;
	}
	
// 查询评论列表

	function commentList(handler,articleId,parentId,isAudit,pageNum,pageSize){
		debugger;
		if(!pageSize||pageSize<1){
			pageSize = 20;
		}
		$.ajax({
			url :  global_backURL+"/reception/component/front-comment!searchAllComment."+suffix+"?tm="+new Date().getTime(),
			data : {
				pageSize:pageSize,
				pageNum:pageNum,
				siteId:global_siteId,
				articleId : articleId,
				parentId : parentId,
				isAudit : isAudit
			// P_orders:"commentTime,DESC"

			},
			dataType : suffix,
			success : function(data) {
				if(handler){
					handler(data);
				}
			},
			error : function(e) {
			// alert(e);

			}
		}); 
	}
	
	
// 查询会员评论列表

	function commentListByMember(handler,isAudit,pageNum,pageSize){
		debugger;
		$.ajax({
			url :  global_backURL+"/reception/component/front-comment!searchCommentByMember."+suffix+"?tm="+new Date().getTime(),
			data : {
				siteId:global_siteId,				
				isAudit : isAudit,				
				pageNum :pageNum,
				pageSize :pageSize
			// P_orders:"commentTime,DESC"

			},
			dataType : suffix,
			success : function(data) {
				if(handler){
					handler(data);
				}
			},
			error : function(e) {
			// alert(e);

			}
		}); 
	}

	
// 查询会员评论列表

	function collectionListByMember(handler,pageSize,pageNumber){		
		debugger;
		$.ajax({
			url :  global_backURL+"/reception/member/front-collection!searchCollectionByMember."+suffix+"?tm="+new Date().getTime(),
			data : {
				siteId:global_siteId,		
				pageSize:pageSize,
				pageNumber:pageNumber
			},
			dataType : suffix,
			success : function(data) {
				if(handler){
					handler(data);
				}
			},
			error : function(e) {
			// alert(e);

			}
		}); 
	}
	
	
	function deleteById(handler,id){
		debugger;
		$.ajax({
			url :  global_backURL+"/reception/member/front-collection!deleteById."+suffix+"?tm="+new Date().getTime(),
			data : {
				id:id
			},
			dataType : suffix,
			success : function(data) {
				if(handler){
					handler(data);
				}
			},
			error : function(e) {
			// alert(e);

			}
		}); 
	}
// 更换验证码

	function commentCodeChange(imgId){
		if(!imgId){
			imgId = "pageCommentCodeImg";
		}
		var codeImg = document.getElementById(imgId);
		codeImg.src=global_backURL+"/reception/login/code!validateCode?sessionValidateCodeKey=pageComment_validate_code&width=72&height=30&fontSize=24&tm="+new Date().getTime();;
	}
// **************************评论end**********************************/
// ****************************广告begin***********************************/
	function updateAdClickTimes(id){
			$.ajax({
				url				:	global_backURL + '/reception/component/front-ad!updateAdClickTimes.'+suffix+"?tm="+new Date().getTime(),
				data			:	{id : id , siteId : global_siteId},
				dataType		:	suffix,
				success			:	function(){
				},
				error			:	function(e){
				}
			});
	}
// ****************************广告end***********************************/
// ****************************站内检索begin***********************************/
// 根据内容和站点id查询
function searchByCondition(data,successHandler,errorHandler){
	var start_time = new Date().getTime();
	data["siteId"] = global_siteId;
	$.ajax({
		type : 'post',
		url  : global_backURL+'/reception/search/search!query.'+suffix+"?tm="+new Date().getTime(),
		data : data,
		dataType : suffix,
		success : function(data){
			if(successHandler){
				successHandler(data,start_time);
			}
		},
		error : function(e){
			if(errorHandler){
				errorHandler(e);
			}
		}
	});
 }
//查询评论通过数
//articleId 文章id
//siteId	站点id
//successHandler 成功处理方法
//errorHandler	错误处理方法
 function  findCommentAduitPass(articleId,siteId,successHandler,errorHandler){
		$.ajax({
			type	:'post',
			url		:global_backURL + '/reception/component/front-comment!getCommentByArticleIdAndIsAuditPass.'+suffix+'?tm='+new Date().getTime(),
			data	:{
                articleId	:articleId,
                siteId 		: siteId
			},
            dataType : suffix,
            success	 : function(data){
                if(successHandler){
                    successHandler(data);
                }
            },
            error	 : function(e){
                if(errorHandler){
                    errorHandler(e);
                }
            }
		});
 }
//查询评论通过数
//articleId 文章id
//siteId	站点id
//successHandler 成功处理方法
//errorHandler	错误处理方法
function findCommentAduitNOTPass(articleId,siteId,successHandler,errorHandler){
    $.ajax({
        type	:'post',
        url		:global_backURL + '/reception/component/front-comment!getCommentByArticleIdAndIsAuditNotPass.'+suffix+'?tm='+new Date().getTime(),
        data	:{
            articleId	:articleId,
            siteId 		: siteId
        },
        dataType : suffix,
        success	 : function(data){
            if(successHandler){
                successHandler(data);
            }
        },
        error	 : function(e){
            if(errorHandler){
                errorHandler(e);
            }
        }
    });
}
// ****************************站内检索end***********************************/
// ****************************留言begin***********************************/
// 保存留言
function saveMessage(data,successHandler){	
	debugger
	data["siteId"] = global_siteId;
	$.ajax({
		type : 'post',
		url :  global_backURL+"/reception/component/front-message!create."+suffix+"?tm="+new Date().getTime(),
		data : data,
		dataType : suffix,
		beforeSend:function(xhr) {
			xhr.setRequestHeader("_csrf" ,csrf);
		},
		success : function(data) {
			if(successHandler){
				successHandler(data);
			}
		},
		error : function(e) {
		// alert(e);
		}
	});
}

// 根据留言分类项id获取留言列表
function messageList(itemId,handler,pageNum,pageSize){
	if(!pageSize||pageSize<1){
		pageSize = 20;
	}
	$.ajax({
		url :  global_backURL+"/reception/component/front-message!rsearch."+suffix+"?Q_EQ_m.siteId="+global_siteId+"&Q_EQ_m.itemId="+itemId+"&tm="+new Date().getTime(),
		data : {
			P_pagesize:pageSize,
			P_pageNumber:pageNum,
			siteId:global_siteId,
			P_orders:"msgTime,DESC"
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		// alert(e);

		}
	}); 
}
// 根据留言分类code获取留言列表
function messageListByCode(code,status,handler,pageNum,pageSize){
	if(!pageSize||pageSize<1){
		pageSize = 20;
	}
	$.ajax({
		url :  global_backURL+"/reception/component/front-message!getMessageListByCode."+suffix+"?tm="+new Date().getTime(),
		data : {
			pageSize:pageSize,
			pageNum:pageNum,
			siteId:global_siteId,
			code:code,
			status:status
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		// alert(e);

		}
	}); 
}
// 根据留言分类code获取留言列表和回复列表
function messageAndReplyListByCode(code,handler,pageNum,pageSize){
	if(!pageSize||pageSize<1){
		pageSize = 20;
	}
	$.ajax({
		url :  global_backURL+"/reception/component/front-message!getMessageAndReplyListByCode."+suffix+"?tm="+new Date().getTime(),
		data : {
			pageSize:pageSize,
			pageNum:pageNum,
			siteId:global_siteId,
			code:code
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		}
	}); 
}
//根据留言编码, 公开状态 查询留言消息
// code:留言编码  publicStatus:留言公开状态  pageNum:当前页 pageSize:每页数据 handler:处理结果的js方法
function messageListAndReplyListWithOpenAndCode(code,publicStatus,pageNum,pageSize,handler){
	if(!pageSize||pageSize<1){
		pageSize = 20;
	}
	$.ajax({
		url 	:  global_backURL+"/reception/component/front-message!getMessageListAndReplyListWithOpenAndCode."+suffix+"?tm="+new Date().getTime(),
		data	: {
			pageSize:pageSize,
			pageNum:pageNum,
			siteId:global_siteId,
			code:code,
			publicStatus:publicStatus
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		}
	});
}

// 根据留言分类code和证件号码获取留言列表和回复列表
function messageAndReplyListByCredentialsNo(credentialsNo,code,handler,pageNum,pageSize){
	if(!pageSize||pageSize<1){
		pageSize = 20;
	}
	$.ajax({
		url :  global_backURL+"/reception/component/front-message!getMessageAndReplyListByCredentialsNo."+suffix+"?tm="+new Date().getTime(),
		data : {
			pageSize:pageSize,
			pageNum:pageNum,
			siteId:global_siteId,
			code:code,
			credentialsNo:credentialsNo
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		}
	}); 
}
// 根据留言id获取留言列表和回复

function messageListById(id,handler){
	$.ajax({
		url :  global_backURL+"/reception/component/front-message!getMessageAndReplyListById."+suffix+"?tm="+new Date().getTime(),
		data : {
			siteId:global_siteId,
			id:id
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		// alert(e);

		}
	}); 
}

// 根据留言分类获取留言数

function getMessageCountByCode(code){
	$.ajax({
// type : 'post',

		url		: global_backURL+"/reception/component/front-message!getMessageByCode."+suffix,
		data	: {
					 siteId		: global_siteId,
					 code	: code
				  },
		dataType: 'json',
		success	: function(data){
			$("#categoryCount").html(data);
		},
		error	: function(e){
		}
	});
}
// 更换验证码
function messageCodeChange(imgId){
	debugger
	if(!imgId){
		imgId = "pageMessageCodeImg";
	}
	var codeImg = document.getElementById(imgId);
	codeImg.src=global_backURL+"/reception/login/code!validateCode?sessionValidateCodeKey=pageMessage_validate_code&width=72&height=24&fontSize=24&tm="+new Date().getTime();
}
// ****************************留言end***********************************/
// **************************获取指定频道下各子频道文章发布量begin**********************************/
function getArticlePublish(code,startDate,endDate,handler){
	$.ajax({
		url : global_backURL+"/reception/log/front-article!getArticlePublish."+suffix+"?tm="+new Date().getTime(),
		data : {
			"map.code":code,
			"map.startDate":startDate,
			"map.endDate":endDate,
			siteId:global_siteId
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error:function(msg){
           // alert(msg); //执行错误

        }
	});
}
// **************************获取指定频道下各子频道文章发布量
	// end***********************************/
// **************************前台topN文章begin**********************************/

function topNList(handler,type,count){
	$.ajax({
		url :  global_backURL+"/reception/log/front-article!searchTopNList."+suffix+"?tm="+new Date().getTime(),
		data : {
			"map.type"		: 	type,
			"map.count"		:	count,
			"siteId"		:	global_siteId,
			"channelId"		: 	global_channelId,
			"map.packageType" : "pc",
			"map.orders"	:	"clickCount,DESC"
			
		},
		dataType : suffix,
		success : function(data) {
		// console.log(data);

			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		// alert(e);

		}
	}); 
}

function cropArticleTitle(title,size){
	if(!size||size<1){
		size = 20;
	}
	title = title.substring(0,size) + "...";
	return title;
}
// ****************************前台topN文章end***********************************/
// ****************************投票begin***********************************/
// 获取投票统计列表
function voteList(voteId,handler){
	$.ajax({
		url :  global_backURL+"/reception/component/front-vote!searchResult."+suffix+"?tm="+new Date().getTime(),
		data : {
			voteId : voteId
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		}
	}); 
}
function voteTextList(handler,recordId,pageNum,pageSize){
	if(!pageSize||pageSize<1){
		pageSize = 20;
	}
	$.ajax({
		url :  global_backURL+"/reception/component/front-vote!getTextList."+suffix+"?tm="+new Date().getTime(),
		data : {
			"map.pageSize":pageSize,
			"map.pageNum":pageNum,
			textId:recordId
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		}
	}); 
}

function saveVote(data,handler){
	debugger
	$.ajax({
		type		: 'post',
		url			: global_backURL+"/reception/component/front-vote!create."+suffix+"?tm="+new Date().getTime(),
		data		: data,
		dataType	: suffix,
		beforeSend:function(xhr) {
			xhr.setRequestHeader("_csrf" ,csrf);
		},
		success		: function(data){
			if(handler){
				handler(data);
			}
		},
		error		: function(e){
			alert(JSON.parse(e.responseText).message);
		}
	});
}
function checkVote(handler){
	$.ajax({ 
		type		: 'post', 
		url			: global_backURL+"/reception/component/front-vote!checkVote."+suffix+"?tm="+new Date().getTime(), 
		dataType	: suffix, 
		success		: function(data){
			if(handler){
				handler(data);
			}
		},
		error		: function(e){ 
		}
	});
}
// 更换验证码
function voteCodeChange(imgId){
	if(!imgId){
		imgId = "pageVoteCodeImg";
	}
	var codeImg = document.getElementById(imgId);
	codeImg.src=global_backURL+"/reception/login/code!validateCode?sessionValidateCodeKey=pageVote_validate_code&width=72&height=22&fontSize=24&tm="+new Date().getTime();
}
// ****************************投票end***********************************/
// ****************************begin***********************************/
// 添加返回距离本地时间差值的js方法,参数格式为：YYYY-MM-DD,返回值是距离本地时间的天数差
function getExtraDay(date){
	var dd = new Date();
	var localDate = dd.getTime();
	var targetDate=new Date(date).getTime();
	var extraDayMillon=localDate-targetDate;
	var extraDay=Math.floor(extraDayMillon/(24*3600*1000));
	return extraDay;
}
// ****************************end***********************************/
// ****************************附件预览begin***********************************/
// 获取文本附件内容
function getAttachmentInfo(id,handler){
	$.ajax({ 
		type		: 'post', 
		url			: global_backURL+"/reception/log/front-attachment!getInfo."+suffix+"?tm="+new Date().getTime(), 
		data : {
			id : id
		},
		dataType	: suffix, 
		success		: function(data){
			if(handler){
				handler(data);
			}
		},
		error		: function(e){ 
		}
	});
}
// 预览
function previewAttachment(status,filePath,templateUrl){
      var result="";
      var format = filePath.substring(filePath.indexOf(".")+1,filePath.length+1);
      var articleFormat =  ["doc","docx","ppt","pdf","xls","xlsx","pptx"];
      var audioFormat = ["mp3","wma"];
      var videoFormat = ["avi","rmvb","mp4","wmv","mpg","mkv"];
      var imageFormat = ["bmp","jpg","gif","png","tif"];
      if(imageFormat.toString().indexOf(format) > -1){
      		result = templateUrl[0];
      }else if(articleFormat.toString().indexOf(format) > -1){
         if(checkStatus(status)){
              return;
          }
         result = templateUrl[1];
      }else if(audioFormat.toString().indexOf(format) > -1){
        	if(checkStatus(status)){
              return;
          }
          filePath = filePath.substring(0,filePath.lastIndexOf(".")+1)+"mp3";
          result = templateUrl[2];
      }else if(videoFormat.toString().indexOf(format) > -1){
        	if(checkStatus(status)){
              return;
          }
          filePath = filePath.substring(0,filePath.lastIndexOf(".")+1)+"mp4";
      		result = templateUrl[3];
      }else{
      		alert("该附件不支持预览！");
          return;
      }
   		window.open(result,"_blank");  
   
  }
  function checkStatus(status){
  	 if(status != "1"){
    	alert("正在转换中，请稍后预览！");
       return true;
     }else{
     	return false;
     }
  }
// ****************************end***********************************/
// ****************************begin***********************************/
// 根据参数获取历史上今天的文章列表（JSON）
function getArticleHistoryToday(handler,count,channelCode,orderStrs){
	$.ajax({
		url :  global_backURL+"/reception/log/front-article!getHistoryTodayArticles."+suffix+"?tm="+new Date().getTime(),
		data : {
			"map.channelCode"		: 	channelCode,
			"map.count"		:	count,
			"siteId"		:	global_siteId,
			"map.orders"	:	orderStrs
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		}
	}); 
}
function getArticleClickCount(num,inputId,handler){
	var ids = $("#"+inputId+1).val();
	for(var i=2;i<=num;i++){
		var id = $("#"+inputId+i).val();
		if(typeof(id)!="undefined"){			
			ids += ","+id;
		}
	}
	$.ajax({
		url :  global_backURL+"/reception/log/front-article!getArticleCount."+suffix+"?tm="+new Date().getTime(),
		data : {
			"map.ids"		: 	ids
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data,ids);
			}
		},
		error : function(e) {
		}
	}); 
}
function getArticleList(channelId,siteId,handler){
	$.ajax({
		url :  global_backURL+"/reception/log/front-article!getArticleList."+suffix+"?tm="+new Date().getTime(),
		data : {
			"channelId"     :   channelId,
			"siteId"		:	siteId,
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		}
	}); 
}
// ****************************end***********************************/
// ****************************文章查询start*********************************/
function searchArticleByCondition(json,handler){
// var pageSize =
// json["P_pagesize"];
// if(!pageSize||pageSize<1){
// json["P_pagesize"] = 20;
// }
	$.ajax({
		url :  global_backURL+"/reception/log/front-article!search."+suffix+"?tm="+new Date().getTime(),
		data : json,
		type: 'POST',
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		// alert(e);

		}
	}); 
}
// ******************************end**************************************/
// ****************************begin***********************************/
// 保存评分
function scoreSave(score,raterId,raterName,code,handler){
	if(!raterName){
		raterName = "UnNamed";  
	}
	raterId=raterId+Math.round(1000*Math.random());
	$.ajax({
		type  :'post',
		url :  global_backURL+"/reception/component/front-score!create."+suffix+"?tm="+new Date().getTime(),
		data : {
			score : score,
			code:code,
			raterName : raterName,
			raterId : raterId,
			siteId : global_siteId,
			articleId : global_articleId
		},
		dataType : suffix,
		beforeSend:function(xhr) {
			xhr.setRequestHeader("_csrf" ,csrf);
		},
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		}
	}); 
}
// ****************************end***********************************/
// ****************************过滤过滤特殊字符***********************************/
// js中用正则表达式
// 过滤特殊字符,
// 校验所有输入域是否含有特殊符号
function stripscript(s) {
    var pattern = new RegExp("(<|%3C)[\\s\\S]*([/\\w]*)[\\s\\S]*(>|%3E)");
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}
// ****************************end***********************************/
// ****************************会员登录***********************************/
/**1.判断用户是否登录 2.未登录，登录后判断权限 3.已登录，直接判断权限*/
// 判断用户是否登录
function isMemberLogin(jsonData,successHandler){
	debugger
// var channelUrl = $("#channelUrl").val();
	$.ajax({
		type	: 'post',
		url		: global_backURL + "/reception/member/front-member!isMemberLogin." + suffix,
		dataType	: suffix,
		success	: function (data){
			debugger
			if(successHandler){
				successHandler(data);
			}
		},
		error	: function(e){
// alert(e);

		}
	});
}

// 会员登录

function memberLogin(jsonData,successHandler){
	debugger
// var channelUrl = jsonData["channelUrl"];
	var channelId = jsonData["channelId"];
	jsonData["siteId"] = global_siteId;
	$.ajax({
		type	: 'post',
		url		:  global_backURL + "/reception/member/front-member!memberLogin." + suffix,
		dataType:  suffix,
		data	:  jsonData,
		beforeSend:function(xhr) {
			xhr.setRequestHeader("_csrf" ,csrf);
		},
		success	:  function(data){
			debugger;
			if(!data){
				if(channelId !=""){
					isPermission(channelId);
				}else{
					alert("登录成功！");
					location.reload();
				}
			}else{
				alert(data);
		        location.reload();
			}
		},
		error	: function(e){
			debugger
		}
	});
}
function isPermission(channelId){
	debugger
	$.ajax({
		type	: 'post',
		url		:  global_backURL + "/reception/member/front-member!isPermission." + suffix,
		dataType:  suffix,
		data	: {
					channelId : channelId,
					siteId	  : global_siteId
					},
		success : function(data){
			debugger;
			if(data == true){
			// channelUrl是一个全局变量

				window.location.href=channelUrl;
			}else{
				alert("没有频道访问权限！");
				location.reload();
			}
		},
		error	: function(e){
		}
	});
}
var memberLoginName = function (handler){
	debugger
	$.ajax({
		type	: 'post',
		url		:  global_backURL + "/reception/member/front-member!getLoginName." + suffix,
		dataType:  suffix,
		success : function(data){
			debugger;
		/*
		 if(data != "null"){ $("#memberLoginName").html("当前用户："+data); var
		 name = $("#memberLoginName").text(); if(name == "游客"){
		 $("#loginStatus").text("登录"); }else{ $("#loginStatus").text("退出");
		 $("#changePwd").show(); } }else{ $("#memberLoginName").html("游客"); }
		 */
			if(handler){
				handler(data);
		   }
		},
		error	: function(e){
		}
	});
}


function addToCollection(handler,articleId,channelId,reviewer){
	debugger;
	
	if(!reviewer){
		reviewer ="匿名";  
	}
// reviewer = encodeURI(reviewer);
	$.ajax({
		type	: 'post',
		url		: global_backURL + "/reception/member/front-collection!create." + suffix,
		data	: {
			siteId	  : global_siteId,
			articleId : articleId,
			channelId : channelId,
			memberLoginName : reviewer
			},
		dataType: suffix,
		beforeSend:function(xhr) {
			xhr.setRequestHeader("_csrf" ,csrf);
		},
		success	: function(data){
					debugger;
					if(handler){
						handler(data);
					}
		},
		error	: function(e){
			// alert(e);

		}
	});
	
}

function logoutMember(handler){
	debugger
	$.ajax({
		type	: 'post',
		url		:  global_backURL + "/reception/member/front-member!logout." + suffix,
		dataType:  suffix,
		success : function(data){
			debugger
			handler(data);
		/***********************************************************************
		 * if(data){ alert("已退出当前用户！"); location.reload(); }else{
		 * alert("退出失败！"); location.reload(); }
		 **********************************************************************/
		},
		error	: function(e){
		}
	});
}
function updateMemberPwd(jsonData,handler){
	debugger
	jsonData["siteId"] = global_siteId;
	$.ajax({
		type	: 'post',
		url		: global_backURL + "/reception/member/front-member!updateMemberPwd." + suffix,
		data	: jsonData,
		dataType: suffix,
		success	: function(data){
					debugger;
					handler(data);
		},
		error	: function(e){
		}
	});
}

function saveMember(jsonData,handler){
	jsonData["siteId"] = global_siteId;
	debugger;
// 传默认分组的id jsonData["memberGroupId"] = "";
	$.ajax({
		type	: 'post',
		url		: global_backURL + "/reception/member/front-member!create." + suffix,
		data	: jsonData,
		dataType: suffix,
		beforeSend:function(xhr) {
			xhr.setRequestHeader("_csrf" ,csrf);
		},
		success	: function(data){
					debugger;
					if(handler){
						handler(data);
					}
		} ,
		error	: function(e){
		}
	});
}
//更换验证码
function memberCodeChange(imgId){
	if(!imgId){
		imgId = "pageMemberCodeImg";
	}
	var codeImg = document.getElementById(imgId);
	codeImg.src=global_backURL+"/reception/login/code!validateCode?sessionValidateCodeKey=pageMember_validate_code&width=72&height=30&fontSize=24&tm="+new Date().getTime();;
}
// ****************************end***********************************/
// 获取当前用户的留言消息
// Auther RayouWarmer
function getMessageData(pageSize,pageNum,handler){
	debugger;
	$.ajax({
		url :  global_backURL + "/reception/component/front-message!getLoginUserMessageByLoginName."+suffix+"?tm="+new Date().getTime(),
		type:'post',
		data : {
			siteId		:global_siteId,
			pageSize	:pageSize,
			pageNum		:pageNum
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		}
	}); 
}
// 我的投票
function findPersonalVotes(handler,pageNum,pageSize){
	if(!pageSize||pageSize<1){
		pageSize = 20;
	}
	$.ajax({
		url :  global_backURL+"/reception/component/front-vote!findPersonalVote."+suffix+"?tm="+new Date().getTime(),
		data : {
			pageSize:pageSize,
			pageNum:pageNum,
			siteId:global_siteId,
		},
		dataType : suffix,
		success : function(data) {
			debugger
			if(handler){
				handler(data);
			}
		},
		error : function(e) {
		}
	}); 
}
//投票详情
function getPersonalVoteDetails(voteCode, voteTime, handler){
	$.ajax({
		url :  global_backURL+"/reception/component/front-vote!findPersonalVoteDetails."+suffix+"?tm="+new Date().getTime(),
		data : {
			voteCode : voteCode,
			voteTime : voteTime,
		},
		dataType : suffix,
		success : function(data) {
			if(handler){
					handler(data);
			}
		},
		error : function(e) {
		}
	}); 
	
}
// load CSRF form protection
// Auther RayouWarmer(wang.meng@cesgroup.com.cn)
// Date 2018.6.6. 9:53
var csrf = "";
function loadCSRF(){
	$.ajax({
		url : global_backURL + "/loadCsrf?tm=" + new Date().getTime(),
		type : 'get',
		success:function(data){
		},
		error:function(e){
		},
		complete:function(xhr,data){
			csrf = xhr.getResponseHeader("_csrf");
		}
	});
}

//****************************begin***********************************/
//加载热词
function queryHotWordsAuto(siteId,pageSize,pageNum,orders,handler){
	$.ajax({
		type	: 'post',
		url		: global_backURL + "/reception/hotWords/hot-words!queryHotWords."+suffix+"?tm="+new Date().getTime(),
		dataType: 'json',
		data	: {
			siteId	 : global_siteId,
			pageSize : pageSize,
			pageNum	 : pageNum,
			orders	 : orders
		},
		success	: function(data){
			if(handler){
				handler(data);
			}
		},
		error	: function(e){
		//	error(e);
			alert(e);
		}
	});
	
}

    function praise(articleId, handler){
        debugger
        $.ajax({
            type:"get",
            url:global_backURL+"/reception/praise/praise!doPraise."+suffix+"?tm="+new Date().getTime()+"&articleId="+articleId,
            dataType : suffix,
            success : function(data) {
                if(handler){
                    handler(data);
                }
            },
            error : function(e) {
                alert("网络连接失败!");
            }
        });
    }


    function getArticelPraiseCount(articleId, handler){
        debugger
        $.ajax({
            type:"get",
            url:global_backURL+"/reception/praise/praise!getArticlePraiseCount."+suffix+"?tm="+new Date().getTime()+"&articleId="+articleId,
            dataType : suffix,
            success : function(data) {
                if(handler){
                    handler(data);
                }
            },
            error : function(e) {
                alert("网络连接失败!");
            }
        });
    }
    
    function getPraiseStatus(articleId,successHandler,falseHandler){
    	$.ajax({
            type:"get",
            url:global_backURL+"/reception/praise/praise!getPraiseStatus."+suffix+"?tm="+new Date().getTime()+"&articleId="+articleId,
            dataType : suffix,
            success : function(data) {
            	//true为未点赞,false为已点赞
                if(data.date){
                	successHandler(data);
                } else {
                	falseHandler(data);
                }
            },
            error : function(e) {
            	if(falseHandler){
            		falseHandler(data);
                }
            }
        });
    }

//****************************end***********************************/

$(function(){
	init();
});