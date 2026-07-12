#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Capture ordinary DevTools simulator evidence for today's UI-only polish."""
from __future__ import print_function

import json
import os
import sys
import time

try:
    import minium
except ImportError:
    py_site = os.path.join(os.environ.get('LOCALAPPDATA', ''), 'Programs', 'Python', 'Python314', 'Lib', 'site-packages')
    if os.path.isdir(py_site):
        sys.path.insert(0, py_site)
    import minium

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTIFACTS = os.path.join(ROOT, 'tools', 'test-artifacts', 'ui-polish-today')
os.makedirs(ARTIFACTS, exist_ok=True)
REPORT = {'status': 'RUNNING', 'screenshots': [], 'steps': []}


def route(mini):
    page = mini.app.get_current_page()
    return getattr(page, 'path', '') if page else ''


def wait_route(mini, fragment, timeout=8):
    deadline = time.time() + timeout
    last = ''
    while time.time() < deadline:
        last = route(mini)
        if fragment in last:
            return last
        time.sleep(0.25)
    raise RuntimeError('expected route fragment %s, got %s' % (fragment, last))


def shot(mini, filename):
    target = os.path.join(ARTIFACTS, filename)
    mini.app.screen_shot(target)
    if not os.path.exists(target) or os.path.getsize(target) < 100:
        raise RuntimeError('screenshot not written: ' + target)
    REPORT['screenshots'].append(target)


def main():
    mini = None
    try:
        mini = minium.Minium({
            'project_path': ROOT,
            'dev_tool_path': r'I:\微信web开发者工具\cli.bat',
            'platform': 'ide',
            'debug_mode': 'verbose'
        })
        mini.app.relaunch('/pages/home/home')
        REPORT['steps'].append({'homeRoute': wait_route(mini, 'pages/home/home')})
        shot(mini, '02-home-after.png')
        mini.app.switch_tab('/pages/flashcards/flashcards')
        REPORT['steps'].append({'flashcardsRoute': wait_route(mini, 'pages/flashcards/flashcards')})
        page = mini.app.get_current_page()
        cards = page.get_elements('.course-card') if page else []
        icons = page.get_elements('.course-icon-glyph') if page else []
        if len(cards) != 3 or len(icons) != 3:
            raise RuntimeError('expected 3 flashcard modules/icons, got %s/%s' % (len(cards), len(icons)))
        REPORT['steps'].append({'moduleCards': len(cards), 'moduleIcons': len(icons)})
        shot(mini, '04-flashcards-after.png')
        REPORT['status'] = 'PASSED'
    except Exception as error:
        REPORT['status'] = 'FAILED'
        REPORT['error'] = str(error)
    finally:
        report_file = os.path.join(ARTIFACTS, 'ui-polish-minium-capture-report.json')
        with open(report_file, 'w', encoding='utf-8') as handle:
            json.dump(REPORT, handle, ensure_ascii=False, indent=2)
        print('REPORT: ' + report_file)
        print('STATUS: ' + REPORT['status'])
        try:
            if mini:
                mini.exit()
        except Exception:
            pass
    return 0 if REPORT['status'] == 'PASSED' else 1


if __name__ == '__main__':
    sys.exit(main())
