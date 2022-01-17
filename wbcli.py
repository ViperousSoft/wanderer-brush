import selenium.webdriver as driver
import selenium.webdriver.support.ui as ui
import os
import copy
import argparse
import time

def main():
    parser=argparse.ArgumentParser(prog='wbcli',allow_abbrev=False)
    parser.add_argument('-c','--count',type=int,help='the number of wanderers you want')
    parser.add_argument('-t','--tribe',help='the tribe name')
    parser.add_argument('-g','--group',help='the group name')
    parser.add_argument('-m','--mode',choices=['tribes','castle'],required=True,help='game mode')
    parser.add_argument('-a','--audio',action='store_false',help='turn on the background music')
    parser.set_defaults(count=1,tribe='',group='')
    option=parser.parse_args()
    count,tn,gn,mode,mute=option.count,option.tribe,option.group,(option.mode=='castle'),option.audio
    if count<=0:parser.error('illegal argument: count')

    os.system('ipconfig /flushdns')
    opt=driver.ChromeOptions()
    opt.add_argument('--disable-gpu')
    opt.add_argument('--disable-images')
    opt.add_argument('--disable-plugins')
    opt.add_argument('--headless')
    opt.add_argument('--no-sandbox')
    if mute:opt.add_argument('--mute-audio')

    dc=copy.deepcopy(driver.DesiredCapabilities.CHROME)
    dc['pageLoadStrategy']='none'

    drive=driver.Chrome('chromedriver72.exe',options=opt,desired_capabilities=dc)
    drive.get('https://wanderers.io')
    ui.WebDriverWait(drive,600).until(lambda x:x.find_element_by_css_selector('a.showMainMenu') and x.find_element_by_css_selector('div div div div div a:nth-of-type(2)') and x.find_element_by_css_selector('input.groupName') and x.find_element_by_css_selector('input.tribeName') and x.find_element_by_css_selector('a.button.start.primary.flex-grow-2'))
    print('Page loaded')
    ac=driver.ActionChains(drive)
    ac.click(drive.find_element_by_css_selector('a.showMainMenu'))
    ac.send_keys_to_element(drive.find_element_by_css_selector('input.groupName'),gn)
    ac.send_keys_to_element(drive.find_element_by_css_selector('input.tribeName'),tn)
    ac.perform()

    for i in range(count):
        drive.execute_script('window.open("https://wanderers.io","_blank","modal=false,alwaysRaised=yes")')
        drive.switch_to.window(drive.window_handles[-1])
        drive.execute_async_script(
        '''
            arguments[1]();

            let gen=function(t){
                return new Promise(function(res){
                    setTimeout(res,t);
                });
            }

            let wait=async function(str){
                while(document.querySelectorAll(str).length==0){
                    await gen(50);
                }
            }

            if(arguments[0]){
                Promise.all([wait("a.showMainMenu"),wait("div div div div div a:nth-of-type(2)"),wait("a.button.start.primary.flex-grow-2")]).then(function(){
                    document.querySelectorAll("a.showMainMenu").forEach(function(e){
                        e.click();
                    });
                    document.querySelectorAll("div div div div div a:nth-of-type(2)").forEach(function(e){
                        e.click();
                    });
                    document.querySelectorAll("a.button.start.primary.flex-grow-2").forEach(function(e){
                        e.click();
                    });
                });
            }
            else{
                Promise.all([wait("a.showMainMenu"),wait("div div div div div a:nth-of-type(2)"),wait("a.button.start.primary.flex-grow-2")]).then(function(){
                    document.querySelectorAll("a.showMainMenu").forEach(function(e){
                        e.click();
                    });
                    document.querySelectorAll("a.button.start.primary.flex-grow-2").forEach(function(e){
                        e.click();
                    });
                });
            }

            wait("div.LeaderboardWindow").then(function(){
                setTimeout(function(){
                    window.close();
                },500);
            });
        '''
        ,mode)
    while len(drive.window_handles)>=2:time.sleep(0.1)
    drive.quit()

if __name__=='__main__':
    main()
