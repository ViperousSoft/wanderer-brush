window.onload=()=>{
    for(let k of document.querySelectorAll("ul.sidebar")){
        let con=document.getElementById(k.getAttribute("content"));
        for(let i=0;i<k.children.length;i++){
            let ch=k.children.item(i).firstElementChild;
            ch.setAttribute("onclick","act(this)");
            ch.setAttribute("href","javascript:void(0)");
            ch.index=i;
            if(i!=0){
                ch.classList.add("inactive");
                con.children.item(i).toggleAttribute("nodisplay");
            }
            else{
                ch.classList.add("active");
            }
        }
    }
}

function act(e){
    let p=e.parentElement.parentElement;
    if(p.active==e.index)return;
    let con=document.getElementById(p.getAttribute("content"));
    p.children.item(p.active).firstElementChild.classList.replace("active","inactive");
    con.children.item(p.active).toggleAttribute("nodisplay");
    e.classList.replace("inactive","active");
    con.children.item(e.index).toggleAttribute("nodisplay");
    p.active=e.index;
}
