import selenium.webdriver as driver
import selenium.webdriver.support.ui as ui
import os
import sys
import copy

def main():
    os.system('ipconfig /flushdns')
    gn,tn='xjp','jp'
    if len(sys.argv)<=1 or len(sys.argv)>=5 or sys.argv[1]!='gK':return
    if len(sys.argv)>=3:gn=sys.argv[2]
    if len(sys.argv)==4:tn=sys.argv[3]

    opt=driver.ChromeOptions()
    opt.add_argument('--disable-gpu')
    opt.add_argument('--disable-images')
    opt.add_argument('--disable-plugins')
    opt.add_argument('--headless')
    opt.add_argument('--no-sandbox')
    opt.add_argument('--mute-audio')

    dc=copy.deepcopy(driver.DesiredCapabilities.CHROME)
    dc['pageLoadStrategy']='none'

    drive=driver.Chrome('chromedriver72.exe',options=opt,desired_capabilities=dc)
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
    ui.WebDriverWait(drive,600).until(lambda x:x.find_element_by_css_selector('div.LeaderboardWindow'))
    drive.quit()

if __name__=='__main__':
    main()
