const {shell}=require("electron");
function openurl(e){
    shell.openExternal(e);
}
