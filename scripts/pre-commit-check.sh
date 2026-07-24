#!/bin/bash
# =============================================================================
# Pre-commit security check — cegah kebocoran data sensitif ke GitHub
# =============================================================================
# Cara pakai:
#   1. Install sebagai git hook:
#      cp scripts/pre-commit-check.sh .git/hooks/pre-commit
#      chmod +x .git/hooks/pre-commit
#
#   2. Atau set hooksPath (rekomendasi):
#      git config core.hooksPath scripts/
#
#   3. Atau jalankan manual sebelum commit:
#      bash scripts/pre-commit-check.sh
#
# Script ini akan memindai file yang akan di-commit dan menolak commit
# jika ditemukan pola yang mencurigakan (password, secret, API key, dll).
# =============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Pola-pola yang dicurigai sebagai data sensitif
SUSPICIOUS_PATTERNS=(
  'password\s*[:=]+\s*["'"'"'][^"'"'"']+["'"'"']'
  'secret\s*[:=]+\s*["'"'"'][^"'"'"']+["'"'"']'
  'api[_-]key\s*[:=]+\s*["'"'"'][^"'"'"']+["'"'"']'
  'api[_-]secret\s*[:=]+\s*["'"'"'][^"'"'"']+["'"'"']'
  'JWT_SECRET\s*[:=]+\s*["'"'"'][^"'"'"']+["'"'"']'
  'DATABASE_URL\s*[:=]+\s*["'"'"']postgresql://[^"'"'"']+["'"'"']'
  '\.env\b'
)

# Ekstensi file yang diizinkan untuk mengandung .env (hanya .env.example)
ALLOWED_ENV_FILES=('.env.example')

echo -e "${YELLOW}[SECURITY CHECK] Memindai file yang akan di-commit...${NC}"

# Ambil daftar file yang akan di-commit
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
  echo -e "${GREEN}[SECURITY CHECK] Tidak ada file yang akan di-commit.${NC}"
  exit 0
fi

VIOLATIONS=0

for FILE in $STAGED_FILES; do
  # Skip file yang diizinkan mengandung .env
  if [[ " ${ALLOWED_ENV_FILES[@]} " =~ " ${FILE} " ]]; then
    continue
  fi

  # Skip binary files
  if [[ "$FILE" == *.png || "$FILE" == *.jpg || "$FILE" == *.jpeg || "$FILE" == *.gif || "$FILE" == *.svg || "$FILE" == *.ico || "$FILE" == *.woff* || "$FILE" == *.eot || "$FILE" == *.ttf ]]; then
    continue
  fi

  # Cek apakah file mengandung kata .env di namanya
  BASENAME=$(basename "$FILE")
  if [[ "$BASENAME" == .env* ]] && [[ "$BASENAME" != ".env.example" ]]; then
    echo -e "${RED}  ❌ TERDETEKSI: File environment '$FILE' akan di-commit! ${NC}"
    VIOLATIONS=$((VIOLATIONS + 1))
    continue
  fi

  # Cek konten file untuk pola mencurigakan
  if [ -f "$FILE" ]; then
    for PATTERN in "${SUSPICIOUS_PATTERNS[@]}"; do
      MATCHES=$(git diff --cached -U0 "$FILE" 2>/dev/null | grep -n -i -E "$PATTERN" | head -5)
      if [ -n "$MATCHES" ]; then
        echo -e "${YELLOW}  ⚠️  Potensi data sensitif di '$FILE':${NC}"
        echo "$MATCHES" | while read -r LINE; do
          echo -e "${RED}      $LINE${NC}"
        done
        VIOLATIONS=$((VIOLATIONS + 1))
      fi
    done
  fi
done

if [ $VIOLATIONS -gt 0 ]; then
  echo ""
  echo -e "${RED}====================================================================${NC}"
  echo -e "${RED}  ❌ COMMIT DITOLAK: Ditemukan $VIOLATIONS indikasi data sensitif!${NC}"
  echo -e "${RED}  🔍 Periksa file-file di atas dan hapus data sensitif sebelum commit.${NC}"
  echo -e "${RED}  💡 Gunakan .env.example sebagai template, simpan nilai asli di .env.local${NC}"
  echo -e "${RED}====================================================================${NC}"
  exit 1
else
  echo -e "${GREEN}[SECURITY CHECK] ✅ Tidak ditemukan data sensitif. Commit aman.${NC}"
fi
