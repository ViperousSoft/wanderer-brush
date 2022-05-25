import {shell} from "electron";
function openurl(e:string){
    shell.openExternal(e);
}
export {openurl};
