const translations = {
    en: {
        "sys_status": "SYSTEM STATUS:",
        "status_secure": "SECURE",
        "status_intrusion": "INTRUSION IN PROGRESS",
        "status_lockdown": "LOCKDOWN",
        "status_compromised": "COMPROMISED",
        "time_rem": "TIME REMAINING:",
        "stage": "STAGE:",
        
        "start_title": "HACKER BREACH",
        "start_init": "INITIALIZING INTRUSION SEQUENCE...",
        "start_obj": "OBJECTIVE: BYPASS ALL 10 SECURITY LAYERS.",
        "start_time": "TIME LIMIT: 300 SECONDS PER LAYER.",
        "btn_start": "[ INITIATE BREACH ]",
        
        "connecting": "Connecting...",
        "standby": "Standby for security challenge.",
        
        "fail_title": "BREACH FAILED",
        "fail_desc": "INTRUSION DETECTED. SYSTEM LOCKDOWN INITIATED.",
        "btn_retry": "[ RETRY CONNECTION ]",
        
        "win_title": "SYSTEM COMPROMISED",
        "win_desc1": "FULL ROOT ACCESS GRANTED.",
        "win_desc2": "ALL SECURITY LAYERS BYPASSED.",
        "btn_new": "[ NEW TARGET ]",
        
        "stage_complete_msg": "SECURITY LAYER BYPASSED. PROCEEDING...",
        
        // Puzzles Base
        "stage1_title": "Stage 1: Logic Sequence",
        "stage1_desc": "Complete the sequence to bypass the firewall.",
        "btn_inject": "INJECT",
        "pattern_accept": "PATTERN ACCEPTED",
        "pattern_fail": "INVALID PATTERN",
        
        "stage2_title": "Stage 2: Memory Access",
        "stage2_desc": "Memorize the sequence of nodes and reproduce it.",
        "watch": "WATCH CLOSELY...",
        "reproduce": "REPRODUCE SEQUENCE",
        "mem_corrupt": "MEMORY CORRUPTED",
        "mem_success": "MEMORY EXTRACTED SUCCESSFULLY",
        
        "stage3_title": "Stage 3: Logic Pin",
        "stage3_desc": "Crack the 3-digit PIN. Digits are 1-6.",
        "btn_crack": "CRACK",
        "pin_accept": "PIN ACCEPTED",
        "pin_fail": "ACCESS DENIED",
        "pin_len_err": "PIN MUST BE 3 DIGITS",
        
        "stage4_title": "Stage 4: Decryption",
        "stage4_desc": "Decrypt the payload using a Shift Cipher.",
        "btn_decrypt": "DECRYPT",
        "dec_success": "PAYLOAD DECRYPTED",
        "dec_fail": "DECRYPTION FAILED",
        
        "stage5_title": "Stage 5: Node Routing",
        "stage5_desc": "Rotate the nodes to create a continuous connection from S to E.",
        "route_success": "ROUTING ESTABLISHED",
        
        "stage6_title": "Stage 6: Machine Code Injection",
        "stage6_desc": "Convert the Binary/Hex values to Decimal to find the port.",
        "btn_connect": "CONNECT",
        "port_connect": "PORT CONNECTED",
        "port_fail": "CONNECTION REFUSED",
        
        "stage7_title": "Stage 7: IDS Bypass (Logic)",
        "stage7_desc": "Solve the system variables to bypass Intrusion Detection.",
        "btn_bypass": "BYPASS",
        "ids_bypass": "IDS BYPASSED",
        "ids_fail": "IDS ALERT: MISMATCH",
        
        "stage8_title": "Stage 8: Admin Hash",
        "stage8_desc": "Decrypt the Vigenère cipher. Formula: P_i = (C_i - K_i) mod 26",
        "hash_success": "ADMIN HASH CRACKED",
        "hash_fail": "INVALID HASH",
        
        "stage9_title": "Stage 9: Hardware Override",
        "stage9_desc": "Set the input bits so the final output is 1.",
        "btn_exec": "EXECUTE",
        "hw_success": "HARDWARE OVERRIDDEN",
        "hw_fail": "POWER SURGE DETECTED",
        
        "stage10_title": "Stage 10: The Mainframe",
        "stage10_desc": "Write assembly instructions to make AX = 42.",
        "btn_compile": "COMPILE & RUN",
        "asm_success": "ROOT ACCESS GRANTED",
        "asm_fail": "SEGMENTATION FAULT",
        
        "syntax_err": "SYNTAX ERROR AT LINE",
        "btn_hint": "REQUEST HINT",
        "hint_1": "Hint: Observe how the numbers increase. Are they multiplying by 2? Or adding previous numbers?",
        "hint_2": "Hint: Focus on one block at a time. Trace the path with your finger if needed.",
        "hint_3": "Hint: Matches = right number & right spot. Present = right number but wrong spot.",
        "hint_4": "Hint: A shift of -2 means C becomes A. Write down the alphabet and shift it back.",
        "hint_5": "Hint: Make sure all lines connect directly from the 'S' block to the 'E' block without any dead ends on the path.",
        "hint_6": "Hint: BIN: 101 = (1*4) + (0*2) + (1*1) = 5. HEX: A=10, B=11, C=12, D=13, E=14, F=15.",
        "hint_7": "Hint: Try adding the first two equations, then use the third one to find the missing variables. Or just guess and check!",
        "hint_8": "Hint: A=0, B=1, C=2... Convert letters to numbers. Cipher - Key = Plain. If negative, add 26. Then convert back to letter.",
        "hint_9": "Hint: AND outputs 1 only if BOTH are 1. XOR outputs 1 only if they are DIFFERENT.",
        "hint_10": "Hint: AX starts at 0. You need to end up with exactly 42 using ADD, SUB, MUL, or XOR."
    },
    ko: {
        "sys_status": "시스템 상태:",
        "status_secure": "보안 유지됨",
        "status_intrusion": "침입 진행 중",
        "status_lockdown": "시스템 차단됨",
        "status_compromised": "보안 뚫림",
        "time_rem": "남은 시간:",
        "stage": "스테이지:",
        
        "start_title": "해커 브리치",
        "start_init": "침입 시퀀스 초기화 중...",
        "start_obj": "목표: 10개의 보안 계층을 모두 우회하십시오.",
        "start_time": "제한 시간: 각 계층당 300초.",
        "btn_start": "[ 해킹 시작 ]",
        
        "connecting": "연결 중...",
        "standby": "보안 챌린지 대기 중.",
        
        "fail_title": "해킹 실패",
        "fail_desc": "침입이 탐지되었습니다. 시스템을 차단합니다.",
        "btn_retry": "[ 연결 재시도 ]",
        
        "win_title": "시스템 탈취 성공",
        "win_desc1": "루트 권한이 성공적으로 부여되었습니다.",
        "win_desc2": "모든 보안 계층을 무력화했습니다.",
        "btn_new": "[ 새로운 타겟 찾기 ]",
        
        "stage_complete_msg": "보안 계층 우회 완료. 다음 단계로 진입합니다...",
        
        // Puzzles Base
        "stage1_title": "스테이지 1: 논리 패턴",
        "stage1_desc": "패턴의 빈칸을 채워 방화벽을 우회하세요.",
        "btn_inject": "코드 주입",
        "pattern_accept": "패턴 승인됨",
        "pattern_fail": "잘못된 패턴",
        
        "stage2_title": "스테이지 2: 메모리 액세스",
        "stage2_desc": "노드가 깜빡이는 순서를 기억하고 똑같이 입력하세요.",
        "watch": "순서를 잘 기억하세요...",
        "reproduce": "순서대로 입력하세요",
        "mem_corrupt": "메모리 손상됨",
        "mem_success": "메모리 추출 성공",
        
        "stage3_title": "스테이지 3: 논리 핀 번호",
        "stage3_desc": "3자리 PIN을 해킹하세요. (1~6 숫자 사용)",
        "btn_crack": "해킹",
        "pin_accept": "PIN 승인됨",
        "pin_fail": "접근 거부됨",
        "pin_len_err": "PIN은 3자리여야 합니다",
        
        "stage4_title": "스테이지 4: 암호 해독",
        "stage4_desc": "시저 암호(알파벳 이동)로 된 페이로드를 해독하세요.",
        "btn_decrypt": "해독",
        "dec_success": "페이로드 해독 완료",
        "dec_fail": "해독 실패",
        
        "stage5_title": "스테이지 5: 노드 라우팅",
        "stage5_desc": "노드를 회전시켜 S에서 E까지 선이 이어지도록 만드세요.",
        "route_success": "라우팅 연결 완료",
        
        "stage6_title": "스테이지 6: 기계어 주입",
        "stage6_desc": "2진수/16진수를 10진수로 변환하여 포트를 찾으세요.",
        "btn_connect": "연결",
        "port_connect": "포트 연결됨",
        "port_fail": "연결 거부됨",
        
        "stage7_title": "스테이지 7: IDS 우회",
        "stage7_desc": "침입 탐지 시스템을 속이기 위해 변수값을 맞추세요.",
        "btn_bypass": "우회",
        "ids_bypass": "IDS 우회 완료",
        "ids_fail": "IDS 경보: 값 불일치",
        
        "stage8_title": "스테이지 8: 관리자 해시",
        "stage8_desc": "비즈네르 암호를 해독하세요. 힌트: P_i = (C_i - K_i) mod 26",
        "hash_success": "관리자 해시 크래킹 완료",
        "hash_fail": "잘못된 해시",
        
        "stage9_title": "스테이지 9: 하드웨어 오버라이드",
        "stage9_desc": "스위치를 조작해 최종 출력이 1이 되게 만드세요.",
        "btn_exec": "실행",
        "hw_success": "하드웨어 제어 성공",
        "hw_fail": "전력 과부하 감지",
        
        "stage10_title": "스테이지 10: 메인프레임",
        "stage10_desc": "어셈블리 명령어를 사용해 레지스터 AX 값을 42로 만드세요.",
        "btn_compile": "컴파일 및 실행",
        "asm_success": "루트 권한 획득 성공",
        "asm_fail": "세그먼테이션 오류 발생",
        
        "syntax_err": "구문 오류 발생 - 라인 ",
        "btn_hint": "힌트 요청",
        "hint_1": "힌트: 숫자가 어떻게 증가하는지 보세요. 2배씩 늘어나나요? 아니면 앞의 숫자들을 더하나요?",
        "hint_2": "힌트: 한 번에 하나씩 집중하세요. 손가락으로 가리키며 외우는 것도 좋습니다.",
        "hint_3": "힌트: Matches(완전일치)는 숫자와 위치가 모두 맞음. Present(부분일치)는 숫자는 맞는데 위치가 틀림.",
        "hint_4": "힌트: SHIFT -2는 C가 A가 된다는 뜻입니다. 알파벳을 종이에 적어놓고 이동시켜 보세요.",
        "hint_5": "힌트: S 타일에서 E 타일까지 선이 끊기지 않고 이어지도록 타일을 클릭해 회전시키세요.",
        "hint_6": "힌트: 이진수(BIN) 101 = 4+0+1=5. 16진수(HEX) A=10, B=11, C=12, D=13, E=14, F=15.",
        "hint_7": "힌트: 세 방정식을 모두 더하면 2(X+Y+Z) = A+B+C 가 됩니다. 여기서 X, Y, Z를 구해보세요.",
        "hint_8": "힌트: A=0, B=1, C=2... 글자를 숫자로 바꾼 뒤, [암호문 - 키 = 원문] 입니다. 음수면 26을 더하세요.",
        "hint_9": "힌트: AND는 둘 다 1일때만 1. XOR는 서로 다를 때만 1이 나옵니다. 조합을 생각해보세요.",
        "hint_10": "힌트: 시작값 0에서 3개의 명령어만 써서 정확히 42를 만들어야 합니다."
    },
    ja: {
        "sys_status": "システムステータス:",
        "status_secure": "安全",
        "status_intrusion": "侵入進行中",
        "status_lockdown": "ロックダウン",
        "status_compromised": "システム侵害",
        "time_rem": "残り時間:",
        "stage": "ステージ:",
        
        "start_title": "ハッカーブリーチ",
        "start_init": "侵入シーケンス初期化中...",
        "start_obj": "目標: 10個のセキュリティ層をすべてバイパスせよ。",
        "start_time": "制限時間: 各層300秒。",
        "btn_start": "[ ハッキング開始 ]",
        
        "connecting": "接続中...",
        "standby": "セキュリティチャレンジ待機中。",
        
        "fail_title": "ハッキング失敗",
        "fail_desc": "侵入が検知されました。システムをロックダウンします。",
        "btn_retry": "[ 再接続 ]",
        
        "win_title": "システム掌握",
        "win_desc1": "ルート権限の取得に成功しました。",
        "win_desc2": "すべてのセキュリティ層をバイパスしました。",
        "btn_new": "[ 新しいターゲット ]",
        
        "stage_complete_msg": "セキュリティ層バイパス完了。進行中...",
        
        // Puzzles Base
        "stage1_title": "ステージ 1: 論理シーケンス",
        "stage1_desc": "パターンの空欄を埋めてファイアウォールをバイパスせよ。",
        "btn_inject": "インジェクト",
        "pattern_accept": "パターン承認",
        "pattern_fail": "無効なパターン",
        
        "stage2_title": "ステージ 2: メモリアクセス",
        "stage2_desc": "ノードが点滅する順番を記憶し、再現せよ。",
        "watch": "順番を記憶せよ...",
        "reproduce": "順番に入力せよ",
        "mem_corrupt": "メモリ破損",
        "mem_success": "メモリ抽出成功",
        
        "stage3_title": "ステージ 3: 論理PIN",
        "stage3_desc": "3桁のPINを解読せよ。(1～6の数字を使用)",
        "btn_crack": "クラック",
        "pin_accept": "PIN承認",
        "pin_fail": "アクセス拒否",
        "pin_len_err": "PINは3桁である必要があります",
        
        "stage4_title": "ステージ 4: 暗号解読",
        "stage4_desc": "シーザー暗号化されたペイロードを解読せよ。",
        "btn_decrypt": "解読",
        "dec_success": "ペイロード解読完了",
        "dec_fail": "解読失敗",
        
        "stage5_title": "ステージ 5: ノードルーティング",
        "stage5_desc": "ノードを回転させてSからEまで繋げ。",
        "route_success": "ルーティング確立",
        
        "stage6_title": "ステージ 6: マシンコードインジェクション",
        "stage6_desc": "2進数/16進数を10進数に変換してポートを見つけよ。",
        "btn_connect": "接続",
        "port_connect": "ポート接続済み",
        "port_fail": "接続拒否",
        
        "stage7_title": "ステージ 7: IDSバイパス",
        "stage7_desc": "連立方程式を解いてシステム変数を合わせよ。",
        "btn_bypass": "バイパス",
        "ids_bypass": "IDSバイパス完了",
        "ids_fail": "IDS警告: 不一致",
        
        "stage8_title": "ステージ 8: 管理者ハッシュ",
        "stage8_desc": "ヴィジュネル暗号を解読せよ。ヒント: P_i = (C_i - K_i) mod 26",
        "hash_success": "管理者ハッシュクラック完了",
        "hash_fail": "無効なハッシュ",
        
        "stage9_title": "ステージ 9: ハードウェアオーバーライド",
        "stage9_desc": "入力を切り替えて最終出力を1にせよ。",
        "btn_exec": "実行",
        "hw_success": "ハードウェア制御成功",
        "hw_fail": "電力サージ検出",
        
        "stage10_title": "ステージ 10: メインフレーム",
        "stage10_desc": "アセンブリ命令でレジスタAXを42にせよ。",
        "btn_compile": "コンパイル & 実行",
        "asm_success": "ルート権限取得成功",
        "asm_fail": "セグメンテーション違反",
        
        "syntax_err": "構文エラー 行",
        "btn_hint": "ヒントをリクエスト",
        "hint_1": "ヒント: 数字がどのように増えるか観察してください。2倍ですか？",
        "hint_2": "ヒント: 一度に1つずつ集中してください。指で追うのも効果的です。",
        "hint_3": "ヒント: Matchesは場所も数字も正解。Presentは数字は正解だが場所が違う。",
        "hint_4": "ヒント: SHIFT -2はCがAになるという意味です。アルファベットを書いてみましょう。",
        "hint_5": "ヒント: SからEまで線が途切れないようにタイルを回転させてください。",
        "hint_6": "ヒント: 2進数(BIN)101=5。16進数(HEX)A=10, B=11, C=12, D=13, E=14, F=15。",
        "hint_7": "ヒント: すべての方程式を足すと 2(X+Y+Z) = A+B+C になります。これで解けます。",
        "hint_8": "ヒント: A=0, B=1...として [暗号 - キー = 平文] を計算します。マイナスの場合は26を足します。",
        "hint_9": "ヒント: ANDは両方が1の時だけ1、XORは異なる時だけ1を出力します。",
        "hint_10": "ヒント: 0から始めて3つの命令だけでピッタリ42にしてください。"
    }
};

