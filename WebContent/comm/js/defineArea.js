$(document).ready(function () {
    setCondition();

    $("#btn_search").on("click",function (){
        onSearch();
    });

    $("#btn_save").on("click",function (e){
        onSave(e);
    });

    $("#btn_delete").on("click",function(e){
        onDelete(e);
    });
    
    $("#btn_modify").on("click",function(){
        onModify();
    });
    
    $("#btn_add").on("click",function(){
        onAdd(); 
    });
    
    $("#btn_cancel").on("click",function(){
        onCancel();
    });
    
    $("#btn_print").on("click",function(){
        onPrint();    
    });
    
    $("#btn_help").on("click",function(){
        onHelp(); 
    });
    
    $("#btn_excel").on("click",function(){
       onExcel(); 
    });
    
    $(document).on("click", function(e){
        
    });
});