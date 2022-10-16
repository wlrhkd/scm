// 파일선택(자료실 등록.jsp)
$(document).on('click','#fchose',function() {
	const fNameA = document.getElementById('txt_file').value;
	if(fNameA.trim().length <= 0){
		modalObj.modalOpenFunc('oFileModal');
	} else {
	   $("#oCheckMessage").html("파일을 먼저 삭제해 주십시오.");
	   $("#checkType").attr("class", "modal-content panel-success");
	   modalObj.modalOpenFunc('oCheckModal');
	}
});

// 파일선택(자료실.jsp)
$(document).on('click','#fchose2',function() {
	const fNameB = document.getElementById('txt_file2').value;
	if(fNameB.trim().length <= 0){
		modalObj.modalOpenFunc('oFileModal');
	} else {
	   $("#oCheckMessage").html("파일을 먼저 삭제해 주십시오.");
	   $("#checkType").attr("class", "modal-content panel-success");
	   modalObj.modalOpenFunc('oCheckModal');
	}
});

// 파일선택(공지사항.jsp)
$(document).on('click','#fchose3',function() {
	const fNameC = document.getElementById('txt_file3').value;
	if(fNameC.trim().length <= 0){
		modalObj.modalOpenFunc('oFileModal');
	} else {
	   $("#oCheckMessage").html("파일을 먼저 삭제해 주십시오.");
	   $("#checkType").attr("class", "modal-content panel-success");
	   modalObj.modalOpenFunc('oCheckModal');
	}
});

// 파일선택(사용자정보.jsp)
$(document).on('click','#fchose4',function() {
		modalObj.modalOpenFunc('oFileModal');
});

// 자료실 등록 파일업로드 (저장 버큰 클릭 시), 팝업 화면 명 : file_pop_apds.jsp
function fileUploadApds() {
	let fName = document.getElementById("file-file").files[0];
	let formData = new FormData();

	formData.append("fName", fName);
	fetch('../Upload/apds_upload.jsp', {method: "POST", body: formData});
}

// 확인버튼 클릭(자료실 등록)
$(document).on('click','.fokay',function() {
	let fName2 = document.getElementById("file-file").files[0].name;

	$('#f_close').click(); //취소버튼 클릭(창닫기)
	cfSetValue("txt_file", fName2);
});

// 자료실 파일업로드(저장 버큰 클릭 시), 팝업 화면 명 : file_pop_pds.jsp
function fileUploadPds() {
	let fName = document.getElementById("file-file").files[0];
	let formData = new FormData();

	formData.append("fName", fName);
	fetch('../Upload/apds_upload.jsp', {method: "POST", body: formData});
}

// 확인버튼 클릭(자료실)
$(document).on('click','.fokay2',function() {
	let fName2 = document.getElementById("file-file").files[0].name;

	$('#f_close').click(); //취소버튼 클릭(창닫기)
	cfSetValue("txt_file2", fName2);
});

// 공지사항 파일업로드(저장 버큰 클릭 시), 팝업 화면 명 : file_pop_notice.jsp
function fileUploadNotice() {
	let fName = document.getElementById("file-file").files[0];
	let formData = new FormData();

	formData.append("fName", fName);
	fetch('../Upload/notice_upload.jsp', {method: "POST", body: formData});
}

// 확인버튼 클릭(공지사항)
$(document).on('click','.fokay3',function() {
	let fName3 = document.getElementById("file-file").files[0].name;

	$('#f_close').click(); //취소버튼 클릭(창닫기)
	cfSetValue("txt_file3", fName3);
});

// 사용자정보 파일업로드
function fileUploadVndmst() {
	let fName = document.getElementById("file-file").files[0];
	let formData = new FormData();
	let fCvcod = cfGetLoginCvcod();
	
	formData.append(fCvcod, fName);
	formData.append("cvcod", fCvcod);
	
	fetch('../Upload/vndmst_upload.jsp', {method: "POST", body: formData});
	cfSetValue("file-file","");
	Swal.fire({
			title: '직인이 등록되었습니다.',
			icon: 'warning',
			confirmButtonColor: '#007aff',
			confirmButtonText: '확인'
		});
	$('#f_close').click(); //취소버튼 클릭(창닫기)
}

// 사용자정보 파일 확장자
function checkFile(f){

	var file = f.files;
	
	// 정규식으로 확장자 체크
	if(!/\.(gif|jpg|jpeg|png)$/i.test(file[0].name)){
		Swal.fire({
			title: 'gif, jpg, png 파일만 선택해 주십시오.',
			icon: 'warning',
			confirmButtonColor: '#007aff',
			confirmButtonText: '확인'
		});
	}
	else return;
	f.outerHTML = f.outerHTML;
}

// 파일 다운로드(자료실 등록.jsp)	
function downloadFile(event) {	
	let fNameA = document.getElementById("txt_file").value;
	
	if(fNameA.trim() == null || fNameA.trim() == '') {
		event.stoplmmediatePropagation();   // 이벤트막기
	} else {
		var sName = encodeURIComponent(fNameA);
		window.location.href ="../Upload/apds_download.jsp?file_name="+sName;
	}
}

