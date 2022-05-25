import React from "react";
window.onload=()=>{
    document.querySelectorAll("ul.sidebar").forEach(k=>{
        Object.defineProperty(k,"active",{value:0});
        let con=document.getElementById(k.getAttribute("content")!)!;
        for(let i=0;i<k.children.length;i++){
            let ch=k.children.item(i)!.firstElementChild!;
            ch.setAttribute("onclick","act(this)");
            ch.setAttribute("href","javascript:void(0)");
            Object.defineProperty(ch,"index",{value:i});
            if(i!=0){
                ch.classList.add("inactive");
                con.children.item(i)!.toggleAttribute("nodisplay");
            }
            else{
                ch.classList.add("active");
            }
        }
    });
}

function act(e:Element){
    let p=e.parentElement!.parentElement!;
    let index=Reflect.get(e,"index");
    let active=Reflect.get(p,"active");
    if(active==index)return;
    let con=document.getElementById(p.getAttribute("content")!)!;
    p.children.item(active)!.firstElementChild!.classList.replace("active","inactive");
    con.children.item(active)!.toggleAttribute("nodisplay");
    e.classList.replace("inactive","active");
    con.children.item(index)!.toggleAttribute("nodisplay");
    Object.defineProperty(p,"active",{value:index});
}
interface Props<C=unknown>{
    children:C;
    style?:React.CSSProperties;

}

interface SidebarProps extends Props<string>{
    content:string;
}
interface PageProps extends Props{
    children:any[];
}
interface ContentProps extends Props{
    children:Page[]|Page;
    active:number;
}

class Sidebar extends React.Component<SidebarProps>{
    items:JSX.Element[];
    constructor(props:SidebarProps){
        super(props);
        this.items=props.children.split("\n").map((k,i)=>(<li><a onClick={()=>this.act(i)}>{k}</a></li>));
    }
    private act(i:number){
    }
    render(){
        return (
            <ul className="sidebar" style={this.props.style}>
                {this.items}
            </ul>
        );
    }
}
class Page extends React.Component<PageProps>{
    constructor(props:PageProps){
        super(props);
    }
    render(){
        return (
            <div style={{display:"none"}}>
                {this.props.children}
            </div>
        );
    }
}
class Content extends React.Component<ContentProps>{
    constructor(props:ContentProps){
        super(props);
    }
    render(){
        return (
            <div id="" className="content">
                {React.Children.map(this.props.children,k=>{return null;})}
            </div>
        );
    }
}
export {Sidebar,Page,Content};
