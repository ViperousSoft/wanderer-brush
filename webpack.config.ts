import webpack from "webpack";
import {CleanWebpackPlugin} from "clean-webpack-plugin";
import { glob } from "glob";
import HWP from "html-webpack-plugin";
const configmain:webpack.Configuration={
    mode:"production",
    target:"electron-main",
    entry:"./src/main/index.ts",
    output:{
        path:`${__dirname}/packed`,
        publicPath:`${__dirname}/packed/`,
    },
    module:{
        rules:[
            {
                test:/\.tsx?$/,
                exclude:/node_modules/,
                use:["ts-loader"]
            },
            {
                test:/\.(png|ico)$/,
                //type:"asset/resource"
                use:["file-loader"]
            },
        ],
        exprContextCritical:false
    },
    plugins:[
        new CleanWebpackPlugin()
    ]
};
const dep={
    about:[],
    help:[],
    index:[]
}
const config=["about","help","index"].map(k=>{
    const config:webpack.Configuration={
        mode:"production",
        target:"electron-renderer",
        entry:`./src/renderer/${k}.tsx`,
        output:{
            path:`${__dirname}/packed`,
            filename:`[fullhash].js`,
            publicPath:`${__dirname}/packed/`
        },
        resolve:{
            extensions:["js","jsx","ts","tsx","json"]
        },
        module:{
            rules:[
                {
                    test:/\.tsx?$/,
                    exclude:/node_modules/,
                    use:["ts-loader"]
                },
                {
                    test:/\.css$/,
                    use:["style-loader","css-loader"]
                }
            ]
        },
        plugins:[
            new HWP({
                inject:true,
                filename:`${k}.html`
            })
        ]
    }
    return config;
});
export default [...config,configmain];
