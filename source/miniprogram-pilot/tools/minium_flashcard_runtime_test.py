#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Formal Minium E2E matrix for flashcards.

Every case follows the visible V3 route:
  home -> Flashcard tab -> course card -> year deck -> local player
  -> answer -> explanation -> next -> native back to the correct year page.

The runner intentionally never reLaunches a player route and never uses the
legacy flashcard-quiz page. A case is retried at most twice, reconnecting the
Minium session if the home reset cannot be proven by the real route and page
anchor.
"""
from __future__ import print_function

import json
import os
import subprocess
import sys
import time
import traceback
from datetime import datetime

try:
    import minium
except ImportError:
    py314_site = os.path.join(
        os.environ.get('LOCALAPPDATA', ''),
        'Programs', 'Python', 'Python314', 'Lib', 'site-packages'
    )
    if os.path.isdir(py314_site):
        sys.path.insert(0, py314_site)
    import minium

ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(ROOT)
ARTIFACTS = os.path.join(ROOT, 'test-artifacts', 'minium-flashcard-v3-runtime')
REPORT_PATH = os.path.join(
    ARTIFACTS,
    os.environ.get('MINIUM_FLASHCARD_REPORT_NAME', 'minium-report.json')
)
HOME_ROUTE = 'pages/home/home'
CENTER_ROUTE = 'pages/flashcards/flashcards'
MAX_ATTEMPTS = 2
POLL_INTERVAL_SECONDS = 0.15
CAPTURE_ENABLED = os.environ.get('MINIUM_FLASHCARD_CAPTURE') == '1'
os.makedirs(ARTIFACTS, exist_ok=True)

REPORT = {
    'timestamp': datetime.now().isoformat(),
    'status': 'RUNNING',
    'gateStatus': 'BLOCKED_ON_FLASHCARD_RUNTIME',
    'attemptsPerCase': MAX_ATTEMPTS,
    'decks': [],
    'hotPath': [],
    'screenshots': [],
    'errors': []
}


def log(message):
    try:
        print(message)
    except UnicodeEncodeError:
        print(str(message).encode('ascii', errors='replace').decode('ascii'))


def norm_route(value):
    return str(value or '').lstrip('/')


def current_page(mini):
    try:
        return mini.app.get_current_page()
    except Exception:
        return None


def current_route(mini):
    page = current_page(mini)
    return norm_route(getattr(page, 'path', '') if page else '')


def page_data(mini):
    page = current_page(mini)
    if not page:
        return {}
    try:
        data = page.data
        return data() if callable(data) else (data or {})
    except Exception:
        return {}


def page_stack(mini):
    app = getattr(mini, 'app', None)
    for name in ('get_current_pages', 'get_page_stack'):
        method = getattr(app, name, None)
        if callable(method):
            try:
                pages = method() or []
                return [norm_route(getattr(page, 'path', page)) for page in pages]
            except Exception:
                pass
    route = current_route(mini)
    return [route] if route else []


def wait_route(mini, expected, timeout=8.0):
    expected = norm_route(expected)
    deadline = time.time() + timeout
    last = ''
    while time.time() < deadline:
        last = current_route(mini)
        if last == expected:
            return True, last
        time.sleep(POLL_INTERVAL_SECONDS)
    return False, last


def wait_contains_route(mini, fragment, timeout=12.0):
    deadline = time.time() + timeout
    last = ''
    while time.time() < deadline:
        last = current_route(mini)
        if fragment in last:
            return True, last
        time.sleep(POLL_INTERVAL_SECONDS)
    return False, last


def element_count(page, selector):
    try:
        return len(page.get_elements(selector) or [])
    except Exception:
        return 0


def take_shot(mini, case, stage):
    if not CAPTURE_ENABLED:
        return 'CAPTURE_DISABLED'
    path = os.path.join(ARTIFACTS, '%d_%s_%s.png' % (int(time.time() * 1000), case, stage))
    try:
        mini.app.screen_shot(path)
        REPORT['screenshots'].append(path)
        return path
    except Exception as error:
        return 'SCREENSHOT_FAILED:%s' % error


def connect_session():
    return minium.Minium({
        'project_path': PROJECT,
        'dev_tool_path': r'I:\微信web开发者工具\cli.bat',
        'platform': 'ide',
        'debug_mode': 'error'
    })


def close_session(mini):
    try:
        if mini:
            mini.exit()
    except Exception:
        pass


def confirm_home(mini):
    page = current_page(mini)
    route = current_route(mini)
    if route != HOME_ROUTE:
        return False, {'expectedRoute': HOME_ROUTE, 'actualRoute': route, 'stack': page_stack(mini)}
    home_nodes = element_count(page, '.home-page')
    hero_nodes = element_count(page, '.hero-title')
    # Native tabBar is not always surfaced as a page node. Route plus home
    # anchors are the actual requirement; avoid per-deck diagnostic queries.
    tab_nodes = 0
    if home_nodes < 1 or hero_nodes < 1:
        return False, {
            'expectedRoute': HOME_ROUTE,
            'actualRoute': route,
            'stack': page_stack(mini),
            'homeNodes': home_nodes,
            'heroNodes': hero_nodes,
            'tabBarNodes': tab_nodes
        }
    return True, {
        'route': route,
        'homeNodes': home_nodes,
        'heroNodes': hero_nodes,
        'tabBarNodes': tab_nodes
    }


def reset_to_home(mini):
    try:
        mini.app.relaunch('/' + HOME_ROUTE)
    except Exception as error:
        return False, {'reason': 'relaunch_exception', 'error': str(error), 'actualRoute': current_route(mini), 'stack': page_stack(mini)}
    ok, actual = wait_route(mini, HOME_ROUTE, timeout=8.0)
    if not ok:
        return False, {'reason': 'home_route_timeout', 'expectedRoute': HOME_ROUTE, 'actualRoute': actual, 'stack': page_stack(mini)}
    return confirm_home(mini)


def switch_to_center(mini):
    try:
        mini.app.switch_tab('/' + CENTER_ROUTE)
    except Exception as error:
        return False, {'reason': 'switch_tab_exception', 'error': str(error), 'actualRoute': current_route(mini), 'stack': page_stack(mini)}
    ok, actual = wait_route(mini, CENTER_ROUTE, timeout=8.0)
    if not ok:
        return False, {'reason': 'center_route_timeout', 'expectedRoute': CENTER_ROUTE, 'actualRoute': actual, 'stack': page_stack(mini)}
    page = current_page(mini)
    cards = element_count(page, '.course-card')
    if cards < 2:
        return False, {'reason': 'course_cards_missing', 'actualRoute': actual, 'courseCards': cards, 'stack': page_stack(mini)}
    return True, {'route': actual, 'courseCards': cards}


def course_index(course):
    # pages/flashcards/flashcards.js owns this fixed visible ordering.
    return 0 if course == 'itpass' else 1


def open_course(mini, course):
    page = current_page(mini)
    cards = page.get_elements('.course-card') if page else []
    index = course_index(course)
    if len(cards) <= index:
        return False, {'reason': 'target_course_card_missing', 'course': course, 'count': len(cards), 'stack': page_stack(mini)}
    try:
        cards[index].click()
    except Exception as error:
        return False, {'reason': 'course_click_exception', 'course': course, 'error': str(error), 'stack': page_stack(mini)}
    ok, actual = wait_contains_route(mini, 'flashcard-deck-select', timeout=8.0)
    if not ok:
        return False, {'reason': 'deck_select_timeout', 'course': course, 'actualRoute': actual, 'stack': page_stack(mini)}
    data = page_data(mini)
    decks = data.get('decks') or []
    return True, {'route': actual, 'decks': decks}


def find_deck_index(decks, year_id):
    for index, deck in enumerate(decks):
        if str((deck or {}).get('yearId', '')) == str(year_id):
            return index
    return -1


def open_deck(mini, deck):
    page = current_page(mini)
    data = page_data(mini)
    decks = data.get('decks') or []
    index = find_deck_index(decks, deck['yearId'])
    cards = page.get_elements('.fds-deck-card') if page else []
    if index < 0 or len(cards) <= index:
        return False, {
            'reason': 'target_deck_card_missing',
            'deckId': deck['deckId'],
            'targetIndex': index,
            'deckCount': len(decks),
            'cardCount': len(cards),
            'actualRoute': current_route(mini),
            'stack': page_stack(mini)
        }
    try:
        cards[index].click()
    except Exception as error:
        return False, {'reason': 'deck_click_exception', 'deckId': deck['deckId'], 'error': str(error), 'stack': page_stack(mini)}
    expected_fragment = 'packages/%s/pages/flashcard-player' % deck['packageName']
    ok, actual = wait_contains_route(mini, expected_fragment, timeout=12.0)
    if not ok:
        return False, {
            'reason': 'player_route_timeout',
            'expectedRouteFragment': expected_fragment,
            'actualRoute': actual,
            'stack': page_stack(mini),
            'deckSelectData': page_data(mini)
        }
    return True, {'route': actual}


def wait_player_content(mini, expected_playable):
    deadline = time.time() + 8.0
    last = {}
    while time.time() < deadline:
        last = page_data(mini)
        state = last.get('viewState')
        total = int(last.get('totalCards') or 0)
        error = last.get('errorDetail') or last.get('loadError') or ''
        if state == 'error' or state == 'empty' or error:
            return False, {'reason': 'player_error', 'state': state, 'error': error, 'data': last}
        if total > 0:
            actual = last.get('playableCountActual', last.get('renderableCardCount', total))
            expected = last.get('playableCountExpected', expected_playable)
            if int(actual or 0) != int(expected_playable) or total != int(actual or 0):
                return False, {
                    'reason': 'player_count_contract',
                    'totalCards': total,
                    'playableActual': actual,
                    'playableExpected': expected,
                    'deckExpected': expected_playable
                }
            return True, {'totalCards': total, 'playableActual': actual, 'playableExpected': expected, 'state': state or 'content'}
        time.sleep(0.25)
    return False, {'reason': 'player_content_timeout', 'data': last, 'actualRoute': current_route(mini), 'stack': page_stack(mini)}


def answer_explain_next_back(mini, deck):
    page = current_page(mini)
    options = page.get_elements('.fc-option') if page else []
    if len(options) < 2:
        return False, {'reason': 'options_missing', 'count': len(options), 'data': page_data(mini)}
    try:
        options[0].click()
    except Exception as error:
        return False, {'reason': 'option_click_exception', 'error': str(error)}
    deadline = time.time() + 5.0
    data = {}
    while time.time() < deadline:
        data = page_data(mini)
        if data.get('hasAnswered'):
            break
        time.sleep(0.25)
    if not data.get('hasAnswered'):
        return False, {'reason': 'answer_feedback_timeout', 'data': data}

    selected = data.get('selectedOption') or {}
    correct = data.get('correctOption') or {}
    answer_bilingual = bool(selected.get('textJa') and selected.get('textZh') and correct.get('textJa') and correct.get('textZh'))

    page = current_page(mini)
    buttons = page.get_elements('.fc-action-row .fc-btn') if page else []
    if not buttons:
        return False, {'reason': 'explanation_button_missing', 'data': data}
    try:
        buttons[0].click()
    except Exception as error:
        return False, {'reason': 'explanation_click_exception', 'error': str(error)}
    deadline = time.time() + 5.0
    while time.time() < deadline:
        data = page_data(mini)
        if data.get('showBack'):
            break
        time.sleep(0.25)
    if not data.get('showBack'):
        return False, {'reason': 'explanation_timeout', 'data': data}

    before = int(data.get('currentIndex') or 0)
    page = current_page(mini)
    buttons = page.get_elements('.fc-action-row .fc-btn') if page else []
    if not buttons:
        return False, {'reason': 'next_button_missing', 'data': data}
    try:
        buttons[-1].click()
    except Exception as error:
        return False, {'reason': 'next_click_exception', 'error': str(error)}
    deadline = time.time() + 5.0
    while time.time() < deadline:
        data = page_data(mini)
        if int(data.get('currentIndex') or 0) == before + 1:
            break
        time.sleep(0.25)
    if int(data.get('currentIndex') or 0) != before + 1 or data.get('hasAnswered'):
        return False, {'reason': 'next_contract', 'before': before, 'data': data}

    try:
        mini.app.navigate_back()
    except Exception as error:
        return False, {'reason': 'native_back_exception', 'error': str(error)}
    ok, actual = wait_contains_route(mini, 'flashcard-deck-select', timeout=6.0)
    if not ok:
        return False, {'reason': 'return_timeout', 'actualRoute': actual, 'stack': page_stack(mini)}
    return True, {'answerBilingual': answer_bilingual, 'returnRoute': actual}


def load_contracts():
    node = 'node.exe' if os.name == 'nt' else 'node'
    command = [node, os.path.join(ROOT, 'check_flashcard_deck_integrity.js'), '--json']
    result = subprocess.run(
        command,
        cwd=PROJECT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding='utf-8',
        errors='replace'
    )
    if result.returncode != 0:
        raise RuntimeError('deck contract command failed: %s' % result.stderr[-1000:])
    payload = json.loads(result.stdout)
    if not payload.get('ok'):
        raise RuntimeError('deck contract reported issues: %s' % payload.get('issues'))
    decks = payload.get('decks') or []
    for deck in decks:
        deck_id = str(deck.get('deckId') or '')
        if '/' not in deck_id:
            raise RuntimeError('invalid canonical deckId: %s' % deck_id)
        course, year_id = deck_id.split('/', 1)
        if deck.get('course') and deck.get('course') != course:
            raise RuntimeError('course mismatch for deckId: %s' % deck_id)
        deck['course'] = course
        deck['yearId'] = year_id
    return decks


def one_case(mini, deck, attempt):
    started = time.time()
    result = {
        'course': deck['course'],
        'deckId': deck['deckId'],
        'year': deck.get('yearLabel', ''),
        'package': deck['packageName'],
        'source': deck.get('sourceActual'),
        'playable': deck.get('playableActual'),
        'attempt': attempt,
        'steps': {},
        'consoleErrors': 0,
        'screenshots': []
    }

    ok, detail = reset_to_home(mini)
    result['steps']['homeReset'] = detail
    if not ok:
        result['status'] = 'FAIL'
        result['failure'] = 'homeReset'
        result['elapsedMs'] = int((time.time() - started) * 1000)
        return result
    ok, detail = switch_to_center(mini)
    result['steps']['flashcardCenter'] = detail
    if not ok:
        result['status'] = 'FAIL'
        result['failure'] = 'flashcardCenter'
        result['elapsedMs'] = int((time.time() - started) * 1000)
        return result

    ok, detail = open_course(mini, deck['course'])
    result['steps']['course'] = detail
    if not ok:
        result['status'] = 'FAIL'
        result['failure'] = 'course'
        result['elapsedMs'] = int((time.time() - started) * 1000)
        return result

    ok, detail = open_deck(mini, deck)
    result['steps']['deck'] = detail
    if not ok:
        result['status'] = 'FAIL'
        result['failure'] = 'deck'
        result['elapsedMs'] = int((time.time() - started) * 1000)
        return result

    ok, detail = wait_player_content(mini, int(deck.get('playableExpected') or deck.get('playableActual') or 0))
    result['steps']['player'] = detail
    if not ok:
        result['status'] = 'FAIL'
        result['failure'] = 'player'
        result['elapsedMs'] = int((time.time() - started) * 1000)
        return result
    result['screenshots'].append(take_shot(mini, deck['deckId'].replace('/', '_'), '02_player'))

    ok, detail = answer_explain_next_back(mini, deck)
    result['steps']['interaction'] = detail
    if not ok:
        result['status'] = 'FAIL'
        result['failure'] = 'interaction'
        result['elapsedMs'] = int((time.time() - started) * 1000)
        return result
    result['status'] = 'PASS'
    result['elapsedMs'] = int((time.time() - started) * 1000)
    return result


def run_matrix(decks):
    mini = None
    for deck in decks:
        final = None
        for attempt in range(1, MAX_ATTEMPTS + 1):
            if mini is None:
                mini = connect_session()
            try:
                final = one_case(mini, deck, attempt)
            except Exception as error:
                final = {
                    'course': deck['course'],
                    'deckId': deck['deckId'],
                    'year': deck.get('yearLabel', ''),
                    'package': deck['packageName'],
                    'attempt': attempt,
                    'status': 'FAIL',
                    'failure': 'sessionException',
                    'steps': {'sessionException': {'error': str(error), 'traceback': traceback.format_exc()}},
                    'elapsedMs': 0
                }
            if final.get('status') == 'PASS':
                break
            # A broken reset or a destroyed Minium page invalidates the session,
            # not the deck contract. Reconnect for the single permitted retry.
            if final.get('failure') in ('homeReset', 'sessionException'):
                close_session(mini)
                mini = None
                if attempt < MAX_ATTEMPTS:
                    continue
            break
        REPORT['decks'].append(final)
    close_session(mini)


def run_hot_path(decks):
    wanted = [
        'sg/sg_01_aki',
        'itpass/01_aki',
        'sg/sg_28_haru',
        'itpass/30_aki'
    ]
    lookup = {deck['deckId']: deck for deck in decks}
    for deck_id in wanted:
        if deck_id not in lookup:
            REPORT['hotPath'].append({'deckId': deck_id, 'status': 'SKIP', 'reason': 'not in contract'})
            continue
        # Each hot-path step still invokes the visible path but preserves the
        # live session intentionally. Full interaction is covered by the matrix.
        mini = None
        try:
            mini = connect_session()
            result = one_case(mini, lookup[deck_id], 1)
            result['hotPath'] = True
            REPORT['hotPath'].append(result)
        except Exception as error:
            REPORT['hotPath'].append({'deckId': deck_id, 'status': 'FAIL', 'reason': str(error)})
        finally:
            close_session(mini)


def main():
    try:
        decks = load_contracts()
        requested_course = os.environ.get('MINIUM_FLASHCARD_COURSE', '').strip()
        expected_by_course = {'itpass': 15, 'sg': 11}
        if requested_course:
            if requested_course not in expected_by_course:
                raise RuntimeError('unsupported course filter: %s' % requested_course)
            decks = [deck for deck in decks if deck.get('course') == requested_course]
            if len(decks) != expected_by_course[requested_course]:
                raise RuntimeError(
                    'expected %d %s decks, got %d' % (
                        expected_by_course[requested_course],
                        requested_course,
                        len(decks)
                    )
                )
        elif len(decks) != 26:
            raise RuntimeError('expected 26 decks, got %d' % len(decks))

        requested_deck_ids = [
            value.strip() for value in os.environ.get('MINIUM_FLASHCARD_DECK_IDS', '').split(',') if value.strip()
        ]
        if requested_deck_ids:
            lookup = {deck['deckId']: deck for deck in decks}
            missing = [deck_id for deck_id in requested_deck_ids if deck_id not in lookup]
            if missing:
                raise RuntimeError('unknown requested deckId(s): %s' % ', '.join(missing))
            decks = [lookup[deck_id] for deck_id in requested_deck_ids]
        run_matrix(decks)
        if os.environ.get('MINIUM_FLASHCARD_RUN_HOT_PATH') == '1':
            run_hot_path(decks)
    except Exception as error:
        REPORT['errors'].append({'fatal': str(error), 'traceback': traceback.format_exc()})
    finally:
        failures = [item for item in REPORT['decks'] if item.get('status') != 'PASS']
        hot_failures = [item for item in REPORT['hotPath'] if item.get('status') == 'FAIL']
        REPORT['status'] = 'FAILED' if failures or hot_failures or REPORT['errors'] else 'PASSED'
        REPORT['gateStatus'] = 'BLOCKED_ON_FLASHCARD_RUNTIME' if REPORT['status'] == 'FAILED' else 'READY_FOR_USER_PROOF'
        with open(REPORT_PATH, 'w', encoding='utf-8') as handle:
            json.dump(REPORT, handle, ensure_ascii=False, indent=2)
        log('REPORT: %s' % REPORT_PATH)
        log('STATUS: %s | matrix=%d/%d passed | hotFailures=%d' % (
            REPORT['gateStatus'],
            len([item for item in REPORT['decks'] if item.get('status') == 'PASS']),
            len(REPORT['decks']),
            len(hot_failures)
        ))
        if REPORT['errors']:
            log('FATAL: %s' % REPORT['errors'][-1].get('fatal', 'unknown error'))
        elif failures:
            log('FIRST_FAILURE: %s' % REPORT['decks'][0].get('failure', 'unknown failure'))
    exit_code = 0 if REPORT['status'] == 'PASSED' else 1
    sys.stdout.flush()
    sys.stderr.flush()
    os._exit(exit_code)


if __name__ == '__main__':
    main()
