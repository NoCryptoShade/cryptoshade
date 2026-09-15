# CyberLab

🔗 **Live site:** https://cybersikkerhet-gokstad.github.io/CyberLab/

## About

CyberLab is a free learning platform for cybersecurity, built for the vocational programme
at Gokstad Akademiet and open to anyone. The idea is simple: security concepts stick when you
work them out yourself rather than read about them.

Every task follows the same shape. A **fact** stated plainly, a **worked example** showing the
rule used once, the **commands or payload** you need, then **questions about a different case**.
Answers go in a box and turn green when they are right, so you always know where you stand.
Nothing you are asked can be found by scrolling back up, because a task you can answer by
re-reading the paragraph teaches nothing.

Hints and worked solutions sit behind buttons on every task. Using them costs nothing.

Progress is saved in your own browser. No accounts, no subscriptions, nothing to sign up for.

## How it is organised

The labs are grouped by the lesson they belong to, not by tool:

| Page | What it is |
|------|------------|
| [Emne 1](emne1.html) | 26 lessons over 13 weeks. Foundations, networking, Linux, scripting |
| [Emne 3](emne3.html) | 26 lessons over 15 weeks. Recon, exploitation, detection, response |
| [Labber](labber.html) | All labs in one list, for browsing by topic |
| [Self check](https://tk1104.timoamling.com/) | TK1104 lecture script and quizzes by Timo Amling. External, and a supplement rather than pensum |

## The labs

**20 labs · 147 tasks · 369 answer fields**

### Emne 1 — foundations

| Lab | Topic | Lesson | Tasks |
|-----|-------|--------|-------|
| 13 | Hva et nettverk er — packets, MAC vs IP, switch/router/firewall, ARP | L05 | 6 |
| 14 | Adressering, subnetting, DHCP og DNS — masks, host counts, blocks, fault-finding | L06 | 8 |
| 11 | Porter, tjenester og eksponering — ports, listening vs established, 127.0.0.1 vs 0.0.0.0 | L07 | 6 |
| 15 | Switching, VLAN og segmentering — MAC tables, broadcast domains, ARP spoofing, zones | L08 | 5 |
| 16 | Trådløse nettverk — WEP/WPA2/WPA3, Evil Twin, Rogue AP | L10 | 4 |
| 9 | Linux: filer, søk og rettigheter — paths, grep, find, permissions | L11–L14 | 6 |

### Emne 3 — advanced

| Lab | Topic | Lesson | Tasks |
|-----|-------|--------|-------|
| 10 | Rekognosering og skanning — passive vs active, port states, proved vs guessed, CVSS/EPSS/KEV | L02–L04 | 6 |
| 7 | HTTP, sesjoner og API-er — status codes, cookies, sessions, JWT. Two flags | L05 | 16 |
| 12 | Injeksjon: SQL og kommando — context, UNION, metadata, blind, DVWA, sqlmap, prevention | L07 | 16 |
| 17 | XSS og svikt i tilgangskontroll — reflected and stored XSS, the four contexts, output encoding, CSP, IDOR, horizontal vs vertical escalation | L08 | 12 |
| 19 | Autentiseringssvakheter — weak passwords, reset flow, user enumeration, MFA fatigue, session timeout, shared accounts, Hydra | L09 | 7 |
| 20 | Passordangrep og forsvar — brute force vs spraying vs stuffing, hash speed, salting, cracking, detection signatures | L10 | 7 |
| 18 | The Board — seventeen routes into one Metasploitable host, in three tiers: no exploit, Metasploit, by hand. Three hints per route | L11–L12 | 17 routes |

Lab 11 is also linked from Emne 3 as revision, since ports and exposure underpin the recon work.

### Browser-simulated labs

These run entirely in the browser with a simulated terminal and target site:

| Topic | Tasks |
|-------|-------|
| Nettverkskommandoer — ping, ipconfig, nslookup, netstat, ssh, traceroute | 6 |
| Kryptografi — symmetric/asymmetric, hashing, salt, TLS | 6 |
| XSS & nettsikkerhet — reflected, stored, DOM-based, CSP | 7 |
| IDS, IPS & forsvar i dybden — Snort, SIEM, alert fatigue | 6 |
| E-post & protokoller — SMTP, IMAP, SPF, DKIM, DMARC | 5 |
| Kali Linux & penetrasjonstesting — nmap, Gobuster, Hydra, John, Netcat + CTF | 7 |
| Web-sårbarheter — HTML/CSS, CIA, SQL injection, XSS, CSP builder | 11 |

## What you need

**Most labs need nothing but a browser.** Sixteen of the twenty run without installing anything.

**Four labs run against a real target**, and say so at the top of the page:

- **HTTP, sesjoner og API-er** needs `lab5.py`, which lives in this repo and is served from the
  site itself:

  ```
  curl -O https://cybersikkerhet-gokstad.github.io/CyberLab/lab5.py
  python3 lab5.py
  ```

  Standard library only, binds to `127.0.0.1`, nothing to install. Ctrl-C stops it and restarting
  resets all state.
- **Injeksjon** uses DVWA on **Metasploitable 2**, on host-only networking.
- **XSS og svikt i tilgangskontroll** uses the same DVWA instance.
- **The Board** works the whole Metasploitable host, and is the one that most needs host-only checked twice.

Metasploitable is deliberately full of holes and must never sit on a network with other
machines. Both VMs on host-only, checked before you start.

## For contributors

```
css/style.css        design tokens and shared components
css/lab-shared.css   lab cards, reading flow, theory blocks, answer fields, multiple choice
js/cyberlab.js       accordions, hints, progress, answer checking
modules/*.html       one file per lab
lab5.py              target server for the HTTP lab, served straight from Pages
emne1.html           lesson overview, Emne 1
emne3.html           lesson overview, Emne 3
```

Two card layouts exist. Labs with a simulated terminal use `lab-split`, a two-column grid with
the terminal on the right. Everything else uses `lab-flow`, a single reading column where the
commands sit inline directly above the questions they belong to, so nobody has to scroll back
up to see what they were meant to type.

Answer fields are markup, no JavaScript needed per lab:

```html
<div class="ans-row" data-a="193433079">
  <span class="ans-q">Hvilken statuskode kom tilbake?</span>
  <input class="ans-in" placeholder="tre siffer"><span class="ans-mark"></span>
</div>
```

`data-a` holds one or more accepted answers as hashes, comma separated, so several phrasings
can be correct. Generate them in the browser console with `clHash('200')`. A card is marked
complete when every answer field in it is right, which feeds the progress bar automatically.

Command blocks are labelled by what they contain rather than all being called "Kjør dette":
**Kjør dette** for shell commands, **Prøv dette** for payloads typed into a form field,
**Regnemåte** for formulas, **Til hjelp** for reference and navigation.

Two constraints worth knowing. Keep filenames ASCII, because `å` becomes `%C3%A5` in a URL and
breaks when a zip is unpacked on Windows. And `.lab-card` must use `overflow:clip` rather than
`overflow:hidden`, because `hidden` creates a scroll container and silently stops the sticky
terminal panel from working.

## Licence and credits

Free and open source. Built for Gokstad Akademiet.

The TK1104 lecture script and quizzes linked under Self check are written by
**Timo Amling** and hosted on his own site.

Built by Linarte Andersen using Claude.