// 파일 다운로드(자료실.jsp)	
function downloadFile2(event) {	
	let fNameB = document.getElementById("txt_file2").value;
	if(fNameB.trim() == null || fNameB.trim() == '') {
		event.stoplmmediatePropagation();   // 이벤트막기
	} else {
		var sName = encodeURIComponent(fNameB);
		window.location.href ="../Upload/apds_download.jsp?file_name="+sName;
	}
}

// 파일 다운로드(공지사항.jsp)	
function downloadFile3(event) {	
	let fNameB = document.getElementById("txt_file3").value;
	if(fNameB.trim() == null || fNameB.trim() == '') {
		event.stoplmmediatePropagation();   // 이벤트막기
	} else {
		var sName = encodeURIComponent(fNameB);
		window.location.href ="../Upload/notice_download.jsp?file_name="+sName;
	}
}

// 파일 다운로드(사용자 정보.jsp)	
function downloadFile4(event) {	
	let fNameV = document.getElementById("txt_jikyin").value;
	var sName = encodeURIComponent(fNameV);
	window.location.href ="../Upload/vndmst_download.jsp?file_name="+sName;
}

// 파일삭제(자료실등록)
function fileDelete() {
	    const file = document.getElementById('txt_pno').value.replace("-", '');
		const fName4 = document.getElementById('txt_file').value;
	
		if(fName4.trim() == null || fName4.trim() == ''){
		    $("#oCheckMessage").html("삭제할 파일이 없습니다.");
	        $("#checkType").attr("class", "modal-content panel-success");
	        modalObj.modalOpenFunc('oCheckModal');
		}
		else {
				Swal.fire({
		        title: "삭제하시겠습니까?",
		        text: "",
		        icon: 'warning',
		        showCancelButton: true,
		        confirmButtonColor: '#007aff',
		        cancelButtonColor: '#d33',
		        confirmButtonText: '확인',
		        cancelButtonText: '취소'
		   }).then((result) => {
		      if (result.isConfirmed) {
				    const fData = {
			              ActGubun: "deleteFileApds",
	                      File: file
	                };
					const oData = {
									ActGubun: "deleteFileUrlApds",
						            uploadUrl: fName4
						        }
			        cfAjaxSync("POST", "fileURL_delete", oData, "deleteFileUrlApds");
	                cfAjaxAsync("POST", "sys_apds_e", fData, "deleteFileApds");
					pgLoadDataA();
					cfSetValue("txt_file","");
					cfSetValue("file-file","");
		      } else {
		         return false;
		      }
		   });
	       
		}
}

// 파일삭제(자료실)
function fileDelete2() {
	    const file = document.getElementById('txt_pno').value.replace("-", '');
		const fNameB = document.getElementById('txt_file2').value;
	
	
		if(fNameB.trim() == null || fNameB.trim() == ''){
		    $("#oCheckMessage").html("삭제할 파일이 없습니다.");
	        $("#checkType").attr("class", "modal-content panel-success");
	        modalObj.modalOpenFunc('oCheckModal');
		}
		else {
				Swal.fire({
		        title: "삭제하시겠습니까?",
		        text: "",
		        icon: 'warning',
		        showCancelButton: true,
		        confirmButtonColor: '#007aff',
		        cancelButtonColor: '#d33',
		        confirmButtonText: '확인',
		        cancelButtonText: '취소'
		   }).then((result) => {
		      if (result.isConfirmed) {
				    const fData = {
			              ActGubun: "deleteFileApds",
	                      File: file
	                };
					const oData = {
									ActGubun: "deleteFileUrlApds",
						            uploadUrl: fNameB
						        }
			        cfAjaxSync("POST", "fileURL_delete", oData, "deleteFileUrlApds");
	                cfAjaxAsync("POST", "sys_apds_e", fData, "deleteFileApds");
					cfSetValue("txt_file2","");
					cfSetValue("file-file","");
		      } else {
		         return false;
		      }
		   });
	       
		}
}

// 파일삭제(공지사항)
function fileDelete3() {
	    const file = document.getElementById('txt_no').value.replace("-", '');
		const fNameB = document.getElementById('txt_file3').value;
	
	
		if(fNameB.trim() == null || fNameB.trim() == ''){
		    $("#oCheckMessage").html("삭제할 파일이 없습니다.");
	        $("#checkType").attr("class", "modal-content panel-success");
	        modalObj.modalOpenFunc('oCheckModal');
		}
		else {
				Swal.fire({
		        title: "삭제하시겠습니까?",
		        text: "",
		        icon: 'warning',
		        showCancelButton: true,
		        confirmButtonColor: '#007aff',
		        cancelButtonColor: '#d33',
		        confirmButtonText: '확인',
		        cancelButtonText: '취소'
		   }).then((result) => {
		      if (result.isConfirmed) {
				    const fData = {
			              ActGubun: "deleteFileNotice",
	                      File: file
	                };
					const oData = {
									ActGubun: "deleteFileUrlNotice",
						            uploadUrl: fNameB
						        }
			        cfAjaxSync("POST", "fileURL_delete", oData, "deleteFileUrlNotice");
	                cfAjaxAsync("POST", "sys_apds_e", fData, "deleteFileNotice");
					cfSetValue("txt_file3","");
					cfSetValue("file-file","");
		      } else {
		         return false;
		      }
		   });
	       
		}
}