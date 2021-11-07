import selenium.webdriver as driver
import selenium.webdriver.support.ui as ui
import msedge.selenium_tools as st
import os
import sys

def main():
    os.system('ipconfig /flushdns')
    gn,tn='xjp','jp'
    if len(sys.argv)<=1 or len(sys.argv)>=5 or sys.argv[1]!='gK':return
    if len(sys.argv)>=3:gn=sys.argv[2]
    if len(sys.argv)==4:tn=sys.argv[3]
    opt=st.EdgeOptions()
    opt.use_chromium=True
    opt.headless=True
    opt.add_argument('disable-gpu')
    drive=st.Edge('msedgedriver95.exe',options=opt)
    drive.get('https://wanderers.io')
    ui.WebDriverWait(drive,600).until(lambda x:x.find_element_by_css_selector('a.showMainMenu') and x.find_element_by_css_selector('div div div div div a:nth-of-type(2)') and x.find_element_by_css_selector('input.groupName') and x.find_element_by_css_selector('input.tribeName') and x.find_element_by_css_selector('a.button.start.primary.flex-grow-2'))
    print('Page loaded')
    ac=driver.ActionChains(drive)
    ac.click(drive.find_element_by_css_selector('a.showMainMenu'))
    ac.click(drive.find_element_by_css_selector('div div div div div a:nth-of-type(2)'))
    ac.send_keys_to_element(drive.find_element_by_css_selector('input.groupName'),gn)
    ac.send_keys_to_element(drive.find_element_by_css_selector('input.tribeName'),tn)
    ac.click(drive.find_element_by_css_selector('a.button.start.primary.flex-grow-2'))
    ac.perform()
    ui.WebDriverWait(drive,600).until(lambda x:x.find_element_by_css_selector('div.window-handle'))
    drive.quit()

if __name__=='__main__':
    main()
