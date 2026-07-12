import minium
import time

PROJECT = 'G:\\dev\\study-tools-miniprogram'
mini = minium.Minium({
    'project_path': PROJECT,
    'dev_tool_path': 'I:\\微信web开发者工具\\cli.bat',
    'platform': 'ide',
    'debug_mode': 'verbose',
})

mini.app.relaunch('/pages/home/home')
time.sleep(3)

# Navigate using evaluate (no wait for route change)
nav_url = '/packages/quiz/pages/flashcard-quiz/flashcard-quiz?course=sg&yearId=sg_01_aki'
mini.app.evaluate('wx.reLaunch({url: "%s"})' % nav_url)
time.sleep(15)

# Check page state
p = mini.app.get_current_page()
d = p.data if p and hasattr(p, 'data') else {}
if callable(d):
    d = d()
print('path:', p.path if p else 'None')
print('isLoading:', d.get('isLoading'))
print('loadError:', d.get('loadError'))
print('errorDetail:', d.get('errorDetail'))
print('totalCards:', d.get('totalCards'))
print('isEmpty:', d.get('isEmpty'))
print('loadingMsg:', d.get('loadingMsg'))

mini.exit()