let currentLang = 'en';

function t(key) {
    return translations[currentLang][key] || key;
}

function updateLang() {
    // Top bar
    document.getElementById('sys-status-label').textContent = t('sys_status');
    // If not in a specific state, we might need to reset it or just leave it. 
    // State text is handled by UI.statusText but we can do a quick check
    const statusEl = document.getElementById('status-text');
    if (statusEl.textContent === translations.en.status_secure || statusEl.textContent === translations.ko.status_secure || statusEl.textContent === translations.ja.status_secure) statusEl.textContent = t('status_secure');
    else if (statusEl.textContent === translations.en.status_lockdown || statusEl.textContent === translations.ko.status_lockdown || statusEl.textContent === translations.ja.status_lockdown) statusEl.textContent = t('status_lockdown');
    else if (statusEl.textContent === translations.en.status_compromised || statusEl.textContent === translations.ko.status_compromised || statusEl.textContent === translations.ja.status_compromised) statusEl.textContent = t('status_compromised');
    else statusEl.textContent = t('status_intrusion');
    
    document.getElementById('time-rem-label').textContent = t('time_rem');
    document.getElementById('stage-label').textContent = t('stage');
    
    // Start Screen
    document.getElementById('start-title').textContent = t('start_title');
    document.getElementById('start-init').textContent = t('start_init');
    document.getElementById('start-obj').textContent = t('start_obj');
    document.getElementById('start-time').textContent = t('start_time');
    document.getElementById('start-btn').textContent = t('btn_start');

    // Fail Screen
    document.getElementById('fail-title').textContent = t('fail_title');
    document.getElementById('fail-desc').textContent = t('fail_desc');
    document.getElementById('restart-btn').textContent = t('btn_retry');

    // Win Screen
    document.getElementById('win-title').textContent = t('win_title');
    document.getElementById('win-desc1').textContent = t('win_desc1');
    document.getElementById('win-desc2').textContent = t('win_desc2');
    document.getElementById('play-again-btn').textContent = t('btn_new');
    
    // Hint button
    if (UI && UI.hintBtn) {
        UI.hintBtn.textContent = `[ ${t('btn_hint')} ]`;
    }
    
    // Re-render current puzzle text if active
    if (typeof currentStage !== 'undefined' && document.getElementById('gameplay-screen').classList.contains('active')) {
        UI.puzzleTitle.textContent = t(`stage${currentStage}_title`);
        UI.puzzleDesc.textContent = t(`stage${currentStage}_desc`);
        // If hint is visible, update its text too
        if (UI.hintText.style.display === 'block') {
            UI.hintText.textContent = t(`hint_${currentStage}`);
        }
        
        // Re-run stage init to re-render buttons. 
        // A full re-render is easiest way to update dynamic text like buttons inside puzzles.
        loadStage(currentStage);
    }
}
