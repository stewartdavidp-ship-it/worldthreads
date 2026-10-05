(function(){
            var d = document.documentElement;
            var btn = document.getElementById('dispBtn'), panel = document.getElementById('dispPanel');
            if (!btn || !panel) return;

            // ---- Theme (Auto / Light / Dark) ----
            var THEME_KEY = 'worldthreads-theme';
            var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
            var themeBtns = Array.prototype.slice.call(panel.querySelectorAll('[data-theme-choice]'));
            function currentTheme(){ try { var t = localStorage.getItem(THEME_KEY); return (t === 'light' || t === 'dark' || t === 'auto') ? t : 'auto'; } catch (e) { return 'auto'; } }
            function resolved(mode){ if (mode === 'dark') return 'dark'; if (mode === 'light') return 'light'; return (mq && mq.matches) ? 'dark' : 'light'; }
            function applyTheme(mode, save){
                selectedTheme = mode;
                d.setAttribute('data-theme', resolved(mode));
                themeBtns.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-theme-choice') === mode ? 'true' : 'false'); });
                if (save) { try { localStorage.setItem(THEME_KEY, mode); } catch (e) {} }
            }
            var selectedTheme = currentTheme();
            applyTheme(selectedTheme, false);
            themeBtns.forEach(function(b){ b.addEventListener('click', function(){ applyTheme(b.getAttribute('data-theme-choice'), true); }); });
            if (mq && mq.addEventListener) mq.addEventListener('change', function(){ if (selectedTheme === 'auto') applyTheme('auto', false); });

            // ---- Text size ----
            var SIZE_KEY = 'worldthreads-text-size';
            var SIZE_MAP = { normal: '100%', large: '112.5%', xl: '125%', xxl: '140%' };
            var sizeBtns = Array.prototype.slice.call(panel.querySelectorAll('[data-size]'));
            function currentSize(){ try { var s = localStorage.getItem(SIZE_KEY); return SIZE_MAP[s] ? s : 'normal'; } catch (e) { return 'normal'; } }
            function applySize(size, save){
                d.style.fontSize = SIZE_MAP[size] || '100%';
                sizeBtns.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-size') === size ? 'true' : 'false'); });
                if (save) { try { localStorage.setItem(SIZE_KEY, size); } catch (e) {} }
            }
            applySize(currentSize(), false);
            sizeBtns.forEach(function(b){ b.addEventListener('click', function(){ applySize(b.getAttribute('data-size'), true); }); });

            // ---- Panel open/close ----
            function setOpen(o){ panel.classList.toggle('open', o); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); }
            btn.addEventListener('click', function(e){ e.stopPropagation(); setOpen(!panel.classList.contains('open')); });
            document.addEventListener('click', function(e){ if (panel.classList.contains('open') && !panel.contains(e.target) && !btn.contains(e.target)) setOpen(false); });
            document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && panel.classList.contains('open')) { setOpen(false); btn.focus(); } });
        })();
